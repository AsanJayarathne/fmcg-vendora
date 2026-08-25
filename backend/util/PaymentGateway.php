<?php
/**
 * Generic / Mock Payment Gateway Helper for Sandbox & Local Testing
 */
class PaymentGateway {
    private string $merchantId;
    private string $merchantSecret;
    private string $gatewayName;
    private string $currency;

    public function __construct() {
        $this->merchantId     = $_ENV['GATEWAY_MERCHANT_ID'] ?? 'VENDORA_MOCK_MERCHANT';
        $this->merchantSecret = $_ENV['GATEWAY_SECRET']      ?? 'vendora_mock_secret_key_2026';
        $this->gatewayName    = $_ENV['GATEWAY_NAME']        ?? 'Vendora Mock Gateway (Sandbox)';
        $this->currency       = 'LKR';
    }

    /**
     * Generate secure hash signature for checkout initialization
     */
    public function generateSignature(int $orderId, float $amount, string $token): string {
        $data = $this->merchantId . '|' . $orderId . '|' . number_format($amount, 2, '.', '') . '|' . $this->currency . '|' . $token . '|' . $this->merchantSecret;
        return hash('sha256', $data);
    }

    /**
     * Generate secure hash signature for credit debt settlement initialization
     */
    public function generateSettlementSignature(int $creditId, float $amount, string $token): string {
        $data = $this->merchantId . '|CREDIT_' . $creditId . '|' . number_format($amount, 2, '.', '') . '|' . $this->currency . '|' . $token . '|' . $this->merchantSecret;
        return hash('sha256', $data);
    }

    /**
     * Verify callback signature received from payment gateway / webhook
     */
    public function verifyCallbackSignature(?int $orderId, float $amount, string $status, string $token, string $receivedSignature, ?int $creditId = null): bool {
        if ($creditId && !$orderId) {
            $expected = $this->generateSettlementSignature($creditId, $amount, $token);
        } else {
            $expected = $this->generateSignature((int)$orderId, $amount, $token);
        }
        return hash_equals($expected, $receivedSignature);
    }

    /**
     * Generate unique transaction token for orders
     */
    public function generateToken(int $orderId): string {
        return 'GW_TXN_' . $orderId . '_' . time() . '_' . bin2hex(random_bytes(4));
    }

    /**
     * Generate unique transaction token for credit settlements
     */
    public function generateSettlementToken(int $creditId): string {
        return 'GW_CREDIT_' . $creditId . '_' . time() . '_' . bin2hex(random_bytes(4));
    }

    public function getGatewayName(): string {
        return $this->gatewayName;
    }

    public function getCurrency(): string {
        return $this->currency;
    }
}
