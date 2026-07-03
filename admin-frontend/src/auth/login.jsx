import logo from '../assets/vendora logo.png';

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Vendora company logo displayed on login page" className="h-16 object-contain" />
          </div>
          <p className="mt-4 text-gray-500">
            Sign in to continue
          </p>
        </div>

        {/* Form */}

        <form className="space-y-6">

          <div>

            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div className="text-right">

            <a
              href="#"
              className="text-sm font-medium text-blue-500 hover:underline"
            >
              Forgot Password?
            </a>

          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}