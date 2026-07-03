<?php
require_once __DIR__ . '/../../repository/CreditRepository.php';
require_once __DIR__ . '/../../repository/DistributorRepository.php';
class CreditController {
    private CreditRepository      $creditRepo;
    private DistributorRepository $distributorRepo;
    public function __construct() { $this->creditRepo = new CreditRepository(); $this->distributorRepo = new DistributorRepository(); }
    public function handle(array $user): void {
        $distributor = $this->distributorRepo->findByUserId($user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);
        $distributorId = (int)$distributor['distributor_id'];
        $method = $_SERVER['REQUEST_METHOD'];
        try { match ($method) { 'GET' => $this->getAccounts($distributorId), 'POST' => $this->createAccount($distributorId), 'PUT' => $this->updateAccount($distributorId), default => sendError('Method not allowed', 405) }; }
        catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function getAccounts(int $distributorId): void {
        $retailerId = (int)($_GET['retailer_id'] ?? 0);
        if ($retailerId) { $c = $this->creditRepo->findByRetailerAndDistributor($retailerId, $distributorId); if (!$c) sendError('Credit account not found', 404); $c['transactions'] = $this->creditRepo->getTransactions((int)$c['credit_id']); sendSuccess($c); }
        sendSuccess($this->creditRepo->getByDistributor($distributorId));
    }
    private function createAccount(int $distributorId): void {
        $body = getBody(); $retailerId = (int)($body['retailer_id'] ?? 0); $limit = (float)($body['credit_limit'] ?? 0);
        if (!$retailerId || $limit <= 0) sendError('retailer_id and credit_limit required', 400);
        $id = $this->creditRepo->create($retailerId, $distributorId, $limit);
        sendSuccess(['credit_id' => $id], 'Credit account created', 201);
    }
    private function updateAccount(int $distributorId): void {
        $id = (int)($_GET['id'] ?? 0); $action = $_GET['action'] ?? ''; $body = getBody();
        if (!$id) sendError('Credit account ID required', 400);
        $credit = $this->creditRepo->findById($id);
        if (!$credit || (int)$credit['distributor_id'] !== $distributorId) sendError('Credit account not found', 404);
        match ($action) { 'block' => $this->creditRepo->setStatus($id, 'Blocked'), 'unblock' => $this->creditRepo->setStatus($id, 'Active'), default => $this->creditRepo->updateLimit($id, (float)($body['credit_limit'] ?? 0)) };
        sendSuccess(null, 'Updated');
    }
}
