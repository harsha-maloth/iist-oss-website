import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** null when the .env keys are missing. Public pages then show sample data. */
export const supabase = url && key ? createClient(url, key, { auth: { flowType: "pkce" } }) : null;

/** For signed-in pages only. They are never shown when `supabase` is null (see Gate). */
export const db = supabase as NonNullable<typeof supabase>;
