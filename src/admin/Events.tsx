import { useEffect, useState } from "react";
import { Field, Msg } from "../components/form";
import { db } from "../data/client";
import { useEvents } from "../data/hooks";
import type { EventItem } from "../data/types";
import { ADMIN } from "../text/admin";
import { dateShort, toLocalInput } from "../utils";

const EMPTY = { title: "", starts_at: "", location: "", description: "", link: "", project_id: "" };

export default function Events() {
  const T = ADMIN.events;
  const { events, reload } = useEvents(true);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [f, setF] = useState(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof EMPTY, v: string) => setF({ ...f, [k]: v });

  useEffect(() => {
    db.from("projects").select("id,name").order("name").then(({ data }) => setProjects(data ?? []));
  }, []);

  const reset = () => { setF(EMPTY); setEditing(null); };

  const save = async () => {
    if (!f.title.trim() || !f.starts_at) return setMsg(T.required);
    const row = {
      title: f.title.trim(), starts_at: new Date(f.starts_at).toISOString(), location: f.location.trim() || null,
      description: f.description.trim() || null, link: f.link.trim() || null, project_id: f.project_id || null,
    };
    const { error } = editing
      ? await db.from("events").update(row).eq("id", editing)
      : await db.from("events").insert(row);
    if (error) return setMsg(T.saveFailed);
    reset(); setMsg(T.saved); reload();
  };
  const startEdit = (e: EventItem) => {
    setEditing(e.id);
    setF({ title: e.title, starts_at: toLocalInput(e.starts_at), location: e.location ?? "", description: e.description ?? "", link: e.link ?? "", project_id: e.project_id ?? "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggle = async (e: EventItem) => {
    const { error } = await db.from("events").update({ is_public: !e.is_public }).eq("id", e.id);
    setMsg(error ? T.visibilityFailed : e.is_public ? T.nowHidden : T.nowPublic); reload();
  };
  const remove = async (e: EventItem) => {
    if (!window.confirm(T.deleteConfirm(e.title))) return;
    const { error } = await db.from("events").delete().eq("id", e.id);
    if (editing === e.id) reset();
    setMsg(error ? T.deleteFailed : T.deleted); reload();
  };

  return (
    <>
      <h2>{editing ? T.editTitle : T.addTitle}</h2>
      <Field label={T.name}><input value={f.title} onChange={e => set("title", e.target.value)} /></Field>
      <Field label={T.when}><input type="datetime-local" value={f.starts_at} onChange={e => set("starts_at", e.target.value)} /></Field>
      <Field label={T.where}><input value={f.location} onChange={e => set("location", e.target.value)} /></Field>
      <Field label={T.description}><textarea rows={3} value={f.description} onChange={e => set("description", e.target.value)} /></Field>
      <Field label={T.link}><input value={f.link} onChange={e => set("link", e.target.value)} /></Field>
      <Field label={T.project}>
        <select className="full" value={f.project_id} onChange={e => set("project_id", e.target.value)}>
          <option value="">{T.none}</option>
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </Field>
      <div className="btns">
        <button className="btn primary" onClick={save}>{editing ? T.saveEdit : T.saveAdd}</button>
        {editing && <button className="btn" onClick={() => { reset(); setMsg(""); }}>{ADMIN.common.cancel}</button>}
      </div>
      <Msg>{msg}</Msg>

      <div className="subsection">
        <h3>{T.listTitle} ({events.length})</h3>
        {events.length === 0 && <p className="msg">{T.empty}</p>}
        {[...events].reverse().map(e => (
          <div className="row" key={e.id}>
            <div className="grow">
              <b>{e.title}</b>
              <small>{dateShort(e.starts_at)} · {new Date(e.starts_at) > new Date() ? T.upcoming : T.past} · {e.is_public ? ADMIN.common.public : ADMIN.common.hidden}</small>
            </div>
            <button className="btn small" onClick={() => startEdit(e)}>{ADMIN.common.edit}</button>
            <button className="btn small" onClick={() => toggle(e)}>{e.is_public ? ADMIN.common.hide : ADMIN.common.show}</button>
            <button className="btn small danger" onClick={() => remove(e)}>{ADMIN.common.delete}</button>
          </div>
        ))}
      </div>
    </>
  );
}
