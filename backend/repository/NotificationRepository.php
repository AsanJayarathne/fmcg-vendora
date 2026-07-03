<?php
require_once __DIR__ . '/../util/Database.php';
class NotificationRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }
    public function create(int $userId, string $title, string $message): void {
        $this->db->prepare("INSERT INTO notification (user_id, title, message) VALUES (?, ?, ?)")->execute([$userId, $title, $message]);
    }
    public function getByUser(int $userId, bool $unreadOnly = false): array {
        $sql = "SELECT * FROM notification WHERE user_id = ?";
        $params = [$userId];
        if ($unreadOnly) { $sql .= " AND is_read = FALSE"; }
        $sql .= " ORDER BY created_at DESC LIMIT 50";
        $stmt = $this->db->prepare($sql); $stmt->execute($params); return $stmt->fetchAll();
    }
    public function markRead(int $notificationId, int $userId): void {
        $this->db->prepare("UPDATE notification SET is_read = TRUE WHERE notification_id = ? AND user_id = ?")->execute([$notificationId, $userId]);
    }
    public function markAllRead(int $userId): void {
        $this->db->prepare("UPDATE notification SET is_read = TRUE WHERE user_id = ?")->execute([$userId]);
    }
    public function countUnread(int $userId): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) as cnt FROM notification WHERE user_id = ? AND is_read = FALSE");
        $stmt->execute([$userId]); return (int)$stmt->fetch()['cnt'];
    }
}
