import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/technology", label: "Technology" },
  { to: "/results", label: "Results" },
  { to: "/ip", label: "Patent" },
  { to: "/partnership", label: "Industry" },
];

export function SiteNav() {
  return (
    <header className="site-nav">
      <Link to="/" className="brand">
        <strong>SYMPHONY</strong>
        <span>BITS Pilani · Digital Twin</span>
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? "active" : "")}>
            {l.label}
          </NavLink>
        ))}
        <Link to="/app" className="btn btn-dark">
          Open command centre
        </Link>
      </nav>
    </header>
  );
}
