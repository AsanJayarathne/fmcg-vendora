<?php
require_once __DIR__ . '/../util/Database.php';
class DeliveryRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }

    public function findById(int $deliveryId): ?array {
        $stmt = $this->db->prepare("SELECT dl.*, o.retailer_id, o.distributor_id, o.total_amount AS order_amount, o.payment_method, o.credit_amount, o.cash_amount, o.outstanding_credit, r.shop_name, r.shop_address, r.owner_name, r.phone AS shop_phone, r.latitude, r.longitude FROM delivery dl JOIN orders o ON o.order_id = dl.order_id JOIN retailer r ON r.retailer_id = o.retailer_id WHERE dl.delivery_id = ?");
        $stmt->execute([$deliveryId]); return $stmt->fetch() ?: null;
    }
    public function getOpenPool(int $distributorId): array {
        $stmt = $this->db->prepare("SELECT dl.*, r.shop_name, r.shop_address, r.city, o.total_amount AS order_amount, o.payment_method, o.credit_amount, o.cash_amount, o.outstanding_credit, COALESCE((SELECT SUM(quantity) FROM order_items WHERE order_id = dl.order_id), 0) AS total_items FROM delivery dl JOIN orders o ON o.order_id = dl.order_id JOIN retailer r ON r.retailer_id = o.retailer_id WHERE dl.status = 'OPEN' AND o.distributor_id = ? ORDER BY dl.created_at ASC");
        $stmt->execute([$distributorId]); return $stmt->fetchAll();
    }
    public function getByDriver(int $driverId): array {
        $stmt = $this->db->prepare("SELECT dl.*, r.shop_name, r.shop_address, r.city, r.latitude, r.longitude, o.total_amount AS order_amount, o.payment_method, o.credit_amount, o.cash_amount, o.outstanding_credit, COALESCE((SELECT SUM(quantity) FROM order_items WHERE order_id = dl.order_id), 0) AS total_items FROM delivery dl JOIN orders o ON o.order_id = dl.order_id JOIN retailer r ON r.retailer_id = o.retailer_id WHERE dl.driver_id = ? ORDER BY dl.created_at DESC");
        $stmt->execute([$driverId]); return $stmt->fetchAll();
    }
    public function getByRetailer(int $retailerId): array {
        $stmt = $this->db->prepare("SELECT dl.*, o.status AS order_status FROM delivery dl JOIN orders o ON o.order_id = dl.order_id WHERE o.retailer_id = ? ORDER BY dl.created_at DESC");
        $stmt->execute([$retailerId]); return $stmt->fetchAll();
    }
    public function getByDistributor(int $distributorId): array {
        $stmt = $this->db->prepare("SELECT dl.*, u.full_name AS driver_name, r.shop_name, o.total_amount AS order_amount FROM delivery dl JOIN orders o ON o.order_id = dl.order_id JOIN retailer r ON r.retailer_id = o.retailer_id LEFT JOIN driver dr ON dr.driver_id = dl.driver_id LEFT JOIN users u ON u.user_id = dr.user_id WHERE o.distributor_id = ? ORDER BY dl.created_at DESC");
        $stmt->execute([$distributorId]); return $stmt->fetchAll();
    }
    public function create(int $orderId, float $totalAmount): int {
        $stmt = $this->db->prepare("INSERT INTO delivery (order_id, total_amount, status) VALUES (?, ?, 'OPEN')");
        $stmt->execute([$orderId, $totalAmount]); return (int)$this->db->lastInsertId();
    }
    public function findForUpdate(int $deliveryId): ?array {
        $stmt = $this->db->prepare("SELECT * FROM delivery WHERE delivery_id = ? FOR UPDATE");
        $stmt->execute([$deliveryId]); return $stmt->fetch() ?: null;
    }
    public function claim(int $deliveryId, int $driverId): void {
        $this->db->prepare("UPDATE delivery SET driver_id = ?, status = 'CLAIMED', claimed_at = NOW() WHERE delivery_id = ?")->execute([$driverId, $deliveryId]);
    }
    public function markDelivered(int $deliveryId, float $collectedAmount, string $remarks = ''): void {
        $this->db->prepare("UPDATE delivery SET status = 'DELIVERED', delivery_date = NOW(), collected_amount = ?, remarks = ? WHERE delivery_id = ?")->execute([$collectedAmount, $remarks, $deliveryId]);
    }
    public function markReturned(int $deliveryId, string $remarks): void {
        $this->db->prepare("UPDATE delivery SET status = 'RETURNED', delivery_date = NOW(), remarks = ? WHERE delivery_id = ?")->execute([$remarks, $deliveryId]);
    }
}
