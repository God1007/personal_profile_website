import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import HomePage from "@/app/page";

vi.mock("@/lib/wakatime-cache.server", async () => {
  const actual = await vi.importActual<typeof import("@/lib/wakatime")>("@/lib/wakatime");

  return {
    loadCachedWakaTimeShare: vi.fn().mockResolvedValue({
      ...actual.mockCodingPulse,
      source: "live",
      rangeLabel: "2026-04-10 to 2026-04-16"
    })
  };
});

describe("HomePage", () => {
  it("shows dedicated snap panels for each major homepage section", async () => {
    render(await HomePage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /engineering systems with clarity/i
      })
    ).toBeInTheDocument();

    expect(screen.getAllByText(/jared 01 home/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/小陈/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /like this intro/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /coding pulse/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /selected projects/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /jared 01 home/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /education & journey/i })).toBeInTheDocument();
    expect(screen.getByText(/build, measure, iterate/i)).toBeInTheDocument();
    expect(document.querySelector(".home-snap-shell")).toBeTruthy();
    expect(document.querySelectorAll(".home-panel")).toHaveLength(9);
    expect(document.querySelector("#work")).toBeTruthy();
    expect(document.querySelector("#work-notes")).toBeTruthy();
    expect(document.querySelector("#writing")).toBeTruthy();
    expect(document.querySelector("#timeline")).toBeTruthy();
    expect(document.querySelector("#contact")).toBeTruthy();
  });

  it("renders separate hero backdrop layers for light and dark themes", async () => {
    render(await HomePage());

    expect(document.querySelector(".hero-backdrop-image.hero-backdrop-image-light")).toBeTruthy();
    expect(document.querySelector(".hero-backdrop-image.hero-backdrop-image-dark")).toBeTruthy();
  });
});
