import React, { useState } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { TrendingUp } from "lucide-react";

export default function RevenueTrendChart({ data = [], loading = false }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const fallbackData = [
    { month_name: "Jan", revenue: 8.4, orders: 840 },
    { month_name: "Feb", revenue: 9.2, orders: 910 },
    { month_name: "Mar", revenue: 10.5, orders: 1020 },
    { month_name: "Apr", revenue: 9.8, orders: 980 },
    { month_name: "May", revenue: 11.4, orders: 1150 },
    { month_name: "Jun", revenue: 12.8, orders: 1280 },
    { month_name: "Jul", revenue: 14.1, orders: 1420 },
  ];

  const chartData = data.length > 0 ? data : fallbackData;
  const revenues  = chartData.map((d) => parseFloat(d.revenue || 0));
  const maxRev    = Math.max(...revenues, 1.0);

  return (
    <AnalyticsCard
      title="Revenue & Order Volume Trend"
      subtitle="Monthly gross revenue (LKR) vs distributor order count"
      icon={TrendingUp}
    >
      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="h-56 flex items-center justify-center text-xs font-semibold text-slate-400">
            Fetching sales performance trend data...
          </div>
        ) : (
          <>
            <div className="relative h-56 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[0, 50, 100, 150, 200].map((y, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={y}
                    x2="700"
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area & Line */}
                {chartData.length > 1 && (
                  <>
                    <path
                      d={`M 35 ${200 - (parseFloat(chartData[0].revenue || 0) / maxRev) * 180} 
                         ${chartData
                           .map((d, i) => `L ${35 + i * (600 / (chartData.length - 1))} ${200 - (parseFloat(d.revenue || 0) / maxRev) * 180}`)
                           .join(" ")} 
                         L ${35 + (chartData.length - 1) * (600 / (chartData.length - 1))} 200 L 35 200 Z`}
                      fill="url(#revenueGradient)"
                    />

                    <path
                      d={`M 35 ${200 - (parseFloat(chartData[0].revenue || 0) / maxRev) * 180} 
                         ${chartData
                           .map((d, i) => `L ${35 + i * (600 / (chartData.length - 1))} ${200 - (parseFloat(d.revenue || 0) / maxRev) * 180}`)
                           .join(" ")}`}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </>
                )}

                {/* Points */}
                {chartData.map((d, i) => {
                  const step = chartData.length > 1 ? 600 / (chartData.length - 1) : 0;
                  const x = 35 + i * step;
                  const y = 200 - (parseFloat(d.revenue || 0) / maxRev) * 180;
                  const isHovered = hoveredIdx === i;

                  return (
                    <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 7 : 5}
                        className="fill-white stroke-blue-600 stroke-[3px] transition-all duration-200 cursor-pointer"
                      />
                      {isHovered && (
                        <g>
                          <rect
                            x={x - 50}
                            y={y - 42}
                            width="100"
                            height="32"
                            rx="12"
                            fill="#0f172a"
                            className="shadow-lg"
                          />
                          <text
                            x={x}
                            y={y - 22}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            LKR {Number(d.revenue || 0).toLocaleString()} ({d.orders || 0})
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* X Axis */}
            <div className="flex justify-between px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              {chartData.map((d, i) => (
                <span key={i} className={hoveredIdx === i ? "text-blue-600 font-extrabold" : ""}>
                  {d.month_name || `M${i + 1}`}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </AnalyticsCard>
  );
}
