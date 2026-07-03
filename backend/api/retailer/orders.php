<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/retailer/OrderController.php';
$user = requireRole('RETAILER');
(new OrderController())->handle($user);