import React from "react";

export default function AnalyticsCard({ title, subtitle, children, action, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xs flex flex-col justify-between h-full font-sans transition duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-slate-800 text-base leading-tight flex items-center gap-2">
            {Icon && <Icon className="text-blue-600 size-5 shrink-0" />}
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="flex-1 flex flex-col justify-between">{children}</div>
    </div>
  );
}
