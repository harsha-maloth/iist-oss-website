import { PageHead } from "../components/page";
import { PRIVACY as P } from "../text/pages";

export default function Privacy() {
  return (
    <div className="fade">
      <PageHead title={P.title} intro={P.intro} />
      <div className="page-body container">
        <div className="about">
          {P.blocks.map(b => (
            <section key={b.title}>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </section>
          ))}
          <p className="muted">{P.updated}</p>
        </div>
      </div>
    </div>
  );
}
