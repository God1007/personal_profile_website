import { render, screen, waitFor } from "@testing-library/react";
import { CodingPulse } from "@/components/home/coding-pulse";
import { loadWakaTimeShare, mockCodingPulse } from "@/lib/wakatime";

vi.mock("@/lib/wakatime", async () => {
  const actual = await vi.importActual<typeof import("@/lib/wakatime")>("@/lib/wakatime");
  return {
    ...actual,
    loadWakaTimeShare: vi.fn(actual.loadWakaTimeShare)
  };
});

describe("CodingPulse", () => {
  it("retries live data on the client when initial data is mock", async () => {
    vi.mocked(loadWakaTimeShare).mockResolvedValueOnce({
      ...mockCodingPulse,
      source: "live",
      rangeLabel: "2026-04-10 to 2026-04-16",
      totalTime: "2 hrs"
    });

    render(<CodingPulse shareUrl="https://example.com/share.json" />);

    await waitFor(() => {
      expect(screen.getByText(/live share/i)).toBeInTheDocument();
    });

    expect(screen.getByText("2 hrs")).toBeInTheDocument();
  });

  it("renders only the real-data coding pulse sections", () => {
    render(<CodingPulse />);

    expect(screen.getByRole("heading", { level: 3, name: /coding pulse/i })).toBeInTheDocument();
    expect(screen.getAllByText(/^null$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/wakatime unavailable/i)).toBeInTheDocument();
    expect(screen.getByText(/total time/i)).toBeInTheDocument();
    expect(screen.getByText(/fluctuation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^NULL$/)).toHaveLength(5);
    expect(screen.queryByText(/languages/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/editors/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/projects/i)).not.toBeInTheDocument();
  });
});
