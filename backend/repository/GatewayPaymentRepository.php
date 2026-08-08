<?php
require_once __DIR__ . '/../util/Database.php';

class GatewayPaymentRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(int $orderId, int $retailerId, int $distributorId, float $amount, string $token, string $signature, string $gatewayName = 'Vendora Mock Gateway (Sandbox)'): int {
        $stmt = $this->db->prepare("
            INSERT INTO gateway_payments 
            (order_id, retailer_id, distributor_id, amount, currency, gateway_name, transaction_token, status, signature)
            VALUES (?, ?, ?, ?, 'LKR', ?, ?, 'INITIATED', ?)
        ");
        $stmt->execute([$orderId, $retailerId, $distributorId, $amount, $gatewayName, $token, $signature]);
        return (int)$this->db->lastInsertId();
    }

    public function findByToken(string $token): ?array {
        $stmt = $this->db->prepare("SELECT * FROM gateway_payments WHERE transaction_token = ?");
        $stmt->execute([$token]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function findLatestByOrderId(int $orderId): ?array {
        $stmt = $this->db->prepare("SELECT * FROM gateway_payments WHERE order_id = ? ORDER BY id DESC LIMIT 1");
        $stmt->execute([$orderId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function updateStatus(int $id, string $status, ?string $gatewayRef = null, ?string $responsePayload = null): void {
        $stmt = $this->db->prepare("
            UPDATE gateway_payments 
            SET status = ?, gateway_ref = COALESCE(?, gateway_ref), response_payload = COALESCE(?, response_payload)
            WHERE id = ?
        ");
        $stmt->execute([$status, $gatewayRef, $responsePayload, $id]);
    }
}
