import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Msg } from "../components/form";
import { db } from "../data/client";
import type { Project } from "../data/types";
import { ADMIN } from "../text/admin";
import { STATUS_LABEL } from "../text/site";
import ImportRepos from "./ImportRepos";

type Row = Pick<Project, "id" | "slug" | "name" | "description" | "status" | "is_public" | "repo_url">;

export default function Projects() {
  const T = ADMIN.projects;
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data, error } = await db.from("projects").select("id,slug,name,description,status,is_public,repo_url").order("name");
    if (error) setMsg(T.loadFailed); else setRows((data as unknown as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter(r => (filter === "all" ? true : filter === "public" ? r.is_public : filter === "hidden" ? !r.is_public : r.status === filter))
      .filter(r => !needle || r.name.toLowerCase().includes(needle));
  }, [rows, q, filter]);

  const toggle = async (r: Row) => {
    const { data, error } = await db.from("projects").update({ is_public: !r.is_public }).eq("id", r.id).select().maybeSingle();
    setMsg(error || !data ? T.visibilityFailed : r.is_public ? T.nowHidden(r.name) : T.nowPublic(r.name)); load();
  };
  const remove = async (r: Row) => {
    if (!window.confirm(T.deleteConfirm(r.name))) return;
    const { error } = await db.from("projects").delete().eq("id", r.id);
    setMsg(error ? T.deleteFailed : T.deleted(r.name)); load();
  };

  return (
    <>
      <h2>{T.title} ({rows.length})</h2>
      <div className="filters toolbar">
        <input className="inline" type="search" placeholder={T.search} aria-label={T.search} value={q} onChange={e => setQ(e.target.value)} />
        {T.filters.map(([v, label]) => (
          <button key={v} className={"chip" + (filter === v ? " on" : "")} onClick={() => setFilter(v)}>{label}</button>
        ))}
      </div>
      <Msg>{msg}</Msg>
      {shown.length === 0 && <p className="msg">{T.empty}</p>}
      {shown.map(r => (
        <div className="row" key={r.id}>
          <div className="grow"><b>{r.name}</b><small>{STATUS_LABEL[r.status]} · {r.is_public ? ADMIN.common.public : ADMIN.common.hidden}</small></div>
          <Link className="btn small" to={`/admin/projects/${r.slug}`}>{ADMIN.common.edit}</Link>
          <button className="btn small" onClick={() => toggle(r)}>{r.is_public ? ADMIN.common.hide : ADMIN.common.show}</button>
          <button className="btn small danger" onClick={() => remove(r)}>{ADMIN.common.delete}</button>
        </div>
      ))}
      <ImportRepos known={rows.map(r => r.repo_url)} onAdded={load} />
    </>
  );
}
