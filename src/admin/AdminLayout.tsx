import { useCallback, useEffect, useState } from "react";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import { Gate } from "../components/Gate";
import { PageHead } from "../components/page";
import { db } from "../data/client";
import { useAuth } from "../data/auth";
import { ADMIN } from "../text/admin";

const MENU = [
  { to: "/admin", label: ADMIN.menu.overview, end: true },
  { to: "/admin/proposals", label: ADMIN.menu.proposals, badge: true },
  { to: "/admin/projects", label: ADMIN.menu.projects },
  { to: "/admin/featured", label: ADMIN.menu.featured },
  { to: "/admin/events", label: ADMIN.menu.events },
  { to: "/admin/people", label: ADMIN.menu.people },
];

/** Pages inside the admin panel call this after they change proposals, so the count in the menu stays right. */
export interface AdminContext { refreshPending: () => void; pending: number }
export const useAdmin = () => useOutletContext<AdminContext>();

export default function AdminLayout() {
  const { isAdmin } = useAuth();
  const [pending, setPending] = useState(0);

  const refreshPending = useCallback(async () => {
    const { count } = await db.from("proposals").select("id", { count: "exact", head: true }).eq("status", "pending");
    setPending(count ?? 0);
  }, []);
  useEffect(() => { if (isAdmin) refreshPending(); }, [isAdmin, refreshPending]);

  return (
    <>
      <PageHead title={ADMIN.title} compact />
      <div className="wrap page-pad">
        <section>
          <Gate admin>
            <div className="admin">
              <nav className="admin-menu" aria-label={ADMIN.menuLabel}>
                {MENU.map(m => (
                  <NavLink key={m.to} to={m.to} end={m.end} className={({ isActive }) => "admin-link" + (isActive ? " on" : "")}>
                    {m.label}
                    {m.badge && pending > 0 && <span className="badge">{pending}</span>}
                  </NavLink>
                ))}
              </nav>
              <div className="admin-main">
                <Outlet context={{ refreshPending, pending } satisfies AdminContext} />
              </div>
            </div>
          </Gate>
        </section>
      </div>
    </>
  );
}
