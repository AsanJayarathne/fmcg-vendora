<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/Database.php';
require_once __DIR__ . '/../../util/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $db = Database::getConnection();
    $stmt = $db->query("SELECT distributor_id, company_name FROM distributor WHERE status = 'Approved' ORDER BY company_name ASC");
    $distributors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    sendSuccess($distributors);
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
