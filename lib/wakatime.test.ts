import { describe, expect, it, vi } from "vitest";
import { loadWakaTimeShare, mockCodingPulse, parseWakaTimeShare } from "@/lib/wakatime";

describe("wakatime parsing", () => {
  it("falls back to mock data for invalid payloads", () => {
    expect(parseWakaTimeShare(null)).toEqual(mockCodingPulse);
  });

  it("normalizes a daily-summary share payload", () => {
    const result = parseWakaTimeShare({
      data: [
        {
          range: {
            date: "2026-04-10",
            text: "Fri Apr 10th 2026"
          },
          grand_total: {
            text: "0 secs",
            total_seconds: 3.424
          }
        },
        {
          range: {
            date: "2026-04-11",
            text: "Sat Apr 11th 2026"
          },
          grand_total: {
            text: "0 secs",
            total_seconds: 0
          }
        },
        {
          range: {
            date: "2026-04-12",
            text: "Sun Apr 12th 2026"
          },
          grand_total: {
            text: "24 mins",
            total_seconds: 1469.297
          }
        }
      ]
    });

    expect(result.source).toBe("live");
    expect(result.activity).toEqual([
      { day: "Fri", hours: 0 },
      { day: "Sat", hours: 0 },
      { day: "Sun", hours: 0.4 }
    ]);
    expect(result.rangeLabel).toBe("2026-04-10 to 2026-04-12");
    expect(result.totalTime).toBe("25 mins");
    expect(result.dailyAverage).toBe("8 mins / day");
    expect(result.bestDay).toBe("Sun 路 0.4 hrs");
    expect(result.streak).toBe("1 active days");
    expect(result.languages).toEqual(mockCodingPulse.languages);
  });

  it("normalizes a basic share payload", () => {
    const result = parseWakaTimeShare({
      data: {
        range: "Last 7 Days",
        grand_total: { text: "12 hrs 30 mins" },
        daily_average: { text: "1 hr 47 mins" },
        languages: [
          { name: "TypeScript", text: "5 hrs", percent: 40 },
          { name: "Python", text: "4 hrs", percent: 32 }
        ],
        editors: [{ name: "VS Code", text: "8 hrs", percent: 64 }],
        projects: [{ name: "Jared 01 Home", text: "6 hrs", percent: 48 }],
        days: [
          { name: "Mon", total_seconds: 7200 },
          { name: "Tue", total_seconds: 14400 }
        ]
      }
    });

    expect(result.source).toBe("live");
    expect(result.rangeLabel).toBe("Last 7 Days");
    expect(result.totalTime).toBe("12 hrs 30 mins");
    expect(result.languages[0]?.name).toBe("TypeScript");
    expect(result.activity).toHaveLength(2);
  });

  it("loads live data with a fetch implementation", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            range: { date: "2026-04-10", text: "Fri Apr 10th 2026" },
            grand_total: { total_seconds: 3600, text: "1 hr" }
          }
        ]
      })
    });

    const result = await loadWakaTimeShare("https://example.com/share.json", fetchMock as unknown as typeof fetch);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(result.source).toBe("live");
    expect(result.totalTime).toBe("1 hr");
  });

  it("falls back to mock data when fetching live data fails", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network"));

    const result = await loadWakaTimeShare("https://example.com/share.json", fetchMock as unknown as typeof fetch);

    expect(result).toEqual(mockCodingPulse);
  });
});
