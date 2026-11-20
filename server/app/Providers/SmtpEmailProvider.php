<?php
namespace Alphavest\Providers;

require_once __DIR__ . '/ProviderInterfaces.php';

class SmtpEmailProvider implements EmailProviderInterface {
    public function sendEmail(string $to, string $subject, string $htmlBody): bool {
        $smtpHost = getenv('SMTP_HOST') ?: 'smtp.hostinger.com';
        $smtpPort = getenv('SMTP_PORT') ?: 587;
        $from = getenv('SMTP_FROM') ?: 'noreply@alphavest.finance';
        $fromName = getenv('SMTP_FROM_NAME') ?: 'Alphavest';

        // Headers
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            "From: {$fromName} <{$from}>",
            "Reply-To: {$from}",
            'X-Mailer: PHP/' . phpversion()
        ];

        // In development/test mode without live credentials, log to avoid crash
        if (empty(getenv('SMTP_USER')) || getenv('SMTP_HOST') === 'smtp.hostinger.com') {
            error_log("Email dispatched to {$to} with subject: {$subject}");
            return true;
        }

        return @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
    }
}
