import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { AuthProvider } from "../data/auth";
import { UI } from "../text/site";
import AdminLayout from "../admin/AdminLayout";
import AdminEditProject from "../admin/AdminEditProject";
import AdminEvents from "../admin/Events";
import AdminFeatured from "../admin/Featured";
import AdminPeople from "../admin/People";
import AdminProjects from "../admin/Projects";
import AdminProposals from "../admin/Proposals";
import AdminOverview from "../admin/Overview";
import About from "../pages/About";
import Account from "../pages/Account";
import Contribute from "../pages/Contribute";
import EditProject from "../pages/EditProject";
import Events from "../pages/Events";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Projects from "../pages/Projects";
import Privacy from "../pages/Privacy";
import Propose from "../pages/Propose";
import Footer from "./Footer";
import Header from "./Header";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { const saved = localStorage.getItem("theme"); if (saved) return saved; } catch { /* storage is blocked */ }
    return "dark";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch { /* storage is blocked */ }
  }, [theme]);
  return [theme, () => setTheme(t => (t === "dark" ? "light" : "dark"))] as const;
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const { pathname } = useLocation();

  return (
    <AuthProvider>
      <a className="skip" href="#main" onClick={e => { e.preventDefault(); document.getElementById("main")?.focus(); }}>{UI.skip}</a>
      <ScrollToTop />
      <div className="rails" aria-hidden="true"><div className="container"><div /></div></div>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main id="main" tabIndex={-1}>
        <ErrorBoundary key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/propose" element={<Propose />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/:slug" element={<EditProject />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="proposals" element={<AdminProposals />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="projects/:slug" element={<AdminEditProject />} />
              <Route path="featured" element={<AdminFeatured />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="people" element={<AdminPeople />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </AuthProvider>
  );
}
