import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./client";
import type { EventItem, Featured, Project, SiteStats } from "./types";
import { PROJECTS, EVENTS } from "../text/pages";

// Shown when the database is not set up, so the site still looks right on a fresh clone.
const SAMPLE: Project[] = [
  { id: "sample-1", slug: "timetable", name: "Timetable", description: "Add your class timetable to your calendar app.", repo_url: null, live_url: null, languages: ["TypeScript"], stars: 0, status: "active", is_public: true, is_up: null, pushed_at: null, commits: 0, open_issues: 0 },
  { id: "sample-2", slug: "question-papers", name: "Question Papers", description: "Search old question papers.", repo_url: null, live_url: null, languages: ["Python", "TypeScript"], stars: 0, status: "needs_maintainers", is_public: true, is_up: null, pushed_at: null, commits: 0, open_issues: 0 },
];

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(supabase ? [] : SAMPLE);
  const [featured, setFeatured] = useState<Featured[]>([]);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    (async () => {
      const [p, f] = await Promise.all([
        client.from("projects").select("*").eq("is_public", true),
        client.from("featured").select("project_id,display_name,usage,screenshot_url,sort_order,projects(*)").order("sort_order"),
      ]);
      if (p.error || f.error) setError(PROJECTS.error);
      else {
        setProjects(p.data as unknown as Project[]);
        setFeatured(
          (f.data as any[])
            .filter(r => r.projects)
            .map(r => ({ project_id: r.project_id, display_name: r.display_name, usage: r.usage, screenshot_url: r.screenshot_url, project: r.projects })),
        );
      }
      setLoading(false);
    })();
  }, []);

  return { projects, featured, loading, error };
}

export function useStats() {
  const [stats, setStats] = useState<SiteStats | null>(null);
  useEffect(() => {
    if (!supabase) return;
    supabase.from("site_stats").select("contributors,commits,open_issues,updated_at").eq("id", 1).maybeSingle()
      .then(({ data }) => setStats((data as unknown as SiteStats | null) ?? null));
  }, []);
  return stats;
}

/** Pass `true` in the admin panel to also get hidden events. */
export function useEvents(includeHidden = false) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState("");

  const reload = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("events")
      .select("id,title,starts_at,location,description,link,is_public,project_id,projects(name,slug)")
      .order("starts_at");
    if (error) setError(EVENTS.error);
    else setEvents(((data as unknown as EventItem[]) ?? []).filter(e => includeHidden || e.is_public));
    setLoading(false);
  };
  useEffect(() => { reload(); }, []);

  return { events, loading, error, reload };
}

/** Admins get every project. Everyone else gets the projects they maintain. */
export function useMyProjects(user: User | null, isAdmin: boolean) {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!supabase || !user) return;
    const client = supabase;
    setLoading(true);
    (async () => {
      if (isAdmin) {
        const { data, error } = await client.from("projects").select("*").order("name");
        if (error) setError(true); else setItems(data as unknown as Project[]);
      } else {
        const { data, error } = await client.from("project_maintainers").select("projects(*)").eq("user_id", user.id);
        if (error) setError(true); else setItems((data as any[]).map(r => r.projects).filter(Boolean));
      }
      setLoading(false);
    })();
  }, [user, isAdmin]);

  return { items, loading, error };
}
