import type { JunctionId, JunctionMeta, ScenarioId } from "./types";

export const JUNCTIONS: JunctionMeta[] = [
  {
    id: "silk_board",
    name: "Silk Board",
    short: "SB",
    lat: 12.9172,
    lon: 77.6227,
    character: "Highest congestion, metro construction",
  },
  {
    id: "hsr_layout",
    name: "HSR Layout",
    short: "HSR",
    lat: 12.9116,
    lon: 77.6389,
    character: "Residential area access",
  },
  {
    id: "agara",
    name: "Agara",
    short: "AG",
    lat: 12.9207,
    lon: 77.6476,
    character: "Lake junction, moderate load",
  },
  {
    id: "bellandur",
    name: "Bellandur",
    short: "BL",
    lat: 12.9307,
    lon: 77.671,
    character: "IT corridor, heavy peaks",
  },
  {
    id: "kadubeesanahalli",
    name: "Kadubeesanahalli",
    short: "KB",
    lat: 12.9367,
    lon: 77.6892,
    character: "Embassy Tech Park access",
  },
  {
    id: "marathahalli",
    name: "Marathahalli",
    short: "MH",
    lat: 12.9591,
    lon: 77.7011,
    character: "Major interchange",
  },
];

export const JUNCTION_INDEX: Record<JunctionId, number> = {
  silk_board: 0,
  hsr_layout: 1,
  agara: 2,
  bellandur: 3,
  kadubeesanahalli: 4,
  marathahalli: 5,
};

export interface Scenario {
  id: ScenarioId;
  name: string;
  blurb: string;
  demand: number;
  eastBias: number;
  rain: number;
  incidentAt: JunctionId | null;
  vip: boolean;
  outage: boolean;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "morning_rush",
    name: "Morning peak",
    blurb: "07:00–10:00 inbound to the IT corridor.",
    demand: 1.35,
    eastBias: 0.72,
    rain: 0,
    incidentAt: null,
    vip: false,
    outage: false,
  },
  {
    id: "evening_rush",
    name: "Evening peak",
    blurb: "17:00–20:00 outbound from Whitefield / ORR.",
    demand: 1.4,
    eastBias: 0.28,
    rain: 0,
    incidentAt: null,
    vip: false,
    outage: false,
  },
  {
    id: "midday",
    name: "Midday",
    blurb: "Inter-peak with mixed directional demand.",
    demand: 0.85,
    eastBias: 0.5,
    rain: 0,
    incidentAt: null,
    vip: false,
    outage: false,
  },
  {
    id: "incident",
    name: "Lane closure",
    blurb: "Two-lane blockage at Silk Board, spillback upstream.",
    demand: 1.15,
    eastBias: 0.55,
    rain: 0,
    incidentAt: "silk_board",
    vip: false,
    outage: false,
  },
  {
    id: "vip",
    name: "VIP movement",
    blurb: "Green corridor eastbound with hold-and-release.",
    demand: 1.05,
    eastBias: 0.62,
    rain: 0,
    incidentAt: null,
    vip: true,
    outage: false,
  },
  {
    id: "rain",
    name: "Monsoon",
    blurb: "Reduced saturation flow and slower free-flow speed.",
    demand: 1.1,
    eastBias: 0.5,
    rain: 0.35,
    incidentAt: null,
    vip: false,
    outage: false,
  },
  {
    id: "weekend",
    name: "Weekend",
    blurb: "Lower demand, more even directional split.",
    demand: 0.62,
    eastBias: 0.5,
    rain: 0,
    incidentAt: null,
    vip: false,
    outage: false,
  },
  {
    id: "outage",
    name: "Comms outage",
    blurb: "Central link lost. Junctions revert to stored local logic.",
    demand: 1.1,
    eastBias: 0.5,
    rain: 0,
    incidentAt: null,
    vip: false,
    outage: true,
  },
];

