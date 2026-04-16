"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { loadWakaTimeShare, mockCodingPulse, type CodingPulseData } from "@/lib/wakatime";

type CodingPulseProps = {
  data?: CodingPulseData;
  shareUrl?: string | null;
};

export function CodingPulse({ data = mockCodingPulse, shareUrl }: CodingPulseProps) {
  const [resolvedData, setResolvedData] = useState<CodingPulseData>(data);

  useEffect(() => {
    setResolvedData(data);
  }, [data]);

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
        setResolvedData(nextData);
      });
    });

    return () => {
      active = false;
    };
  }, [data.source, shareUrl]);

  const hasLiveData = resolvedData.source === "live";
  const displayActivity = hasLiveData ? resolvedData.activity : mockCodingPulse.activity.map((item) => ({ ...item, hours: 0 }));
  const ceiling = useMemo(() => Math.max(...displayActivity.map((item) => item.hours), 1), [displayActivity]);

  return (
    <div className="coding-pulse surface-panel surface-panel-strong">
      <div className="coding-pulse-header">
        <div>
          <p className="eyebrow">Activity</p>
          <h3>Coding Pulse</h3>
          <p className="coding-pulse-intro">
            通过 WakaTime share JSON 接入编码节奏。当前显示最近一段时间的活跃度、语言分布、编辑器和项目占比。
          </p>
        </div>
        <div className={`pulse-status${hasLiveData ? " pulse-status-live" : ""}`}>
          <span>{hasLiveData ? "Live share" : "NULL"}</span>
          <strong>{hasLiveData ? resolvedData.rangeLabel : "WakaTime unavailable"}</strong>
        </div>
      </div>

      <div className="pulse-metrics-grid">
        <div className="pulse-metric">
          <span className="pulse-metric-label">Total time</span>
          <strong>{hasLiveData ? resolvedData.totalTime : "NULL"}</strong>
        </div>
        <div className="pulse-metric">
          <span className="pulse-metric-label">Daily average</span>
          <strong>{hasLiveData ? resolvedData.dailyAverage : "NULL"}</strong>
        </div>
        <div className="pulse-metric">
          <span className="pulse-metric-label">Best day</span>
          <strong>{hasLiveData ? resolvedData.bestDay : "NULL"}</strong>
        </div>
        <div className="pulse-metric">
          <span className="pulse-metric-label">Rhythm</span>
          <strong>{hasLiveData ? resolvedData.streak : "NULL"}</strong>
        </div>
      </div>

      <div className="pulse-board">
        <div className="pulse-cluster pulse-activity surface-panel">
          <div className="pulse-cluster-heading">
            <p className="eyebrow">Fluctuation</p>
            <p className="pulse-cluster-meta">Coding intensity across the recent cycle</p>
          </div>
          <div className="pulse-activity-bars" aria-label="Weekly coding fluctuation">
            {displayActivity.map((item, index) => (
              <div key={`${item.day}-${index}`} className="pulse-activity-column">
                <div className="pulse-activity-track">
                  <span
                    className="pulse-activity-fill"
                    style={{ height: `${Math.max((item.hours / ceiling) * 100, 12)}%` }}
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
