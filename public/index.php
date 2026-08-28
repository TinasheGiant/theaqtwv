<?php
/**
 * Aqutewave Digital Gateway - PHP Host Fallback Wrapper
 * Ensures proper delivery of React SPA on PHP/cPanel/DirectAdmin/Apache hosts
 */

header('Content-Type: text/html; charset=UTF-8');
header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');

$htmlFile = __DIR__ . '/index.html';

if (file_exists($htmlFile)) {
    readfile($htmlFile);
    exit;
} else {
    // If index.html is in the same directory or dist
    if (file_exists(__DIR__ . '/dist/index.html')) {
        readfile(__DIR__ . '/dist/index.html');
        exit;
    }
    http_response_code(500);
    echo '<!DOCTYPE html><html><body style="background:#050608;color:#fff;font-family:sans-serif;text-align:center;padding:50px;"><h2>Aqutewave Portal</h2><p>Please run <code>npm run build</code> and upload the contents of <code>dist/</code> to <code>public_html/</code>.</p></body></html>';
}
