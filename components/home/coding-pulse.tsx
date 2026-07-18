"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { loadWakaTimeShare, mockCodingPulse, type CodingPulseData } from "@/lib/wakatime";

type CodingPulseProps = {
  data?: CodingPulseData;
  shareUrl?: string | null;
};

export function CodingPulse({ data = mockCodingPulse, shareUrl }: CodingPulseProps) {
  const [liveData, setLiveData] = useState<CodingPulseData | null>(null);
  const resolvedData = data.source === "live" ? data : liveData ?? data;

  useEffect(() => {
    if (!shareUrl || data.source === "live") {
      return;
    }

    let active = true;

    void loadWakaTimeShare(shareUrl).then((nextData) => {
      if (!active || nextData.source !== "live") {
        return;
      }

      startTransition(() => {
        setLiveData(nextData);
      });
    });

    return () => {
      active = false;
    };
  }, [data.source, shareUrl]);

  const hasLiveData = resolvedData.source === "live";
  const displayActivity = hasLiveData
    ? resolvedData.activity
    : mockCodingPulse.activity.map((item) => ({ ...item, hours: 0 }));
  const ceiling = useMemo(() => Math.max(...displayActivity.map((item) => item.hours), 1), [displayActivity]);

  return (
    <div className="coding-pulse surface-panel surface-panel-strong">
      <div className="coding-pulse-header">
        <div>
          <p className="coding-pulse-label">WakaTime activity</p>
          <h3>Coding Pulse</h3>
          <p className="coding-pulse-intro">展示最近一个记录周期内的 WakaTime 活动数据。</p>
        </div>
        <div className={`pulse-status${hasLiveData ? " pulse-status-live" : ""}`}>
          <span>{hasLiveData ? "Live data" : "Unavailable"}</span>
          <strong>{hasLiveData ? resolvedData.rangeLabel : "Waiting for the next sync"}</strong>
        </div>
      </div>

      <div className="pulse-metrics-grid">
        <div className="pulse-metric">
          <span className="pulse-metric-label">Total time</span>
          <strong>{hasLiveData ? resolvedData.totalTime : "No data"}</strong>
        </div>
        <div className="pulse-metric">
          <span className="pulse-metric-label">Daily average</span>
          <strong>{hasLiveData ? resolvedData.dailyAverage : "No data"}</strong>
        </div>
        <div className="pulse-metric">
          <span className="pulse-metric-label">Best day</span>
          <strong>{hasLiveData ? resolvedData.bestDay : "No data"}</strong>
        </div>
        <div className="pulse-metric">
          <span className="pulse-metric-label">Rhythm</span>
          <strong>{hasLiveData ? resolvedData.streak : "No data"}</strong>
        </div>
      </div>

      <div className="pulse-board">
        <div className="pulse-cluster pulse-activity surface-panel">
          <div className="pulse-cluster-heading">
            <p className="coding-pulse-label">Daily fluctuation</p>
            <p className="pulse-cluster-meta">最近每日活跃变化</p>
          </div>
          <div className="pulse-activity-bars" aria-label="Weekly coding fluctuation">
            {displayActivity.map((item, index) => (
              <div key={`${item.day}-${index}`} className="pulse-activity-column">
                <div className="pulse-activity-track">
                  <span
                    className="pulse-activity-fill"
                    style={{ height: item.hours > 0 ? `${Math.max((item.hours / ceiling) * 100, 8)}%` : "0%" }}
                  />
                </div>
                <span className="pulse-activity-value">{item.hours.toFixed(1)}h</span>
                <span className="pulse-activity-day">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
