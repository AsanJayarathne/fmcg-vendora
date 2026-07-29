import { Globe } from "lucide-react";

export default function Lang() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-5 h-[40px] text-slate-700 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-800 transition cursor-pointer text-xs font-black"
    >
      <Globe size={14} className="text-slate-600" />

      <span>ENG</span>
    </button>
  );
}
