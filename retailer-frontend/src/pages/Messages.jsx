import { useContext, useState } from "react";
import { FiMessageSquare, FiX } from "react-icons/fi";
import { OrderContext } from "../context/OrderContextObject";

function formatDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function Messages() {
  const { messages } = useContext(OrderContext);
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-gray-500 mt-1">
          Order confirmations and distributor updates.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          No order messages yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <button
              key={message.id}
              type="button"
              className="w-full text-left bg-white border rounded-xl p-5 flex gap-4 cursor-pointer hover:shadow-md transition"
              onClick={() => setSelectedMessage(message)}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FiMessageSquare size={22} />
              </div>

              <div className="flex-1">
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                  <h2 className="font-bold text-slate-900">
                    {message.title}
                  </h2>

                  <span className="text-sm text-gray-500">
                    {formatDate(message.createdAt)}
                  </span>
                </div>

                <p className="text-gray-600 mt-2 truncate">
                  {message.body}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setSelectedMessage(null)}
          />

          <aside className="relative z-10 w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">
                  Message details
                </p>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedMessage.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-500 hover:text-slate-900"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">Sent</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedMessage.createdAt)}
                  </span>
                </div>

                <p className="mt-4 text-gray-700 leading-7">
                  {selectedMessage.body}
                </p>
              </div>

              <button
                type="button"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white font-semibold hover:bg-slate-800 transition"
                onClick={() => setSelectedMessage(null)}
              >
                See all messages
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Messages;
