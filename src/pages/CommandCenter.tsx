import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TwinProvider, useTwin } from "../context/TwinContext";
import {
  CYCLE_STAGES,
  EVALUATION,
  FEATURES_18,
  MODELS,
  SCENARIOS,
  congestionColor,
  currentStage,
  formatSimTime,
  pctDelta,
  type AppView,
  type JunctionState,
} from "../engine";

const MapView = lazy(() => import("../components/MapView"));

const TABS: { id: AppView; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "map", label: "Network map" },
  { id: "agents", label: "Agents" },
  { id: "predict", label: "T-GNN" },
  { id: "fusion", label: "Fusion" },
  { id: "twin", label: "Twin A/B" },
  { id: "results", label: "Evaluation" },
];

export function CommandCenter() {
  return (
    <TwinProvider>
      <OpsShell />
    </TwinProvider>
  );
}

function OpsShell() {
  const { state, view, setView, toggle, reset, changeScenario, changeSpeed } = useTwin();
  const stage = currentStage(state.cycleSecond);
  const delayDelta = pctDelta(state.symphony.delaySeconds, state.fixed.delaySeconds);
  const speedDelta = pctDelta(state.symphony.meanSpeed, state.fixed.meanSpeed);

  return (
    <div className="ops">
      <div className="ops-top">
        <div className="ops-brand">
          <span className={`live-dot ${state.running ? "" : "off"}`} />
          <strong>SYMPHONY</strong>
          <span className="tiny">ORR digital twin · Silk Board → Marathahalli</span>
        </div>
        <div className="tiny mono">
          t {formatSimTime(state.simTime)} · cycle {state.cycleNumber} · {stage.label} ·{" "}
          {state.cycleSecond.toFixed(0)}s / 30s
        </div>
        <Link to="/" className="tiny">
          ← Website
        </Link>
      </div>
      <div className="ops-sub">
        <div className="ops-tabs">
          {TABS.map((t) => (
            <button key={t.id} className={view === t.id ? "active" : ""} onClick={() => setView(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="ops-ctrl">
          <select value={state.scenario} onChange={(e) => changeScenario(e.target.value as typeof state.scenario)}>
            {SCENARIOS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select value={state.speed} onChange={(e) => changeSpeed(Number(e.target.value))}>
            <option value={1}>1×</option>
            <option value={4}>4×</option>
            <option value={8}>8×</option>
          </select>
          <button onClick={toggle}>{state.running ? "Pause" : "Run"}</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
      <div className="ops-main">
        <div className="kpi-row">
          <Kpi label="Network speed" value={`${mean(state.junctions, "fusedSpeed").toFixed(1)} km/h`} />
          <Kpi label="Congestion" value={`${mean(state.junctions, "congestion").toFixed(0)}%`} />
          <Kpi
            label="Delay vs fixed-time"
            value={`${delayDelta.toFixed(0)}%`}
            delta={delayDelta <= 0 ? "up" : "down"}
          />
          <Kpi
            label="Speed vs fixed-time"
            value={`${speedDelta >= 0 ? "+" : ""}${speedDelta.toFixed(0)}%`}
            delta={speedDelta >= 0 ? "up" : "down"}
          />
          <Kpi label="Vehicles cleared" value={state.symphony.vehicles.toFixed(0)} />
          <Kpi label="Active alerts" value={String(state.alerts.length)} />
        </div>
        {view === "overview" && <Overview />}
        {view === "map" && <MapPane />}
        {view === "agents" && <AgentsPane />}
        {view === "predict" && <PredictPane />}
        {view === "fusion" && <FusionPane />}
        {view === "twin" && <TwinPane />}
        {view === "results" && <EvalPane />}
      </div>
    </div>
  );
}

function mean(js: JunctionState[], key: "fusedSpeed" | "congestion") {
  return js.reduce((s, j) => s + j[key], 0) / js.length;
}

function Kpi({ label, value, delta }: { label: string; value: string; delta?: "up" | "down" }) {
  return (
    <div className="panel kpi">
      <span>{label}</span>
      <b className={delta ? `delta ${delta}` : ""}>{value}</b>
    </div>
  );
}

function Overview() {
  const { state } = useTwin();
  const stage = currentStage(state.cycleSecond);
  return (
    <div className="ops-grid">
      <div>
        <div className="panel" style={{ marginBottom: 12 }}>
          <h3>30-second operational cycle</h3>
          <div className="cycle">
            {CYCLE_STAGES.map((s) => (
              <div key={s.id} className={`stage ${stage.id === s.id ? "on" : ""}`}>
                {s.start}–{s.end}s
                <br />
                {s.label}
              </div>
            ))}
          </div>
        </div>
        <div className="panel" style={{ marginBottom: 12 }}>
          <h3>Live corridor</h3>
          <Suspense fallback={<div className="tiny">Loading map…</div>}>
            <MapView junctions={state.junctions} vehicles={state.vehicles} height={360} />
          </Suspense>
        </div>
        <div className="junc-grid">
          {state.junctions.map((j) => (
            <JunctionCard key={j.id} j={j} />
          ))}
        </div>
      </div>
      <div>
        <div className="panel" style={{ marginBottom: 12 }}>
          <h3>Strategy</h3>
          <p style={{ margin: "0 0 0.6rem" }}>{state.strategy}</p>
          <p className="tiny">{state.corridorPlan}</p>
        </div>
        {state.alerts.map((a) => (
          <div key={a} className="alert">
            {a}
          </div>
        ))}
        <div className="panel">
          <h3>Agent feed</h3>
          <Feed />
        </div>
      </div>
    </div>
  );
}

function JunctionCard({ j }: { j: JunctionState }) {
  return (
    <div className="junc">
      <div className="junc-head">
        <strong>{j.name}</strong>
        <span className={`phase ${j.phase}`}>{j.phase}</span>
      </div>
      <div className="tiny">
        {j.fusedSpeed.toFixed(1)} km/h · {j.congestion.toFixed(0)}% · conf {(j.confidence * 100).toFixed(0)}%
      </div>
      <div className="bars">
        <div>
          NS {j.ns.queue.toFixed(0)}
          <div className="bar">
            <i style={{ width: `${(j.ns.queue / 48) * 100}%` }} />
          </div>
        </div>
        <div>
          EW {j.ew.queue.toFixed(0)}
          <div className="bar ew">
            <i style={{ width: `${(j.ew.queue / 48) * 100}%` }} />
          </div>
        </div>
      </div>
      <div className="tiny" style={{ marginTop: 8 }}>
        {j.lastAction} · {j.lastReason}
      </div>
    </div>
  );
}

function Feed() {
  const { state } = useTwin();
  return (
    <div className="feed">
      {state.events.slice(0, 14).map((e) => (
        <div key={e.id} className={`event ${e.level}`}>
          <small>
            {formatSimTime(e.simTime)} · {e.agent} · {(e.confidence * 100).toFixed(0)}%
          </small>
          <strong>{e.action}</strong>
          <div>{e.reason}</div>
        </div>
      ))}
    </div>
  );
}

function MapPane() {
  const { state } = useTwin();
  return (
    <div className="ops-grid">
      <div className="panel">
        <h3>ORR corridor twin</h3>
        <Suspense fallback={<div className="tiny">Loading map…</div>}>
          <MapView junctions={state.junctions} vehicles={state.vehicles} height={640} />
        </Suspense>
      </div>
      <div className="panel">
        <h3>Junction table</h3>
        {state.junctions.map((j) => (
          <div key={j.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", borderBottom: "1px solid #1c3344" }}>
            <span>
              <span style={{ color: congestionColor(j.congestion) }}>●</span> {j.name}
            </span>
            <span className="mono tiny">
              {j.fusedSpeed.toFixed(0)} km/h · {j.phase} {j.phaseElapsed.toFixed(0)}s
            </span>
          </div>
        ))}
        <p className="tiny" style={{ marginTop: 12 }}>
          Amber dots travel eastbound. Violet dots travel westbound. Marker colour is live congestion.
        </p>
      </div>
    </div>
  );
}

function AgentsPane() {
  const { state } = useTwin();
  return (
    <div className="ops-grid">
      <div className="hierarchy">
        <div className="level l3">
          <h3>Level 3 · {MODELS.network.label}</h3>
          <p className="tiny">
            {MODELS.network.scale} · {MODELS.network.latency}
          </p>
          <p>{state.strategy}</p>
        </div>
        <div className="level l2">
          <h3>Level 2 · {MODELS.corridor.label}</h3>
          <p className="tiny">
            {MODELS.corridor.scale} · {MODELS.corridor.latency}
          </p>
          <p>{state.corridorPlan}</p>
        </div>
        <div className="level l1">
          <h3>Level 1 · {MODELS.junction.label}</h3>
          <p className="tiny">
            {MODELS.junction.scale} · {MODELS.junction.latency}
          </p>
          <div className="chips">
            {state.junctions.map((j) => (
              <span key={j.id} className="chip">
                {j.short} {j.phase} · {j.decisionMs.toFixed(0)} ms
                {j.failSafe ? " · FAIL-SAFE" : ""} · {j.lastAction}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="panel">
        <h3>Decision log</h3>
        <Feed />
      </div>
    </div>
  );
}

function PredictPane() {
  const { state } = useTwin();
  const data = state.junctions.map((j) => ({
    name: j.short,
    now: Number(j.fusedSpeed.toFixed(1)),
    m5: Number(j.predicted.m5.toFixed(1)),
    m15: Number(j.predicted.m15.toFixed(1)),
    m30: Number(j.predicted.m30.toFixed(1)),
  }));
  return (
    <div className="ops-grid">
      <div className="panel">
        <h3>Speed forecast (km/h)</h3>
        <div style={{ height: 360 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="#1c3344" />
              <XAxis dataKey="name" stroke="#8aa0ad" />
              <YAxis stroke="#8aa0ad" />
              <Tooltip contentStyle={{ background: "#0e1a24", border: "1px solid #1c3344" }} />
              <Legend />
              <Bar dataKey="now" fill="#3EE0D2" />
              <Bar dataKey="m15" fill="#F0B429" />
              <Bar dataKey="m30" fill="#9b7bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="panel">
        <h3>18-d feature vector</h3>
        <p className="tiny">
          Claim 5: GraphConv (space) + bidirectional LSTM (time) + multi-head attention. Claim 1:
          these forecasts are supplied to junction, corridor, and network agents.
        </p>
        <div className="chips">
          {FEATURES_18.map((f) => (
            <span key={f} className="chip">
              {f}
            </span>
          ))}
        </div>
        <p className="tiny" style={{ marginTop: 16 }}>
          Spatial MAE 3.23 km/h · temporal MAE 6.01 km/h. Rolling window {state.snapshots.length}/8
          snapshots (claim 4). Mean |predicted − observed|{" "}
          {(
            state.junctions.reduce((s, j) => s + j.predictionError, 0) / state.junctions.length
          ).toFixed(1)}{" "}
          km/h (claim 10).
        </p>
      </div>
    </div>
  );
}

function FusionPane() {
  const { state } = useTwin();
  const data = state.junctions.map((j) => ({
    name: j.short,
    google: Number(j.googleSpeed.toFixed(1)),
    tomtom: Number(j.tomtomSpeed.toFixed(1)),
    fused: Number(j.fusedSpeed.toFixed(1)),
  }));
  return (
    <div className="ops-grid">
      <div className="panel">
        <h3>Google · TomTom · fused</h3>
        <div style={{ height: 360 }}>
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid stroke="#1c3344" />
              <XAxis dataKey="name" stroke="#8aa0ad" />
              <YAxis stroke="#8aa0ad" />
              <Tooltip contentStyle={{ background: "#0e1a24", border: "1px solid #1c3344" }} />
              <Legend />
              <Bar dataKey="google" fill="#4ea1ff" />
              <Bar dataKey="tomtom" fill="#F0B429" />
              <Bar dataKey="fused" fill="#3EE0D2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        {state.junctions.map((j) => (
          <div key={j.id} className="panel" style={{ marginBottom: 8 }}>
            <h3>{j.name}</h3>
            <div className="tiny">
              w_G {j.googleWeight.toFixed(2)} · w_T {j.tomtomWeight.toFixed(2)} · freshness{" "}
              {j.freshness.toFixed(2)} · accuracy {j.accuracy.toFixed(2)} · consistency{" "}
              {j.consistency.toFixed(2)} · conf {(j.confidence * 100).toFixed(0)}%
              {j.anomaly ? " · ANOMALY down-weighted" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TwinPane() {
  const { state } = useTwin();
  const delayDelta = pctDelta(state.symphony.delaySeconds, state.fixed.delaySeconds);
  const speedDelta = pctDelta(state.symphony.meanSpeed, state.fixed.meanSpeed);
  const chart = state.history.map((h) => ({
    t: h.t,
    symphony: Number(h.symphonySpeed.toFixed(1)),
    fixed: Number(h.fixedSpeed.toFixed(1)),
    predicted: Number(h.predicted.toFixed(1)),
    observed: Number(h.observed.toFixed(1)),
  }));
  return (
    <div>
      <div className="compare" style={{ marginBottom: 12 }}>
        <div className="panel">
          <h3>SYMPHONY</h3>
          <p>
            Mean speed {state.symphony.meanSpeed.toFixed(1)} km/h
            <br />
            Vehicles {state.symphony.vehicles.toFixed(0)}
            <br />
            Queue-delay integral {state.symphony.delaySeconds.toFixed(0)}
          </p>
        </div>
        <div className="panel">
          <h3>Fixed-time baseline</h3>
          <p>
            Mean speed {state.fixed.meanSpeed.toFixed(1)} km/h
            <br />
            Vehicles {state.fixed.vehicles.toFixed(0)}
            <br />
            Queue-delay integral {state.fixed.delaySeconds.toFixed(0)}
          </p>
        </div>
      </div>
      <div className="panel" style={{ marginBottom: 12 }}>
        <h3>Live speed traces</h3>
        <p className="tiny">
          Session so far: delay {delayDelta.toFixed(0)}% vs baseline, speed {speedDelta >= 0 ? "+" : ""}
          {speedDelta.toFixed(0)}%. Change scenario above to force an incident, VIP, or monsoon.
        </p>
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chart}>
              <CartesianGrid stroke="#1c3344" />
              <XAxis dataKey="t" stroke="#8aa0ad" />
              <YAxis stroke="#8aa0ad" />
              <Tooltip contentStyle={{ background: "#0e1a24", border: "1px solid #1c3344" }} />
              <Area dataKey="symphony" stroke="#3EE0D2" fill="#3EE0D233" />
              <Area dataKey="fixed" stroke="#FF5C5C" fill="#FF5C5C22" />
              <Area dataKey="predicted" stroke="#9b7bff" fill="#9b7bff22" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="compare">
        <div className="panel">
          <h3>SYMPHONY junctions</h3>
          {state.junctions.map((j) => (
            <div key={j.id} className="tiny" style={{ marginBottom: 6 }}>
              {j.short} {j.phase} q {j.ns.queue.toFixed(0)}/{j.ew.queue.toFixed(0)} · {j.fusedSpeed.toFixed(0)} km/h
            </div>
          ))}
        </div>
        <div className="panel">
          <h3>Fixed-time junctions</h3>
          {state.baseline.map((j) => (
            <div key={j.id} className="tiny" style={{ marginBottom: 6 }}>
              {j.short} {j.phase} q {j.ns.queue.toFixed(0)}/{j.ew.queue.toFixed(0)} · {j.fusedSpeed.toFixed(0)} km/h
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EvalPane() {
  return (
    <div className="ops-grid">
      <div className="panel">
        <h3>Published corridor results</h3>
        <div className="kpi-row" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <Kpi label="Delay reduction" value={`${EVALUATION.paper.delayReduction}%`} />
          <Kpi label="Speed gain" value={`${EVALUATION.paper.speedGain}%`} />
          <Kpi label="Queue reduction" value={`${EVALUATION.paper.queueReduction}%`} />
          <Kpi label="Trials" value={`${EVALUATION.paper.trials} · p<0.001`} />
        </div>
        <p className="tiny">
          Paper and patent write-up also report a 352% throughput lift on the longer digital-twin
          A/B design. The table is the repository quick-test a visitor can reproduce.
        </p>
      </div>
      <div className="panel">
        <h3>Quick-test harness</h3>
        {EVALUATION.quickTest.map((r) => (
          <div key={r.name} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid #1c3344" }}>
            <span>{r.name}</span>
            <span className="mono tiny">
              {r.delay.toFixed(1)}s · {r.speed.toFixed(1)} km/h · {r.throughput}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
