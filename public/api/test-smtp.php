<?php
// SMTP Debugging Script for foundationofluv.org
// Place this in public/api/test-smtp.php and visit:
// https://foundationofluv.org/api/test-smtp.php

header("Content-Type: text/plain; charset=UTF-8");

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=== SMTP Configuration Diagnostics ===\n\n";

// Helper to load env vars
function get_env_var($key) {
    $val = getenv($key);
    if ($val !== false) return $val;
    if (isset($_ENV[$key])) return $_ENV[$key];
    
    $paths = [
        dirname(dirname(__DIR__)) . '/.env',
        dirname(__DIR__) . '/.env',
        __DIR__ . '/.env',
        $_SERVER['DOCUMENT_ROOT'] . '/.env'
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

$host = get_env_var('SMTP_HOST');
$port_str = get_env_var('SMTP_PORT');
$port = $port_str ? intval($port_str) : 465;
$user = get_env_var('SMTP_USER');
$pass = get_env_var('SMTP_PASS');
$secure = get_env_var('SMTP_SECURE') === 'true' || $port === 465;
$admin_email = get_env_var('ADMIN_EMAIL') ?: 'info@azariahmg.com';

echo "Host: " . ($host ?: "MISSING") . "\n";
echo "Port: " . $port . "\n";
echo "Secure: " . ($secure ? "Yes (ssl://)" : "No") . "\n";
echo "User: " . ($user ?: "MISSING") . "\n";
echo "Password Length: " . strlen($pass) . " characters\n";
echo "Admin Email: " . $admin_email . "\n\n";

if (empty($host) || empty($user) || empty($pass)) {
    echo "❌ SMTP configuration variables are missing. Checking .env file path...\n";
    foreach ([
        dirname(dirname(__DIR__)) . '/.env',
        dirname(__DIR__) . '/.env',
        __DIR__ . '/.env',
        $_SERVER['DOCUMENT_ROOT'] . '/.env'
    ] as $path) {
        echo "Checking path '$path': " . (file_exists($path) ? "EXISTS" : "NOT FOUND") . "\n";
    }
    exit();
}

$socket_host = $secure ? "ssl://" . $host : $host;
echo "Connecting to socket: $socket_host:$port...\n";

$errno = 0;
$errstr = '';
$socket = @fsockopen($socket_host, $port, $errno, $errstr, 15);

if (!$socket) {
    echo "❌ CONNECTION FAILED: $errstr ($errno)\n";
    echo "This usually means Namecheap firewall is blocking outbound connections to $host on port $port.\n";
    echo "Please contact Namecheap support or use local/internal mail server details.\n";
    exit();
}

echo "✅ Connected to socket successfully!\n\n";

function get_response($socket) {
    $response = "";
    while ($str = fgets($socket, 515)) {
        $response .= $str;
        if (substr($str, 3, 1) == " ") {
            break;
        }
    }
    echo "S: " . trim($response) . "\n";
    return $response;
}

try {
    get_response($socket); // 220
    
    $server_name = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';
    echo "C: EHLO $server_name\n";
    fwrite($socket, "EHLO " . $server_name . "\r\n");
    get_response($socket); // 250
    
    echo "C: AUTH LOGIN\n";
    fwrite($socket, "AUTH LOGIN\r\n");
    get_response($socket); // 334
    
    echo "C: [Base64 Username]\n";
    fwrite($socket, base64_encode($user) . "\r\n");
    get_response($socket); // 334
    
    echo "C: [Base64 Password]\n";
    fwrite($socket, base64_encode($pass) . "\r\n");
    get_response($socket); // 235
    
    echo "C: MAIL FROM:<$user>\n";
    fwrite($socket, "MAIL FROM:<" . $user . ">\r\n");
    get_response($socket); // 250
    
    echo "C: RCPT TO: <$admin_email>\n";
    fwrite($socket, "RCPT TO:<" . $admin_email . ">\r\n");
    get_response($socket); // 250
    
    echo "C: DATA\n";
    fwrite($socket, "DATA\r\n");
    get_response($socket); // 354
    
    $headers = [
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "From: SMTP Debugger <" . $user . ">",
        "To: <" . $admin_email . ">",
        "Subject: SMTP Test successful!",
        "Date: " . date("r")
    ];
    
    $data = implode("\r\n", $headers) . "\r\n\r\nThis is a test email sent from SMTP Debugger.\r\n.\r\n";
    fwrite($socket, $data);
    get_response($socket); // 250
    
    echo "C: QUIT\n";
    fwrite($socket, "QUIT\r\n");
    fclose($socket);
    
    echo "\n🎉 SMTP TEST COMPLETED SUCCESSFULLY! Email should arrive in $admin_email inbox.";
} catch (Exception $e) {
    echo "\n❌ EXCEPTION OCCURRED: " . $e->getMessage() . "\n";
}
