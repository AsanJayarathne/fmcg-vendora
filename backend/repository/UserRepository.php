<?php
require_once __DIR__ . '/../util/Database.php';
class UserRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }
    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare("SELECT u.*, r.role_name FROM users u JOIN roles r ON r.role_id = u.role_id WHERE u.email = ? LIMIT 1");
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }
    public function findById(int $userId): ?array {
        $stmt = $this->db->prepare("SELECT u.*, r.role_name FROM users u JOIN roles r ON r.role_id = u.role_id WHERE u.user_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetch() ?: null;
    }
    public function create(array $data): int {
        $stmt = $this->db->prepare("INSERT INTO users (full_name, email, phone, password, role_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['full_name'], $data['email'], $data['phone'], password_hash($data['password'], PASSWORD_BCRYPT), $data['role_id']]);
        return (int)$this->db->lastInsertId();
    }
    public function setActive(int $userId, bool $active): void {
        $this->db->prepare("UPDATE users SET is_active = ? WHERE user_id = ?")->execute([$active ? 1 : 0, $userId]);
    }
}
