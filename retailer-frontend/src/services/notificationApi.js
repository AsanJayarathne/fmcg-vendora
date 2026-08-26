import { apiFetch } from "../utils/api";

export async function fetchNotifications(token, unreadOnly = false) {
  if (!token) return { notifications: [], unread_count: 0 };
  const path = unreadOnly ? "/notifications.php?unread" : "/notifications.php";
  const res = await apiFetch(path, token);
  return res.data;
}

export async function markNotificationRead(token, id) {
  if (!token) return;
  return await apiFetch(`/notifications.php?id=${id}`, token, {
    method: "PUT",
  });
}

export async function markAllNotificationsRead(token) {
  if (!token) return;
  return await apiFetch("/notifications.php", token, {
    method: "PUT",
  });
}
