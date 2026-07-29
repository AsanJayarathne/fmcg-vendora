<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../repository/StockRepository.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
$user        = requireRole('DISTRIBUTOR');
$distRepo    = new DistributorRepository();
$distributor = $distRepo->findByUserId($user['user_id']);
if (!$distributor) sendError('Distributor not found', 404);
$stockRepo     = new StockRepository();
$distributorId = (int)$distributor['distributor_id'];
try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed', 405);
    if (isset($_GET['product_id'])) {
        // Return individual batch rows for a specific product (real drill-down)
        $productId = (int)$_GET['product_id'];
        sendSuccess($stockRepo->getDistributorBatchesFull($distributorId, $productId));
    } elseif (isset($_GET['low_stock'])) {
        sendSuccess($stockRepo->getLowStock($distributorId));
    } else {
        sendSuccess($stockRepo->getDistributorStock($distributorId));
    }
} catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
