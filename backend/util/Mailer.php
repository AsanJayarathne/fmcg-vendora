<?php
// ============================================================
// Mailer Utility — Pure PHP SMTP Client over TLS (Zero-Dependency)
// Compatible with Gmail SMTP (smtp.gmail.com:587)
// ============================================================

class Mailer {
    private string $host;
    private int $port;
    private string $username;
    private string $password;
    private string $fromEmail;
    private string $fromName;

    public function __construct() {
        $env = parse_ini_file(__DIR__ . '/../.env') ?: [];
        $this->host      = $env['SMTP_HOST']       ?? 'smtp.gmail.com';
        $this->port      = (int)($env['SMTP_PORT'] ?? 587);
        $this->username  = trim($env['SMTP_USER']  ?? '');
        $this->password  = trim($env['SMTP_PASS']  ?? '');
        $this->fromName  = trim($env['SMTP_FROM_NAME']  ?? 'Vendora FMCG');
        $this->fromEmail = trim($env['SMTP_FROM_EMAIL'] ?? ($this->username ?: 'no-reply@vendora.lk'));
    }

    /**
     * Sends an HTML email via SMTP TLS socket.
     * Falls back to file logging if SMTP credentials are not yet configured.
     */
    public function sendMail(string $toEmail, string $toName, string $subject, string $htmlBody, string $altBody = ''): bool {
        // If SMTP is not yet configured with real credentials, write to local mail log for smooth testing
        if (empty($this->username) || empty($this->password)) {
            $this->logMailFallback($toEmail, $subject, $htmlBody);
            return true;
        }

        try {
            $socket = @stream_socket_client(
                "tcp://{$this->host}:{$this->port}",
                $errno,
                $errstr,
                15,
                STREAM_CLIENT_CONNECT
            );

            if (!$socket) {
                error_log("Mailer connection failed: $errstr ($errno)");
                $this->logMailFallback($toEmail, $subject, $htmlBody);
                return false;
            }

            stream_set_timeout($socket, 15);
            $this->readResponse($socket, 220);

            // EHLO
            $this->sendCommand($socket, "EHLO " . gethostname(), 250);

            // STARTTLS
            $this->sendCommand($socket, "STARTTLS", 220);

            // Enable TLS Crypto on socket
            $cryptoMethod = STREAM_CRYPTO_METHOD_TLS_CLIENT;
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
                $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
            }
            if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
            }

            if (!stream_socket_enable_crypto($socket, true, $cryptoMethod)) {
                fclose($socket);
                throw new Exception("TLS negotiation failed");
            }

            // EHLO again after TLS handshake
            $this->sendCommand($socket, "EHLO " . gethostname(), 250);

            // AUTH LOGIN
            $this->sendCommand($socket, "AUTH LOGIN", 334);
            $this->sendCommand($socket, base64_encode($this->username), 334);
            $this->sendCommand($socket, base64_encode($this->password), 235);

            // Mail Transaction
            $this->sendCommand($socket, "MAIL FROM:<{$this->fromEmail}>", 250);
            $this->sendCommand($socket, "RCPT TO:<{$toEmail}>", 250);
            $this->sendCommand($socket, "DATA", 354);

