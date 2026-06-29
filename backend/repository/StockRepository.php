<?php
require_once __DIR__ . '/../util/Database.php';
class StockRepository {
    private PDO $db;
    private const LOW_STOCK_THRESHOLD = 50;
    public function __construct() { $this->db = Database::getConnection(); }

    public function getWarehouseAll(): array {
        $stmt = $this->db->prepare("SELECT ws.*, p.product_name, p.unit, pc.category_name FROM warehouse_stock ws JOIN product p ON p.product_id = ws.product_id JOIN product_category pc ON pc.category_id = p.category_id ORDER BY p.product_name");
        $stmt->execute(); return $stmt->fetchAll();
    }
    public function getWarehouseByProduct(int $productId): ?array {
        $stmt = $this->db->prepare("SELECT * FROM warehouse_stock WHERE product_id = ?");
        $stmt->execute([$productId]); return $stmt->fetch() ?: null;
    }
    public function deductWarehouse(int $productId, int $qty): void {
        $stmt = $this->db->prepare("UPDATE warehouse_stock SET quantity = quantity - ? WHERE product_id = ? AND quantity >= ?");
        $stmt->execute([$qty, $productId, $qty]);
        if ($stmt->rowCount() === 0) throw new Exception("Insufficient warehouse stock for product ID $productId", 422);
    }
    public function adjustWarehouse(int $productId, int $newQty): void {
        $this->db->prepare("INSERT INTO warehouse_stock (product_id, quantity) VALUES (?, ?) ON DUPLICATE KEY UPDATE quantity = ?")->execute([$productId, $newQty, $newQty]);
    }
    public function getDistributorStock(int $distributorId): array {
        $stmt = $this->db->prepare("SELECT ds.*, p.product_name, p.unit, pc.category_name FROM distributor_stock ds JOIN product p ON p.product_id = ds.product_id JOIN product_category pc ON pc.category_id = p.category_id WHERE ds.distributor_id = ? ORDER BY p.product_name");
        $stmt->execute([$distributorId]); return $stmt->fetchAll();
    }
    public function getLowStock(int $distributorId): array {
        $stmt = $this->db->prepare("SELECT ds.*, p.product_name, p.unit FROM distributor_stock ds JOIN product p ON p.product_id = ds.product_id WHERE ds.distributor_id = ? AND ds.quantity < ? ORDER BY ds.quantity ASC");
        $stmt->execute([$distributorId, self::LOW_STOCK_THRESHOLD]); return $stmt->fetchAll();
    }
    public function addDistributorStock(int $distributorId, int $productId, int $qty, float $unitCost = 0): void {
        $this->db->prepare("INSERT INTO distributor_stock (distributor_id, product_id, quantity, unit_cost) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), unit_cost = VALUES(unit_cost)")->execute([$distributorId, $productId, $qty, $unitCost]);
    }
    public function deductDistributorStock(int $distributorId, int $productId, int $qty): void {
        $stmt = $this->db->prepare("UPDATE distributor_stock SET quantity = quantity - ? WHERE distributor_id = ? AND product_id = ? AND quantity >= ?");
        $stmt->execute([$qty, $distributorId, $productId, $qty]);
        if ($stmt->rowCount() === 0) throw new Exception("Insufficient distributor stock for product ID $productId", 422);
    }
}
