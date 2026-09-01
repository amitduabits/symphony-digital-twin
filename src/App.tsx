import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Technology } from "./pages/Technology";
import { Results } from "./pages/Results";
import { IntellectualProperty } from "./pages/IntellectualProperty";
import { Partnership } from "./pages/Partnership";
import { CommandCenter } from "./pages/CommandCenter";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/results" element={<Results />} />
        <Route path="/ip" element={<IntellectualProperty />} />
        <Route path="/partnership" element={<Partnership />} />
        <Route path="/app" element={<CommandCenter />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
