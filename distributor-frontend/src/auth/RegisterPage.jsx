import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Building2,
  MapPin,
  BriefcaseBusiness,
  BadgeCheck,
  Globe,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#f4f7ff] flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-[760px] bg-white rounded-2xl shadow-xl px-8 py-8 relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex items-center justify-center w-8 h-8 font-bold text-white bg-blue-600 rounded-md">
            V
          </div>
          <h1 className="text-2xl font-bold text-blue-600">vendora</h1>
        </div>

        {/* Step */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="flex items-center justify-center text-sm font-semibold text-white bg-blue-600 rounded-full w-7 h-7">
            {step}
          </span>
          <span className="text-sm text-blue-600">/ 2</span>
        </div>

        <h2 className="text-center text-xl font-bold text-[#071b4d]">
          Customize your Business Information
        </h2>
        <p className="mt-2 mb-8 text-sm text-center text-gray-500">
          Setup your organization for members that may join later.
        </p>

        {step === 1 ? (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input icon={<User />} label="First Name" value="John" />
              <Input icon={<User />} label="Last Name" value="Karter" />
              <Input icon={<Mail />} label="Email Address" value="Johncarter@business.com" />
              <Input icon={<Phone />} label="Phone Number" value="+94 76 23 555 555" />
              <Input icon={<Lock />} label="Password" value="John@123456" password />
              <Input icon={<Lock />} label="Confirm Password" value="John@123456" password />
            </div>

            <div className="flex justify-end mt-10">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-3 px-8 py-4 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input icon={<Building2 />} label="Company Name" value="John & Sons Distributor" />
              <Input icon={<MapPin />} label="Company Address" value="Address Line 1" />
              <Input icon={<BriefcaseBusiness />} label="Business Registration Number" value="BTR/5684/454/ER" />
              <Input icon={<MapPin />} label="Address Line 2" value="Address Line 2" />
              <Input icon={<BadgeCheck />} label="License Number" value="123 567" />
              <Input icon={<Globe />} label="Region" value="Western Province" dropdown />
            </div>

            <div className="flex justify-between mt-10">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-3 px-8 py-4 font-semibold text-blue-600 transition border border-gray-200 rounded-lg hover:bg-blue-50"
              >
                <ArrowLeft size={18} /> Back
              </button>

              <button className="flex items-center gap-3 px-8 py-4 font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                Register <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}

        <p className="relative z-10 mt-8 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Login
          </Link>
        </p>

        {/* bottom light shape */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-blue-50 rounded-t-[50%] opacity-70 pointer-events-none"></div>
      </div>
    </div>
  );
}

function Input({ icon, label, value, password, dropdown }) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = password && !showPassword ? "password" : "text";

  return (
    <div className="h-[70px] border border-blue-100 rounded-xl px-4 flex items-center gap-4 bg-white">
      <div className="text-blue-600 shrink-0">{icon}</div>

      <div className="flex-1 min-w-0">
        <p className="mb-1 text-xs text-gray-500 truncate">{label}</p>
        <input
          type={inputType}
          value={value}
          readOnly
          className="w-full min-w-0 outline-none text-sm font-semibold text-[#071b4d] bg-transparent truncate"
        />
      </div>

      {password && (
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="text-gray-500 transition shrink-0 hover:text-blue-600"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}
      {dropdown && <ChevronDown size={18} className="text-[#071b4d] shrink-0" />}
    </div>
  );
}

