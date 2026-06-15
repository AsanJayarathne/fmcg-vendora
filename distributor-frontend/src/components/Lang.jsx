import { Globe } from "lucide-react";

export default function Lang() {
  return (
    <button
      type="button"
      className="flex items-center gap-2 px-5 h-[40px] text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition"
    >
      <Globe size={18} className="text-blue-600" />

      <span className="font-bold">ENG</span>
    </button>
  );
}
