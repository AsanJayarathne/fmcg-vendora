<?php
require_once __DIR__ . '/../../service/DeliveryService.php';
require_once __DIR__ . '/../../repository/DriverRepository.php';
class DeliveryController {
    private DeliveryService  $deliveryService;
    private DriverRepository $driverRepo;
    public function __construct() { $this->deliveryService = new DeliveryService(); $this->driverRepo = new DriverRepository(); }
    public function handle(array $user): void {
        $driver = $this->driverRepo->findByUserId($user['user_id']);
        if (!$driver) sendError('Driver profile not found', 404);
        if ($driver['status'] !== 'Approved') sendError('Driver account not approved', 403);
        $driverId = (int)$driver['driver_id']; $distributorId = (int)$driver['distributor_id'];
        $method = $_SERVER['REQUEST_METHOD']; $type = $_GET['type'] ?? '';
        try {
            match ($method) {
                'GET' => match ($type) { 'open' => sendSuccess($this->deliveryService->getOpenPool($distributorId)), default => sendSuccess($this->deliveryService->getDriverDeliveries($driverId)) },
                'PUT' => $this->handleAction($driverId, $distributorId),
                default => sendError('Method not allowed', 405),
            };
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function handleAction(int $driverId, int $distributorId): void {
        $id = (int)($_GET['id'] ?? 0); $action = $_GET['action'] ?? ''; $body = getBody();
        if (!$id) sendError('Delivery ID required', 400);
        match ($action) {
            'claim'   => sendSuccess($this->deliveryService->claim($id, $driverId, $distributorId), 'Delivery claimed'),
            'deliver' => sendSuccess($this->deliveryService->markDelivered($id, $driverId, (float)($body['collected_amount'] ?? 0), $body['remarks'] ?? ''), 'Marked as delivered'),
            'return'  => sendSuccess($this->deliveryService->markReturned($id, $driverId, $body['remarks'] ?? 'No reason given'), 'Marked as returned'),
            default   => sendError('Invalid action', 400),
        };
    }
}
