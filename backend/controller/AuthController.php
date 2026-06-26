<?php
require_once __DIR__ . '/../service/AuthService.php';
class AuthController {
    private AuthService $authService;
    public function __construct() { $this->authService = new AuthService(); }
    public function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            match ($method) {
                'POST'   => $this->login(),
                'DELETE' => $this->logout(),
                default  => sendError('Method not allowed', 405),
            };
        } catch (Exception $e) { sendError($e->getMessage(), $e->getCode() ?: 400); }
    }
    private function login(): void {
        $body = getBody();
        $email    = trim($body['email']    ?? '');
        $password = $body['password'] ?? '';
        if (!$email || !$password) sendError('Email and password are required', 400);
        sendSuccess($this->authService->login($email, $password), 'Login successful');
    }
    private function logout(): void {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token  = trim(str_replace('Bearer ', '', $header));
        if ($token) $this->authService->logout($token);
        sendSuccess(null, 'Logged out successfully');
    }
}
