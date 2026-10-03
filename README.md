# IIST-OSS

Indian Institute of Space Science and Technology Open Source Society.

The website of IIST-OSS. The site runs on GitHub Pages. The database and sign-in run on Supabase.

Replace `USERNAME`, `REPO` and `REF` with your own values. `REF` is the first part of your Supabase URL (`REF.supabase.co`).

## 1. Supabase
1. Create a project at supabase.com.
2. Go to Project Settings > API. Copy the **Project URL** and the **anon public key**.
3. Open the SQL Editor, paste `supabase/setup.sql` and run it. Run it once, on a new project.

## 2. GitHub sign-in
1. On GitHub go to Settings > Developer settings > OAuth Apps > New OAuth App.
2. Homepage URL: `https://USERNAME.github.io/REPO/`
   Callback URL: `https://REF.supabase.co/auth/v1/callback`
3. Create a client secret.
4. In Supabase go to Authentication > Providers > GitHub. Turn it on and paste the client ID and secret.
5. In Supabase go to Authentication > URL Configuration.
   - Site URL: `https://USERNAME.github.io/REPO/`
   - Redirect URLs: `https://USERNAME.github.io/REPO/**` and `http://localhost:5173/**`

## 3. Run it on your computer
1. Copy `.env.example` to `.env`. Fill in the Project URL and the anon key.
2. Run `npm install`, then `npm run dev`.
3. Open the address it shows and click **Sign in**.
4. Make yourself an admin. Run this in the Supabase SQL Editor:
   ```sql
   insert into admins (user_id)
   select id from auth.users where raw_user_meta_data->>'user_name' = 'YOUR_GITHUB_USERNAME';
   ```
5. Reload the page. **My projects** now shows in the header, and it has a button for the admin panel.

Without the `.env` values, the site shows two sample projects.

## 4. Stats and uptime (optional)
A small job copies stars, commits and issue counts from GitHub. It also checks if each live site is up.

1. Run `npx supabase login`, then `npx supabase link --project-ref REF`.
2. Run `npx supabase secrets set CRON_SECRET=a-long-random-text`. You can add `GITHUB_TOKEN=your-token` to the same command. The token needs no permissions. It only raises GitHub's request limit.
3. Run `npx supabase functions deploy sync-projects --no-verify-jwt`.
4. Test it: `curl -X POST https://REF.supabase.co/functions/v1/sync-projects -H "x-cron-secret: a-long-random-text"`
5. To run it every 6 hours, put your `REF` and secret into `supabase/schedule.sql` and run it in the SQL Editor.

## 5. Publish on GitHub Pages
1. Push this folder to the `main` branch of your repository.
2. In the repository go to Settings > Pages. Set Source to **GitHub Actions**.
3. Go to Settings > Secrets and variables > Actions. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never add the Supabase service role key.
4. Every push to `main` builds and publishes the site.

## Admin panel
Open it from **My projects**. The menu has six parts:
- **Overview:** what needs attention, and when GitHub was last synced.
- **Proposals:** approve, reject or delete.
- **Projects:** search, edit, hide or delete. You can also import the public repositories of your GitHub organization.
- **Featured:** pick the projects shown on the home page, and set their order.
- **Events:** add, edit, hide or delete.
- **People:** make someone an admin, or remove an admin. The person must have signed in once.

## Change the text
- Words: `src/text/`. It has three files: `site.ts` (header, footer, common words), `pages.ts` (public pages) and `admin.ts` (admin panel).
- GitHub organization link: `src/config.ts`.
- Colors and fonts: `src/styles/base.css`. Layout: the other files in `src/styles/`.
- Photos: put them in `public/photos/`, then write the path in `src/text/pages.ts`.

## Folders
```
src/
  app/          App, routes, header, footer
  pages/        public pages, sign-in pages
  admin/        admin panel, one file per menu item
  components/   parts used in many places
  data/         database client, sign-in, data hooks
  text/         all the words
  styles/       CSS
supabase/       database setup, sync function, schedule
```

## License
MIT. See [LICENSE](LICENSE).

## Before launch
1. Run `npm install` once on your computer and commit the new `package-lock.json`. The deploy then uses `npm ci`.
2. Check that the GitHub OAuth app and the Supabase Site URL and Redirect URLs use the live address.
3. In `index.html`, change the `og:image` address if your site URL is not `https://harsha-maloth.github.io/libre-iist/`.
4. Add real projects in the admin panel, or import them from GitHub.
5. Supabase free projects pause after about a week of inactivity. Set a free uptime ping or upgrade.
