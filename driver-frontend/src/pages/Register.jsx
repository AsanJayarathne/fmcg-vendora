import { useState } from "react";
import deliveryImg from "../assets/delivery.png";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    vehicleNo: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    console.log("Registering with:", form);
    // Add your register API call here
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
            <label style={styles.label}>Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Vehicle No.</label>
            <input
              type="text"
              name="vehicleNo"
              value={form.vehicleNo}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <button onClick={handleRegister} style={styles.registerBtn}>
            Register
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
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
    minHeight: "580px",
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
    padding: "60px 52px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#111111",
    margin: "0 0 32px 0",
  },
  fieldGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    color: "#666",
    marginBottom: "6px",
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
};
