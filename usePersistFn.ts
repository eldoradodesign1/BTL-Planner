/**
 * Direction visuelle : Aquarelle de contrôle — l’authentification reste calme, lisible et
 * orientée vers la prochaine action, avec le même cyan de repérage que le workspace.
 */
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type AuthMode = "signin" | "signup" | "recovery";
type PendingAction = AuthMode | null;
const logoUrl = `${import.meta.env.BASE_URL}assets/me-planner-monochrome.png`;

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [session, setSession] = useState<Awaited<ReturnType<NonNullable<typeof supabase>["auth"]["getSession"]>>["data"]["session"]>(null);
  const ensureProfile = async () => { const client = supabase; if (!client) return; const { error } = await client.rpc("claim_initial_admin"); if (error && !error.message.includes("claim_initial_admin")) console.warn("ME Planner: profil à vérifier après connexion.", error.message); };
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let mounted = true;
    client.auth.getSession().then(({ data }) => { if (mounted) { setSession(data.session); setLoading(false); if (data.session) void ensureProfile(); } }).catch(() => { if (mounted) setLoading(false); });
    const { data } = client.auth.onAuthStateChange((event, nextSession) => { setSession(nextSession); if (event === "SIGNED_IN" && nextSession) void ensureProfile(); });
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, []);
  if (!isSupabaseConfigured) return <>{children}</>;
  if (loading) return <div className="auth-loading" aria-busy="true"><div className="brand-symbol brand-logo" style={{ "--logo-image": `url("${logoUrl}")` } as React.CSSProperties} role="img" aria-label="Mon Essentiel" /><span>Ouverture de votre espace ME…</span></div>;
  return session ? <>{children}</> : <AuthScreen />;
}

function friendlyAuthError(message: string) {
  if (/database error saving new user/i.test(message)) return "Le profil Supabase n’a pas pu être initialisé. Exécutez supabase/fix_first_account.sql dans l’éditeur SQL, puis réessayez.";
  if (/already registered|already been registered/i.test(message)) return "Cette adresse possède déjà un accès. Connectez-vous ou utilisez la récupération du mot de passe.";
  if (/invalid login credentials/i.test(message)) return "Email ou mot de passe incorrect.";
  if (/password should be at least/i.test(message)) return "Le mot de passe doit respecter la longueur minimale définie dans Supabase.";
  if (/rate limit|too many requests/i.test(message)) return "Trop de tentatives rapprochées. Patientez quelques instants puis réessayez.";
  return message;
}

function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("signin"); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [name, setName] = useState(""); const [showPassword, setShowPassword] = useState(false); const [pending, setPending] = useState<PendingAction>(null); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  const switchMode = (nextMode: AuthMode) => { setMode(nextMode); setMessage(""); setError(""); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); const client = supabase; if (!client || pending) return; setPending(mode); setMessage(""); setError("");
    try {
      if (mode === "signin") {
        const result = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (result.error) throw result.error;
        setMessage("Connexion réussie. Votre espace se prépare…");
      } else if (mode === "signup") {
        const result = await client.auth.signUp({ email: email.trim(), password, options: { data: { full_name: name.trim() || "Membre ME" } } });
        if (result.error) throw result.error;
        if (result.data.session) setMessage("Votre espace est prêt. Ouverture en cours…");
        else setMessage("Compte créé. Consultez votre boîte mail pour confirmer l’adresse avant de vous connecter.");
      } else {
        const result = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}` });
        if (result.error) throw result.error;
        setMessage("Un lien de récupération vient d’être envoyé si cette adresse existe.");
      }
    } catch (caught) { setError(friendlyAuthError(caught instanceof Error ? caught.message : "Une erreur est survenue. Réessayez.")); } finally { setPending(null); }
  };
  const isSignup = mode === "signup";
  return <div className="auth-screen"><div className="auth-ambient auth-ambient-one" /><div className="auth-ambient auth-ambient-two" /><div className="auth-layout"><section className="auth-intro"><div className="auth-brand"><div className="brand-symbol brand-logo" style={{ "--logo-image": `url("${logoUrl}")` } as React.CSSProperties} role="img" aria-label="Mon Essentiel" /><span>ME<span>.</span></span></div><div className="auth-copy"><span className="eyebrow">Votre espace de travail</span><h1>Reprenez la main sur les prochaines heures.</h1><p>Un planning partagé, une équipe alignée et les bonnes décisions au bon moment.</p></div><div className="auth-promise"><Sparkles size={15} /><span>Un cockpit calme pour les journées qui avancent.</span></div></section><motion.section className="auth-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><div className="auth-card-heading"><span className="eyebrow">{isSignup ? "Créer un accès" : mode === "recovery" ? "Retrouver son accès" : "Ravi de vous revoir"}</span><h2>{isSignup ? "Rejoindre ME Planner" : mode === "recovery" ? "Réinitialiser le mot de passe" : "Se connecter"}</h2><p>{mode === "recovery" ? "Recevez un lien sécurisé par email." : isSignup ? "Votre premier compte devient l’administrateur initial." : "Continuez là où votre équipe vous attend."}</p></div><form onSubmit={submit}>{isSignup && <label className="auth-field"><span>Nom complet</span><div><Sparkles size={15} /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Eldo" autoComplete="name" required /></div></label>}<label className="auth-field"><span>Email professionnel</span><div><Mail size={15} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@entreprise.com" autoComplete="email" required /></div></label>{mode !== "recovery" && <label className="auth-field"><span>Mot de passe</span><div><LockKeyhole size={15} /><input type={showPassword ? "text" : "password"} minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" autoComplete={isSignup ? "new-password" : "current-password"} required /><button type="button" className="auth-eye" onClick={() => setShowPassword(!showPassword)} aria-label="Afficher le mot de passe">{showPassword ? <EyeOff size={15} /> : <Eye size={15} />}</button></div></label>}{mode === "signin" && <button type="button" className="auth-link forgot" onClick={() => switchMode("recovery")}>Mot de passe oublié ?</button>}{error && <div className="auth-feedback error" role="alert">{error}</div>}{message && <div className="auth-feedback success" role="status"><CheckCircle2 size={14} />{message}</div>}<button className="primary-button auth-submit" disabled={Boolean(pending)} aria-busy={Boolean(pending)}>{pending ? <><span className="auth-spinner" aria-hidden="true" />{mode === "signup" ? "Création du compte…" : mode === "recovery" ? "Envoi du lien…" : "Connexion…"}</> : <>{isSignup ? "Créer mon espace" : mode === "recovery" ? "Envoyer le lien" : "Entrer dans l’espace"}<ArrowRight size={16} /></>}</button></form><div className="auth-switch">{mode === "signin" ? <><span>Pas encore de compte ?</span><button className="auth-link" onClick={() => switchMode("signup")}>Créer un accès</button></> : <><span>Vous avez déjà un accès ?</span><button className="auth-link" onClick={() => switchMode("signin")}>Se connecter</button></>}</div>{mode === "recovery" && <button className="auth-back" onClick={() => switchMode("signin")}>← Revenir à la connexion</button>}</motion.section></div></div>;
}
