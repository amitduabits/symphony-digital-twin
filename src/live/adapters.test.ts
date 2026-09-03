import { describe, expect, it } from "vitest";
import { BENGALURU } from "../cities/packs";
import { fetchGoogle, fetchTomTom } from "./adapters";

describe("speed adapters", () => {
  it("returns empty readings when Google/TomTom keys are missing", async () => {
    const g = await fetchGoogle(BENGALURU);
    const t = await fetchTomTom(BENGALURU);
    expect(g.readings).toEqual([]);
    expect(t.readings).toEqual([]);
    expect(g.error).toMatch(/no key|blocked/);
  });
});
