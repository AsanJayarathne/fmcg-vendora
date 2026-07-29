<?php
require_once __DIR__ . '/../util/Database.php';
class OrderRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }

    public function findById(int $orderId): ?array {
        $stmt = $this->db->prepare("SELECT o.*, r.shop_name, r.owner_name, d.company_name AS distributor_name, dl.status AS delivery_status FROM orders o JOIN retailer r ON r.retailer_id = o.retailer_id JOIN distributor d ON d.distributor_id = o.distributor_id LEFT JOIN delivery dl ON dl.order_id = o.order_id WHERE o.order_id = ?");
        $stmt->execute([$orderId]); return $stmt->fetch() ?: null;
    }
    public function getItemsByOrder(int $orderId): array {
        $stmt = $this->db->prepare("SELECT oi.*, p.product_name, p.unit FROM order_items oi JOIN product p ON p.product_id = oi.product_id WHERE oi.order_id = ?");
        $stmt->execute([$orderId]); return $stmt->fetchAll();
    }
    public function getByRetailer(int $retailerId): array {
        $stmt = $this->db->prepare("SELECT o.*, d.company_name AS distributor_name, dl.status AS delivery_status FROM orders o JOIN distributor d ON d.distributor_id = o.distributor_id LEFT JOIN delivery dl ON dl.order_id = o.order_id WHERE o.retailer_id = ? ORDER BY o.created_at DESC");
        $stmt->execute([$retailerId]); return $stmt->fetchAll();
    }
    public function getByDistributor(int $distributorId, string $status = ''): array {
        $sql = "SELECT o.*, r.shop_name, r.owner_name, r.shop_address FROM orders o JOIN retailer r ON r.retailer_id = o.retailer_id WHERE o.distributor_id = ?";
        $params = [$distributorId];
        if ($status) { $sql .= " AND o.status = ?"; $params[] = $status; }
        $sql .= " ORDER BY o.created_at DESC";
        $stmt = $this->db->prepare($sql); $stmt->execute($params); return $stmt->fetchAll();
    }
    public function create(array $data): int {
        $stmt = $this->db->prepare("INSERT INTO orders (retailer_id, distributor_id, total_amount, payment_method, credit_amount, cash_amount, outstanding_credit) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$data['retailer_id'], $data['distributor_id'], $data['total_amount'], $data['payment_method'] ?? 'Cash', $data['credit_amount'] ?? 0, $data['cash_amount'] ?? 0, $data['outstanding_credit'] ?? 0]);
        return (int)$this->db->lastInsertId();
    }
    public function createItems(int $orderId, array $items): void {
        $stmt = $this->db->prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)");
        foreach ($items as $item) {
            $totalPrice = isset($item['total_price']) ? $item['total_price'] : ($item['quantity'] * $item['unit_price']);
            $stmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['unit_price'], $totalPrice]);
        }
    }
    public function deleteItems(int $orderId): void {
        $this->db->prepare("DELETE FROM order_items WHERE order_id = ?")->execute([$orderId]);
    }
    public function updateTotal(int $orderId, float $total): void {
        $this->db->prepare("UPDATE orders SET total_amount = ? WHERE order_id = ?")->execute([$total, $orderId]);
    }
    public function updateStatus(int $orderId, string $status): void {
        $this->db->prepare("UPDATE orders SET status = ? WHERE order_id = ?")->execute([$status, $orderId]);
    }
    public function delete(int $orderId): void {
        $this->db->prepare("DELETE FROM orders WHERE order_id = ?")->execute([$orderId]);
    }
}
