<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/admin/ProductController.php';
requireRole('SUPER_ADMIN');
(new ProductController())->handle();
