import React, { useState, useMemo } from "react";
import AnalyticsCard from "./AnalyticsCard";
import { TrendingUp, ShoppingCart, Sparkles } from "lucide-react";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatLKR = (val) => {
  const num = Number(val || 0);
  if (num >= 1000000) return `LKR ${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `LKR ${(num / 1000).toFixed(1)}k`;
  return `LKR ${num.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
};

export default function RevenueTrendChart({ data = [], loading = false }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [monthsCount, setMonthsCount] = useState(6); // 6 or 12 months

  // Generate continuous timeline (ending at current month)
  const chartData = useMemo(() => {
    const list = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      list.push({
        month_name: MONTH_NAMES[d.getMonth()],
        month_num: d.getMonth() + 1,
        year: d.getFullYear(),
        revenue: 0,
        orders: 0,
      });
    }

    // Populate with real data from backend
    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        const mName = item.month_name;
        const mNum = parseInt(item.month_num || 0);
        const yNum = parseInt(item.year_num || item.year || 0);

        const target = list.find((m) => {
          const matchMonth = m.month_name === mName || (mNum && m.month_num === mNum);
          const matchYear = !yNum || m.year === yNum;
          return matchMonth && matchYear;
        }) || list.find((m) => m.month_name === mName || (mNum && m.month_num === mNum));

        if (target) {
          target.revenue += parseFloat(item.revenue || 0);
          target.orders += parseInt(item.orders || 0);
        }
      });
    }

    return list;
  }, [data, monthsCount]);

  // Calculations for graph geometry
  const revenues = chartData.map((d) => d.revenue);
  const orders = chartData.map((d) => d.orders);
  const rawMaxRev = Math.max(...revenues, 0);
  // Ensure non-zero ceiling with clean round numbers
  const maxRev = rawMaxRev > 0 ? rawMaxRev * 1.15 : 10000;
  const maxOrders = Math.max(...orders, 1);

  const totalPeriodRevenue = revenues.reduce((acc, curr) => acc + curr, 0);
  const totalPeriodOrders = orders.reduce((acc, curr) => acc + curr, 0);
  const peakMonth = chartData.reduce(
    (prev, curr) => (curr.revenue > prev.revenue ? curr : prev),
    chartData[0]
  );

  // SVG Dimension Constants
  const SVG_WIDTH = 700;
  const SVG_HEIGHT = 200;
  const PADDING_LEFT = 60;
  const PADDING_RIGHT = 30;
  const PADDING_TOP = 25;
  const PADDING_BOTTOM = 25;
  const PLOT_WIDTH = SVG_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const PLOT_HEIGHT = SVG_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const BASELINE_Y = PADDING_TOP + PLOT_HEIGHT;

  // Calculate points coordinate array
  const points = useMemo(() => {
    const n = chartData.length;
    const step = n > 1 ? PLOT_WIDTH / (n - 1) : 0;

    return chartData.map((d, i) => {
      const x = PADDING_LEFT + i * step;
      const revRatio = maxRev > 0 ? d.revenue / maxRev : 0;
      const y = BASELINE_Y - revRatio * PLOT_HEIGHT;
      const orderRatio = maxOrders > 0 ? d.orders / maxOrders : 0;
      const barHeight = Math.max(orderRatio * (PLOT_HEIGHT * 0.75), d.orders > 0 ? 8 : 0);

      return {
        ...d,
        x,
        y: Math.min(Math.max(y, PADDING_TOP), BASELINE_Y),
        barHeight,
        barY: BASELINE_Y - barHeight,
      };
    });
  }, [chartData, maxRev, maxOrders, PLOT_WIDTH, PLOT_HEIGHT, BASELINE_Y]);

  // Generate smooth cubic bezier SVG path
  const { linePath, areaPath } = useMemo(() => {
    if (points.length === 0) return { linePath: "", areaPath: "" };
    if (points.length === 1) {
      const pt = points[0];
      return {
        linePath: `M ${PADDING_LEFT},${pt.y} L ${PADDING_LEFT + PLOT_WIDTH},${pt.y}`,
        areaPath: `M ${PADDING_LEFT},${pt.y} L ${PADDING_LEFT + PLOT_WIDTH},${pt.y} L ${PADDING_LEFT + PLOT_WIDTH},${BASELINE_Y} L ${PADDING_LEFT},${BASELINE_Y} Z`,
      };
    }

    const path = points.reduce((acc, pt, i, arr) => {
      if (i === 0) return `M ${pt.x},${pt.y}`;
      const prev = arr[i - 1];
      const cx1 = prev.x + (pt.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) / 2;
      const cy2 = pt.y;
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`;
    }, "");

    const area = `${path} L ${points[points.length - 1].x},${BASELINE_Y} L ${points[0].x},${BASELINE_Y} Z`;

    return { linePath: path, areaPath: area };
  }, [points, BASELINE_Y, PLOT_WIDTH]);

  // Y-Axis tick intervals
  const yTicks = [
    { ratio: 1.0, y: PADDING_TOP, label: formatLKR(maxRev) },
    { ratio: 0.5, y: PADDING_TOP + PLOT_HEIGHT * 0.5, label: formatLKR(maxRev * 0.5) },
    { ratio: 0.0, y: BASELINE_Y, label: "LKR 0" },
  ];

  return (
    <AnalyticsCard
      title="Revenue & Order Volume Trend"
      subtitle="Monthly gross sales revenue (LKR) alongside distributor order volume"
      icon={TrendingUp}
      action={
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-full border border-slate-200/60 shadow-2xs">
          <button
            type="button"
            onClick={() => setMonthsCount(6)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              monthsCount === 6
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            6M
          </button>
          <button
            type="button"
            onClick={() => setMonthsCount(12)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              monthsCount === 12
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            12M
          </button>
        </div>
      }
    >
      <div className="space-y-4 pt-1 font-sans">
        {/* Quick KPI Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/70 border border-slate-100 rounded-2xl p-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Period Revenue</span>
              <span className="text-sm font-extrabold text-slate-900">
                LKR {Number(totalPeriodRevenue).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="h-7 w-px bg-slate-200/70" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Volume</span>
              <span className="text-sm font-extrabold text-blue-600 flex items-center gap-1">
                <ShoppingCart size={13} />
                {totalPeriodOrders} Orders
              </span>
            </div>
          </div>

          {peakMonth && peakMonth.revenue > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold">
              <Sparkles size={12} className="text-emerald-500" />
              <span>Peak: {peakMonth.month_name} ({formatLKR(peakMonth.revenue)})</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="h-56 flex items-center justify-center text-xs font-semibold text-slate-400">
            Fetching sales performance trend data...
          </div>
        ) : (
          <div className="space-y-2">
            {/* SVG Interactive Chart */}
            <div className="relative h-60 w-full">
              <svg
                className="w-full h-full overflow-visible select-none"
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
              >
                <defs>
                  {/* Revenue Area Fill Gradient */}
                  <linearGradient id="revenueTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.32" />
                    <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Volume Bar Gradient */}
                  <linearGradient id="volumeBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.15" />
                  </linearGradient>

                  {/* Drop Shadow for Area Line */}
                  <filter id="lineGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* Horizontal Gridlines & Y-Axis Scale Labels */}
                {yTicks.map((tick, i) => (
                  <g key={i}>
                    <line
                      x1={PADDING_LEFT}
                      y1={tick.y}
                      x2={SVG_WIDTH - PADDING_RIGHT}
                      y2={tick.y}
                      stroke="#f1f5f9"
                      strokeWidth="1.5"
                      strokeDasharray={i === yTicks.length - 1 ? "none" : "4 4"}
                    />
                    <text
                      x={PADDING_LEFT - 8}
                      y={tick.y + 3.5}
                      textAnchor="end"
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {tick.label}
                    </text>
                  </g>
                ))}

                {/* Secondary Layer: Order Volume Background Bars */}
                {points.map((pt, i) => (
                  <rect
                    key={`bar-${i}`}
                    x={pt.x - 14}
                    y={pt.barY}
                    width="28"
                    height={pt.barHeight}
                    rx="6"
                    fill="url(#volumeBarGradient)"
                    className="transition-all duration-200 pointer-events-none"
                  />
                ))}

                {/* Primary Layer: Revenue Curve & Gradient Area */}
                {areaPath && (
                  <path
                    d={areaPath}
                    fill="url(#revenueTrendGradient)"
                    className="transition-all duration-300"
                  />
                )}

                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#lineGlow)"
                    className="transition-all duration-300"
                  />
                )}

                {/* Interactive Points and Hover Crosshair */}
                {points.map((pt, i) => {
                  const isHovered = hoveredIdx === i;

                  return (
                    <g
                      key={`pt-${i}`}
                      onMouseEnter={() => setHoveredIdx(i)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className="cursor-pointer"
                    >
                      {/* Hover Vertical Guide Line */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={PADDING_TOP}
                          x2={pt.x}
                          y2={BASELINE_Y}
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          strokeOpacity="0.7"
                        />
                      )}

                      {/* Invisible Larger Hit Area for Easy Hovering */}
                      <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                      {/* Outer Ring on Hover */}
                      {isHovered && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="10"
                          className="fill-blue-100 stroke-blue-400 stroke-2 animate-pulse"
                        />
                      )}

                      {/* Data Point Dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4.5}
                        className={`fill-white stroke-blue-600 transition-all duration-150 ${
                          isHovered ? "stroke-[3.5px] scale-110" : "stroke-[3px]"
                        }`}
                      />

                      {/* Interactive Floating Tooltip */}
                      {isHovered && (
                        <g className="pointer-events-none transition-all duration-150">
                          {/* Position tooltip safely inside bounds */}
                          {(() => {
                            const tooltipWidth = 148;
                            const tooltipHeight = 52;
                            const rawTooltipX = pt.x - tooltipWidth / 2;
                            const tooltipX = Math.min(
                              Math.max(rawTooltipX, PADDING_LEFT),
                              SVG_WIDTH - PADDING_RIGHT - tooltipWidth
                            );
                            const tooltipY =
                              pt.y - tooltipHeight - 12 < PADDING_TOP
                                ? pt.y + 14
                                : pt.y - tooltipHeight - 12;

                            return (
                              <g transform={`translate(${tooltipX}, ${tooltipY})`}>
                                <rect
                                  width={tooltipWidth}
                                  height={tooltipHeight}
                                  rx="12"
                                  fill="#0f172a"
                                  className="shadow-2xl"
                                />
                                <text
                                  x={tooltipWidth / 2}
                                  y="16"
                                  textAnchor="middle"
                                  fill="#94a3b8"
                                  fontSize="9.5"
                                  fontWeight="700"
                                >
                                  {pt.month_name} {pt.year}
                                </text>
                                <text
                                  x={tooltipWidth / 2}
                                  y="32"
                                  textAnchor="middle"
                                  fill="#38bdf8"
                                  fontSize="11.5"
                                  fontWeight="800"
                                >
                                  LKR {Number(pt.revenue).toLocaleString("en-LK", { maximumFractionDigits: 0 })}
                                </text>
                                <text
                                  x={tooltipWidth / 2}
                                  y="44"
                                  textAnchor="middle"
                                  fill="#ffffff"
                                  fontSize="9"
                                  fontWeight="600"
                                >
                                  {pt.orders} {pt.orders === 1 ? "Order" : "Orders"} Volume
                                </text>
                              </g>
                            );
                          })()}
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bottom X-Axis Month Indicators */}
            <div
              className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider select-none"
              style={{ paddingLeft: `${(PADDING_LEFT / SVG_WIDTH) * 100}%`, paddingRight: `${(PADDING_RIGHT / SVG_WIDTH) * 100}%` }}
            >
              {chartData.map((d, i) => {
                const isHovered = hoveredIdx === i;
                return (
                  <span
                    key={i}
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                    className={`transition-colors cursor-pointer text-center ${
                      isHovered
                        ? "text-blue-600 font-extrabold scale-110"
                        : d.revenue > 0
                        ? "text-slate-700"
                        : "text-slate-400"
                    }`}
                  >
                    {d.month_name}
                  </span>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-5 pt-2 text-[11px] font-bold text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                <span>Gross Revenue (LKR)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-200 inline-block" />
                <span>Order Volume</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnalyticsCard>
  );
}