            // Construct MIME message
            $boundary = "----=_VendoraPart_" . md5((string)microtime(true));
            $headers  = [];
            $headers[] = "MIME-Version: 1.0";
            $headers[] = "From: =?UTF-8?B?" . base64_encode($this->fromName) . "?= <{$this->fromEmail}>";
            $headers[] = "To: =?UTF-8?B?" . base64_encode($toName ?: $toEmail) . "?= <{$toEmail}>";
            $headers[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
            $headers[] = "Date: " . date('r');
            $headers[] = "X-Mailer: Vendora FMCG System Mailer";
            $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";

            $body  = implode("\r\n", $headers) . "\r\n\r\n";
            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= chunk_split(base64_encode($altBody ?: strip_tags($htmlBody))) . "\r\n";

            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: text/html; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= chunk_split(base64_encode($htmlBody)) . "\r\n";

            $body .= "--{$boundary}--\r\n";
            $body .= ".\r\n";

            fwrite($socket, $body);
            $this->readResponse($socket, 250);

            // QUIT
            $this->sendCommand($socket, "QUIT", 221);
            fclose($socket);
            return true;

        } catch (Exception $e) {
            error_log("Mailer Exception: " . $e->getMessage());
            $this->logMailFallback($toEmail, $subject, $htmlBody);
            return false;
        }
    }

    /**
     * Send 6-Digit Email Verification Code (OTP)
     */
    public function sendVerificationOtp(string $toEmail, string $toName, string $otpCode): bool {
        $subject = "Your Vendora FMCG Verification Code: {$otpCode}";
        $html = $this->buildOtpTemplate($toName ?: 'Vendora Partner', $otpCode);
        return $this->sendMail($toEmail, $toName, $subject, $html);
    }

    /**
     * Send Password Reset Link Email
     */
    public function sendPasswordReset(string $toEmail, string $toName, string $resetUrl): bool {
        $subject = "Reset Your Vendora FMCG Password";
        $html = $this->buildPasswordResetTemplate($toName ?: 'Vendora Partner', $resetUrl);
        return $this->sendMail($toEmail, $toName, $subject, $html);
    }

    /**
     * Send Retailer Registration Approval Notification
     */
    public function sendRetailerApproval(string $toEmail, string $toName, string $shopName, string $distributorName, ?string $loginUrl = null): bool {
        $env = parse_ini_file(__DIR__ . '/../.env') ?: [];
        $url = $loginUrl ?: (($env['FRONTEND_RETAILER_URL'] ?? 'http://localhost:5176') . '/login');
        $subject = "Congratulations! Your Vendora FMCG Retailer Account is Approved";
        $html = $this->buildRetailerApprovalTemplate($toName ?: 'Valued Retailer', $shopName, $distributorName, $url);
        return $this->sendMail($toEmail, $toName, $subject, $html);
    }

    /**
     * Send Retailer Registration Rejection Notification
     */
    public function sendRetailerRejection(string $toEmail, string $toName, string $shopName, string $distributorName, ?string $reason = null): bool {
        $subject = "Update regarding your Vendora FMCG Retailer Application";
        $html = $this->buildRetailerRejectionTemplate($toName ?: 'Valued Partner', $shopName, $distributorName, $reason);
        return $this->sendMail($toEmail, $toName, $subject, $html);
    }

    /**
     * Send Password Changed Security Alert Notification
     */
    public function sendPasswordChangedAlert(string $toEmail, string $toName, ?string $changedAt = null, ?string $loginUrl = null): bool {
        $env = parse_ini_file(__DIR__ . '/../.env') ?: [];
        $url = $loginUrl ?: (($env['FRONTEND_RETAILER_URL'] ?? 'http://localhost:5176') . '/login');
        $timeStr = $changedAt ?: date('F j, Y, g:i A T');
        $subject = "Security Alert: Your Vendora FMCG Password Was Changed";
        $html = $this->buildPasswordChangedTemplate($toName ?: 'Vendora Partner', $timeStr, $url);
        return $this->sendMail($toEmail, $toName, $subject, $html);
    }

    // ─── HTML Email Templates ────────────────────────────────────────────────

    private function buildOtpTemplate(string $name, string $code): string {
        $digits = str_split($code);
        $codeHtml = '';
        foreach ($digits as $digit) {
            $codeHtml .= '<span style="display:inline-block; margin: 0 4px; width: 44px; height: 50px; line-height: 50px; text-align: center; font-size: 26px; font-weight: 800; color: #2446D8; background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 10px;">' . htmlspecialchars($digit) . '</span>';
        }

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vendora Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1E293B;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; padding: 40px 20px;">
  <tr>
    <td align="center">
      <table width="100%" max-width="560px" style="max-width:560px; background:#FFFFFF; border-radius:20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow:hidden; border: 1px solid #E2E8F0;" cellpadding="0" cellspacing="0">
        
        <!-- Header Banner -->
        <tr>
          <td style="background: linear-gradient(135deg, #2446D8 0%, #1A36AA 100%); padding: 35px 30px; text-align: center;">
            <div style="display:inline-block; width: 48px; height: 48px; background: #FFFFFF; border-radius: 14px; text-align: center; line-height: 48px; font-size: 26px; font-weight: 900; color: #2446D8; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">V</div>
            <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Vendora FMCG</h1>
            <p style="margin: 6px 0 0 0; color: #E0E7FF; font-size: 13px; font-weight: 500;">B2B Supply Chain Network</p>
          </td>
        </tr>

        <!-- Main Body -->
        <tr>
          <td style="padding: 35px 30px;">
            <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 20px; font-weight: 700;">Verify Your Email Address</h2>
            <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">Hello <strong>{$name}</strong>,<br>Thank you for registering with Vendora FMCG. Please use the 6-digit verification code below to verify your email address and activate your registration.</p>
            
            <!-- Code Box -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #F8FAFC; border-radius: 14px; border: 1px dashed #CBD5E1;">
              <p style="margin: 0 0 12px 0; color: #64748B; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Verification Code</p>
              <div>{$codeHtml}</div>
              <p style="margin: 15px 0 0 0; color: #EF4444; font-size: 12px; font-weight: 600;">⏱ Valid for 15 minutes only</p>
            </div>

            <p style="margin: 0 0 10px 0; color: #64748B; font-size: 13px; line-height: 1.5;">If you did not request this registration, please safely ignore this email. Do not share this code with anyone.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #F1F5F9; padding: 20px 30px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="margin: 0; color: #94A3B8; font-size: 12px;">© " . date('Y') . " Vendora FMCG Platform. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
    }

    private function buildPasswordResetTemplate(string $name, string $resetUrl): string {
        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1E293B;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; padding: 40px 20px;">
  <tr>
    <td align="center">
      <table width="100%" max-width="560px" style="max-width:560px; background:#FFFFFF; border-radius:20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow:hidden; border: 1px solid #E2E8F0;" cellpadding="0" cellspacing="0">
        
        <!-- Header Banner -->
        <tr>
          <td style="background: linear-gradient(135deg, #2446D8 0%, #1A36AA 100%); padding: 35px 30px; text-align: center;">
            <div style="display:inline-block; width: 48px; height: 48px; background: #FFFFFF; border-radius: 14px; text-align: center; line-height: 48px; font-size: 26px; font-weight: 900; color: #2446D8; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">V</div>
            <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Vendora FMCG</h1>
            <p style="margin: 6px 0 0 0; color: #E0E7FF; font-size: 13px; font-weight: 500;">Password Recovery Request</p>
          </td>
        </tr>

        <!-- Main Body -->
        <tr>
          <td style="padding: 35px 30px;">
            <h2 style="margin: 0 0 12px 0; color: #0F172A; font-size: 20px; font-weight: 700;">Reset Your Password</h2>
            <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">Hello <strong>{$name}</strong>,<br>We received a request to reset your password for your Vendora FMCG account. Click the button below to choose a new password.</p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="{$resetUrl}" target="_blank" style="display: inline-block; background-color: #2446D8; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 700; padding: 14px 34px; border-radius: 30px; box-shadow: 0 4px 14px rgba(36, 70, 216, 0.35);">Reset Password</a>
              <p style="margin: 15px 0 0 0; color: #EF4444; font-size: 12px; font-weight: 600;">⏱ This link expires in 15 minutes</p>
            </div>

            <!-- Fallback URL -->
            <div style="margin-top: 25px; padding: 15px; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
              <p style="margin: 0 0 6px 0; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase;">Button not working? Copy and paste this URL:</p>
              <p style="margin: 0; color: #2446D8; font-size: 12px; word-break: break-all;"><a href="{$resetUrl}" style="color: #2446D8; text-decoration: underline;">{$resetUrl}</a></p>
            </div>

            <p style="margin: 25px 0 0 0; color: #64748B; font-size: 13px; line-height: 1.5;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #F1F5F9; padding: 20px 30px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="margin: 0; color: #94A3B8; font-size: 12px;">© " . date('Y') . " Vendora FMCG Platform. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
    }

    private function buildRetailerApprovalTemplate(string $name, string $shopName, string $distributorName, string $loginUrl): string {
        $year = date('Y');
        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeShop = htmlspecialchars($shopName, ENT_QUOTES, 'UTF-8');
        $safeDist = htmlspecialchars($distributorName, ENT_QUOTES, 'UTF-8');
        $safeUrl  = htmlspecialchars($loginUrl, ENT_QUOTES, 'UTF-8');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Account Approved - Vendora FMCG</title>
</head>
<body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1E293B;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; padding: 40px 20px;">
  <tr>
    <td align="center">
      <table width="100%" max-width="580px" style="max-width:580px; background:#FFFFFF; border-radius:20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow:hidden; border: 1px solid #E2E8F0;" cellpadding="0" cellspacing="0">
        
        <!-- Header Banner -->
        <tr>
          <td style="background: linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%); padding: 35px 30px; text-align: center;">
            <div style="display:inline-block; width: 52px; height: 52px; background: #FFFFFF; border-radius: 50%; text-align: center; line-height: 52px; font-size: 26px; color: #059669; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">✓</div>
            <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Account Approved!</h1>
            <p style="margin: 6px 0 0 0; color: #D1FAE5; font-size: 14px; font-weight: 500;">Welcome to the Vendora FMCG Network</p>
          </td>
        </tr>

        <!-- Main Body -->
        <tr>
          <td style="padding: 35px 30px;">
            <p style="margin: 0 0 16px 0; color: #0F172A; font-size: 18px; font-weight: 700;">Hello {$safeName},</p>
            <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">Great news! Your retailer application for <strong>{$safeShop}</strong> has been officially reviewed and <span style="color: #059669; font-weight: 700;">approved</span> by your regional distributor.</p>
            
            <!-- Details Card -->
            <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 14px; padding: 20px; margin: 25px 0;">
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                <tr>
                  <td style="color: #64748B; width: 40%; font-weight: 600;">Shop Name:</td>
                  <td style="color: #0F172A; font-weight: 700;">{$safeShop}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; font-weight: 600;">Approved By:</td>
                  <td style="color: #0F172A; font-weight: 700;">{$safeDist}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; font-weight: 600;">Account Status:</td>
                  <td><span style="display:inline-block; background:#DCFCE7; color:#15803D; font-weight:700; padding:3px 10px; border-radius:12px; font-size:12px;">Active & Verified</span></td>
                </tr>
              </table>
            </div>

            <p style="margin: 0 0 25px 0; color: #475569; font-size: 15px; line-height: 1.6;">You can now log in to the <strong>Vendora Retailer Portal</strong>, browse product catalogs, request stock, and place FMCG orders directly with your regional distributor.</p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="{$safeUrl}" target="_blank" style="display: inline-block; background-color: #2446D8; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 700; padding: 14px 38px; border-radius: 30px; box-shadow: 0 4px 14px rgba(36, 70, 216, 0.35);">Log In to Retailer Portal</a>
            </div>

            <!-- Fallback URL -->
            <div style="margin-top: 25px; padding: 14px; background: #F8FAFC; border-radius: 10px; border: 1px solid #E2E8F0;">
              <p style="margin: 0 0 6px 0; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase;">Direct Login Link:</p>
              <p style="margin: 0; color: #2446D8; font-size: 12px; word-break: break-all;"><a href="{$safeUrl}" style="color: #2446D8; text-decoration: underline;">{$safeUrl}</a></p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #F1F5F9; padding: 20px 30px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="margin: 0; color: #94A3B8; font-size: 12px;">© {$year} Vendora FMCG Platform. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
    }

    private function buildRetailerRejectionTemplate(string $name, string $shopName, string $distributorName, ?string $reason): string {
        $year = date('Y');
        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeShop = htmlspecialchars($shopName, ENT_QUOTES, 'UTF-8');
        $safeDist = htmlspecialchars($distributorName, ENT_QUOTES, 'UTF-8');
        $reasonHtml = $reason ? '<p style="margin: 10px 0 0 0; color: #991B1B; font-size: 13px;"><strong>Reason:</strong> ' . htmlspecialchars($reason, ENT_QUOTES, 'UTF-8') . '</p>' : '';

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Application Status - Vendora FMCG</title>
</head>
<body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1E293B;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; padding: 40px 20px;">
  <tr>
    <td align="center">
      <table width="100%" max-width="580px" style="max-width:580px; background:#FFFFFF; border-radius:20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow:hidden; border: 1px solid #E2E8F0;" cellpadding="0" cellspacing="0">
        
        <!-- Header Banner -->
        <tr>
          <td style="background: linear-gradient(135deg, #64748B 0%, #475569 100%); padding: 35px 30px; text-align: center;">
            <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Vendora FMCG</h1>
            <p style="margin: 6px 0 0 0; color: #E2E8F0; font-size: 13px; font-weight: 500;">Retailer Application Status Update</p>
          </td>
        </tr>

        <!-- Main Body -->
        <tr>
          <td style="padding: 35px 30px;">
            <p style="margin: 0 0 16px 0; color: #0F172A; font-size: 18px; font-weight: 700;">Hello {$safeName},</p>
            <p style="margin: 0 0 16px 0; color: #475569; font-size: 15px; line-height: 1.6;">Thank you for your interest in joining the Vendora FMCG network. We are writing to inform you that your retailer application for <strong>{$safeShop}</strong> could not be approved by regional distributor <strong>{$safeDist}</strong> at this time.</p>
            
            <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; color: #991B1B; font-size: 13px; line-height: 1.5;">If you believe this decision was made in error or if your business details have updated, please reach out to your regional distributor or contact our support team.</p>
              {$reasonHtml}
            </div>

            <p style="margin: 20px 0 0 0; color: #64748B; font-size: 13px; line-height: 1.5;">Thank you for your understanding.</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #F1F5F9; padding: 20px 30px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="margin: 0; color: #94A3B8; font-size: 12px;">© {$year} Vendora FMCG Platform. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
    }

    private function buildPasswordChangedTemplate(string $name, string $timeStr, string $loginUrl): string {
        $year = date('Y');
        $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $safeTime = htmlspecialchars($timeStr, ENT_QUOTES, 'UTF-8');
        $safeUrl = htmlspecialchars($loginUrl, ENT_QUOTES, 'UTF-8');

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Changed - Vendora FMCG</title>
</head>
<body style="margin:0; padding:0; background-color:#F8FAFC; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1E293B;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; padding: 40px 20px;">
  <tr>
    <td align="center">
      <table width="100%" max-width="580px" style="max-width:580px; background:#FFFFFF; border-radius:20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); overflow:hidden; border: 1px solid #E2E8F0;" cellpadding="0" cellspacing="0">
        
        <!-- Header Banner -->
        <tr>
          <td style="background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); padding: 35px 30px; text-align: center;">
            <div style="display:inline-block; width: 52px; height: 52px; background: #334155; border-radius: 50%; text-align: center; line-height: 52px; font-size: 24px; color: #38BDF8; margin-bottom: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">🔒</div>
            <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Security Notification</h1>
            <p style="margin: 6px 0 0 0; color: #94A3B8; font-size: 13px; font-weight: 500;">Password Change Confirmation</p>
          </td>
        </tr>

        <!-- Main Body -->
        <tr>
          <td style="padding: 35px 30px;">
            <p style="margin: 0 0 16px 0; color: #0F172A; font-size: 18px; font-weight: 700;">Hello {$safeName},</p>
            <p style="margin: 0 0 20px 0; color: #475569; font-size: 15px; line-height: 1.6;">This email confirms that the password for your Vendora FMCG account was successfully updated.</p>
            
            <!-- Event Card -->
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px; margin: 20px 0;">
              <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 14px;">
                <tr>
                  <td style="color: #64748B; width: 35%; font-weight: 600;">Activity:</td>
                  <td style="color: #0F172A; font-weight: 700;">Password Updated</td>
                </tr>
                <tr>
                  <td style="color: #64748B; font-weight: 600;">Time of Change:</td>
                  <td style="color: #0F172A; font-weight: 600;">{$safeTime}</td>
                </tr>
                <tr>
                  <td style="color: #64748B; font-weight: 600;">Status:</td>
                  <td><span style="display:inline-block; background:#DCFCE7; color:#15803D; font-weight:700; padding:3px 10px; border-radius:12px; font-size:12px;">Successful</span></td>
                </tr>
              </table>
            </div>

            <!-- Warning Callout -->
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 18px; margin: 24px 0;">
              <p style="margin: 0 0 8px 0; color: #B45309; font-weight: 700; font-size: 14px;">Did you make this change?</p>
              <p style="margin: 0; color: #78350F; font-size: 13px; line-height: 1.5;">
                • <strong>Yes, this was me:</strong> You can safely disregard this email. Your new password is now active.<br>
                • <strong>No, this wasn't me:</strong> Your account may be compromised. Please reset your password immediately or contact Vendora support.
              </p>
            </div>

            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0 10px 0;">
              <a href="{$safeUrl}" target="_blank" style="display: inline-block; background-color: #2446D8; color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: 700; padding: 13px 34px; border-radius: 28px; box-shadow: 0 4px 14px rgba(36, 70, 216, 0.3);">Access Your Account</a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #F1F5F9; padding: 20px 30px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="margin: 0; color: #94A3B8; font-size: 12px;">© {$year} Vendora FMCG Platform. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
HTML;
    }

    // ─── Socket / Protocol Helpers ───────────────────────────────────────────

    private function sendCommand($socket, string $command, int $expectedCode): string {
        fwrite($socket, $command . "\r\n");
        return $this->readResponse($socket, $expectedCode);
    }

    private function readResponse($socket, int $expectedCode): string {
        $response = '';
        while (($line = fgets($socket, 512)) !== false) {
            $response .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }
        $code = (int)substr($response, 0, 3);
        if ($code !== $expectedCode) {
            throw new Exception("SMTP Error: Expected $expectedCode but got $code. Response: " . trim($response));
        }
        return $response;
    }

    private function logMailFallback(string $to, string $subject, string $html): void {
        $dir = __DIR__ . '/../uploads/mail_logs';
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        $logFile = $dir . '/sent_emails.log';
        $logEntry = sprintf(
            "[%s] TO: %s | SUBJECT: %s\nBODY: %s\n------------------------------------------------------------\n",
            date('Y-m-d H:i:s'),
            $to,
            $subject,
            $html
        );
        @file_put_contents($logFile, $logEntry, FILE_APPEND);
    }
}
