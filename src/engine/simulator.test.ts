import { describe, expect, it } from "vitest";
import { JUNCTIONS, SCENARIOS } from "./data";
import {
  congestionColor,
  createInitialState,
  currentStage,
  formatSimTime,
  pctDelta,
  resetState,
  setScenario,
  tick,
} from "./simulator";
import type { ScenarioId } from "./types";

function run(ticks: number, scenario: ScenarioId = "morning_rush") {
  let state = createInitialState(scenario);
  for (let i = 0; i < ticks; i++) state = tick(state, 1);
  return state;
}

describe("initial state", () => {
  it("stands up a six-junction corridor with a fixed-time shadow", () => {
    const s = createInitialState();
    expect(s.junctions).toHaveLength(6);
    expect(s.baseline).toHaveLength(6);
    expect(s.vehicles).toHaveLength(36);
    expect(s.running).toBe(true);
    expect(s.scenario).toBe("morning_rush");
    expect(s.cycleNumber).toBe(1);
    expect(s.junctions.map((j) => j.id)).toEqual(JUNCTIONS.map((j) => j.id));
    expect(s.baseline[0].lastReason).toMatch(/Fixed-time/i);
  });
});

describe("tick physics", () => {
  it("does not advance time when paused", () => {
    const s = createInitialState();
    s.running = false;
    tick(s, 1);
    expect(s.simTime).toBe(0);
    expect(s.cycleSecond).toBe(0);
  });

  it("wraps the 30-second operational cycle", () => {
    const s = run(30);
    expect(s.simTime).toBe(30);
    expect(s.cycleSecond).toBe(0);
    expect(s.cycleNumber).toBe(2);
  });

  it("keeps queues, speeds, congestion, and fusion weights in bounds", () => {
    const s = run(40);
    s.junctions.forEach((j) => {
      expect(j.ns.queue).toBeGreaterThanOrEqual(0);
      expect(j.ns.queue).toBeLessThanOrEqual(48);
      expect(j.ew.queue).toBeGreaterThanOrEqual(0);
      expect(j.ew.queue).toBeLessThanOrEqual(48);
      expect(j.fusedSpeed).toBeGreaterThanOrEqual(5);
      expect(j.fusedSpeed).toBeLessThanOrEqual(55);
      expect(j.congestion).toBeGreaterThanOrEqual(4);
      expect(j.congestion).toBeLessThanOrEqual(98);
      expect(j.googleWeight + j.tomtomWeight).toBeCloseTo(1, 3);
      expect(j.predicted.m5).toBeGreaterThanOrEqual(6);
      expect(j.predicted.m30).toBeLessThanOrEqual(50);
    });
  });

  it("keeps vehicles on the corridor", () => {
    const s = run(80);
    s.vehicles.forEach((v) => {
      expect(v.progress).toBeGreaterThanOrEqual(0.01);
      expect(v.progress).toBeLessThanOrEqual(0.99);
      expect(Number.isFinite(v.lat)).toBe(true);
      expect(Number.isFinite(v.lon)).toBe(true);
    });
  });
});

describe.each(SCENARIOS.map((s) => s.id))("scenario %s", (id) => {
  it("runs 45 ticks without throwing and keeps six junctions", () => {
    const s = run(45, id);
    expect(s.junctions).toHaveLength(6);
    s.junctions.forEach((j) => {
      expect(Number.isFinite(j.fusedSpeed)).toBe(true);
      expect(Number.isFinite(j.predicted.m15)).toBe(true);
    });
  });
});

describe("scenario physics", () => {
  it("flags only Silk Board during a lane closure", () => {
    const s = run(5, "incident");
    expect(s.junctions.find((j) => j.id === "silk_board")?.incident).toBe(true);
    expect(s.junctions.filter((j) => j.id !== "silk_board").every((j) => !j.incident)).toBe(true);
  });

  it("announces VIP eastbound protocol", () => {
    const s = run(2, "vip");
    const blob = `${s.strategy} ${s.alerts.join(" ")} ${s.events.map((e) => e.reason).join(" ")}`;
    expect(blob).toMatch(/VIP|eastbound/i);
  });

  it("announces monsoon / rain", () => {
    const s = run(2, "rain");
    expect(s.alerts.join(" ")).toMatch(/Monsoon|rain/i);
  });
});

describe("controllers and session", () => {
  it("lets SYMPHONY switch or extend and the baseline use fixed-time language", () => {
    const s = run(55);
    const symphonyMoves = s.junctions.some((j) => /switch|extend/i.test(j.lastAction));
    const baselineMoves = s.baseline.some((j) => /switch to|Fixed-time/i.test(`${j.lastAction} ${j.lastReason}`));
    expect(symphonyMoves).toBe(true);
    expect(baselineMoves).toBe(true);
  });

  it("resetState clears clocks and history", () => {
    const s = resetState("evening_rush", 8);
    expect(s.simTime).toBe(0);
    expect(s.history).toHaveLength(0);
    expect(s.scenario).toBe("evening_rush");
    expect(s.speed).toBe(8);
  });

  it("setScenario appends a strategist event", () => {
    const s = setScenario(createInitialState(), "weekend");
    expect(s.scenario).toBe("weekend");
    expect(s.events[0].level).toBe("strategist");
    expect(s.events[0].action).toMatch(/weekend/i);
  });

  it("accumulates delay and non-decreasing discharge", () => {
    const a = run(10);
    const b = run(40);
    expect(a.symphony.delaySeconds).toBeGreaterThan(0);
    expect(b.symphony.vehicles).toBeGreaterThanOrEqual(a.symphony.vehicles);
  });

  it("caps event and history buffers", () => {
    const s = run(900);
    expect(s.events.length).toBeLessThanOrEqual(80);
    expect(s.history.length).toBeLessThanOrEqual(90);
  });
});

describe("helpers", () => {
  it("maps cycle seconds to the patented stage windows", () => {
    expect(currentStage(0).id).toBe("collect");
    expect(currentStage(5).id).toBe("fuse");
    expect(currentStage(8).id).toBe("predict");
    expect(currentStage(12).id).toBe("decide");
    expect(currentStage(25).id).toBe("actuate");
    expect(currentStage(28).id).toBe("feedback");
    expect(currentStage(29).id).toBe("feedback");
  });

  it("uses distinct congestion colours", () => {
    expect(congestionColor(20)).not.toBe(congestionColor(40));
    expect(congestionColor(40)).not.toBe(congestionColor(60));
    expect(congestionColor(60)).not.toBe(congestionColor(80));
  });

  it("formats sim time and percent delta", () => {
    expect(formatSimTime(75)).toBe("01:15");
    expect(pctDelta(110, 100)).toBe(10);
    expect(pctDelta(1, 0)).toBe(0);
  });
});
