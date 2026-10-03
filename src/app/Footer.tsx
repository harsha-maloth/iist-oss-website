import { Link } from "react-router-dom";
import { GithubIcon } from "../components/icons";
import { Rich } from "../components/text";
import { SITE } from "../text/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="foot-top">
          <p>Made with &hearts; and &lt;/&gt; by <b>{SITE.madeBy}</b></p>
          <a className="social" href={SITE.orgUrl} target="_blank" rel="noreferrer" aria-label={SITE.githubLabel}><GithubIcon /></a>
          <p className="addr">{SITE.address.join(", ")}</p>
          <Link className="addr-link" to="/privacy">Privacy</Link>
        </div>
        <div className="foot-bottom">
          <div>
            <p>&copy; 2026 {SITE.rights}</p>
            <p className="credit"><Rich text={SITE.credit} /></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
