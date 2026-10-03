import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Msg } from "../components/form";
import { db } from "../data/client";
import { ADMIN } from "../text/admin";
import { dateShort } from "../utils";

interface Numbers { proposals: number; hidden: number; offline: number; events: number; synced: string | null }

const count = (q: PromiseLike<{ count: number | null }>) => q.then(r => r.count ?? 0);
const head = { count: "exact", head: true } as const;

export default function Overview() {
  const [n, setN] = useState<Numbers | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [proposals, hidden, offline, events, stats] = await Promise.all([
          count(db.from("proposals").select("id", head).eq("status", "pending")),
          count(db.from("projects").select("id", head).eq("is_public", false)),
          count(db.from("projects").select("id", head).eq("is_up", false)),
          count(db.from("events").select("id", head).gte("starts_at", new Date().toISOString())),
          db.from("site_stats").select("updated_at").eq("id", 1).maybeSingle(),
        ]);
        setN({ proposals, hidden, offline, events, synced: (stats.data as { updated_at: string } | null)?.updated_at ?? null });
      } catch { setError(true); }
    })();
  }, []);

  const O = ADMIN.overview;
  const cards: [string, number | undefined, string][] = [
    [O.proposals, n?.proposals, "/admin/proposals"],
    [O.hidden, n?.hidden, "/admin/projects"],
    [O.offline, n?.offline, "/admin/projects"],
    [O.events, n?.events, "/admin/events"],
  ];

  return (
    <>
      <h2>{O.title}</h2>
      <Msg error>{error ? O.error : ""}</Msg>
      <div className="numbers">
        {cards.map(([label, value, to]) => (
          <Link className="number" to={to} key={label}>
            <b>{value ?? "-"}</b><span>{label}</span>
          </Link>
        ))}
      </div>
      <p className="note">{O.sync}: {n?.synced ? dateShort(n.synced) : O.never}</p>
    </>
  );
}
