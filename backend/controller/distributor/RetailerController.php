<?php
require_once __DIR__ . '/../../repository/RetailerRepository.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
require_once __DIR__ . '/../../repository/UserRepository.php';
require_once __DIR__ . '/../../repository/CreditRepository.php';
require_once __DIR__ . '/../../service/NotificationService.php';
class RetailerController {
    private RetailerRepository    $retailerRepo;
    private DistributorRepository $distributorRepo;
    private UserRepository        $userRepo;
    private CreditRepository      $creditRepo;
    private NotificationService   $notifService;
    public function __construct() {
        $this->retailerRepo = new RetailerRepository();
        $this->distributorRepo = new DistributorRepository();
        $this->userRepo = new UserRepository();
        $this->creditRepo = new CreditRepository();
        $this->notifService = new NotificationService();
    }
    public function handle(array $user): void {
        $distributor = $this->distributorRepo->findByUserId($user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);
        $method = $_SERVER['REQUEST_METHOD'];
        try { match ($method) { 'GET' => $this->getRetailers($distributor), 'PUT' => $this->updateStatus($distributor), default => sendError('Method not allowed', 405) }; }
        catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function getRetailers(array $distributor): void {
        $id = (int)($_GET['id'] ?? 0); $status = $_GET['status'] ?? '';
        $distributorId = (int)$distributor['distributor_id'];
        if ($id) {
            $r = $this->retailerRepo->findById($id);
            if (!$r || (int)$r['region_id'] !== (int)$distributor['region_id']) sendError('Not found in your region', 404);
            $credit = $this->creditRepo->findByRetailerAndDistributor($id, $distributorId);
            if ($credit && $credit['status'] === 'Blocked') {
                $r['status'] = 'Blocked';
            }
            sendSuccess($r);
        }
        sendSuccess($this->retailerRepo->getByRegion((int)$distributor['region_id'], $status, $distributorId));
    }
    private function updateStatus(array $distributor): void {
        $id = (int)($_GET['id'] ?? 0); $body = getBody(); $status = $body['status'] ?? '';
        if (!$id || !in_array($status, ['Approved','Rejected','Blocked'])) sendError('Valid retailer ID and status required', 400);
        $r = $this->retailerRepo->findById($id);
        if (!$r || (int)$r['region_id'] !== (int)$distributor['region_id']) sendError('Not found in your region', 404);
        
        $distributorId = (int)$distributor['distributor_id'];
        if ($status === 'Blocked') {
            $this->creditRepo->setDistributorRetailerStatus($id, $distributorId, 'Blocked');
            $this->notifService->send((int)$r['user_id'], 'Account Status Update', 'Your account access with ' . ($distributor['company_name'] ?? 'distributor') . ' has been blocked.');
        } elseif ($status === 'Approved') {
            $this->retailerRepo->updateStatus($id, 'Approved');
            $this->userRepo->setActive((int)$r['user_id'], true);
            $this->creditRepo->setDistributorRetailerStatus($id, $distributorId, 'Active');
            $this->notifService->send((int)$r['user_id'], 'Account Status Update', 'Your registration/account has been approved.');
        } elseif ($status === 'Rejected') {
            $this->retailerRepo->updateStatus($id, 'Rejected');
            $this->userRepo->setActive((int)$r['user_id'], false);
            $this->notifService->send((int)$r['user_id'], 'Account Status Update', 'Your registration has been rejected.');
        }
        sendSuccess(null, "Status updated to $status");
    }
}
