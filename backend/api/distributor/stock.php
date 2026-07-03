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
    $data = isset($_GET['low_stock']) ? $stockRepo->getLowStock($distributorId) : $stockRepo->getDistributorStock($distributorId);
    sendSuccess($data);
} catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
