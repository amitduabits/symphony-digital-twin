import { JUNCTIONS, SCENARIOS } from "./data";
import { CYCLE_STAGES } from "./types";
import type {
  AgentEvent,
  ControllerMode,
  JunctionState,
  Phase,
  ScenarioId,
  SessionKpis,
  TwinState,
  Vehicle,
} from "./types";

const FREE_FLOW = 48;
const SATURATION = 0.48;
const MIN_GREEN = 12;
const MAX_GREEN = 58;
const FIXED_GREEN = 40;
const YELLOW = 3;
const CYCLE = 30;
const MAX_EVENTS = 80;
const MAX_HISTORY = 90;
const MAX_QUEUE = 48;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function emptyApproaches() {
  return {
    ns: { queue: 6, approaching: 3, discharged: 0 },
    ew: { queue: 6, approaching: 3, discharged: 0 },
  };
}

function seedJunction(i: number): JunctionState {
  const meta = JUNCTIONS[i];
  const approaches = emptyApproaches();
  return {
    ...meta,
    phase: i % 2 === 0 ? "NS" : "EW",
    phaseElapsed: 8 + (i % 5),
    phaseDuration: 28,
    ...approaches,
    trueSpeed: 32,
    googleSpeed: 31,
    tomtomSpeed: 33,
    fusedSpeed: 32,
    googleWeight: 0.4,
    tomtomWeight: 0.6,
    confidence: 0.86,
    congestion: 38,
    predicted: { m5: 31, m15: 29, m30: 28 },
    lastAction: "hold",
    lastReason: "Initialising corridor.",
    decisionConfidence: 0.8,
    anomaly: false,
    incident: false,
    failSafe: false,
    decisionMs: 90,
    freshness: 0.9,
    accuracy: 0.85,
    consistency: 0.88,
    predictionError: 1.2,
  };
}

function emptyKpis(): SessionKpis {
  return {
    vehicles: 0,
    delaySeconds: 0,
    meanSpeed: 0,
    throughputPerHour: 0,
    meanCongestion: 0,
  };
}

function cloneJunctions(src: JunctionState[]): JunctionState[] {
  return src.map((j) => ({
    ...j,
    ns: { ...j.ns },
    ew: { ...j.ew },
    predicted: { ...j.predicted },
  }));
}

function positionOnCorridor(progress: number): { lat: number; lon: number } {
  const n = JUNCTIONS.length - 1;
  const x = clamp(progress, 0, 0.999) * n;
  const i = Math.floor(x);
  const t = x - i;
  const a = JUNCTIONS[i];
  const b = JUNCTIONS[i + 1];
  return { lat: lerp(a.lat, b.lat, t), lon: lerp(a.lon, b.lon, t) };
}

function seedVehicles(): Vehicle[] {
  return Array.from({ length: 36 }, (_, i) => {
    const progress = (i / 36) * 0.98;
    const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
    const pos = positionOnCorridor(progress);
    return { id: i + 1, progress, dir, lat: pos.lat, lon: pos.lon, speed: 28 };
  });
}

export function createInitialState(scenario: ScenarioId = "morning_rush"): TwinState {
  const junctions = JUNCTIONS.map((_, i) => seedJunction(i));
  return {
    running: true,
    simTime: 0,
    cycleSecond: 0,
    cycleNumber: 1,
    scenario,
    speed: 4,
    mode: "symphony",
    junctions,
    baseline: cloneJunctions(junctions).map((j, i) => ({
      ...j,
      phaseDuration: FIXED_GREEN,
      lastAction: "fixed",
      lastReason: "Fixed-time 40s split.",
      decisionConfidence: 1,
    })),
    vehicles: seedVehicles(),
    events: [
      {
        id: 1,
        simTime: 0,
        level: "strategist",
        agent: "City Strategist",
        action: "Stand up corridor",
        reason: "ORR Silk Board–Marathahalli digital twin online. Default: balance both directions.",
        confidence: 0.92,
      },
    ],
    strategy: "Balance the corridor. Protect Silk Board from spillback.",
    corridorPlan: "Offsets pending first T-GNN pass.",
    history: [],
    symphony: emptyKpis(),
    fixed: emptyKpis(),
    alerts: [],
    snapshots: [],
  };
}

