import { Link } from "react-router-dom";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { EVALUATION, PATENT } from "../engine";

export function Home() {
  return (
    <>
      <SiteNav />
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">BITS Pilani · Industry briefing</div>
          <h1>A working digital twin for Bengaluru traffic, ready to show a partner.</h1>
          <p className="lede">
            Amended claims 1–10 sit in front of the Controller. Three language models of different
            scale and latency run at junction, corridor, and city timescales. A temporal graph
            network feeds all three. Controllers stay up if the centre drops. This site is the
            working demonstration the campus can put in front of industry.
          </p>
          <div className="hero-actions">
            <Link to="/app" className="btn btn-teal">
              Launch command centre
            </Link>
            <Link to="/partnership" className="btn btn-ghost" style={{ color: "white", borderColor: "#3a5470" }}>
              Partner with us
            </Link>
          </div>
          <div className="hero-meta">
            <div>
              <b>{EVALUATION.paper.delayReduction}%</b>
              <span>delay cut vs fixed-time</span>
            </div>
            <div>
              <b>{EVALUATION.paper.speedGain}%</b>
              <span>mean speed gain</span>
            </div>
            <div>
              <b>{PATENT.number}</b>
              <span>Indian patent application</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <img src="/images/hero-orr.jpg" alt="Bengaluru Outer Ring Road at dusk" />
          <div className="hero-badge">
            Silk Board to Marathahalli · six signalised junctions · 15 km corridor twin
          </div>
        </div>
      </section>

      <section className="section">
        <h2>What a city operator can do with it</h2>
        <p className="intro">
          The research stack already runs SUMO, Google Maps, TomTom, and Claude agents. This
          industry build is the same architecture in a form a traffic police control room, a systems
          integrator, or a municipal ITS team can click through without API keys.
        </p>
        <div className="grid-3">
          <article className="card">
            <h3>See the corridor now</h3>
            <p>
              Six Outer Ring Road junctions update every second: queues, phase, fused speed, and
              source disagreement between Google and TomTom.
            </p>
          </article>
          <article className="card">
            <h3>Watch the hierarchy decide</h3>
            <p>
              Largest, slowest model at network level (hours). Mid-size model at corridor (minutes).
              Quantized smallest model at each junction, inside 200 ms. Forecasts go to every level.
            </p>
          </article>
          <article className="card">
            <h3>Stress the twin before the street</h3>
            <p>
              Morning peak, lane closure, VIP movement, monsoon. SYMPHONY and a fixed-time baseline
              run side by side so a visitor can see the gap form.
            </p>
          </article>
        </div>
      </section>

      <section className="section section-navy">
        <h2>The invention, in one sentence</h2>
        <p className="intro">
          A 30-second closed loop that collects multi-source traffic, fuses it with
          confidence-weighted Kalman filtering, forecasts with an 18-feature temporal GNN, and
          actuates signals through three large-language-model agents at three timescales.
        </p>
        <div className="grid-4">
          <div className="card">
            <h3>Fusion</h3>
            <p>Google Maps + TomTom, normalised, weighted, anomaly-checked.</p>
          </div>
          <div className="card">
            <h3>T-GNN</h3>
            <p>GraphConv + Bi-LSTM + attention. 3.23 km/h spatial MAE.</p>
          </div>
          <div className="card">
            <h3>Hierarchy</h3>
            <p>Opus / Sonnet / Haiku roles at city, corridor, and junction.</p>
          </div>
          <div className="card">
            <h3>Twin</h3>
            <p>SUMO-validated A/B tests before a plan touches the field.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="split">
          <div className="photo-frame">
            <img src="/images/hero-command.jpg" alt="Traffic digital twin command room" />
          </div>
          <div>
            <div className="kicker" style={{ color: "var(--teal)" }}>For industry visitors</div>
            <h2>Open the app. Change the scenario. Read the agents.</h2>
            <p className="intro">
              No SUMO install. No cloud keys. The command centre is a faithful working model of the
              filed system, built for campus–industry meetings, integrator walkthroughs, and traffic
              police briefings.
            </p>
            <Link to="/app" className="btn btn-dark">
              Enter the digital twin
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
