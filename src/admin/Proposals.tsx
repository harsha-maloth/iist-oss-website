import { useEffect, useState } from "react";
import { Msg } from "../components/form";
import { db } from "../data/client";
import { ADMIN } from "../text/admin";
import { useAdmin } from "./AdminLayout";

interface Proposal {
  id: string; name: string; description: string; repo_url: string | null; live_url: string | null;
  languages: string[]; profiles: { username: string | null } | null;
}

export default function Proposals() {
  const { refreshPending } = useAdmin();
  const T = ADMIN.proposals;
  const [items, setItems] = useState<Proposal[]>([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const { data, error } = await db.from("proposals").select("*, profiles(username)").eq("status", "pending").order("created_at");
    if (error) setMsg(T.loadFailed); else setItems((data as unknown as Proposal[]) ?? []);
    refreshPending();
  };
  useEffect(() => { load(); }, []);

  // The database does the whole approval in one step, so it cannot stop half way.
  const approve = async (p: Proposal) => {
    const { error } = await db.rpc("approve_proposal", { pid: p.id });
    setMsg(error ? T.approveFailed(p.name) : T.approved(p.name)); load();
  };
  const reject = async (p: Proposal) => {
    const { error } = await db.from("proposals").update({ status: "rejected" }).eq("id", p.id);
    setMsg(error ? T.rejectFailed(p.name) : T.rejected(p.name)); load();
  };
  const discard = async (p: Proposal) => {
    if (!window.confirm(T.deleteConfirm(p.name))) return;
    const { error } = await db.from("proposals").delete().eq("id", p.id);
    setMsg(error ? T.deleteFailed : T.deleted(p.name)); load();
  };

  return (
    <>
      <h2>{T.title}</h2>
      <Msg>{msg}</Msg>
      {items.length === 0 && <p className="msg">{T.empty}</p>}
      <div className="grid">
        {items.map(p => (
          <article className="card" key={p.id}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="meta">
              <span>{T.by(p.profiles?.username ?? ADMIN.people.unknown)}</span>
              {p.languages.map(l => <span key={l}>{l}</span>)}
              {p.repo_url && <a href={p.repo_url}>{T.source}</a>}
            </div>
            <div className="btns">
              <button className="btn small primary" onClick={() => approve(p)}>{T.approve}</button>
              <button className="btn small" onClick={() => reject(p)}>{T.reject}</button>
              <button className="btn small danger" onClick={() => discard(p)}>{T.delete}</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
