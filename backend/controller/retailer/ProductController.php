<?php
require_once __DIR__ . '/../../repository/ProductRepository.php';
require_once __DIR__ . '/../../repository/RetailerRepository.php';
class ProductController {
    private ProductRepository  $productRepo;
    private RetailerRepository $retailerRepo;
    public function __construct() { $this->productRepo = new ProductRepository(); $this->retailerRepo = new RetailerRepository(); }
    public function handle(array $user): void {
        $retailer = $this->retailerRepo->findByUserId($user['user_id']);
        if (!$retailer) sendError('Retailer profile not found', 404);
        if ($retailer['status'] !== 'Approved') sendError('Retailer account not approved', 403);
        $distributor = $this->retailerRepo->getDistributorForRetailer((int)$retailer['retailer_id']);
        if (!$distributor) sendError('No distributor found for your region', 422);
        $distributorId = (int)$distributor['distributor_id'];
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed', 405);
            $categoryId = (int)($_GET['category_id'] ?? 0);
            sendSuccess(['products' => $this->productRepo->getCatalogForDistributor($distributorId, $categoryId), 'categories' => $this->productRepo->getAllCategories()]);
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
}
