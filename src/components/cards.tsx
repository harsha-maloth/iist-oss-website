import type { EventItem, Project } from "../data/types";
import { EVENTS, PROJECTS } from "../text/pages";
import { STATUS_LABEL } from "../text/site";
import { dateLong } from "../utils";

export function Uptime({ p }: { p: Pick<Project, "live_url" | "is_up"> }) {
  if (!p.live_url || p.is_up == null) return null;
  return <span className={"tag" + (p.is_up ? "" : " warn")}>{p.is_up ? PROJECTS.online : PROJECTS.offline}</span>;
}

export function ProjectCard({ p }: { p: Project }) {
  const href = p.live_url || p.repo_url;
  return (
    <article className="project">
      <h3>{href ? <a href={href}>{p.name}</a> : p.name}</h3>
      <p className={"ptype" + (p.status === "needs_maintainers" ? " warn" : "")}>{STATUS_LABEL[p.status] ?? p.status}</p>
      <p className="pdesc">{p.description}</p>
      {(p.languages.length > 0 || p.live_url) && (
        <div className="meta">
          <Uptime p={p} />
          {p.languages.map(l => <span key={l}>{l}</span>)}
        </div>
      )}
      <div className="pfoot">
        {p.live_url && <a className="plink" href={p.live_url}>{PROJECTS.open}</a>}
        {p.repo_url && <a className="plink" href={p.repo_url}>{PROJECTS.code}</a>}
        <span className="muted">{PROJECTS.stars(p.stars)}</span>
      </div>
    </article>
  );
}

export function EventRow({ e }: { e: EventItem }) {
  const d = new Date(e.starts_at);
  return (
    <article className="ev">
      <div className="date" aria-hidden="true"><b>{d.getDate()}</b><span>{d.toLocaleString("en-IN", { month: "short" })}</span></div>
      <div>
        <h3>{e.title}</h3>
        <div className="meta"><span>{dateLong(e.starts_at)}</span>{e.location && <span>{e.location}</span>}</div>
        {e.description && <p>{e.description}</p>}
        <div className="actions">
          {e.link && <a className="btn small primary" href={e.link}>{EVENTS.register}</a>}
          {e.projects && <span className="muted">{EVENTS.project} {e.projects.name}</span>}
        </div>
      </div>
    </article>
  );
}
