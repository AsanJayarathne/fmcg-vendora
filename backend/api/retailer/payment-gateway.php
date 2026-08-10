<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/retailer/GatewayController.php';

$user = requireRole('RETAILER');
$action = $_GET['action'] ?? 'init';

(new GatewayController())->handle($user, $action);
