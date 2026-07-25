<?php
require_once __DIR__ . '/../../service/DeliveryService.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
require_once __DIR__ . '/../../repository/DriverRepository.php';

class DeliveryController {
    private DeliveryService       $deliveryService;
    private DistributorRepository $distributorRepo;
    private DriverRepository      $driverRepo;

    public function __construct() {
        $this->deliveryService = new DeliveryService();
        $this->distributorRepo = new DistributorRepository();
        $this->driverRepo      = new DriverRepository();
    }

    public function handle(array $user): void {
        $distributor = $this->distributorRepo->findByUserId($user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);

        $distributorId = (int)$distributor['distributor_id'];
        $method        = $_SERVER['REQUEST_METHOD'];

        try {
            match ($method) {
                'GET' => $this->handleGet($distributorId),
                'PUT' => $this->handlePut($distributorId),
                default => sendError('Method not allowed', 405),
            };
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    // ── GET ──────────────────────────────────────────────────────────────────
    private function handleGet(int $distributorId): void {
        $type = $_GET['type'] ?? '';
        match ($type) {
            'open'  => sendSuccess($this->deliveryService->getOpenPool($distributorId)),
            default => sendSuccess($this->deliveryService->getForDistributor($distributorId)),
        };
    }

    // ── PUT ──────────────────────────────────────────────────────────────────
    private function handlePut(int $distributorId): void {
        $deliveryId = (int)($_GET['id'] ?? 0);
        if (!$deliveryId) sendError('Delivery ID is required', 400);

        $body   = getBody();
        $action = $body['action'] ?? '';

        if ($action === 'assign') {
            $driverId = (int)($body['driver_id'] ?? 0);
            if (!$driverId) sendError('Driver ID is required', 400);

            // Validate driver belongs to this distributor and is Approved
            $driver = $this->driverRepo->findById($driverId);
            if (!$driver || (int)$driver['distributor_id'] !== $distributorId) {
                sendError('Driver not found for your account', 404);
            }
            if ($driver['status'] !== 'Approved') {
                sendError('Driver must be Approved to be assigned a delivery', 422);
            }

            $result = $this->deliveryService->claim($deliveryId, $driverId, $distributorId);
            sendSuccess($result, 'Driver assigned successfully');
        } else {
            sendError('Unknown action. Supported: assign', 400);
        }
    }
}
