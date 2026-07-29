<?php
require_once __DIR__ . '/../../repository/DistributorRepository.php';
require_once __DIR__ . '/../../repository/UserRepository.php';

class ProfileController {
    private DistributorRepository $distributorRepo;
    private UserRepository        $userRepo;

    public function __construct() {
        $this->distributorRepo = new DistributorRepository();
        $this->userRepo        = new UserRepository();
    }

    public function handle(array $user): void {
        $method = $_SERVER['REQUEST_METHOD'];
        try {
            match ($method) {
                'GET'  => $this->getProfile($user),
                'PUT'  => $this->updateProfile($user),
                default => sendError('Method not allowed', 405),
            };
        } catch (Exception $e) {
            sendError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    private function getProfile(array $user): void {
        $distributor = $this->distributorRepo->findByUserId((int)$user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);
        sendSuccess([
            'full_name'       => $distributor['full_name']       ?? '',
            'email'           => $distributor['email']           ?? '',
            'phone'           => $distributor['phone']           ?? '',
            'company_name'    => $distributor['company_name']    ?? '',
            'company_address' => $distributor['company_address'] ?? '',
            'region_name'     => $distributor['region_name']     ?? '',
            'status'          => $distributor['status']          ?? '',
        ]);
    }

    private function updateProfile(array $user): void {
        $action = $_GET['action'] ?? '';

        if ($action === 'change_password') {
            $this->changePassword($user);
            return;
        }

        $body = getBody();
        $fullName       = trim($body['full_name']       ?? '');
        $phone          = trim($body['phone']           ?? '');
        $companyName    = trim($body['company_name']    ?? '');
        $companyAddress = trim($body['company_address'] ?? '');

        if (!$fullName) sendError('Full name is required', 400);

        $distributor = $this->distributorRepo->findByUserId((int)$user['user_id']);
        if (!$distributor) sendError('Distributor profile not found', 404);

        // Update user table
        $this->userRepo->updateProfile((int)$user['user_id'], $fullName, $phone);

        // Update distributor table
        $this->distributorRepo->updateProfile(
            (int)$distributor['distributor_id'],
            $companyName,
            $companyAddress
        );

        sendSuccess(null, 'Profile updated successfully');
    }

    private function changePassword(array $user): void {
        $body        = getBody();
        $oldPassword = $body['old_password'] ?? '';
        $newPassword = $body['new_password'] ?? '';

        if (!$oldPassword || !$newPassword) {
            sendError('Old password and new password are required', 400);
        }
        if (strlen($newPassword) < 6) {
            sendError('New password must be at least 6 characters', 400);
        }

        // Verify old password
        $userRow = $this->userRepo->findById((int)$user['user_id']);
        if (!$userRow || !password_verify($oldPassword, $userRow['password'])) {
            sendError('Current password is incorrect', 401);
        }

        $this->userRepo->updatePassword((int)$user['user_id'], password_hash($newPassword, PASSWORD_DEFAULT));
        sendSuccess(null, 'Password updated successfully');
    }
}
