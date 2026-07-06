<?php
require_once __DIR__ . '/../../repository/DriverRepository.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
require_once __DIR__ . '/../../repository/UserRepository.php';
require_once __DIR__ . '/../../service/NotificationService.php';

class DriverController {
    private DriverRepository      $driverRepo;
    private DistributorRepository $distributorRepo;
    private UserRepository        $userRepo;
    private NotificationService   $notifService;

    public function __construct() {
        $this->driverRepo      = new DriverRepository();
        $this->distributorRepo = new DistributorRepository();
        $this->userRepo        = new UserRepository();
        $this->notifService    = new NotificationService();
    }

    public function handle(array $user): void {
        $distributor = $this->distributorRepo->findByUserId($user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);

        $method = $_SERVER['REQUEST_METHOD'];
        try {
            match ($method) {
                'GET'  => $this->getDrivers($distributor),
                'PUT'  => $this->updateStatus($distributor),
                default => sendError('Method not allowed', 405)
            };
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    private function getDrivers(array $distributor): void {
        $id = (int)($_GET['id'] ?? 0);
        if ($id) {
            $d = $this->driverRepo->findById($id);
            if (!$d || (int)$d['distributor_id'] !== (int)$distributor['distributor_id']) {
                sendError('Driver not found for your account', 404);
            }
            sendSuccess($d);
        }
        $status = $_GET['status'] ?? '';
        $drivers = $this->driverRepo->getByDistributor((int)$distributor['distributor_id']);
        if ($status) {
            $drivers = array_values(array_filter($drivers, fn($dr) => $dr['status'] === $status));
        }
        sendSuccess($drivers);
    }

    private function updateStatus(array $distributor): void {
        $id   = (int)($_GET['id'] ?? 0);
        $body = getBody();
        $status = $body['status'] ?? '';

        if (!$id || !in_array($status, ['Approved', 'Rejected', 'Blocked'])) {
            sendError('Valid driver ID and status required', 400);
        }

        $d = $this->driverRepo->findById($id);
        if (!$d || (int)$d['distributor_id'] !== (int)$distributor['distributor_id']) {
            sendError('Driver not found for your account', 404);
        }

        $this->driverRepo->updateStatus($id, $status);
        $this->userRepo->setActive((int)$d['user_id'], $status === 'Approved');

        $msgs = [
            'Approved' => 'Your driver registration has been approved. You can now log in.',
            'Rejected' => 'Your driver registration has been rejected.',
            'Blocked'  => 'Your driver account has been blocked.',
        ];
        $this->notifService->send((int)$d['user_id'], 'Account Status Update', $msgs[$status]);

        sendSuccess(null, "Driver status updated to $status");
    }
}
