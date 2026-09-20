import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

function FormInput({
  label,
  placeholder,
  type = "text",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col">
      <label className="text-gray-500 text-base mb-1.5 font-medium">
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          type={inputType}
          placeholder={placeholder}
          className={`bg-[#EEF2F6]
          rounded-2xl
          px-5
          py-3.5
          w-full
          text-base
          font-semibold
          outline-none
          focus:ring-2
          focus:ring-blue-500 transition ${isPassword ? "pr-12" : ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer p-1 transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
export default FormInput;