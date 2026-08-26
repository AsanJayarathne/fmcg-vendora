const NOTIF_API = "http://localhost/fmcg-vendora/backend/api/notifications.php";

export async function fetchNotifications(token, unreadOnly = false) {
  if (!token) return { notifications: [], unread_count: 0 };
  const url = unreadOnly ? `${NOTIF_API}?unread` : NOTIF_API;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch notifications");
  }
  return data.data;
}

export async function markNotificationRead(token, id) {
  if (!token) return;
  const res = await fetch(`${NOTIF_API}?id=${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to mark notification as read");
  }
  return data;
}

export async function markAllNotificationsRead(token) {
  if (!token) return;
  const res = await fetch(NOTIF_API, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to mark all notifications as read");
  }
  return data;
}
