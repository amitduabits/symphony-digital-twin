export type JunctionId =
  | "silk_board"
  | "hsr_layout"
  | "agara"
  | "bellandur"
  | "kadubeesanahalli"
  | "marathahalli";

export type Phase = "NS" | "EW" | "YELLOW";
export type ControllerMode = "symphony" | "fixed";
export type AppView =
  | "overview"
  | "map"
  | "agents"
  | "predict"
  | "fusion"
  | "twin"
  | "results";

export type ScenarioId =
  | "morning_rush"
  | "evening_rush"
  | "midday"
  | "incident"
  | "vip"
  | "rain"
  | "weekend"
  | "outage";

export type AgentLevel = "strategist" | "coordinator" | "junction";

export interface JunctionMeta {
  id: JunctionId;
  name: string;
  short: string;
  lat: number;
  lon: number;
  character: string;
}

export interface ApproachState {
  queue: number;
  approaching: number;
  discharged: number;
}

export interface JunctionState {
  id: JunctionId;
  name: string;
  short: string;
  lat: number;
  lon: number;
  character: string;
  phase: Phase;
  phaseElapsed: number;
  phaseDuration: number;
  ns: ApproachState;
  ew: ApproachState;
  trueSpeed: number;
  googleSpeed: number;
  tomtomSpeed: number;
  fusedSpeed: number;
  googleWeight: number;
  tomtomWeight: number;
  confidence: number;
  congestion: number;
  predicted: { m5: number; m15: number; m30: number };
  lastAction: string;
  lastReason: string;
  decisionConfidence: number;
  anomaly: boolean;
  incident: boolean;
  failSafe: boolean;
  decisionMs: number;
  freshness: number;
  accuracy: number;
  consistency: number;
  predictionError: number;
}

export interface Vehicle {
  id: number;
  progress: number;
  dir: 1 | -1;
  lat: number;
  lon: number;
  speed: number;
}

export interface AgentEvent {
  id: number;
  simTime: number;
  level: AgentLevel;
  agent: string;
  action: string;
  reason: string;
  confidence: number;
}

export interface CycleStage {
  id: string;
  label: string;
  start: number;
  end: number;
}

export interface HistoryPoint {
  t: number;
  symphonySpeed: number;
  fixedSpeed: number;
  symphonyDelay: number;
  fixedDelay: number;
  symphonyCongestion: number;
  fixedCongestion: number;
  predicted: number;
  observed: number;
}

export interface Snapshot {
  t: number;
  speeds: number[];
}

export interface SessionKpis {
  vehicles: number;
  delaySeconds: number;
  meanSpeed: number;
  throughputPerHour: number;
  meanCongestion: number;
}

export interface TwinState {
  running: boolean;
  simTime: number;
  cycleSecond: number;
  cycleNumber: number;
  scenario: ScenarioId;
  speed: number;
  mode: ControllerMode;
  junctions: JunctionState[];
  baseline: JunctionState[];
  vehicles: Vehicle[];
  events: AgentEvent[];
  strategy: string;
  corridorPlan: string;
  history: HistoryPoint[];
  symphony: SessionKpis;
  fixed: SessionKpis;
  alerts: string[];
  snapshots: Snapshot[];
}

export const CYCLE_STAGES: CycleStage[] = [
  { id: "collect", label: "Collect APIs", start: 0, end: 5 },
  { id: "fuse", label: "Fuse + Kalman", start: 5, end: 8 },
  { id: "predict", label: "T-GNN predict", start: 8, end: 12 },
  { id: "decide", label: "Hierarchical decide", start: 12, end: 25 },
  { id: "actuate", label: "Actuate signals", start: 25, end: 28 },
  { id: "feedback", label: "Feedback", start: 28, end: 30 },
];

export const FEATURES_18 = [
  "hour_sin",
  "hour_cos",
  "dow_sin",
  "dow_cos",
  "is_weekend",
  "is_peak",
  "minute_norm",
  "hist_avg_speed",
  "hist_std_speed",
  "hist_avg_cong",
  "hist_std_cong",
  "typical_level",
  "last_hour_mean",
  "last_hour_min",
  "last_hour_max",
  "day_mean",
  "day_std",
  "fused_speed",
];
