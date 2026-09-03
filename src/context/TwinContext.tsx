import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { defaultCity, getCity } from "../cities/registry";
import type { CityPack } from "../cities/schema";
import {
  applyLiveSpeeds,
  createInitialState,
  resetState,
  setScenario as applyScenario,
  tick,
  type AppView,
  type OperatingMode,
  type ScenarioId,
  type SourceHealth,
  type TwinState,
} from "../engine";
import { fuseReadings } from "../live/fusion";
import { pollCity } from "../live/adapters";

interface TwinContextValue {
  state: TwinState;
  city: CityPack;
  view: AppView;
  setView: (v: AppView) => void;
  toggle: () => void;
  reset: () => void;
  changeScenario: (id: ScenarioId) => void;
  changeSpeed: (n: number) => void;
  changeCity: (id: string) => void;
  changeMode: (m: OperatingMode) => void;
}

const TwinContext = createContext<TwinContextValue | null>(null);

export function TwinProvider({ children }: { children: ReactNode }) {
  const start = defaultCity();
  const [city, setCity] = useState<CityPack>(start);
  const [state, setState] = useState<TwinState>(() =>
    createInitialState("morning_rush", start.junctions, start.id),
  );
  const [view, setView] = useState<AppView>("overview");
  const stateRef = useRef(state);
  const cityRef = useRef(city);
  stateRef.current = state;
  cityRef.current = city;

  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    const id = window.setInterval(() => {
      const current = stateRef.current;
      if (!current.running) return;
      const next = tick({ ...current }, 1);
      stateRef.current = next;
      setState({ ...next });
    }, Math.max(80, 1000 / Math.max(1, state.speed)));
    return () => window.clearInterval(id);
  }, [state.speed, state.running]);

  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    let cancelled = false;
    const run = async () => {
      const pack = cityRef.current;
      const { readings, weatherMm, results } = await pollCity(pack);
      if (cancelled) return;
      const fused = fuseReadings(readings);
      setState((s) => {
        const next = applyLiveSpeeds({ ...s }, fused);
        next.weatherMm = weatherMm;
        next.liveAgeS = 0;
        next.sourceHealth = results.map((r): SourceHealth => ({
          id: r.source,
          label: r.source,
          status: r.error && !r.readings.length ? "red" : r.error ? "amber" : "green",
          ageS: Math.round((Date.now() - r.at) / 1000),
          lastError: r.error,
        }));
        const allFail = results.filter((r) => r.source !== "open_meteo").every((r) => r.error && !r.readings.length);
        if (allFail) {
          next.junctions.forEach((j) => {
            j.failSafe = true;
          });
        }
        return { ...next };
      });
    };
    run();
    const id = window.setInterval(run, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [city.id]);

  const toggle = useCallback(() => {
    setState((s) => ({ ...s, running: !s.running }));
  }, []);

  const reset = useCallback(() => {
    const pack = cityRef.current;
    setState((s) => resetState(s.scenario, s.speed, pack.junctions, pack.id));
  }, []);

  const changeScenario = useCallback((id: ScenarioId) => {
    setState((s) => applyScenario({ ...s }, id));
  }, []);

  const changeSpeed = useCallback((n: number) => {
    setState((s) => ({ ...s, speed: n }));
  }, []);

  const changeCity = useCallback((id: string) => {
    const pack = getCity(id);
    setCity(pack);
    setState((s) => resetState(s.scenario, s.speed, pack.junctions, pack.id));
  }, []);

  const changeMode = useCallback((m: OperatingMode) => {
    setState((s) => ({ ...s, operatingMode: m === "actuate" ? "observe" : m }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      city,
      view,
      setView,
      toggle,
      reset,
      changeScenario,
      changeSpeed,
      changeCity,
      changeMode,
    }),
    [state, city, view, toggle, reset, changeScenario, changeSpeed, changeCity, changeMode],
  );

  return <TwinContext.Provider value={value}>{children}</TwinContext.Provider>;
}

export function useTwin() {
  const ctx = useContext(TwinContext);
  if (!ctx) throw new Error("useTwin must be used inside TwinProvider");
  return ctx;
}
