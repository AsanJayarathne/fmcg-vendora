import {
  FiUsers,
  FiShoppingBag,
  FiTrendingUp,
  FiTruck,
} from "react-icons/fi";

export default function Stats() {
  const stats = [
    {
      icon: <FiUsers size={28} />,
      value: "18,500+",
      title: "Retailers",
      description: "Growing businesses using Vendora every day.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FiShoppingBag size={28} />,
      value: "350,000+",
      title: "Orders Processed",
      description: "Successfully fulfilled across Sri Lanka.",
      color: "bg-orange-100 text-orange-500",
    },
    {
      icon: <FiTrendingUp size={28} />,
      value: "Rs. 2.4B+",
      title: "Transactions",
      description: "Secure purchases through the platform.",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: <FiTruck size={28} />,
      value: "120+",
      title: "Distributors",
      description: "Trusted FMCG suppliers connected.",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <section className="bg-white py-24">

      <div className="max-w-7xl mx-auto px-8">

        {/* Trust Banner */}
        <div className="bg-blue-600 rounded-3xl p-10 text-center shadow-xl mb-20">

          <p className="uppercase tracking-widest text-blue-100 text-sm font-semibold">
            Trusted Across Sri Lanka
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4">
            Helping Retailers Grow Faster
          </h2>

          <p className="text-blue-100 text-lg mt-5 max-w-3xl mx-auto">
            Vendora connects retailers with distributors, providing
            smarter ordering, inventory management, flexible credit,
            and real-time analytics—all from one platform.
          </p>

        </div>

        {/* Section Heading */}
        <div className="text-center mb-14">

          <h2 className="text-4xl font-bold text-slate-900">
            Platform at a Glance
          </h2>

          <p className="text-slate-500 mt-4 text-lg">
            Everything you need to manage your retail business efficiently.
          </p>

        </div>

        {/* Stats Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-3xl p-8 border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
              >
                {item.icon}
              </div>

              <h3 className="text-4xl font-bold text-slate-900 mt-6">
                {item.value}
              </h3>

              <h4 className="text-xl font-semibold mt-2 text-slate-800">
                {item.title}
              </h4>

              <p className="text-slate-500 mt-3 leading-7">
                {item.description}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}