<?php
require_once __DIR__ . '/../util/PaymentGateway.php';
require_once __DIR__ . '/../repository/GatewayPaymentRepository.php';
require_once __DIR__ . '/../repository/OrderRepository.php';
require_once __DIR__ . '/../repository/CreditRepository.php';
require_once __DIR__ . '/../repository/RetailerRepository.php';
require_once __DIR__ . '/../repository/DistributorRepository.php';
require_once __DIR__ . '/../service/NotificationService.php';

class PaymentGatewayService {
    private PaymentGateway           $gateway;
    private GatewayPaymentRepository $gwRepo;
    private OrderRepository          $orderRepo;
    private CreditRepository         $creditRepo;
    private RetailerRepository       $retailerRepo;
    private DistributorRepository    $distributorRepo;
    private NotificationService      $notifService;

    public function __construct() {
        $this->gateway         = new PaymentGateway();
        $this->gwRepo          = new GatewayPaymentRepository();
        $this->orderRepo       = new OrderRepository();
        $this->creditRepo      = new CreditRepository();
        $this->retailerRepo    = new RetailerRepository();
        $this->distributorRepo = new DistributorRepository();
        $this->notifService    = new NotificationService();
    }

    public function initiatePayment(int $retailerId, int $orderId): array {
        $order = $this->orderRepo->findById($orderId);
        if (!$order || (int)$order['retailer_id'] !== $retailerId) {
            throw new Exception("Order #{$orderId} not found", 404);
        }

        $total = (float)$order['total_amount'];
        $credit = (float)($order['credit_amount'] ?? 0);
        $onlinePayable = round($total - $credit, 2);

        if ($onlinePayable <= 0) {
            throw new Exception("Order has no remaining online balance to pay.", 400);
        }

        $token = $this->gateway->generateToken($orderId);
        $signature = $this->gateway->generateSignature($orderId, $onlinePayable, $token);

        $gwId = $this->gwRepo->create(
            $orderId,
            $retailerId,
            (int)$order['distributor_id'],
            $onlinePayable,
            $token,
            $signature,
            $this->gateway->getGatewayName()
        );

        return [
            'gateway_payment_id' => $gwId,
            'order_id'           => $orderId,
            'amount'             => $onlinePayable,
            'currency'           => 'LKR',
            'transaction_token'  => $token,
            'signature'          => $signature,
            'gateway_name'       => $this->gateway->getGatewayName(),
            'merchant_id'        => $_ENV['GATEWAY_MERCHANT_ID'] ?? 'VENDORA_MOCK_MERCHANT',
            'shop_name'          => $order['shop_name'] ?? 'Retailer',
            'distributor_name'   => $order['distributor_name'] ?? 'Distributor',
        ];
    }

    public function processCallback(string $token, string $status, string $gatewayRef, string $signature, array $payload = []): array {
        $gwRecord = $this->gwRepo->findByToken($token);
        if (!$gwRecord) {
            throw new Exception("Transaction token invalid or expired", 404);
        }

        $orderId = (int)$gwRecord['order_id'];
        $amount  = (float)$gwRecord['amount'];

        // Verify HMAC/MD5 signature
        $isValidSig = $this->gateway->verifyCallbackSignature($orderId, $amount, $status, $token, $signature);
        if (!$isValidSig) {
            $this->gwRepo->updateStatus((int)$gwRecord['id'], 'FAILED', $gatewayRef, json_encode(['error' => 'Invalid signature', 'payload' => $payload]));
            throw new Exception("Payment gateway signature verification failed.", 403);
        }

        $newStatus = (strtoupper($status) === 'SUCCESS' || strtoupper($status) === 'PAID') ? 'SUCCESS' : 'FAILED';
        $this->gwRepo->updateStatus((int)$gwRecord['id'], $newStatus, $gatewayRef, json_encode($payload));

        $order = $this->orderRepo->findById($orderId);
        if ($newStatus === 'SUCCESS') {
            $this->orderRepo->updatePaymentStatus($orderId, 'Paid');

            // Record in payment table
            $retailer  = $this->retailerRepo->findById((int)$gwRecord['retailer_id']);
            $receivedBy = $retailer ? (int)$retailer['user_id'] : 1;
            
            $this->orderRepo->recordPayment(
                (int)$gwRecord['retailer_id'],
                (int)$gwRecord['distributor_id'],
                $orderId,
                $amount,
                'Online',
                $gatewayRef ?: $token,
                $receivedBy
            );

            // Handle credit portion if split payment (Online_Credit)
            if ($order && $order['payment_method'] === 'Online_Credit' && (float)$order['credit_amount'] > 0) {
                $creditObj = $this->creditRepo->findByRetailerAndDistributor((int)$gwRecord['retailer_id'], (int)$gwRecord['distributor_id']);
                if ($creditObj) {
                    $creditId = (int)$creditObj['credit_id'];
                    $cAmount  = (float)$order['credit_amount'];
                    $this->creditRepo->debit($creditId, $cAmount);
                    $freshCredit = $this->creditRepo->findById($creditId);
                    $this->creditRepo->addTransaction(
                        $creditId,
                        'Debit',
                        $cAmount,
                        (float)$freshCredit['current_balance'],
                        "Order #{$orderId} Split Payment (Credit Portion)",
                        $orderId,
                        null,
                        $receivedBy
                    );
                }
            }

            // Notifications
            $distributor = $this->distributorRepo->findById((int)$gwRecord['distributor_id']);
            if ($distributor) {
                $this->notifService->send($distributor['user_id'], "Online Payment Received", "Order #{$orderId} paid online (LKR " . number_format($amount, 2) . "). Ref: " . ($gatewayRef ?: $token));
            }
            if ($retailer) {
                $this->notifService->send($retailer['user_id'], "Payment Successful", "Your online payment of LKR " . number_format($amount, 2) . " for Order #{$orderId} was successful.");
            }
        } else {
            $this->orderRepo->updatePaymentStatus($orderId, 'Failed');
        }

        return [
            'order_id'    => $orderId,
            'status'      => $newStatus,
            'gateway_ref' => $gatewayRef ?: $token,
            'amount'      => $amount,
        ];
    }

    public function getPaymentStatus(int $orderId): array {
        $gwRecord = $this->gwRepo->findLatestByOrderId($orderId);
        $order    = $this->orderRepo->findById($orderId);

        return [
            'order_id'       => $orderId,
            'payment_status' => $order['payment_status'] ?? 'Unpaid',
            'payment_method' => $order['payment_method'] ?? 'Cash',
            'gateway_record' => $gwRecord,
        ];
    }
}
