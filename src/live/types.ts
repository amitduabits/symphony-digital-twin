export interface SpeedReading {
  junctionId: string;
  speedKmh: number;
  congestion01: number;
  observedAtIso: string;
  source: string;
  freshnessS: number;
}

export interface AdapterResult {
  source: string;
  readings: SpeedReading[];
  error: string;
  at: number;
}
