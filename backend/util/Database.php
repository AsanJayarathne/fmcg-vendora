<?php
// ============================================================
// Database Utility — PDO Singleton
// One connection shared across the entire request lifecycle
// ============================================================

class Database {
    private static ?PDO $instance = null;

    private function __construct() {}   // Prevent direct instantiation

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host   = 'localhost';
            $dbname = 'vendora_fmcg';
            $user   = 'root';
            $pass   = '';

            try {
                self::$instance = new PDO(
                    "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
                    $user,
                    $pass,
                    [
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES   => false,
                    ]
                );
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Database connection failed']);
                exit();
            }
        }
        return self::$instance;
    }
}
