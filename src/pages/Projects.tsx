import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Dropdown } from "../components/Dropdown";
import { ProjectCard } from "../components/cards";
import { Empty, PageHead, Pager } from "../components/page";
import { useProjects } from "../data/hooks";
import type { Project } from "../data/types";
import { PROJECTS } from "../text/pages";

type Sort = "stars" | "activity" | "name";

export default function Projects() {
  const { projects, loading, error } = useProjects();
  const [sp, setSp] = useSearchParams();
  const [page, setPage] = useState(1);

  const q = sp.get("q") ?? "";
  const status = sp.get("status") ?? "all";
  const sort = (sp.get("sort") ?? "stars") as Sort;
  const langs = (sp.get("lang") ?? "").split(",").filter(Boolean);

  // Filters live in the address bar, so a filtered list can be shared as a link.
  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(sp);
    if (v && v !== "all" && v !== "stars") next.set(k, v); else next.delete(k);
    setSp(next, { replace: true });
    setPage(1);
  };
  const toggleLang = (l: string) => setParam("lang", (langs.includes(l) ? langs.filter(x => x !== l) : [...langs, l]).join(","));
  const allLangs = useMemo(() => [...new Set(projects.flatMap(p => p.languages))].sort(), [projects]);

  const shown = useMemo(() => {
    const time = (p: Project) => (p.pushed_at ? Date.parse(p.pushed_at) : 0);
    const order = (a: Project, b: Project) =>
      sort === "name" ? a.name.toLowerCase().localeCompare(b.name.toLowerCase()) : sort === "activity" ? time(b) - time(a) : b.stars - a.stars;
    const needle = q.trim().toLowerCase();
    return projects
      .filter(p => status === "all" || p.status === status)
      .filter(p => langs.length === 0 || p.languages.some(l => langs.includes(l)))
      .filter(p => !needle || (p.name + " " + p.description).toLowerCase().includes(needle))
      .sort(order);
  }, [projects, q, status, sort, sp]);

  const pages = Math.max(1, Math.ceil(shown.length / PROJECTS.perPage));
  const current = Math.min(page, pages);
  const visible = shown.slice((current - 1) * PROJECTS.perPage, current * PROJECTS.perPage);
  const filtered = q || status !== "all" || langs.length > 0;

  return (
    <div className="fade">
      <PageHead title={PROJECTS.title} intro={PROJECTS.intro}>
        <div className="filterbar">
          <span className="label">{PROJECTS.filterBy}</span>
          <div className="filter-set">
            <Dropdown label={PROJECTS.status} options={PROJECTS.statuses.map(([v, l]) => ({ value: v, label: l, on: status === v }))} onPick={v => setParam("status", v)} />
            {allLangs.length > 0 && <Dropdown multi label={PROJECTS.language} options={allLangs.map(l => ({ value: l, label: l, on: langs.includes(l) }))} onPick={toggleLang} />}
            <Dropdown label={PROJECTS.sortBy} options={PROJECTS.sorts.map(([v, l]) => ({ value: v, label: l, on: sort === v }))} onPick={v => setParam("sort", v)} />
          </div>
        </div>
        <div className="search-line">
          <input className="underline-input" type="search" value={q} onChange={e => setParam("q", e.target.value)} placeholder={PROJECTS.search} aria-label={PROJECTS.search} />
        </div>
        {loading && <p className="msg count-line">{PROJECTS.loading}</p>}
        {error && <p className="msg err count-line">{error}</p>}
        {!loading && !error && (
          <p className="msg count-line" aria-live="polite">
            {PROJECTS.count(shown.length)}
            {filtered && <> &middot; <button className="linklike" onClick={() => { setSp({}, { replace: true }); setPage(1); }}>{PROJECTS.clear}</button></>}
          </p>
        )}
        {!loading && !error && shown.length === 0 && (
          projects.length === 0
            ? <Empty title={PROJECTS.emptyTitle}>{PROJECTS.emptyText}</Empty>
            : <Empty title={PROJECTS.noMatchTitle}>{PROJECTS.noMatchText}</Empty>
        )}
        {visible.length > 0 && <div className="pgrid">{visible.map(p => <ProjectCard key={p.slug} p={p} />)}</div>}
        <Pager page={current} pages={pages} onPage={setPage} />
        <div className="page-end" />
      </PageHead>
    </div>
  );
}
