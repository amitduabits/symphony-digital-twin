import { describe, expect, it } from "vitest";
import { parseOverpass } from "./osm";

describe("OSM ingest", () => {
  it("keeps six Bengaluru-bbox signal nodes", () => {
    const bbox: [number, number, number, number] = [77.45, 12.8, 77.85, 13.15];
    const payload = {
      elements: [
        { type: "node", lat: 12.9172, lon: 77.6227, tags: { name: "Silk Board", highway: "traffic_signals" } },
        { type: "node", lat: 12.9116, lon: 77.6389, tags: { name: "HSR" } },
        { type: "node", lat: 12.9207, lon: 77.6476, tags: { name: "Agara" } },
        { type: "node", lat: 12.9307, lon: 77.671, tags: { name: "Bellandur" } },
        { type: "node", lat: 12.9367, lon: 77.6892, tags: { name: "Kadubeesanahalli" } },
        { type: "node", lat: 12.9591, lon: 77.7011, tags: { name: "Marathahalli" } },
        { type: "node", lat: 28.6, lon: 77.2, tags: { name: "Delhi" } },
      ],
    };
    const nodes = parseOverpass(payload, bbox);
    expect(nodes.length).toBe(6);
    nodes.forEach((n) => {
      expect(n.lat).toBeGreaterThan(12.8);
      expect(n.lat).toBeLessThan(13.15);
    });
  });
});
