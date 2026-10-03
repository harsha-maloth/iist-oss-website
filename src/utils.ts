import { TIME } from "./text/site";

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const toList = (s: string) => s.split(",").map(x => x.trim()).filter(Boolean);
export const normUrl = (u: string | null | undefined) => (u ?? "").toLowerCase().replace(/\.git$/, "").replace(/\/$/, "");
export const formatNumber = (n: number | undefined) => (n == null ? "-" : new Intl.NumberFormat("en-IN").format(n));

export const dateShort = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
export const dateLong = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });

/** Value for an <input type="datetime-local"> in the user's own time zone. */
export const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

export const timeAgo = (iso: string) => {
  const days = Math.max(0, Date.now() - Date.parse(iso)) / 864e5;
  if (days < 1) return TIME.today;
  if (days < 2) return TIME.yesterday;
  if (days < 30) return TIME.ago(Math.floor(days), TIME.day);
  if (days < 365) return TIME.ago(Math.floor(days / 30), TIME.month);
  return TIME.ago(Math.floor(days / 365), TIME.year);
};
