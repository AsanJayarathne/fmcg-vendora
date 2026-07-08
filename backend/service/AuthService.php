<?php
require_once __DIR__ . '/../util/Database.php';
require_once __DIR__ . '/../repository/UserRepository.php';
require_once __DIR__ . '/../repository/TokenRepository.php';
require_once __DIR__ . '/../repository/DistributorRepository.php';
require_once __DIR__ . '/../repository/RetailerRepository.php';
require_once __DIR__ . '/../repository/DriverRepository.php';

class AuthService {
    private UserRepository        $userRepo;
    private TokenRepository       $tokenRepo;
    private DistributorRepository $distributorRepo;
    private RetailerRepository    $retailerRepo;
    private DriverRepository      $driverRepo;

    public function __construct() {
        $this->userRepo        = new UserRepository();
        $this->tokenRepo       = new TokenRepository();
        $this->distributorRepo = new DistributorRepository();
        $this->retailerRepo    = new RetailerRepository();
        $this->driverRepo      = new DriverRepository();
    }

    public function  login(string $email, string $password): array {
        $user = $this->userRepo->findByEmail($email);
        if (!$user) throw new Exception("Invalid email or password", 401);
        if (!$user['is_active']) throw new Exception("Account is deactivated", 403);

        // Support both bcrypt and SHA2 (seed data uses SHA2)
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
        ];
    }

    public function logout(string $token): void {
        $this->tokenRepo->deleteByToken($token);
    }

    // ─── Registration ────────────────────────────────────────────────────────

    public function registerRetailer(array $userData, array $profileData): int {
        $db = Database::getConnection();
        $db->beginTransaction();
        try {
            if ($this->userRepo->findByEmail($userData['email'])) {
                throw new Exception("Email is already registered", 400);
            }
            $userData['role_id']   = 3;     // RETAILER
            $userData['is_active'] = false; // Inactive until Distributor approves
            $userId = $this->userRepo->create($userData);
            $this->retailerRepo->create($userId, $profileData);
            $db->commit();
            return $userId;
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public function registerDistributor(array $userData, array $profileData): int {
        $db = Database::getConnection();
        $db->beginTransaction();
        try {
            if ($this->userRepo->findByEmail($userData['email'])) {
                throw new Exception("Email is already registered", 400);
            }
            $userData['role_id']   = 2;     // DISTRIBUTOR
            $userData['is_active'] = false; // Inactive until Admin approves
            $userId = $this->userRepo->create($userData);
            $this->distributorRepo->create($userId, $profileData);
            $db->commit();
            return $userId;
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public function registerDriver(array $userData, array $profileData): int {
        $db = Database::getConnection();
        $db->beginTransaction();
        try {
            if ($this->userRepo->findByEmail($userData['email'])) {
                throw new Exception("Email is already registered", 400);
            }
            $userData['role_id']   = 4;     // DRIVER
            $userData['is_active'] = false; // Inactive until Distributor approves
            $userId = $this->userRepo->create($userData);
            $this->driverRepo->create($userId, $profileData);
            $db->commit();
            return $userId;
        } catch (Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private function getProfileId(int $userId, string $role): ?int {
        return match ($role) {
            'DISTRIBUTOR' => $this->distributorRepo->findByUserId($userId)['distributor_id'] ?? null,
            'RETAILER'    => $this->retailerRepo->findByUserId($userId)['retailer_id']        ?? null,
            'DRIVER'      => $this->driverRepo->findByUserId($userId)['driver_id']             ?? null,
            default       => null,
        };
    }
}
