<?php
require_once __DIR__ . '/../../repository/ProductRepository.php';
require_once __DIR__ . '/../../repository/StockRepository.php';
class ProductController {
    private ProductRepository $productRepo;
    private StockRepository   $stockRepo;
    public function __construct() { $this->productRepo = new ProductRepository(); $this->stockRepo = new StockRepository(); }
    public function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';
        try {
            if ($action === 'categories') {
                match ($method) { 'GET' => sendSuccess($this->productRepo->getAllCategories()), 'POST' => $this->createCategory(), 'PUT' => $this->updateCategory(), default => sendError('Method not allowed', 405) };
                return;
            }
            if ($action === 'pricing') { if ($method === 'POST') $this->setPrice(); else sendError('Method not allowed', 405); return; }
            match ($method) { 'GET' => $this->getProducts(), 'POST' => $this->createProduct(), 'PUT' => $this->updateProduct(), default => sendError('Method not allowed', 405) };
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function getProducts(): void {
        $id = (int)($_GET['id'] ?? 0);
        if ($id) { $p = $this->productRepo->findById($id); if (!$p) sendError('Product not found', 404); sendSuccess($p); }
        sendSuccess($this->productRepo->getAll());
    }
    private function createProduct(): void {
        $body = getBody();
        if (empty($body['product_name']) || empty($body['category_id'])) sendError('product_name and category_id required', 400);
        $id = $this->productRepo->create($body);
        $this->stockRepo->adjustWarehouse($id, 0);
        if (!empty($body['base_price']) && !empty($body['mrp'])) $this->productRepo->setPrice($id, (float)$body['base_price'], (float)$body['mrp']);
        sendSuccess($this->productRepo->findById($id), 'Product created', 201);
    }
    private function updateProduct(): void {
        $id = (int)($_GET['id'] ?? 0); $body = getBody();
        if (!$id) sendError('Product ID required', 400);
        if (($_GET['action'] ?? '') === 'toggle') {
            $p = $this->productRepo->findById($id); if (!$p) sendError('Not found', 404);
            $s = $p['status'] === 'Active' ? 'Inactive' : 'Active'; $this->productRepo->setStatus($id, $s);
            sendSuccess(['status' => $s], 'Updated');
        }
        $this->productRepo->update($id, $body); sendSuccess($this->productRepo->findById($id), 'Updated');
    }
    private function createCategory(): void { $body = getBody(); if (empty($body['category_name'])) sendError('category_name required', 400); $id = $this->productRepo->createCategory($body); sendSuccess(['category_id' => $id], 'Created', 201); }
    private function updateCategory(): void { $id = (int)($_GET['id'] ?? 0); if (!$id) sendError('Category ID required', 400); $this->productRepo->updateCategory($id, getBody()); sendSuccess(null, 'Updated'); }
    private function setPrice(): void { $body = getBody(); $id = (int)($body['product_id'] ?? 0); if (!$id || !isset($body['base_price'], $body['mrp'])) sendError('product_id, base_price, mrp required', 400); $this->productRepo->setPrice($id, (float)$body['base_price'], (float)$body['mrp']); sendSuccess(null, 'Pricing updated'); }
}
