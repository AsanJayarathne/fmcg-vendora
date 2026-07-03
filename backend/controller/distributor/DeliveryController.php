<?php
require_once __DIR__ . '/../../service/DeliveryService.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
class DeliveryController {
    private DeliveryService       $deliveryService;
    private DistributorRepository $distributorRepo;
    public function __construct() { $this->deliveryService = new DeliveryService(); $this->distributorRepo = new DistributorRepository(); }
    public function handle(array $user): void {
        $distributor = $this->distributorRepo->findByUserId($user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);
        $distributorId = (int)$distributor['distributor_id'];
        $type = $_GET['type'] ?? '';
        try {
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') sendError('Method not allowed', 405);
            match ($type) { 'open' => sendSuccess($this->deliveryService->getOpenPool($distributorId)), default => sendSuccess($this->deliveryService->getForDistributor($distributorId)) };
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
}
