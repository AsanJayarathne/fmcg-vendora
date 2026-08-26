<?php
require_once __DIR__ . '/../util/Database.php';

class UserRepository {
    private PDO $db;

    public function __construct() { 
        $this->db = Database::getConnection(); 
    }

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
        $isActive = isset($data['is_active']) ? ($data['is_active'] ? 1 : 0) : 1;
        $isEmailVerified = isset($data['is_email_verified']) ? ($data['is_email_verified'] ? 1 : 0) : 0;
        $stmt = $this->db->prepare("INSERT INTO users (full_name, email, phone, password, role_id, is_active, is_email_verified) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$data['full_name'], $data['email'], $data['phone'], password_hash($data['password'], PASSWORD_BCRYPT), $data['role_id'], $isActive, $isEmailVerified]);
        return (int)$this->db->lastInsertId();
    }

    public function setActive(int $userId, bool $active): void {
        $this->db->prepare("UPDATE users SET is_active = ? WHERE user_id = ?")->execute([$active ? 1 : 0, $userId]);
    }

    public function setEmailVerified(int $userId): void {
        $this->db->prepare("UPDATE users SET is_email_verified = 1 WHERE user_id = ?")->execute([$userId]);
    }

    public function setEmailVerifiedByEmail(string $email): void {
        $this->db->prepare("UPDATE users SET is_email_verified = 1 WHERE email = ?")->execute([$email]);
    }

    public function updateProfile(int $userId, string $fullName, string $phone): void {
        $this->db->prepare("UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?")->execute([$fullName, $phone, $userId]);
    }

    public function updatePassword(int $userId, string $passwordHash): void {
        $this->db->prepare("UPDATE users SET password = ? WHERE user_id = ?")->execute([$passwordHash, $userId]);
    }
}
