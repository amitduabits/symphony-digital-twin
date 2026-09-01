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
import {
  createInitialState,
  resetState,
  setScenario as applyScenario,
  tick,
  type AppView,
  type ScenarioId,
  type TwinState,
} from "../engine";

interface TwinContextValue {
  state: TwinState;
  view: AppView;
  setView: (v: AppView) => void;
  toggle: () => void;
  reset: () => void;
  changeScenario: (id: ScenarioId) => void;
  changeSpeed: (n: number) => void;
}

const TwinContext = createContext<TwinContextValue | null>(null);

export function TwinProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TwinState>(() => createInitialState("morning_rush"));
  const [view, setView] = useState<AppView>("overview");
  const stateRef = useRef(state);
  stateRef.current = state;

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

  const toggle = useCallback(() => {
    setState((s) => ({ ...s, running: !s.running }));
  }, []);

  const reset = useCallback(() => {
    setState((s) => resetState(s.scenario, s.speed));
  }, []);

  const changeScenario = useCallback((id: ScenarioId) => {
    setState((s) => applyScenario({ ...s }, id));
  }, []);

  const changeSpeed = useCallback((n: number) => {
    setState((s) => ({ ...s, speed: n }));
  }, []);

  const value = useMemo(
    () => ({ state, view, setView, toggle, reset, changeScenario, changeSpeed }),
    [state, view, toggle, reset, changeScenario, changeSpeed],
  );

  return <TwinContext.Provider value={value}>{children}</TwinContext.Provider>;
}

export function useTwin() {
  const ctx = useContext(TwinContext);
  if (!ctx) throw new Error("useTwin must be used inside TwinProvider");
  return ctx;
}
