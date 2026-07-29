// src/components/landing/Testimonials.jsx

import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Nimal Perera",
    role: "Owner, Perera Grocers",
    review:
      "Vendora has completely transformed the way we manage inventory and place orders. Everything is much faster now.",
  },
  {
    name: "Kasun Fernando",
    role: "Retailer, Colombo",
    review:
      "The credit management system helped us maintain cash flow while keeping our shelves stocked.",
  },
  {
    name: "Chamara Silva",
    role: "Retail Store Owner",
    review:
      "The analytics dashboard gives us valuable insights into sales and inventory trends. Highly recommended!",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center max-w-3xl mx-auto">

          <span className="text-blue-600 font-semibold uppercase tracking-wider">
            Testimonials
          </span>

          <h2 className="mt-4 text-5xl font-bold text-slate-900">
            Loved by Retailers Across Sri Lanka
          </h2>

          <p className="mt-6 text-lg text-slate-600">
            Thousands of retailers rely on Vendora every day to manage
            inventory, orders, and credit with confidence.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">

          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-[30px] p-8 border border-slate-200 hover:shadow-xl transition"
            >
              <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill="currentColor" />
                ))}
              </div>

              <p className="mt-6 text-slate-600 leading-8">
                "{item.review}"
              </p>

              <div className="flex items-center gap-4 mt-8">

                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    {item.name}
                  </h4>

                  <p className="text-sm text-slate-500">
                    {item.role}
                  </p>
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}