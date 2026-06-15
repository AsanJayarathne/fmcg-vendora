import { FaPen } from "react-icons/fa";
import { useRef } from "react";

export default function ProfileTab() {
    const fileInputRef = useRef(null);
    const avatarRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            avatarRef.current.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="p-12 flex flex-col lg:flex-row gap-16">
            <div>
                <div className="relative w-48 h-48">
                    <img
                        ref={avatarRef}
                        src="https://i.pravatar.cc/300"
                        alt="profile"
                        className="w-full h-full rounded-full object-cover"
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
                        className="absolute bottom-3 right-0 bg-blue-700 w-12 h-12 rounded-full flex items-center justify-center text-white"
                    >
                        <FaPen />
                    </button>
                </div>
            </div>

            <div className="flex-1">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    <InputField label="Your Name"        placeholder="Your Name" />
                    <InputField label="User Name"        placeholder="User Name" />
                    <InputField label="Email"            placeholder="Email Address" />
                    <InputField label="Password"         placeholder="••••••••" />
                    <InputField label="Shop Name"        placeholder="Enter Shop Name" />
                    <InputField label="Business Reg. No" placeholder="Enter Reg. No" />
                    <InputField label="Permanent Address" placeholder="Enter Address" />
                    <InputField label="Nearest City"     placeholder="Enter Nearest City" />
                    <InputField label="Postal Code"      placeholder="Enter Postal Code" />
                </div>

                <div className="flex justify-end mt-16">
                    <button className="bg-blue-700 text-white px-16 py-4 rounded-2xl text-3xl hover:bg-blue-800">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, value, placeholder }) {
    return (
        <div>
            <label className="block text-2xl mb-3">{label}</label>
            <input
                type="text"
                defaultValue={value}
                placeholder={placeholder}
                className="
                    w-full h-16 border border-blue-100 rounded-3xl
                    px-6 text-xl text-slate-500 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                "
            />
        </div>
    );
}