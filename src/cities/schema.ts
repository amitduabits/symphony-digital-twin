import type { JunctionMeta } from "../engine/types";

export interface CityPack {
  id: string;
  name: string;
  country: string;
  tz: string;
  bbox: [number, number, number, number];
  center: [number, number];
  agencies: string[];
  corridors: { id: string; name: string; junctions: string[] }[];
  adapters: {
    geometry: string;
    speeds: string[];
    events: string[];
    cameras: "none" | "catalogue" | "jamcam";
    weather: string;
  };
  fallback: "shadow";
  modeDefault: "observe";
  geometrySource: "seed" | "osm";
  junctions: JunctionMeta[];
  cameraCatalogueUrl?: string;
}
