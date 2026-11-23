<?php
/**
 * Prime X Capital - Website-Themed Transactional Email Templates
 *
 * Styled to match the Prime X Capital Cobalt Blue (#0052FF) & Crisp White
 * (#FFFFFF / #F7F8FA) web platform theme. Produces both table-safe HTML and
 * plain-text multipart variants with clear links and zero account secrets.
 */

declare(strict_types=1);

if (!function_exists('primex_email_escape')) {
    function primex_email_escape(string $value): string {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}

if (!function_exists('primex_email_layout')) {
    function primex_email_layout(
        string $headline,
        string $preheader,
        string $bodyHtml,
        string $footerNote = '',
        string $badgeText = 'ACCOUNT SECURITY',
        string $badgeColor = '#0052FF',
        string $badgeBg = '#EFF4FF'
    ): string {
        $appUrl = function_exists('primex_app_url') ? primex_app_url() : 'https://prime-x-capital.com';
        $safeHeadline = primex_email_escape($headline);
        $safePreheader = primex_email_escape($preheader);
        $safeUrl = primex_email_escape($appUrl);
        $safeLogoUrl = primex_email_escape($appUrl . '/assets/aistudio/primex-mark_326fd678.webp');
        $safeBadgeText = primex_email_escape($badgeText);
        $safeBadgeColor = preg_match('/^#[0-9A-Fa-f]{3,6}$/', $badgeColor) ? $badgeColor : '#0052FF';
        $safeBadgeBg = preg_match('/^#[0-9A-Fa-f]{3,6}$/', $badgeBg) ? $badgeBg : '#EFF4FF';
        $year = gmdate('Y');

        $safeFooterNote = $footerNote !== ''
            ? '<p style="margin:0 0 10px;font-size:12px;line-height:1.55;color:#4B5563;">' . primex_email_escape($footerNote) . '</p>'
            : '';

        return '<!doctype html>'
            . '<html lang="en">'
            . '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            . '<title>' . $safeHeadline . '</title></head>'
            . '<body style="margin:0;padding:0;background-color:#F7F8FA;font-family:Inter,-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Arial,sans-serif;color:#111827;">'
            . '<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' . $safePreheader . '</span>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F7F8FA;padding:32px 14px;">'
            . '<tr><td align="center">'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;background-color:#FFFFFF;border:1px solid #EEF1F6;border-radius:20px;overflow:hidden;">'
            // Top Cobalt Accent Bar
            . '<tr><td style="height:4px;background-color:#0052FF;font-size:0;line-height:0;">&nbsp;</td></tr>'
            // Website Brand Header
            . '<tr><td style="padding:22px 28px;border-bottom:1px solid #EEF1F6;background-color:#FFFFFF;">'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>'
            . '<td style="vertical-align:middle;">'
            . '<a href="' . $safeUrl . '" style="text-decoration:none;color:#111827;display:inline-block;">'
            . '<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>'
            . '<td style="vertical-align:middle;padding-right:10px;">'
            . '<img src="' . $safeLogoUrl . '" alt="Prime X Capital" width="34" height="34" style="display:block;width:34px;height:34px;border-radius:9px;border:1px solid #EEF1F6;">'
            . '</td>'
            . '<td style="vertical-align:middle;">'
            . '<span style="display:block;font-size:15px;font-weight:800;letter-spacing:0.03em;color:#111827;line-height:1.2;">PRIME X CAPITAL</span>'
            . '<span style="display:block;font-size:11px;font-weight:700;letter-spacing:0.04em;color:#0052FF;line-height:1.3;">DIGITAL TRADING PLATFORM</span>'
            . '</td>'
            . '</tr></table>'
            . '</a>'
            . '</td>'
            . '<td align="right" style="vertical-align:middle;">'
            . '<span style="display:inline-block;padding:5px 10px;border-radius:999px;background-color:' . $safeBadgeBg . ';color:' . $safeBadgeColor . ';font-size:10px;font-weight:800;letter-spacing:0.06em;">' . $safeBadgeText . '</span>'
            . '</td>'
            . '</tr></table>'
            . '</td></tr>'
            // Main Body
            . '<tr><td style="padding:30px 28px 26px;">'
            . '<h1 style="margin:0 0 14px;font-size:22px;line-height:1.3;font-weight:800;color:#111827;letter-spacing:-0.01em;">' . $safeHeadline . '</h1>'
            . $bodyHtml
            . '</td></tr>'
            // Website Theme Footer
            . '<tr><td style="padding:20px 28px;background-color:#F8FAFC;border-top:1px solid #EEF1F6;">'
            . $safeFooterNote
            . '<p style="margin:0;font-size:12px;line-height:1.55;color:#6B7280;">&copy; ' . $year . ' <strong>Prime X Capital</strong> &middot; <a href="' . $safeUrl . '" style="color:#0052FF;text-decoration:none;font-weight:600;">' . $safeUrl . '</a></p>'
            . '<p style="margin:6px 0 0;font-size:11px;line-height:1.5;color:#9CA3AF;">Automated system email from no-reply@prime-x-capital.com. Please do not reply directly to this message.</p>'
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
            . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
            . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">Welcome to <strong>Prime X Capital</strong>. Confirm your email address below to verify your account identity and keep your security notifications up to date.</p>'
            . '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0;"><tr><td>'
            . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">Confirm Email Address</a>'
            . '</td></tr></table>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
            . '<tr><td style="padding:14px 16px;font-size:12.5px;line-height:1.55;color:#4B5563;">'
            . '<strong style="color:#111827;">Link validity:</strong> Expires in <strong>' . (int)$expiresHours . ' hours</strong> and can only be used once.<br>'
            . '<span style="color:#6B7280;">If the button does not open, paste this link in your browser:</span><br>'
            . '<a href="' . $safeUrl . '" style="color:#0052FF;text-decoration:underline;word-break:break-all;">' . $safeUrl . '</a>'
            . '</td></tr></table>'
            . '<p style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;">If you did not register with Prime X Capital, you can safely ignore this message.</p>';

        $html = primex_email_layout(
            'Confirm Your Email Address',
            'Confirm your Prime X Capital email address to complete verification.',
            $bodyHtml,
            'For your protection, Prime X Capital never asks for your login password or 6-digit withdrawal PIN via email.',
            'EMAIL VERIFICATION',
            '#0052FF',
            '#EFF4FF'
        );

        $text = "{$greeting}\n\n"
            . "Welcome to Prime X Capital.\n"
            . "Please confirm your email address using the link below:\n\n"
            . "{$verifyUrl}\n\n"
            . "This confirmation link expires in {$expiresHours} hours and can only be used once.\n\n"
            . "If you did not create a Prime X Capital account, you can safely ignore this email.\n\n"
            . "Prime X Capital\nhttps://prime-x-capital.com";

        return ['subject' => $subject, 'html' => $html, 'text' => $text];
    }
}

if (!function_exists('primex_email_template_signup_code')) {
    function primex_email_template_signup_code(string $recipientName, string $code, int $expiresMinutes = 10): array {
        $greeting = $recipientName !== '' ? ('Hello ' . $recipientName . ',') : 'Hello,';
        $safeGreeting = primex_email_escape($greeting);
        $safeCode = primex_email_escape($code);
        $subject = 'Your Prime X Capital verification code';

        $bodyHtml = ''
            . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
            . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">Use the 6-digit verification code below to confirm your email address and complete your <strong>Prime X Capital</strong> sign up.</p>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0;background-color:#EFF4FF;border:1px solid #C7D8FF;border-radius:14px;">'
            . '<tr><td align="center" style="padding:20px 16px;">'
            . '<div style="font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#0052FF;margin-bottom:8px;">SIGN-UP VERIFICATION CODE</div>'
            . '<div style="font-family:\'Courier New\',Courier,monospace;font-size:32px;font-weight:800;letter-spacing:8px;color:#111827;line-height:1.2;">' . $safeCode . '</div>'
            . '</td></tr></table>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
            . '<tr><td style="padding:14px 16px;font-size:12.5px;line-height:1.55;color:#4B5563;">'
            . '<strong style="color:#111827;">Validity:</strong> This verification code expires in <strong>' . (int)$expiresMinutes . ' minutes</strong> and can only be used once.'
            . '</td></tr></table>'
            . '<p style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;">If you did not try to create a Prime X Capital account, you can safely ignore this email and do not share this code with anyone.</p>';

        $html = primex_email_layout(
            'Your Verification Code',
            'Enter this 6-digit verification code to complete your Prime X Capital sign up.',
            $bodyHtml,
            'Never share your verification code with anyone, including anyone claiming to represent Prime X Capital.',
            'SIGN-UP CODE',
            '#0052FF',
            '#EFF4FF'
        );

        $text = "{$greeting}\n\n"
            . "Your Prime X Capital sign-up verification code is: {$code}\n\n"
            . "This code expires in {$expiresMinutes} minutes and can only be used once.\n\n"
            . "If you did not request this code, ignore this email and never share it with anyone.\n\n"
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
            . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
            . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">We received a request to reset the password for your <strong>Prime X Capital</strong> account. Use the button below to choose a new password.</p>'
            . '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0;"><tr><td>'
            . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">Reset Password</a>'
            . '</td></tr></table>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
            . '<tr><td style="padding:14px 16px;font-size:12.5px;line-height:1.55;color:#4B5563;">'
            . '<strong style="color:#111827;">Single-use security link:</strong> Expires in <strong>' . (int)$expiresMinutes . ' minutes</strong>.<br>'
            . '<span style="color:#6B7280;">Direct link if the button does not work:</span><br>'
            . '<a href="' . $safeUrl . '" style="color:#0052FF;text-decoration:underline;word-break:break-all;">' . $safeUrl . '</a>'
            . '</td></tr></table>'
            . '<p style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;">If you did not request a password reset, you can safely ignore this message — your current password remains unchanged.</p>';

        $html = primex_email_layout(
            'Reset Your Password',
            'Use this single-use link to set a new Prime X Capital password.',
            $bodyHtml,
            'Never share your password reset link with anyone, including anyone claiming to be support.',
            'PASSWORD RESET',
            '#0052FF',
            '#EFF4FF'
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
            . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
            . '<p style="margin:0 0 16px;font-size:14.5px;line-height:1.65;color:#374151;">This is a security confirmation that the login password for your <strong>Prime X Capital</strong> account was updated.</p>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
            . '<tr><td style="padding:14px 16px;font-size:13px;line-height:1.6;color:#374151;">'
            . '<strong>Updated At:</strong> ' . $safeTime . '<br>'
            . '<strong>Session Protection:</strong> Previous active sessions have been signed out automatically.'
            . '</td></tr></table>'
            . '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;"><tr><td>'
            . '<a href="' . $safeLoginUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">Sign In to Prime X Capital</a>'
            . '</td></tr></table>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FEF2F2;border:1px solid #FECACA;border-radius:12px;">'
            . '<tr><td style="padding:14px 16px;font-size:12.5px;line-height:1.55;color:#991B1B;">'
            . '<strong>Didn\'t make this change?</strong> Contact Prime X Capital support immediately at '
            . '<a href="' . $safeSupportUrl . '" style="color:#991B1B;font-weight:700;text-decoration:underline;">' . $safeSupportUrl . '</a> and secure your account.'
            . '</td></tr></table>';

        $html = primex_email_layout(
            'Your Password Was Changed',
            'Security alert: your Prime X Capital password was recently updated.',
            $bodyHtml,
            'Keep your password unique to Prime X Capital.',
            'SECURITY CONFIRMED',
            '#00B87C',
            '#ECFDF5'
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

if (!function_exists('primex_email_template_deposit_requested')) {
    function primex_email_template_deposit_requested(
        string $recipientName,
        float $amount,
        string $asset,
        string $network,
        string $depositId,
        string $submittedAtUtc,
        string $historyUrl
    ): array {
        $greeting = $recipientName !== '' ? ('Hello ' . $recipientName . ',') : 'Hello,';
        $safeGreeting = primex_email_escape($greeting);
        $formattedAmount = number_format($amount, 2) . ' ' . strtoupper(trim($asset ?: 'USDT'));
        $safeAmount = primex_email_escape($formattedAmount);
        $safeNetwork = primex_email_escape(strtoupper(trim($network ?: 'TRC20')));
        $safeId = primex_email_escape($depositId);
        $safeTime = primex_email_escape($submittedAtUtc);
        $safeUrl = primex_email_escape($historyUrl);
        $subject = "Deposit request received ({$formattedAmount}) — Prime X Capital";

        $bodyHtml = ''
            . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
            . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">We have received your deposit confirmation request on <strong>Prime X Capital</strong>. Our compliance and settlement team is reviewing your transaction.</p>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
            . '<tr><td style="padding:16px;font-size:13px;line-height:1.75;color:#374151;">'
            . '<strong>Amount:</strong> <span style="color:#0052FF;font-weight:800;">' . $safeAmount . '</span><br>'
            . '<strong>Network:</strong> ' . $safeNetwork . '<br>'
            . '<strong>Reference ID:</strong> <span style="font-family:monospace;">' . $safeId . '</span><br>'
            . '<strong>Status:</strong> Pending Verification<br>'
            . '<strong>Submitted At:</strong> ' . $safeTime
            . '</td></tr></table>'
            . '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;"><tr><td>'
            . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">View Wallet Activity</a>'
            . '</td></tr></table>'
            . '<p style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;">You will receive another email confirmation as soon as your deposit is credited to your account.</p>';

        $html = primex_email_layout(
            'Deposit Request Received',
            'Your deposit confirmation is queued for verification.',
            $bodyHtml,
            'If you did not submit this deposit request, please contact Prime X Capital support immediately.',
            'DEPOSIT PENDING',
            '#0052FF',
            '#EFF4FF'
        );

        $text = "{$greeting}\n\n"
            . "We have received your Prime X Capital deposit request.\n"
            . "Amount: {$formattedAmount}\n"
            . "Network: " . strtoupper(trim($network ?: 'TRC20')) . "\n"
            . "Reference ID: {$depositId}\n"
            . "Status: Pending Verification\n"
            . "Submitted At: {$submittedAtUtc}\n\n"
            . "View activity: {$historyUrl}\n\n"
            . "Prime X Capital\nhttps://prime-x-capital.com";

        return ['subject' => $subject, 'html' => $html, 'text' => $text];
    }
}

if (!function_exists('primex_email_template_deposit_status')) {
    function primex_email_template_deposit_status(
        string $recipientName,
        string $decision,
        float $amount,
        string $asset,
        string $network,
        string $depositId,
        string $reason,
        string $processedAtUtc,
        string $walletUrl
    ): array {
        $isApproved = in_array(strtoupper(trim($decision)), ['APPROVE', 'APPROVED', 'COMPLETED', 'CONFIRMED'], true);
        $greeting = $recipientName !== '' ? ('Hello ' . $recipientName . ',') : 'Hello,';
        $safeGreeting = primex_email_escape($greeting);
        $formattedAmount = number_format($amount, 2) . ' ' . strtoupper(trim($asset ?: 'USDT'));
        $safeAmount = primex_email_escape($formattedAmount);
        $safeNetwork = primex_email_escape(strtoupper(trim($network ?: 'TRC20')));
        $safeId = primex_email_escape($depositId);
        $safeTime = primex_email_escape($processedAtUtc);
        $safeReason = primex_email_escape($reason !== '' ? $reason : 'Please contact support for details.');
        $safeUrl = primex_email_escape($walletUrl);

        if ($isApproved) {
            $subject = "Deposit confirmed & credited ({$formattedAmount}) — Prime X Capital";
            $bodyHtml = ''
                . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
                . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">Great news — your deposit has been <strong>confirmed and credited</strong> to your Prime X Capital Funding Wallet.</p>'
                . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
                . '<tr><td style="padding:16px;font-size:13px;line-height:1.75;color:#374151;">'
                . '<strong>Credited Amount:</strong> <span style="color:#00B87C;font-weight:800;">' . $safeAmount . '</span><br>'
                . '<strong>Network:</strong> ' . $safeNetwork . '<br>'
                . '<strong>Reference ID:</strong> <span style="font-family:monospace;">' . $safeId . '</span><br>'
                . '<strong>Status:</strong> Confirmed &amp; Credited<br>'
                . '<strong>Processed At:</strong> ' . $safeTime
                . '</td></tr></table>'
                . '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 16px;"><tr><td>'
                . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">Open Wallet</a>'
                . '</td></tr></table>';
            $html = primex_email_layout(
                'Deposit Confirmed',
                'Your funds have been credited to your Prime X Capital account.',
                $bodyHtml,
                'Thank you for trading with Prime X Capital.',
                'DEPOSIT CREDITED',
                '#00B87C',
                '#ECFDF5'
            );
            $text = "{$greeting}\n\nYour deposit of {$formattedAmount} ({$network}) has been confirmed and credited to your Prime X Capital account.\nReference ID: {$depositId}\nProcessed At: {$processedAtUtc}\n\nOpen Wallet: {$walletUrl}\n\nPrime X Capital\nhttps://prime-x-capital.com";
        } else {
            $subject = "Deposit request update ({$formattedAmount}) — Prime X Capital";
            $bodyHtml = ''
                . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
                . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">Your deposit request could not be confirmed by compliance review.</p>'
                . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background-color:#FEF2F2;border:1px solid #FECACA;border-radius:12px;">'
                . '<tr><td style="padding:16px;font-size:13px;line-height:1.75;color:#7F1D1D;">'
                . '<strong>Amount:</strong> ' . $safeAmount . ' (' . $safeNetwork . ')<br>'
                . '<strong>Reference ID:</strong> <span style="font-family:monospace;">' . $safeId . '</span><br>'
                . '<strong>Reason:</strong> ' . $safeReason . '<br>'
                . '<strong>Reviewed At:</strong> ' . $safeTime
                . '</td></tr></table>'
                . '<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td>'
                . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">Open Prime X Capital</a>'
                . '</td></tr></table>';
            $html = primex_email_layout(
                'Deposit Request Declined',
                'Please review the compliance note regarding your deposit submission.',
                $bodyHtml,
                'Need assistance? Reach out via Live Support inside your dashboard.',
                'ACTION REQUIRED',
                '#DC2626',
                '#FEF2F2'
            );
            $text = "{$greeting}\n\nYour deposit request of {$formattedAmount} ({$network}) was not approved.\nReference ID: {$depositId}\nReason: " . ($reason ?: 'Please contact support for details.') . "\nReviewed At: {$processedAtUtc}\n\nPrime X Capital\nhttps://prime-x-capital.com";
        }

        return ['subject' => $subject, 'html' => $html, 'text' => $text];
    }
}

if (!function_exists('primex_email_template_withdrawal_requested')) {
    function primex_email_template_withdrawal_requested(
        string $recipientName,
        float $amount,
        float $fee,
        float $netAmount,
        string $asset,
        string $network,
        string $destination,
        string $withdrawalId,
        string $submittedAtUtc,
        string $historyUrl
    ): array {
        $greeting = $recipientName !== '' ? ('Hello ' . $recipientName . ',') : 'Hello,';
        $safeGreeting = primex_email_escape($greeting);
        $unit = strtoupper(trim($asset ?: 'USDT'));
        $formattedAmount = number_format($amount, 2) . ' ' . $unit;
        $formattedNet = number_format($netAmount, 2) . ' ' . $unit;
        $formattedFee = number_format($fee, 2) . ' ' . $unit;
        $safeAmount = primex_email_escape($formattedAmount);
        $safeNet = primex_email_escape($formattedNet);
        $safeFee = primex_email_escape($formattedFee);
        $safeNetwork = primex_email_escape(strtoupper(trim($network ?: 'TRC20')));
        $safeDest = primex_email_escape($destination);
        $safeId = primex_email_escape($withdrawalId);
        $safeTime = primex_email_escape($submittedAtUtc);
        $safeUrl = primex_email_escape($historyUrl);
        $subject = "Withdrawal request received ({$formattedAmount}) — Prime X Capital";

        $bodyHtml = ''
            . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
            . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">Your withdrawal request on <strong>Prime X Capital</strong> has been confirmed and queued for security review.</p>'
            . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
            . '<tr><td style="padding:16px;font-size:13px;line-height:1.75;color:#374151;">'
            . '<strong>Requested Amount:</strong> <span style="color:#0052FF;font-weight:800;">' . $safeAmount . '</span><br>'
            . '<strong>Network Fee:</strong> ' . $safeFee . '<br>'
            . '<strong>Net Payout:</strong> <strong>' . $safeNet . '</strong><br>'
            . '<strong>Network:</strong> ' . $safeNetwork . '<br>'
            . '<strong>Destination Address:</strong> <span style="font-family:monospace;word-break:break-all;">' . $safeDest . '</span><br>'
            . '<strong>Reference ID:</strong> <span style="font-family:monospace;">' . $safeId . '</span><br>'
            . '<strong>Submitted At:</strong> ' . $safeTime
            . '</td></tr></table>'
            . '<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px;"><tr><td>'
            . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">Track Withdrawal</a>'
            . '</td></tr></table>'
            . '<p style="margin:0;font-size:12.5px;line-height:1.55;color:#6B7280;">If you did not authorize this withdrawal request, contact Prime X Capital support immediately to freeze your account.</p>';

        $html = primex_email_layout(
            'Withdrawal Request Received',
            'Your withdrawal has been submitted for compliance clearance.',
            $bodyHtml,
            'Security notice: never share your withdrawal PIN or password with anyone.',
            'WITHDRAWAL QUEUED',
            '#0052FF',
            '#EFF4FF'
        );

        $text = "{$greeting}\n\n"
            . "Your Prime X Capital withdrawal request has been received.\n"
            . "Requested Amount: {$formattedAmount}\n"
            . "Network Fee: {$formattedFee}\n"
            . "Net Payout: {$formattedNet}\n"
            . "Network: " . strtoupper(trim($network ?: 'TRC20')) . "\n"
            . "Destination: {$destination}\n"
            . "Reference ID: {$withdrawalId}\n"
            . "Submitted At: {$submittedAtUtc}\n\n"
            . "If you did not request this withdrawal, contact Prime X Capital support immediately.\n\n"
            . "Prime X Capital\nhttps://prime-x-capital.com";

        return ['subject' => $subject, 'html' => $html, 'text' => $text];
    }
}

if (!function_exists('primex_email_template_withdrawal_status')) {
    function primex_email_template_withdrawal_status(
        string $recipientName,
        string $decision,
        float $amount,
        float $netAmount,
        string $asset,
        string $network,
        string $destination,
        string $withdrawalId,
        string $txHash,
        string $reason,
        string $processedAtUtc,
        string $walletUrl
    ): array {
        $isApproved = in_array(strtoupper(trim($decision)), ['APPROVE', 'APPROVED', 'COMPLETED', 'CONFIRMED'], true);
        $greeting = $recipientName !== '' ? ('Hello ' . $recipientName . ',') : 'Hello,';
        $safeGreeting = primex_email_escape($greeting);
        $unit = strtoupper(trim($asset ?: 'USDT'));
        $formattedAmount = number_format($amount, 2) . ' ' . $unit;
        $formattedNet = number_format($netAmount > 0 ? $netAmount : $amount, 2) . ' ' . $unit;
        $safeNet = primex_email_escape($formattedNet);
        $safeAmount = primex_email_escape($formattedAmount);
        $safeNetwork = primex_email_escape(strtoupper(trim($network ?: 'TRC20')));
        $safeDest = primex_email_escape($destination);
        $safeId = primex_email_escape($withdrawalId);
        $safeTx = primex_email_escape($txHash);
        $safeTime = primex_email_escape($processedAtUtc);
        $safeReason = primex_email_escape($reason !== '' ? $reason : 'Please contact support for details.');
        $safeUrl = primex_email_escape($walletUrl);

        if ($isApproved) {
            $subject = "Withdrawal approved & processed ({$formattedNet}) — Prime X Capital";
            $bodyHtml = ''
                . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
                . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">Your withdrawal request has been <strong>approved and dispatched</strong> to your designated wallet address.</p>'
                . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
                . '<tr><td style="padding:16px;font-size:13px;line-height:1.75;color:#374151;">'
                . '<strong>Net Sent:</strong> <span style="color:#00B87C;font-weight:800;">' . $safeNet . '</span><br>'
                . '<strong>Network:</strong> ' . $safeNetwork . '<br>'
                . ($safeDest !== '' ? '<strong>Destination:</strong> <span style="font-family:monospace;word-break:break-all;">' . $safeDest . '</span><br>' : '')
                . ($safeTx !== '' ? '<strong>TX Hash:</strong> <span style="font-family:monospace;word-break:break-all;">' . $safeTx . '</span><br>' : '')
                . '<strong>Reference ID:</strong> <span style="font-family:monospace;">' . $safeId . '</span><br>'
                . '<strong>Processed At:</strong> ' . $safeTime
                . '</td></tr></table>'
                . '<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td>'
                . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">View Wallet</a>'
                . '</td></tr></table>';
            $html = primex_email_layout(
                'Withdrawal Approved',
                'Your funds have been released on the blockchain.',
                $bodyHtml,
                'Thank you for choosing Prime X Capital.',
                'WITHDRAWAL SENT',
                '#00B87C',
                '#ECFDF5'
            );
            $text = "{$greeting}\n\nYour withdrawal of {$formattedNet} ({$network}) has been approved and processed.\nReference ID: {$withdrawalId}\nTX Hash: {$txHash}\nProcessed At: {$processedAtUtc}\n\nPrime X Capital\nhttps://prime-x-capital.com";
        } else {
            $subject = "Withdrawal request update ({$formattedAmount}) — Prime X Capital";
            $bodyHtml = ''
                . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
                . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">Your withdrawal request could not be completed and the funds have been <strong>returned to your wallet balance</strong>.</p>'
                . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background-color:#FEF2F2;border:1px solid #FECACA;border-radius:12px;">'
                . '<tr><td style="padding:16px;font-size:13px;line-height:1.75;color:#7F1D1D;">'
                . '<strong>Amount Refunded:</strong> ' . $safeAmount . ' (' . $safeNetwork . ')<br>'
                . '<strong>Reference ID:</strong> <span style="font-family:monospace;">' . $safeId . '</span><br>'
                . '<strong>Reason:</strong> ' . $safeReason . '<br>'
                . '<strong>Reviewed At:</strong> ' . $safeTime
                . '</td></tr></table>'
                . '<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td>'
                . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">Check Wallet Balance</a>'
                . '</td></tr></table>';
            $html = primex_email_layout(
                'Withdrawal Returned to Wallet',
                'Your requested withdrawal was declined and your balance was restored.',
                $bodyHtml,
                'Contact Live Support inside Prime X Capital for compliance assistance.',
                'REFUNDED TO WALLET',
                '#DC2626',
                '#FEF2F2'
            );
            $text = "{$greeting}\n\nYour withdrawal request of {$formattedAmount} ({$network}) was not approved and has been refunded to your wallet.\nReference ID: {$withdrawalId}\nReason: " . ($reason ?: 'Please contact support.') . "\nReviewed At: {$processedAtUtc}\n\nPrime X Capital\nhttps://prime-x-capital.com";
        }

        return ['subject' => $subject, 'html' => $html, 'text' => $text];
    }
}

if (!function_exists('primex_email_template_kyc_status')) {
    function primex_email_template_kyc_status(
        string $recipientName,
        string $decision,
        string $reason,
        string $reviewedAtUtc,
        string $platformUrl
    ): array {
        $isApproved = in_array(strtoupper(trim($decision)), ['APPROVE', 'APPROVED', 'VERIFIED'], true);
        $greeting = $recipientName !== '' ? ('Hello ' . $recipientName . ',') : 'Hello,';
        $safeGreeting = primex_email_escape($greeting);
        $safeTime = primex_email_escape($reviewedAtUtc);
        $safeReason = primex_email_escape($reason !== '' ? $reason : 'Please submit clearer identity documents.');
        $safeUrl = primex_email_escape($platformUrl);

        if ($isApproved) {
            $subject = 'Identity verification (KYC) approved — Prime X Capital';
            $bodyHtml = ''
                . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
                . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">Congratulations — your <strong>Real-Name Identity Verification (KYC)</strong> has been approved by our compliance team.</p>'
                . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background-color:#F7F8FA;border:1px solid #EEF1F6;border-radius:12px;">'
                . '<tr><td style="padding:16px;font-size:13px;line-height:1.75;color:#374151;">'
                . '<strong>Verification Status:</strong> <span style="color:#00B87C;font-weight:800;">KYC Approved</span><br>'
                . '<strong>Account Privileges:</strong> Full trading, signals, and higher withdrawal limits unlocked<br>'
                . '<strong>Approved At:</strong> ' . $safeTime
                . '</td></tr></table>'
                . '<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td>'
                . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">Open Prime X Capital</a>'
                . '</td></tr></table>';
            $html = primex_email_layout(
                'KYC Verification Approved',
                'Your Prime X Capital account is now fully verified.',
                $bodyHtml,
                'Thank you for completing verification with Prime X Capital.',
                'KYC APPROVED',
                '#00B87C',
                '#ECFDF5'
            );
            $text = "{$greeting}\n\nYour Prime X Capital identity verification (KYC) has been approved.\nAll trading and withdrawal features are now active.\nApproved At: {$reviewedAtUtc}\n\nOpen platform: {$platformUrl}\n\nPrime X Capital\nhttps://prime-x-capital.com";
        } else {
            $subject = 'Identity verification (KYC) update — Prime X Capital';
            $bodyHtml = ''
                . '<p style="margin:0 0 14px;font-size:14.5px;line-height:1.65;color:#374151;">' . $safeGreeting . '</p>'
                . '<p style="margin:0 0 18px;font-size:14.5px;line-height:1.65;color:#374151;">We were unable to approve your recent KYC identity submission. Please review the reason below and resubmit your documents.</p>'
                . '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px;background-color:#FEF2F2;border:1px solid #FECACA;border-radius:12px;">'
                . '<tr><td style="padding:16px;font-size:13px;line-height:1.75;color:#7F1D1D;">'
                . '<strong>Status:</strong> Declined<br>'
                . '<strong>Reason:</strong> ' . $safeReason . '<br>'
                . '<strong>Reviewed At:</strong> ' . $safeTime
                . '</td></tr></table>'
                . '<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td>'
                . '<a href="' . $safeUrl . '" style="display:inline-block;padding:14px 26px;background-color:#0052FF;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;border-radius:12px;">Resubmit KYC</a>'
                . '</td></tr></table>';
            $html = primex_email_layout(
                'KYC Verification Update',
                'Additional action is needed to complete your identity verification.',
                $bodyHtml,
                'Need help? Contact Prime X Capital support inside the app.',
                'RESUBMISSION NEEDED',
                '#DC2626',
                '#FEF2F2'
            );
            $text = "{$greeting}\n\nYour Prime X Capital KYC submission requires resubmission.\nReason: " . ($reason ?: 'Please submit clearer identity documents.') . "\nReviewed At: {$reviewedAtUtc}\n\nResubmit at: {$platformUrl}\n\nPrime X Capital\nhttps://prime-x-capital.com";
        }

        return ['subject' => $subject, 'html' => $html, 'text' => $text];
    }
}

