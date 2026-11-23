<?php
namespace Alphavest\Providers;

require_once __DIR__ . '/ProviderInterfaces.php';

class SmtpEmailProvider implements EmailProviderInterface {
    public function sendEmail(string $to, string $subject, string $htmlBody): bool {
        $mailerPath = dirname(__DIR__, 3) . '/public_html/api/lib/mailer.php';
        if (!function_exists('primex_send_smtp_email') && is_file($mailerPath)) {
            require_once $mailerPath;
        }
        if (function_exists('primex_send_smtp_email')) {
            $res = primex_send_smtp_email($to, $subject, $htmlBody);
            return !empty($res['success']);
        }
        return false;
    }
}
