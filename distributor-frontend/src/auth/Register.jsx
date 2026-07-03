import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, AlertCircle, CheckCircle2, Package,
  User, Mail, Phone, Lock, Building2, MapPin, FileText, IdCard, Globe
} from 'lucide-react';

const API_BASE = 'http://localhost/fmcg-vendora/backend/api';

const INITIAL_FORM = {
  // Account info
  full_name: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: '',
  // Company info
  company_name: '',
  company_address: '',
  reg_number: '',
  lic_number: '',
  region_id: '',
  doc_url: '',
};

function FieldIcon({ icon: Icon }) {
  return <Icon className="w-4 h-4 text-white/30 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />;
}

function Field({ label, id, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-indigo-200">
        {label}
      </label>
      <div className="relative">
        {icon && <FieldIcon icon={icon} />}
        {children}
      </div>
    </div>
  );
}

const inputClass = (hasIcon = true) =>
  `w-full ${hasIcon ? 'pl-11 pr-4' : 'px-4'} py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm`;

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = account, 2 = company
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  // ─── Step 1 validation ────────────────────────────────────────────────────
  function validateStep1() {
    const { full_name, email, phone, password, confirm_password } = form;
    if (!full_name.trim()) return 'Full name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'A valid email is required.';
    if (!phone.trim()) return 'Phone number is required.';
    if (!password || password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirm_password) return 'Passwords do not match.';
    return null;
  }

  function goToStep2(e) {
    e.preventDefault();
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  }

  // ─── Step 2 submission ────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const { company_name, company_address, reg_number, lic_number, region_id } = form;
    if (!company_name.trim()) { setError('Company name is required.'); return; }
    if (!company_address.trim()) { setError('Company address is required.'); return; }
    if (!reg_number.trim()) { setError('Registration number is required.'); return; }
    if (!lic_number.trim()) { setError('Licence number is required.'); return; }
    if (!region_id) { setError('Region ID is required.'); return; }

    setLoading(true);
    setError('');
    try {
      const payload = {
        full_name:       form.full_name.trim(),
        email:           form.email.trim(),
        phone:           form.phone.trim(),
        password:        form.password,
        company_name:    form.company_name.trim(),
        company_address: form.company_address.trim(),
        reg_number:      form.reg_number.trim(),
        lic_number:      form.lic_number.trim(),
        region_id:       parseInt(form.region_id, 10),
        doc_url:         form.doc_url.trim() || null,
      };

      const res = await fetch(`${API_BASE}/auth/register-distributor.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message || 'Registration failed. Please try again.');
        return;
      }
      setSuccess('Registration submitted successfully! Your account is awaiting admin approval. You will be notified by email.');
      setTimeout(() => navigate('/login'), 5000);
    } catch {
      setError('Network error — make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden py-12 px-4">

      {/* Blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-96 h-96 bg-indigo-600 opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-80px] w-80 h-80 bg-violet-700 opacity-20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg">

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl px-10 py-10">

          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg mb-3">
              <Package className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Create Distributor Account</h1>
            <p className="text-indigo-300 text-sm mt-1">Join the Vendora network</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300
                    ${step >= s
                      ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-900/50'
                      : 'bg-white/10 text-white/40'}`}
                >
                  {s}
                </div>
                <span className={`text-xs font-medium ${step >= s ? 'text-indigo-300' : 'text-white/30'}`}>
                  {s === 1 ? 'Account' : 'Company'}
                </span>
                {s < 2 && <div className={`w-8 h-px ${step > s ? 'bg-indigo-500' : 'bg-white/15'} transition-colors`} />}
              </div>
            ))}
          </div>

          {/* Success banner */}
          {success && (
            <div className="flex items-start gap-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm rounded-xl px-4 py-4 mb-6">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">Application Submitted!</p>
                <p className="text-emerald-400/80">{success}</p>
                <p className="text-emerald-500/60 text-xs mt-2">Redirecting to login in 5 seconds…</p>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!success && (
            <>
              {/* ── Step 1: Account info ── */}
              {step === 1 && (
                <form onSubmit={goToStep2} className="space-y-4" noValidate>

                  <Field label="Full Name" id="reg-full-name" icon={User}>
                    <input
                      id="reg-full-name"
                      name="full_name"
                      type="text"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="John Silva"
                      className={inputClass()}
                    />
                  </Field>

                  <Field label="Email Address" id="reg-email" icon={Mail}>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass()}
                    />
                  </Field>

                  <Field label="Phone Number" id="reg-phone" icon={Phone}>
                    <input
                      id="reg-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+94 77 123 4567"
                      className={inputClass()}
                    />
                  </Field>

                  <Field label="Password" id="reg-password" icon={Lock}>
                    <input
                      id="reg-password"
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </Field>

                  <Field label="Confirm Password" id="reg-confirm" icon={Lock}>
                    <input
                      id="reg-confirm"
                      name="confirm_password"
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirm_password}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </Field>

                  <button
                    id="reg-next"
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-900/50 transition-all duration-200"
                  >
                    Next: Company Details →
                  </button>
                </form>
              )}

              {/* ── Step 2: Company info ── */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                  <Field label="Company Name" id="reg-company-name" icon={Building2}>
                    <input
                      id="reg-company-name"
                      name="company_name"
                      type="text"
                      value={form.company_name}
                      onChange={handleChange}
                      placeholder="Golden Supplies (Pvt) Ltd"
                      className={inputClass()}
                    />
                  </Field>

                  <Field label="Company Address" id="reg-company-address" icon={MapPin}>
                    <input
                      id="reg-company-address"
                      name="company_address"
                      type="text"
                      value={form.company_address}
                      onChange={handleChange}
                      placeholder="123 Main St, Colombo"
                      className={inputClass()}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Registration No." id="reg-reg-number" icon={FileText}>
                      <input
                        id="reg-reg-number"
                        name="reg_number"
                        type="text"
                        value={form.reg_number}
                        onChange={handleChange}
                        placeholder="PV/123456"
                        className={inputClass()}
                      />
                    </Field>

                    <Field label="Licence No." id="reg-lic-number" icon={IdCard}>
                      <input
                        id="reg-lic-number"
                        name="lic_number"
                        type="text"
                        value={form.lic_number}
                        onChange={handleChange}
                        placeholder="LIC-789"
                        className={inputClass()}
                      />
                    </Field>
                  </div>

                  <Field label="Region ID" id="reg-region" icon={MapPin}>
                    <input
                      id="reg-region"
                      name="region_id"
                      type="number"
                      min="1"
                      value={form.region_id}
                      onChange={handleChange}
                      placeholder="e.g. 1"
                      className={inputClass()}
                    />
                  </Field>

                  <Field label="Document URL (optional)" id="reg-doc-url" icon={Globe}>
                    <input
                      id="reg-doc-url"
                      name="doc_url"
                      type="url"
                      value={form.doc_url}
                      onChange={handleChange}
                      placeholder="https://drive.google.com/..."
                      className={inputClass()}
                    />
                  </Field>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setError(''); }}
                      className="flex-1 py-3.5 rounded-xl bg-white/8 border border-white/15 text-white/70 hover:text-white hover:bg-white/12 font-medium text-sm transition-all duration-200"
                    >
                      ← Back
                    </button>
                    <button
                      id="reg-submit"
                      type="submit"
                      disabled={loading}
                      className="flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-900/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Login link */}
          <p className="text-center text-sm text-white/40 mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>

        </div>

        <p className="text-center text-xs text-white/20 mt-6">© 2025 Vendora. All rights reserved.</p>
      </div>
    </div>
  );
}
