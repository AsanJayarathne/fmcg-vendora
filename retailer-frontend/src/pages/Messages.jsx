import { useContext, useState } from "react";
import { FiMessageSquare, FiX, FiClock, FiCheck } from "react-icons/fi";
import { OrderContext } from "../context/OrderContextObject";
import { useLanguage } from "../context/LanguageContext";

function formatDate(date, language) {
  if (!date) return "";
  return new Intl.DateTimeFormat(language === "si" ? "si-LK" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date.replace(" ", "T")));
}

function localizeMessage(message, t) {
  const title = String(message.title ?? "").trim();
  const body = message.body ?? "";
  const orderId = body.match(/order #(\S+)/i)?.[1] ?? message.orderId ?? "";
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("delivery returned")) {
    const reason = body.match(/Reason:\s*(.*)$/i)?.[1] ?? "";
    return {
      title: t("messages.notificationDeliveryReturned", title),
      body: t("messages.notificationDeliveryReturnedBody", "Your order #{id} could not be delivered. Reason: {reason}")
        .replace("{id}", orderId)
        .replace("{reason}", reason),
    };
  }

  if (normalizedTitle.includes("order approved")) {
    return {
      title: t("messages.notificationOrderApproved", title),
      body: t("messages.notificationOrderApprovedBody", "Your order #{id} has been approved.").replace("{id}", orderId),
    };
  }

  if (normalizedTitle.includes("order delivered")) {
    return {
      title: t("messages.notificationOrderDelivered", title),
      body: t("messages.notificationOrderDeliveredBody", "Your order #{id} has been delivered.").replace("{id}", orderId),
    };
  }

  return { title, body };
}

function Messages() {
  const { messages, unreadMessageCount, markMessageRead, markAllMessagesRead } = useContext(OrderContext);
  const { language, t } = useLanguage();
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <div className="space-y-6 relative font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2.5">
            <FiMessageSquare className="text-blue-600" />
            <span>{t("messages.title", "Messages & Alerts")}</span>
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            {t("messages.subtitle", "Order updates, delivery tracking alerts, and system notices.")}
          </p>
        </div>

        {unreadMessageCount > 0 && (
          <button
            type="button"
            onClick={markAllMessagesRead}
            className="self-start sm:self-auto px-4 py-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <FiCheck size={14} />
            <span>{t("messages.markAllRead", "Mark all as read")}</span>
          </button>
        )}
      </div>

      {/* Messages List / Empty State */}
      {messages.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-10 sm:p-16 text-center text-slate-400 font-bold shadow-xs">
          <FiMessageSquare className="mx-auto text-slate-300 mb-3" size={36} />
          <p className="text-sm sm:text-base font-bold text-slate-700">
            {t("messages.noMessagesTitle", "No notifications or messages yet")}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {t("messages.noMessagesSubtitle", "You will receive updates here when you place orders.")}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message) => (
            (() => {
              const localizedMessage = localizeMessage(message, t);
              return (
            <button
              key={message.id}
              type="button"
              className={`
                w-full text-left bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 cursor-pointer
                transition-all duration-200 shadow-2xs hover:shadow-md
                ${message.read ? "border-slate-100 hover:border-blue-200" : "border-blue-200 bg-blue-50/20 hover:border-blue-300"}
              `}
              onClick={() => {
                setSelectedMessage(message);
                markMessageRead(message.id ?? message.orderId);
              }}
            >
              {/* Icon / Status */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 relative mt-0.5">
                <FiMessageSquare size={18} />
                {!message.read && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white animate-pulse" />
                )}
              </div>

              {/* Message Content Preview */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                  <h2 className="font-extrabold text-slate-800 text-xs sm:text-sm truncate pr-2">
                    {localizedMessage.title}
                  </h2>

                  <span className="text-[10px] font-black text-blue-500 flex items-center gap-1 shrink-0">
                    <FiClock size={11} /> {formatDate(message.createdAt, language)}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {localizedMessage.body}
                </p>
              </div>
            </button>
              );
            })()
          ))}
        </div>
      )}

      {/* Selected Message Detail Drawer / Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
            onClick={() => setSelectedMessage(null)}
          />

          {/* Details Panel Drawer */}
          <aside className="relative z-10 w-full max-w-lg h-full bg-white shadow-2xl border-l border-slate-100 overflow-y-auto flex flex-col justify-between animate-slideInRight">
            {/* Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-wider">
                  {t("messages.messageDetails", "Message Details")}
                </p>
                <h2 className="text-base sm:text-lg font-black text-slate-800 leading-tight mt-1">
                  {localizeMessage(selectedMessage, t).title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-2 rounded-xl hover:bg-slate-100 transition"
                aria-label={t("common.closeDetails", "Close details")}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-6 flex-1 flex flex-col justify-between">
              <div className="rounded-2xl sm:rounded-3xl bg-blue-50/20 border border-blue-100/50 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between gap-4 text-[10px] font-black text-blue-600 uppercase tracking-wider pb-3 border-b border-blue-100/40">
                  <span>{t("messages.sentDate", "Sent Date")}</span>
                  <span className="flex items-center gap-1 font-bold normal-case text-slate-600">
                    <FiClock size={11} className="text-blue-500" /> {formatDate(selectedMessage.createdAt, language)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                  {localizeMessage(selectedMessage, t).body}
                </p>
              </div>

              <button
                type="button"
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 text-xs font-bold text-white transition cursor-pointer shadow-md shadow-blue-500/20"
                onClick={() => setSelectedMessage(null)}
              >
                {t("messages.returnToInbox", "Return to Inbox")}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Messages;
