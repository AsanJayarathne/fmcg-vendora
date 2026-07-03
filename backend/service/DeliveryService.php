<?php
require_once __DIR__ . '/../repository/DeliveryRepository.php';
require_once __DIR__ . '/../repository/OrderRepository.php';
require_once __DIR__ . '/../repository/StockRepository.php';
require_once __DIR__ . '/../repository/CreditRepository.php';
require_once __DIR__ . '/../repository/RetailerRepository.php';
require_once __DIR__ . '/../service/NotificationService.php';
require_once __DIR__ . '/../util/Database.php';

class DeliveryService {
    private DeliveryRepository  $deliveryRepo;
    private OrderRepository     $orderRepo;
    private StockRepository     $stockRepo;
    private CreditRepository    $creditRepo;
    private RetailerRepository  $retailerRepo;
    private NotificationService $notifService;
    private PDO                 $db;

    public function __construct() {
        $this->deliveryRepo = new DeliveryRepository();
        $this->orderRepo    = new OrderRepository();
        $this->stockRepo    = new StockRepository();
        $this->creditRepo   = new CreditRepository();
        $this->retailerRepo = new RetailerRepository();
        $this->notifService = new NotificationService();
        $this->db           = Database::getConnection();
    }

    public function getOpenPool(int $distributorId): array { return $this->deliveryRepo->getOpenPool($distributorId); }
    public function getDriverDeliveries(int $driverId): array { return $this->deliveryRepo->getByDriver($driverId); }
    public function getForRetailer(int $retailerId): array { return $this->deliveryRepo->getByRetailer($retailerId); }
    public function getForDistributor(int $distributorId): array { return $this->deliveryRepo->getByDistributor($distributorId); }

    public function claim(int $deliveryId, int $driverId, int $distributorId): array {
        $this->db->beginTransaction();
        try {
            $delivery = $this->deliveryRepo->findForUpdate($deliveryId);
            if (!$delivery) throw new Exception("Delivery not found", 404);
            if ($delivery['status'] !== 'OPEN') throw new Exception("This delivery has already been claimed", 409);
            $order = $this->orderRepo->findById((int)$delivery['order_id']);
            if ((int)$order['distributor_id'] !== $distributorId) throw new Exception("Delivery not in your region", 403);
            $this->deliveryRepo->claim($deliveryId, $driverId);
            $this->db->commit();
        } catch (Exception $e) { $this->db->rollBack(); throw $e; }
        return $this->deliveryRepo->findById($deliveryId);
    }

    public function markDelivered(int $deliveryId, int $driverId, float $collectedAmount, string $remarks = ''): array {
        $delivery = $this->deliveryRepo->findById($deliveryId);
        if (!$delivery || (int)$delivery['driver_id'] !== $driverId) throw new Exception("Delivery not found or not assigned to you", 404);
        if ($delivery['status'] !== 'CLAIMED') throw new Exception("Can only mark CLAIMED deliveries as delivered", 422);
        $order = $this->orderRepo->findById((int)$delivery['order_id']);

        $this->db->beginTransaction();
        try {
            $items = $this->orderRepo->getItemsByOrder((int)$order['order_id']);
            foreach ($items as $item) {
                $this->stockRepo->deductDistributorStock((int)$order['distributor_id'], (int)$item['product_id'], (int)$item['quantity']);
            }
            if ($order['payment_method'] === 'Credit') {
                $credit = $this->creditRepo->findByRetailerAndDistributor((int)$order['retailer_id'], (int)$order['distributor_id']);
                if ($credit) {
                    $this->creditRepo->debit((int)$credit['credit_id'], (float)$order['total_amount']);
                    $updated = $this->creditRepo->findById((int)$credit['credit_id']);
                    $this->creditRepo->addTransaction((int)$credit['credit_id'], 'Debit', (float)$order['total_amount'], (float)$updated['current_balance'], "Order #{$order['order_id']} delivered", (int)$order['order_id']);
                }
            }
            $this->deliveryRepo->markDelivered($deliveryId, $collectedAmount, $remarks);
            $this->orderRepo->updateStatus((int)$order['order_id'], 'Delivered');
            $this->db->commit();
        } catch (Exception $e) { $this->db->rollBack(); throw $e; }

        $retailer = $this->retailerRepo->findById((int)$order['retailer_id']);
        if ($retailer) $this->notifService->send($retailer['user_id'], "Order Delivered", "Your order #{$order['order_id']} has been delivered.");
        return $this->deliveryRepo->findById($deliveryId);
    }

    public function markReturned(int $deliveryId, int $driverId, string $remarks): array {
        $delivery = $this->deliveryRepo->findById($deliveryId);
        if (!$delivery || (int)$delivery['driver_id'] !== $driverId) throw new Exception("Delivery not found or not assigned to you", 404);
        if ($delivery['status'] !== 'CLAIMED') throw new Exception("Can only return CLAIMED deliveries", 422);
        $this->deliveryRepo->markReturned($deliveryId, $remarks);
        $order = $this->orderRepo->findById((int)$delivery['order_id']);
        if ($order) {
            $this->orderRepo->updateStatus((int)$order['order_id'], 'Rejected');
            $retailer = $this->retailerRepo->findById((int)$order['retailer_id']);
            if ($retailer) $this->notifService->send($retailer['user_id'], "Delivery Returned", "Your order #{$order['order_id']} could not be delivered. Reason: $remarks");
        }
        return $this->deliveryRepo->findById($deliveryId);
    }
}
