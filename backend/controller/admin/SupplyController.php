<?php
require_once __DIR__ . '/../../service/SupplyService.php';
class SupplyController {
    private SupplyService $supplyService;
    public function __construct() { $this->supplyService = new SupplyService(); }
    public function handle(array $user): void {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            match ($method) { 'GET' => $this->getRequests(), 'PUT' => $this->handleAction($user), default => sendError('Method not allowed', 405) };
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function getRequests(): void {
        $id = (int)($_GET['id'] ?? 0); $status = $_GET['status'] ?? '';
        if ($id) sendSuccess($this->supplyService->getRequestWithItems($id));
        sendSuccess($this->supplyService->getAll($status));
    }
    private function handleAction(array $user): void {
        $id = (int)($_GET['id'] ?? 0); $action = $_GET['action'] ?? ''; $body = getBody();
        if (!$id) sendError('Request ID required', 400);
        match ($action) {
            'approve' => sendSuccess($this->supplyService->approveRequest($id, $body['approvals'] ?? $body['items'] ?? [], $user['user_id']), 'Approved'),
            'reject'  => (function () use ($id, $body) { $r = $this->supplyService->getRequestWithItems($id); $this->supplyService->rejectRequest($id, (int)$r['distributor_id'], $body['remarks'] ?? ''); sendSuccess(null, 'Rejected'); })(),
            default   => sendError('Invalid action', 400),
        };
    }
}
