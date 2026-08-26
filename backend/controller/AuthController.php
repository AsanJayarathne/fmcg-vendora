<?php
require_once __DIR__ . '/../service/AuthService.php';

class AuthController {
    private AuthService $authService;
    public function __construct() { 
        $this->authService = new AuthService(); 
    }

    // ─── Auth (Login / Logout) ───────────────────────────────────────────────

    public function handle(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            match ($method) {
                'POST'   => $this->login(),
                'DELETE' => $this->logout(),
                default  => sendError('Method not allowed', 405),
            };
        } catch (Exception $e) { 
            sendError($e->getMessage(), $e->getCode() ?: 400); 
        }
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

    // ─── Registration (Public) ───────────────────────────────────────────────

    public function registerRetailer(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);
        try {
            $body = getBody();
            $userData = [
                'full_name' => trim($body['full_name'] ?? ''),
                'email'     => trim($body['email']     ?? ''),
                'phone'     => trim($body['phone']     ?? ''),
                'password'  => $body['password']       ?? '',
            ];
            $profileData = [
                'region_id'    => (int)($body['region_id']    ?? 0),
                'shop_name'    => trim($body['shop_name']     ?? ''),
                'owner_name'   => trim($body['owner_name']    ?? ''),
                'shop_address' => trim($body['shop_address']  ?? ''),
                'city'         => trim($body['city']          ?? ''),
                'nic_number'   => trim($body['nic_number']    ?? ''),
                'phone'        => trim($body['phone']         ?? ''),
                'latitude'     => isset($body['latitude'])  ? (float)$body['latitude']  : null,
                'longitude'    => isset($body['longitude']) ? (float)$body['longitude'] : null,
            ];
            if (!$userData['full_name'] || !$userData['email'] || !$userData['phone'] || !$userData['password']
                || !$profileData['shop_name'] || !$profileData['owner_name'] || !$profileData['shop_address']
                || !$profileData['nic_number'] || !$profileData['region_id']) {
                sendError('Required fields: full_name, email, phone, password, shop_name, owner_name, shop_address, nic_number, region_id', 400);
            }
            $result = $this->authService->registerRetailer($userData, $profileData);
            sendSuccess($result, 'Registration submitted. A 6-digit verification code has been sent to your email.', 201);
        } catch (Exception $e) { 
            sendError($e->getMessage(), $e->getCode() ?: 400); 
        }
    }

    public function registerDistributor(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);
        try {
            $body = getBody();
            $userData = [
                'full_name' => trim($body['full_name'] ?? ''),
                'email'     => trim($body['email']     ?? ''),
                'phone'     => trim($body['phone']     ?? ''),
                'password'  => $body['password']       ?? '',
            ];
            $profileData = [
                'company_name'    => trim($body['company_name']    ?? ''),
                'company_address' => trim($body['company_address'] ?? ''),
                'reg_number'      => trim($body['reg_number']      ?? ''),
                'lic_number'      => trim($body['lic_number']      ?? ''),
                'region_id'       => (int)($body['region_id']      ?? 0),
                'doc_url'         => trim($body['doc_url']         ?? '') ?: null,
            ];
            if (!$userData['full_name'] || !$userData['email'] || !$userData['phone'] || !$userData['password']
                || !$profileData['company_name'] || !$profileData['company_address']
                || !$profileData['reg_number'] || !$profileData['lic_number'] || !$profileData['region_id']) {
                sendError('Required fields: full_name, email, phone, password, company_name, company_address, reg_number, lic_number, region_id', 400);
            }
            $result = $this->authService->registerDistributor($userData, $profileData);
            sendSuccess($result, 'Registration submitted. A 6-digit verification code has been sent to your email.', 201);
        } catch (Exception $e) { 
            sendError($e->getMessage(), $e->getCode() ?: 400); 
        }
    }

    public function registerDriver(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);
        try {
            $body = getBody();
            $userData = [
                'full_name' => trim($body['full_name'] ?? ''),
                'email'     => trim($body['email']     ?? ''),
                'phone'     => trim($body['phone']     ?? ''),
                'password'  => $body['password']       ?? '',
            ];
            $profileData = [
                'distributor_id' => (int)($body['distributor_id'] ?? 0),
                'license_number' => trim($body['license_number']  ?? ''),
                'vehicle_number' => trim($body['vehicle_number']  ?? ''),
            ];
            if (!$userData['full_name'] || !$userData['email'] || !$userData['phone'] || !$userData['password']
                || !$profileData['distributor_id'] || !$profileData['license_number'] || !$profileData['vehicle_number']) {
                sendError('Required fields: full_name, email, phone, password, distributor_id, license_number, vehicle_number', 400);
            }
            $result = $this->authService->registerDriver($userData, $profileData);
            sendSuccess($result, 'Registration submitted. A 6-digit verification code has been sent to your email.', 201);
        } catch (Exception $e) { 
            sendError($e->getMessage(), $e->getCode() ?: 400); 
        }
    }

    // ─── Email OTP Verification Endpoints ────────────────────────────────────

    public function verifyEmail(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);
        try {
            $body  = getBody();
            $email = trim($body['email'] ?? '');
            $code  = trim($body['code']  ?? '');
            if (!$email || !$code) sendError('Email and verification code are required', 400);

            $result = $this->authService->verifyEmailOtp($email, $code);
            sendSuccess($result, $result['message']);
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function resendOtp(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);
        try {
            $body  = getBody();
            $email = trim($body['email'] ?? '');
            if (!$email) sendError('Email is required', 400);

            $result = $this->authService->resendVerificationOtp($email);
            sendSuccess($result, $result['message']);
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    // ─── Forgot & Reset Password Endpoints ───────────────────────────────────

    public function forgotPassword(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);
        try {
            $body      = getBody();
            $email     = trim($body['email'] ?? '');
            $portalUrl = trim($body['portal_url'] ?? '');
            if (!$email) sendError('Email is required', 400);

            $result = $this->authService->forgotPassword($email, $portalUrl ?: null);
            sendSuccess($result, $result['message']);
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function verifyResetToken(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);
        try {
            $body  = getBody();
            $email = trim($body['email'] ?? '');
            $token = trim($body['token'] ?? '');
            if (!$email || !$token) sendError('Token and email are required', 400);

            $result = $this->authService->verifyResetToken($email, $token);
            sendSuccess($result, 'Reset token is valid');
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function resetPassword(): void {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);
        try {
            $body        = getBody();
            $email       = trim($body['email'] ?? '');
            $token       = trim($body['token'] ?? '');
            $newPassword = $body['password'] ?? ($body['new_password'] ?? '');

            if (!$email || !$token || !$newPassword) {
                sendError('Email, token, and new password are required', 400);
            }

            $result = $this->authService->resetPassword($email, $token, $newPassword);
            sendSuccess($result, $result['message']);
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }
}
