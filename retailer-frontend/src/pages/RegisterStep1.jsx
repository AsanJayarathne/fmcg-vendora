import { useNavigate } from "react-router-dom";
import LeftPanel from "../components/RegisterPage/LeftPanel";
import FormInput from "../components/RegisterPage/FormInput";
import logo from "../assets/images/logo.png";

export default function RegisterStep1() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex gap-16 h-[110vh]">
        <LeftPanel />

        <div className="flex-1 flex flex-col justify-between">
          <img src={logo} alt="Vendora" className="w-64 h-auto mx-auto" />

          <p className="text-center text-3xl text-gray-400 mt-6">1 / 2</p>

          <h1 className="text-center text-6xl font-bold mt-4">
            Personal Information
          </h1>

          <div className="grid grid-cols-2 gap-10 mt-14">
            <FormInput label="First Name" placeholder="John" />

            <FormInput label="Last Name" placeholder="Carter" />

            <FormInput label="Shop Name" placeholder="Jayarathna Stores" />

            <FormInput label="NIC Number" placeholder="2002 76 23 555 555" />

            <FormInput label="Email Address" placeholder="john@gmail.com" />

            <FormInput label="Phone Number" placeholder="+94 76 1234567" />

            <FormInput
              label="Password"
              placeholder="********"
              type="password"
            />

            <FormInput
              label="Confirm Password"
              placeholder="********"
              type="password"
            />
          </div>

        <div className="flex justify-center mt-10 mb-6">
        <button
          type="button"
          onClick={() => navigate("/register-step2")}
          className="
            w-[480px]
            h-16
            rounded-full
            bg-blue-700
            text-white
            text-2xl
            font-semibold
            hover:bg-blue-800
            transition
          "
        >
          Continue
        </button>
      </div>
        </div>
      </div>
    </div>
  );
}