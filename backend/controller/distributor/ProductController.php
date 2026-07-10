<?php
require_once __DIR__ . '/../../repository/ProductRepository.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';

class ProductController {
    private ProductRepository     $productRepo;
    private DistributorRepository $distributorRepo;

    public function __construct() {
        $this->productRepo = new ProductRepository();
        $this->distributorRepo = new DistributorRepository();
    }

    public function handle(array $user): void {
        $distributor = $this->distributorRepo->findByUserId($user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);
        
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            match ($method) {
                'GET' => $this->getProducts($distributor),
                'PUT' => $this->updatePrice($distributor),
                default => sendError('Method not allowed', 405)
            };
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    private function getProducts(array $distributor): void {
        $distributorId = (int)$distributor['distributor_id'];
        $products = $this->productRepo->getProductsForDistributor($distributorId);
        $categories = $this->productRepo->getAllCategories();
        sendSuccess([
            'products' => $products,
            'categories' => $categories
        ]);
    }

    private function updatePrice(array $distributor): void {
        $distributorId = (int)$distributor['distributor_id'];
        $productId = (int)($_GET['id'] ?? 0);
        if (!$productId) sendError('Product ID is required', 400);

        $body = getBody();
        $price = isset($body['price']) ? (float)$body['price'] : null;
        if ($price === null || $price < 0) {
            sendError('Valid price is required', 400);
        }

        // Verify the product exists
        $product = $this->productRepo->findById($productId);
        if (!$product) sendError('Product not found', 404);

        // Enforce base_price <= price <= mrp_max_retail_price bounds check
        $basePrice = isset($product['base_price']) ? (float)$product['base_price'] : 0.0;
        $mrp = isset($product['mrp_max_retail_price']) ? (float)$product['mrp_max_retail_price'] : 0.0;
        if ($price < $basePrice || $price > $mrp) {
            sendError("Selling price must be between Base Price (LKR " . number_format($basePrice, 2) . ") and MRP (LKR " . number_format($mrp, 2) . ")", 400);
        }

        $this->productRepo->setDistributorPrice($distributorId, $productId, $price);
        sendSuccess(null, "Product price updated successfully to LKR " . number_format($price, 2));
    }
}
