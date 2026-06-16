import { useState } from 'react';

function DeliveryJobPool() {
  const [jobs, setJobs] = useState([
    { id: 1, route: "Colombo - Nugegoda", items: 5, status: "Available" },
    { id: 2, route: "Kandy - Peradeniya", items: 3, status: "Available" },
    { id: 3, route: "Galle - Matara", items: 7, status: "Available" },
  ]);

  const claimRoute = (id) => {
    setJobs(jobs.map((job) =>
      job.id === id ? { ...job, status: "Claimed" } : job
    ));
  };

  const updateStatus = (id, newStatus) => {
    setJobs(jobs.map((job) =>
      job.id === id ? { ...job, status: newStatus } : job
    ));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Delivery Job Pool</h1>
      <p>Available delivery routes - claim yours!</p>

      {jobs.map((job) => (
        <div key={job.id} style={{ border: "1px solid gray", padding: "15px", marginBottom: "10px", borderRadius: "8px" }}>
          <h3>Route: {job.route}</h3>
          <p>Items: {job.items}</p>
          <p>Status: <strong>{job.status}</strong></p>

          {job.status === "Available" && (
            <button
              onClick={() => claimRoute(job.id)}
              style={{ backgroundColor: "green", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Claim Route
            </button>
          )}

          {job.status === "Claimed" && (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => updateStatus(job.id, "Delivered")}
                style={{ backgroundColor: "blue", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Delivered
              </button>
              <button
                onClick={() => updateStatus(job.id, "Returned")}
                style={{ backgroundColor: "red", color: "white", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                  Returned
              </button>
            </div>
          )}

          {(job.status === "Delivered" || job.status === "Returned") && (
            <p style={{ color: job.status === "Delivered" ? "blue" : "red" }}>
              {job.status === "Delivered" ? "✅ Delivery Completed" : "❌ Order Returned"}
            </p>
          )}

        </div>
      ))}
    </div>
  );
}

export default DeliveryJobPool;
