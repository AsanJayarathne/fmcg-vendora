<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../repository/DriverRepository.php';

$user = requireRole('DRIVER');
$driverRepo = new DriverRepository();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $profile = $driverRepo->findByUserId((int)$user['user_id']);
    if (!$profile) {
        sendError('Driver profile not found', 404);
    }
    sendSuccess($profile);
} elseif ($method === 'PUT') {
    $body = getBody();
    
    $fullName = trim($body['full_name'] ?? '');
    $phone = trim($body['phone'] ?? '');
    $licenseNumber = trim($body['license_number'] ?? '');
    $vehicleNumber = trim($body['vehicle_number'] ?? '');
    
    if (!$fullName) {
        sendError('Full name is required', 400);
    }
    if (!$phone) {
        sendError('Phone number is required', 400);
    }
    if (!$licenseNumber) {
        sendError('License number is required', 400);
    }
    if (!$vehicleNumber) {
        sendError('Vehicle number is required', 400);
    }
    
    try {
        $driverRepo->updateProfile((int)$user['user_id'], $fullName, $phone, $licenseNumber, $vehicleNumber);
        $updated = $driverRepo->findByUserId((int)$user['user_id']);
        sendSuccess($updated, 'Driver profile updated successfully');
    } catch (Exception $e) {
        sendError($e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
