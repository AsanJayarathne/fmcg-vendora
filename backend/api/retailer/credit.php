<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../repository/CreditRepository.php';
require_once __DIR__ . '/../../repository/RetailerRepository.php';
$user         = requireRole('RETAILER');
$retailerRepo = new RetailerRepository();
$retailer     = $retailerRepo->findByUserId($user['user_id']);
if (!$retailer) sendError('Retailer not found', 404);
$distributorId = (int)($_GET['distributor_id'] ?? 0);
if (!$distributorId) {
    $distributor = $retailerRepo->getDistributorForRetailer((int)$retailer['retailer_id']);
    if (!$distributor) sendError('No distributor found for your region', 422);
    $distributorId = (int)$distributor['distributor_id'];
}
try {
    $creditRepo = new CreditRepository();
    $credit     = $creditRepo->findByRetailerAndDistributor((int)$retailer['retailer_id'], $distributorId);
    if (!$credit) sendError('No credit account found', 404);
    $credit['transactions'] = $creditRepo->getTransactions((int)$credit['credit_id']);
    $credit['accounts']     = $creditRepo->getAllByRetailer((int)$retailer['retailer_id']);
    sendSuccess($credit);
} catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
