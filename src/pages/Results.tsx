import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { EVALUATION } from "../engine";

export function Results() {
  return (
    <>
      <SiteNav />
      <div className="page-head">
        <div className="kicker" style={{ color: "var(--teal)" }}>Evidence</div>
        <h1>Numbers the campus can stand behind in a partner meeting.</h1>
        <p>
          Published digital-twin experiments on the Outer Ring Road corridor, plus the evaluation
          harness that ships with the research repository.
        </p>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="grid-4">
          <div className="stat-card">
            <b>{EVALUATION.paper.delayReduction}%</b>
            <span className="muted">delay reduction vs fixed-time</span>
          </div>
          <div className="stat-card">
            <b>{EVALUATION.paper.speedGain}%</b>
            <span className="muted">mean speed improvement</span>
          </div>
          <div className="stat-card">
            <b>{EVALUATION.paper.spatialMae}</b>
            <span className="muted">km/h spatial GNN MAE</span>
          </div>
          <div className="stat-card">
            <b>p &lt; 0.001</b>
            <span className="muted">{EVALUATION.paper.trials} independent trials</span>
          </div>
        </div>

        <h2 style={{ marginTop: "3rem" }}>A/B controller comparison</h2>
        <p className="intro">
          From the SYMPHONY evaluation harness (3-minute replications, n = 3). SYMPHONY is compared
          with classical baselines on the same demand. Versus fixed-time: delay {EVALUATION.vsFixed.delay}%
          better, speed +{EVALUATION.vsFixed.speed}%, throughput +{EVALUATION.vsFixed.throughput}%.
        </p>
        <table className="data">
          <thead>
            <tr>
              <th>Controller</th>
              <th>Delay (s)</th>
              <th>Speed (km/h)</th>
              <th>Throughput (veh/h)</th>
              <th>TTI</th>
            </tr>
          </thead>
          <tbody>
            {EVALUATION.quickTest.map((row) => (
              <tr key={row.name} className={row.name === "SYMPHONY" ? "hl" : ""}>
                <td>{row.name}</td>
                <td>{row.delay.toFixed(1)}</td>
                <td>{row.speed.toFixed(1)}</td>
                <td>{row.throughput.toLocaleString()}</td>
                <td>{row.tti.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="note">
          Source: reports/evaluation in the research repository. The longer published trial set
          reports a 352% throughput lift on the digital-twin A/B design used in the paper and patent
          write-up; the table above is the quick-test harness a visitor can reproduce.
        </p>

        <div className="grid-2" style={{ marginTop: "2rem" }}>
          <figure className="figure-card">
            <img src="/figures/fig5-network.png" alt="Network performance patent figure" />
            <figcaption>Figure 5 — Corridor map and performance summary from the filing.</figcaption>
          </figure>
          <article className="card">
            <h3>What to tell a partner</h3>
            <p>
              SYMPHONY is not the lowest-delay controller in a toy three-minute run — MaxPressure
              still wins that sprint. It is the system that adds interpretable hierarchy, 30-minute
              prediction, multi-source fusion, and a digital twin you can interrogate before a plan
              is pushed to the street. That combination is what the patent protects.
            </p>
          </article>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
