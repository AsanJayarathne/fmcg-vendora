<?php
require_once __DIR__ . '/../../repository/StockRepository.php';

class WarehouseStockController {
    private StockRepository $stockRepo;
    public function __construct() { $this->stockRepo = new StockRepository(); }

    public function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            match ($method) {
                'GET'  => sendSuccess($this->stockRepo->getWarehouseAll()),
                'POST' => $this->addBatch(),
                default => sendError('Method not allowed', 405)
            };
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }

    /** POST — add a new warehouse batch when goods are received from manufacturer. */
    private function addBatch(): void {
        $body        = getBody();
        $productId   = (int)($body['product_id']    ?? 0);
        $qty         = (int)($body['quantity']       ?? 0);
        $costPrice   = (float)($body['cost_price']   ?? 0);
        $sellingPrice = (float)($body['selling_price'] ?? 0);
        $mfgDate     = trim($body['mfg_date']    ?? '') ?: null;
        $expiryDate  = trim($body['expiry_date'] ?? '') ?: null;
        $receivedAt  = trim($body['received_at'] ?? '') ?: null;

        if (!$productId || $qty <= 0 || $costPrice <= 0 || $sellingPrice <= 0) {
            sendError('product_id, quantity, cost_price, and selling_price are required', 400);
        }

        $batchId = $this->stockRepo->addWarehouseBatch(
            $productId, $qty, $costPrice, $sellingPrice, $mfgDate, $expiryDate, $receivedAt
        );
        $batches = $this->stockRepo->getWarehouseBatchesByProduct($productId);
        sendSuccess(['batch_id' => $batchId, 'batches' => $batches], 'Warehouse batch added');
    }
}
