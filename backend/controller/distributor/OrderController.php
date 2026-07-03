<?php
require_once __DIR__ . '/../../service/OrderService.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
class OrderController {
    private OrderService          $orderService;
    private DistributorRepository $distributorRepo;
    public function __construct() { $this->orderService = new OrderService(); $this->distributorRepo = new DistributorRepository(); }
    public function handle(array $user): void {
        $distributor = $this->distributorRepo->findByUserId($user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);
        $distributorId = (int)$distributor['distributor_id'];
        $method = $_SERVER['REQUEST_METHOD'];
        try { match ($method) { 'GET' => $this->getOrders($distributorId), 'PUT' => $this->handleAction($distributorId), default => sendError('Method not allowed', 405) }; }
        catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function getOrders(int $distributorId): void {
        $id = (int)($_GET['id'] ?? 0); $status = $_GET['status'] ?? '';
        if ($id) { sendSuccess($this->orderService->getOrderWithItems($id)); return; }
        sendSuccess($this->orderService->getDistributorOrders($distributorId, $status));
    }
    private function handleAction(int $distributorId): void {
        $id = (int)($_GET['id'] ?? 0); $action = $_GET['action'] ?? '';
        if (!$id) sendError('Order ID required', 400);
        match ($action) {
            'approve' => sendSuccess($this->orderService->approveOrder($id, $distributorId), 'Order approved'),
            'reject'  => (function () use ($id, $distributorId) { $this->orderService->rejectOrder($id, $distributorId); sendSuccess(null, 'Order rejected'); })(),
            default   => sendError('Invalid action', 400),
        };
    }
}
