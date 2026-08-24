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
        $sql = "SELECT p.*, pc.category_name,
                       SUM(db.quantity) AS available_qty,
                       MIN(db.selling_price) AS unit_price
                FROM product p
                JOIN product_category pc ON pc.category_id = p.category_id
                JOIN distributor_batch db ON db.product_id = p.product_id
                  AND db.distributor_id = ? AND db.status = 'Active'
                WHERE p.status = 'Active'
                GROUP BY p.product_id, pc.category_name
                HAVING SUM(db.quantity) > 0";
        $params = [$distributorId];
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
                    COALESCE(
                        (SELECT MIN(db.selling_price) 
                         FROM distributor_batch db 
                         WHERE db.product_id = p.product_id AND db.distributor_id = ? AND db.status = 'Active'),
                        pp.base_price
                    ) AS selling_price,
                    COALESCE(
                        (SELECT SUM(db.quantity) 
                         FROM distributor_batch db 
                         WHERE db.product_id = p.product_id AND db.distributor_id = ? AND db.status = 'Active'),
                        0
                    ) AS stock,
                    COALESCE(
                        (SELECT SUM(wb.quantity) 
                         FROM warehouse_batch wb 
                         WHERE wb.product_id = p.product_id AND wb.status = 'Active'),
                        0
                    ) AS warehouse_stock,
                    COALESCE(
                        (SELECT SUM(sri.requested_qty)
                         FROM supply_request_items sri
                         JOIN supply_request sr ON sr.request_id = sri.request_id
                         WHERE sri.product_id = p.product_id AND sr.status = 'Pending'),
                        0
                    ) AS pending_stock,
                    GREATEST(0,
                        COALESCE(
                            (SELECT SUM(wb.quantity) 
                             FROM warehouse_batch wb 
                             WHERE wb.product_id = p.product_id AND wb.status = 'Active'),
                            0
                        ) -
                        COALESCE(
                            (SELECT SUM(sri.requested_qty)
                             FROM supply_request_items sri
                             JOIN supply_request sr ON sr.request_id = sri.request_id
                             WHERE sri.product_id = p.product_id AND sr.status = 'Pending'),
                            0
                        )
                    ) AS available_to_request
                FROM product p
                JOIN product_category pc ON pc.category_id = p.category_id
                LEFT JOIN product_pricing pp ON pp.product_id = p.product_id
                    AND pp.effective_to IS NULL
                ORDER BY p.product_name";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$distributorId, $distributorId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getCatalogForRegion(int $regionId, int $categoryId = 0, int $retailerId = 0): array {
        $sql = "SELECT
                    p.*,
                    pc.category_name,
                    pc.category_id,
                    d.distributor_id,
                    d.company_name AS distributor_name,
                    COALESCE(MIN(db.selling_price), pp.base_price) AS unit_price,
                    COALESCE(SUM(db.quantity), 0) AS available_qty
                FROM product p
                JOIN product_category pc ON pc.category_id = p.category_id
                CROSS JOIN distributor d
                LEFT JOIN product_pricing pp ON pp.product_id = p.product_id AND pp.effective_to IS NULL
                LEFT JOIN distributor_batch db ON db.product_id = p.product_id
                  AND db.distributor_id = d.distributor_id AND db.status = 'Active'
                WHERE p.status = 'Active'
                  AND d.region_id = ?
                  AND d.status = 'Approved'";
        $params = [$regionId];
        if ($categoryId > 0) {
            $sql .= " AND p.category_id = ?";
            $params[] = $categoryId;
        }
        if ($retailerId > 0) {
            $sql .= " AND NOT EXISTS (
                SELECT 1 FROM credit_account ca
                WHERE ca.retailer_id = ?
                  AND ca.distributor_id = d.distributor_id
                  AND ca.status = 'Blocked'
            )";
            $params[] = $retailerId;
        }
        $sql .= " GROUP BY p.product_id, pc.category_name, pc.category_id, d.distributor_id, d.company_name, pp.base_price";
        $sql .= " ORDER BY p.product_name, d.company_name";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function hasOrderOrSupplyHistory(int $productId): bool {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM order_items WHERE product_id = ?");
        $stmt->execute([$productId]);
        if ((int)$stmt->fetchColumn() > 0) return true;

        $stmt = $this->db->prepare("SELECT COUNT(*) FROM supply_request_items WHERE product_id = ?");
        $stmt->execute([$productId]);
        if ((int)$stmt->fetchColumn() > 0) return true;

        return false;
    }

    public function delete(int $productId): void {
        $this->db->beginTransaction();
        try {
            $this->db->prepare("DELETE FROM warehouse_batch    WHERE product_id = ?")->execute([$productId]);
            $this->db->prepare("DELETE FROM distributor_batch  WHERE product_id = ?")->execute([$productId]);
            $this->db->prepare("DELETE FROM product_pricing    WHERE product_id = ?")->execute([$productId]);
            $this->db->prepare("DELETE FROM product            WHERE product_id = ?")->execute([$productId]);
            $this->db->commit();
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function setDistributorPrice(int $distributorId, int $productId, float $price): void {
        $stmt = $this->db->prepare(
            "UPDATE distributor_batch 
             SET selling_price = ? 
             WHERE distributor_id = ? AND product_id = ? AND status IN ('Active', 'Exhausted')"
        );
        $stmt->execute([$price, $distributorId, $productId]);
    }
}

