import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { CLAIMS, CONTACT, PATENT } from "../engine";

export function IntellectualProperty() {
  return (
    <>
      <SiteNav />
      <div className="page-head">
        <div className="kicker" style={{ color: "var(--teal)" }}>Intellectual property</div>
        <h1>Amended claims 1–10, as submitted with the FER response.</h1>
        <p>
          Indian Patent Application {PATENT.number}. FER dated {PATENT.ferDate}. Response and
          amended claims filed {PATENT.responseDate}. The wording below is the industry map of
          those claims, not a substitute for the complete specification.
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
            <p>{PATENT.status}</p>
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
            <h3>Inventor and agent</h3>
            <p>
              {PATENT.inventor}
              <br />
              {CONTACT.dept}, {PATENT.campus}
              <br />
              Agent: {PATENT.agent}
            </p>
          </article>
        </div>

        <h2 style={{ marginTop: "3rem" }}>Claim 1 — the independent claim</h2>
        <article className="card">
          <p>
            A hierarchical multi-agent system for adaptive traffic signal control with temporal
            prediction. Three distinct language models, different in parameter scale and inference
            latency, are assigned by decision timescale: the largest and slowest at network level
            (hours), the middle at corridor level (minutes), the smallest and fastest at each
            junction (sub-second). A spatiotemporal predictor feeds all three levels. Signal
            controllers actuate physically and fall back to local logic if the centre drops out.
            Fusion, a rolling-window store, command generation, and post-actuation feedback close
            the loop. The system keeps running under partial data, communication, or hardware
            failure.
          </p>
        </article>

        <h2 style={{ marginTop: "3rem" }}>Claims 2–10 — the dependent set</h2>
        <div className="grid-2">
          {CLAIMS.filter((c) => c.n > 1).map((c) => (
            <article key={c.n} className="card">
              <h3>
                Claim {c.n} · {c.title}
              </h3>
              <p>{c.gist}</p>
            </article>
          ))}
        </div>

        <article className="card" style={{ marginTop: "1.4rem" }}>
          <h3>How industry should treat this demo</h3>
          <p>
            The command centre is built so a visitor can see each claimed module working: two-source
            fusion, an eight-snapshot window, GraphConv + Bi-LSTM + attention forecasts, three
            timescale-matched agents, a 200 ms junction budget, corridor offsets, incident/VIP
            directives, predicted-versus-observed residuals, and a comms-outage fail-safe. It is a
            demonstration, not a live police deployment and not a licence. Commercial use goes
            through BITS Pilani and the applicant company.
          </p>
        </article>
      </section>
      <SiteFooter />
    </>
  );
}
