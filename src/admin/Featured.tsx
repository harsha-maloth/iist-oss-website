import { useEffect, useState } from "react";
import { Field, Msg } from "../components/form";
import { db } from "../data/client";
import { ADMIN } from "../text/admin";

interface Row { project_id: string; display_name: string; usage: string; screenshot_url: string | null; sort_order: number; projects: { name: string } | null }
const EMPTY = { project_id: "", display_name: "", usage: "" };

export default function Featured() {
  const T = ADMIN.featured;
  const [rows, setRows] = useState<Row[]>([]);
  const [choices, setChoices] = useState<{ id: string; name: string }[]>([]);
  const [add, setAdd] = useState(EMPTY);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [f, p] = await Promise.all([
      db.from("featured").select("project_id,display_name,usage,screenshot_url,sort_order,projects(name)").order("sort_order"),
      db.from("projects").select("id,name").eq("is_public", true).order("name"),
    ]);
    if (f.error || p.error) return setMsg(T.loadFailed);
    setRows((f.data as unknown as Row[]) ?? []);
    setChoices(p.data ?? []);
  };
  useEffect(() => { load(); }, []);

  const edit = (i: number, k: "display_name" | "usage" | "screenshot_url", v: string) =>
    setRows(rows.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const save = async (r: Row) => {
    const { error } = await db.from("featured")
      .update({ display_name: r.display_name, usage: r.usage, screenshot_url: r.screenshot_url || null })
      .eq("project_id", r.project_id);
    setMsg(error ? T.saveFailed : T.saved(r.display_name));
  };
  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const next = [...rows];
    [next[i], next[j]] = [next[j], next[i]];
    setRows(next);
    const results = await Promise.all(next.map((r, idx) => db.from("featured").update({ sort_order: idx }).eq("project_id", r.project_id)));
    if (results.some(x => x.error)) setMsg(T.orderFailed);
    load();
  };
  const remove = async (r: Row) => {
    if (!window.confirm(T.removeConfirm(r.display_name))) return;
    const { error } = await db.from("featured").delete().eq("project_id", r.project_id);
    setMsg(error ? T.removeFailed : T.removed); load();
  };
  const create = async () => {
    if (!add.project_id || !add.display_name.trim() || !add.usage.trim()) return setMsg(T.missing);
    const { error } = await db.from("featured").insert({ project_id: add.project_id, display_name: add.display_name.trim(), usage: add.usage.trim(), sort_order: rows.length });
    if (error) return setMsg(T.addFailed);
    setAdd(EMPTY); setMsg(T.added); load();
  };

  const used = new Set(rows.map(r => r.project_id));
  const options = choices.filter(c => !used.has(c.id));

  return (
    <>
      <h2>{T.title} ({rows.length})</h2>
      <p className="note">{T.help}</p>
      <Msg>{msg}</Msg>
      {rows.length === 0 && <p className="msg">{T.empty}</p>}
      {rows.map((r, i) => (
        <article className="card form-card" key={r.project_id}>
          <div className="meta"><span>{r.projects?.name}</span></div>
          <Field label={T.name}><input value={r.display_name} onChange={e => edit(i, "display_name", e.target.value)} /></Field>
          <Field label={T.usage}><textarea rows={2} value={r.usage} onChange={e => edit(i, "usage", e.target.value)} /></Field>
          <Field label={T.screenshot}><input value={r.screenshot_url ?? ""} onChange={e => edit(i, "screenshot_url", e.target.value)} /></Field>
          <div className="btns">
            <button className="btn small primary" onClick={() => save(r)}>{ADMIN.common.save}</button>
            <button className="btn small" onClick={() => move(i, -1)} disabled={i === 0}>{T.up}</button>
            <button className="btn small" onClick={() => move(i, 1)} disabled={i === rows.length - 1}>{T.down}</button>
            <button className="btn small danger" onClick={() => remove(r)}>{ADMIN.common.remove}</button>
          </div>
        </article>
      ))}

      <div className="subsection">
        <h3>{T.addTitle}</h3>
        <Field label={T.project}>
          <select className="full" value={add.project_id} onChange={e => {
            const c = choices.find(x => x.id === e.target.value);
            setAdd({ ...add, project_id: e.target.value, display_name: add.display_name || c?.name || "" });
          }}>
            <option value="">{T.chooseProject}</option>
            {options.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label={T.name}><input value={add.display_name} onChange={e => setAdd({ ...add, display_name: e.target.value })} /></Field>
        <Field label={T.usage}><textarea rows={2} value={add.usage} onChange={e => setAdd({ ...add, usage: e.target.value })} /></Field>
        <button className="btn primary" onClick={create}>{T.addButton}</button>
      </div>
    </>
  );
}
