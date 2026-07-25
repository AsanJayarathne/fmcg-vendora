<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../controller/distributor/ProfileController.php';

$user = requireAuth(['DISTRIBUTOR']);
(new ProfileController())->handle($user);
