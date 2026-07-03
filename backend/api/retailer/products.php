<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/retailer/ProductController.php';
$user = requireRole('RETAILER');
(new ProductController())->handle($user);
