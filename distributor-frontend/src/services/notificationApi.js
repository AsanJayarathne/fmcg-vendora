const API_BASE = "http://localhost/fmcg-vendora/backend/api";

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchNotifications(token, unreadOnly = false) {
  if (!token) return { notifications: [], unread_count: 0 };
  const url = unreadOnly
    ? `${API_BASE}/notifications.php?unread`
    : `${API_BASE}/notifications.php`;
  const res = await fetch(url, {
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to fetch notifications");
  }
  return json.data;
}

export async function markNotificationRead(token, id) {
  if (!token) return;
  const res = await fetch(`${API_BASE}/notifications.php?id=${id}`, {
    method: "PUT",
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to mark notification read");
  }
  return json;
}

export async function markAllNotificationsRead(token) {
  if (!token) return;
  const res = await fetch(`${API_BASE}/notifications.php`, {
    method: "PUT",
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to mark all notifications read");
  }
  return json;
}
