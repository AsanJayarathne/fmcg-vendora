<?php
require_once __DIR__ . '/../repository/OrderRepository.php';
require_once __DIR__ . '/../repository/ProductRepository.php';
require_once __DIR__ . '/../repository/CreditRepository.php';
require_once __DIR__ . '/../repository/DeliveryRepository.php';
require_once __DIR__ . '/../repository/RetailerRepository.php';
require_once __DIR__ . '/../repository/DistributorRepository.php';
require_once __DIR__ . '/../repository/StockRepository.php';
require_once __DIR__ . '/../service/NotificationService.php';
date_default_timezone_set('Asia/Colombo');

if (!defined('LOCK_WINDOW_MINUTES')) {
    define('LOCK_WINDOW_MINUTES', 15);
}

class OrderService {
    private OrderRepository       $orderRepo;
    private ProductRepository     $productRepo;
    private CreditRepository      $creditRepo;
    private DeliveryRepository    $deliveryRepo;
    private RetailerRepository    $retailerRepo;
    private DistributorRepository $distributorRepo;
    private StockRepository       $stockRepo;
    private NotificationService   $notifService;

    public function __construct() {
        $this->orderRepo       = new OrderRepository();
        $this->productRepo     = new ProductRepository();
        $this->creditRepo      = new CreditRepository();
        $this->deliveryRepo    = new DeliveryRepository();
        $this->retailerRepo    = new RetailerRepository();
        $this->distributorRepo = new DistributorRepository();
        $this->stockRepo       = new StockRepository();
        $this->notifService    = new NotificationService();
    }

    public function placeOrder(int $retailerId, string $paymentMethod, array $items, int $distributorId = 0, float $creditAmount = 0, float $cashAmount = 0): array {
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
            
            $qty = (int)$item['quantity'];
            $discountRate = 0;
            if ($qty >= 56) {
                $discountRate = 15;
            } elseif ($qty >= 32) {
                $discountRate = 10;
            } elseif ($qty >= 8) {
                $discountRate = 5;
            }
            
            $subtotal = $product['unit_price'] * $qty;
            $discount = $subtotal * $discountRate / 100;
            $lineTotal = round($subtotal - $discount, 2);
            $totalAmount += $lineTotal;
            
            $enrichedItems[] = [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $product['unit_price'],
                'total_price' => $lineTotal
            ];
        }

        // Fetch credit account to find previous outstanding balance (if any)
        $creditObj = $this->creditRepo->findByRetailerAndDistributor($retailerId, $distributorId);
        $outstanding = $creditObj ? (float)$creditObj['current_balance'] : 0.0;

        // ── Payment validation ──────────────────────────────────────
        $creditAmount = round((float)$creditAmount, 2);
        $cashAmount   = round((float)$cashAmount, 2);

        $paymentStatus = 'Unpaid';

        if ($paymentMethod === 'Cash') {
            // Full cash — no credit used
            $creditAmount = 0;
            $cashAmount   = $totalAmount;
        } elseif ($paymentMethod === 'Credit') {
            // Full credit — entire order on credit
            if (!$creditObj) throw new Exception("No credit account found. Please contact your distributor.", 403);
            if ($creditObj['status'] === 'Blocked') throw new Exception("Your credit account is blocked.", 403);
            $creditAmount = $totalAmount;
            $cashAmount   = 0;
            if ($creditAmount > (float)$creditObj['available_credit']) {
                throw new Exception("Order total LKR " . number_format($totalAmount, 2) . " exceeds available credit LKR " . number_format($creditObj['available_credit'], 2), 402);
            }
        } elseif ($paymentMethod === 'Cash_Credit') {
            // Split payment — validate amounts
            if (!$creditObj) throw new Exception("No credit account found. Please contact your distributor.", 403);
            if ($creditObj['status'] === 'Blocked') throw new Exception("Your credit account is blocked.", 403);
            if ($creditAmount <= 0) throw new Exception("Credit amount must be greater than 0 for split payment.", 400);
            if ($cashAmount <= 0) throw new Exception("Cash amount must be greater than 0 for split payment.", 400);
            if (abs(($cashAmount + $creditAmount) - $totalAmount) > 0.01) {
                throw new Exception("Cash (LKR " . number_format($cashAmount, 2) . ") + Credit (LKR " . number_format($creditAmount, 2) . ") must equal order total (LKR " . number_format($totalAmount, 2) . ")", 400);
            }
            if ($creditAmount > (float)$creditObj['available_credit']) {
                throw new Exception("Credit amount LKR " . number_format($creditAmount, 2) . " exceeds available credit LKR " . number_format($creditObj['available_credit'], 2), 402);
            }
        } elseif ($paymentMethod === 'Online') {
            // Full Online Gateway Payment
            $creditAmount  = 0;
            $cashAmount    = 0;
            $paymentStatus = 'Pending_Gateway';
        } else {
            throw new Exception("Invalid payment method: $paymentMethod", 400);
        }

