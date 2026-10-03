import type { ReactNode } from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

/** A short message under a form or list. `error` colors it red. */
export function Msg({ children, error }: { children?: ReactNode; error?: boolean }) {
  if (!children) return null;
  return <p className={"msg" + (error ? " err" : "")} role="status">{children}</p>;
}
