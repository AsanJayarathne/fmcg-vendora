<?php
require_once __DIR__ . '/../util/Database.php';

class StockRepository {
    private PDO $db;
    private const LOW_STOCK_THRESHOLD = 50;

    public function __construct() { $this->db = Database::getConnection(); }

    // ── Batch Number Generators ────────────────────────────────────────────────

    public function generateWarehouseBatchNumber(): string {
        $prefix = 'WH-' . date('Ym') . '-';
        $stmt   = $this->db->prepare(
            "SELECT batch_number FROM warehouse_batch
             WHERE batch_number LIKE :prefix
             ORDER BY batch_id DESC LIMIT 1"
        );
        $stmt->execute([':prefix' => $prefix . '%']);
        $last = $stmt->fetchColumn();
        $seq  = $last ? ((int) substr($last, -3)) + 1 : 1;
        return $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }

    public function generateDistributorBatchNumber(): string {
        $prefix = 'DB-' . date('Ym') . '-';
        $stmt   = $this->db->prepare(
            "SELECT batch_number FROM distributor_batch
             WHERE batch_number LIKE :prefix
             ORDER BY dist_batch_id DESC LIMIT 1"
        );
        $stmt->execute([':prefix' => $prefix . '%']);
        $last = $stmt->fetchColumn();
        $seq  = $last ? ((int) substr($last, -3)) + 1 : 1;
        return $prefix . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }

    // ── Warehouse Batch ────────────────────────────────────────────────────────

