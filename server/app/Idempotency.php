<?php
namespace Alphavest;

use PDO;
use Exception;

class Idempotency {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Check or lock an idempotency key.
     * Returns cached response if already processed, null if new, or throws exception if concurrent.
     */
    public function checkOrLock(string $key, string $userId, string $endpoint): ?array {
        if (empty($key)) {
            return null;
        }

        $stmt = $this->db->prepare("
            SELECT * FROM idempotency_keys
            WHERE idempotency_key = :key AND user_id = :user_id
        ");
        $stmt->execute([
            ':key'     => $key,
            ':user_id' => $userId
        ]);
        $record = $stmt->fetch();

        if ($record) {
            if ($record['status'] === 'COMPLETED' && !empty($record['response_payload'])) {
                return json_decode($record['response_payload'], true);
            }
            if ($record['status'] === 'PROCESSING') {
                throw new Exception("A request with this idempotency key is already processing.");
            }
        }

        // Insert processing lock
        $insert = $this->db->prepare("
            INSERT INTO idempotency_keys (idempotency_key, user_id, endpoint, status, created_at, expires_at)
            VALUES (:key, :user_id, :endpoint, 'PROCESSING', :created_at, :expires_at)
        ");
        $now = gmdate('Y-m-d H:i:s');
        $expires = gmdate('Y-m-d H:i:s', time() + 86400); // 24 hour cache
        $insert->execute([
            ':key'        => $key,
            ':user_id'    => $userId,
            ':endpoint'   => $endpoint,
            ':created_at' => $now,
            ':expires_at' => $expires
        ]);

        return null;
    }

    /**
     * Save completed response payload for idempotency key
     */
    public function complete(string $key, string $userId, array $responsePayload): void {
        if (empty($key)) return;

        $stmt = $this->db->prepare("
            UPDATE idempotency_keys
            SET status = 'COMPLETED',
                response_payload = :payload,
                completed_at = :now
            WHERE idempotency_key = :key AND user_id = :user_id
        ");
        $stmt->execute([
            ':payload' => json_encode($responsePayload),
            ':now'     => gmdate('Y-m-d H:i:s'),
            ':key'     => $key,
            ':user_id' => $userId
        ]);
    }
}
