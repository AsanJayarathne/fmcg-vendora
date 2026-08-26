<?php
require_once __DIR__ . '/../util/Database.php';

class TokenRepository {
    private PDO $db;

    public function __construct() { 
        $this->db = Database::getConnection(); 
    }

    public function save(int $userId, string $token, string $roleName): void {
        $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
        $this->db->prepare("INSERT INTO auth_tokens (user_id, token, role_name, expires_at) VALUES (?, ?, ?, ?)")
                 ->execute([$userId, $token, $roleName, $expiresAt]);
    }

    public function findValid(string $token): ?array {
        $stmt = $this->db->prepare("SELECT * FROM auth_tokens WHERE token = ? AND expires_at > NOW() LIMIT 1");
        $stmt->execute([$token]);
        return $stmt->fetch() ?: null;
    }

    public function deleteByToken(string $token): void {
        $this->db->prepare("DELETE FROM auth_tokens WHERE token = ?")->execute([$token]);
    }

    public function deleteAllForUser(int $userId): void {
        $this->db->prepare("DELETE FROM auth_tokens WHERE user_id = ?")->execute([$userId]);
    }

    public function deleteExpiredForUser(int $userId): void {
        $this->db->prepare("DELETE FROM auth_tokens WHERE user_id = ? AND expires_at <= NOW()")->execute([$userId]);
    }
}
