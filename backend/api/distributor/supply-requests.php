<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../service/SupplyService.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
$user        = requireRole('DISTRIBUTOR');
$distRepo    = new DistributorRepository();
$distributor = $distRepo->findByUserId($user['user_id']);
if (!$distributor) sendError('Distributor not found', 404);
$distributorId = (int)$distributor['distributor_id'];
$supplyService = new SupplyService();
$method        = $_SERVER['REQUEST_METHOD'];
try {
    if ($method === 'GET') {
        sendSuccess($supplyService->getByDistributor($distributorId));
    } elseif ($method === 'POST') {
        $body = getBody(); $items = $body['items'] ?? []; $remarks = $body['remarks'] ?? '';
        if (empty($items)) sendError('Items are required', 400);
        sendSuccess($supplyService->createRequest($distributorId, $items, $remarks), 'Request submitted', 201);
    } else {
        sendError('Method not allowed', 405);
    }
} catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
