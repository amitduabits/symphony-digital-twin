import type { JunctionMeta } from "../engine/types";

export interface OverpassNode {
  type: string;
  lat?: number;
  lon?: number;
  tags?: { name?: string; highway?: string };
}

export function parseOverpass(payload: { elements?: OverpassNode[] }, bbox: [number, number, number, number]): JunctionMeta[] {
  const [w, s, e, n] = bbox;
  const nodes = (payload.elements ?? []).filter((el) => el.type === "node" && el.lat != null && el.lon != null);
  return nodes
    .filter((el) => el.lat! >= s && el.lat! <= n && el.lon! >= w && el.lon! <= e)
    .slice(0, 24)
    .map((el, i) => ({
      id: `osm_${i}`,
      name: el.tags?.name || `Signal ${i + 1}`,
      short: (el.tags?.name || `S${i + 1}`).slice(0, 3).toUpperCase(),
      lat: el.lat!,
      lon: el.lon!,
      character: el.tags?.highway || "traffic_signals",
    }));
}
