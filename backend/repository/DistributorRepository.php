<?php
require_once __DIR__ . '/../util/Database.php';
class DistributorRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }
    public function findByUserId(int $userId): ?array {
        $stmt = $this->db->prepare("SELECT d.*, u.full_name, u.email, u.phone, dr.region_name FROM distributor d JOIN users u ON u.user_id = d.user_id JOIN distributor_region dr ON dr.region_id = d.region_id WHERE d.user_id = ?");
        $stmt->execute([$userId]); return $stmt->fetch() ?: null;
    }
    public function findById(int $distributorId): ?array {
        $stmt = $this->db->prepare("SELECT d.*, u.full_name, u.email, u.phone, dr.region_name FROM distributor d JOIN users u ON u.user_id = d.user_id JOIN distributor_region dr ON dr.region_id = d.region_id WHERE d.distributor_id = ?");
        $stmt->execute([$distributorId]); return $stmt->fetch() ?: null;
    }
    public function getAll(): array {
        $stmt = $this->db->prepare("SELECT d.*, u.full_name, u.email, u.phone, dr.region_name FROM distributor d JOIN users u ON u.user_id = d.user_id JOIN distributor_region dr ON dr.region_id = d.region_id ORDER BY d.created_at DESC");
        $stmt->execute(); return $stmt->fetchAll();
    }
    public function create(int $userId, array $data): int {
        $stmt = $this->db->prepare("INSERT INTO distributor (user_id, company_name, company_address, reg_number, lic_number, region_id, doc_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $data['company_name'], $data['company_address'], $data['reg_number'], $data['lic_number'], $data['region_id'], $data['doc_url'] ?? null]);
        return (int)$this->db->lastInsertId();
    }
    public function updateStatus(int $distributorId, string $status): void {
        $this->db->prepare("UPDATE distributor SET status = ? WHERE distributor_id = ?")->execute([$status, $distributorId]);
    }
}
