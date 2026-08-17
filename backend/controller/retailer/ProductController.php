<?php
require_once __DIR__ . '/../../repository/ProductRepository.php';
require_once __DIR__ . '/../../repository/RetailerRepository.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
class ProductController {
    private ProductRepository     $productRepo;
    private RetailerRepository    $retailerRepo;
    private DistributorRepository $distributorRepo;
    public function __construct() {
        $this->productRepo     = new ProductRepository();
        $this->retailerRepo    = new RetailerRepository();
        $this->distributorRepo = new DistributorRepository();
    }
    public function handle(array $user): void {
        $retailer = $this->retailerRepo->findByUserId($user['user_id']);
        if (!$retailer) sendError('Retailer profile not found', 404);
        if ($retailer['status'] !== 'Approved') sendError('Retailer account not approved', 403);
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed', 405);
            $categoryId = (int)($_GET['category_id'] ?? 0);
            $retailerId = (int)$retailer['retailer_id'];
            sendSuccess([
                'products' => $this->productRepo->getCatalogForRegion((int)$retailer['region_id'], $categoryId, $retailerId),
                'categories' => $this->productRepo->getAllCategories(),
                'distributors' => $this->distributorRepo->getByRegion((int)$retailer['region_id'], $retailerId)
            ]);
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
}
