<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/admin/SupplyController.php';
$user = requireRole('SUPER_ADMIN');
(new SupplyController())->handle($user);
