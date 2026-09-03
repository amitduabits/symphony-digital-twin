import { describe, expect, it } from "vitest";
import { CAPTURE_TCP_FLAG, parseCatalogue, presentCameras } from "./cameras";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

describe("camera catalogue", () => {
  it("parses a catalogue fixture and strips RTSP from presentation", () => {
    const cams = parseCatalogue({
      cameras: [
        { id: "1", location: "Ring", codec: "h264", live: true, rtsp: "rtsp://host/1", hls: "http://host/1.m3u8" },
      ],
    });
    expect(cams[0].rtsp).toContain("rtsp://");
    const shown = presentCameras(cams);
    expect(JSON.stringify(shown)).not.toMatch(/rtsp:/);
    expect(shown[0].kind).toBe("hls");
  });

  it("records the TCP capture flag for RTSP clients", () => {
    expect(CAPTURE_TCP_FLAG).toBe("rtsp_transport;tcp");
    const capture = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), "cameras.ts"),
      "utf8",
    );
    expect(capture).toContain("rtsp_transport;tcp");
  });
});
