import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Home } from "./Home";
import { IntellectualProperty } from "./IntellectualProperty";
import { Partnership } from "./Partnership";
import { Results } from "./Results";
import { Technology } from "./Technology";

function mount(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("website pages", () => {
  it("home states the offer and the launch CTA", () => {
    mount(<Home />);
    expect(screen.getByRole("heading", { name: /working digital twin/i })).toBeInTheDocument();
    expect(screen.getAllByText(/202611024014/).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /launch command centre|enter the digital twin/i }).length).toBeGreaterThan(0);
  });

  it("technology shows the cycle and Silk Board", () => {
    mount(<Technology />);
    expect(screen.getByText(/0–5 s Collect/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Silk Board/).length).toBeGreaterThan(0);
    expect(screen.getByText(/18-dimensional junction vector/i)).toBeInTheDocument();
  });

  it("results shows both SYMPHONY and FixedTime", () => {
    mount(<Results />);
    expect(screen.getAllByText("SYMPHONY").length).toBeGreaterThan(0);
    expect(screen.getByText("FixedTime")).toBeInTheDocument();
    expect(screen.getByText(/352%/)).toBeInTheDocument();
    expect(screen.getByText(/10.2%/)).toBeInTheDocument();
  });

  it("ip shows the filing identities", () => {
    mount(<IntellectualProperty />);
    expect(screen.getAllByText("202611024014").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Yushu Excellence Technologies/).length).toBeGreaterThan(0);
    expect(screen.getByText(/First Examination Report response submitted/i)).toBeInTheDocument();
  });

  it("partnership exposes a named form to Amit Dua", () => {
    mount(<Partnership />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Organisation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Email Amit Dua/i })).toBeInTheDocument();
  });
});
