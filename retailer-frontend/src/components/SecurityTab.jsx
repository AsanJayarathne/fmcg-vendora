export default function SecurityTab() {
    return (
        <div className="p-12 max-w-4xl">

            <h2 className="text-3xl font-semibold mb-10">
                Change Password
            </h2>

            <div className="space-y-8">

                <div>
                    <label className="block text-xl mb-3">
                        Current Password
                    </label>

                    <input
                        type="password"
                        className="
            w-full
            h-16
            border
            rounded-3xl
            px-6
            "
                    />
                </div>

                <div>
                    <label className="block text-xl mb-3">
                        New Password
                    </label>

                    <input
                        type="password"
                        className="
            w-full
            h-16
            border
            rounded-3xl
            px-6
            "
                    />
                </div>

                <div>
                    <label className="block text-xl mb-3">
                        Confirm Password
                    </label>

                    <input
                        type="password"
                        className="
            w-full
            h-16
            border
            rounded-3xl
            px-6
            "
                    />
                </div>

                <button
                    className="
          bg-blue-700
          text-white
          px-10
          py-4
          rounded-2xl
          text-xl
          hover:bg-blue-800
          "
                >
                    Update Password
                </button>

            </div>
        </div>
    );
}