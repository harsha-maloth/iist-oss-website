import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../data/client";
import { useAuth } from "../data/auth";
import type { Project } from "../data/types";
import { EDITOR } from "../text/pages";
import { STATUS_LABEL } from "../text/site";
import { toList } from "../utils";
import { Field, Msg } from "./form";

interface Props { backTo: string; backLabel: string; afterDelete: string }

/** One edit form for admins (in the admin panel) and for maintainers (in My projects). */
export function ProjectEditor({ backTo, backLabel, afterDelete }: Props) {
  const { slug } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [p, setP] = useState<Project | null>(null);
  const [langs, setLangs] = useState("");
  const [notes, setNotes] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await db.from("projects").select("*").eq("slug", slug).maybeSingle();
      if (!data) return setMsg(EDITOR.notFound);
      const project = data as unknown as Project;
      setP(project);
      setLangs(project.languages.join(", "));
      const n = await db.from("project_notes").select("hosting_notes").eq("project_id", project.id).maybeSingle();
      setNotes(n.data?.hosting_notes ?? "");
    })();
  }, [slug]);

  if (!p) return <><p><Link to={backTo}>&larr; {backLabel}</Link></p><p className="msg">{msg || EDITOR.loading}</p></>;

  const set = <K extends keyof Project>(k: K, v: Project[K]) => setP({ ...p, [k]: v });

  const save = async () => {
    setMsg(EDITOR.saving);
    const u = await db.from("projects").update({
      name: p.name, description: p.description, repo_url: p.repo_url || null, live_url: p.live_url || null,
      status: p.status, is_public: p.is_public, languages: toList(langs), updated_at: new Date().toISOString(),
    }).eq("id", p.id).select().maybeSingle();
    if (u.error || !u.data) return setMsg(EDITOR.saveFailed);
    const n = await db.from("project_notes").upsert({ project_id: p.id, hosting_notes: notes });
    setMsg(n.error ? EDITOR.notesFailed : EDITOR.saved);
  };

  const remove = async () => {
    if (!window.confirm(EDITOR.deleteConfirm(p.name))) return;
    const { error } = await db.from("projects").delete().eq("id", p.id);
    if (error) setMsg(EDITOR.deleteFailed); else navigate(afterDelete);
  };

  return (
    <>
      <p><Link to={backTo}>&larr; {backLabel}</Link></p>
      <h2>{EDITOR.heading(p.name)}</h2>
      <Field label={EDITOR.name}><input value={p.name} onChange={e => set("name", e.target.value)} /></Field>
      <Field label={EDITOR.description}><textarea rows={3} value={p.description} onChange={e => set("description", e.target.value)} /></Field>
      <Field label={EDITOR.repo}><input value={p.repo_url ?? ""} onChange={e => set("repo_url", e.target.value)} /></Field>
      <Field label={EDITOR.live}><input value={p.live_url ?? ""} onChange={e => set("live_url", e.target.value)} /></Field>
      <Field label={EDITOR.languages}><input value={langs} onChange={e => setLangs(e.target.value)} /></Field>
      <Field label={EDITOR.status}>
        <select className="full" value={p.status} onChange={e => set("status", e.target.value as Project["status"])}>
          {(Object.keys(STATUS_LABEL) as Project["status"][]).map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
        </select>
      </Field>
      <label className="check"><input type="checkbox" checked={p.is_public} onChange={e => set("is_public", e.target.checked)} /> {EDITOR.isPublic}</label>
      <Field label={EDITOR.notes}>
        <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} />
      </Field>
      <p className="note">{EDITOR.notesHelp}</p>
      <div className="btns" style={{ marginTop: "1rem" }}>
        <button className="btn primary" onClick={save}>{EDITOR.save}</button>
      </div>
      <Msg>{msg}</Msg>
      {isAdmin && <Maintainers projectId={p.id} />}
      {isAdmin && (
        <div className="danger-zone">
          <h3>{EDITOR.danger}</h3>
          <button className="btn danger" onClick={remove}>{EDITOR.deleteButton}</button>
        </div>
      )}
    </>
  );
}

interface MaintainerRow { user_id: string; profiles: { username: string | null } | null }

function Maintainers({ projectId }: { projectId: string }) {
  const [rows, setRows] = useState<MaintainerRow[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data } = await db.from("project_maintainers").select("user_id, profiles(username)").eq("project_id", projectId);
    setRows((data as unknown as MaintainerRow[]) ?? []);
  };
  useEffect(() => { load(); }, [projectId]);

  const add = async () => {
    const { data: prof } = await db.from("profiles").select("id").ilike("username", name.trim()).maybeSingle();
    if (!prof) return setMsg(EDITOR.noUser);
    const { error } = await db.from("project_maintainers").upsert({ user_id: prof.id, project_id: projectId });
    setMsg(error ? EDITOR.addFailed : ""); setName(""); load();
  };
  const remove = async (userId: string) => {
    if (!window.confirm(EDITOR.removeConfirm)) return;
    await db.from("project_maintainers").delete().eq("user_id", userId).eq("project_id", projectId);
    load();
  };

  return (
    <div className="subsection">
      <h3>{EDITOR.maintainers}</h3>
      {rows.map(r => (
        <div className="row" key={r.user_id}>
          <div className="grow"><b>{r.profiles?.username ?? r.user_id}</b></div>
          <button className="btn small" onClick={() => remove(r.user_id)}>{EDITOR.removeMaintainer}</button>
        </div>
      ))}
      <div className="filters">
        <input className="inline" placeholder={EDITOR.maintainerPlaceholder} value={name} onChange={e => setName(e.target.value)} />
        <button className="btn" onClick={add}>{EDITOR.addMaintainer}</button>
      </div>
      <Msg>{msg}</Msg>
    </div>
  );
}
