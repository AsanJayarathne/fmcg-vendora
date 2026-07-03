<?php
require_once __DIR__ . '/../../service/OrderService.php';
require_once __DIR__ . '/../../repository/RetailerRepository.php';
class OrderController {
    private OrderService       $orderService;
    private RetailerRepository $retailerRepo;
    public function __construct() { $this->orderService = new OrderService(); $this->retailerRepo = new RetailerRepository(); }
    public function handle(array $user): void {
        $retailer = $this->retailerRepo->findByUserId($user['user_id']);
        if (!$retailer) sendError('Retailer profile not found', 404);
        if ($retailer['status'] !== 'Approved') sendError('Retailer account not approved', 403);
        $retailerId = (int)$retailer['retailer_id'];
        $method = $_SERVER['REQUEST_METHOD'];
        try { match ($method) { 'GET' => $this->getOrders($retailerId), 'POST' => $this->placeOrder($retailerId), 'PUT' => $this->modifyOrder($retailerId), 'DELETE' => $this->cancelOrder($retailerId), default => sendError('Method not allowed', 405) }; }
        catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function getOrders(int $retailerId): void {
        $id = (int)($_GET['id'] ?? 0);
        if ($id) { sendSuccess($this->orderService->getOrderWithItems($id)); return; }
        sendSuccess($this->orderService->getRetailerOrders($retailerId));
    }
    private function placeOrder(int $retailerId): void {
        $body = getBody();
        if (empty($body['items']) || !is_array($body['items'])) sendError('Order items required', 400);
        sendSuccess($this->orderService->placeOrder($retailerId, $body['payment_method'] ?? 'Cash', $body['items']), 'Order placed', 201);
    }
    private function modifyOrder(int $retailerId): void {
        $id = (int)($_GET['id'] ?? 0); $body = getBody();
        if (!$id || empty($body['items'])) sendError('Order ID and items required', 400);
        sendSuccess($this->orderService->modifyOrder($id, $retailerId, $body['payment_method'] ?? 'Cash', $body['items']), 'Order updated');
    }
    private function cancelOrder(int $retailerId): void {
        $id = (int)($_GET['id'] ?? 0); if (!$id) sendError('Order ID required', 400);
        $this->orderService->cancelOrder($id, $retailerId); sendSuccess(null, 'Order cancelled');
    }
}
