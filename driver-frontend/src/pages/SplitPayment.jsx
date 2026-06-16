import { useState } from 'react';

function SplitPayment() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);

  const creditAmount = totalAmount - cashAmount;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Split Payment Calculator</h1>
      <p>Calculate cash and credit amounts for delivery</p>

      <div style={{ border: "1px solid gray", padding: "20px", borderRadius: "8px", maxWidth: "400px" }}>
        
        <div style={{ marginBottom: "15px" }}>
          <label>Total Invoice Amount (Rs.)</label>
          <br />
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid gray" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Cash Received (Rs.)</label>
          <br />
          <input
            type="number"
            value={cashAmount}
            onChange={(e) => setCashAmount(Number(e.target.value))}
            style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "4px", border: "1px solid gray" }}
          />
        </div>

        <div style={{ backgroundColor: "#f0f0f0", padding: "15px", borderRadius: "8px" }}>
          <p>💵 Cash: <strong>Rs. {cashAmount}</strong></p>
          <p>💳 Credit: <strong>Rs. {creditAmount < 0 ? 0 : creditAmount}</strong></p>
          <p>📦 Total: <strong>Rs. {totalAmount}</strong></p>
        </div>

        <button
          style={{ marginTop: "15px", backgroundColor: "green", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", width: "100%" }}>
          Confirm Payment
        </button>

      </div>
    </div>
  );
}

export default SplitPayment;