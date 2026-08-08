<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/retailer/GatewayController.php';

// Public endpoint invoked by Payment Gateway Sandbox or webhook
(new GatewayController())->processCallback();
