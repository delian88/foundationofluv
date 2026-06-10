<?php
// PHP implementation of /api/send-email for Namecheap / Apache servers
// Place this in public/api/send-email.php so it builds to dist/api/send-email.php

// CORS and response headers
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
header("Content-Type: application/json");

// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

// Helper to load and parse .env values
function get_env_var($key) {
    // Try native getenv
    $val = getenv($key);
    if ($val !== false) return $val;
    if (isset($_ENV[$key])) return $_ENV[$key];
    
    // Potential .env paths
    $paths = [
        dirname(dirname(__DIR__)) . '/.env',  // If uploaded inside public_html/api/
        dirname(__DIR__) . '/.env',          // root of public_html
        __DIR__ . '/.env',                   // local
        $_SERVER['DOCUMENT_ROOT'] . '/.env'  // Document root
    ];
    
    foreach ($paths as $path) {
        if (file_exists($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || strpos($line, '#') === 0) continue;
                $parts = explode('=', $line, 2);
                if (count($parts) === 2 && trim($parts[0]) === $key) {
                    return trim($parts[1], " \t\n\r\0\x0B'\"");
                }
            }
        }
    }
    return '';
}

// Mail Dispatcher via SMTP (with standard PHP mail() fallback)
function dispatch_email($to, $subject, $html_body, $from_name = 'Foundation of Luv') {
    $host = get_env_var('SMTP_HOST');
    $port_str = get_env_var('SMTP_PORT');
    $port = $port_str ? intval($port_str) : 465;
    $user = get_env_var('SMTP_USER');
    $pass = get_env_var('SMTP_PASS');
    $secure = get_env_var('SMTP_SECURE') === 'true' || $port === 465;

    // Validate SMTP configuration; if missing, fall back to PHP mail()
    if (empty($host) || empty($user) || empty($pass)) {
        return send_native_mail($to, $subject, $html_body, $user ?: 'info@foundationofluv.org', $from_name);
    }

    try {
        return send_smtp_mail($host, $port, $secure, $user, $pass, $to, $subject, $html_body, $from_name);
    } catch (Exception $e) {
        // If SMTP fails, fall back to PHP native mail()
        error_log("SMTP dispatch failed: " . $e->getMessage() . ". Falling back to PHP mail().");
        return send_native_mail($to, $subject, $html_body, $user, $from_name);
    }
}

// Native PHP mail() fallback
function send_native_mail($to, $subject, $html_body, $from_email, $from_name) {
    $boundary = md5(uniqid(time()));
    $headers = [
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "From: =?utf-8?B?" . base64_encode($from_name) . "?= <" . $from_email . ">",
        "Reply-To: <" . $from_email . ">",
        "Date: " . date("r"),
        "X-Mailer: PHP/" . phpversion()
    ];
    
    return mail($to, "=?utf-8?B?" . base64_encode($subject) . "?=", $html_body, implode("\r\n", $headers));
}

// Direct Socket SMTP connection
function send_smtp_mail($host, $port, $secure, $user, $pass, $to, $subject, $html_body, $from_name) {
    $socket_host = $secure ? "ssl://" . $host : $host;
    $socket = @fsockopen($socket_host, $port, $errno, $errstr, 15);
    
    if (!$socket) {
        throw new Exception("Socket connection to $socket_host:$port failed: $errstr ($errno)");
    }
    
    function read_response($socket, $expected) {
        $response = "";
        while ($str = fgets($socket, 515)) {
            $response .= $str;
            if (substr($str, 3, 1) == " ") {
                break;
            }
        }
        $code = intval(substr($response, 0, 3));
        if ($code !== $expected) {
            throw new Exception("SMTP Expected code $expected, received response: $response");
        }
        return $response;
    }
    
    read_response($socket, 220);
    
    $server_name = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';
    fwrite($socket, "EHLO " . $server_name . "\r\n");
    read_response($socket, 250);
    
    fwrite($socket, "AUTH LOGIN\r\n");
    read_response($socket, 334);
    
    fwrite($socket, base64_encode($user) . "\r\n");
    read_response($socket, 334);
    
    fwrite($socket, base64_encode($pass) . "\r\n");
    read_response($socket, 235);
    
    fwrite($socket, "MAIL FROM:<" . $user . ">\r\n");
    read_response($socket, 250);
    
    fwrite($socket, "RCPT TO:<" . $to . ">\r\n");
    read_response($socket, 250);
    
    fwrite($socket, "DATA\r\n");
    read_response($socket, 354);
    
    $headers = [
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "From: =?utf-8?B?" . base64_encode($from_name) . "?= <" . $user . ">",
        "Reply-To: <" . $user . ">",
        "To: <" . $to . ">",
        "Subject: =?utf-8?B?" . base64_encode($subject) . "?=",
        "Date: " . date("r"),
        "X-Mailer: Namecheap PHP SMTP Gateway"
    ];
    
    $data = implode("\r\n", $headers) . "\r\n\r\n" . $html_body . "\r\n.\r\n";
    fwrite($socket, $data);
    read_response($socket, 250);
    
    fwrite($socket, "QUIT\r\n");
    fclose($socket);
    return true;
}

