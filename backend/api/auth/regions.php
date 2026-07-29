<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/Database.php';
require_once __DIR__ . '/../../util/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $db = Database::getConnection();
    $stmt = $db->query("SELECT region_id, region_name FROM distributor_region ORDER BY region_name");
    $regions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    sendSuccess($regions);
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
