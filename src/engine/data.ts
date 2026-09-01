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
  },
];

export const EVALUATION = {
  paper: {
    delayReduction: 65,
    speedGain: 17,
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
    "Hierarchical Multi-Agent AI System for Adaptive Traffic Signal Control with Temporal Prediction",
  applicant: "Yushu Excellence Technologies Private Limited",
  inventor: "Amit Dua",
  campus: "BITS Pilani, Pilani Campus",
  status: "Filed. First Examination Report response submitted.",
};

export const CONTACT = {
  name: "Amit Dua",
  email: "amit.dua@pilani.bits-pilani.ac.in",
  dept: "Department of Computer Science and Information Systems",
  org: "BITS Pilani",
  company: "Yushu Excellence Technologies Private Limited",
};