// Retrieve POST body
$input = file_get_contents("php://input");
$body = json_decode($input, true);

if (!$body || !isset($body['type']) || !isset($body['payload'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid or missing parameters"]);
    exit();
}

$type = $body['type'];
$payload = $body['payload'];

$admin_email = get_env_var('ADMIN_EMAIL');
if (empty($admin_email)) {
    $admin_email = 'info@azariahmg.com';
}

$default_header = '
<div style="background-color: #9c1c22; padding: 32px; text-align: center; border-bottom: 6px solid #eeb053;">
  <h1 style="color: #ffffff; font-family: \'Georgia\', serif; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">Foundation of Luv</h1>
  <p style="color: #eeb053; font-family: \'Arial\', sans-serif; font-size: 11px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px;">Love in Action, Change in Motion</p>
</div>
';

$default_footer = '
<div style="background-color: #1a1a1a; padding: 24px; text-align: center; margin-top: 40px; border-top: 1px solid #2a2a2a; color: #888888; font-family: \'Arial\', sans-serif; font-size: 11px;">
  <p style="margin: 0; text-transform: uppercase; letter-spacing: 1px;">&copy; 2026 Foundation of Luv. All Rights Reserved.</p>
  <p style="margin: 4px 0 0 0; color: #eeb053;">#9960 Raven Hurst Road, Middle River MD 21221</p>
  <p style="margin: 8px 0 0 0; font-style: italic; color: #555555;">This email was sent dynamically via the FOL Secure SMTP Portal.</p>
</div>
';

try {
    if ($type === 'registration') {
        $fullName = htmlspecialchars($payload['full_name'] ?? '');
        $email = htmlspecialchars($payload['email'] ?? '');
        $phone = htmlspecialchars($payload['phone'] ?? '');
        $city = htmlspecialchars($payload['city'] ?? 'Not specified');
        $organization = htmlspecialchars($payload['organization'] ?? 'None');
        $jobTitle = htmlspecialchars($payload['job_title'] ?? 'None');
        $profile = htmlspecialchars($payload['profile'] ?? '');
        
        $interestsArr = $payload['interests'] ?? [];
        $interests = is_array($interestsArr) ? implode(', ', $interestsArr) : htmlspecialchars($interestsArr);
        
        $cyberLevel = htmlspecialchars($payload['cybersecurity_level'] ?? 'Beginner');
        $finLevel = htmlspecialchars($payload['financial_level'] ?? 'Beginner');
        $referral = htmlspecialchars($payload['referral'] ?? 'Not specified');
        $specialNeeds = htmlspecialchars($payload['special_requirements'] ?? 'None');
        $questions = htmlspecialchars($payload['questions'] ?? 'None');
        $ticketType = htmlspecialchars($payload['ticket_type'] ?? 'free');
        $payMethod = htmlspecialchars($payload['payment_method'] ?? 'None');
        $payRef = htmlspecialchars($payload['payment_reference'] ?? 'None');

        $ticketLabel = 'General Admission (Free)';
        if ($ticketType === 'donation') {
            $ticketLabel = 'Donation';
        } elseif ($ticketType === 'vip') {
            $ticketLabel = 'VIP Ticket (with Certification)';
        }

        // 1. Send confirmation to applicant
        $applicant_html = '
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            ' . $default_header . '
            <div style="padding: 40px 32px; font-family: \'Arial\', sans-serif; line-height: 1.6; color: #333333;">
              <h2 style="font-family: \'Georgia\', serif; font-size: 20px; color: #111111; margin-top: 0; text-transform: uppercase;">Hello ' . $fullName . ',</h2>
              <p style="font-size: 15px; margin-bottom: 24px;">Thank you for registering for the upcoming <strong>Cybersecurity & Financial Literacy Workshop</strong>. Your application has been successfully received and registered in our database.</p>
              
              <div style="background-color: #fcfaf6; border-left: 4px solid #eeb053; padding: 20px; border-radius: 4px; margin-bottom: 28px;">
                <h3 style="margin-top: 0; font-family: \'Georgia\', serif; font-size: 16px; color: #9c1c22; text-transform: uppercase;">Event Details</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 100px;">Date:</td>
                    <td style="padding: 6px 0;">Saturday, July 18, 2026</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Time:</td>
                    <td style="padding: 6px 0;">10:00 AM - 3:00 PM EST</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Location:</td>
                    <td style="padding: 6px 0;">Online (Zoom Link Sent Prior to Event) & Hybrid at Middle River MD</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold;">Ticket Type:</td>
                    <td style="padding: 6px 0; text-transform: uppercase; color: #9c1c22; font-weight: bold;">' . $ticketLabel . '</td>
                  </tr>
                </table>
              </div>';

        if ($ticketType === 'vip') {
            $applicant_html .= '
                <div style="background-color: #f4e8e9; border: 1px solid #d4a3a6; padding: 20px; border-radius: 8px; margin-bottom: 28px;">
                  <h4 style="margin-top: 0; font-family: \'Georgia\', serif; color: #9c1c22; text-transform: uppercase;">VIP Registration Note</h4>
                  <p style="margin: 0; font-size: 14px; color: #555555;">Since you selected a VIP Ticket, we will verify your payment details shortly. Your VIP package includes an official Certificate of Completion, 1-on-1 coaching session, and permanent access to recorded video sessions.</p>
                </div>';
        }

        if ($ticketType === 'donation') {
            $applicant_html .= '
                <div style="background-color: #fcfaf6; border: 1px solid #eeb053; padding: 20px; border-radius: 8px; margin-bottom: 28px;">
                  <h4 style="margin-top: 0; font-family: \'Georgia\', serif; color: #9c1c22; text-transform: uppercase;">Thank you for your donation!</h4>
                  <p style="margin: 0; font-size: 14px; color: #555555;">Your kind donation (' . $payRef . ') helps keep our workshops and certification free of charge for future batches. We will verify your transaction shortly.</p>
                </div>';
        }

        $applicant_html .= '
              <p style="font-size: 15px; margin-bottom: 0;">If you have any questions or require special accommodations in the meantime, please do not hesitate to contact us at <a href="mailto:' . $admin_email . '" style="color: #9c1c22; text-decoration: none; font-weight: bold;">' . $admin_email . '</a>.</p>
              
              <div style="margin-top: 36px;">
                <p style="margin: 0; font-size: 14px; font-weight: bold;">Warm regards,</p>
                <p style="margin: 4px 0 0 0; font-family: \'Georgia\', serif; font-size: 15px; color: #9c1c22; font-style: italic;">The Foundation of Luv Team</p>
              </div>
            </div>
            ' . $default_footer . '
          </div>';
          
        dispatch_email($email, 'Registration Confirmed: Cybersecurity & Financial Literacy Workshop', $applicant_html);

        // 2. Send notification to admin
        $admin_html = '
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;">
            ' . $default_header . '
            <div style="padding: 40px 32px; font-family: \'Arial\', sans-serif; line-height: 1.6;">
              <h2 style="font-family: \'Georgia\', serif; font-size: 20px; color: #9c1c22; margin-top: 0; text-transform: uppercase;">New Registration Logged</h2>
              <p style="font-size: 14px; color: #666666;">A new participant has signed up for the Cybersecurity & Financial Literacy Workshop. Details are listed below:</p>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold; width: 150px;">Full Name</td>
                  <td style="padding: 10px;">' . $fullName . '</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Email</td>
                  <td style="padding: 10px;"><a href="mailto:' . $email . '" style="color: #9c1c22;">' . $email . '</a></td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Phone</td>
                  <td style="padding: 10px;">' . $phone . '</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">City/Town</td>
                  <td style="padding: 10px;">' . $city . '</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Organization</td>
                  <td style="padding: 10px;">' . $organization . '</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Job Title</td>
                  <td style="padding: 10px;">' . $jobTitle . '</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Profile</td>
                  <td style="padding: 10px;">' . $profile . '</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Interests</td>
                  <td style="padding: 10px;">' . $interests . '</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Cybersecurity Level</td>
                  <td style="padding: 10px;">' . $cyberLevel . '</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Financial Level</td>
                  <td style="padding: 10px;">' . $finLevel . '</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Referral Source</td>
                  <td style="padding: 10px;">' . $referral . '</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Special Needs</td>
                  <td style="padding: 10px;">' . $specialNeeds . '</td>
                </tr>
                <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Questions</td>
                  <td style="padding: 10px;">' . $questions . '</td>
                </tr>
                <tr style="border-bottom: 1px solid #eeeeee;">
                  <td style="padding: 10px; font-weight: bold;">Ticket Type</td>
                  <td style="padding: 10px; text-transform: uppercase; font-weight: bold; color: #9c1c22;">' . $ticketType . '</td>
                </tr>';

        if ($ticketType === 'vip' || $ticketType === 'donation') {
            $admin_html .= '
                  <tr style="background-color: #f9f9f9; border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 10px; font-weight: bold;">Payment Method</td>
                    <td style="padding: 10px;">' . $payMethod . '</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 10px; font-weight: bold;">Payment Ref # / Amount</td>
                    <td style="padding: 10px; font-family: monospace;">' . $payRef . '</td>
                  </tr>';
        }

        $admin_html .= '
              </table>
            </div>
            ' . $default_footer . '
          </div>';

        dispatch_email($admin_email, 'New Workshop Registration: ' . $fullName . ' (' . strtoupper($ticketType) . ')', $admin_html);
        
        echo json_encode(["success" => true, "message" => "Registration email sent successfully"]);
        exit();
    }
    
    if ($type === 'login_alert') {
        $email = htmlspecialchars($payload['email'] ?? '');
        $time = htmlspecialchars($payload['time'] ?? '');
        $userAgent = htmlspecialchars($payload['userAgent'] ?? '');
        $ip = htmlspecialchars($payload['ip'] ?? 'Unknown');

        $alert_html = '
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.05);">
            <div style="background-color: #dc2626; padding: 24px; text-align: center; border-bottom: 4px solid #eeb053;">
              <h1 style="color: #ffffff; font-family: \'Georgia\', serif; font-size: 20px; margin: 0; text-transform: uppercase; letter-spacing: 2px;">⚠️ SECURITY ALERT</h1>
            </div>
            <div style="padding: 40px 32px; font-family: \'Arial\', sans-serif; line-height: 1.6; color: #333333;">
              <h2 style="font-family: \'Georgia\', serif; font-size: 18px; color: #111111; margin-top: 0; text-transform: uppercase;">Admin Login Detected</h2>
              <p style="font-size: 14px; margin-bottom: 24px;">An administrative login was completed successfully for the FOL portal. Please review the connection audit details below to ensure this access was authorized:</p>
              
              <div style="background-color: #fcf8f8; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; margin-bottom: 28px;">
                <table style="width: 100%; font-size: 13px;">
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; width: 120px; color: #7f1d1d;">Account Email:</td>
                    <td style="padding: 6px 0; font-weight: bold;">' . $email . '</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #7f1d1d;">Timestamp:</td>
                    <td style="padding: 6px 0;">' . $time . '</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #7f1d1d;">IP Address:</td>
                    <td style="padding: 6px 0; font-family: monospace;">' . $ip . '</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-weight: bold; color: #7f1d1d;">Browser Agent:</td>
                    <td style="padding: 6px 0; font-size: 12px; color: #666666;">' . $userAgent . '</td>
                  </tr>
                </table>
              </div>
              <p style="font-size: 13px; color: #666666; margin: 0;">If this activity was yours, no action is required. If this login was unexpected, please reset your password immediately in the Supabase Authentication console.</p>
            </div>
            ' . $default_footer . '
          </div>';
          
        dispatch_email($admin_email, 'Security Alert: Admin Dashboard Login', $alert_html, 'Foundation of Luv Security');
        
        echo json_encode(["success" => true, "message" => "Security alert email sent successfully"]);
        exit();
    }
    
    if ($type === 'admin_email') {
        $recipients = $payload['recipients'] ?? [];
        $subject = $payload['subject'] ?? '';
        $bodyText = $payload['body'] ?? '';

        if (!is_array($recipients) || count($recipients) === 0) {
            http_response_code(400);
            echo json_encode(["error" => "Recipients must be a non-empty array"]);
            exit();
        }

        $sentCount = 0;
        foreach ($recipients as $recipient) {
            $formatted_body = nl2br(htmlspecialchars($bodyText));
            $bulk_html = '
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                ' . $default_header . '
                <div style="padding: 40px 32px; font-family: \'Arial\', sans-serif; line-height: 1.6; color: #333333; font-size: 15px;">
                  ' . $formatted_body . '
                </div>
                ' . $default_footer . '
              </div>';
              
            if (dispatch_email($recipient, $subject, $bulk_html)) {
                $sentCount++;
            }
        }
        
        echo json_encode(["success" => true, "message" => "Dispatched $sentCount email(s) successfully"]);
        exit();
    }
    
    http_response_code(400);
    echo json_encode(["error" => "Unsupported email dispatch type"]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Internal mail server error", "details" => $e->getMessage()]);
}
?>
