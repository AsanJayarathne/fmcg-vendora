<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/admin/AnalyticsController.php';

requireRole('SUPER_ADMIN');
(new AnalyticsController())->handle();
