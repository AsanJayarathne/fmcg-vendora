<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/retailer/GatewayController.php';

$user = requireRole('RETAILER');

(new GatewayController())->initiateSettlement($user);
