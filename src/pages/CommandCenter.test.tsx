import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SCENARIOS } from "../engine";
import { CommandCenter } from "./CommandCenter";

vi.mock("../components/MapView", () => ({
  default: () => <div data-testid="map-view">map</div>,
}));

function mount() {
  return render(
    <MemoryRouter>
      <CommandCenter />
    </MemoryRouter>,
  );
}

describe("command centre", () => {
  it("shows overview KPIs and all six junctions", () => {
    mount();
    expect(screen.getAllByText(/Bengaluru/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Silk Board").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Marathahalli").length).toBeGreaterThan(0);
    expect(screen.getByText(/30-second operational cycle/i)).toBeInTheDocument();
  });

  it("exposes every pane", () => {
    mount();
    for (const label of [
      "Overview",
      "Network map",
      "Agents",
      "T-GNN",
      "Fusion",
      "Twin A/B",
      "Evaluation",
      "Cameras",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  it("opens each pane with distinctive copy", async () => {
    const user = userEvent.setup();
    mount();

    await user.click(screen.getByRole("button", { name: "Agents" }));
    expect(screen.getByText(/Third language model/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "T-GNN" }));
    expect(screen.getByText(/18-d feature vector/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Fusion" }));
    expect(screen.getByText(/Google · TomTom · fused/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Twin A/B" }));
    expect(screen.getByText(/Fixed-time baseline/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Evaluation" }));
    expect(screen.getByText(/Quick-test harness/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Network map" }));
    expect(screen.getByText(/ORR corridor twin/i)).toBeInTheDocument();
  });

  it("lists all seven scenarios", () => {
    mount();
    const select = screen.getByDisplayValue(/Morning peak/i);
    const options = Array.from(select.querySelectorAll("option")).map((o) => o.value);
    expect(options).toEqual(SCENARIOS.map((s) => s.id));
    expect(options).toContain("outage");
  });

  it("pauses and resets", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(screen.getByRole("button", { name: "Run" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getAllByText(/Stand up corridor|ORR Silk Board/i).length).toBeGreaterThan(0);
  });
});
