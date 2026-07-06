<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/distributor/DriverController.php';
$user = requireRole('DISTRIBUTOR');
(new DriverController())->handle($user);
