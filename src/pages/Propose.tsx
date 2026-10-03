import { useState } from "react";
import { Field, Msg } from "../components/form";
import { MemberPage } from "../components/Gate";
import { db } from "../data/client";
import { PROPOSE as P } from "../text/pages";
import { toList } from "../utils";

const EMPTY = { name: "", description: "", repo_url: "", live_url: "", languages: "" };

export default function Propose() {
  const [f, setF] = useState(EMPTY);
  const [msg, setMsg] = useState("");
  const set = (k: keyof typeof EMPTY, v: string) => setF({ ...f, [k]: v });

  const submit = async () => {
    if (!f.name.trim() || !f.description.trim()) return setMsg(P.required);
    setMsg(P.sending);
    const { error } = await db.from("proposals").insert({
      name: f.name.trim(), description: f.description.trim(), repo_url: f.repo_url.trim() || null,
      live_url: f.live_url.trim() || null, languages: toList(f.languages),
    });
    setMsg(error ? P.failed : P.sent);
    if (!error) setF(EMPTY);
  };

  return (
    <MemberPage title={P.title}>
      <p className="lead">{P.lead}</p>
      <Field label={P.name}><input value={f.name} onChange={e => set("name", e.target.value)} /></Field>
      <Field label={P.description}><textarea rows={3} value={f.description} onChange={e => set("description", e.target.value)} /></Field>
      <Field label={P.repo}><input value={f.repo_url} onChange={e => set("repo_url", e.target.value)} /></Field>
      <Field label={P.live}><input value={f.live_url} onChange={e => set("live_url", e.target.value)} /></Field>
      <Field label={P.languages}><input value={f.languages} onChange={e => set("languages", e.target.value)} /></Field>
      <button className="btn primary" onClick={submit}>{P.send}</button>
      <Msg>{msg}</Msg>
    </MemberPage>
  );
}
