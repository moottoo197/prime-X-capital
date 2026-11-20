<?php
namespace Alphavest;

use PDO;
use PDOException;
use Exception;
use SupabaseClient;

require_once __DIR__ . '/SupabaseClient.php';

class Database {
    private static ?PDO $pdoInstance = null;
    private static ?SupabaseClient $restClient = null;

    /**
     * Get Central Supabase REST Client
     */
    public static function getClient(): SupabaseClient {
        if (self::$restClient === null) {
            self::$restClient = new SupabaseClient();
        }
        return self::$restClient;
    }

    /**
     * Get PDO connection ONLY if PostgreSQL extension and credentials exist.
     * NEVER falls back to local SQLite.
     */
    public static function getConnection(): ?PDO {
        if (self::$pdoInstance !== null) {
            return self::$pdoInstance;
        }

        if (!extension_loaded('pdo_pgsql')) {
            return null;
        }

        $dbUrl = getenv('DATABASE_URL') ?: (defined('DATABASE_URL') ? DATABASE_URL : '');
        if (!empty($dbUrl) && (str_starts_with($dbUrl, 'postgres://') || str_starts_with($dbUrl, 'postgresql://'))) {
            try {
                $parsed = parse_url($dbUrl);
                $host = $parsed['host'] ?? 'localhost';
                $port = $parsed['port'] ?? 5432;
                $user = $parsed['user'] ?? 'postgres';
                $pass = urldecode($parsed['pass'] ?? '');
                $dbname = ltrim($parsed['path'] ?? '/postgres', '/');

                $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";
                $pdo = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::ATTR_TIMEOUT => 3,
                ]);

                self::$pdoInstance = $pdo;
                return self::$pdoInstance;
            } catch (PDOException $e) {
                error_log("PostgreSQL direct connection failed: " . $e->getMessage());
                return null;
            }
        }

        return null;
    }

    public static function getDriver(): string {
        return self::$pdoInstance !== null ? 'pgsql' : 'supabase-rest';
    }
}