export const EVALUATION = {
  paper: {
    delayReduction: 65,
    speedGain: 17,
    queueReduction: 72,
    throughputGain: 352,
    spatialMae: 3.23,
    temporalMae: 6.01,
    pValue: 0.001,
    trials: 15,
  },
  quickTest: [
    { name: "MaxPressure", delay: 4.8, speed: 38.3, throughput: 12707, tti: 1.04 },
    { name: "Webster", delay: 6.0, speed: 37.7, throughput: 12387, tti: 1.06 },
    { name: "SYMPHONY", delay: 8.3, speed: 37.6, throughput: 12560, tti: 1.06 },
    { name: "FixedTime", delay: 24.4, speed: 32.2, throughput: 11393, tti: 1.24 },
    { name: "Actuated", delay: 33.8, speed: 26.1, throughput: 10487, tti: 1.53 },
  ],
  vsFixed: {
    delay: 66.0,
    speed: 16.8,
    throughput: 10.2,
  },
};

export const PATENT = {
  number: "202611024014",
  title:
    "A Hierarchical Multi-Agent AI System for Adaptive Traffic Signal Control with Temporal Prediction",
  applicant: "Yushu Excellence Technologies Private Limited",
  inventor: "Amit Dua",
  campus: "BITS Pilani, Pilani Campus",
  agent: "Kuldeep Kumar Singh, IN/PA 5255",
  ferDate: "23 June 2026",
  responseDate: "31 August 2026",
  claimCount: 10,
  independentClaims: 1,
  status:
    "FER dated 23 June 2026. Response and amended claims (1–10) submitted 31 August 2026.",
};

export const MODELS = {
  junction: {
    label: "First language model · junction",
    scale: "smallest parameter count, quantized",
    latency: "lowest inference latency, ≤ 200 ms",
  },
  corridor: {
    label: "Second language model · corridor",
    scale: "intermediate parameter count",
    latency: "minutes-class coordination cycle",
  },
  network: {
    label: "Third language model · network",
    scale: "largest parameter count",
    latency: "highest inference latency, hours-class",
  },
};

export const CLAIMS = [
  {
    n: 1,
    kind: "Independent",
    title: "Hierarchical multi-agent system with timescale-matched language models",
    gist: "Central processor, fail-safe signal controllers, multi-source acquisition, fusion, rolling-window database, spatiotemporal predictor, three distinct language models assigned by decision timescale, command generation, and post-actuation feedback. Forecasts feed every level. Operation continues under partial data, communication, or hardware failure.",
  },
  {
    n: 2,
    kind: "Dependent",
    title: "At least two independent traffic providers",
    gist: "Speed, flow, and congestion from two or more external providers, collected with asynchronous network requests.",
  },
  {
    n: 3,
    kind: "Dependent",
    title: "Confidence-weighted fusion",
    gist: "Weights from data freshness, historical accuracy, and inter-source consistency; anomalies suppressed.",
  },
  {
    n: 4,
    kind: "Dependent",
    title: "Rolling snapshot window",
    gist: "A predefined number of recent traffic snapshots for short-term analysis without unbounded storage.",
  },
  {
    n: 5,
    kind: "Dependent",
    title: "Temporal graph neural network",
    gist: "Graph convolutional layers for space, bidirectional LSTM for time, multi-head attention to fuse the two, multi-step forecasts.",
  },
  {
    n: 6,
    kind: "Dependent",
    title: "Quantized small model at the junction",
    gist: "The first language model is quantized and smaller than the second; the second is smaller than the third. Higher levels reason further ahead; lower levels stay low-latency.",
  },
  {
    n: 7,
    kind: "Dependent",
    title: "200 ms budget and local fail-safe",
    gist: "Each junction decision completes in not more than 200 milliseconds. If the central link is lost beyond a set interval, the controller reverts to locally stored logic.",
  },
  {
    n: 8,
    kind: "Dependent",
    title: "Corridor offsets from predicted demand",
    gist: "Corridor agents compute signal offsets and coordination constraints from predicted speeds and demand patterns.",
  },
  {
    n: 9,
    kind: "Dependent",
    title: "Network directives for incidents and events",
    gist: "The network agent issues city-wide directives when it sees incidents, special events, or long-term pattern shifts.",
  },
  {
    n: 10,
    kind: "Dependent",
    title: "Predicted versus observed feedback",
    gist: "The monitor compares predicted traffic states with observed outcomes and periodically retrains the predictor on labelled data.",
  },
];

export const CONTACT = {
  name: "Amit Dua",
  email: "amit.dua@pilani.bits-pilani.ac.in",
  dept: "Department of Computer Science and Information Systems",
  org: "BITS Pilani",
  company: "Yushu Excellence Technologies Private Limited",
};
