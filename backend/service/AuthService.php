<?php
require_once __DIR__ . '/../util/Database.php';
require_once __DIR__ . '/../util/Mailer.php';
require_once __DIR__ . '/../repository/UserRepository.php';
require_once __DIR__ . '/../repository/TokenRepository.php';
require_once __DIR__ . '/../repository/DistributorRepository.php';
require_once __DIR__ . '/../repository/RetailerRepository.php';
require_once __DIR__ . '/../repository/DriverRepository.php';
require_once __DIR__ . '/../repository/EmailVerificationRepository.php';
require_once __DIR__ . '/../repository/PasswordResetRepository.php';

class AuthService {
    private UserRepository            $userRepo;
    private TokenRepository           $tokenRepo;
    private DistributorRepository     $distributorRepo;
    private RetailerRepository        $retailerRepo;
    private DriverRepository          $driverRepo;
    private EmailVerificationRepository $emailVerifyRepo;
    private PasswordResetRepository   $passwordResetRepo;
    private Mailer                    $mailer;

    public function __construct() {
        $this->userRepo          = new UserRepository();
        $this->tokenRepo         = new TokenRepository();
        $this->distributorRepo   = new DistributorRepository();
        $this->retailerRepo      = new RetailerRepository();
        $this->driverRepo        = new DriverRepository();
        $this->emailVerifyRepo   = new EmailVerificationRepository();
        $this->passwordResetRepo = new PasswordResetRepository();
        $this->mailer            = new Mailer();
    }

    // ─── Authentication ──────────────────────────────────────────────────────

    public function login(string $email, string $password): array {
        $user = $this->userRepo->findByEmail($email);
        if (!$user) throw new Exception("Invalid email or password", 401);

        // Check if email has been verified
        if (isset($user['is_email_verified']) && (int)$user['is_email_verified'] === 0) {
            throw new Exception("Please verify your email address before logging in.", 403);
        }

        if (!$user['is_active']) {
            throw new Exception("Your account is pending approval or has been deactivated.", 403);
        }

        // Support both bcrypt and SHA2 (legacy seed data uses SHA2)
        $validPassword = password_verify($password, $user['password'])
            || hash('sha256', $password) === $user['password'];
        if (!$validPassword) throw new Exception("Invalid email or password", 401);

        $this->tokenRepo->deleteExpiredForUser($user['user_id']);
        $token = bin2hex(random_bytes(32));
        $this->tokenRepo->save($user['user_id'], $token, $user['role_name']);
        $profileId = $this->getProfileId($user['user_id'], $user['role_name']);

        return [
            'token'      => $token,
            'user_id'    => $user['user_id'],
            'role'       => $user['role_name'],
            'full_name'  => $user['full_name'],
            'email'      => $user['email'],
            'profile_id' => $profileId,
            'avatar_url' => $user['avatar_url'] ?? null,
        ];
    }

    public function logout(string $token): void {
        $this->tokenRepo->deleteByToken($token);
    }

    // ─── Registration with Email OTP ─────────────────────────────────────────

    public function registerRetailer(array $userData, array $profileData): array {
        $db = Database::getConnection();
        $db->beginTransaction();
        try {
            if ($this->userRepo->findByEmail($userData['email'])) {
                throw new Exception("Email is already registered", 400);
            }
            $userData['role_id']           = 3;     // RETAILER
            $userData['is_active']         = false; // Inactive until Distributor approves
            $userData['is_email_verified'] = false; // Requires OTP confirmation

            $userId = $this->userRepo->create($userData);
            $this->retailerRepo->create($userId, $profileData);

            // Generate 6-digit OTP
            $otpCode   = sprintf('%06d', random_int(100000, 999999));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));
            $this->emailVerifyRepo->createOtp($userData['email'], $otpCode, $expiresAt);

            // Send Verification Email
            $this->mailer->sendVerificationOtp($userData['email'], $userData['full_name'], $otpCode);

