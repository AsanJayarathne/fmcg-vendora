<?php
require_once __DIR__ . '/../util/Database.php';

class EmailVerificationRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Create a new OTP code for an email.
     */
    public function createOtp(string $email, string $code, string $expiresAt): bool {
        // Invalidate any existing unused OTPs for this email first
        $this->invalidatePreviousOtps($email);

        $stmt = $this->db->prepare("
            INSERT INTO email_verifications (email, code, attempts, expires_at, used)
            VALUES (?, ?, 0, ?, 0)
        ");
        return $stmt->execute([$email, $code, $expiresAt]);
    }

    /**
     * Find latest active OTP for an email.
     */
    public function findLatestActiveOtp(string $email): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM email_verifications 
            WHERE email = ? AND used = 0 AND expires_at > NOW()
            ORDER BY id DESC LIMIT 1
        ");
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    /**
     * Find the most recent OTP record (used for cooldown checks).
     */
    public function findMostRecent(string $email): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM email_verifications 
            WHERE email = ? 
            ORDER BY id DESC LIMIT 1
        ");
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    /**
     * Increment failed attempt count.
     */
    public function incrementAttempts(int $id): void {
        $stmt = $this->db->prepare("UPDATE email_verifications SET attempts = attempts + 1 WHERE id = ?");
        $stmt->execute([$id]);
    }

    /**
     * Mark OTP as used upon successful verification.
     */
    public function markOtpAsUsed(int $id): bool {
        $stmt = $this->db->prepare("UPDATE email_verifications SET used = 1 WHERE id = ?");
        return $stmt->execute([$id]);
    }

    /**
     * Invalidate all previous unused OTPs for this email.
     */
    public function invalidatePreviousOtps(string $email): void {
        $stmt = $this->db->prepare("UPDATE email_verifications SET used = 1 WHERE email = ? AND used = 0");
        $stmt->execute([$email]);
    }
}
