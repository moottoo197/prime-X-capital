<?php
namespace Alphavest;

use PDO;

class AuditLogger {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function log(
        string $actorId,
        string $role,
        string $action,
        string $targetType,
        string $targetId,
        ?array $prevState = null,
        ?array $newState = null,
        string $reason = '',
        string $referenceId = ''
    ): void {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

        $stmt = $this->db->prepare("
            INSERT INTO admin_audit_logs (
                actor_id, actor_role, action, target_type, target_id,
                previous_state, new_state, reason, reference_id, ip_address, user_agent, created_at
            ) VALUES (
                :actor_id, :actor_role, :action, :target_type, :target_id,
                :previous_state, :new_state, :reason, :reference_id, :ip_address, :user_agent, :created_at
            )
        ");

        $stmt->execute([
            ':actor_id'       => $actorId,
            ':actor_role'     => $role,
            ':action'         => $action,
            ':target_type'    => $targetType,
            ':target_id'      => $targetId,
            ':previous_state' => $prevState ? json_encode($prevState) : null,
            ':new_state'      => $newState ? json_encode($newState) : null,
            ':reason'         => $reason,
            ':reference_id'   => $referenceId,
            ':ip_address'     => $ip,
            ':user_agent'     => substr($userAgent, 0, 255),
            ':created_at'     => gmdate('Y-m-d H:i:s')
        ]);
    }
}
