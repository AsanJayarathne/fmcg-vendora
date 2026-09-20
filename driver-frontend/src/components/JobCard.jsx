import { MapPin, Package, CheckCircle2, ArrowRight } from 'lucide-react';

function JobCard({ job, onClaim, claiming = false }) {
  const storeInitial = job?.store ? job.store[0]?.toUpperCase() : 'S';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-orange-200/80 transition-all duration-200 flex flex-col justify-between gap-3.5 sm:gap-4 h-full">
      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100 tracking-wide">
            {job.orderId}
          </span>
          {job.items && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md flex items-center gap-1">
              <Package size={12} className="text-slate-400" />
              {job.items}
            </span>
          )}
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shadow-xs shrink-0">
            {storeInitial}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm sm:text-base font-bold text-slate-800 leading-tight truncate">{job.store}</h4>
            <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-slate-400 shrink-0" />
              <span className="truncate">{job.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm sm:text-base font-extrabold text-slate-800">{job.amount}</div>
          <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium">{job.paymentMethod}</div>
        </div>

        {job.status === 'Available' ? (
          <button
            onClick={onClaim}
            disabled={claiming}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white shadow-xs shadow-orange-500/20 disabled:bg-orange-300 transition-all cursor-pointer"
          >
            <span>{claiming ? 'Taking...' : 'Take Order'}</span>
            {!claiming && <ArrowRight size={14} />}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 size={13} />
            Claimed
          </span>
        )}
      </div>
    </div>
  );
}

export default JobCard;