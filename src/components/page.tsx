import type { ReactNode } from "react";
import { UI } from "../text/site";
import { EmptyArt } from "./icons";

/** Page title in a black label block, like metaKGP. */
export function PageHead({ title, intro, compact, children }: { title: string; intro?: string; compact?: boolean; children?: ReactNode }) {
  return (
    <section className={"page-head" + (compact ? " compact" : "")}>
      <div className="container">
        <h1 className="page-title">{title}</h1>
        {intro && <p className="hero-intro">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/** Home-page style block: a number on the left, a big title and the content on the right. */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="sec">
      <div className="container">
        <h2 className="sec-title">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="empty"><EmptyArt /><b>{title}</b>{children && <p>{children}</p>}</div>;
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages < 2) return null;
  const near = new Set([1, pages, page - 1, page, page + 1]);
  const items: (number | "gap")[] = [];
  for (let p = 1; p <= pages; p++) {
    if (near.has(p)) items.push(p);
    else if (items[items.length - 1] !== "gap") items.push("gap");
  }
  return (
    <nav className="pager" aria-label={UI.pages}>
      <button className="chip" disabled={page === 1} onClick={() => onPage(page - 1)}>&larr; {UI.prev}</button>
      {items.map((p, k) => p === "gap"
        ? <span key={`g${k}`} className="gap">...</span>
        : <button key={p} className={"chip" + (p === page ? " on" : "")} aria-current={p === page ? "page" : undefined} onClick={() => onPage(p)}>{p}</button>)}
      <button className="chip" disabled={page === pages} onClick={() => onPage(page + 1)}>{UI.next} &rarr;</button>
    </nav>
  );
}
