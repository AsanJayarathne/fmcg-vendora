const API_BASE = "http://localhost/fmcg-vendora/backend/api";

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

/** GET all deliveries for the authenticated distributor */
export async function fetchDeliveries(token, status = "") {
  const url = status
    ? `${API_BASE}/distributor/deliveries.php?status=${encodeURIComponent(status)}`
    : `${API_BASE}/distributor/deliveries.php`;
  const res = await fetch(url, { headers: authHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to load deliveries");
  return json.data ?? [];
}

/** GET open-pool deliveries (OPEN status) */
export async function fetchOpenDeliveries(token) {
  const res = await fetch(`${API_BASE}/distributor/deliveries.php?type=open`, {
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to load open deliveries");
  return json.data ?? [];
}

/** GET approved drivers for the distributor */
export async function fetchApprovedDrivers(token) {
  const res = await fetch(
    `${API_BASE}/distributor/drivers.php?status=Approved`,
    { headers: authHeaders(token) }
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to load drivers");
  return json.data ?? [];
}

/** PUT assign a driver to an OPEN delivery */
export async function assignDriver(token, deliveryId, driverId) {
  const res = await fetch(
    `${API_BASE}/distributor/deliveries.php?id=${deliveryId}`,
    {
      method: "PUT",
      headers: {
        ...authHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "assign", driver_id: driverId }),
    }
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to assign driver");
  return json.data;
}
