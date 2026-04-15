import { describe, expect, it } from "vitest";
import { mockCodingPulse, parseWakaTimeShare } from "@/lib/wakatime";

describe("wakatime parsing", () => {
  it("falls back to mock data for invalid payloads", () => {
    expect(parseWakaTimeShare(null)).toEqual(mockCodingPulse);
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
});
