import { useMemo, useState } from "react";
import { FiChevronDown, FiHelpCircle, FiMail, FiSearch, FiShield, FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "../components/Landing/Navbar";
import Footer from "../components/Landing/Footer";

const categories = ["All questions", "Ordering", "Delivery", "Payments", "Returns & support"];

const questions = [
  {
    category: "Ordering",
    question: "What can I order through Vendora?",
    answer:
      "Vendora brings everyday FMCG products into one place, including groceries, beverages, personal care items, cleaning supplies and other household essentials. Browse products from trusted distributors and build one basket for your store.",
  },
  {
    category: "Ordering",
    question: "How do I place an order?",
    answer:
      "Create or sign in to your retailer account, browse the marketplace, add products to your cart and choose a distributor. Review quantities, delivery details and payment terms before confirming your order.",
  },
  {
    category: "Ordering",
    question: "Can I order from more than one distributor?",
    answer:
      "Yes. You can shop across the marketplace and manage products from different distributors in your purchasing workflow. Delivery timing and charges may vary by distributor and order.",
  },
  {
    category: "Delivery",
    question: "Where does Vendora deliver?",
    answer:
      "Vendora connects retailers and distributors across Sri Lanka. Availability, delivery timing and route coverage depend on the distributor and the address registered for your shop.",
  },
  {
    category: "Delivery",
    question: "How can I track my delivery?",
    answer:
      "Open My Orders from your retailer dashboard to see the latest status. Updates can include order confirmation, packing, dispatch and delivery progress. Keep your phone reachable so the delivery team can contact you when needed.",
  },
  {
    category: "Delivery",
    question: "What happens if my order is delayed?",
    answer:
      "Delivery updates are shown against your order as the distributor processes it. If the delivery window has passed, contact support with your order number and we will help you get an update from the relevant distributor.",
  },
  {
    category: "Payments",
    question: "What payment options are available?",
    answer:
      "Payment options are shown at checkout and may include secure card payments and approved credit terms. The options available can vary based on your retailer account, distributor and order.",
  },
  {
    category: "Payments",
    question: "How does retailer credit work?",
    answer:
      "Eligible retailers can place orders using approved distributor credit. Your dashboard helps you review outstanding balances, payment history and credit usage. Credit limits and due dates are set by the relevant distributor.",
  },
  {
    category: "Returns & support",
    question: "Can I cancel or change an order?",
    answer:
      "Contact support as soon as possible with your order number. Changes or cancellations depend on whether the distributor has started preparing or dispatching the order, so they may not always be possible.",
  },
  {
    category: "Returns & support",
    question: "What if I receive a damaged, missing or incorrect item?",
    answer:
      "Report the issue promptly through support with your order number, the product details and clear photos where possible. The team will review the request with the distributor and guide you through the available replacement, return or refund process.",
  },
  {
    category: "Returns & support",
    question: "How do I contact Vendora support?",
    answer:
      "Email support@vendora.lk or use the contact details in the footer. Include your retailer account or order number so the support team can find the right details quickly.",
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("All questions");
  const [openQuestion, setOpenQuestion] = useState(questions[0].question);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuestions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return questions.filter((item) => {
      const matchesCategory = activeCategory === "All questions" || item.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        `${item.question} ${item.answer}`.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-slate-950 px-8 py-20 text-white lg:py-28">
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
          <div className="absolute -bottom-44 left-1/3 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl animate-fadeInUp">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-blue-200">
                <FiHelpCircle /> Retailer help centre
              </div>
              <h1 className="mt-7 text-5xl font-bold leading-tight md:text-7xl">
                Answers for your next order.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                Find clear guidance on ordering, distributor deliveries, flexible credit and keeping your shop stocked with confidence.
              </p>
              <label className="mt-10 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/15 bg-white px-5 py-4 text-slate-400 shadow-2xl shadow-black/20">
                <FiSearch className="shrink-0 text-blue-600" size={21} />
                <span className="sr-only">Search frequently asked questions</span>
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search questions, delivery, credit..."
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-8 py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[240px_1fr] lg:gap-20">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Browse by topic</p>
              <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap rounded-xl px-4 py-3 text-left text-sm font-semibold transition lg:block lg:w-full ${
                      activeCategory === category
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-600 hover:bg-white hover:text-blue-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </aside>

            <div>
              <div className="mb-8 flex items-end justify-between gap-6">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{filteredQuestions.length} answers</p>
                  <h2 className="mt-2 text-3xl font-bold md:text-4xl">Frequently asked questions</h2>
                </div>
                <FiShield className="hidden text-emerald-500 md:block" size={36} />
              </div>

              <div className="space-y-3">
                {filteredQuestions.length > 0 ? (
                  filteredQuestions.map((item) => {
                    const isOpen = openQuestion === item.question;

                    return (
                      <div key={item.question} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200">
                        <button
                          type="button"
                          onClick={() => setOpenQuestion(isOpen ? "" : item.question)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-semibold text-slate-900 md:px-8 md:py-6"
                        >
                          <span>{item.question}</span>
                          <FiChevronDown className={`shrink-0 text-blue-600 transition ${isOpen ? "rotate-180" : ""}`} size={21} />
                        </button>
                        {isOpen && <p className="border-t border-slate-100 px-6 pb-6 pt-4 leading-7 text-slate-600 md:px-8">{item.answer}</p>}
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <p className="font-semibold text-slate-900">No matching questions found.</p>
                    <button type="button" onClick={() => setSearchTerm("")} className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">Clear search</button>
                  </div>
                )}
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-blue-600 p-7 text-white">
                  <FiTruck size={28} />
                  <h3 className="mt-5 text-xl font-bold">Need an order update?</h3>
                  <p className="mt-2 text-sm leading-6 text-blue-100">Keep your order number ready and our team will help you follow up.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-7">
                  <FiMail className="text-emerald-500" size={28} />
                  <h3 className="mt-5 text-xl font-bold">Still have a question?</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Reach our support team at support@vendora.lk.</p>
                </div>
              </div>

              <Link to="/landing" className="mt-10 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700">Back to Vendora home</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
