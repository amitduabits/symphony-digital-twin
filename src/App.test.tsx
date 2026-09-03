import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./components/MapView", () => ({
  default: () => <div data-testid="map-view">map</div>,
}));

describe("website routes", () => {
  it("lands on the industry home page", () => {
    window.location.hash = "#/";
    render(<App />);
    expect(screen.getByRole("heading", { name: /any city you can grant access to/i })).toBeInTheDocument();
    expect(screen.getAllByText(/202611024014/).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /launch command centre/i })).toBeInTheDocument();
  });

  it("redirects unknown hashes home", () => {
    window.location.hash = "#/does-not-exist";
    render(<App />);
    expect(screen.getByRole("heading", { name: /any city you can grant access to/i })).toBeInTheDocument();
  });
});
