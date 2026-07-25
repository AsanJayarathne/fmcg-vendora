<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../util/Database.php';
require_once __DIR__ . '/../../repository/RetailerRepository.php';

$user = requireRole('RETAILER');
$retailerRepo = new RetailerRepository();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $profile = $retailerRepo->findByUserId($user['user_id']);
    if (!$profile) {
        sendError('Profile not found', 404);
    }
    sendSuccess($profile);
} elseif ($method === 'PUT') {
    $body = getBody();
    
    $fullName = trim($body['full_name'] ?? '');
    $email = trim($body['email'] ?? '');
    $phone = trim($body['phone'] ?? '');
    
    $shopName = trim($body['shop_name'] ?? '');
    $ownerName = trim($body['owner_name'] ?? '');
    $shopAddress = trim($body['shop_address'] ?? '');
    $city = trim($body['city'] ?? '');
    $nicNumber = trim($body['nic_number'] ?? '');
    $retailerPhone = trim($body['retailer_phone'] ?? '');
    
    if (!$fullName || !$email) {
        sendError('Full name and email are required fields', 400);
    }
    
    $db = Database::getConnection();
    $db->beginTransaction();
    try {
        // Update users table
        $stmt = $db->prepare("UPDATE users SET full_name = ?, email = ?, phone = ? WHERE user_id = ?");
        $stmt->execute([$fullName, $email, $phone, $user['user_id']]);
        
        // Update retailer profile table
        $stmt = $db->prepare("UPDATE retailer SET shop_name = ?, owner_name = ?, shop_address = ?, city = ?, nic_number = ?, phone = ? WHERE user_id = ?");
        $stmt->execute([$shopName, $ownerName, $shopAddress, $city, $nicNumber, $retailerPhone, $user['user_id']]);
        
        $db->commit();
        
        // Fetch updated profile
        $updated = $retailerRepo->findByUserId($user['user_id']);
        sendSuccess($updated, 'Profile updated successfully');
    } catch (Exception $e) {
        $db->rollBack();
        sendError($e->getMessage(), 500);
    }
} else {
    sendError('Method not allowed', 405);
}
