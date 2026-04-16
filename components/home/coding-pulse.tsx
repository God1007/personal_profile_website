"use client";

import { useMemo } from "react";
import { mockCodingPulse, type CodingPulseData } from "@/lib/wakatime";

type CodingPulseProps = {
  data?: CodingPulseData;
};

export function CodingPulse({ data = mockCodingPulse }: CodingPulseProps) {
  const ceiling = useMemo(() => Math.max(...data.activity.map((item) => item.hours), 1), [data.activity]);

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
        <div className={`pulse-status${data.source === "live" ? " pulse-status-live" : ""}`}>
          <span>{data.source === "live" ? "Live share" : "Mock preview"}</span>
          <strong>{data.rangeLabel}</strong>
        </div>
      </div>

      <div className="pulse-metrics-grid">
        <div className="pulse-metric">
          <span className="pulse-metric-label">Total time</span>
          <strong>{data.totalTime}</strong>
        </div>
        <div className="pulse-metric">
          <span className="pulse-metric-label">Daily average</span>
          <strong>{data.dailyAverage}</strong>
        </div>
        <div className="pulse-metric">
          <span className="pulse-metric-label">Best day</span>
          <strong>{data.bestDay}</strong>
        </div>
        <div className="pulse-metric">
          <span className="pulse-metric-label">Rhythm</span>
          <strong>{data.streak}</strong>
        </div>
      </div>

      <div className="pulse-board">
        <div className="pulse-cluster pulse-activity surface-panel">
          <div className="pulse-cluster-heading">
            <p className="eyebrow">Fluctuation</p>
            <p className="pulse-cluster-meta">Coding intensity across the recent cycle</p>
          </div>
          <div className="pulse-activity-bars" aria-label="Weekly coding fluctuation">
            {data.activity.map((item, index) => (
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
