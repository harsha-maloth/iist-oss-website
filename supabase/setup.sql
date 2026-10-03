-- IIST-OSS database.
-- Run this once in the Supabase SQL Editor, on a new project.

-- ============ Tables ============

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique
);

create table admins (
  user_id uuid primary key references profiles(id) on delete cascade
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  repo_url text,
  live_url text,
  languages text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'archived', 'needs_maintainers')),
  is_public boolean not null default true,
  -- Filled in by the sync function:
  stars int not null default 0,
  commits int not null default 0,
  open_issues int not null default 0,
  pushed_at timestamptz,
  is_up boolean,
  checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table project_notes (
  project_id uuid primary key references projects(id) on delete cascade,
  hosting_notes text
);

create table project_maintainers (
  user_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  primary key (user_id, project_id)
);

create table featured (
  project_id uuid primary key references projects(id) on delete cascade,
  display_name text not null,
  usage text not null,
  screenshot_url text,
  sort_order int not null default 0
);

create table proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references profiles(id) on delete cascade,
  name text not null,
  description text not null,
  repo_url text,
  live_url text,
  languages text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  location text,
  description text,
  link text,
  project_id uuid references projects(id) on delete set null,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);
create index on events (starts_at desc);

-- One row only. The sync function updates it.
create table site_stats (
  id int primary key default 1 check (id = 1),
  contributors int not null default 0,
  commits int not null default 0,
  open_issues int not null default 0,
  updated_at timestamptz not null default now()
);
insert into site_stats (id) values (1);

-- ============ Functions ============

create function is_admin() returns boolean language sql stable security definer as
$$ select exists (select 1 from admins where user_id = auth.uid()) $$;

create function is_maintainer(pid uuid) returns boolean language sql stable security definer as
$$ select exists (select 1 from project_maintainers where user_id = auth.uid() and project_id = pid) $$;

-- Makes a profile for every new GitHub sign-in.
create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as
$$ begin
  insert into profiles (id, username) values (new.id, new.raw_user_meta_data->>'user_name') on conflict do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- Profiles for people who signed in before this script ran.
insert into profiles (id, username) select id, raw_user_meta_data->>'user_name' from auth.users on conflict do nothing;

-- Approves a proposal in one step: makes the project, makes the proposer its maintainer, marks the proposal approved.
-- If any part fails, nothing is saved.
create function approve_proposal(pid uuid) returns uuid language plpgsql security definer set search_path = public as
$$
declare
  pr proposals%rowtype;
  base text;
  new_slug text;
  new_id uuid;
begin
  if not is_admin() then raise exception 'Only admins can approve proposals'; end if;
  select * into pr from proposals where id = pid and status = 'pending' for update;
  if not found then raise exception 'Proposal not found'; end if;

  base := trim(both '-' from regexp_replace(lower(pr.name), '[^a-z0-9]+', '-', 'g'));
  if base = '' then base := 'project'; end if;
  new_slug := base;
  if exists (select 1 from projects where slug = new_slug) then
    new_slug := base || '-' || substr(pr.id::text, 1, 4);
  end if;

  insert into projects (slug, name, description, repo_url, live_url, languages)
    values (new_slug, pr.name, pr.description, pr.repo_url, pr.live_url, pr.languages)
    returning id into new_id;
  insert into project_maintainers (user_id, project_id) values (pr.user_id, new_id) on conflict do nothing;
  update proposals set status = 'approved' where id = pr.id;
  return new_id;
end
$$;
revoke execute on function approve_proposal(uuid) from public, anon;
grant execute on function approve_proposal(uuid) to authenticated;

-- ============ Access rules ============

alter table profiles enable row level security;
alter table admins enable row level security;
alter table projects enable row level security;
alter table project_notes enable row level security;
alter table project_maintainers enable row level security;
alter table featured enable row level security;
alter table proposals enable row level security;
alter table events enable row level security;
alter table site_stats enable row level security;

-- profiles: signed-in people can see usernames
create policy "signed-in read profiles" on profiles for select to authenticated using (true);

-- admins: you can see your own row. Admins can see, add and remove admins (but not remove themselves).
create policy "admins read" on admins for select using (user_id = auth.uid() or is_admin());
create policy "admins add" on admins for insert with check (is_admin());
create policy "admins remove others" on admins for delete using (is_admin() and user_id <> auth.uid());

-- projects: everyone sees public ones. Maintainers edit. Only admins add or delete.
create policy "projects read" on projects for select using (is_public or is_admin() or is_maintainer(id));
create policy "projects edit" on projects for update using (is_admin() or is_maintainer(id));
create policy "projects add" on projects for insert with check (is_admin());
create policy "projects delete" on projects for delete using (is_admin());

-- Signed-in people can change only these columns. Stats and uptime come from the sync function.
revoke update on projects from authenticated;
grant update (name, description, repo_url, live_url, languages, status, is_public, updated_at) on projects to authenticated;

-- hosting notes: maintainers and admins only
create policy "notes read" on project_notes for select using (is_admin() or is_maintainer(project_id));
create policy "notes write" on project_notes for all using (is_admin() or is_maintainer(project_id)) with check (is_admin() or is_maintainer(project_id));

-- maintainers: you see your own roles. Admins manage all.
create policy "roles read" on project_maintainers for select using (user_id = auth.uid() or is_admin());
create policy "roles manage" on project_maintainers for all using (is_admin()) with check (is_admin());

-- featured: everyone reads, admins change
create policy "featured read" on featured for select using (true);
create policy "featured manage" on featured for all using (is_admin()) with check (is_admin());

-- proposals: signed-in people send. You see your own. Admins see and decide.
create policy "proposals send" on proposals for insert to authenticated with check (user_id = auth.uid());
create policy "proposals read" on proposals for select using (user_id = auth.uid() or is_admin());
create policy "proposals decide" on proposals for update using (is_admin());
create policy "proposals delete" on proposals for delete using (is_admin());

-- events: everyone sees public ones. Admins manage.
create policy "events read" on events for select using (is_public or is_admin());
create policy "events manage" on events for all using (is_admin()) with check (is_admin());

-- stats: everyone reads
create policy "stats read" on site_stats for select using (true);
