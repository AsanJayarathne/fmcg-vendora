import { useContext, useState } from "react";
import { FiMessageSquare, FiX, FiClock } from "react-icons/fi";
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
    <div className="space-y-6 relative p-6 bg-slate-50/50 min-h-screen">
      <div>
        <h1 className="text-3xl font-black text-slate-805">Messages</h1>
        <p className="text-xs font-bold text-slate-400 mt-1">
          Order confirmations, system updates, and distributor dispatches.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-[32px] p-12 text-center text-slate-400 font-bold">
          No order messages yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <button
              key={message.id}
              type="button"
              className="w-full text-left bg-white border border-slate-100 rounded-[28px] p-5 flex gap-4 cursor-pointer hover:shadow-xs transition duration-300 hover:border-slate-350"
              onClick={() => setSelectedMessage(message)}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <FiMessageSquare size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                  <h2 className="font-extrabold text-slate-800 text-sm truncate pr-4">
                    {message.title}
                  </h2>

                  <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 shrink-0">
                    <FiClock size={11} /> {formatDate(message.createdAt)}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-500 mt-2 truncate">
                  {message.body}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
            onClick={() => setSelectedMessage(null)}
          />

          {/* Details Sidebar Panel */}
          <aside className="relative z-10 w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-100 overflow-y-auto flex flex-col justify-between animate-slideInRight">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <p className="text-[9px] font-black text-slate-405 uppercase tracking-wider">
                  Message Details
                </p>
                <h2 className="text-lg font-black text-slate-800 leading-tight mt-1">
                  {selectedMessage.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
              <div className="rounded-[28px] bg-slate-50/50 border border-slate-100 p-5 space-y-4">
                <div className="flex items-center justify-between gap-4 text-[10px] font-black text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
                  <span>Sent date</span>
                  <span className="flex items-center gap-1 font-bold lowercase normal-case">
                    <FiClock size={11} /> {formatDate(selectedMessage.createdAt)}
                  </span>
                </div>

                <p className="text-xs font-bold text-slate-500 leading-relaxed whitespace-pre-line">
                  {selectedMessage.body}
                </p>
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-slate-900 py-3.5 text-xs font-black text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
                onClick={() => setSelectedMessage(null)}
              >
                Return to Inbox
              </button>
            </div>

          </aside>
        </div>
      )}
    </div>
  );
}

export default Messages;
