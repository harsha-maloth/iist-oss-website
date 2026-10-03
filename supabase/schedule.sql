-- Runs the sync function every 6 hours.
-- Replace YOUR_REF with the first part of your Supabase URL, and YOUR_SECRET with your CRON_SECRET.
-- Then run this in the SQL Editor.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule('sync-projects', '0 */6 * * *', $$
  select net.http_post(
    url := 'https://YOUR_REF.supabase.co/functions/v1/sync-projects',
    headers := '{"x-cron-secret": "YOUR_SECRET"}'::jsonb
  );
$$);
