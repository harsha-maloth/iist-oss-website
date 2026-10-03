import { ORG_URL } from "../config";

export const HOME = {
  eyebrow: "Indian Institute of Space Science and Technology Open Source Society",
  line1: "For the people",
  line2: "By the people",
  join: "Join us on GitHub",
  headline: "IIST-OSS is the open source society of IIST. We build, maintain and share software that anyone can use, read and improve.",
  primary: "Projects",
  secondary: "Contribute",
  statsHeading: "In numbers",
  stats: { projects: "Projects", contributors: "Contributors", commits: "Commits", issues: "Open issues" },
  doTitle: "Get involved",
  tasks: [
    { to: "/projects", title: "Explore projects", text: "Browse the software built by the IIST community. Use it, study it or improve it.", cta: "View projects" },
    { to: "/contribute", title: "Contribute", text: "Choose a small, well-defined task. Maintainers will review your work and give feedback.", cta: "Read the guide" },
    { to: "/propose", title: "Submit a project", text: "Submit your own project for listing. An admin reviews every submission.", cta: "Submit a project" },
  ],
  eventsTitle: "Upcoming events",
  eventsAll: "All events",
  featuredTitle: "Featured projects",
  featuredOpen: "Open",
  needyTitle: "Needs a maintainer",
  needyText: "These projects are in use but have no active maintainer. Taking one on is a valuable way to contribute.",
  needyAll: "All projects seeking maintainers",
  recentTitle: "Recent updates",
  recentEmpty: "Nothing yet. Updates show up after the first sync with GitHub.",
  recentEmptyTitle: "No updates",
  updated: "Updated",
};

export const PROJECTS = {
  title: "Projects",
  intro: "Open source software built by students, teachers and alumni of IIST. Use it, study it and contribute to it.",
  perPage: 15,
  filterBy: "Filter",
  status: "Status",
  language: "Language",
  sortBy: "Sort",
  statuses: [["all", "All"], ["needs_maintainers", "Needs a maintainer"], ["active", "Active"]] as [string, string][],
  sorts: [["stars", "Most stars"], ["activity", "Latest update"], ["name", "Name A to Z"]] as [string, string][],
  search: "Search projects",
  loading: "Loading projects...",
  error: "Could not load projects. Try again later.",
  count: (n: number) => `${n} ${n === 1 ? "project" : "projects"}`,
  clear: "Clear filters",
  emptyTitle: "No projects yet",
  emptyText: "Be the first to add one.",
  noMatchTitle: "No match",
  noMatchText: "Try other words, or clear the filters.",
  online: "Online",
  offline: "Offline",
  open: "Open",
  code: "Code",
  stars: (n: number) => `${n} ${n === 1 ? "star" : "stars"}`,
};

export const CONTRIBUTE = {
  title: "Contribute",
  intro: "A short guide to making your first contribution. You can pause after any step and return later.",
  steps: [
    { title: "Pick a project", text: "Open the [Projects page](/projects) and choose a project you would use. Projects seeking maintainers benefit most from new contributors." },
    { title: "Run it", text: "Read the project's README on GitHub, then set it up and run it on your own computer.", terminal: "$ git clone https://github.com/iist-oss/PROJECT_NAME.git\n$ cd PROJECT_NAME/" },
    { title: "Change one small thing", text: "Fix a typo, a bug or an unclear explanation. If you are unsure what to work on, open an issue and ask. Make your changes in your own fork of the repository.", terminal: "$ git clone 'https://github.com/YOUR_USERNAME/YOUR_FORK'\n$ cd YOUR_FORK/\n$ git checkout -b my-change" },
    { title: "Send it", text: "Push your branch and open a pull request. A maintainer will review it and may request small changes, which is a normal part of the process." },
  ] as { title: string; text: string; terminal?: string }[],
  otherTitle: "Contributing without code",
  other: ["Write or improve documentation", "Test projects and report bugs", "Suggest or design improvements", "Tell us which tools the IIST community needs"],
  helpTitle: "Getting help",
  helpText: "Ask questions in the issues or discussions of any project repository. Every question is welcome.",
  githubButton: "IIST-OSS on GitHub",
  projectsButton: "View projects",
  linksTitle: "Useful links",
  links: [
    { label: "Learn Git Branching", url: "https://learngitbranching.js.org/" },
    { label: "Good First Issues", url: "https://goodfirstissue.dev/" },
    { label: "IIST-OSS on GitHub", url: ORG_URL },
  ],
  terminalLabel: "Terminal commands",
  terminalTitle: "Terminal",
};

export const EVENTS = {
  title: "Events",
  intro: "Meetups, coding sessions, workshops and talks organised by IIST-OSS.",
  loading: "Loading events...",
  error: "Could not load events. Try again later.",
  noneTitle: "No events scheduled",
  noneText: `No events are scheduled right now. Follow [IIST-OSS on GitHub](${ORG_URL}) for announcements.`,
  past: "Past events",
  register: "Register",
  project: "Project:",
};

