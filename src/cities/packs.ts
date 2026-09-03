import type { CityPack } from "./schema";

export const BENGALURU: CityPack = {
  id: "bengaluru",
  name: "Bengaluru",
  country: "IN",
  tz: "Asia/Kolkata",
  bbox: [77.45, 12.8, 77.85, 13.15],
  center: [12.935, 77.66],
  agencies: ["Bengaluru Traffic Police", "Greater Bengaluru Authority"],
  corridors: [
    {
      id: "orr_silk_marathahalli",
      name: "Outer Ring Road Silk Board–Marathahalli",
      junctions: ["silk_board", "hsr_layout", "agara", "bellandur", "kadubeesanahalli", "marathahalli"],
    },
  ],
  adapters: { geometry: "osm", speeds: ["google", "tomtom"], events: [], cameras: "none", weather: "open_meteo" },
  fallback: "shadow",
  modeDefault: "observe",
  geometrySource: "seed",
  junctions: [
    { id: "silk_board", name: "Silk Board", short: "SB", lat: 12.9172, lon: 77.6227, character: "Highest congestion, metro construction" },
    { id: "hsr_layout", name: "HSR Layout", short: "HSR", lat: 12.9116, lon: 77.6389, character: "Residential area access" },
    { id: "agara", name: "Agara", short: "AG", lat: 12.9207, lon: 77.6476, character: "Lake junction, moderate load" },
    { id: "bellandur", name: "Bellandur", short: "BL", lat: 12.9307, lon: 77.671, character: "IT corridor, heavy peaks" },
    { id: "kadubeesanahalli", name: "Kadubeesanahalli", short: "KB", lat: 12.9367, lon: 77.6892, character: "Embassy Tech Park access" },
    { id: "marathahalli", name: "Marathahalli", short: "MH", lat: 12.9591, lon: 77.7011, character: "Major interchange" },
  ],
};

export const LONDON: CityPack = {
  id: "london",
  name: "London",
  country: "GB",
  tz: "Europe/London",
  bbox: [-0.2, 51.49, -0.08, 51.54],
  center: [51.522, -0.14],
  agencies: ["Transport for London"],
  corridors: [
    {
      id: "a501_euston",
      name: "A501 Marylebone–King's Cross",
      junctions: ["marble_arch", "baker_st", "gt_portland", "warren_st", "euston", "kings_cross"],
    },
  ],
  adapters: { geometry: "osm", speeds: ["tfl", "google"], events: ["tfl"], cameras: "jamcam", weather: "open_meteo" },
  fallback: "shadow",
  modeDefault: "observe",
  geometrySource: "seed",
  junctions: [
    { id: "marble_arch", name: "Marble Arch", short: "MA", lat: 51.5136, lon: -0.1586, character: "West End / A40" },
    { id: "baker_st", name: "Baker Street", short: "BK", lat: 51.5226, lon: -0.157, character: "Marylebone Road" },
    { id: "gt_portland", name: "Great Portland Street", short: "GP", lat: 51.5238, lon: -0.144, character: "A501 inner ring" },
    { id: "warren_st", name: "Warren Street", short: "WR", lat: 51.5246, lon: -0.1382, character: "Euston Road" },
    { id: "euston", name: "Euston", short: "EU", lat: 51.5281, lon: -0.1337, character: "Station interchange" },
    { id: "kings_cross", name: "King's Cross", short: "KX", lat: 51.5308, lon: -0.1238, character: "A501 / York Way" },
  ],
};

export const NEWYORK: CityPack = {
  id: "newyork",
  name: "New York",
  country: "US",
  tz: "America/New_York",
  bbox: [-74.02, 40.7, -73.93, 40.8],
  center: [40.75, -73.97],
  agencies: ["NYC DOT", "NYC 511"],
  corridors: [
    {
      id: "fdr_midtown",
      name: "FDR Drive Brooklyn Bridge–96th Street",
      junctions: ["bk_bridge", "man_bridge", "houston_fdr", "st34_fdr", "queensboro", "st96_fdr"],
    },
  ],
  adapters: { geometry: "osm", speeds: ["nyc511", "google"], events: [], cameras: "catalogue", weather: "open_meteo" },
  fallback: "shadow",
  modeDefault: "observe",
  geometrySource: "seed",
  junctions: [
    { id: "bk_bridge", name: "Brooklyn Bridge", short: "BB", lat: 40.7061, lon: -73.9969, character: "FDR south" },
    { id: "man_bridge", name: "Manhattan Bridge", short: "MB", lat: 40.7074, lon: -73.9909, character: "Two-bridge" },
    { id: "houston_fdr", name: "Houston Street FDR", short: "HS", lat: 40.719, lon: -73.974, character: "Lower East Side" },
    { id: "st34_fdr", name: "34th Street FDR", short: "34", lat: 40.7435, lon: -73.973, character: "Midtown east" },
    { id: "queensboro", name: "Queensboro Bridge", short: "QB", lat: 40.7605, lon: -73.958, character: "59th Street" },
    { id: "st96_fdr", name: "96th Street FDR", short: "96", lat: 40.785, lon: -73.944, character: "Upper East Side" },
  ],
};

export const HONGKONG: CityPack = {
  id: "hongkong",
  name: "Hong Kong",
  country: "HK",
  tz: "Asia/Hong_Kong",
  bbox: [114.14, 22.26, 114.23, 22.3],
  center: [22.282, 114.18],
  agencies: ["Transport Department"],
  corridors: [
    {
      id: "island_east",
      name: "Island East Corridor Central–Quarry Bay",
      junctions: ["central", "admiralty", "wanchai", "causeway", "northpoint", "quarrybay"],
    },
  ],
  adapters: { geometry: "osm", speeds: ["hkgov", "google"], events: [], cameras: "none", weather: "open_meteo" },
  fallback: "shadow",
  modeDefault: "observe",
  geometrySource: "seed",
  junctions: [
    { id: "central", name: "Central", short: "CT", lat: 22.281, lon: 114.1588, character: "CBD / Connaught" },
    { id: "admiralty", name: "Admiralty", short: "AD", lat: 22.2789, lon: 114.1655, character: "Harcourt Road" },
    { id: "wanchai", name: "Wan Chai", short: "WC", lat: 22.277, lon: 114.1733, character: "Gloucester Road" },
    { id: "causeway", name: "Causeway Bay", short: "CB", lat: 22.28, lon: 114.185, character: "Island East" },
    { id: "northpoint", name: "North Point", short: "NP", lat: 22.291, lon: 114.2004, character: "King's Road" },
    { id: "quarrybay", name: "Quarry Bay", short: "QB", lat: 22.2879, lon: 114.213, character: "IEC" },
  ],
};

export const CITY_PACKS: CityPack[] = [BENGALURU, LONDON, NEWYORK, HONGKONG];
