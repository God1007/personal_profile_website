export type CodingBucket = {
  name: string;
  text: string;
  percent: number;
};

export type CodingPulseData = {
  source: "mock" | "live";
  rangeLabel: string;
  totalTime: string;
  dailyAverage: string;
  bestDay: string;
  streak: string;
  activity: Array<{
    day: string;
    hours: number;
  }>;
  languages: CodingBucket[];
  editors: CodingBucket[];
  projects: CodingBucket[];
};

export const mockCodingPulse: CodingPulseData = {
  source: "mock",
  rangeLabel: "Last 7 days",
  totalTime: "32 hrs 18 mins",
  dailyAverage: "4 hrs 37 mins / day",
  bestDay: "Saturday 7.4 hrs",
  streak: "6 focused days",
  activity: [
    { day: "Mon", hours: 3.2 },
    { day: "Tue", hours: 4.1 },
    { day: "Wed", hours: 5.4 },
    { day: "Thu", hours: 2.8 },
    { day: "Fri", hours: 4.9 },
    { day: "Sat", hours: 7.4 },
    { day: "Sun", hours: 4.5 }
  ],
  languages: [
    { name: "C++", text: "14 hrs 12 mins", percent: 44 },
    { name: "Python", text: "9 hrs 08 mins", percent: 28 },
    { name: "TypeScript", text: "5 hrs 26 mins", percent: 17 }
  ],
  editors: [
    { name: "VS Code", text: "18 hrs 42 mins", percent: 58 },
    { name: "CLion", text: "9 hrs 36 mins", percent: 30 },
    { name: "Cursor", text: "3 hrs 21 mins", percent: 10 }
  ],
  projects: [
    { name: "Jared 01 Home", text: "8 hrs 34 mins", percent: 27 },
    { name: "AI Diagnostics", text: "12 hrs 18 mins", percent: 38 },
    { name: "Traffic RL", text: "6 hrs 40 mins", percent: 21 }
  ]
};

