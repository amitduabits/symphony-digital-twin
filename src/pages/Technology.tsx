import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { FEATURES_18, JUNCTIONS, MODELS } from "../engine";

export function Technology() {
  return (
    <>
      <SiteNav />
      <div className="page-head">
        <div className="kicker" style={{ color: "var(--teal)" }}>Architecture</div>
        <h1>How the digital twin thinks, every 30 seconds.</h1>
        <p>
          Claim 1 is the closed loop: acquire, fuse, store a rolling window, predict, decide at
          three timescales, actuate, and learn. The command centre runs that loop on the Silk
          Board–Marathahalli corridor.
        </p>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid-2">
          <figure className="figure-card">
            <img src="/figures/fig1-architecture.png" alt="System architecture patent figure" />
            <figcaption>Figure 1 — System architecture (patent drawing).</figcaption>
          </figure>
          <figure className="figure-card">
            <img src="/figures/fig4-fusion.png" alt="Fusion cycle patent figure" />
            <figcaption>Figure 4 — Fusion process and 30-second operational cycle.</figcaption>
          </figure>
        </div>

        <h2 style={{ marginTop: "3rem" }}>Operational cycle</h2>
        <div className="grid-3">
          <article className="card"><h3>0–5 s Collect</h3><p>Parallel Google Maps and TomTom pulls for all six junctions.</p></article>
          <article className="card"><h3>5–8 s Fuse</h3><p>Normalise units, confidence-weighted Kalman update, 3σ anomaly screen.</p></article>
          <article className="card"><h3>8–12 s Predict</h3><p>T-GNN emits 5 / 15 / 30 minute speed forecasts per junction.</p></article>
          <article className="card"><h3>12–25 s Decide</h3><p>Strategist constraints, corridor offsets, junction phase commands.</p></article>
          <article className="card"><h3>25–28 s Actuate</h3><p>Phase and duration sent to the signal controller (or SUMO TraCI).</p></article>
          <article className="card"><h3>28–30 s Feedback</h3><p>Observed outcomes return to the database for the next cycle.</p></article>
        </div>

        <h2 style={{ marginTop: "3rem" }}>Three control timescales</h2>
        <div className="grid-2">
          <figure className="figure-card">
            <img src="/figures/fig3-hierarchy.png" alt="Hierarchical agents patent figure" />
            <figcaption>Figure 3 — City, corridor, and junction agents.</figcaption>
          </figure>
          <div>
            <article className="card">
              <h3>Level 3 · Network agent (71)</h3>
              <p>
                {MODELS.network.label}. {MODELS.network.scale}. {MODELS.network.latency}. Directives
                for incidents, VIP movements, and long-term pattern shifts (claims 1, 6, 9).
              </p>
            </article>
            <article className="card" style={{ marginTop: "1rem" }}>
              <h3>Level 2 · Corridor agent (72)</h3>
              <p>
                {MODELS.corridor.label}. Offsets and coordination constraints from predicted speeds
                and demand, on a minutes-class cycle (claims 1, 8).
              </p>
            </article>
            <article className="card" style={{ marginTop: "1rem" }}>
              <h3>Level 1 · Junction agents (73–78)</h3>
              <p>
                {MODELS.junction.label}. {MODELS.junction.scale}. Phase and duration inside{" "}
                {MODELS.junction.latency}. On outage, revert to stored local logic (claims 1, 6, 7).
              </p>
            </article>
          </div>
        </div>

        <h2 style={{ marginTop: "3rem" }}>Temporal graph network</h2>
        <div className="grid-2">
          <figure className="figure-card">
            <img src="/figures/fig2-tgnn.png" alt="T-GNN patent figure" />
            <figcaption>Figure 2 — GraphConv, bidirectional LSTM, multi-head attention.</figcaption>
          </figure>
          <article className="card">
            <h3>18-dimensional junction vector</h3>
            <p>Time encoding, historical patterns, and a rolling summary of the last hour and last day.</p>
            <div className="chips" style={{ marginTop: "1rem" }}>
              {FEATURES_18.map((f) => (
                <span key={f} className="chip" style={{ color: "var(--ink)", borderColor: "var(--line)" }}>
                  {f}
                </span>
              ))}
            </div>
          </article>
        </div>

        <h2 style={{ marginTop: "3rem" }}>The six junctions</h2>
        <table className="data">
          <thead>
            <tr>
              <th>Junction</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Role on the corridor</th>
            </tr>
          </thead>
          <tbody>
            {JUNCTIONS.map((j) => (
              <tr key={j.id}>
                <td>{j.name}</td>
                <td className="mono">{j.lat.toFixed(4)}</td>
                <td className="mono">{j.lon.toFixed(4)}</td>
                <td>{j.character}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <SiteFooter />
    </>
  );
}
