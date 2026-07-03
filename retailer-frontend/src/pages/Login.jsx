import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import loginImage from "../assets/images/Login.png"; 

function Login() {
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // TODO: Login API
    alert("Login Clicked");
  };

  const handleRegister = () => {
    alert("Navigate to Register");
  };

  const handleForgotPassword = () => {
    alert("Forgot Password");
  };

  return (
    <div className="min-h-screen bg-[#2446D8] flex items-center justify-center p-8">

      <div className="bg-white rounded-[45px] w-full max-w-7xl overflow-hidden flex shadow-2xl">

        {/* LEFT */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-20 py-16">

          {/* Logo */}
          <div className="flex items-center gap-4 mb-12">

            <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              
            </div>

            <h1 className="text-5xl font-bold text-blue-600">
              Vendora
            </h1>

          </div>

          <h2 className="text-5xl font-bold mb-12">
            Welcome Back
          </h2>

          <form
            onSubmit={handleLogin}
            className="space-y-8"
          >

            {/* Email */}

            <div className="bg-slate-100 rounded-2xl px-6 py-4">

              <label className="text-gray-500 text-sm">
                E-mail Address
              </label>

              <div className="flex items-center gap-3 mt-2">

                <FiMail className="text-gray-500" />

                <input
                  type="email"
                  placeholder="johncarter@business.com"
                  className="bg-transparent outline-none w-full font-semibold"
                />

              </div>

            </div>

            {/* Password */}

            <div className="bg-slate-100 rounded-2xl px-6 py-4">

              <label className="text-gray-500 text-sm">
                Password
              </label>

              <div className="flex items-center gap-3 mt-2">

                <FiLock className="text-gray-500" />

                <input
                  type="password"
                  placeholder="********"
                  className="bg-transparent outline-none w-full font-semibold"
                />

              </div>

            </div>

            {/* Remember */}

            <div className="flex justify-between items-center">

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />

                Remember Me

              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-gray-500 hover:text-blue-600"
              >
                Forgot Password?
              </button>

            </div>

            {/* Login */}

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 transition text-white py-4 rounded-full text-lg font-semibold"
            >
              Log In
            </button>

          </form>

          {/* Register */}

          <p className="text-center mt-8 text-gray-600">

            Don't Have an Account?

            <button
              onClick={handleRegister}
              className="ml-2 text-blue-700 font-semibold"
            >
              Register
            </button>

          </p>

        </div>

        {/* RIGHT */}

        <div className="hidden lg:flex w-1/2 bg-[#2446D8] items-center justify-center p-10">

          <div className="w-full h-full rounded-[35px] flex items-center justify-center">


            <img
              src={loginImage}
              alt="Login Illustration"
              className="max-h-[650px] object-contain"

            />
           

          </div>

        </div>

      </div>

    </div>
  );
}
export default Login;