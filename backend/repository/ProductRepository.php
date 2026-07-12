<?php
require_once __DIR__ . '/../util/Database.php';
class ProductRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }

    public function getAll(string $status = ''): array {
        $sql = "SELECT p.*, pc.category_name, pp.base_price, pp.mrp_max_retail_price FROM product p JOIN product_category pc ON pc.category_id = p.category_id LEFT JOIN product_pricing pp ON pp.product_id = p.product_id AND pp.effective_to IS NULL WHERE 1=1";
        $params = [];
        if ($status) { $sql .= " AND p.status = ?"; $params[] = $status; }
        $sql .= " ORDER BY p.product_name";
        $stmt = $this->db->prepare($sql); $stmt->execute($params); return $stmt->fetchAll();
    }
    public function findById(int $productId): ?array {
        $stmt = $this->db->prepare("SELECT p.*, pc.category_name, pp.base_price, pp.mrp_max_retail_price FROM product p JOIN product_category pc ON pc.category_id = p.category_id LEFT JOIN product_pricing pp ON pp.product_id = p.product_id AND pp.effective_to IS NULL WHERE p.product_id = ?");
        $stmt->execute([$productId]); return $stmt->fetch() ?: null;
    }
    public function create(array $data): int {
        $stmt = $this->db->prepare("INSERT INTO product (category_id, product_name, description, unit, image_url) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$data['category_id'], $data['product_name'], $data['description'] ?? null, $data['unit'] ?? null, $data['image_url'] ?? null]);
        return (int)$this->db->lastInsertId();
    }
    public function update(int $productId, array $data): void {
        $this->db->prepare("UPDATE product SET category_id = ?, product_name = ?, description = ?, unit = ?, image_url = ? WHERE product_id = ?")
                 ->execute([$data['category_id'], $data['product_name'], $data['description'] ?? null, $data['unit'] ?? null, $data['image_url'] ?? null, $productId]);
    }
    public function setStatus(int $productId, string $status): void {
        $this->db->prepare("UPDATE product SET status = ? WHERE product_id = ?")->execute([$status, $productId]);
    }
    public function getAllCategories(): array {
        $stmt = $this->db->prepare("SELECT * FROM product_category ORDER BY category_name");
        $stmt->execute(); return $stmt->fetchAll();
    }
    public function createCategory(array $data): int {
        $stmt = $this->db->prepare("INSERT INTO product_category (category_name, description) VALUES (?, ?)");
        $stmt->execute([$data['category_name'], $data['description'] ?? null]);
        return (int)$this->db->lastInsertId();
    }
    public function updateCategory(int $categoryId, array $data): void {
        $this->db->prepare("UPDATE product_category SET category_name = ?, description = ? WHERE category_id = ?")
                 ->execute([$data['category_name'], $data['description'] ?? null, $categoryId]);
    }
    public function deleteCategory(int $categoryId): void {
        $this->db->prepare("DELETE FROM product_category WHERE category_id = ?")->execute([$categoryId]);
    }
    public function setPrice(int $productId, float $basePrice, float $mrp): void {
        $this->db->prepare("UPDATE product_pricing SET effective_to = CURDATE() WHERE product_id = ? AND effective_to IS NULL")->execute([$productId]);
        $this->db->prepare("INSERT INTO product_pricing (product_id, base_price, mrp_max_retail_price, effective_from) VALUES (?, ?, ?, CURDATE())")->execute([$productId, $basePrice, $mrp]);
    }
    public function getCatalogForDistributor(int $distributorId, int $categoryId = 0): array {
        $sql = "SELECT p.*, pc.category_name, ds.quantity AS available_qty, COALESCE(dp.price, pp.base_price) AS unit_price FROM product p JOIN product_category pc ON pc.category_id = p.category_id JOIN distributor_stock ds ON ds.product_id = p.product_id AND ds.distributor_id = ? LEFT JOIN product_pricing pp ON pp.product_id = p.product_id AND pp.effective_to IS NULL LEFT JOIN distributor_pricing dp ON dp.product_id = p.product_id AND dp.distributor_id = ? AND dp.effective_to IS NULL WHERE p.status = 'Active' AND ds.quantity > 0";
        $params = [$distributorId, $distributorId];
        if ($categoryId > 0) { $sql .= " AND p.category_id = ?"; $params[] = $categoryId; }
        $sql .= " ORDER BY p.product_name";
        $stmt = $this->db->prepare($sql); $stmt->execute($params); return $stmt->fetchAll();
    }
    public function getProductsForDistributor(int $distributorId): array {
        $sql = "SELECT 
                    p.product_id,
                    p.product_name,
                    p.description,
                    p.unit,
                    p.image_url,
                    p.status AS product_status,
                    pc.category_name,
                    pc.category_id,
                    pp.base_price,
                    pp.mrp_max_retail_price AS mrp,
                    COALESCE(dp.price, pp.base_price) AS selling_price,
                    COALESCE(ds.quantity, 0) AS stock
                FROM product p
                JOIN product_category pc ON pc.category_id = p.category_id
                LEFT JOIN product_pricing pp ON pp.product_id = p.product_id 
                    AND pp.effective_to IS NULL
                LEFT JOIN distributor_pricing dp ON dp.product_id = p.product_id 
                    AND dp.distributor_id = ? 
                    AND dp.effective_to IS NULL
                LEFT JOIN distributor_stock ds ON ds.product_id = p.product_id 
                    AND ds.distributor_id = ?
                ORDER BY p.product_name";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$distributorId, $distributorId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function setDistributorPrice(int $distributorId, int $productId, float $price): void {
        // Terminate previous pricing if exists
        $this->db->prepare("UPDATE distributor_pricing SET effective_to = CURDATE() WHERE distributor_id = ? AND product_id = ? AND effective_to IS NULL")
                 ->execute([$distributorId, $productId]);
        // Insert new pricing
        $this->db->prepare("INSERT INTO distributor_pricing (distributor_id, product_id, price, effective_from) VALUES (?, ?, ?, CURDATE())")
                 ->execute([$distributorId, $productId, $price]);
    }
}
