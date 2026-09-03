export interface CatalogueCamera {
  id: string;
  location: string;
  codec: string;
  live: boolean;
  rtsp: string;
  whep: string;
  hls: string;
  jpeg?: string;
}

const ALIASES: Record<string, string[]> = {
  id: ["id", "camera_id", "cameraid"],
  location: ["location", "name", "site"],
  codec: ["codec", "video_codec"],
  live: ["live", "is_live", "online", "status"],
  rtsp: ["rtsp", "rtsp_url"],
  whep: ["whep", "whep_url"],
  hls: ["hls", "hls_url", "m3u8"],
  jpeg: ["jpeg", "snapshot", "image"],
};

function fold(raw: Record<string, unknown>) {
  const o: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(raw)) o[k.toLowerCase().replace(/-/g, "_")] = v;
  return o;
}

function pick(folded: Record<string, unknown>, field: string) {
  for (const a of ALIASES[field]) if (a in folded) return folded[a];
  return undefined;
}

export function parseCatalogue(payload: unknown): CatalogueCamera[] {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object"
      ? (payload as { cameras?: unknown[] }).cameras ?? (payload as { data?: unknown[] }).data ?? []
      : [];
  return (list as unknown[]).filter((c) => c && typeof c === "object").map((raw) => {
    const f = fold(raw as Record<string, unknown>);
    const liveVal = pick(f, "live");
    const live =
      typeof liveVal === "boolean"
        ? liveVal
        : String(liveVal ?? "true").toLowerCase() !== "offline";
    return {
      id: String(pick(f, "id") ?? ""),
      location: String(pick(f, "location") ?? ""),
      codec: String(pick(f, "codec") ?? "").toLowerCase(),
      live,
      rtsp: String(pick(f, "rtsp") ?? ""),
      whep: String(pick(f, "whep") ?? ""),
      hls: String(pick(f, "hls") ?? ""),
      jpeg: pick(f, "jpeg") ? String(pick(f, "jpeg")) : undefined,
    };
  });
}

export function presentCameras(cams: CatalogueCamera[]) {
  return cams.map((c) => ({
    id: c.id,
    location: c.location,
    codec: c.codec,
    live: c.live,
    kind: (c.hls ? "hls" : c.whep ? "whep" : "jpeg") as "hls" | "whep" | "jpeg",
    previewUrl: c.hls || c.whep || c.jpeg || "",
  }));
}

export const CAPTURE_TCP_FLAG = "rtsp_transport;tcp";
export const MAX_OPEN_CAPTURES = 4;
