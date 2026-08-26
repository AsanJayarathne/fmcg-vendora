<?php
require_once __DIR__ . '/../util/Database.php';

class PasswordResetRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    /**
     * Store a new password reset token.
     */
    public function createToken(string $email, string $token, string $expiresAt): bool {
        // Invalidate prior unused tokens for this email
        $this->invalidatePreviousTokens($email);

        $stmt = $this->db->prepare("
            INSERT INTO password_resets (email, token, expires_at, used)
            VALUES (?, ?, ?, 0)
        ");
        return $stmt->execute([$email, $token, $expiresAt]);
    }

    /**
     * Find a valid, non-expired, unused token.
     */
    public function findValidToken(string $email, string $token): ?array {
        $stmt = $this->db->prepare("
            SELECT * FROM password_resets 
            WHERE email = ? AND token = ? AND used = 0 AND expires_at > NOW()
            LIMIT 1
        ");
        $stmt->execute([$email, $token]);
        return $stmt->fetch() ?: null;
    }

    /**
     * Mark a reset token as used.
     */
    public function markTokenAsUsed(string $token): bool {
        $stmt = $this->db->prepare("UPDATE password_resets SET used = 1 WHERE token = ?");
        return $stmt->execute([$token]);
    }

    /**
     * Invalidate prior unused tokens.
     */
    public function invalidatePreviousTokens(string $email): void {
        $stmt = $this->db->prepare("UPDATE password_resets SET used = 1 WHERE email = ? AND used = 0");
        $stmt->execute([$email]);
    }

    /**
     * Clean up expired tokens older than 24 hours.
     */
    public function deleteExpiredTokens(): void {
        $this->db->query("DELETE FROM password_resets WHERE expires_at < NOW() - INTERVAL 1 DAY");
    }
}
