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

    /**
     * Approve a supply request:
     * 1. Deduct warehouse batches via FEFO.
     * 2. Create stock_transfer + stock_transfer_items rows.
     * 3. Create distributor_batch rows for each deducted warehouse batch chunk.
     */
    public function approveRequest(int $requestId, array $approvals, int $adminUserId): array {
        $request = $this->supplyRepo->findById($requestId);
        if (!$request) throw new Exception("Supply request not found", 404);

        $items         = $this->supplyRepo->getItems($requestId);
        $distributorId = (int)$request['distributor_id'];

        $this->db->beginTransaction();
        try {
            // Create the stock_transfer header first
            $transferId = $this->supplyRepo->createTransfer($requestId, $distributorId, $adminUserId);

            foreach ($items as $item) {
                $approvedQty = 0;
                foreach ($approvals as $approval) {
                    if ((int)$approval['request_item_id'] === (int)$item['request_item_id']) {
                        $approvedQty = max(0, (int)$approval['approved_qty']);
                        break;
                    }
                }
                if ($approvedQty <= 0) continue;

                $productId = (int)$item['product_id'];

                // FEFO deduction — returns array of deducted batch chunks
                $deductedBatches = $this->stockRepo->deductWarehouse($productId, $approvedQty);

                foreach ($deductedBatches as $chunk) {
                    // Record each chunk in stock_transfer_items
                    $this->stockRepo->createTransferItem(
                        $transferId,
                        (int)$chunk['batch_id'],
                        $productId,
                        (int)$chunk['qty_deducted'],
                        (float)$chunk['cost_price'],
                        (float)$chunk['selling_price']
                    );

                    // Create a corresponding distributor_batch for each warehouse batch chunk (initially inactive with 0 qty)
                    $this->stockRepo->addDistributorBatch(
                        $distributorId,
                        $productId,
                        (int)$chunk['qty_deducted'],
                        (float)$chunk['cost_price'],
                        (float)$chunk['selling_price'],
                        $chunk['mfg_date']    ?? null,
                        $chunk['expiry_date'] ?? null,
                        (int)$chunk['batch_id'],
                        $transferId,
                        date('Y-m-d'),
                        0,
                        'Exhausted'
                    );
                }

                $this->supplyRepo->approveItem((int)$item['request_item_id'], $approvedQty);
            }

            $this->supplyRepo->updateStatus($requestId, 'Partially_Approved');
            $this->db->commit();

        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }

        $distributor = $this->distributorRepo->findById($distributorId);
        if ($distributor) {
            $this->notifService->send(
                $distributor['user_id'],
                "Supply Request Approved",
                "Your supply request #$requestId has been approved."
            );
        }
        return $this->getRequestWithItems($requestId);
    }

    public function rejectRequest(int $requestId, int $distributorId, string $remarks = ''): void {
        $this->supplyRepo->updateStatus($requestId, 'Rejected', $remarks);
        $distributor = $this->distributorRepo->findById($distributorId);
        if ($distributor) {
            $this->notifService->send(
                $distributor['user_id'],
                "Supply Request Rejected",
                "Your supply request #$requestId was rejected. Reason: $remarks"
            );
        }
    }

    /**
     * Distributor marks a Partially_Approved request as Received.
     * Updates supply_request status to 'Received' and notifies admin.
     */
    public function markReceived(int $requestId, int $distributorId): array {
        $this->db->beginTransaction();
        try {
            $this->supplyRepo->updateStatus($requestId, 'Received');
            // Activate the distributor stock batches
            $this->stockRepo->activateDistributorStockForRequest($requestId);
            $this->db->commit();
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }

        // Notify admin (user_id = 1 is the admin)
        $this->notifService->send(
            1,
            "Stock Received Confirmation",
            "Distributor ID $distributorId confirmed receipt of stock for request #$requestId."
        );
        return $this->getRequestWithItems($requestId);
    }

    public function getAll(string $status = ''): array          { return $this->supplyRepo->getAll($status); }
    public function getByDistributor(int $distributorId): array { return $this->supplyRepo->getByDistributor($distributorId); }

    public function getRequestWithItems(int $requestId): array {
        $request = $this->supplyRepo->findById($requestId);
        if (!$request) throw new Exception("Supply request not found", 404);
        $request['items'] = $this->supplyRepo->getItems($requestId);
        return $request;
    }
}
