import { useEffect, useMemo, useState } from "react";
import { Msg } from "../components/form";
import { useAuth } from "../data/auth";
import { db } from "../data/client";
import { ADMIN } from "../text/admin";

interface Person { id: string; username: string | null }

export default function People() {
  const T = ADMIN.people;
  const { user } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [adminIds, setAdminIds] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  const load = async () => {
    const [p, a] = await Promise.all([
      db.from("profiles").select("id,username").order("username"),
      db.from("admins").select("user_id"),
    ]);
    if (p.error || a.error) return setMsg(T.loadFailed);
    setPeople((p.data as unknown as Person[]) ?? []);
    setAdminIds(new Set((a.data ?? []).map(r => r.user_id as string)));
  };
  useEffect(() => { load(); }, []);

  const name = (p: Person) => p.username ?? T.unknown;
  const admins = people.filter(p => adminIds.has(p.id));
  const others = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return people.filter(p => !adminIds.has(p.id) && (!needle || name(p).toLowerCase().includes(needle)));
  }, [people, adminIds, q]);

  const makeAdmin = async (p: Person) => {
    const { error } = await db.from("admins").insert({ user_id: p.id });
    setMsg(error ? T.addFailed : T.added(name(p))); load();
  };
  const removeAdmin = async (p: Person) => {
    if (!window.confirm(T.removeConfirm(name(p)))) return;
    const { error } = await db.from("admins").delete().eq("user_id", p.id);
    setMsg(error ? T.removeFailed : T.removed(name(p))); load();
  };

  return (
    <>
      <h2>{T.title}</h2>
      <Msg>{msg}</Msg>

      <h3>{T.adminsTitle} ({admins.length})</h3>
      <p className="note">{T.adminsHelp}</p>
      {admins.map(p => (
        <div className="row" key={p.id}>
          <div className="grow"><b>{name(p)}</b>{p.id === user?.id && <small>{ADMIN.common.you}</small>}</div>
          <button className="btn small danger" disabled={p.id === user?.id} onClick={() => removeAdmin(p)}>{T.removeAdmin}</button>
        </div>
      ))}

      <div className="subsection">
        <h3>{T.othersTitle}</h3>
        <div className="filters toolbar">
          <input className="inline" type="search" placeholder={T.search} aria-label={T.search} value={q} onChange={e => setQ(e.target.value)} />
        </div>
        {others.length === 0 && <p className="msg">{T.othersEmpty}</p>}
        {others.slice(0, 50).map(p => (
          <div className="row" key={p.id}>
            <div className="grow"><b>{name(p)}</b></div>
            <button className="btn small" onClick={() => makeAdmin(p)}>{T.makeAdmin}</button>
          </div>
        ))}
      </div>
    </>
  );
}
