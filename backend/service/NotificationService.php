<?php
require_once __DIR__ . '/../repository/NotificationRepository.php';
class NotificationService {
    private NotificationRepository $notifRepo;
    public function __construct() { $this->notifRepo = new NotificationRepository(); }
    public function send(int $userId, string $title, string $message): void { $this->notifRepo->create($userId, $title, $message); }
    public function getForUser(int $userId, bool $unreadOnly = false): array { return $this->notifRepo->getByUser($userId, $unreadOnly); }
    public function markRead(int $notificationId, int $userId): void { $this->notifRepo->markRead($notificationId, $userId); }
    public function markAllRead(int $userId): void { $this->notifRepo->markAllRead($userId); }
    public function countUnread(int $userId): int { return $this->notifRepo->countUnread($userId); }
}
