// Copies stars, commits and issue counts from GitHub, and checks if each live site is up.
// Runs every 6 hours. See supabase/schedule.sql.
import { createClient } from "npm:@supabase/supabase-js@2";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

const parseRepo = (url: string | null) => {
  const m = url?.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/, "") } : null;
};

const ghHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "User-Agent": "iist-oss-sync", Accept: "application/vnd.github+json" };
  const token = Deno.env.get("GITHUB_TOKEN");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

async function commitCount(owner: string, repo: string): Promise<number> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, { headers: ghHeaders() });
  if (res.status === 409) return 0; // empty repository
  if (!res.ok) throw new Error(`GitHub ${res.status} commits for ${owner}/${repo}`);
  // With one commit per page, the number of the last page is the number of commits.
  const last = res.headers.get("link")?.match(/[?&]page=(\d+)>; rel="last"/);
  if (last) return Number(last[1]);
  const list = await res.json();
  return Array.isArray(list) ? list.length : 0;
}

async function contributorLogins(owner: string, repo: string): Promise<string[]> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`, { headers: ghHeaders() });
  if (res.status === 204) return [];
  if (!res.ok) throw new Error(`GitHub ${res.status} contributors for ${owner}/${repo}`);
  const list = await res.json();
  return Array.isArray(list) ? list.filter((c: { type?: string }) => c.type === "User").map((c: { login: string }) => c.login) : [];
}

async function githubStats(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: ghHeaders() });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${owner}/${repo}`);
  const j = await res.json();
  const [commits, logins] = await Promise.all([commitCount(owner, repo), contributorLogins(owner, repo)]);
  return {
    update: { stars: j.stargazers_count as number, pushed_at: j.pushed_at as string, open_issues: j.open_issues_count as number, commits },
    logins,
  };
}

async function isUp(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000), redirect: "follow" });
    return res.status < 500;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) return new Response("Unauthorized", { status: 401 });

  const { data: projects, error } = await db.from("projects").select("id, repo_url, live_url").neq("status", "archived");
  if (error) return new Response(error.message, { status: 500 });

  const errors: string[] = [];
  const contributors = new Set<string>();

  await Promise.all(projects.map(async (p) => {
    const update: Record<string, unknown> = {};
    const gh = parseRepo(p.repo_url);
    if (gh) {
      try {
        const r = await githubStats(gh.owner, gh.repo);
        Object.assign(update, r.update);
        r.logins.forEach((l) => contributors.add(l));
      } catch (e) { errors.push(String(e)); }
    }
    if (p.live_url) Object.assign(update, { is_up: await isUp(p.live_url), checked_at: new Date().toISOString() });
    if (Object.keys(update).length) await db.from("projects").update(update).eq("id", p.id);
  }));

  const { data: rows } = await db.from("projects").select("commits, open_issues").eq("is_public", true);
  const totals: Record<string, unknown> = {
    commits: (rows ?? []).reduce((n, r) => n + (r.commits ?? 0), 0),
    open_issues: (rows ?? []).reduce((n, r) => n + (r.open_issues ?? 0), 0),
    updated_at: new Date().toISOString(),
  };
  // If GitHub failed for any project, keep the old contributor count instead of a wrong one.
  if (errors.length === 0) totals.contributors = contributors.size;
  await db.from("site_stats").update(totals).eq("id", 1);

  return Response.json({ checked: projects.length, errors });
});
