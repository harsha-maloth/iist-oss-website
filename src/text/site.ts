import { ORG_URL } from "../config";

export const SITE = {
  name: "IIST-OSS",
  madeBy: "Maloth Harsha",
  fullName: "Indian Institute of Space Science and Technology Open Source Society",
  description: "IIST-OSS is the Indian Institute of Space Science and Technology Open Source Society. We build open-source software with students, teachers and alumni of IIST.",
  footerHeading: "Find us",
  address: ["Indian Institute of Space Science and Technology", "Valiamala, Thiruvananthapuram", "Kerala, India"],
  githubLabel: "github.com/iist-oss",
  rights: "IIST-OSS. MIT license.",
  credit: "Look inspired by [metaKGP](https://metakgp.org).",
  orgUrl: ORG_URL,
};

export const NAV = [
  { to: "/projects", label: "Projects" },
  { to: "/contribute", label: "Contribute" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About" },
];

/** Words used in many places. */
export const UI = {
  skip: "Skip to content",
  mainMenu: "Main menu",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  lightTheme: "Use light theme",
  darkTheme: "Use dark theme",
  lightShort: "Light",
  darkShort: "Dark",
  github: "GitHub",
  signIn: "Sign in",
  signInGithub: "Sign in with GitHub",
  signOut: "Sign out",
  myProjects: "My projects",
  loading: "Loading...",
  checking: "Checking sign in...",
  noDb: "The database is not set up. Add your keys to .env.",
  adminsOnly: "Only admins can open this page.",
  prev: "Prev",
  next: "Next",
  pages: "Pages",
  back: "Back",
};

export const STATUS_LABEL = {
  active: "Active",
  needs_maintainers: "Needs a maintainer",
  archived: "Archived",
} as const;

export const TIME = {
  today: "today",
  yesterday: "yesterday",
  day: "day",
  month: "month",
  year: "year",
  ago: (n: number, unit: string) => `${n} ${unit}${n === 1 ? "" : "s"} ago`,
};
