import React, { useState } from "react";
import Pagination from "../Pagination";
import { Search, RotateCcw, Building2, Eye, X, Check, Ban, FileText, User, MapPin } from "lucide-react";

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const StatusBadge = ({ status }) => {
  const isApproved = status === "Approved";
  const isPending  = status === "Pending";
  const isRejected = status === "Rejected";

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isApproved
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
          : isPending
          ? "bg-amber-50 text-amber-700 border border-amber-200/50"
          : isRejected
          ? "bg-rose-50 text-rose-700 border border-rose-200/50"
          : "bg-slate-100 text-slate-600 border border-slate-200"
      }`}
    >
      {status}
    </span>
  );
};

/* Review Application Modal */
const ReviewModal = ({ distributor: d, updating, onClose, onStatusUpdate }) => {
  if (!d) return null;

  const isPending  = d.status === "Pending";
  const isApproved = d.status === "Approved";
  const code       = `DST-${String(d.distributor_id).padStart(3, "0")}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto no-scrollbar border border-slate-100 transform transition-all scale-100 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Building2 size={22} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-blue-600">Application Review</span>
              <h2 className="text-xl font-black text-slate-800 leading-tight mt-0.5">Distributor Details</h2>
              <p className="text-sm font-bold text-slate-600 mt-1">
                {d.company_name} <span className="font-bold text-blue-600 ml-1">({code})</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-5">
          {/* Owner Info */}
          <div className="bg-slate-50/70 rounded-2xl p-4.5 space-y-3 border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} className="text-blue-600" /> Owner Information
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{d.full_name || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{d.email || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{d.phone || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applied Date</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{formatDate(d.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-slate-50/70 rounded-2xl p-4.5 space-y-3 border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin size={14} className="text-blue-600" /> Company & Region
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company Name</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{d.company_name || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Region</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{d.region_name || "—"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{d.company_address || "—"}</p>
              </div>
            </div>
          </div>

          {/* Business Documents */}
          <div className="bg-slate-50/70 rounded-2xl p-4.5 space-y-3 border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} className="text-blue-600" /> Business Registration
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Reg. No.</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{d.reg_number || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">License No.</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">{d.lic_number || "—"}</p>
              </div>
            </div>

            {d.doc_url && (
              <div className="pt-2 border-t border-slate-200/60">
                <a
                  href={d.doc_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  <FileText size={14} /> View Submitted Registration Document
                </a>
              </div>
            )}
          </div>

          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Current Account Status</span>
            <StatusBadge status={d.status} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-end pt-2">
            {isPending && (
              <>
                <button
                  onClick={() => {
                    onStatusUpdate(d.distributor_id, "Approved");
                    onClose();
                  }}
                  disabled={updating === d.distributor_id}
                  className="px-6 py-3 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={15} /> Approve Application
                </button>

                <button
                  onClick={() => {
                    onStatusUpdate(d.distributor_id, "Rejected");
                    onClose();
                  }}
                  disabled={updating === d.distributor_id}
                  className="px-6 py-3 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <X size={15} /> Reject Application
                </button>
              </>
            )}

            {isApproved && (
              <button
                onClick={() => {
                  onStatusUpdate(d.distributor_id, "Blocked");
                  onClose();
                }}
                disabled={updating === d.distributor_id}
                className="px-6 py-3 rounded-full text-xs font-bold text-white bg-slate-700 hover:bg-slate-800 transition shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Ban size={15} /> Block Account
              </button>
            )}

            {(d.status === "Blocked" || d.status === "Rejected") && (
              <button
                onClick={() => {
                  onStatusUpdate(d.distributor_id, "Approved");
                  onClose();
                }}
                disabled={updating === d.distributor_id}
                className="px-6 py-3 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Check size={15} /> Reactivate Account
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DistributorTable({ distributors = [], loading, updating, onStatusUpdate }) {
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 8;

  const filtered = React.useMemo(() => {
    return distributors.filter((d) => {
      const code = `DST-${String(d.distributor_id).padStart(3, "0")}`;
      const matchSearch =
        !search ||
        d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        d.email?.toLowerCase().includes(search.toLowerCase()) ||
        code.toLowerCase().includes(search.toLowerCase());

      const matchStatus = filterStatus === "All" || d.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [distributors, search, filterStatus]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated  = filtered.slice(startIndex, startIndex + itemsPerPage);

  const filterTabs = ["All", "Pending", "Approved", "Rejected", "Blocked"];

  return (
    <div className="space-y-4 font-sans">
      {/* Pill Navigation & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full md:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilterStatus(tab);
                setCurrentPage(1);
              }}
              className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
                filterStatus === tab
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 w-full md:w-auto md:max-w-xs">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, company, ID..."
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-5 py-3 text-xs font-semibold outline-none bg-white text-slate-700 placeholder-slate-400 transition duration-300 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* Distributors Table Container */}
      <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Distributor</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Company Details</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="6" className="px-6 py-4">
                      <div className="h-6 bg-slate-100 rounded-full w-full" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                    <p className="text-4xl mb-2">🏢</p>
                    <p className="font-bold text-slate-800 text-sm">No distributor accounts found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search criteria or filter status.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((d) => {
                  const code = `DST-${String(d.distributor_id).padStart(3, "0")}`;
                  return (
                    <tr key={d.distributor_id} className="hover:bg-slate-50/60 transition duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                            {getInitials(d.full_name)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight">{d.full_name}</p>
                            <p className="text-[11px] font-bold text-blue-600 mt-0.5">{code}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700 text-xs">{d.email}</p>
                        <p className="text-slate-400 font-semibold text-xs mt-0.5">{d.phone || "—"}</p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 text-xs">{d.company_name}</p>
                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Reg: {d.reg_number}</p>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-600 text-xs">
                        {d.region_name}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={d.status} />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setSelectedDistributor(d)}
                            className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <Eye size={13} />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            label="distributors"
          />
        )}
      </div>

      {/* Review Modal */}
      {selectedDistributor && (
        <ReviewModal
          distributor={selectedDistributor}
          updating={updating}
          onClose={() => setSelectedDistributor(null)}
          onStatusUpdate={(id, status) => {
            onStatusUpdate(id, status);
            setSelectedDistributor((prev) => (prev && prev.distributor_id === id ? { ...prev, status } : prev));
          }}
        />
      )}
    </div>
  );
}
