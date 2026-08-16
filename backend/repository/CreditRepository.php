<?php
require_once __DIR__ . '/../util/Database.php';
class CreditRepository {
    private PDO $db;
    public function __construct() { $this->db = Database::getConnection(); }

    public function findByRetailerAndDistributor(int $retailerId, int $distributorId): ?array {
        $stmt = $this->db->prepare("SELECT ca.*, d.company_name AS distributor_name FROM credit_account ca JOIN distributor d ON d.distributor_id = ca.distributor_id WHERE ca.retailer_id = ? AND ca.distributor_id = ?");
        $stmt->execute([$retailerId, $distributorId]); return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
    public function getAllByRetailer(int $retailerId): array {
        $stmt = $this->db->prepare("SELECT ca.*, d.company_name AS distributor_name FROM credit_account ca JOIN distributor d ON d.distributor_id = ca.distributor_id WHERE ca.retailer_id = ? ORDER BY d.company_name");
        $stmt->execute([$retailerId]); return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function findById(int $creditId): ?array {
        $stmt = $this->db->prepare("SELECT * FROM credit_account WHERE credit_id = ?");
        $stmt->execute([$creditId]); return $stmt->fetch() ?: null;
    }
    public function getByDistributor(int $distributorId): array {
        $stmt = $this->db->prepare("SELECT ca.*, r.shop_name, r.owner_name FROM credit_account ca JOIN retailer r ON r.retailer_id = ca.retailer_id WHERE ca.distributor_id = ? ORDER BY r.shop_name");
        $stmt->execute([$distributorId]); return $stmt->fetchAll();
    }
    public function create(int $retailerId, int $distributorId, float $creditLimit): int {
        $stmt = $this->db->prepare("INSERT INTO credit_account (retailer_id, distributor_id, credit_limit, current_balance, available_credit) VALUES (?, ?, ?, 0.00, ?)");
        $stmt->execute([$retailerId, $distributorId, $creditLimit, $creditLimit]); return (int)$this->db->lastInsertId();
    }
    public function updateLimit(int $creditId, float $limit): void {
        $this->db->prepare("UPDATE credit_account SET credit_limit = ?, available_credit = GREATEST(0, ? - current_balance) WHERE credit_id = ?")->execute([$limit, $limit, $creditId]);
    }
    public function setStatus(int $creditId, string $status): void {
        $this->db->prepare("UPDATE credit_account SET status = ? WHERE credit_id = ?")->execute([$status, $creditId]);
    }
    public function setDistributorRetailerStatus(int $retailerId, int $distributorId, string $status): void {
        $existing = $this->findByRetailerAndDistributor($retailerId, $distributorId);
        if ($existing) {
            $this->setStatus((int)$existing['credit_id'], $status);
        } else {
            $stmt = $this->db->prepare("INSERT INTO credit_account (retailer_id, distributor_id, credit_limit, current_balance, available_credit, status) VALUES (?, ?, 0.00, 0.00, 0.00, ?)");
            $stmt->execute([$retailerId, $distributorId, $status]);
        }
    }
    public function debit(int $creditId, float $amount): void {
        if ($amount <= 0) return;
        $this->db->prepare("UPDATE credit_account SET current_balance = current_balance + ?, available_credit = GREATEST(0.00, available_credit - ?) WHERE credit_id = ?")->execute([$amount, $amount, $creditId]);
    }
    public function credit(int $creditId, float $amount): void {
        if ($amount <= 0) return;
        $this->db->prepare("UPDATE credit_account SET current_balance = GREATEST(0.00, current_balance - ?), available_credit = LEAST(credit_limit, available_credit + ?) WHERE credit_id = ?")->execute([$amount, $amount, $creditId]);
    }
    public function addTransaction(int $creditId, string $type, float $amount, float $balanceAfter, string $description = '', ?int $orderId = null, ?int $paymentId = null, ?int $createdBy = null): void {
        $this->db->prepare("INSERT INTO credit_transaction (credit_id, order_id, payment_id, transaction_type, amount, balance_after, description, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")->execute([$creditId, $orderId, $paymentId, $type, $amount, $balanceAfter, $description, $createdBy]);
    }
    public function getTransactions(int $creditId): array {
        $stmt = $this->db->prepare("SELECT ct.*, u.full_name AS created_by_name FROM credit_transaction ct LEFT JOIN users u ON u.user_id = ct.created_by WHERE ct.credit_id = ? ORDER BY ct.created_at DESC");
        $stmt->execute([$creditId]); return $stmt->fetchAll();
    }
}
