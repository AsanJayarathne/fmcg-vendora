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
            'payment_type'       => 'ORDER',
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

    public function initiateCreditSettlement(int $retailerId, int $creditId, float $amount): array {
        $account = $this->creditRepo->findById($creditId);
        if (!$account || (int)$account['retailer_id'] !== $retailerId) {
            throw new Exception("Credit account #{$creditId} not found or access denied.", 404);
        }

        $currentBalance = (float)$account['current_balance'];
        if ($currentBalance <= 0) {
            throw new Exception("This credit account has no outstanding debt to settle.", 400);
        }

        // Strict validation: Must pay full outstanding debt
        if (round($amount, 2) !== round($currentBalance, 2)) {
            throw new Exception("Partial settlement is not allowed. Full balance of LKR " . number_format($currentBalance, 2) . " must be settled.", 400);
        }

        $settleAmount = round($currentBalance, 2);
        $token = $this->gateway->generateSettlementToken($creditId);
        $signature = $this->gateway->generateSettlementSignature($creditId, $settleAmount, $token);

        $gwId = $this->gwRepo->createSettlement(
            $creditId,
            $retailerId,
            (int)$account['distributor_id'],
            $settleAmount,
            $token,
            $signature,
            $this->gateway->getGatewayName()
        );

        $retailer = $this->retailerRepo->findById($retailerId);
        $distributor = $this->distributorRepo->findById((int)$account['distributor_id']);

        return [
            'gateway_payment_id' => $gwId,
            'credit_id'          => $creditId,
            'payment_type'       => 'CREDIT_SETTLEMENT',
            'amount'             => $settleAmount,
            'currency'           => 'LKR',
            'transaction_token'  => $token,
            'signature'          => $signature,
            'gateway_name'       => $this->gateway->getGatewayName(),
            'merchant_id'        => $_ENV['GATEWAY_MERCHANT_ID'] ?? 'VENDORA_MOCK_MERCHANT',
            'shop_name'          => $retailer['shop_name'] ?? 'Retailer',
            'distributor_name'   => $distributor['company_name'] ?? 'Distributor',
        ];
    }

    public function processCallback(string $token, string $status, string $gatewayRef, string $signature, array $payload = []): array {
        $gwRecord = $this->gwRepo->findByToken($token);
        if (!$gwRecord) {
            throw new Exception("Transaction token invalid or expired", 404);
        }

        $orderId  = !empty($gwRecord['order_id']) ? (int)$gwRecord['order_id'] : null;
        $creditId = !empty($gwRecord['credit_id']) ? (int)$gwRecord['credit_id'] : null;
        $amount   = (float)$gwRecord['amount'];
        $paymentType = $gwRecord['payment_type'] ?? ($creditId ? 'CREDIT_SETTLEMENT' : 'ORDER');

        // Verify HMAC/MD5 signature
        $isValidSig = $this->gateway->verifyCallbackSignature($orderId, $amount, $status, $token, $signature, $creditId);
        if (!$isValidSig) {
            $this->gwRepo->updateStatus((int)$gwRecord['id'], 'FAILED', $gatewayRef, json_encode(['error' => 'Invalid signature', 'payload' => $payload]));
            throw new Exception("Payment gateway signature verification failed.", 403);
        }

        $newStatus = (strtoupper($status) === 'SUCCESS' || strtoupper($status) === 'PAID') ? 'SUCCESS' : 'FAILED';
        $this->gwRepo->updateStatus((int)$gwRecord['id'], $newStatus, $gatewayRef, json_encode($payload));

        $retailer = $this->retailerRepo->findById((int)$gwRecord['retailer_id']);
        $userId   = $retailer ? (int)$retailer['user_id'] : 1;
        $distributor = $this->distributorRepo->findById((int)$gwRecord['distributor_id']);

        if ($paymentType === 'CREDIT_SETTLEMENT') {
            if ($newStatus === 'SUCCESS') {
                // 1. Credit the account (reduces balance & increases available credit)
                $this->creditRepo->credit($creditId, $amount);

                // 2. Fetch updated balance
                $updatedAccount = $this->creditRepo->findById($creditId);
                $newBalance = $updatedAccount ? (float)$updatedAccount['current_balance'] : 0.00;

                // 3. Record in payment table
                $paymentId = $this->orderRepo->recordPayment(
                    (int)$gwRecord['retailer_id'],
                    (int)$gwRecord['distributor_id'],
                    null,
                    $amount,
                    'Online',
                    $gatewayRef ?: $token,
                    $userId
                );

                // 4. Add audit trail in credit_transaction
                $this->creditRepo->addTransaction(
                    $creditId,
                    'Credit',
                    $amount,
                    $newBalance,
                    "Full Online Debit Settlement (Ref: " . ($gatewayRef ?: $token) . ")",
                    null,
                    $paymentId,
                    $userId
                );

                // 5. Notifications
                if ($distributor) {
                    $this->notifService->send(
                        $distributor['user_id'],
                        "Full Credit Settlement Received",
                        "Retailer '{$retailer['shop_name']}' settled full outstanding debt of LKR " . number_format($amount, 2) . " online. Ref: " . ($gatewayRef ?: $token)
                    );
                }
                if ($retailer) {
                    $this->notifService->send(
                        $retailer['user_id'],
                        "Debt Settlement Confirmed",
                        "Your full online debt settlement of LKR " . number_format($amount, 2) . " was processed. Your credit line is fully restored."
                    );
                }
            }

            return [
                'credit_id'    => $creditId,
                'payment_type' => 'CREDIT_SETTLEMENT',
                'status'       => $newStatus,
                'gateway_ref'  => $gatewayRef ?: $token,
                'amount'       => $amount,
            ];
        }

        // Standard Order Payment Flow
        if ($orderId) {
            if ($newStatus === 'SUCCESS') {
                $this->orderRepo->updatePaymentStatus($orderId, 'Paid');
                $this->orderRepo->updateStatus($orderId, 'Processing');

                // Record in payment table
                $this->orderRepo->recordPayment(
                    (int)$gwRecord['retailer_id'],
                    (int)$gwRecord['distributor_id'],
                    $orderId,
                    $amount,
                    'Online',
                    $gatewayRef ?: $token,
                    $userId
                );

                // Notifications
                if ($distributor) {
                    $this->notifService->send($distributor['user_id'], "Online Payment Received", "Order #{$orderId} paid online (LKR " . number_format($amount, 2) . "). Ref: " . ($gatewayRef ?: $token));
                }
                if ($retailer) {
                    $this->notifService->send($retailer['user_id'], "Payment Successful", "Your online payment of LKR " . number_format($amount, 2) . " for Order #{$orderId} was successful.");
                }
            } else {
                $this->orderRepo->updatePaymentStatus($orderId, 'Failed');
            }
        }

        return [
            'order_id'     => $orderId,
            'payment_type' => 'ORDER',
            'status'       => $newStatus,
            'gateway_ref'  => $gatewayRef ?: $token,
            'amount'       => $amount,
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