function formatHours(totalSeconds: number) {
  const roundedMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} hr${hours === 1 ? "" : "s"} ${minutes} min${minutes === 1 ? "" : "s"}`;
  }

  if (hours > 0) {
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  }

  if (minutes > 0) {
    return `${minutes} min${minutes === 1 ? "" : "s"}`;
  }

  return "0 secs";
}

function normalizeBuckets(raw: unknown): CodingBucket[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const bucket = item as Record<string, unknown>;
      const percentValue = bucket.percent;
      const percent =
        typeof percentValue === "number"
          ? percentValue
          : typeof percentValue === "string"
            ? Number.parseFloat(percentValue)
            : 0;

      return {
        name: String(bucket.name ?? bucket.label ?? "Unknown"),
        text: String(bucket.text ?? bucket.digital ?? bucket.hours ?? ""),
        percent: Number.isFinite(percent) ? percent : 0
      };
    })
    .filter((bucket): bucket is CodingBucket => Boolean(bucket))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);
}

function normalizeActivity(raw: unknown) {
  if (!Array.isArray(raw)) {
    return mockCodingPulse.activity;
  }

  const activity = raw
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const day = item as Record<string, unknown>;
      const total =
        typeof day.total_seconds === "number"
          ? day.total_seconds / 3600
          : typeof day.hours === "number"
            ? day.hours
            : 0;

      return {
        day: String(day.name ?? day.day ?? "Day").slice(0, 3),
        hours: Number(total.toFixed(1))
      };
    })
    .filter((item): item is { day: string; hours: number } => Boolean(item))
    .slice(-7);

  return activity.length > 0 ? activity : mockCodingPulse.activity;
}

function parseDailySummaryShare(raw: unknown): CodingPulseData | null {
  if (!Array.isArray(raw)) {
    return null;
  }

  const activity = raw
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const entry = item as Record<string, unknown>;
      const range = entry.range as Record<string, unknown> | undefined;
      const total = entry.grand_total as Record<string, unknown> | undefined;
      const label = String(range?.text ?? range?.date ?? "Day");
      const seconds = typeof total?.total_seconds === "number" ? total.total_seconds : 0;

      return {
        day: label.slice(0, 3),
        hours: Number((seconds / 3600).toFixed(1)),
        seconds
      };
    })
    .filter((item): item is { day: string; hours: number; seconds: number } => Boolean(item));

  if (activity.length === 0) {
    return null;
  }

  const totalSeconds = activity.reduce((sum, item) => sum + item.seconds, 0);
  const bestActivity = [...activity].sort((a, b) => b.hours - a.hours)[0] ?? activity[0];
  const activeDays = activity.filter((item) => item.hours > 0).length;
  const firstDay = raw[0] as Record<string, unknown>;
  const lastDay = raw[raw.length - 1] as Record<string, unknown>;
  const firstRange = firstDay.range as Record<string, unknown> | undefined;
  const lastRange = lastDay.range as Record<string, unknown> | undefined;
  const firstDate = String(firstRange?.date ?? "");
  const lastDate = String(lastRange?.date ?? "");
  const rangeLabel =
    firstDate && lastDate
      ? `${firstDate} to ${lastDate}`
      : mockCodingPulse.rangeLabel;

  return {
    source: "live",
    rangeLabel,
    totalTime: formatHours(totalSeconds),
    dailyAverage: `${formatHours(totalSeconds / activity.length)} / day`,
    bestDay: `${bestActivity.day} ${bestActivity.hours.toFixed(1)} hrs`,
    streak: `${activeDays} active days`,
    activity: activity.map(({ day, hours }) => ({ day, hours })),
    languages: mockCodingPulse.languages,
    editors: mockCodingPulse.editors,
    projects: mockCodingPulse.projects
  };
}

export function parseWakaTimeShare(payload: unknown): CodingPulseData {
  const root =
    payload && typeof payload === "object" && "data" in payload
      ? (payload as Record<string, unknown>).data
      : payload;

  const summaryShare = parseDailySummaryShare(root);
  if (summaryShare) {
    return summaryShare;
  }

  if (!root || typeof root !== "object") {
    return mockCodingPulse;
  }

  const data = root as Record<string, unknown>;
  const languages = normalizeBuckets(data.languages);
  const editors = normalizeBuckets(data.editors);
  const projects = normalizeBuckets(data.projects);
  const activity = normalizeActivity(data.days ?? data.data);
  const totalTime = String(
    (data.grand_total as Record<string, unknown> | undefined)?.text ??
      data.human_readable_total ??
      mockCodingPulse.totalTime
  );
  const dailyAverage = String(
    (data.daily_average as Record<string, unknown> | undefined)?.text ??
      data.human_readable_daily_average ??
      mockCodingPulse.dailyAverage
  );
  const bestActivity = [...activity].sort((a, b) => b.hours - a.hours)[0] ?? mockCodingPulse.activity[5];

  return {
    source: "live",
    rangeLabel: String(data.range ?? data.range_text ?? mockCodingPulse.rangeLabel),
    totalTime,
    dailyAverage,
    bestDay: `${bestActivity.day} ${bestActivity.hours.toFixed(1)} hrs`,
    streak: `${activity.filter((item) => item.hours > 0).length} active days`,
    activity,
    languages: languages.length > 0 ? languages : mockCodingPulse.languages,
    editors: editors.length > 0 ? editors : mockCodingPulse.editors,
    projects: projects.length > 0 ? projects : mockCodingPulse.projects
  };
}

export async function loadWakaTimeShare(
  shareUrl?: string | null,
  fetchImpl: typeof fetch = fetch
): Promise<CodingPulseData> {
  if (!shareUrl) {
    return mockCodingPulse;
  }

  try {
    const response = await fetchImpl(shareUrl, {
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`WakaTime share request failed: ${response.status}`);
    }

    const payload = (await response.json()) as unknown;
    return parseWakaTimeShare(payload);
  } catch {
    return mockCodingPulse;
  }
}
