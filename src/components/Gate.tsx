import type { ReactNode } from "react";
import { signIn, useAuth } from "../data/auth";
import { supabase } from "../data/client";
import { UI } from "../text/site";
import { PageHead } from "./page";

/** Shows its children only to signed-in users (or only to admins when `admin` is set). */
export function Gate({ admin, children }: { admin?: boolean; children: ReactNode }) {
  const { user, isAdmin, ready } = useAuth();
  if (!supabase) return <p className="msg">{UI.noDb}</p>;
  if (!ready) return <p className="msg">{UI.checking}</p>;
  if (!user) return <button className="btn primary" onClick={() => signIn()}>{UI.signInGithub}</button>;
  if (admin && !isAdmin) return <p className="msg">{UI.adminsOnly}</p>;
  return <>{children}</>;
}

/** A full page with a title that needs sign in. */
export function MemberPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <PageHead title={title} compact />
      <div className="wrap page-pad"><section><Gate>{children}</Gate></section></div>
    </>
  );
}