        $orderId = $this->orderRepo->create([
            'retailer_id'        => $retailerId,
            'distributor_id'     => $distributorId,
            'total_amount'       => $totalAmount,
            'payment_method'     => $paymentMethod,
            'payment_status'     => $paymentStatus,
            'credit_amount'      => $creditAmount,
            'cash_amount'        => $cashAmount,
            'outstanding_credit' => $outstanding,
        ]);
        $this->orderRepo->createItems($orderId, $enrichedItems);
        $this->notifService->send($distributor['user_id'], "New Order Received", "Order #$orderId placed. Total: LKR $totalAmount");
        return $this->getOrderWithItems($orderId);
    }

    public function modifyOrder(int $orderId, int $retailerId, string $paymentMethod, array $items): array {
        $order = $this->orderRepo->findById($orderId);
        if (!$order || (int)$order['retailer_id'] !== $retailerId) throw new Exception("Order not found", 404);
        if (!$this->isEditable($order)) throw new Exception("Order lock window has expired.", 403);
        $distributorId = (int)$order['distributor_id'];
        $enrichedItems = [];
        $totalAmount = 0.0;
        foreach ($items as $item) {
            $catalog = $this->productRepo->getCatalogForDistributor($distributorId, 0);
            $product = null;
            foreach ($catalog as $p) { if ((int)$p['product_id'] === (int)$item['product_id']) { $product = $p; break; } }
            if (!$product) throw new Exception("Product ID {$item['product_id']} not available", 422);
            
            $qty = (int)$item['quantity'];
            $discountRate = 0;
            if ($qty >= 56) {
                $discountRate = 15;
            } elseif ($qty >= 32) {
                $discountRate = 10;
            } elseif ($qty >= 8) {
                $discountRate = 5;
            }
            
            $subtotal = $product['unit_price'] * $qty;
            $discount = $subtotal * $discountRate / 100;
            $lineTotal = round($subtotal - $discount, 2);
            $totalAmount += $lineTotal;
            
            $enrichedItems[] = [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $product['unit_price'],
                'total_price' => $lineTotal
            ];
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

        // Deduct distributor batch stock via FEFO for each order item
        $items = $this->orderRepo->getItemsByOrder($orderId);
        foreach ($items as $item) {
            $this->stockRepo->deductDistributorStock(
                $distributorId,
                (int)$item['product_id'],
                (int)$item['quantity']
            );
        }

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
        if (($order['payment_status'] ?? '') === 'Paid') return false;
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
            $order['items']    = $this->orderRepo->getItemsByOrder((int)$order['order_id']);
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
            $order['items']    = $this->orderRepo->getItemsByOrder((int)$order['order_id']);
        }
        unset($order); // break reference
        return $orders;
    }
    public function confirmOrder(int $orderId, int $retailerId): void {
        $order = $this->orderRepo->findById($orderId);
        if (!$order || (int)$order['retailer_id'] !== $retailerId) throw new Exception("Order not found", 404);
        if ($order['status'] !== 'Pending') throw new Exception("Order is already locked or processed.", 400);
        $this->orderRepo->updateStatus($orderId, 'Processing');
        
        $distributor = $this->distributorRepo->findById((int)$order['distributor_id']);
        if ($distributor) {
            $this->notifService->send($distributor['user_id'], "Order Confirmed by Retailer", "Retailer has locked order #$orderId for processing.");
        }
    }
}
