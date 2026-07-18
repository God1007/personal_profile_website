import { render, screen, waitFor } from "@testing-library/react";
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
  it("presents the portfolio as a responsive, naturally scrolling story", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ count: 12, liked: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        })
      )
    );
    render(await HomePage());

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /systems, made clear/i
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/jared chan/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
    const likeButton = screen.getByRole("button", { name: /appreciate this site/i });
    await waitFor(() => expect(likeButton).toBeEnabled());
    expect(screen.getByRole("img", { name: /pointer-reactive network/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /work leaves a pulse/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /problems i chose to stay with/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /technical notes & build logs/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: /learning in public/i })).toBeInTheDocument();
    expect(document.querySelector(".home-snap-shell")).toBeNull();
    expect(document.querySelectorAll(".portfolio-project-card")).toHaveLength(3);
    expect(document.querySelector("#about")).toBeTruthy();
    expect(document.querySelector("#pulse")).toBeTruthy();
    expect(document.querySelector("#work")).toBeTruthy();
    expect(document.querySelector("#writing")).toBeTruthy();
    expect(document.querySelector("#timeline")).toBeTruthy();
    expect(document.querySelector("#contact")).toBeTruthy();
  });
});