export const ABOUT = {
  title: "About",
  intro: "Who we are, what we do and how to take part.",
  quote: "Open source lets people build, learn and help each other.",
  story: "IIST-OSS is the Indian Institute of Space Science and Technology Open Source Society. It was founded by Maloth Harsha, a B.Tech student in Electronics and Communication Engineering at IIST, on 3 October 2026. The aim is to give the IIST community one place to share projects, maintain existing software and solve problems on campus.",
  who: "IIST-OSS is an independent society open to **students, teachers and alumni** of IIST. We build tools, maintain software, write documentation and fix what is broken.",
  join: "You can contribute by writing code, improving a project, writing documentation, designing interfaces, testing software, reporting bugs or proposing ideas.",
  easy: "Prior experience is not required. Start with a small task and learn as you go.",
  // To show a photo, put the file in public/photos/ and write its path here, for example "photos/team.jpg".
  photo: { src: "", alt: "People from IIST-OSS", caption: "People from IIST-OSS" },
  contactTitle: "Contact",
  contactText: "The best way to reach us is on GitHub. Open an issue, start a discussion or send a pull request.",
  contactButton: "IIST-OSS on GitHub",
};

export const PROPOSE = {
  title: "Submit a project",
  lead: "Tell us about your project. If an admin approves it, it will be listed on the site and you will be recorded as its maintainer.",
  name: "Name",
  description: "What does it do?",
  repo: "Repository link",
  live: "Live site link (optional)",
  languages: "Languages (separate with commas)",
  send: "Send",
  required: "Name and description are required.",
  sending: "Sending...",
  failed: "Could not send. Try again.",
  sent: "Sent. An admin will review it.",
};

export const ACCOUNT = {
  title: "My projects",
  lead: "Sign in with GitHub to see your projects.",
  signedInAs: (name: string) => `Signed in as ${name}.`,
  admin: " You are an admin.",
  addProject: "Add a project",
  adminPanel: "Admin panel",
  loading: "Loading your projects...",
  error: "Could not load your projects.",
  empty: "You do not look after any project yet. Ask an admin to add you.",
  hidden: "Hidden",
  liveSite: "Live site",
  github: "GitHub",
};

export const EDITOR = {
  title: "Edit project",
  heading: (name: string) => `Edit ${name}`,
  loading: "Loading...",
  notFound: "Project not found, or you cannot open it.",
  name: "Name",
  description: "Description",
  repo: "Repository link",
  live: "Live site link",
  languages: "Languages (separate with commas)",
  status: "Status",
  isPublic: "Show on the public site",
  notes: "Hosting notes (only maintainers see this)",
  notesHelp: "Say where it is hosted, who owns the domain and where the settings are kept. Never write passwords or keys.",
  save: "Save",
  saving: "Saving...",
  saved: "Saved.",
  saveFailed: "Could not save. You may not have permission.",
  notesFailed: "The project was saved, but the hosting notes were not.",
  maintainers: "Maintainers",
  maintainerPlaceholder: "GitHub username",
  addMaintainer: "Add",
  removeMaintainer: "Remove",
  removeConfirm: "Remove this maintainer?",
  noUser: "No user with that username. They must sign in once first.",
  addFailed: "Could not add this person.",
  danger: "Delete project",
  deleteButton: "Delete this project",
  deleteConfirm: (name: string) => `Delete "${name}"? Its maintainers, notes and featured entry are deleted too. Events stay.`,
  deleteFailed: "Could not delete the project.",
};

export const NOT_FOUND = {
  title: "Page not found",
  text: "This page does not exist.",
  button: "Go home",
};

export const ERROR_PAGE = {
  title: "Something went wrong",
  text: "Reload the page. If it keeps happening, tell us on GitHub.",
  button: "Reload",
};

export const PRIVACY = {
  title: "Privacy",
  intro: "What this website stores, why, and how to have it removed.",
  updated: "Last updated 3 October 2026",
  blocks: [
    { title: "If you only browse", text: "You can read every public page without signing in. We do not run analytics or advertising. The site remembers your light or dark choice in your browser. Fonts load from Google Fonts, so your browser contacts Google when a page opens." },
    { title: "If you sign in", text: "Sign-in uses your GitHub account through Supabase. We store your GitHub username to show your projects and your role. Supabase also keeps the account details GitHub shares, such as your email address, so that you can stay signed in. Your sign-in session is kept in your browser." },
    { title: "What you submit", text: "If you submit a project, we store its name, description, links and languages, and the account that sent it. Approved projects are public. Notes that maintainers write on a project stay private to admins and maintainers." },
    { title: "Who can see it", text: "Admins can see submissions and the list of admins. We do not sell your data or share it for advertising. Data is held on Supabase and the site is hosted on GitHub Pages." },
    { title: "Removal and questions", text: "To delete your account or correct your data, open an issue on our GitHub page or contact an owner. Include your GitHub username." },
  ] as { title: string; text: string }[],
};
