<?php
require_once __DIR__ . '/../../repository/RetailerRepository.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
require_once __DIR__ . '/../../repository/UserRepository.php';
require_once __DIR__ . '/../../service/NotificationService.php';
class RetailerController {
    private RetailerRepository    $retailerRepo;
    private DistributorRepository $distributorRepo;
    private UserRepository        $userRepo;
    private NotificationService   $notifService;
    public function __construct() { $this->retailerRepo = new RetailerRepository(); $this->distributorRepo = new DistributorRepository(); $this->userRepo = new UserRepository(); $this->notifService = new NotificationService(); }
    public function handle(array $user): void {
        $distributor = $this->distributorRepo->findByUserId($user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);
        $method = $_SERVER['REQUEST_METHOD'];
        try { match ($method) { 'GET' => $this->getRetailers($distributor), 'PUT' => $this->updateStatus($distributor), default => sendError('Method not allowed', 405) }; }
        catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function getRetailers(array $distributor): void {
        $id = (int)($_GET['id'] ?? 0); $status = $_GET['status'] ?? '';
        if ($id) { $r = $this->retailerRepo->findById($id); if (!$r || (int)$r['region_id'] !== (int)$distributor['region_id']) sendError('Not found in your region', 404); sendSuccess($r); }
        sendSuccess($this->retailerRepo->getByRegion((int)$distributor['region_id'], $status));
    }
    private function updateStatus(array $distributor): void {
        $id = (int)($_GET['id'] ?? 0); $body = getBody(); $status = $body['status'] ?? '';
        if (!$id || !in_array($status, ['Approved','Rejected','Blocked'])) sendError('Valid retailer ID and status required', 400);
        $r = $this->retailerRepo->findById($id);
        if (!$r || (int)$r['region_id'] !== (int)$distributor['region_id']) sendError('Not found in your region', 404);
        $this->retailerRepo->updateStatus($id, $status);
        $this->userRepo->setActive((int)$r['user_id'], $status === 'Approved');
        $msgs = ['Approved' => 'Your registration has been approved.', 'Rejected' => 'Your registration has been rejected.', 'Blocked' => 'Your account has been blocked.'];
        $this->notifService->send((int)$r['user_id'], 'Account Status Update', $msgs[$status]);
        sendSuccess(null, "Status updated to $status");
    }
}
