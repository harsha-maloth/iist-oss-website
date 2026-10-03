import { Link } from "react-router-dom";
import { PageHead } from "../components/page";
import { NOT_FOUND as N } from "../text/pages";

export default function NotFound() {
  return (
    <>
      <PageHead title={N.title} compact />
      <div className="wrap page-pad">
        <section>
          <p className="lead">{N.text}</p>
          <Link className="btn primary" to="/">{N.button}</Link>
        </section>
      </div>
    </>
  );
}
