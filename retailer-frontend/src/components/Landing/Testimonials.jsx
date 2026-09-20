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
    <section id="testimonials" className="py-12 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-3xl mx-auto">
          <span className="text-blue-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            Testimonials
          </span>

          <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            Loved by Retailers Across Sri Lanka
          </h2>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 leading-relaxed">
            Thousands of retailers rely on Vendora every day to manage
            inventory, orders, and credit with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-10 sm:mt-16">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-2xl sm:rounded-[30px] p-6 sm:p-8 border border-slate-200 hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} fill="currentColor" size={16} />
                  ))}
                </div>

                <p className="mt-5 text-slate-600 text-xs sm:text-sm leading-relaxed">
                  "{item.review}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-slate-200/60">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm sm:text-base shrink-0">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {item.name}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500">
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