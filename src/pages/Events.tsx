import { Rich } from "../components/text";
import { EventRow } from "../components/cards";
import { Empty, PageHead } from "../components/page";
import { useEvents } from "../data/hooks";
import { EVENTS } from "../text/pages";

export default function Events() {
  const { events, loading, error } = useEvents();
  const now = Date.now();
  const upcoming = events.filter(e => Date.parse(e.starts_at) >= now);
  const past = events.filter(e => Date.parse(e.starts_at) < now).reverse();

  return (
    <div className="fade">
      <PageHead title={EVENTS.title} intro={EVENTS.intro} />
      <div className="page-body container">
        {loading && <p className="msg">{EVENTS.loading}</p>}
        {error && <p className="msg err">{error}</p>}
        {!loading && !error && upcoming.length === 0 && <Empty title={EVENTS.noneTitle}><Rich text={EVENTS.noneText} /></Empty>}
        {upcoming.length > 0 && <div className="ev-list">{upcoming.map(e => <EventRow key={e.id} e={e} />)}</div>}
        {past.length > 0 && (
          <details className="past">
            <summary><h2>{EVENTS.past} ({past.length})</h2></summary>
            <div className="ev-list">{past.map(e => <EventRow key={e.id} e={e} />)}</div>
          </details>
        )}
      </div>
    </div>
  );
}
