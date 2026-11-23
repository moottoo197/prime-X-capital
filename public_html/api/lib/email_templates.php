<?php
/**
 * Prime X Capital - Branded Transactional Email Templates
 *
 * All templates produce both HTML and plain-text variants with clear links,
 * fallback URLs, expiration warnings, and zero sensitive account secrets.
 */

declare(strict_types=1);

if (!function_exists('primex_email_escape')) {
    function primex_email_escape(string $value): string {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}

if (!function_exists('primex_email_layout')) {
    function primex_email_layout(string $headline, string $preheader, string $bodyHtml, string $footerNote = ''): string {
        $appUrl = function_exists('primex_app_url') ? primex_app_url() : 'https://prime-x-capital.com';
        $safeHeadline = primex_email_escape($headline);
        $safePreheader = primex_email_escape($preheader);
        $safeUrl = primex_email_escape($appUrl);
        $year = gmdate('Y');
        $safeFooterNote = $footerNote !== ''
            ? '<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#6B7280;">' . primex_email_escape($footerNote) . '</p>'
            : '';

        return '<!doctype html>'
            . '<html lang="en">'
            . '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            . '<title>' . $safeHeadline . '</title></head>'
            . '<body style="margin:0;padding:0;background-color:#F4F6FA;font-family:Inter,Arial,Helvetica,sans-serif;color:#111827;">'
            . '<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' . $safePreheader . '</span>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F4F6FA;padding:28px 14px;">'
            . '<tr><td align="center">'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;">'
            . '<tr><td style="padding:24px 28px;border-bottom:1px solid #EEF1F6;background:#FFFFFF;">'
            . '<a href="' . $safeUrl . '" style="text-decoration:none;font-size:17px;font-weight:800;letter-spacing:0.04em;color:#0052FF;">PRIME X CAPITAL</a>'
            . '</td></tr>'
            . '<tr><td style="padding:28px;">'
            . '<h1 style="margin:0 0 14px;font-size:21px;line-height:1.3;font-weight:800;color:#111827;">' . $safeHeadline . '</h1>'
            . $bodyHtml
            . '</td></tr>'
            . '<tr><td style="padding:20px 28px;background-color:#F8FAFC;border-top:1px solid #EEF1F6;">'
            . $safeFooterNote
            . '<p style="margin:0;font-size:12px;line-height:1.5;color:#9CA3AF;">&copy; ' . $year . ' Prime X Capital &middot; <a href="' . $safeUrl . '" style="color:#6B7280;text-decoration:none;">' . $safeUrl . '</a></p>'
            . '<p style="margin:6px 0 0;font-size:11px;line-height:1.5;color:#9CA3AF;">This is an automated security email from no-reply@prime-x-capital.com. Please do not reply.</p>'
            . '</td></tr>'
            . '</table>'
            . '</td></tr></table>'
            . '</body></html>';
    }
}

if (!function_exists('primex_email_template_verify_email')) {
    function primex_email_template_verify_email(string $recipientName, string $verifyUrl, int $expiresHours = 24): array {
        $greeting = $recipientName !== '' ? ('Hello ' . $recipientName . ',') : 'Hello,';
        $safeGreeting = primex_email_escape($greeting);
        $safeUrl = primex_email_escape($verifyUrl);
        $subject = 'Confirm your Prime X Capital email';

        $bodyHtml = ''
            . '<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#374151;">' . $safeGreeting . '</p>'
            . '<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#374151;">Thank you for registering with <strong>Prime X Capital</strong>. Please confirm your email address using the button below to verify your account.</p>'
            . '<p style="margin:22px 0;"><a href="' . $safeUrl . '" style="display:inline-block;padding:13px 24px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;">Confirm Email Address</a></p>'
            . '<p style="margin:0 0 10px;font-size:13px;line-height:1.55;color:#4B5563;">This confirmation link will expire in <strong>' . (int)$expiresHours . ' hours</strong> and can only be used once.</p>'
            . '<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#6B7280;">If the button does not work, copy and paste this link into your browser:</p>'
            . '<p style="margin:0 0 18px;font-size:12px;line-height:1.5;word-break:break-all;color:#0052FF;"><a href="' . $safeUrl . '" style="color:#0052FF;text-decoration:underline;">' . $safeUrl . '</a></p>'
            . '<p style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;">If you did not create a Prime X Capital account, you can safely ignore this email.</p>';

        $html = primex_email_layout(
            'Confirm Your Email Address',
            'Confirm your Prime X Capital email address to complete your registration.',
            $bodyHtml,
            'For your protection, Prime X Capital will never ask for your password or 6-digit PIN via email.'
        );

        $text = "{$greeting}\n\n"
            . "Thank you for registering with Prime X Capital.\n"
            . "Please confirm your email address by opening the link below:\n\n"
            . "{$verifyUrl}\n\n"
            . "This confirmation link expires in {$expiresHours} hours and can only be used once.\n\n"
            . "If you did not create a Prime X Capital account, you can safely ignore this email.\n\n"
            . "Prime X Capital\nhttps://prime-x-capital.com";

        return ['subject' => $subject, 'html' => $html, 'text' => $text];
    }
}

if (!function_exists('primex_email_template_reset_password')) {
    function primex_email_template_reset_password(string $recipientName, string $resetUrl, int $expiresMinutes = 30): array {
        $greeting = $recipientName !== '' ? ('Hello ' . $recipientName . ',') : 'Hello,';
        $safeGreeting = primex_email_escape($greeting);
        $safeUrl = primex_email_escape($resetUrl);
        $subject = 'Reset your Prime X Capital password';

        $bodyHtml = ''
            . '<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#374151;">' . $safeGreeting . '</p>'
            . '<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#374151;">We received a request to reset the password for your <strong>Prime X Capital</strong> account. Click the button below to choose a new password.</p>'
            . '<p style="margin:22px 0;"><a href="' . $safeUrl . '" style="display:inline-block;padding:13px 24px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;">Reset Password</a></p>'
            . '<p style="margin:0 0 10px;font-size:13px;line-height:1.55;color:#4B5563;">This password reset link will expire in <strong>' . (int)$expiresMinutes . ' minutes</strong> and can only be used once.</p>'
            . '<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#6B7280;">If the button does not work, copy and paste this link into your browser:</p>'
            . '<p style="margin:0 0 18px;font-size:12px;line-height:1.5;word-break:break-all;color:#0052FF;"><a href="' . $safeUrl . '" style="color:#0052FF;text-decoration:underline;">' . $safeUrl . '</a></p>'
            . '<p style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;">If you did not request a password reset, you can safely ignore this email. Your existing password has not changed.</p>';

        $html = primex_email_layout(
            'Reset Your Password',
            'Use this single-use link to reset your Prime X Capital password.',
            $bodyHtml,
            'Do not share this reset link with anyone.'
        );

        $text = "{$greeting}\n\n"
            . "We received a request to reset your Prime X Capital password.\n"
            . "Open the link below to set a new password:\n\n"
            . "{$resetUrl}\n\n"
            . "This reset link expires in {$expiresMinutes} minutes and can only be used once.\n\n"
            . "If you did not request a password reset, you can safely ignore this email — your password has not changed.\n\n"
            . "Prime X Capital\nhttps://prime-x-capital.com";

        return ['subject' => $subject, 'html' => $html, 'text' => $text];
    }
}

if (!function_exists('primex_email_template_password_changed')) {
    function primex_email_template_password_changed(string $recipientName, string $changedAtUtc, string $loginUrl, string $supportUrl): array {
        $greeting = $recipientName !== '' ? ('Hello ' . $recipientName . ',') : 'Hello,';
        $safeGreeting = primex_email_escape($greeting);
        $safeTime = primex_email_escape($changedAtUtc);
        $safeLoginUrl = primex_email_escape($loginUrl);
        $safeSupportUrl = primex_email_escape($supportUrl);
        $subject = 'Your Prime X Capital password was changed';

        $bodyHtml = ''
            . '<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#374151;">' . $safeGreeting . '</p>'
            . '<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#374151;">This is a security confirmation that the password for your <strong>Prime X Capital</strong> account was changed on <strong>' . $safeTime . '</strong>.</p>'
            . '<p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#374151;">All previous sessions have been signed out for your protection. You can sign in using your new password below.</p>'
            . '<p style="margin:22px 0;"><a href="' . $safeLoginUrl . '" style="display:inline-block;padding:13px 24px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;">Sign In to Prime X Capital</a></p>'
            . '<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#6B7280;">Sign-in URL: <a href="' . $safeLoginUrl . '" style="color:#0052FF;text-decoration:underline;">' . $safeLoginUrl . '</a></p>'
            . '<p style="margin:14px 0 0;padding:12px 14px;background-color:#FEF2F2;border:1px solid #FECACA;border-radius:10px;font-size:12.5px;line-height:1.55;color:#991B1B;"><strong>Didn\'t make this change?</strong> Contact Prime X Capital support immediately at <a href="' . $safeSupportUrl . '" style="color:#991B1B;font-weight:700;text-decoration:underline;">' . $safeSupportUrl . '</a> and secure your account.</p>';

        $html = primex_email_layout(
            'Your Password Was Changed',
            'Security confirmation: your Prime X Capital password was recently updated.',
            $bodyHtml
        );

        $text = "{$greeting}\n\n"
            . "Your Prime X Capital account password was changed on {$changedAtUtc}.\n"
            . "All previous sessions were signed out for your security.\n\n"
            . "Sign in: {$loginUrl}\n\n"
            . "If you did not make this change, contact Prime X Capital support immediately:\n{$supportUrl}\n\n"
            . "Prime X Capital\nhttps://prime-x-capital.com";

        return ['subject' => $subject, 'html' => $html, 'text' => $text];
    }
}
