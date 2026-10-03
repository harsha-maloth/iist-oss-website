import { useState } from "react";
import { Msg } from "../components/form";
import { ORG_NAME, ORG_URL } from "../config";
import { db } from "../data/client";
import { ADMIN } from "../text/admin";
import { normUrl, slugify } from "../utils";

interface Repo { name: string; description: string | null; html_url: string; homepage: string | null; language: string | null; fork: boolean; archived: boolean }

/** Adds public repositories of the GitHub organization as projects. */
export default function ImportRepos({ known, onAdded }: { known: (string | null)[]; onAdded: () => void }) {
  const T = ADMIN.projects;
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [fetching, setFetching] = useState(false);
  const [publishNow, setPublishNow] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchRepos = async () => {
    setFetching(true); setMsg("");
    try {
      const all: Repo[] = [];
      for (let page = 1; page <= 5; page++) {
        const res = await fetch(`https://api.github.com/orgs/${ORG_NAME}/repos?per_page=100&type=public&sort=pushed&page=${page}`, { headers: { Accept: "application/vnd.github+json" } });
        if (res.status === 404) { setMsg(T.noOrg(ORG_NAME)); break; }
        if (res.status === 403) { setMsg(T.rateLimit); break; }
        if (!res.ok) { setMsg(T.githubError(res.status)); break; }
        const batch = (await res.json()) as Repo[];
        all.push(...batch);
        if (batch.length < 100) { setRepos(all); break; }
        if (page === 5) setRepos(all);
      }
    } catch { setMsg(T.unreachable); }
    setFetching(false);
  };

  const add = async (r: Repo) => {
    const { error } = await db.from("projects").insert({
      slug: slugify(r.name), name: r.name, description: r.description ?? "", repo_url: r.html_url,
      live_url: r.homepage || null, languages: r.language ? [r.language] : [],
      status: r.archived ? "archived" : "active", is_public: publishNow,
    });
    setMsg(error ? T.importFailed(r.name) : T.imported(r.name, publishNow));
    if (!error) onAdded();
  };

  const seen = new Set(known.map(normUrl));
  const available = (repos ?? []).filter(r => !r.fork && !seen.has(normUrl(r.html_url)));

  return (
    <div className="subsection">
      <h3>{T.importTitle}</h3>
      <p className="note">{T.importHelp} (<a href={ORG_URL}>{ORG_URL.replace("https://", "")}</a>)</p>
      <div className="filters toolbar">
        <button className="btn" onClick={fetchRepos} disabled={fetching}>{fetching ? T.loadingRepos : repos ? T.reload : T.load}</button>
        <label className="check inline-check"><input type="checkbox" checked={publishNow} onChange={e => setPublishNow(e.target.checked)} /> {T.publishNow}</label>
      </div>
      <Msg>{msg}</Msg>
      {repos && available.length === 0 && <p className="msg">{T.allImported}</p>}
      {available.map(r => (
        <div className="row" key={r.html_url}>
          <div className="grow">
            <b>{r.name}</b>
            <small>{r.description || T.noDescription}{r.language ? ` · ${r.language}` : ""}{r.archived ? ` · ${T.archived}` : ""}</small>
          </div>
          <button className="btn small primary" onClick={() => add(r)}>{T.import}</button>
        </div>
      ))}
    </div>
  );
}
