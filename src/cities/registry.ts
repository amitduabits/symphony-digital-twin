import { CITY_PACKS } from "./packs";
import type { CityPack } from "./schema";

export function listCities(): CityPack[] {
  return CITY_PACKS;
}

export function defaultCity(): CityPack {
  return CITY_PACKS[0];
}

export function getCity(id: string): CityPack {
  const pack = CITY_PACKS.find((c) => c.id === id);
  if (!pack) throw new Error(`unknown city pack: ${id}`);
  return pack;
}
