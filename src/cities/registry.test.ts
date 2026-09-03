import { describe, expect, it } from "vitest";
import { defaultCity, getCity, listCities } from "./registry";

describe("city registry", () => {
  it("ships four packs", () => {
    expect(listCities().map((c) => c.id)).toEqual(["bengaluru", "london", "newyork", "hongkong"]);
  });

  it("defaults to Bengaluru and London is Europe/London", () => {
    expect(defaultCity().id).toBe("bengaluru");
    expect(getCity("london").tz).toBe("Europe/London");
    expect(getCity("newyork").tz).toBe("America/New_York");
    expect(getCity("hongkong").tz).toBe("Asia/Hong_Kong");
  });

  it("throws on an unknown city", () => {
    expect(() => getCity("paris")).toThrow(/unknown city pack/);
  });
});
