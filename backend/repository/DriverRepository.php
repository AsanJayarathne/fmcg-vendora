<?php
require_once __DIR__ . '/../util/Database.php';
class DriverRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }
    public function findByUserId(int $userId): ?array {
        $stmt = $this->db->prepare("SELECT dr.*, u.full_name, u.email, u.phone FROM driver dr JOIN users u ON u.user_id = dr.user_id WHERE dr.user_id = ?");
        $stmt->execute([$userId]); return $stmt->fetch() ?: null;
    }
    public function findById(int $driverId): ?array {
        $stmt = $this->db->prepare("SELECT dr.*, u.full_name, u.email, u.phone FROM driver dr JOIN users u ON u.user_id = dr.user_id WHERE dr.driver_id = ?");
        $stmt->execute([$driverId]); return $stmt->fetch() ?: null;
    }
    public function getByDistributor(int $distributorId): array {
        $stmt = $this->db->prepare("SELECT dr.*, u.full_name, u.email, u.phone FROM driver dr JOIN users u ON u.user_id = dr.user_id WHERE dr.distributor_id = ? ORDER BY dr.created_at DESC");
        $stmt->execute([$distributorId]); return $stmt->fetchAll();
    }
    public function create(int $userId, array $data): int {
        $stmt = $this->db->prepare("INSERT INTO driver (user_id, distributor_id, license_number, vehicle_number) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $data['distributor_id'], $data['license_number'], $data['vehicle_number']]);
        return (int)$this->db->lastInsertId();
    }
    public function updateStatus(int $driverId, string $status): void {
        $this->db->prepare("UPDATE driver SET status = ? WHERE driver_id = ?")->execute([$status, $driverId]);
    }
}
