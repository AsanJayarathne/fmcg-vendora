<?php
require_once __DIR__ . '/../repository/OrderRepository.php';
require_once __DIR__ . '/../repository/ProductRepository.php';
require_once __DIR__ . '/../repository/CreditRepository.php';
require_once __DIR__ . '/../repository/DeliveryRepository.php';
require_once __DIR__ . '/../repository/RetailerRepository.php';
require_once __DIR__ . '/../repository/DistributorRepository.php';
require_once __DIR__ . '/../service/NotificationService.php';
require_once __DIR__ . '/../util/Database.php';

class OrderService {
    private OrderRepository       $orderRepo;
    private ProductRepository     $productRepo;
    private CreditRepository      $creditRepo;
    private DeliveryRepository    $deliveryRepo;
    private RetailerRepository    $retailerRepo;
    private DistributorRepository $distributorRepo;
    private NotificationService   $notifService;

    public function __construct() {
        $this->orderRepo       = new OrderRepository();
        $this->productRepo     = new ProductRepository();
        $this->creditRepo      = new CreditRepository();
        $this->deliveryRepo    = new DeliveryRepository();
        $this->retailerRepo    = new RetailerRepository();
        $this->distributorRepo = new DistributorRepository();
        $this->notifService    = new NotificationService();
    }

    public function placeOrder(int $retailerId, string $paymentMethod, array $items, int $distributorId = 0): array {
        $retailer = $this->retailerRepo->findById($retailerId);
        if (!$retailer) throw new Exception("Retailer profile not found", 404);

        if (!$distributorId) {
            $distributor = $this->retailerRepo->getDistributorForRetailer($retailerId);
            if (!$distributor) throw new Exception("No approved distributor found for your region", 422);
            $distributorId = (int)$distributor['distributor_id'];
        } else {
            $distributor = $this->distributorRepo->findById($distributorId);
            if (!$distributor || $distributor['status'] !== 'Approved' || (int)$distributor['region_id'] !== (int)$retailer['region_id']) {
                throw new Exception("Invalid or unapproved distributor for your region", 422);
            }
        }

        $enrichedItems = [];
        $totalAmount   = 0.0;
        foreach ($items as $item) {
            $catalog = $this->productRepo->getCatalogForDistributor($distributorId, 0);
            $product = null;
            foreach ($catalog as $p) {
                if ((int)$p['product_id'] === (int)$item['product_id']) { $product = $p; break; }
            }
            if (!$product) throw new Exception("Product ID {$item['product_id']} not available", 422);
            if ($product['available_qty'] < $item['quantity']) throw new Exception("Insufficient stock for: {$product['product_name']}", 422);
            $lineTotal       = round($product['unit_price'] * $item['quantity'], 2);
            $totalAmount    += $lineTotal;
            $enrichedItems[] = ['product_id' => $item['product_id'], 'quantity' => $item['quantity'], 'unit_price' => $product['unit_price']];
        }

        if ($paymentMethod === 'Credit') {
            $credit = $this->creditRepo->findByRetailerAndDistributor($retailerId, $distributorId);
            if (!$credit) throw new Exception("No credit account found. Please contact your distributor.", 403);
            if ($credit['status'] === 'Blocked') throw new Exception("Your credit account is blocked.", 403);
            if ($totalAmount > (float)$credit['available_credit']) throw new Exception("Order total LKR $totalAmount exceeds available credit LKR {$credit['available_credit']}", 402);
        }

        $orderId = $this->orderRepo->create(['retailer_id' => $retailerId, 'distributor_id' => $distributorId, 'total_amount' => $totalAmount, 'payment_method' => $paymentMethod]);
        $this->orderRepo->createItems($orderId, $enrichedItems);
        $this->notifService->send($distributor['user_id'], "New Order Received", "Order #$orderId placed. Total: LKR $totalAmount");
        return $this->getOrderWithItems($orderId);
    }

    public function modifyOrder(int $orderId, int $retailerId, string $paymentMethod, array $items): array {
        $order = $this->orderRepo->findById($orderId);
        if (!$order || (int)$order['retailer_id'] !== $retailerId) throw new Exception("Order not found", 404);
        if (!$this->isEditable($order)) throw new Exception("Order lock window has expired.", 403);
        $distributorId = (int)$order['distributor_id'];
        $enrichedItems = []; $totalAmount = 0.0;
        foreach ($items as $item) {
            $catalog = $this->productRepo->getCatalogForDistributor($distributorId, 0);
            $product = null;
            foreach ($catalog as $p) { if ((int)$p['product_id'] === (int)$item['product_id']) { $product = $p; break; } }
            if (!$product) throw new Exception("Product ID {$item['product_id']} not available", 422);
            $totalAmount    += round($product['unit_price'] * $item['quantity'], 2);
            $enrichedItems[] = ['product_id' => $item['product_id'], 'quantity' => $item['quantity'], 'unit_price' => $product['unit_price']];
        }
        $this->orderRepo->deleteItems($orderId);
        $this->orderRepo->createItems($orderId, $enrichedItems);
        $this->orderRepo->updateTotal($orderId, $totalAmount);
        return $this->getOrderWithItems($orderId);
    }

