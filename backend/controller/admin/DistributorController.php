<?php
require_once __DIR__ . '/../../repository/DistributorRepository.php';
require_once __DIR__ . '/../../repository/UserRepository.php';
require_once __DIR__ . '/../../service/NotificationService.php';
class DistributorController {
    private DistributorRepository $distributorRepo;
    private UserRepository        $userRepo;
    private NotificationService   $notifService;
    public function __construct() { $this->distributorRepo = new DistributorRepository(); $this->userRepo = new UserRepository(); $this->notifService = new NotificationService(); }
    public function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        try { match ($method) { 'GET' => $this->getDistributors(), 'PUT' => $this->updateStatus(), default => sendError('Method not allowed', 405) }; }
        catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function getDistributors(): void {
        $id = (int)($_GET['id'] ?? 0);
        if ($id) { $d = $this->distributorRepo->findById($id); if (!$d) sendError('Not found', 404); sendSuccess($d); }
        sendSuccess($this->distributorRepo->getAll());
    }
    private function updateStatus(): void {
        $id = (int)($_GET['id'] ?? 0); $body = getBody(); $status = $body['status'] ?? '';
        if (!$id || !in_array($status, ['Approved','Rejected','Blocked'])) sendError('Valid distributor ID and status required', 400);
        $d = $this->distributorRepo->findById($id); if (!$d) sendError('Not found', 404);
        $this->distributorRepo->updateStatus($id, $status);
        $this->userRepo->setActive((int)$d['user_id'], $status !== 'Blocked');
        $this->notifService->send((int)$d['user_id'], 'Account Status Updated', "Your account status changed to: $status");
        sendSuccess(null, "Status updated to $status");
    }
}
