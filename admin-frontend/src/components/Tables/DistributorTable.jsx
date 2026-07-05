import React, { useState } from 'react';

/* ─── Helpers ─────────────────────────────────────────────── */
function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const STATUS_STYLES = {
  Pending:  { dot: 'bg-amber-400',  text: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  label: 'Pending'  },
  Approved: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', label: 'Approved' },
  Rejected: { dot: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50 border-red-200',    label: 'Rejected' },
  Blocked:  { dot: 'bg-slate-400',  text: 'text-slate-600',  bg: 'bg-slate-100 border-slate-200', label: 'Blocked'  },
};

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-violet-100 text-violet-600',
  'bg-emerald-100 text-emerald-600',
  'bg-amber-100 text-amber-600',
  'bg-rose-100 text-rose-600',
  'bg-cyan-100 text-cyan-600',
];

/* ─── Status Badge ────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

/* ─── Review Modal ────────────────────────────────────────── */
const ReviewModal = ({ distributor: d, updating, onClose, onStatusUpdate }) => {
  if (!d) return null;

  const isPending  = d.status === 'Pending';
  const isApproved = d.status === 'Approved';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Distributor Application</h2>
            <p className="text-xs text-slate-400 mt-0.5">ID #{d.distributor_id}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Owner Info */}
          <Section title="Owner Information">
            <Field label="Full Name"   value={d.full_name} />
            <Field label="Email"       value={d.email} />
            <Field label="Phone"       value={d.phone || '—'} />
          </Section>

          {/* Company Info */}
          <Section title="Company Details">
            <Field label="Company Name"    value={d.company_name} />
            <Field label="Company Address" value={d.company_address} />
            <Field label="Region"          value={d.region_name} />
            <Field label="Applied On"      value={formatDate(d.created_at)} />
          </Section>

          {/* Registration */}
          <Section title="Registration Documents">
            <Field label="Business Reg. No."  value={d.reg_number} />
            <Field label="License No."         value={d.lic_number} />
            {d.doc_url ? (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Document</p>
                <a
                  href={d.doc_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium underline underline-offset-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  View Document
                </a>
              </div>
            ) : (
              <Field label="Document" value="Not submitted" />
            )}
          </Section>

          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <span className="text-sm font-semibold text-slate-600">Current Status</span>
            <StatusBadge status={d.status} />
          </div>
        </div>

        {/* Actions Footer */}
        <div className="px-6 pb-6 flex flex-wrap gap-3 justify-end">
          {isPending && (
            <>
              <ActionButton
                label="Approve Application"
                icon="check"
                color="emerald"
                disabled={updating === d.distributor_id}
                loading={updating === d.distributor_id}
                onClick={() => { onStatusUpdate(d.distributor_id, 'Approved'); onClose(); }}
              />
              <ActionButton
                label="Reject Application"
                icon="x"
                color="red"
                disabled={updating === d.distributor_id}
                loading={updating === d.distributor_id}
                onClick={() => { onStatusUpdate(d.distributor_id, 'Rejected'); onClose(); }}
              />
            </>
          )}
          {isApproved && (
            <ActionButton
              label="Block Account"
              icon="ban"
              color="slate"
              disabled={updating === d.distributor_id}
              loading={updating === d.distributor_id}
              onClick={() => { onStatusUpdate(d.distributor_id, 'Blocked'); onClose(); }}
            />
          )}
          {(d.status === 'Blocked' || d.status === 'Rejected') && (
            <ActionButton
              label="Reactivate Account"
              icon="check"
              color="blue"
              disabled={updating === d.distributor_id}
              loading={updating === d.distributor_id}
              onClick={() => { onStatusUpdate(d.distributor_id, 'Approved'); onClose(); }}
            />
          )}
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{title}</h3>
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="col-span-1">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-sm font-medium text-slate-800 break-words">{value || '—'}</p>
  </div>
);

const BTN_COLORS = {
  emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  red:     'bg-red-600 hover:bg-red-700 text-white',
  slate:   'bg-slate-700 hover:bg-slate-800 text-white',
  blue:    'bg-blue-600 hover:bg-blue-700 text-white',
};

const ActionButton = ({ label, color, loading, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${BTN_COLORS[color]}`}
  >
    {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
    {label}
  </button>
);

/* ─── Skeleton Row ────────────────────────────────────────── */
const SkeletonRow = () => (
  <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.2fr_1.2fr_1fr] px-6 py-4 bg-white border border-slate-200 rounded-xl items-center animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-slate-200 rounded-full" />
      <div className="flex flex-col gap-1"><div className="h-3 w-28 bg-slate-200 rounded" /><div className="h-2 w-20 bg-slate-100 rounded" /></div>
    </div>
    <div className="h-3 w-24 bg-slate-200 rounded" />
    <div className="h-3 w-20 bg-slate-200 rounded" />
    <div className="h-3 w-24 bg-slate-200 rounded" />
    <div className="h-5 w-20 bg-slate-200 rounded-full" />
    <div className="h-8 w-24 bg-slate-200 rounded-lg mx-auto" />
  </div>
);

/* ─── Main Table ──────────────────────────────────────────── */
const PAGE_SIZE = 8;

const DistributorTable = ({ distributors = [], loading, updating, onStatusUpdate }) => {
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [page, setPage] = useState(1);

  const filtered = distributors.filter(d => {
    const matchSearch =
      !search ||
      d.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (val) => { setFilterStatus(val); setPage(1); };
  const handleSearch = (val)  => { setSearch(val); setPage(1); };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name, company or email..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Pending', 'Approved', 'Rejected', 'Blocked'].map(s => (
            <button
              key={s}
              onClick={() => handleFilterChange(s)}
              className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors border ${
                filterStatus === s
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1.2fr_1.2fr_1fr] px-6 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div>Distributor</div>
          <div>Contact</div>
          <div>Company</div>
          <div>Region</div>
          <div>Status</div>
          <div className="text-center">Action</div>
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-200 rounded-xl text-slate-400">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            <p className="mt-3 text-sm font-medium">No distributors found</p>
          </div>
        ) : (
          paginated.map((d, index) => {
            const avatarColor = AVATAR_COLORS[d.distributor_id % AVATAR_COLORS.length];
            return (
              <div
                key={d.distributor_id}
                className="grid grid-cols-[2fr_1.5fr_1.5fr_1.2fr_1.2fr_1fr] px-6 py-3.5 bg-white border border-slate-200 rounded-xl items-center hover:shadow-sm hover:border-blue-200 transition-all"
              >
                {/* Distributor */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColor}`}>
                    {getInitials(d.full_name)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-900 text-sm truncate">{d.full_name}</span>
                    <span className="text-xs text-slate-400 font-medium mt-0.5 truncate">{d.email}</span>
                  </div>
                </div>

                {/* Contact */}
                <div className="text-sm text-slate-600 font-medium">{d.phone || '—'}</div>

                {/* Company */}
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-slate-800 text-sm truncate">{d.company_name}</span>
                  <span className="text-xs text-slate-400 mt-0.5">Reg: {d.reg_number}</span>
                </div>

                {/* Region */}
                <div className="text-sm font-medium text-slate-600">{d.region_name}</div>

                {/* Status */}
                <div><StatusBadge status={d.status} /></div>

                {/* Action */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setSelectedDistributor(d)}
                    className="px-3 py-1.5 border border-blue-200 text-blue-600 rounded-lg font-bold text-xs hover:bg-blue-50 hover:border-blue-400 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 mt-4 bg-white border border-slate-200 rounded-xl">
          <p className="text-xs font-semibold text-slate-500">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
          </p>
          <div className="flex items-center gap-1.5">
            <PagBtn onClick={() => setPage(1)}       disabled={page === 1}          icon="first" />
            <PagBtn onClick={() => setPage(p => p - 1)} disabled={page === 1}       icon="prev" />
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => Math.abs(p - page) <= 2)
              .map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                    p === page ? 'bg-blue-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            <PagBtn onClick={() => setPage(p => p + 1)} disabled={page === totalPages} icon="next" />
            <PagBtn onClick={() => setPage(totalPages)} disabled={page === totalPages} icon="last" />
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedDistributor && (
        <ReviewModal
          distributor={selectedDistributor}
          updating={updating}
          onClose={() => setSelectedDistributor(null)}
          onStatusUpdate={(id, status) => {
            onStatusUpdate(id, status);
            setSelectedDistributor(prev => prev && prev.distributor_id === id ? { ...prev, status } : prev);
          }}
        />
      )}
    </>
  );
};

const PagBtn = ({ onClick, disabled, icon }) => {
  const paths = {
    first: 'M11 17l-5-5 5-5M18 17l-5-5 5-5',
    prev:  'M15 18l-6-6 6-6',
    next:  'M9 18l6-6-6-6',
    last:  'M13 17l5-5-5-5M6 17l5-5-5-5',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[icon]} />
      </svg>
    </button>
  );
};

export default DistributorTable;
