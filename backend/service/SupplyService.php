<?php
require_once __DIR__ . '/../repository/SupplyRepository.php';
require_once __DIR__ . '/../repository/StockRepository.php';
require_once __DIR__ . '/../repository/DistributorRepository.php';
require_once __DIR__ . '/../service/NotificationService.php';
require_once __DIR__ . '/../util/Database.php';

class SupplyService {
    private SupplyRepository      $supplyRepo;
    private StockRepository       $stockRepo;
    private DistributorRepository $distributorRepo;
    private NotificationService   $notifService;
    private PDO                   $db;

    public function __construct() {
        $this->supplyRepo      = new SupplyRepository();
        $this->stockRepo       = new StockRepository();
        $this->distributorRepo = new DistributorRepository();
        $this->notifService    = new NotificationService();
        $this->db              = Database::getConnection();
    }

    public function createRequest(int $distributorId, array $items, string $remarks = ''): array {
        $requestId = $this->supplyRepo->create($distributorId, $remarks);
        foreach ($items as $item) {
            $this->supplyRepo->createItem($requestId, (int)$item['product_id'], (int)$item['quantity']);
        }
        $this->notifService->send(1, "New Supply Request", "Distributor ID $distributorId submitted supply request #$requestId");
        return $this->getRequestWithItems($requestId);
    }

    public function approveRequest(int $requestId, array $approvals, int $adminUserId): array {
        $request = $this->supplyRepo->findById($requestId);
        if (!$request) throw new Exception("Supply request not found", 404);
        $items         = $this->supplyRepo->getItems($requestId);
        $distributorId = (int)$request['distributor_id'];

        $this->db->beginTransaction();
        try {
            foreach ($items as $item) {
                $approvedQty = 0;
                foreach ($approvals as $approval) {
                    if ((int)$approval['request_item_id'] === (int)$item['request_item_id']) {
                        $approvedQty = max(0, (int)$approval['approved_qty']); break;
                    }
                }
                if ($approvedQty <= 0) continue;
                $this->stockRepo->deductWarehouse((int)$item['product_id'], $approvedQty);
                $this->stockRepo->addDistributorStock($distributorId, (int)$item['product_id'], $approvedQty);
                $this->supplyRepo->approveItem((int)$item['request_item_id'], $approvedQty);
            }
            $this->supplyRepo->createTransfer($requestId, $distributorId, $adminUserId);
            $this->supplyRepo->updateStatus($requestId, 'Partially_Approved');
            $this->db->commit();
        } catch (Exception $e) {
            $this->db->rollBack(); throw $e;
        }

        $distributor = $this->distributorRepo->findById($distributorId);
        if ($distributor) $this->notifService->send($distributor['user_id'], "Supply Request Approved", "Your supply request #$requestId has been approved.");
        return $this->getRequestWithItems($requestId);
    }

    public function rejectRequest(int $requestId, int $distributorId, string $remarks = ''): void {
        $this->supplyRepo->updateStatus($requestId, 'Rejected', $remarks);
        $distributor = $this->distributorRepo->findById($distributorId);
        if ($distributor) $this->notifService->send($distributor['user_id'], "Supply Request Rejected", "Your supply request #$requestId was rejected. Reason: $remarks");
    }

    public function getAll(string $status = ''): array { return $this->supplyRepo->getAll($status); }
    public function getByDistributor(int $distributorId): array { return $this->supplyRepo->getByDistributor($distributorId); }

    public function getRequestWithItems(int $requestId): array {
        $request = $this->supplyRepo->findById($requestId);
        if (!$request) throw new Exception("Supply request not found", 404);
        $request['items'] = $this->supplyRepo->getItems($requestId);
        return $request;
    }
}