function scenarioOf(id: ScenarioId) {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

function occupancy(j: JunctionState) {
  return (j.ns.queue + j.ew.queue) / (2 * MAX_QUEUE);
}

function updateQueues(
  j: JunctionState,
  demand: number,
  eastBias: number,
  rain: number,
  incident: boolean,
  greenBonus: number,
  dt: number,
) {
  const sat = SATURATION * (incident ? 0.45 : 1) * (1 - rain * 0.35) * (1 + greenBonus);
  const east = demand * eastBias;
  const westish = demand * (1 - eastBias);
  const nsArr = (0.22 * demand + 0.08 * Math.sin(j.lat * 40)) * dt;
  const ewArr = (0.38 * east + 0.22 * westish) * dt;

  j.ns.approaching = clamp(j.ns.approaching + nsArr * 0.6 - 0.15 * dt, 0, 18);
  j.ew.approaching = clamp(j.ew.approaching + ewArr * 0.6 - 0.15 * dt, 0, 22);

  const nsGreen = j.phase === "NS";
  const ewGreen = j.phase === "EW";
  const nsRate = nsGreen ? sat : j.phase === "YELLOW" && j.lastAction.includes("NS") ? sat * 0.4 : 0;
  const ewRate = ewGreen ? sat * 1.05 : j.phase === "YELLOW" && j.lastAction.includes("EW") ? sat * 0.4 : 0;

  const nsOut = Math.min(j.ns.queue, nsRate * dt);
  const ewOut = Math.min(j.ew.queue, ewRate * dt);
  j.ns.queue = clamp(j.ns.queue - nsOut + nsArr + (nsGreen ? 0 : j.ns.approaching * 0.04), 0, MAX_QUEUE);
  j.ew.queue = clamp(j.ew.queue - ewOut + ewArr + (ewGreen ? 0 : j.ew.approaching * 0.05), 0, MAX_QUEUE);
  j.ns.discharged += nsOut;
  j.ew.discharged += ewOut;

  const occ = occupancy(j);
  const slow = FREE_FLOW * Math.exp(-2.1 * occ) * (1 - rain * 0.28) * (incident ? 0.55 : 1);
  j.trueSpeed = clamp(slow + (Math.random() - 0.5) * 1.6, 6, FREE_FLOW);
  j.congestion = clamp(100 * (1 - j.trueSpeed / FREE_FLOW), 4, 98);
  j.incident = incident;
}

function fuse(j: JunctionState, simTime: number) {
  const gNoise = (Math.random() - 0.5) * 7;
  const tNoise = (Math.random() - 0.5) * 4.5;
  j.googleSpeed = clamp(j.trueSpeed + gNoise, 5, 55);
  j.tomtomSpeed = clamp(j.trueSpeed + tNoise, 5, 55);

  const freshnessG = Math.exp(-0.04 * (simTime % 7));
  const freshnessT = Math.exp(-0.03 * (simTime % 5));
  const accuracyG = 0.82;
  const accuracyT = 0.9;
  const median = (j.googleSpeed + j.tomtomSpeed) / 2;
  const consG = 1 - clamp(Math.abs(j.googleSpeed - median) / 20, 0, 1);
  const consT = 1 - clamp(Math.abs(j.tomtomSpeed - median) / 20, 0, 1);
  j.freshness = 0.5 * freshnessG + 0.5 * freshnessT;
  j.accuracy = 0.5 * accuracyG + 0.5 * accuracyT;
  j.consistency = 0.5 * consG + 0.5 * consT;

  let wG = 0.5 * freshnessG + 0.3 * accuracyG + 0.2 * consG;
  let wT = 0.5 * freshnessT + 0.3 * accuracyT + 0.2 * consT;

  const jump = Math.abs(j.googleSpeed - j.tomtomSpeed);
  j.anomaly = jump > 15;
  if (j.anomaly && Math.abs(j.googleSpeed - j.trueSpeed) > Math.abs(j.tomtomSpeed - j.trueSpeed)) {
    wG *= 0.1;
  }

  const sum = wG + wT;
  j.googleWeight = wG / sum;
  j.tomtomWeight = wT / sum;
  const meas = j.googleWeight * j.googleSpeed + j.tomtomWeight * j.tomtomSpeed;
  j.fusedSpeed = clamp(0.65 * meas + 0.35 * j.fusedSpeed, 5, 55);
  j.confidence = clamp(0.55 + 0.35 * (1 - jump / 25) + (j.anomaly ? -0.15 : 0.05), 0.35, 0.98);
  j.predictionError = Math.abs(j.predicted.m5 - j.fusedSpeed);
}

function predict(junctions: JunctionState[], scenario: ScenarioId, simTime: number) {
  const sc = scenarioOf(scenario);
  const hourWave = 0.5 + 0.5 * Math.sin((simTime / 3600) * Math.PI * 2);
  junctions.forEach((j, i) => {
    const prev = junctions[i - 1]?.fusedSpeed ?? j.fusedSpeed;
    const next = junctions[i + 1]?.fusedSpeed ?? j.fusedSpeed;
    const spatial = 0.5 * j.fusedSpeed + 0.25 * prev + 0.25 * next;
    const demandLift = (sc.demand - 1) * 8;
    const rainHit = sc.rain * 6;
    const trend = spatial - demandLift - rainHit;
    j.predicted = {
      m5: clamp(0.7 * spatial + 0.3 * trend + (Math.random() - 0.5) * 1.2, 8, 50),
      m15: clamp(0.45 * spatial + 0.55 * (trend - 2 * hourWave) + (Math.random() - 0.5), 7, 48),
      m30: clamp(0.3 * spatial + 0.7 * (trend - 3.5 * sc.demand) + (Math.random() - 0.5), 6, 46),
    };
  });
}

function pushEvent(state: TwinState, event: Omit<AgentEvent, "id" | "simTime">) {
  state.events.unshift({
    id: state.simTime * 100 + state.events.length + 1,
    simTime: state.simTime,
    ...event,
  });
  if (state.events.length > MAX_EVENTS) state.events.pop();
}

function symphonyControl(state: TwinState, j: JunctionState, index: number) {
  const sc = scenarioOf(state.scenario);
  if (sc.outage) {
    j.failSafe = true;
    j.decisionMs = 35 + Math.random() * 25;
    j.lastAction = "fail-safe local";
    j.lastReason =
      "Communication lost beyond the outage interval. Revert to locally stored control logic.";
    j.decisionConfidence = 1;
    fixedControl(j);
    return;
  }
  j.failSafe = false;
  j.decisionMs = 70 + Math.random() * 110;
  const nsLoad = j.ns.queue + 0.6 * j.ns.approaching;
  const ewLoad = j.ew.queue + 0.6 * j.ew.approaching;
  const predictedDrop = j.fusedSpeed - j.predicted.m15;
  const spillback = j.ns.queue > 36 || j.ew.queue > 36;

  let want: Phase = nsLoad >= ewLoad ? "NS" : "EW";
  if (sc.vip) want = "EW";
  if (sc.incidentAt === j.id) want = j.ew.queue > j.ns.queue ? "EW" : "NS";
  if (predictedDrop > 6 && j.predicted.m15 < 18) {
    want = index >= 3 ? "EW" : "NS";
  }

  const remaining = j.phaseDuration - j.phaseElapsed;
  const minOk = j.phaseElapsed >= MIN_GREEN;
  const maxHit = j.phaseElapsed >= MAX_GREEN;

  if (j.phase === "YELLOW") {
    if (j.phaseElapsed >= YELLOW) {
      const going: Phase = j.lastAction.includes("to EW") ? "EW" : "NS";
      j.phase = going;
      j.phaseElapsed = 0;
      j.phaseDuration = clamp(22 + index * 2, MIN_GREEN, 40);
    }
    return;
  }

  if (maxHit || (minOk && want !== j.phase && Math.abs(nsLoad - ewLoad) > 4)) {
    j.lastAction = `switch to ${want}`;
    j.lastReason = spillback
      ? "Spillback risk. Switch to clear the saturated approach."
      : predictedDrop > 6
        ? `T-GNN 15-min speed ${j.predicted.m15.toFixed(0)} km/h. Pre-empt before the queue locks.`
        : `Queue imbalance NS ${nsLoad.toFixed(0)} vs EW ${ewLoad.toFixed(0)}.`;
    j.decisionConfidence = clamp(0.7 + j.confidence * 0.25, 0.6, 0.97);
    j.phase = "YELLOW";
    j.phaseElapsed = 0;
    j.phaseDuration = YELLOW;
    return;
  }

  if (minOk && want === j.phase && remaining < 8 && (nsLoad > 12 || ewLoad > 12)) {
    const extra = clamp(8 + predictedDrop, 6, 18);
    j.phaseDuration = clamp(j.phaseDuration + extra, MIN_GREEN, MAX_GREEN);
    j.lastAction = `extend ${j.phase} +${extra.toFixed(0)}s`;
    j.lastReason = `Keep ${j.phase} green for approaching platoon. Offset aligned with corridor plan.`;
    j.decisionConfidence = 0.84;
  }
}

function fixedControl(j: JunctionState) {
  if (j.phase === "YELLOW") {
    if (j.phaseElapsed >= YELLOW) {
      j.phase = j.lastAction.includes("EW") ? "EW" : "NS";
      j.phaseElapsed = 0;
      j.phaseDuration = FIXED_GREEN;
    }
    return;
  }
  if (j.phaseElapsed >= FIXED_GREEN) {
    const next: Phase = j.phase === "NS" ? "EW" : "NS";
    j.lastAction = `switch to ${next}`;
    j.lastReason = "Fixed-time 40/40 split. No prediction, no coordination.";
    j.phase = "YELLOW";
    j.phaseElapsed = 0;
    j.phaseDuration = YELLOW;
  }
}

function greenBonus(j: JunctionState, index: number, planEast: boolean): number {
  if (j.phase === "YELLOW") return 0;
  const aligned = planEast ? j.phase === "EW" : j.phase === "NS";
  const stagger = (index % 2 === 0) === aligned;
  return aligned && stagger ? 0.22 : aligned ? 0.08 : 0;
}

function tickController(
  junctions: JunctionState[],
  state: TwinState,
  mode: ControllerMode,
  dt: number,
) {
  const sc = scenarioOf(state.scenario);
  const planEast = sc.eastBias >= 0.5 || sc.vip;
  junctions.forEach((j, i) => {
    j.phaseElapsed += dt;
    const incident = sc.incidentAt === j.id;
    if (mode === "symphony") symphonyControl(state, j, i);
    else fixedControl(j);
    const bonus = mode === "symphony" ? greenBonus(j, i, planEast) : 0;
    updateQueues(j, sc.demand, sc.eastBias, sc.rain, incident, bonus, dt);
    fuse(j, state.simTime);
  });
  predict(junctions, state.scenario, state.simTime);
}

function accumulate(k: SessionKpis, junctions: JunctionState[], dt: number, simTime: number) {
  const speed = junctions.reduce((s, j) => s + j.fusedSpeed, 0) / junctions.length;
  const cong = junctions.reduce((s, j) => s + j.congestion, 0) / junctions.length;
  const q = junctions.reduce((s, j) => s + j.ns.queue + j.ew.queue, 0);
  const out = junctions.reduce((s, j) => s + j.ns.discharged + j.ew.discharged, 0);
  k.delaySeconds += q * dt;
  k.vehicles = out;
  const n = Math.max(1, Math.floor(simTime / dt) + 1);
  k.meanSpeed += (speed - k.meanSpeed) / n;
  k.meanCongestion += (cong - k.meanCongestion) / n;
  k.throughputPerHour = out / Math.max(simTime / 3600, 1 / 3600);
}

function moveVehicles(state: TwinState, dt: number) {
  const speeds = state.junctions.map((j) => j.trueSpeed);
  state.vehicles.forEach((v) => {
    const idx = clamp(Math.floor(v.progress * (JUNCTIONS.length - 1)), 0, speeds.length - 1);
    const local = speeds[idx] / 3600 / 12;
    v.speed = speeds[idx];
    v.progress += v.dir * local * dt * 18;
    if (v.progress > 0.99) {
      v.progress = 0.99;
      v.dir = -1;
    }
    if (v.progress < 0.01) {
      v.progress = 0.01;
      v.dir = 1;
    }
    const pos = positionOnCorridor(v.progress);
    v.lat = pos.lat;
    v.lon = pos.lon;
  });
}

function maybeAgents(state: TwinState, dt: number) {
  const worst = [...state.junctions].sort((a, b) => b.congestion - a.congestion)[0];
  const sc = scenarioOf(state.scenario);

  if (sc.outage) {
    state.strategy = "Central link lost. Junction agents on stored local logic. No new network directives.";
    state.corridorPlan = "Offsets frozen. Fail-safe until the outage interval clears.";
    if (state.simTime % 60 < dt) {
      pushEvent(state, {
        level: "strategist",
        agent: "City Strategist",
        action: "Comms outage protocol",
        reason: "Network-level agent unreachable. Junction controllers keep actuating from local logic.",
        confidence: 0.99,
      });
    }
    return;
  }

  if (state.simTime % 60 < dt) {
    if (sc.vip) {
      state.strategy = "VIP eastbound corridor. Hold conflicting phases. Release platoons at Bellandur.";
      pushEvent(state, {
        level: "strategist",
        agent: "City Strategist",
        action: "VIP protocol",
        reason: "Network-wide eastbound priority until the movement clears Marathahalli.",
        confidence: 0.95,
      });
    } else if (sc.incidentAt) {
      state.strategy = `Incident at ${sc.incidentAt.replace("_", " ")}. Meter upstream, flush downstream.`;
      pushEvent(state, {
        level: "strategist",
        agent: "City Strategist",
        action: "Incident response",
        reason: "Two-lane loss at Silk Board. Divert HSR–Agara and shorten Silk Board cycle.",
        confidence: 0.91,
      });
    } else if (worst.congestion > 72) {
      state.strategy = `Relieve ${worst.name}. Temporarily favour the saturated approach.`;
      pushEvent(state, {
        level: "strategist",
        agent: "City Strategist",
        action: `Prioritise ${worst.short}`,
        reason: `${worst.name} at ${worst.congestion.toFixed(0)}% congestion. Predicted 30-min speed ${worst.predicted.m30.toFixed(0)} km/h.`,
        confidence: 0.88,
      });
    } else {
      state.strategy = "Balanced corridor. Keep a two-way green wave and protect Silk Board from spillback.";
      pushEvent(state, {
        level: "strategist",
        agent: "City Strategist",
        action: "Hold balanced plan",
        reason: "No junction above the 72% congestion trigger. Maintain offsets.",
        confidence: 0.86,
      });
    }
  }

  if (state.simTime % 15 < dt) {
    const offset = sc.vip ? 8 : sc.eastBias > 0.6 ? 12 : 10;
    state.corridorPlan = `${sc.eastBias >= 0.5 ? "Eastbound" : "Westbound"} green wave, ${offset}s offset, cycle ${sc.demand > 1.2 ? 110 : 90}s.`;
    pushEvent(state, {
      level: "coordinator",
      agent: "Corridor Coordinator",
      action: "Update offsets",
      reason: state.corridorPlan,
      confidence: 0.87,
    });
  }

  if (state.cycleSecond >= 12 && state.cycleSecond < 12 + dt) {
    const talker = state.junctions.reduce((a, b) => (a.congestion > b.congestion ? a : b));
    pushEvent(state, {
      level: "junction",
      agent: talker.name,
      action: talker.lastAction,
      reason: talker.lastReason,
      confidence: talker.decisionConfidence,
    });
  }
}

function alerts(state: TwinState) {
  const list: string[] = [];
  state.junctions.forEach((j) => {
    if (j.incident) list.push(`Lane closure active at ${j.name}.`);
    if (j.anomaly) list.push(`Source disagreement at ${j.name}: Google ${j.googleSpeed.toFixed(0)} vs TomTom ${j.tomtomSpeed.toFixed(0)} km/h.`);
    if (j.congestion > 78) list.push(`${j.name} congestion ${j.congestion.toFixed(0)}%.`);
    if (j.ns.queue > 40 || j.ew.queue > 40) list.push(`Spillback risk at ${j.name}.`);
  });
  const sc = scenarioOf(state.scenario);
  if (sc.vip) list.unshift("VIP movement: eastbound green corridor.");
  if (sc.rain) list.unshift("Monsoon: saturation flow reduced 35%.");
  if (sc.outage) list.unshift("Comms outage: junctions on local fail-safe logic.");
  state.alerts = list.slice(0, 4);
}

export function tick(state: TwinState, dt = 1): TwinState {
  if (!state.running) return state;

  tickController(state.junctions, state, "symphony", dt);
  tickController(state.baseline, state, "fixed", dt);

  accumulate(state.symphony, state.junctions, dt, state.simTime + dt);
  accumulate(state.fixed, state.baseline, dt, state.simTime + dt);

  moveVehicles(state, dt);
  maybeAgents(state, dt);

  state.simTime += dt;
  state.cycleSecond = state.simTime % CYCLE;
  if (state.cycleSecond < dt) state.cycleNumber += 1;

  if (state.simTime % 8 < dt) {
    const sSpeed = state.junctions.reduce((s, j) => s + j.fusedSpeed, 0) / 6;
    const fSpeed = state.baseline.reduce((s, j) => s + j.fusedSpeed, 0) / 6;
    const sCong = state.junctions.reduce((s, j) => s + j.congestion, 0) / 6;
    const fCong = state.baseline.reduce((s, j) => s + j.congestion, 0) / 6;
    const predicted =
      state.junctions.reduce((s, j) => s + j.predicted.m15, 0) / state.junctions.length;
    state.history.push({
      t: state.simTime,
      symphonySpeed: sSpeed,
      fixedSpeed: fSpeed,
      symphonyDelay: state.symphony.delaySeconds,
      fixedDelay: state.fixed.delaySeconds,
      symphonyCongestion: sCong,
      fixedCongestion: fCong,
      predicted,
      observed: sSpeed,
    });
    if (state.history.length > MAX_HISTORY) state.history.shift();
    state.snapshots.push({ t: state.simTime, speeds: state.junctions.map((j) => j.fusedSpeed) });
    if (state.snapshots.length > 8) state.snapshots.shift();
  }

  alerts(state);
  return state;
}

export function resetState(scenario: ScenarioId, speed: number): TwinState {
  const next = createInitialState(scenario);
  next.speed = speed;
  return next;
}

export function setScenario(state: TwinState, scenario: ScenarioId): TwinState {
  state.scenario = scenario;
  const sc = scenarioOf(scenario);
  pushEvent(state, {
    level: "strategist",
    agent: "City Strategist",
    action: `Load scenario: ${sc.name}`,
    reason: sc.blurb,
    confidence: 0.9,
  });
  return state;
}

export function currentStage(cycleSecond: number) {
  return (
    CYCLE_STAGES.find((s) => cycleSecond >= s.start && cycleSecond < s.end) ??
    CYCLE_STAGES[CYCLE_STAGES.length - 1]
  );
}

export function congestionColor(pct: number) {
  if (pct < 30) return "#3DDC97";
  if (pct < 50) return "#F0B429";
  if (pct < 70) return "#F7842B";
  return "#FF5C5C";
}

export function formatSimTime(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function pctDelta(a: number, b: number) {
  if (b === 0) return 0;
  return ((a - b) / b) * 100;
}
