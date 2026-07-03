<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../service/DeliveryService.php';
require_once __DIR__ . '/../../repository/RetailerRepository.php';
$user         = requireRole('RETAILER');
$retailerRepo = new RetailerRepository();
$retailer     = $retailerRepo->findByUserId($user['user_id']);
if (!$retailer) sendError('Retailer not found', 404);
try { sendSuccess((new DeliveryService())->getForRetailer((int)$retailer['retailer_id'])); }
catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
