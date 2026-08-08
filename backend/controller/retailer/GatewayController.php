<?php
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../service/PaymentGatewayService.php';

class GatewayController {
    private PaymentGatewayService $gwService;

    public function __construct() {
        $this->gwService = new PaymentGatewayService();
    }

    public function handle(array $user, string $action): void {
        try {
            match ($action) {
                'init'     => $this->initiatePayment($user),
                'callback' => $this->processCallback(),
                'status'   => $this->getStatus($user),
                default    => sendError('Invalid action', 400),
            };
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    private function initiatePayment(array $user): void {
        $body = getBody();
        $orderId = (int)($body['order_id'] ?? $_GET['order_id'] ?? $_POST['order_id'] ?? 0);
        if (!$orderId) sendError('Order ID required', 400);

        $retailer = (new RetailerRepository())->findByUserId($user['user_id']);
        if (!$retailer) sendError('Retailer profile not found', 404);

        $sessionData = $this->gwService->initiatePayment((int)$retailer['retailer_id'], $orderId);
        sendSuccess($sessionData, 'Payment initialized');
    }

    public function processCallback(): void {
        $body = getBody();
        $token     = $body['transaction_token'] ?? $_POST['transaction_token'] ?? $_GET['transaction_token'] ?? '';
        $status    = $body['status'] ?? $_POST['status'] ?? $_GET['status'] ?? 'FAILED';
        $gatewayRef = $body['gateway_ref'] ?? $_POST['gateway_ref'] ?? $_GET['gateway_ref'] ?? '';
        $signature  = $body['signature'] ?? $_POST['signature'] ?? $_GET['signature'] ?? '';

        if (!$token || !$signature) {
            sendError('Transaction token and signature required', 400);
        }

        $result = $this->gwService->processCallback($token, $status, $gatewayRef, $signature, $body);
        sendSuccess($result, 'Payment callback processed');
    }

    private function getStatus(array $user): void {
        $orderId = (int)($_GET['order_id'] ?? 0);
        if (!$orderId) sendError('Order ID required', 400);

        $statusData = $this->gwService->getPaymentStatus($orderId);
        sendSuccess($statusData);
    }
}
