import { FaPen } from "react-icons/fa";
import { useRef } from "react";

export default function ProfileTab() {
  const fileInputRef = useRef(null);
  const avatarRef    = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { avatarRef.current.src = ev.target.result; };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-8">

      {/* Avatar column */}
      <div className="flex flex-col items-center gap-3 shrink-0">
        <div className="relative w-32 h-32">
          <img
            ref={avatarRef}
            src="https://i.pravatar.cc/300"
            alt="profile"
            className="w-full h-full rounded-full object-cover border-2 border-gray-200"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-1 right-0 bg-blue-600 w-9 h-9 rounded-full flex items-center justify-center text-white shadow hover:bg-blue-700 transition-colors"
          >
            <FaPen size={12} />
          </button>
        </div>
        <p className="text-sm text-gray-400">Click pencil to change photo</p>
      </div>

      {/* Form column */}
      <div className="flex-1">
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
          <InputField label="Full Name"          placeholder="Your full name" />
          <InputField label="Username"           placeholder="@username" />
          <InputField label="Email Address"      placeholder="you@email.com" />
          <InputField label="Phone Number"       placeholder="+94 7X XXX XXXX" />
          <InputField label="Shop Name"          placeholder="Enter shop name" />
          <InputField label="Business Reg. No"   placeholder="REG-XXXXXXXX" />
          <InputField label="Shop Address"       placeholder="Street, area" />
          <InputField label="City"               placeholder="Nearest city" />
          <InputField label="Postal Code"        placeholder="Postal / ZIP code" />
        </div>

        <div className="flex justify-end mt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-base font-semibold hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-2">{label}</label>
      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
    </div>
  );
}