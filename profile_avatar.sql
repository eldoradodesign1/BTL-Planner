/**
 * Direction visuelle : Aquarelle de contrôle — profil en deux colonnes, verre translucide,
 * cyan de validation et actions courtes pour garder l’espace personnel lisible.
 */
import { useEffect, useRef, useState } from "react";
import { Camera, Check, Loader2, Mail, Save, ShieldCheck, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePlannerStore } from "@/store/usePlannerStore";
import type { ThemeName } from "@/lib/types";
import { CustomSelect } from "@/components/CustomControls";

const avatarBucket = "profile-avatars";

export default function ProfileView() {
  const store = usePlannerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState(store.profile.fullName);
  const [email, setEmail] = useState(store.profile.email);
  const [locale, setLocale] = useState(store.profile.locale || "fr");
  const [avatarUrl, setAvatarUrl] = useState(store.profile.avatarUrl || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!supabase) { setLoading(false); return; }
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) { setLoading(false); return; }
      const { data } = await supabase.from("profiles").select("id,full_name,avatar_url,locale,theme,role").eq("id", user.id).maybeSingle();
      const nextName = data?.full_name || user.user_metadata?.full_name || store.profile.fullName;
      const nextEmail = user.email || store.profile.email;
      setFullName(nextName); setEmail(nextEmail); setLocale(data?.locale || "fr"); setAvatarUrl(data?.avatar_url || "");
      store.setProfile({ id: user.id, fullName: nextName, email: nextEmail, role: data?.role || store.profile.role, avatarUrl: data?.avatar_url || undefined, locale: data?.locale || "fr", theme: (data?.theme as ThemeName | undefined) || store.theme });
      setLoading(false);
    };
    void loadProfile();
  }, []);

  const saveProfile = async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName || !trimmedEmail) { setFeedback({ type: "error", text: "Le nom et l’email sont obligatoires." }); return; }
    setSaving(true); setFeedback(null);
    try {
      if (supabase) {
        const { error: profileError } = await supabase.from("profiles").update({ full_name: trimmedName, avatar_url: avatarUrl || null, locale, theme: store.theme }).eq("id", store.profile.id);
        if (profileError) throw profileError;
        if (trimmedEmail !== store.profile.email) {
          const { error: emailError } = await supabase.auth.updateUser({ email: trimmedEmail });
          if (emailError) throw emailError;
          setFeedback({ type: "success", text: "Profil enregistré. Un email de confirmation a été envoyé pour le changement d’adresse." });
        } else setFeedback({ type: "success", text: "Profil enregistré." });
      } else setFeedback({ type: "success", text: "Profil enregistré dans cette session de démonstration." });
      store.setProfile({ fullName: trimmedName, email: trimmedEmail, avatarUrl: avatarUrl || undefined, locale, theme: store.theme });
    } catch (error) {
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "Impossible d’enregistrer le profil." });
    } finally { setSaving(false); }
  };

  const uploadAvatar = async (file: File) => {
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) { setFeedback({ type: "error", text: "Choisissez une image de 2 Mo maximum." }); return; }
    if (!supabase) { setFeedback({ type: "error", text: "L’upload d’avatar nécessite la connexion Supabase." }); return; }
    setUploading(true); setFeedback(null);
    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "png";
      const path = `${store.profile.id}/avatar.${extension}`;
      const { error } = await supabase.storage.from(avatarBucket).upload(path, file, { upsert: true, contentType: file.type, cacheControl: "3600" });
      if (error) throw error;
      const { data } = supabase.storage.from(avatarBucket).getPublicUrl(path);
      setAvatarUrl(`${data.publicUrl}?v=${Date.now()}`);
      setFeedback({ type: "success", text: "Avatar chargé. Cliquez sur Enregistrer pour le rattacher au profil." });
    } catch (error) {
      setFeedback({ type: "error", text: "Le stockage d’avatar n’est pas encore activé. Exécutez supabase/profile_avatar.sql puis réessayez." });
    } finally { setUploading(false); }
  };

  const initials = fullName.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "ME";
  return <div className="workspace-content profile-page"><div className="view-header"><div><span className="eyebrow">Espace personnel</span><h1>Votre profil, <em>à votre image.</em></h1><p className="hero-subtitle">Modifiez les informations qui accompagnent votre quotidien dans Mon Essentiel.</p></div><button className="primary-button compact" onClick={() => void saveProfile()} disabled={saving || loading}><Save size={15} />{saving ? "Enregistrement…" : "Enregistrer"}</button></div><div className="profile-grid"><section className="glass-panel profile-card profile-identity"><div className="profile-avatar-wrap"><div className="profile-avatar">{avatarUrl ? <img src={avatarUrl} alt={`Avatar de ${fullName}`} /> : <span>{initials}</span>}</div><button className="avatar-upload" onClick={() => fileInputRef.current?.click()} disabled={uploading} aria-label="Modifier l’avatar">{uploading ? <Loader2 className="spin" size={15} /> : <Camera size={15} />}</button><input ref={fileInputRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadAvatar(file); event.target.value = ""; }} /></div><span className="eyebrow">Identité</span><h2>{fullName || "Votre nom"}</h2><p>{email}</p><div className="profile-role"><ShieldCheck size={15} /><span>{store.profile.role === "super_admin" ? "Super Admin" : store.profile.role}</span></div><p className="profile-hint"><Upload size={13} /> JPG, PNG ou WebP · 2 Mo maximum</p></section><section className="glass-panel profile-card"><div className="profile-section-heading"><div><span className="eyebrow">Informations personnelles</span><h2>Les détails qui vous représentent.</h2></div><Mail size={18} /></div>{loading ? <div className="profile-loading"><Loader2 className="spin" size={18} />Chargement du profil…</div> : <div className="profile-form"><label><span>Nom complet</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Votre nom" autoComplete="name" /></label><label><span>Email professionnel</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="vous@entreprise.com" autoComplete="email" /></label><label><span>Langue</span><CustomSelect value={locale} onChange={setLocale} options={[{ value: "fr", label: "Français" }, { value: "en", label: "English" }]} ariaLabel="Langue" /></label><div className="profile-readonly"><span>Rôle attribué</span><strong><ShieldCheck size={14} />{store.profile.role === "super_admin" ? "Super Admin" : store.profile.role}</strong></div></div>}</section></div>{feedback && <div className={`profile-feedback ${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}><Check size={15} />{feedback.text}</div>}</div>;
}
