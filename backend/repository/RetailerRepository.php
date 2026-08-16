<?php
require_once __DIR__ . '/../util/Database.php';
class RetailerRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }
    public function findByUserId(int $userId): ?array {
        $stmt = $this->db->prepare("SELECT r.*, u.full_name, u.email, u.phone, dr.region_name FROM retailer r JOIN users u ON u.user_id = r.user_id JOIN distributor_region dr ON dr.region_id = r.region_id WHERE r.user_id = ?");
        $stmt->execute([$userId]); return $stmt->fetch() ?: null;
    }
    public function findById(int $retailerId): ?array {
        $stmt = $this->db->prepare("SELECT r.*, u.full_name, u.email, u.phone, dr.region_name FROM retailer r JOIN users u ON u.user_id = r.user_id JOIN distributor_region dr ON dr.region_id = r.region_id WHERE r.retailer_id = ?");
        $stmt->execute([$retailerId]); return $stmt->fetch() ?: null;
    }
    public function getByRegion(int $regionId, string $status = '', int $distributorId = 0): array {
        if ($distributorId > 0) {
            $sql = "SELECT r.*, u.full_name, u.email, u.phone,
                           CASE WHEN ca.status = 'Blocked' THEN 'Blocked' ELSE r.status END AS status
                    FROM retailer r 
                    JOIN users u ON u.user_id = r.user_id 
                    LEFT JOIN credit_account ca ON ca.retailer_id = r.retailer_id AND ca.distributor_id = ?
                    WHERE r.region_id = ?";
            $params = [$distributorId, $regionId];
            if ($status) {
                $sql .= " AND (CASE WHEN ca.status = 'Blocked' THEN 'Blocked' ELSE r.status END) = ?";
                $params[] = $status;
            }
            $sql .= " ORDER BY r.created_at DESC";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        $sql = "SELECT r.*, u.full_name, u.email, u.phone FROM retailer r JOIN users u ON u.user_id = r.user_id WHERE r.region_id = ?";
        $params = [$regionId];
        if ($status) { $sql .= " AND r.status = ?"; $params[] = $status; }
        $sql .= " ORDER BY r.created_at DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function create(int $userId, array $data): int {
        $stmt = $this->db->prepare("INSERT INTO retailer (user_id, region_id, shop_name, owner_name, shop_address, city, latitude, longitude, nic_number, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$userId, $data['region_id'], $data['shop_name'], $data['owner_name'], $data['shop_address'], $data['city'] ?? null, $data['latitude'] ?? null, $data['longitude'] ?? null, $data['nic_number'], $data['phone'] ?? null]);
        return (int)$this->db->lastInsertId();
    }
    public function updateStatus(int $retailerId, string $status): void {
        $this->db->prepare("UPDATE retailer SET status = ? WHERE retailer_id = ?")->execute([$status, $retailerId]);
    }
    public function getDistributorForRetailer(int $retailerId): ?array {
        $stmt = $this->db->prepare("SELECT d.* FROM retailer r JOIN distributor d ON d.region_id = r.region_id AND d.status = 'Approved' WHERE r.retailer_id = ? LIMIT 1");
        $stmt->execute([$retailerId]); return $stmt->fetch() ?: null;
    }
}
