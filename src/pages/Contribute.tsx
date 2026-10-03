import { Link } from "react-router-dom";
import { ORG_URL } from "../config";
import { GithubIcon } from "../components/icons";
import { Rich, Terminal } from "../components/text";
import { PageHead, Section } from "../components/page";
import { CONTRIBUTE as C } from "../text/pages";

export default function Contribute() {
  return (
    <div className="fade">
      <PageHead title={C.title} intro={C.intro} />
      <div className="page-body container">
        <ol className="steps">
          {C.steps.map(step => (
            <li className="step" key={step.title}>
              <div>
                <h3>{step.title}</h3>
                <p><Rich text={step.text} /></p>
                {step.terminal && <Terminal command={step.terminal} />}
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="sections">
        <Section title={C.otherTitle}>
          <ul className="ticks sec-text">{C.other.map(t => <li key={t}>{t}</li>)}</ul>
        </Section>
        <Section title={C.helpTitle}>
          <p className="sec-text">{C.helpText}</p>
          <div className="btns">
            <a className="btn primary" href={ORG_URL}><GithubIcon /> {C.githubButton}</a>
            <Link className="btn" to="/projects">{C.projectsButton}</Link>
          </div>
          <p className="sub-h">{C.linksTitle}</p>
          <ul className="feed">{C.links.map(l => <li key={l.url}><a href={l.url}>{l.label}</a></li>)}</ul>
        </Section>
      </div>
    </div>
  );
}
