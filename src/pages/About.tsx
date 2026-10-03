import { ORG_URL } from "../config";
import { GithubIcon } from "../components/icons";
import { Rich } from "../components/text";
import { PageHead, Section } from "../components/page";
import { ABOUT as A } from "../text/pages";

export default function About() {
  return (
    <div className="fade">
      <PageHead title={A.title} intro={A.intro} />
      <div className="page-body container">
        <div className="about">
          <blockquote>{A.quote}</blockquote>
          <p>{A.story}</p>
          <p><Rich text={A.who} /></p>
          <p>{A.join}</p>
          <p>{A.easy}</p>
          {A.photo.src && (
            <figure className="photo">
              <img src={import.meta.env.BASE_URL + A.photo.src} alt={A.photo.alt} loading="lazy" />
              <figcaption>{A.photo.caption}</figcaption>
            </figure>
          )}
        </div>
      </div>
      <div className="sections">
        <Section title={A.contactTitle}>
          <p className="sec-text">{A.contactText}</p>
          <div className="btns"><a className="btn primary" href={ORG_URL}><GithubIcon /> {A.contactButton}</a></div>
        </Section>
      </div>
    </div>
  );
}
