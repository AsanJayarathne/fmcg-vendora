<?php
require_once __DIR__ . '/../util/Database.php';

class DriverRepository {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findByUserId(int $userId): ?array {
        $stmt = $this->db->prepare(
            "SELECT dr.*, u.full_name, u.email, u.phone, u.created_at AS user_created_at, u.is_active,
                    d.company_name AS distributor_name, d.company_address AS distributor_address,
                    reg.region_name,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id), 0) AS total_deliveries,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id AND status = 'DELIVERED'), 0) AS successful_deliveries,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id AND status = 'RETURNED'), 0) AS returned_deliveries,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id AND status = 'CLAIMED'), 0) AS pending_deliveries,
                    COALESCE((SELECT SUM(collected_amount) FROM delivery WHERE driver_id = dr.driver_id AND status = 'DELIVERED'), 0) AS total_cash_collected
             FROM driver dr
             JOIN users u ON u.user_id = dr.user_id
             LEFT JOIN distributor d ON d.distributor_id = dr.distributor_id
             LEFT JOIN distributor_region reg ON reg.region_id = d.region_id
             WHERE dr.user_id = ?"
        );
        $stmt->execute([$userId]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $driverId): ?array {
        $stmt = $this->db->prepare(
            "SELECT dr.*, u.full_name, u.email, u.phone, u.created_at AS user_created_at, u.is_active,
                    d.company_name AS distributor_name, d.company_address AS distributor_address,
                    reg.region_name,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id), 0) AS total_deliveries,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id AND status = 'DELIVERED'), 0) AS successful_deliveries,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id AND status = 'RETURNED'), 0) AS returned_deliveries,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id AND status = 'CLAIMED'), 0) AS pending_deliveries,
                    COALESCE((SELECT SUM(collected_amount) FROM delivery WHERE driver_id = dr.driver_id AND status = 'DELIVERED'), 0) AS total_cash_collected
             FROM driver dr
             JOIN users u ON u.user_id = dr.user_id
             LEFT JOIN distributor d ON d.distributor_id = dr.distributor_id
             LEFT JOIN distributor_region reg ON reg.region_id = d.region_id
             WHERE dr.driver_id = ?"
        );
        $stmt->execute([$driverId]);
        return $stmt->fetch() ?: null;
    }

    public function getByDistributor(int $distributorId): array {
        $stmt = $this->db->prepare(
            "SELECT dr.*, u.full_name, u.email, u.phone,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id), 0) AS total_deliveries,
                    COALESCE((SELECT COUNT(*) FROM delivery WHERE driver_id = dr.driver_id AND status = 'DELIVERED'), 0) AS successful_deliveries
             FROM driver dr
             JOIN users u ON u.user_id = dr.user_id
             WHERE dr.distributor_id = ?
             ORDER BY dr.created_at DESC"
        );
        $stmt->execute([$distributorId]);
        return $stmt->fetchAll();
    }

    public function create(int $userId, array $data): int {
        $stmt = $this->db->prepare("INSERT INTO driver (user_id, distributor_id, license_number, vehicle_number) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $data['distributor_id'], $data['license_number'], $data['vehicle_number']]);
        return (int)$this->db->lastInsertId();
    }

    public function updateStatus(int $driverId, string $status): void {
        $this->db->prepare("UPDATE driver SET status = ? WHERE driver_id = ?")->execute([$status, $driverId]);
    }

    public function updateProfile(int $userId, string $fullName, string $phone, string $licenseNumber, string $vehicleNumber): void {
        $this->db->beginTransaction();
        try {
            $stmtUser = $this->db->prepare("UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?");
            $stmtUser->execute([$fullName, $phone, $userId]);

            $stmtDriver = $this->db->prepare("UPDATE driver SET license_number = ?, vehicle_number = ? WHERE user_id = ?");
            $stmtDriver->execute([$licenseNumber, $vehicleNumber, $userId]);

            $this->db->commit();
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}
