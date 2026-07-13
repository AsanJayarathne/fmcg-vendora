<?php
require_once __DIR__ . '/../../repository/StockRepository.php';
class WarehouseStockController {
    private StockRepository $stockRepo;
    public function __construct() { $this->stockRepo = new StockRepository(); }
    public function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            match ($method) { 'GET' => sendSuccess($this->stockRepo->getWarehouseAll()), 'PUT' => $this->adjustStock(), default => sendError('Method not allowed', 405) };
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function adjustStock(): void {
        $body = getBody();
        $productId = (int)($body['product_id'] ?? 0);
        $newQty = (int)($body['quantity'] ?? -1);
        $expiryDate = isset($body['expiry_date']) ? (trim($body['expiry_date']) ?: null) : null;
        if (!$productId || $newQty < 0) sendError('product_id and quantity (>=0) required', 400);
        $this->stockRepo->adjustWarehouse($productId, $newQty, $expiryDate);
        sendSuccess($this->stockRepo->getWarehouseByProduct($productId), 'Stock adjusted');
    }
}
