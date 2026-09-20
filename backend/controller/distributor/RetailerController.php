<?php
require_once __DIR__ . '/../../repository/RetailerRepository.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
require_once __DIR__ . '/../../repository/UserRepository.php';
require_once __DIR__ . '/../../repository/CreditRepository.php';
require_once __DIR__ . '/../../service/NotificationService.php';
require_once __DIR__ . '/../../util/Mailer.php';
class RetailerController {
    private RetailerRepository    $retailerRepo;
    private DistributorRepository $distributorRepo;
    private UserRepository        $userRepo;
    private CreditRepository      $creditRepo;
    private NotificationService   $notifService;
    private Mailer                $mailer;
    public function __construct() {
        $this->retailerRepo = new RetailerRepository();
        $this->distributorRepo = new DistributorRepository();
        $this->userRepo = new UserRepository();
        $this->creditRepo = new CreditRepository();
        $this->notifService = new NotificationService();
        $this->mailer = new Mailer();
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

            // Send approval email notification to retailer
            if (!empty($r['email'])) {
                $env = parse_ini_file(__DIR__ . '/../../.env') ?: [];
                $loginUrl = ($env['FRONTEND_RETAILER_URL'] ?? 'http://localhost:5176') . '/login';
                $this->mailer->sendRetailerApproval(
                    $r['email'],
                    $r['full_name'] ?? 'Retailer',
                    $r['shop_name'] ?? 'Your Shop',
                    $distributor['company_name'] ?? 'Regional Distributor',
                    $loginUrl
                );
            }
        } elseif ($status === 'Rejected') {
            $this->retailerRepo->updateStatus($id, 'Rejected');
            $this->userRepo->setActive((int)$r['user_id'], false);
            $this->notifService->send((int)$r['user_id'], 'Account Status Update', 'Your registration has been rejected.');

            // Send rejection email notification to retailer
            if (!empty($r['email'])) {
                $this->mailer->sendRetailerRejection(
                    $r['email'],
                    $r['full_name'] ?? 'Partner',
                    $r['shop_name'] ?? 'Your Shop',
                    $distributor['company_name'] ?? 'Regional Distributor'
                );
            }
        }
        sendSuccess(null, "Status updated to $status");
    }
}
