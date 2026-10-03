import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Mark, MoonIcon, SunIcon } from "../components/icons";
import { signIn, useAuth } from "../data/auth";
import { supabase } from "../data/client";
import { NAV, SITE, UI } from "../text/site";

const linkClass = ({ isActive }: { isActive: boolean }) => "nav-link" + (isActive ? " active" : "");

export default function Header({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const { user, ready } = useAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const dark = theme === "dark";
  const canSignIn = ready && !!supabase && !user;

  // Close the phone menu after a click, and stop the page behind it from scrolling.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <nav className="navbar" aria-label={UI.mainMenu}>
          <Link className="logo" to="/" aria-label={SITE.name}><span className="mark"><Mark /></span><b>{SITE.name}</b></Link>

          <ul className="nav-desktop">
            {NAV.map(n => <li key={n.to}><NavLink to={n.to} className={linkClass}><span>{n.label}</span></NavLink></li>)}
            <li><a className="nav-link" href={SITE.orgUrl} target="_blank" rel="noreferrer"><span>{UI.github}</span></a></li>
            {user && <li><NavLink to="/account" className={linkClass}><span>{UI.myProjects}</span></NavLink></li>}
            {canSignIn && <li><button type="button" className="nav-link" onClick={() => signIn()}><span>{UI.signIn}</span></button></li>}
            <li>
              <button type="button" className="nav-link icon" onClick={toggleTheme} aria-label={dark ? UI.lightTheme : UI.darkTheme} title={dark ? UI.lightTheme : UI.darkTheme}>
                {dark ? <SunIcon /> : <MoonIcon />}
              </button>
            </li>
          </ul>

          <button type="button" className="burger" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(o => !o)}>
            <span className="sr">{open ? UI.closeMenu : UI.openMenu}</span><i /><i />
          </button>
        </nav>
      </header>

      <div id="menu" className={"mobile-menu" + (open ? " open" : "")}>
        <ul>
          {NAV.map(n => <li key={n.to}><NavLink to={n.to} className={({ isActive }) => (isActive ? "active" : "")}>{n.label}</NavLink></li>)}
          <li><a href={SITE.orgUrl} target="_blank" rel="noreferrer">{UI.github}</a></li>
          {user && <li><NavLink to="/account">{UI.myProjects}</NavLink></li>}
          {canSignIn && <li><button type="button" onClick={() => signIn()}>{UI.signIn}</button></li>}
          <li><button type="button" onClick={toggleTheme}>{dark ? UI.lightShort : UI.darkShort}</button></li>
        </ul>
      </div>
    </>
  );
}
