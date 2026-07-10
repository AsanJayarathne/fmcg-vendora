<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/distributor/ProductController.php';
$user = requireRole('DISTRIBUTOR');
(new ProductController())->handle($user);