    /** Get all warehouse batches (with product/category info). */
    public function getWarehouseAll(): array {
        $stmt = $this->db->prepare(
            "SELECT wb.*, p.product_name, p.unit, p.image_url, pc.category_name,
                    pp.base_price, pp.mrp_max_retail_price
             FROM warehouse_batch wb
             JOIN product p          ON p.product_id   = wb.product_id
             JOIN product_category pc ON pc.category_id = p.category_id
             LEFT JOIN product_pricing pp ON pp.product_id = wb.product_id AND pp.effective_to IS NULL
             ORDER BY p.product_name, wb.expiry_date ASC"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /** Get all active batches for a product (FEFO order). */
    public function getWarehouseBatchesByProduct(int $productId): array {
        $stmt = $this->db->prepare(
            "SELECT * FROM warehouse_batch
             WHERE product_id = ? AND status = 'Active' AND quantity > 0
             ORDER BY expiry_date IS NULL ASC, expiry_date ASC, batch_id ASC"
        );
        $stmt->execute([$productId]);
        return $stmt->fetchAll();
    }

    /** Get ALL batches for a product (Active + Exhausted + Expired) for drill-down. */
    public function getWarehouseBatchesByProductAll(int $productId): array {
        $stmt = $this->db->prepare(
            "SELECT wb.*, p.product_name, p.unit FROM warehouse_batch wb
             JOIN product p ON p.product_id = wb.product_id
             WHERE wb.product_id = ?
             ORDER BY wb.received_at DESC, wb.batch_id DESC"
        );
        $stmt->execute([$productId]);
        return $stmt->fetchAll();
    }

    /** Get a single warehouse batch by batch_id. */
    public function getWarehouseBatchById(int $batchId): ?array {
        $stmt = $this->db->prepare(
            "SELECT wb.*, p.product_name, p.unit FROM warehouse_batch wb
             JOIN product p ON p.product_id = wb.product_id
             WHERE wb.batch_id = ?"
        );
        $stmt->execute([$batchId]);
        return $stmt->fetch() ?: null;
    }

    /** Update a warehouse batch — allows correcting quantity and/or expiry date. */
    public function updateWarehouseBatch(int $batchId, ?int $qty, ?string $expiryDate): void {
        $setParts = [];
        $params   = [];

        if ($qty !== null) {
            $newStatus  = $qty <= 0 ? 'Exhausted' : 'Active';
            $setParts[] = 'quantity = ?';
            $params[]   = $qty;
            $setParts[] = 'status = ?';
            $params[]   = $newStatus;
        }
        if ($expiryDate !== 'SKIP') {
            $setParts[] = 'expiry_date = ?';
            $params[]   = $expiryDate;
        }
        if (empty($setParts)) return;
        $params[] = $batchId;
        $this->db->prepare('UPDATE warehouse_batch SET ' . implode(', ', $setParts) . ' WHERE batch_id = ?')
                 ->execute($params);
    }

    /** Warehouse summary: total SKUs, units, low-stock products, expiring soon. */
    public function getWarehouseSummary(): array {
        $this->markExpiredBatches();
        $row = $this->db->query(
            "SELECT
               COUNT(DISTINCT product_id)                                                  AS total_skus,
               COALESCE(SUM(CASE WHEN status='Active' THEN quantity ELSE 0 END), 0)       AS total_units,
               COUNT(DISTINCT CASE WHEN status='Active' AND quantity <= 50
                                   THEN product_id END)                                   AS low_stock_count,
               COUNT(DISTINCT CASE WHEN status='Active' AND expiry_date IS NOT NULL
                                        AND expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
                                   THEN batch_id END)                                     AS expiring_soon_count
             FROM warehouse_batch"
        )->fetch(PDO::FETCH_ASSOC);
        return $row ?: ['total_skus'=>0,'total_units'=>0,'low_stock_count'=>0,'expiring_soon_count'=>0];
    }

    /** Total available quantity across all active warehouse batches for a product. */
    public function getWarehouseTotalQty(int $productId): int {
        $stmt = $this->db->prepare(
            "SELECT COALESCE(SUM(quantity), 0) FROM warehouse_batch
             WHERE product_id = ? AND status = 'Active'"
        );
        $stmt->execute([$productId]);
        return (int) $stmt->fetchColumn();
    }

    /** Add a new warehouse batch when admin receives goods. */
    public function addWarehouseBatch(
        int $productId, int $qty, float $costPrice, float $sellingPrice,
        ?string $mfgDate, ?string $expiryDate, ?string $receivedAt = null
    ): int {
        $batchNumber = $this->generateWarehouseBatchNumber();
        $stmt = $this->db->prepare(
            "INSERT INTO warehouse_batch
               (product_id, batch_number, received_qty, quantity, cost_price,
                selling_price, mfg_date, expiry_date, received_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $productId, $batchNumber, $qty, $qty,
            $costPrice, $sellingPrice,
            $mfgDate, $expiryDate,
            $receivedAt ?? date('Y-m-d')
        ]);
        return (int) $this->db->lastInsertId();
    }

    /**
     * Deduct qty from warehouse using FEFO — earliest-expiring active batches first.
     * Returns an array of [ ['batch_id'=>X, 'qty_deducted'=>Y, ...], ... ] for audit.
     */
    public function deductWarehouse(int $productId, int $qty): array {
        $batches = $this->getWarehouseBatchesByProduct($productId);
        $remaining = $qty;
        $deducted  = [];

        foreach ($batches as $batch) {
            if ($remaining <= 0) break;
            $take = min($remaining, (int) $batch['quantity']);
            $newQty = (int) $batch['quantity'] - $take;
            $newStatus = $newQty === 0 ? 'Exhausted' : 'Active';
            $this->db->prepare(
                "UPDATE warehouse_batch SET quantity = ?, status = ? WHERE batch_id = ?"
            )->execute([$newQty, $newStatus, $batch['batch_id']]);
            $deducted[]  = array_merge($batch, ['qty_deducted' => $take]);
            $remaining  -= $take;
        }

        if ($remaining > 0) {
            throw new Exception("Insufficient warehouse stock for product ID $productId", 422);
        }
        return $deducted;
    }

    /** Update expired batch statuses. Call periodically or on each read. */
    public function markExpiredBatches(): void {
        $this->db->prepare(
            "UPDATE warehouse_batch
             SET status = 'Expired'
             WHERE status = 'Active' AND expiry_date IS NOT NULL AND expiry_date < CURDATE()"
        )->execute();
    }

    // ── Distributor Batch ──────────────────────────────────────────────────────

    /** Get all batches for a distributor (with product info). */
    public function getDistributorStock(int $distributorId): array {
        $this->markExpiredDistributorBatches($distributorId);
        $stmt = $this->db->prepare(
            "SELECT db.*, p.product_name, p.unit, pc.category_name
             FROM distributor_batch db
             JOIN product p           ON p.product_id   = db.product_id
             JOIN product_category pc ON pc.category_id  = p.category_id
             WHERE db.distributor_id = ?
             ORDER BY p.product_name, db.expiry_date ASC"
        );
        $stmt->execute([$distributorId]);
        return $stmt->fetchAll();
    }

    /**
     * Get individual distributor_batch rows for one product — for batch drill-down.
     * Returns ALL statuses (Active/Exhausted/Expired) ordered newest-received first.
     */
    public function getDistributorBatchesFull(int $distributorId, int $productId): array {
        $this->markExpiredDistributorBatches($distributorId);
        $stmt = $this->db->prepare(
            "SELECT db.*, p.product_name, p.unit, pc.category_name
             FROM distributor_batch db
             JOIN product p           ON p.product_id  = db.product_id
             JOIN product_category pc ON pc.category_id = p.category_id
             WHERE db.distributor_id = ? AND db.product_id = ?
             ORDER BY db.received_at DESC, db.dist_batch_id DESC"
        );
        $stmt->execute([$distributorId, $productId]);
        return $stmt->fetchAll();
    }

    /** Get active batches for a product at a distributor (FEFO order). */
    public function getDistributorBatchesByProduct(int $distributorId, int $productId): array {
        $stmt = $this->db->prepare(
            "SELECT * FROM distributor_batch
             WHERE distributor_id = ? AND product_id = ? AND status = 'Active' AND quantity > 0
             ORDER BY expiry_date IS NULL ASC, expiry_date ASC, dist_batch_id ASC"
        );
        $stmt->execute([$distributorId, $productId]);
        return $stmt->fetchAll();
    }

    /** Total available quantity for a product across all active distributor batches. */
    public function getDistributorTotalQty(int $distributorId, int $productId): int {
        $stmt = $this->db->prepare(
            "SELECT COALESCE(SUM(quantity), 0) FROM distributor_batch
             WHERE distributor_id = ? AND product_id = ? AND status = 'Active'"
        );
        $stmt->execute([$distributorId, $productId]);
        return (int) $stmt->fetchColumn();
    }

    /** Lowest selling_price among active batches (used for order pricing). */
    public function getDistributorBatchSellingPrice(int $distributorId, int $productId): float {
        $stmt = $this->db->prepare(
            "SELECT selling_price FROM distributor_batch
             WHERE distributor_id = ? AND product_id = ? AND status = 'Active' AND quantity > 0
             ORDER BY expiry_date IS NULL ASC, expiry_date ASC
             LIMIT 1"
        );
        $stmt->execute([$distributorId, $productId]);
        return (float) ($stmt->fetchColumn() ?: 0.00);
    }

    /** Create a new distributor batch (called when a transfer is approved, initially inactive/exhausted). */
    public function addDistributorBatch(
        int $distributorId, int $productId, int $qty,
        float $costPrice, float $sellingPrice,
        ?string $mfgDate, ?string $expiryDate,
        ?int $sourceBatchId = null, ?int $transferId = null,
        ?string $receivedAt = null,
        int $initialQty = 0,
        string $status = 'Exhausted'
    ): int {
        $batchNumber = $this->generateDistributorBatchNumber();
        $stmt = $this->db->prepare(
            "INSERT INTO distributor_batch
               (distributor_id, product_id, source_batch_id, transfer_id, batch_number,
                received_qty, quantity, cost_price, selling_price,
                mfg_date, expiry_date, status, received_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $distributorId, $productId, $sourceBatchId, $transferId, $batchNumber,
            $qty, $initialQty, $costPrice, $sellingPrice,
            $mfgDate, $expiryDate, $status,
            $receivedAt ?? date('Y-m-d')
        ]);
        return (int) $this->db->lastInsertId();
    }

    /** Activate distributor stock when request is received. */
    public function activateDistributorStockForRequest(int $requestId): void {
        $stmt = $this->db->prepare(
            "UPDATE distributor_batch 
             SET quantity = received_qty, status = 'Active'
             WHERE transfer_id IN (SELECT transfer_id FROM stock_transfer WHERE request_id = ?)"
        );
        $stmt->execute([$requestId]);
    }

    /**
     * Deduct qty from distributor using FEFO.
     * Returns deduction audit array.
     */
    public function deductDistributorStock(int $distributorId, int $productId, int $qty): array {
        $batches   = $this->getDistributorBatchesByProduct($distributorId, $productId);
        $remaining = $qty;
        $deducted  = [];

        foreach ($batches as $batch) {
            if ($remaining <= 0) break;
            $take   = min($remaining, (int) $batch['quantity']);
            $newQty = (int) $batch['quantity'] - $take;
            $newStatus = $newQty === 0 ? 'Exhausted' : 'Active';
            $this->db->prepare(
                "UPDATE distributor_batch SET quantity = ?, status = ? WHERE dist_batch_id = ?"
            )->execute([$newQty, $newStatus, $batch['dist_batch_id']]);
            $deducted[]  = array_merge($batch, ['qty_deducted' => $take]);
            $remaining  -= $take;
        }

        if ($remaining > 0) {
            throw new Exception("Insufficient distributor stock for product ID $productId", 422);
        }
        return $deducted;
    }

    public function markExpiredDistributorBatches(int $distributorId): void {
        $this->db->prepare(
            "UPDATE distributor_batch
             SET status = 'Expired'
             WHERE distributor_id = ? AND status = 'Active'
               AND expiry_date IS NOT NULL AND expiry_date < CURDATE()"
        )->execute([$distributorId]);
    }

    /** Low-stock alert: products where total active quantity < threshold. */
    public function getLowStock(int $distributorId): array {
        $stmt = $this->db->prepare(
            "SELECT db.product_id, p.product_name, p.unit,
                    SUM(db.quantity) AS quantity
             FROM distributor_batch db
             JOIN product p ON p.product_id = db.product_id
             WHERE db.distributor_id = ? AND db.status = 'Active'
             GROUP BY db.product_id, p.product_name, p.unit
             HAVING SUM(db.quantity) < ?
             ORDER BY SUM(db.quantity) ASC"
        );
        $stmt->execute([$distributorId, self::LOW_STOCK_THRESHOLD]);
        return $stmt->fetchAll();
    }

    // ── Stock Transfer Items ───────────────────────────────────────────────────

    /** Insert a stock_transfer_items row (called during supply approval). */
    public function createTransferItem(
        int $transferId, int $warehouseBatchId, int $productId,
        int $dispatchedQty, float $costPrice, float $sellingPrice
    ): void {
        $this->db->prepare(
            "INSERT INTO stock_transfer_items
               (transfer_id, warehouse_batch_id, product_id, dispatched_qty, cost_price, selling_price)
             VALUES (?, ?, ?, ?, ?, ?)"
        )->execute([$transferId, $warehouseBatchId, $productId, $dispatchedQty, $costPrice, $sellingPrice]);
    }

    /** Get all transfer items for a given transfer. */
    public function getTransferItems(int $transferId): array {
        $stmt = $this->db->prepare(
            "SELECT sti.*, p.product_name, p.unit, wb.batch_number AS warehouse_batch_number
             FROM stock_transfer_items sti
             JOIN product p       ON p.product_id  = sti.product_id
             JOIN warehouse_batch wb ON wb.batch_id = sti.warehouse_batch_id
             WHERE sti.transfer_id = ?"
        );
        $stmt->execute([$transferId]);
        return $stmt->fetchAll();
    }
}