            $db->commit();
            return [
                'user_id'               => $userId,
                'email'                 => $userData['email'],
                'requires_verification' => true
            ];
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public function registerDistributor(array $userData, array $profileData): array {
        $db = Database::getConnection();
        $db->beginTransaction();
        try {
            if ($this->userRepo->findByEmail($userData['email'])) {
                throw new Exception("Email is already registered", 400);
            }
            $userData['role_id']           = 2;     // DISTRIBUTOR
            $userData['is_active']         = false; // Inactive until Admin approves
            $userData['is_email_verified'] = false;

            $userId = $this->userRepo->create($userData);
            $this->distributorRepo->create($userId, $profileData);

            $otpCode   = sprintf('%06d', random_int(100000, 999999));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));
            $this->emailVerifyRepo->createOtp($userData['email'], $otpCode, $expiresAt);

            $this->mailer->sendVerificationOtp($userData['email'], $userData['full_name'], $otpCode);

            $db->commit();
            return [
                'user_id'               => $userId,
                'email'                 => $userData['email'],
                'requires_verification' => true
            ];
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public function registerDriver(array $userData, array $profileData): array {
        $db = Database::getConnection();
        $db->beginTransaction();
        try {
            if ($this->userRepo->findByEmail($userData['email'])) {
                throw new Exception("Email is already registered", 400);
            }
            $userData['role_id']           = 4;     // DRIVER
            $userData['is_active']         = false; // Inactive until Distributor approves
            $userData['is_email_verified'] = false;

            $userId = $this->userRepo->create($userData);
            $this->driverRepo->create($userId, $profileData);

            $otpCode   = sprintf('%06d', random_int(100000, 999999));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));
            $this->emailVerifyRepo->createOtp($userData['email'], $otpCode, $expiresAt);

            $this->mailer->sendVerificationOtp($userData['email'], $userData['full_name'], $otpCode);

            $db->commit();
            return [
                'user_id'               => $userId,
                'email'                 => $userData['email'],
                'requires_verification' => true
            ];
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    // ─── Email OTP Verification Flow ─────────────────────────────────────────

    public function verifyEmailOtp(string $email, string $code): array {
        $email = trim($email);
        $code  = trim($code);

        if (!$email || !$code) {
            throw new Exception("Email and verification code are required", 400);
        }

        $otpRecord = $this->emailVerifyRepo->findLatestActiveOtp($email);
        if (!$otpRecord) {
            throw new Exception("Invalid or expired verification code. Please request a new code.", 400);
        }

        // Rate limit: Max 5 failed attempts per OTP
        if ((int)$otpRecord['attempts'] >= 5) {
            $this->emailVerifyRepo->markOtpAsUsed((int)$otpRecord['id']);
            throw new Exception("Too many incorrect attempts. This code has expired. Please request a new code.", 429);
        }

        // Timing-safe comparison
        if (!hash_equals($otpRecord['code'], $code)) {
            $this->emailVerifyRepo->incrementAttempts((int)$otpRecord['id']);
            $remaining = 4 - (int)$otpRecord['attempts'];
            $msg = $remaining > 0 
                ? "Incorrect verification code. {$remaining} attempts remaining." 
                : "Incorrect verification code. Code expired due to too many failed attempts.";
            throw new Exception($msg, 400);
        }

        // Mark OTP as used and mark user email as verified
        $this->emailVerifyRepo->markOtpAsUsed((int)$otpRecord['id']);
        $this->userRepo->setEmailVerifiedByEmail($email);

        return [
            'verified' => true,
            'email'    => $email,
            'message'  => 'Email verified successfully! You may now log in or wait for account approval.'
        ];
    }

