import { Link } from "react-router-dom";
import { Uptime } from "../components/cards";
import { MemberPage } from "../components/Gate";
import { signOut, useAuth, userName } from "../data/auth";
import { useMyProjects } from "../data/hooks";
import { ACCOUNT as A } from "../text/pages";
import { STATUS_LABEL, UI } from "../text/site";

export default function Account() {
  const { user, isAdmin } = useAuth();
  const { items, loading, error } = useMyProjects(user, isAdmin);

  return (
    <MemberPage title={A.title}>
      <p className="lead">{A.signedInAs(userName(user))}{isAdmin && A.admin}</p>
      <div className="btns spaced">
        <Link className="btn" to="/propose">{A.addProject}</Link>
        {isAdmin && <Link className="btn" to="/admin">{A.adminPanel}</Link>}
        <button className="btn" onClick={() => signOut()}>{UI.signOut}</button>
      </div>
      {loading && <p className="msg">{A.loading}</p>}
      {error && <p className="msg err">{A.error}</p>}
      {!loading && !error && items.length === 0 && <p className="msg">{A.empty}</p>}
      <div className="grid">
        {items.map(p => (
          <article className="card" key={p.slug}>
            <h3><Link to={`/account/${p.slug}`}>{p.name}</Link></h3>
            <p>{p.description}</p>
            <div className="meta">
              <span>{STATUS_LABEL[p.status]}</span>
              {!p.is_public && <span className="tag warn">{A.hidden}</span>}
              <Uptime p={p} />
            </div>
            <div className="meta links">
              {p.live_url && <a href={p.live_url}>{A.liveSite}</a>}
              {p.repo_url && <a href={p.repo_url}>{A.github}</a>}
            </div>
          </article>
        ))}
      </div>
    </MemberPage>
  );
}
