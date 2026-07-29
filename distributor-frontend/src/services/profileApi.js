const API_BASE = "http://localhost/fmcg-vendora/backend/api";

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * GET /api/distributor/profile.php
 * Returns: { full_name, email, phone, company_name, company_address, region_name, status }
 */
export async function fetchProfile(token) {
  const res = await fetch(`${API_BASE}/distributor/profile.php`, {
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to load profile");
  return json.data;
}

/**
 * PUT /api/distributor/profile.php
 * Body: { full_name, phone, company_name, company_address }
 */
export async function updateProfile(token, data) {
  const res = await fetch(`${API_BASE}/distributor/profile.php`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to update profile");
  return json;
}

/**
 * PUT /api/distributor/profile.php?action=change_password
 * Body: { old_password, new_password }
 */
export async function changePassword(token, oldPassword, newPassword) {
  const res = await fetch(`${API_BASE}/distributor/profile.php?action=change_password`, {
    method: "PUT",
    headers: { ...authHeaders(token), "Content-Type": "application/json" },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to change password");
  return json;
}
