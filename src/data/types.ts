export type Status = "active" | "needs_maintainers" | "archived";

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  repo_url: string | null;
  live_url: string | null;
  languages: string[];
  stars: number;
  status: Status;
  is_public: boolean;
  is_up: boolean | null;
  pushed_at: string | null;
  commits: number;
  open_issues: number;
}

export interface SiteStats {
  contributors: number;
  commits: number;
  open_issues: number;
  updated_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  starts_at: string;
  location: string | null;
  description: string | null;
  link: string | null;
  is_public: boolean;
  project_id: string | null;
  projects: { name: string; slug: string } | null;
}

export interface Featured {
  project_id: string;
  display_name: string;
  usage: string;
  screenshot_url: string | null;
  project: Project;
}
