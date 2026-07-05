import { useNavigate } from "react-router-dom";
import LeftPanel from "../components/RegisterPage/LeftPanel";
import FormInput from "../components/RegisterPage/FormInput";
import logo from "../assets/images/logo.png";

export default function RegisterStep2() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex gap-16 h-[110vh]">
        <LeftPanel />

        <div className="flex-1 flex flex-col">
          <img src= {logo} alt="Vendora" className="w-64 mx-auto" />

          <p className="text-center text-3xl text-gray-400 mt-6">2 / 2</p>

          <h1 className="text-center text-6xl font-bold mt-4">
            Business Information
          </h1>

          <div className="grid grid-cols-2 gap-10 mt-14">
            <FormInput
              label="Shop Name"
              placeholder="Jayarathna Stores Pvt Ltd"
            />

            <FormInput
              label="Shop Address"
              placeholder="Address Line 1"
            />

            <FormInput
              label="Business Registration Number"
              placeholder="Jayarathna Stores Pvt Ltd"
            />

            <FormInput
              label="Address Line 2"
              placeholder="Address Line 2"
            />

            <FormInput
              label="Location"
              placeholder="Pick Up your Shop Location"
            />

            <FormInput
              label="City"
              placeholder="Colombo"
            />

            <FormInput
              label="Shop Phone"
              placeholder="+94 11 32 45 789"
            />

            <div className="flex flex-col">
              <label className="text-gray-500 text-lg mb-2">Region</label>
              <select
                className="bg-[#EEF2F6] rounded-3xl px-7 py-5 text-2xl font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Select Region</option>
                <option>Western</option>
                <option>Southern</option>
                <option>Central</option>
              </select>
            </div>
          </div>

          <div className="mt-20 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-[320px] h-16 rounded-full border border-blue-700 text-blue-700 text-2xl font-semibold hover:bg-blue-50"
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-[320px] h-16 rounded-full bg-blue-700 text-white text-2xl font-semibold hover:bg-blue-800"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
