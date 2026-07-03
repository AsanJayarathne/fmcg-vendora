<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/distributor/CreditController.php';
$user = requireRole('DISTRIBUTOR');
(new CreditController())->handle($user);
