<?php
require_once __DIR__ . '/../../repository/StockRepository.php';
require_once __DIR__ . '/../../repository/ProductRepository.php';

class WarehouseStockController {
    private StockRepository $stockRepo;
    public function __construct() { $this->stockRepo = new StockRepository(); }

    public function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            match ($method) {
                'GET'  => $this->getStock(),
                'POST' => $this->addBatch(),
                'PUT'  => $this->updateBatch(),
                default => sendError('Method not allowed', 405)
            };
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }

    /** GET — return all warehouse batches, or batches for a single product */
    private function getStock(): void {
        if (isset($_GET['product_id'])) {
            $productId = (int)$_GET['product_id'];
            sendSuccess($this->stockRepo->getWarehouseBatchesByProductAll($productId));
        } elseif (isset($_GET['summary'])) {
            sendSuccess($this->stockRepo->getWarehouseSummary());
        } else {
            $this->stockRepo->markExpiredBatches();
            sendSuccess($this->stockRepo->getWarehouseAll());
        }
    }

    /** POST — add a new warehouse batch when goods arrive from manufacturer */
    private function addBatch(): void {
        $body         = getBody();
        $productId    = (int)($body['product_id']    ?? 0);
        $qty          = (int)($body['quantity']       ?? 0);
        $costPrice    = (float)($body['cost_price']   ?? 0);
        $sellingPrice = (float)($body['selling_price'] ?? 0);
        $mfgDate      = trim($body['mfg_date']    ?? '') ?: null;
        $expiryDate   = trim($body['expiry_date'] ?? '') ?: null;
        $receivedAt   = trim($body['received_at'] ?? '') ?: null;

        if (!$productId)    sendError('product_id is required', 400);
        if ($qty <= 0)      sendError('quantity must be greater than 0', 400);
        if ($costPrice <= 0)    sendError('cost_price must be greater than 0', 400);
        if ($sellingPrice <= 0) sendError('selling_price must be greater than 0', 400);

        $batchId = $this->stockRepo->addWarehouseBatch(
            $productId, $qty, $costPrice, $sellingPrice, $mfgDate, $expiryDate, $receivedAt
        );
        $batch = $this->stockRepo->getWarehouseBatchById($batchId);
        sendSuccess($batch, 'Warehouse batch added successfully', 201);
    }

    /** PUT — update an existing batch (quantity correction / expiry update) */
    private function updateBatch(): void {
        $batchId = (int)($_GET['batch_id'] ?? 0);
        if (!$batchId) sendError('batch_id is required as a query parameter', 400);

        $batch = $this->stockRepo->getWarehouseBatchById($batchId);
        if (!$batch) sendError("Batch #$batchId not found", 404);

        $body       = getBody();
        $qty        = isset($body['quantity'])    ? (int)$body['quantity']    : null;
        $expiryDate = array_key_exists('expiry_date', $body) ? (trim($body['expiry_date']) ?: null) : 'SKIP';

        $this->stockRepo->updateWarehouseBatch($batchId, $qty, $expiryDate);
        $updated = $this->stockRepo->getWarehouseBatchById($batchId);
        sendSuccess($updated, 'Batch updated successfully');
    }
}
