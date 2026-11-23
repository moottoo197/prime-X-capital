<?php
/**
 * Compatibility loader only.
 * Real production secrets MUST live outside the public web root in server/config.php.
 */
declare(strict_types=1);

$privateConfigCandidates = [
    dirname(__DIR__, 2) . '/server/config.php',
    dirname(__DIR__, 3) . '/server/config.php',
    dirname(__DIR__, 4) . '/server/config.php',
    dirname(__DIR__, 2) . '/config.php',
    dirname(__DIR__, 4) . '/config.php',
];

foreach ($privateConfigCandidates as $configFile) {
    if (@is_file($configFile) && @is_readable($configFile)) {
        require_once $configFile;
        if (defined('SUPABASE_URL') && SUPABASE_URL && defined('SUPABASE_SERVICE_ROLE_KEY') && SUPABASE_SERVICE_ROLE_KEY) {
            break;
        }
    }
}
