import { Link } from "react-router-dom";
import { GithubIcon, Mark } from "../components/icons";
import { Rich } from "../components/text";
import { EventRow, ProjectCard } from "../components/cards";
import { Section } from "../components/page";
import { useEvents, useProjects, useStats } from "../data/hooks";
import type { Featured, Project } from "../data/types";
import { EVENTS, HOME } from "../text/pages";
import { SITE } from "../text/site";
import { formatNumber } from "../utils";

function Stats({ projects }: { projects: Project[] }) {
  const stats = useStats();
  const items: [string, number | undefined][] = [
    [HOME.stats.projects, projects.length],
    [HOME.stats.contributors, stats?.contributors],
    [HOME.stats.commits, stats?.commits],
    [HOME.stats.issues, stats?.open_issues],
  ];
  return (
    <dl className="glance" aria-label={HOME.statsHeading}>
      {items.map(([label, value]) => <div className="stat" key={label}><dt>{label}</dt><dd>{formatNumber(value)}</dd></div>)}
    </dl>
  );
}

function FeaturedList({ items }: { items: Featured[] }) {
  if (items.length === 0) return null;
  return (
    <Section title={HOME.featuredTitle}>
      <div className="feat-grid">
        {items.map(f => {
          const href = f.project.live_url || f.project.repo_url;
          return (
            <article className="feat" key={f.project_id}>
              {f.screenshot_url && <div className="shot"><img src={f.screenshot_url} alt="" loading="lazy" /></div>}
              <h3>{f.display_name}</h3>
              <p>{f.usage}</p>
              {href && <a className="btn small primary" href={href}>{HOME.featuredOpen}</a>}
            </article>
          );
        })}
      </div>
    </Section>
  );
}

export default function Home() {
  const { projects, featured } = useProjects();
  const { events } = useEvents();
  const upcoming = events.filter(e => Date.parse(e.starts_at) >= Date.now()).slice(0, 3);
  const needy = projects.filter(p => p.status === "needs_maintainers").slice(0, 3);

  return (
    <div className="fade">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <p className="eyebrow">{HOME.eyebrow}</p>
            <h1><span>{HOME.line1}</span><span>{HOME.line2}</span></h1>
            <p className="hero-desc">{HOME.headline}</p>
            <div className="hero-btns">
              <div className="split">
                <Link to="/projects">{HOME.primary}</Link>
                <Link to="/contribute">{HOME.secondary}</Link>
              </div>
              <a className="gh-pill" href={SITE.orgUrl} target="_blank" rel="noreferrer"><GithubIcon /> {HOME.join}</a>
            </div>
          </div>
          <div className="hero-pic" aria-hidden="true"><Mark /></div>
        </div>
        <div className="container"><Stats projects={projects} /></div>
      </section>

      <div className="sections">
        <Section title={HOME.doTitle}>
          <ul className="task-list">
            {HOME.tasks.map(t => (
              <li key={t.to}>
                <Link className="task-row" to={t.to}>
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                  <span className="go">{t.cta} &rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title={HOME.eventsTitle}>
          {upcoming.length === 0
            ? <p className="sec-text"><Rich text={EVENTS.noneText} /></p>
            : <>
                <div className="ev-list">{upcoming.map(e => <EventRow key={e.id} e={e} />)}</div>
                <p className="after"><Link className="arrow-link" to="/events">{HOME.eventsAll} &rarr;</Link></p>
              </>}
        </Section>

        <FeaturedList items={featured} />

        {needy.length > 0 && (
          <Section title={HOME.needyTitle}>
            <p className="sec-text">{HOME.needyText}</p>
            <div className="pgrid">{needy.map(p => <ProjectCard key={p.slug} p={p} />)}</div>
            <Link className="arrow-link" to="/projects?status=needs_maintainers">{HOME.needyAll} &rarr;</Link>
          </Section>
        )}
      </div>
    </div>
  );
}
