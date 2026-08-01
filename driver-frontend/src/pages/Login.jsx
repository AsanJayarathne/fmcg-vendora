import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import deliveryImg from "../assets/delivery.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost/fmcg-vendora/backend/api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      if (json.data.role !== 'DRIVER') {
        setError("Access denied. This portal is for Drivers only.");
        setLoading(false);
        return;
      }

      login(json.data);
      navigate("/");
    } catch (err) {
      setError("Network error — make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>

        {/* ── LEFT SIDE – Form ── */}
        <div style={styles.leftPanel}>
          <h1 style={styles.title}>Welcome Back</h1>

          {error && <div style={styles.errorBanner}>{error}</div>}

          <div style={styles.fieldGroup}>
            <label style={styles.label}>E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={styles.checkbox}
              />
              Remember me
            </label>
            <span style={styles.forgotLink}>Forgot Password?</span>
          </div>

          <button
            id="login-submit"
            onClick={handleLogin}
            disabled={loading}
            style={loading ? { ...styles.loginBtn, opacity: 0.6, cursor: "not-allowed" } : styles.loginBtn}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>

          <p style={styles.registerText}>
            Don't Have an Account?{" "}
            <span onClick={() => navigate("/register")} style={styles.registerLink}>Register</span>
          </p>
        </div>

        {/* ── RIGHT SIDE – Image ── */}
        <div style={styles.rightPanel}>
          <img src={deliveryImg} alt="Delivery person" style={styles.image} />
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
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    overflow: "hidden",
    width: "100%",
    maxWidth: "860px",
    minHeight: "520px",
    boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
  },
  leftPanel: {
    flex: 1,
    padding: "60px 52px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#111111",
    margin: "0 0 36px 0",
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    border: "1px solid #FCA5A5",
    color: "#B91C1C",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "20px",
  },
  fieldGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    color: "#444",
    marginBottom: "8px",
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
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    marginTop: "4px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#444",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#F97316",
  },
  forgotLink: {
    fontSize: "14px",
    color: "#444",
    cursor: "pointer",
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#F97316",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "20px",
  },
  registerText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
    margin: 0,
  },
  registerLink: {
    color: "#F97316",
    fontWeight: "600",
    cursor: "pointer",
  },
  rightPanel: {
    width: "45%",
    backgroundColor: "#F97316",
    borderRadius: "20px",
    margin: "16px",
    overflow: "hidden",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
};
