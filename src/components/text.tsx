import { Link } from "react-router-dom";
import { CONTRIBUTE } from "../text/pages";

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

/** Small markup for text files: **bold** and [label](link). Links that start with / stay inside the site. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(TOKEN).map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) return link[2].startsWith("/") ? <Link key={i} to={link[2]}>{link[1]}</Link> : <a key={i} href={link[2]}>{link[1]}</a>;
        return part;
      })}
    </>
  );
}

export function Terminal({ command }: { command: string }) {
  return (
    <div className="terminal" role="group" aria-label={CONTRIBUTE.terminalLabel}>
      <div className="terminal-bar"><i /><i /><i /><span>{CONTRIBUTE.terminalTitle}</span></div>
      <pre>{command.split("\n").map((line, i) => (
        <div key={i}>{line.startsWith("$") ? <><span className="prompt">$</span>{line.slice(1)}</> : line}</div>
      ))}</pre>
    </div>
  );
}
