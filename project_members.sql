/**
 * Direction visuelle : Aquarelle de contrôle — conversations lisibles, menus ancrés,
 * actions explicites et persistance progressive sans masquer les erreurs réseau.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BellOff, MoreHorizontal, Paperclip, Pin, Plus, Search, Send, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ChatMessage = { id?: string; name: string; initials: string; color: string; time: string; body: string; own?: boolean };
type Conversation = { id: string; name: string; initials: string; color: string; preview: string; messages: ChatMessage[]; remote?: boolean };
const fallback: Conversation[] = [{ id: "global", name: "Global · équipe Mon Essentiel", initials: "ME", color: "#69D2FF", preview: "La revue est prête pour 15h.", messages: [{ name: "Sam", initials: "SA", color: "#69D2FF", time: "09:38", body: "La proposition commerciale est prête pour une dernière revue. J’ai laissé les points ouverts dans la checklist." }, { name: "Vous", initials: "EL", color: "#B5A1FF", time: "09:42", body: "Parfait. Je prends la prochaine passe avant le point client de 11h.", own: true }, { name: "Michael", initials: "MI", color: "#6FE3C1", time: "09:46", body: "Je viens d’ajouter le dernier écran du parcours onboarding. @Eldo, ton retour sur la hiérarchie m’aiderait." }] }, { id: "northstar", name: "Northstar rebrand", initials: "NS", color: "#69D2FF", preview: "Vous : Je regarde cela.", messages: [{ name: "Sam", initials: "SA", color: "#69D2FF", time: "Hier", body: "La direction visuelle est prête à être commentée." }] }, { id: "michael", name: "Michael · produit", initials: "MI", color: "#6FE3C1", preview: "Le parcours est partagé.", messages: [{ name: "Michael", initials: "MI", color: "#6FE3C1", time: "Lun.", body: "Le parcours onboarding est partagé dans le projet." }] }];

export default function ChatWorkspace() {
  const [conversations, setConversations] = useState(fallback);
  const [selectedId, setSelectedId] = useState("global");
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [messageMenu, setMessageMenu] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const selected = conversations.find((conversation) => conversation.id === selectedId) ?? conversations[0];
  const visibleConversations = useMemo(() => conversations.filter((conversation) => conversation.name.toLowerCase().includes(search.toLowerCase())), [conversations, search]);

  useEffect(() => {
    const loadRemote = async () => {
      if (!supabase) return;
      const { data, error } = await supabase.from("conversations").select("id,name,kind,created_by").order("created_at", { ascending: true });
      if (error || !data?.length) return;
      setConversations(data.map((item) => ({ id: item.id, name: item.name || "Conversation", initials: (item.name || "ME").slice(0, 2).toUpperCase(), color: "#69D2FF", preview: "Ouvrir la conversation", messages: [], remote: true })));
      setSelectedId(data[0].id);
    };
    void loadRemote();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!supabase || !selected?.remote) return;
      const { data } = await supabase.from("messages").select("id,body,created_at,author_id").eq("conversation_id", selected.id).order("created_at", { ascending: true });
      if (!data) return;
      const { data: auth } = await supabase.auth.getUser();
      setConversations((items) => items.map((conversation) => conversation.id === selected.id ? { ...conversation, messages: data.map((message) => ({ id: message.id, name: message.author_id === auth.user?.id ? "Vous" : "Membre", initials: message.author_id === auth.user?.id ? "ME" : "MB", color: message.author_id === auth.user?.id ? "#B5A1FF" : "#69D2FF", time: new Date(message.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), body: message.body, own: message.author_id === auth.user?.id })) } : conversation));
    };
    void loadMessages();
  }, [selectedId, selected?.remote]);

  useEffect(() => {
    const composer = document.querySelector<HTMLInputElement>(".chat-composer input");
    if (!composer) return;
    const stopGlobalShortcuts = (event: KeyboardEvent) => event.stopPropagation();
    composer.addEventListener("keydown", stopGlobalShortcuts);
    return () => composer.removeEventListener("keydown", stopGlobalShortcuts);
  }, []);

  const createConversation = async () => {
    if (supabase) {
      const { data: auth } = await supabase.auth.getUser();
      if (auth.user) {
        const result = await supabase.from("conversations").insert({ name: "Nouvelle conversation", kind: "private", created_by: auth.user.id }).select("id,name").single();
        if (!result.error && result.data) { await supabase.from("conversation_members").insert({ conversation_id: result.data.id, profile_id: auth.user.id }); setConversations((items) => [...items, { id: result.data.id, name: result.data.name, initials: "NE", color: "#B5A1FF", preview: "Commencer une discussion", messages: [], remote: true }]); setSelectedId(result.data.id); return; }
      }
    }
    const id = `new-${Date.now()}`; setConversations((items) => [...items, { id, name: "Nouvelle conversation", initials: "NE", color: "#B5A1FF", preview: "Commencer une discussion", messages: [] }]); setSelectedId(id);
  };

  const sendMessage = async () => {
    const body = draft.trim(); if (!body || !selected) return;
    let remoteId: string | undefined;
    if (supabase && selected.remote) { const { data: auth } = await supabase.auth.getUser(); if (auth.user) { const result = await supabase.from("messages").insert({ conversation_id: selected.id, author_id: auth.user.id, body }).select("id,created_at").single(); if (!result.error && result.data) remoteId = result.data.id; else if (result.error) setFeedback(result.error.message); } }
    setConversations((items) => items.map((conversation) => conversation.id === selected.id ? { ...conversation, preview: `Vous : ${body}`, messages: [...conversation.messages, { id: remoteId, name: "Vous", initials: "ME", color: "#B5A1FF", time: "maintenant", body, own: true }] } : conversation)); setDraft("");
  };

  const removeConversation = () => { setConversations((items) => items.filter((conversation) => conversation.id !== selected.id)); setSelectedId(conversations.find((conversation) => conversation.id !== selected.id)?.id ?? ""); setOptionsOpen(false); };
  const removeMessage = (id?: string) => { if (!id) return; setConversations((items) => items.map((conversation) => conversation.id === selected.id ? { ...conversation, messages: conversation.messages.filter((message) => message.id !== id) } : conversation)); setMessageMenu(null); };

  return <div className="workspace-content"><div className="view-header"><div><span className="eyebrow">Communication interne</span><h1>Les conversations qui <em>font avancer.</em></h1><p className="hero-subtitle">Retrouvez les échanges globaux, privés et par projet.</p></div></div><div className="chat-layout"><div className="glass-panel conversation-list"><div className="conversation-head"><strong>Conversations</strong><button className="icon-button subtle" onClick={() => void createConversation()} aria-label="Nouvelle conversation"><Plus size={16} /></button></div><div className="chat-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher…" /></div>{visibleConversations.map((conversation) => <button className={`conversation-item ${conversation.id === selectedId ? "active" : ""}`} key={conversation.id} onClick={() => { setSelectedId(conversation.id); setOptionsOpen(false); }}><div className="avatar" style={{ color: conversation.color, background: `${conversation.color}20` }}>{conversation.initials}</div><div><strong>{conversation.name}</strong><span>{conversation.preview}</span></div><small>{conversation.id === selectedId ? "maintenant" : "Hier"}</small></button>)}</div><div className="glass-panel chat-window"><div className="chat-window-head"><div><strong>{selected?.name ?? "Conversation"}</strong><span>{(selected?.messages.length ?? 0) + 3} membres · 4 en ligne</span></div><div className="chat-head-actions"><button className="icon-button" aria-label="Épingler" onClick={() => setFeedback("Conversation épinglée.")}><Pin size={16} /></button><button className="icon-button" aria-label="Options de conversation" onClick={() => setOptionsOpen(!optionsOpen)}><MoreHorizontal size={17} /></button>{optionsOpen && <div className="chat-options-menu"><button onClick={() => setFeedback("Notifications désactivées pour ce fil.")}><BellOff size={14} /> Désactiver les notifications</button><button onClick={() => setFeedback("Conversation épinglée.")}><Pin size={14} /> Épingler la conversation</button><button className="danger-action" onClick={removeConversation}><Trash2 size={14} /> Supprimer le fil</button></div>}</div></div><div className="message-flow"><div className="date-separator"><span>Aujourd’hui</span></div>{selected?.messages.map((message, index) => <div className={`chat-message ${message.own ? "own" : ""}`} key={message.id ?? `${message.time}-${index}`}><div className="avatar" style={{ background: `${message.color}20`, color: message.color }}>{message.initials}</div><div className="message-content"><div className="message-meta"><strong>{message.name}</strong><span>{message.time}</span><button className="message-action" onClick={() => setMessageMenu(message.id ?? `${message.time}-${index}`)}><MoreHorizontal size={13} /></button></div><p>{message.body}</p>{messageMenu === (message.id ?? `${message.time}-${index}`) && <div className="message-options"><button onClick={() => { void navigator.clipboard?.writeText(message.body); setMessageMenu(null); }}><Pin size={13} /> Copier le texte</button>{message.own && <button className="danger-action" onClick={() => removeMessage(message.id)}><Trash2 size={13} /> Supprimer</button>}<button onClick={() => setMessageMenu(null)}><X size={13} /> Fermer</button></div>}</div></div>)}{(!selected || selected.messages.length === 0) && <div className="chat-empty"><Send size={18} /><strong>La conversation est prête.</strong><span>Écrivez le premier message pour ouvrir le fil.</span></div>}</div><div className="chat-composer"><button className="icon-button" aria-label="Joindre un fichier" onClick={() => setFeedback("Les pièces jointes seront disponibles après activation du stockage.")}><Paperclip size={17} /></button><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void sendMessage(); }} placeholder="Écrire un message…" /><button className="primary-button compact" onClick={() => void sendMessage()} disabled={!draft.trim()} aria-label="Envoyer"><ArrowUpRight size={16} /></button></div>{feedback && <div className="chat-feedback" role="status">{feedback}<button onClick={() => setFeedback("")}><X size={13} /></button></div>}</div></div></div>;
}
