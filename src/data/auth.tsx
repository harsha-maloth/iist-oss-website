import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./client";

interface AuthState { user: User | null; isAdmin: boolean; ready: boolean }

const Ctx = createContext<AuthState>({ user: null, isAdmin: false, ready: !supabase });

/** Keeps one copy of the sign-in state for the whole app. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isAdmin: false, ready: !supabase });

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const apply = async (user: User | null) => {
      let isAdmin = false;
      if (user) {
        const { data } = await client.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
        isAdmin = !!data;
      }
      setState({ user, isAdmin, ready: true });
    };
    client.auth.getSession().then(({ data }) => apply(data.session?.user ?? null));
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => { apply(session?.user ?? null); });
    return () => sub.subscription.unsubscribe();
  }, []);

  return <Ctx.Provider value={state}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

export const signIn = () =>
  supabase?.auth.signInWithOAuth({ provider: "github", options: { redirectTo: window.location.origin + window.location.pathname } });
export const signOut = () => supabase?.auth.signOut();

export const userName = (user: User | null) => (user?.user_metadata?.user_name as string | undefined) || user?.email || "";
