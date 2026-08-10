<?php
require_once __DIR__ . '/../repository/TokenRepository.php';

// Sync PHP timezone with the MySQL server (both must use the same wall-clock time).
// MySQL stores DATETIME without timezone info; strtotime() uses PHP's default timezone
// to parse those values. A mismatch causes the 15-min lock window to never trigger.
date_default_timezone_set('Asia/Colombo'); // IST / UTC+5:30

if (!defined('LOCK_WINDOW_MINUTES')) {
    define('LOCK_WINDOW_MINUTES', 15);
}

function requireAuth(): array {
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$header || !str_starts_with($header, 'Bearer ')) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No token provided']);
        exit();
    }
    $token     = trim(str_replace('Bearer ', '', $header));
    $tokenRepo = new TokenRepository();
    $record    = $tokenRepo->findValid($token);
    if (!$record) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
        exit();
    }
    return ['user_id' => (int)$record['user_id'], 'role' => $record['role_name'], 'token' => $token];
}

function requireRole(string ...$roles): array {
    $user = requireAuth();
    if (!in_array($user['role'], $roles)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Access denied']);
        exit();
    }
    return $user;
}

function getBody(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function sendSuccess(mixed $data, string $message = 'Success', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['success' => true, 'message' => $message, 'data' => $data]);
    exit();
}

function sendError(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit();
}