import { useEffect, useRef, useState } from "react";

const ARROW = (
  <svg viewBox="0 0 119 57" fill="currentColor" aria-hidden="true">
    <rect x="47" y="38" width="26" height="19" /><rect width="26" height="19" /><rect x="93" width="26" height="19" /><rect x="22" y="19" width="26" height="19" /><rect x="71" y="19" width="26" height="19" />
  </svg>
);

interface Option { value: string; label: string; on: boolean }

export function Dropdown({ label, options, onPick, multi }: { label: string; options: Option[]; onPick: (v: string) => void; multi?: boolean }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const active = options.filter(o => o.on && o.value !== "all");
  const shown = active.length === 0 ? label : active.length === 1 ? active[0].label : `${label} (${active.length})`;

  return (
    <div className="dd" ref={box}>
      <button type="button" className="dd-btn" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(o => !o)}>
        <span>{shown}</span>{ARROW}
      </button>
      {open && (
        <div className="dd-menu" role="group" aria-label={label}>
          {options.map(o => (
            <button type="button" key={o.value} className="dd-item" aria-pressed={o.on} onClick={() => { onPick(o.value); if (!multi) setOpen(false); }}>{o.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}
