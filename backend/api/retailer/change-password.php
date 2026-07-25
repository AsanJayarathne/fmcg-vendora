<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../util/Database.php';
require_once __DIR__ . '/../../repository/UserRepository.php';

$user = requireRole('RETAILER');

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendError('Method not allowed', 405);
}

$body = getBody();
$currentPassword = $body['current_password'] ?? '';
$newPassword     = $body['new_password'] ?? '';
$confirmPassword = $body['confirm_password'] ?? '';

if (!$currentPassword || !$newPassword || !$confirmPassword) {
    sendError('Current password, new password, and confirmation are required', 400);
}

if ($newPassword !== $confirmPassword) {
    sendError('New password and confirmation do not match', 400);
}

if (strlen($newPassword) < 6) {
    sendError('Password must be at least 6 characters long', 400);
}

try {
    $userRepo = new UserRepository();
    $userRecord = $userRepo->findById($user['user_id']);
    
    if (!$userRecord) {
        sendError('User account not found', 404);
    }
    
    // Verify current password (support both bcrypt and seed sha256 hash)
    $valid = password_verify($currentPassword, $userRecord['password'])
        || hash('sha256', $currentPassword) === $userRecord['password'];
        
    if (!$valid) {
        sendError('Incorrect current password', 400);
    }
    
    // Hash new password and update
    $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
    $db = Database::getConnection();
    $stmt = $db->prepare("UPDATE users SET password = ? WHERE user_id = ?");
    $stmt->execute([$newHash, $user['user_id']]);
    
    sendSuccess(null, 'Password updated successfully');
} catch (Exception $e) {
    sendError($e->getMessage(), 500);
}
