import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { CONTACT, PATENT } from "../engine";

export function IntellectualProperty() {
  return (
    <>
      <SiteNav />
      <div className="page-head">
        <div className="kicker" style={{ color: "var(--teal)" }}>Intellectual property</div>
        <h1>Filed, examined, and ready to discuss under campus rules.</h1>
        <p>
          BITS Pilani asked that this work be shared with industry. The patent is the envelope
          around the software. This page is the briefing note a visitor can take away.
        </p>
      </div>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid-2">
          <article className="card">
            <h3>Application</h3>
            <p>
              <strong>{PATENT.number}</strong>
              <br />
              {PATENT.title}
            </p>
          </article>
          <article className="card">
            <h3>Status</h3>
            <p>{PATENT.status} Sharing with industry is for demonstration and partnership discussion, not a public claim-by-claim dump of the amended set.</p>
          </article>
          <article className="card">
            <h3>Applicant</h3>
            <p>
              {PATENT.applicant}
              <br />
              Faculty entrepreneurship vehicle associated with {CONTACT.org}.
            </p>
          </article>
          <article className="card">
            <h3>Inventor</h3>
            <p>
              {PATENT.inventor}
              <br />
              {CONTACT.dept}, {PATENT.campus}
            </p>
          </article>
        </div>

        <h2 style={{ marginTop: "3rem" }}>What is protected, in plain language</h2>
        <div className="grid-3">
          <article className="card">
            <h3>Hierarchical LLM control</h3>
            <p>
              Different models, different timescales, bidirectional flow: directives down, reports
              up. Not a single flat agent on every signal.
            </p>
          </article>
          <article className="card">
            <h3>Predict-then-actuate</h3>
            <p>
              An 18-feature temporal GNN sits between fused observations and the agents, so control
              is not purely reactive.
            </p>
          </article>
          <article className="card">
            <h3>Open-data twin</h3>
            <p>
              OSM geometry, SUMO microsimulation, public speed APIs. The twin is how a plan is
              tried before it is deployed.
            </p>
          </article>
        </div>

        <article className="card" style={{ marginTop: "1.4rem" }}>
          <h3>How industry should treat this demo</h3>
          <p>
            The website and command centre implement the architecture for demonstration. They do not
            replace the research repository, the SUMO evaluation, or a licensed field deployment.
            Commercial use, OEM integration, or a city pilot should go through BITS Pilani and the
            applicant company, with an NDA if claim charts or source models are required.
          </p>
        </article>
      </section>
      <SiteFooter />
    </>
  );
}