    public function cancelOrder(int $orderId, int $retailerId): void {
        $order = $this->orderRepo->findById($orderId);
        if (!$order || (int)$order['retailer_id'] !== $retailerId) throw new Exception("Order not found", 404);
        if (!$this->isEditable($order)) throw new Exception("Order lock window has expired.", 403);
        $this->orderRepo->delete($orderId);
    }

    public function approveOrder(int $orderId, int $distributorId): array {
        $order = $this->orderRepo->findById($orderId);
        if (!$order || (int)$order['distributor_id'] !== $distributorId) throw new Exception("Order not found", 404);
        $this->applyLockIfExpired($order);
        $order = $this->orderRepo->findById($orderId);
        if ($order['status'] !== 'Processing') throw new Exception("Order must be in 'Processing' status. Current: {$order['status']}", 422);
        $this->orderRepo->updateStatus($orderId, 'Approved');
        $this->deliveryRepo->create($orderId, (float)$order['total_amount']);
        $retailer = $this->retailerRepo->findById((int)$order['retailer_id']);
        if ($retailer) $this->notifService->send($retailer['user_id'], "Order Approved", "Your order #$orderId has been approved.");
        return $this->getOrderWithItems($orderId);
    }

    public function rejectOrder(int $orderId, int $distributorId): void {
        $order = $this->orderRepo->findById($orderId);
        if (!$order || (int)$order['distributor_id'] !== $distributorId) throw new Exception("Order not found", 404);
        $this->applyLockIfExpired($order);
        $order = $this->orderRepo->findById($orderId);
        if ($order['status'] !== 'Processing') throw new Exception("Order must be in 'Processing' status to be rejected. Current: {$order['status']}", 422);
        $this->orderRepo->updateStatus($orderId, 'Rejected');
        $retailer = $this->retailerRepo->findById((int)$order['retailer_id']);
        if ($retailer) $this->notifService->send($retailer['user_id'], "Order Rejected", "Your order #$orderId was rejected.");
    }

    public function isEditable(array $order): bool {
        if ($order['status'] !== 'Pending') return false;
        return time() < strtotime($order['created_at']) + (LOCK_WINDOW_MINUTES * 60);
    }

    public function applyLockIfExpired(array $order): void {
        if ($order['status'] === 'Pending' && !$this->isEditable($order)) {
            $this->orderRepo->updateStatus((int)$order['order_id'], 'Processing');
        }
    }

    public function getOrderWithItems(int $orderId): array {
        $order = $this->orderRepo->findById($orderId);
        if (!$order) throw new Exception("Order not found", 404);
        $this->applyLockIfExpired($order);
        $order = $this->orderRepo->findById($orderId);
        $order['items']    = $this->orderRepo->getItemsByOrder($orderId);
        $order['editable'] = $this->isEditable($order);
        return $order;
    }

    public function getRetailerOrders(int $retailerId): array {
        $orders = $this->orderRepo->getByRetailer($retailerId);
        foreach ($orders as &$order) {
            $this->applyLockIfExpired($order);
            // Only refresh the status field so we don't lose extra joined columns
            $fresh = $this->orderRepo->findById((int)$order['order_id']);
            if ($fresh) $order['status'] = $fresh['status'];
            $order['editable'] = $this->isEditable($order);
        }
        unset($order); // break reference
        return $orders;
    }

    public function getDistributorOrders(int $distributorId, string $status = ''): array {
        $orders = $this->orderRepo->getByDistributor($distributorId, $status);
        foreach ($orders as &$order) {
            // applyLockIfExpired may UPDATE the DB row (Pending → Processing).
            // Only refresh the status field so we don't lose extra joined columns.
            $this->applyLockIfExpired($order);
            $fresh = $this->orderRepo->findById((int)$order['order_id']);
            if ($fresh) $order['status'] = $fresh['status'];
        }
        unset($order); // break reference
        return $orders;
    }
}
