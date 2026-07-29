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
        if (isset($_GET['id'])) {
            sendSuccess($supplyService->getRequestWithItems((int)$_GET['id']));
        } else {
            sendSuccess($supplyService->getByDistributor($distributorId));
        }
    } elseif ($method === 'POST') {
        $body = getBody(); $items = $body['items'] ?? []; $remarks = $body['remarks'] ?? '';
        if (empty($items)) sendError('Items are required', 400);
        sendSuccess($supplyService->createRequest($distributorId, $items, $remarks), 'Request submitted', 201);
    } elseif ($method === 'PUT') {
        $id     = (int)($_GET['id'] ?? 0);
        $action = $_GET['action'] ?? '';
        if (!$id)              sendError('Request ID required', 400);
        if ($action !== 'receive') sendError('Invalid action', 400);
        // Verify the request belongs to this distributor
        $request = $supplyService->getRequestWithItems($id);
        if ((int)$request['distributor_id'] !== $distributorId) sendError('Forbidden', 403);
        if ($request['status'] !== 'Partially_Approved') sendError('Only Partially_Approved requests can be marked received', 422);
        sendSuccess($supplyService->markReceived($id, $distributorId), 'Stock marked as received');
    } else {
        sendError('Method not allowed', 405);
    }
} catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
