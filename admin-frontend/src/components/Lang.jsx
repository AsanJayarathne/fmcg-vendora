import React from "react";
import { Globe } from "lucide-react";

export default function Lang() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-4 h-9 text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 transition cursor-pointer text-xs font-bold shadow-2xs"
    >
      <Globe size={14} className="text-slate-500" />
      <span>ENG</span>
    </button>
  );
}
