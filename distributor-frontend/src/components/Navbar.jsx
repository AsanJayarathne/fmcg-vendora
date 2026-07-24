import Lang from "./Lang";
import { Bell } from "lucide-react";
import logo from "../assets/vendora logo.png";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between h-20 px-6 bg-gray-100 border-b border-gray-200">

      <div className="flex items-center">
        <img src={logo} alt="Vendora Logo" className="h-13 w-auto object-contain" />
      </div>

      <div className="flex items-center gap-4">

        <Lang />

        <button
          type="button"
          className="flex items-center gap-3 px-5 h-[40px] text-sm font-semibold text-white bg-[#030617] rounded-[18px] hover:bg-gray-800 transition"
        >
          <span>Messages</span>

          <Bell
            size={18}
            className="text-white"
          />
        </button>

        <button className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 cursor-pointer transition">
          A
        </button>

      </div>

    </header>
  );
}