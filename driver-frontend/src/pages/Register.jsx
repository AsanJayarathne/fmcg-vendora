import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import deliveryImg from "../assets/delivery.png";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    distributorId: "",
    licenseNumber: "",
    vehicleNumber: "",
  });

  const [distributors, setDistributors] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost/fmcg-vendora/backend/api/auth/distributors.php")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDistributors(json.data || []);
        }
      })
      .catch((err) => console.error("Failed to load distributors:", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async () => {
    const { fullName, email, phone, password, distributorId, licenseNumber, vehicleNumber } = form;

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password || !distributorId || !licenseNumber.trim() || !vehicleNumber.trim()) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        distributor_id: parseInt(distributorId, 10),
        license_number: licenseNumber.trim(),
        vehicle_number: vehicleNumber.trim(),
      };

      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/register-driver.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess("Registration submitted successfully! Awaiting distributor approval.");
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (err) {
      setError("Network error — make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>

        {/* ── LEFT SIDE – Image ── */}
        <div style={styles.leftPanel}>
          <img src={deliveryImg} alt="Delivery person" style={styles.image} />
        </div>

        {/* ── RIGHT SIDE – Form ── */}
        <div style={styles.rightPanel}>
          <h1 style={styles.title}>Personal Information</h1>

          {error && <div style={styles.errorBanner}>{error}</div>}
          {success && <div style={styles.successBanner}>{success}</div>}

          <div style={styles.formGrid}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>E-mail</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Vehicle No.</label>
              <input
                type="text"
                name="vehicleNumber"
                value={form.vehicleNumber}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Distributor</label>
              <select
                name="distributorId"
                value={form.distributorId}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Distributor</option>
                {distributors.map((d) => (
                  <option key={d.distributor_id} value={d.distributor_id}>
                    {d.company_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            style={loading ? { ...styles.registerBtn, opacity: 0.6, cursor: "not-allowed" } : styles.registerBtn}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p style={styles.loginText}>
            Already Have an Account?{" "}
            <span onClick={() => navigate("/login")} style={styles.loginLink}>Login</span>
          </p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#F97316",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    overflow: "hidden",
    width: "100%",
    maxWidth: "960px",
    minHeight: "520px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
  },
  leftPanel: {
    width: "45%",
    borderRadius: "20px",
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "#F97316",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  rightPanel: {
    flex: 1,
    padding: "24px 44px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#111111",
    margin: "0 0 16px 0",
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    border: "1px solid #FCA5A5",
    color: "#B91C1C",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "12px",
  },
  successBanner: {
    backgroundColor: "#D1FAE5",
    border: "1px solid #6EE7B7",
    color: "#065F46",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "12px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px 20px",
    marginBottom: "12px",
  },
  fieldGroup: {
    marginBottom: "0",
  },
  label: {
    display: "block",
    fontSize: "14px",
    color: "#666",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    border: "none",
    borderBottom: "1.5px solid #333",
    outline: "none",
    fontSize: "15px",
    padding: "6px 0",
    color: "#111",
    backgroundColor: "transparent",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    border: "none",
    borderBottom: "1.5px solid #333",
    outline: "none",
    fontSize: "15px",
    padding: "6px 0",
    color: "#111",
    backgroundColor: "transparent",
    boxSizing: "border-box",
    cursor: "pointer",
  },
  registerBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#F97316",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "12px",
  },
  loginText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
    marginTop: "16px",
    margin: "16px 0 0 0",
  },
  loginLink: {
    color: "#F97316",
    fontWeight: "600",
    cursor: "pointer",
  },
};
