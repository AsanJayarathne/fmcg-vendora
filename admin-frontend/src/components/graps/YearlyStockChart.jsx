import React from "react";
import { TrendingUp } from "lucide-react";

const YearlyStockChart = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">Yearly Stock Growth</h2>
            <p className="text-[10px] font-semibold text-slate-400">Inventory valuation over time</p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
          +24.5% YoY
        </span>
      </div>

      {/* Line Chart Area */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-5 relative h-[220px] flex items-center justify-center">
        {/* Y Axis Labels */}
        <div className="absolute left-4 top-5 bottom-8 flex flex-col justify-between text-[10px] font-bold text-slate-400">
          <span>$40k</span>
          <span>$30k</span>
          <span>$20k</span>
          <span>$10k</span>
          <span>$0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-14 right-5 top-6 bottom-10 flex flex-col justify-between">
          <div className="w-full border-b border-dashed border-slate-200" />
          <div className="w-full border-b border-dashed border-slate-200" />
          <div className="w-full border-b border-dashed border-slate-200" />
          <div className="w-full border-b border-dashed border-slate-200" />
          <div className="w-full border-b border-slate-200" />
        </div>

        {/* SVG Curve */}
        <svg
          className="absolute left-14 right-5 top-6 bottom-10 h-[calc(100%-64px)] w-[calc(100%-76px)] overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Gradient Fill under path */}
          <path
            d="M0,100 L50,40 L100,70 L150,0 L200,50 L250,20 L250,120 L0,120 Z"
            fill="url(#blueGradient)"
            transform="scale(1, 0.85) translate(0, 8)"
          />

          {/* Stroke Line */}
          <path
            d="M0,100 L50,40 L100,70 L150,0 L200,50 L250,20"
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            transform="scale(1, 0.85) translate(0, 8)"
          />

          {/* Data Circles */}
          <g transform="scale(1, 0.85) translate(0, 8)">
            {[
              { cx: 0, cy: 100 },
              { cx: 50, cy: 40 },
              { cx: 100, cy: 70 },
              { cx: 150, cy: 0 },
              { cx: 200, cy: 50 },
              { cx: 250, cy: 20 },
            ].map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r="5"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                  className="transition-transform duration-200 hover:scale-150 cursor-pointer"
                />
              </g>
            ))}
          </g>
        </svg>

        {/* X Axis Labels */}
        <div className="absolute left-14 right-5 bottom-3 flex justify-between text-[10px] font-bold text-slate-400">
          <span>2020</span>
          <span>2021</span>
          <span>2022</span>
          <span>2023</span>
          <span>2024</span>
          <span>2025</span>
        </div>
      </div>
    </div>
  );
};

export default YearlyStockChart;
