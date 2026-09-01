import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { CONTACT } from "../engine";

export function Partnership() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "");
    const org = String(data.get("org") || "");
    const role = String(data.get("role") || "");
    const interest = String(data.get("interest") || "");
    const message = String(data.get("message") || "");
    const body = encodeURIComponent(
      `Name: ${name}\nOrganisation: ${org}\nRole: ${role}\nInterest: ${interest}\n\n${message}`,
    );
    const subject = encodeURIComponent(`SYMPHONY industry enquiry — ${org || name}`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <>
      <SiteNav />
      <div className="page-head">
        <div className="kicker" style={{ color: "var(--teal)" }}>Industry</div>
        <h1>Built in a university lab. Meant to leave the lab.</h1>
        <p>
          Traffic police, city ITS teams, systems integrators, and mobility companies can run the
          twin today and talk licensing, a corridor pilot, or a joint deployment next.
        </p>
      </div>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid-3">
          <article className="card">
            <h3>Traffic police / GBA</h3>
            <p>Command-room briefing, scenario walkthrough, and a path to a Silk Board–Marathahalli pilot on live feeds.</p>
          </article>
          <article className="card">
            <h3>ITS integrator</h3>
            <p>API-shaped control loop that can sit above existing signal controllers. Digital twin for pre-deployment tests.</p>
          </article>
          <article className="card">
            <h3>Campus / OEM lab</h3>
            <p>Reproducible stack: OSM, SUMO, public APIs, T-GNN, hierarchical agents. Suitable for joint research contracts.</p>
          </article>
        </div>

        <div className="split" style={{ marginTop: "2.5rem", alignItems: "start" }}>
          <form className="partner" onSubmit={onSubmit}>
            <h3 style={{ margin: 0 }}>Request a briefing</h3>
            <input name="name" required placeholder="Name" />
            <input name="org" required placeholder="Organisation" />
            <input name="role" placeholder="Role" />
            <select name="interest" defaultValue="pilot">
              <option value="pilot">Corridor pilot</option>
              <option value="license">Technology licence</option>
              <option value="integration">Systems integration</option>
              <option value="research">Joint research</option>
            </select>
            <textarea name="message" rows={5} placeholder="What would you like to see in a working session?" />
            <button className="btn btn-dark" type="submit">
              Email {CONTACT.name}
            </button>
            {sent && <p className="note">Your mail client should open with a draft to {CONTACT.email}.</p>}
          </form>
          <div>
            <div className="photo-frame">
              <img src="/images/hero-junction.jpg" alt="Bengaluru junction at dusk" />
            </div>
            <article className="card" style={{ marginTop: "1rem" }}>
              <h3>Contact</h3>
              <p>
                {CONTACT.name}
                <br />
                {CONTACT.dept}
                <br />
                {CONTACT.org}
                <br />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </p>
              <Link to="/app" className="btn btn-teal">
                Try the working app first
              </Link>
            </article>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
