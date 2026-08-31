<?php
require_once __DIR__ . '/../../util/cors.php';
require_once __DIR__ . '/../../util/auth.php';
require_once __DIR__ . '/../../repository/UserRepository.php';
require_once __DIR__ . '/../../repository/RetailerRepository.php';

try {
    $user = requireRole('RETAILER');

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Method not allowed', 405);
    }

    if (!isset($_FILES['avatar']) || empty($_FILES['avatar']['name'])) {
        sendError('No avatar file uploaded', 400);
    }

    $file = $_FILES['avatar'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        sendError('File upload failed with error code: ' . $file['error'], 400);
    }

    // 2 MB maximum size
    $maxBytes = 2 * 1024 * 1024;
    if ($file['size'] > $maxBytes) {
        sendError('Image must be under 2 MB', 400);
    }

    // Allowed MIME types
    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    ];

    $finfo    = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($file['tmp_name']);

    if (!array_key_exists($mimeType, $allowedTypes)) {
        sendError('Only JPG, PNG and WEBP images are allowed', 400);
    }

    $ext       = $allowedTypes[$mimeType];
    $filename  = 'avatar_' . uniqid('', true) . '.' . $ext;
    $uploadDir = __DIR__ . '/../../uploads/avatars/';

    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0777, true);
    }

    $dest = $uploadDir . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        sendError('Could not save avatar file to storage', 500);
    }

    $userRepo = new UserRepository();
    $currentUser = $userRepo->findById((int)$user['user_id']);

    // Clean up old avatar if exists
    if ($currentUser && !empty($currentUser['avatar_url'])) {
        $oldPath = $uploadDir . basename($currentUser['avatar_url']);
        if (file_exists($oldPath) && is_file($oldPath)) {
            @unlink($oldPath);
        }
    }

    // Update DB
    $userRepo->updateAvatar((int)$user['user_id'], $filename);

    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || ($_SERVER['SERVER_PORT'] ?? 80) == 443) ? "https://" : "http://";
    $host     = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $fullUrl  = $protocol . $host . '/fmcg-vendora/backend/uploads/avatars/' . $filename;

    sendSuccess([
        'avatar_url' => $filename,
        'full_url'   => $fullUrl
    ], 'Profile avatar updated successfully');
} catch (Exception $e) {
    sendError($e->getMessage(), $e->getCode() ?: 500);
}