    public function resendVerificationOtp(string $email): array {
        $email = trim($email);
        if (!$email) throw new Exception("Email is required", 400);

        $user = $this->userRepo->findByEmail($email);
        if (!$user) {
            // Anti-enumeration: still return success message
            return ['sent' => true, 'message' => 'If this email is registered, a new verification code has been sent.'];
        }

        if (isset($user['is_email_verified']) && (int)$user['is_email_verified'] === 1) {
            return ['already_verified' => true, 'message' => 'Your email is already verified. Please log in.'];
        }

        // Check 60-second cooldown
        $recent = $this->emailVerifyRepo->findMostRecent($email);
        if ($recent && !empty($recent['created_at'])) {
            $timeSince = time() - strtotime($recent['created_at']);
            if ($timeSince < 60) {
                $waitSec = 60 - $timeSince;
                throw new Exception("Please wait {$waitSec} seconds before requesting a new code.", 429);
            }
        }

        $otpCode   = sprintf('%06d', random_int(100000, 999999));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));
        $this->emailVerifyRepo->createOtp($email, $otpCode, $expiresAt);

        $this->mailer->sendVerificationOtp($email, $user['full_name'], $otpCode);

        return [
            'sent'    => true,
            'message' => 'A fresh verification code has been sent to your email address.'
        ];
    }

    // ─── Forgot & Reset Password Flow ────────────────────────────────────────

    public function forgotPassword(string $email, ?string $portalUrl = null): array {
        $email = trim($email);
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("A valid email address is required", 400);
        }

        $user = $this->userRepo->findByEmail($email);
        if ($user) {
            // Generate cryptographically secure token
            $token     = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+15 minutes'));
            $this->passwordResetRepo->createToken($email, $token, $expiresAt);

            // Determine frontend portal URL fallback based on user role
            $baseUrl = rtrim($portalUrl ?: $this->getDefaultPortalUrl($user['role_name']), '/');
            $resetLink = "{$baseUrl}/reset-password?token={$token}&email=" . urlencode($email);

            // Dispatch reset email
            $this->mailer->sendPasswordReset($email, $user['full_name'], $resetLink);
        }

        // Always return generic success to prevent account enumeration
        return [
            'sent'    => true,
            'message' => 'If this email is registered with Vendora FMCG, a password reset link has been sent.'
        ];
    }

    public function verifyResetToken(string $email, string $token): array {
        $email = trim($email);
        $token = trim($token);

        if (!$email || !$token) {
            throw new Exception("Invalid reset link parameters.", 400);
        }

        $record = $this->passwordResetRepo->findValidToken($email, $token);
        if (!$record) {
            throw new Exception("This password reset link is invalid or has expired. Please request a new one.", 400);
        }

        return [
            'valid' => true,
            'email' => $email
        ];
    }

    public function resetPassword(string $email, string $token, string $newPassword): array {
        $email = trim($email);
        $token = trim($token);

        if (!$email || !$token) {
            throw new Exception("Invalid reset parameters.", 400);
        }

        if (strlen($newPassword) < 6) {
            throw new Exception("New password must be at least 6 characters long.", 400);
        }

        $record = $this->passwordResetRepo->findValidToken($email, $token);
        if (!$record) {
            throw new Exception("This password reset link is invalid or has expired. Please request a new one.", 400);
        }

        $user = $this->userRepo->findByEmail($email);
        if (!$user) {
            throw new Exception("User account not found.", 404);
        }

        // Hash new password using bcrypt
        $passwordHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $this->userRepo->updatePassword((int)$user['user_id'], $passwordHash);

        // Mark token as used (single-use enforcement)
        $this->passwordResetRepo->markTokenAsUsed($token);

        // Invalidate all active user sessions across devices
        $this->tokenRepo->deleteAllForUser((int)$user['user_id']);

        return [
            'success' => true,
            'message' => 'Password has been reset successfully. Please log in with your new password.'
        ];
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function getDefaultPortalUrl(string $role): string {
        $env = parse_ini_file(__DIR__ . '/../.env') ?: [];
        return match ($role) {
            'RETAILER'    => $env['FRONTEND_RETAILER_URL']    ?? 'http://localhost:5173',
            'DISTRIBUTOR' => $env['FRONTEND_DISTRIBUTOR_URL'] ?? 'http://localhost:5174',
            'DRIVER'      => $env['FRONTEND_DRIVER_URL']      ?? 'http://localhost:5175',
            'ADMIN'       => $env['FRONTEND_ADMIN_URL']       ?? 'http://localhost:5176',
            default       => 'http://localhost:5173',
        };
    }

    private function getProfileId(int $userId, string $role): ?int {
        return match ($role) {
            'DISTRIBUTOR' => $this->distributorRepo->findByUserId($userId)['distributor_id'] ?? null,
            'RETAILER'    => $this->retailerRepo->findByUserId($userId)['retailer_id']        ?? null,
            'DRIVER'      => $this->driverRepo->findByUserId($userId)['driver_id']             ?? null,
            default       => null,
        };
    }
}
