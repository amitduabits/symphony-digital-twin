import { describe, expect, it } from "vitest";
import { CLAIMS, CONTACT, EVALUATION, JUNCTIONS, PATENT, SCENARIOS } from "./data";

describe("corridor data", () => {
  it("lists the six ORR junctions in Silk Board to Marathahalli order", () => {
    expect(JUNCTIONS.map((j) => j.id)).toEqual([
      "silk_board",
      "hsr_layout",
      "agara",
      "bellandur",
      "kadubeesanahalli",
      "marathahalli",
    ]);
  });

  it("keeps coordinates inside Bengaluru", () => {
    JUNCTIONS.forEach((j) => {
      expect(j.lat).toBeGreaterThan(12.8);
      expect(j.lat).toBeLessThan(13.1);
      expect(j.lon).toBeGreaterThan(77.5);
      expect(j.lon).toBeLessThan(77.8);
    });
  });

  it("covers every industry scenario", () => {
    expect(SCENARIOS.map((s) => s.id)).toEqual([
      "morning_rush",
      "evening_rush",
      "midday",
      "incident",
      "vip",
      "rain",
      "weekend",
      "outage",
    ]);
  });

  it("places the lane closure at Silk Board", () => {
    expect(SCENARIOS.find((s) => s.id === "incident")?.incidentAt).toBe("silk_board");
  });

  it("marks VIP and rain as distinct physics", () => {
    expect(SCENARIOS.find((s) => s.id === "vip")?.vip).toBe(true);
    expect(SCENARIOS.find((s) => s.id === "rain")?.rain).toBeGreaterThan(0);
  });
});

describe("published identities", () => {
  it("keeps patent and contact stable for industry copy", () => {
    expect(PATENT.number).toBe("202611024014");
    expect(PATENT.applicant).toMatch(/Yushu Excellence Technologies/);
    expect(PATENT.inventor).toBe("Amit Dua");
    expect(PATENT.claimCount).toBe(10);
    expect(CLAIMS).toHaveLength(10);
    expect(CLAIMS[0].kind).toBe("Independent");
    expect(CONTACT.email).toBe("amit.dua@pilani.bits-pilani.ac.in");
  });

  it("does not mix paper headline metrics with the quick-test table", () => {
    expect(EVALUATION.paper.delayReduction).toBe(65);
    expect(EVALUATION.paper.speedGain).toBe(17);
    expect(EVALUATION.vsFixed.throughput).toBe(10.2);
    expect(EVALUATION.quickTest.find((r) => r.name === "SYMPHONY")?.delay).toBe(8.3);
    expect(EVALUATION.quickTest.find((r) => r.name === "FixedTime")?.delay).toBe(24.4);
  });
});
