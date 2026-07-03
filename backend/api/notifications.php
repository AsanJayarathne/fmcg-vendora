<?php
require_once __DIR__ . '/../util/cors.php';
require_once __DIR__ . '/../util/auth.php';
require_once __DIR__ . '/../service/NotificationService.php';
$user    = requireAuth();
$service = new NotificationService();
$method  = $_SERVER['REQUEST_METHOD'];
try {
    if ($method === 'GET') {
        $unreadOnly = isset($_GET['unread']);
        sendSuccess(['notifications' => $service->getForUser($user['user_id'], $unreadOnly), 'unread_count' => $service->countUnread($user['user_id'])]);
    } elseif ($method === 'PUT') {
        $id = (int)($_GET['id'] ?? 0);
        if ($id) { $service->markRead($id, $user['user_id']); } else { $service->markAllRead($user['user_id']); }
        sendSuccess(null, 'Marked as read');
    } else {
        sendError('Method not allowed', 405);
    }
} catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
