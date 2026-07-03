<?php
require_once __DIR__ . '/../util/Database.php';
class SupplyRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }

    public function getAll(string $status = ''): array {
        $sql = "SELECT sr.*, d.company_name AS distributor_name, dr.region_name FROM supply_request sr JOIN distributor d ON d.distributor_id = sr.distributor_id JOIN distributor_region dr ON dr.region_id = d.region_id WHERE 1=1";
        $params = [];
        if ($status) { $sql .= " AND sr.status = ?"; $params[] = $status; }
        $sql .= " ORDER BY sr.created_at DESC";
        $stmt = $this->db->prepare($sql); $stmt->execute($params); return $stmt->fetchAll();
    }
    public function getByDistributor(int $distributorId): array {
        $stmt = $this->db->prepare("SELECT sr.*, COUNT(sri.request_item_id) AS item_count FROM supply_request sr LEFT JOIN supply_request_items sri ON sri.request_id = sr.request_id WHERE sr.distributor_id = ? GROUP BY sr.request_id ORDER BY sr.created_at DESC");
        $stmt->execute([$distributorId]); return $stmt->fetchAll();
    }
    public function findById(int $requestId): ?array {
        $stmt = $this->db->prepare("SELECT sr.*, d.company_name AS distributor_name FROM supply_request sr JOIN distributor d ON d.distributor_id = sr.distributor_id WHERE sr.request_id = ?");
        $stmt->execute([$requestId]); return $stmt->fetch() ?: null;
    }
    public function getItems(int $requestId): array {
        $stmt = $this->db->prepare("SELECT sri.*, p.product_name, p.unit FROM supply_request_items sri JOIN product p ON p.product_id = sri.product_id WHERE sri.request_id = ?");
        $stmt->execute([$requestId]); return $stmt->fetchAll();
    }
    public function create(int $distributorId, string $remarks = ''): int {
        $stmt = $this->db->prepare("INSERT INTO supply_request (distributor_id, request_date, remarks) VALUES (?, CURDATE(), ?)");
        $stmt->execute([$distributorId, $remarks]); return (int)$this->db->lastInsertId();
    }
    public function createItem(int $requestId, int $productId, int $qty): void {
        $this->db->prepare("INSERT INTO supply_request_items (request_id, product_id, requested_qty) VALUES (?, ?, ?)")->execute([$requestId, $productId, $qty]);
    }
    public function approveItem(int $requestItemId, int $approvedQty): void {
        $this->db->prepare("UPDATE supply_request_items SET approved_qty = ? WHERE request_item_id = ?")->execute([$approvedQty, $requestItemId]);
    }
    public function updateStatus(int $requestId, string $status, string $remarks = ''): void {
        $this->db->prepare("UPDATE supply_request SET status = ?, remarks = ? WHERE request_id = ?")->execute([$status, $remarks, $requestId]);
    }
    public function createTransfer(int $requestId, int $distributorId, int $approvedBy): int {
        $stmt = $this->db->prepare("INSERT INTO stock_transfer (request_id, distributor_id, transfer_date, status, approved_by) VALUES (?, ?, NOW(), 'Approved', ?)");
        $stmt->execute([$requestId, $distributorId, $approvedBy]); return (int)$this->db->lastInsertId();
    }
}
