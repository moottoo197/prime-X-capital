<?php
namespace Alphavest;

use PDO;
use Exception;

class Auth {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Authenticate or resolve current user from Bearer Token, Cookie, or Session.
     */
    public function getCurrentUser(): ?array {
        $token = $this->extractToken();
        if (empty($token)) {
            return null;
        }

        // 1. Check active session in database
        $stmt = $this->db->prepare("
            SELECT s.user_id, s.expires_at, u.email, u.role, u.is_active, u.kyc_status, u.referral_code, u.two_factor_enabled
            FROM user_sessions s
            JOIN profiles u ON s.user_id = u.id
            WHERE s.token = :token AND s.expires_at > :now
        ");
        $stmt->execute([
            ':token' => hash('sha256', $token),
            ':now'   => gmdate('Y-m-d H:i:s')
        ]);
        $user = $stmt->fetch();

        if ($user) {
            if (!$user['is_active']) {
                return null;
            }
            return $user;
        }

        // Only opaque server-issued sessions are accepted.

        return null;
    }

    /**
     * Extract token from Authorization header or cookie
     */
    public function extractToken(): ?string {
        return !empty($_COOKIE['alphavest_session']) ? trim((string)$_COOKIE['alphavest_session']) : null;

    }

    /**
     * Verify if current user has required RBAC permission
     */
    public function hasPermission(array $user, string $permission): bool {
        if ($user['role'] === 'SUPER_ADMIN') {
            return true;
        }

        $stmt = $this->db->prepare("
            SELECT COUNT(*) FROM role_permissions rp
            JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role = :role AND p.name = :perm
        ");
        $stmt->execute([
            ':role' => $user['role'],
            ':perm' => $permission
        ]);

        return (int)$stmt->fetchColumn() > 0;
    }

}
