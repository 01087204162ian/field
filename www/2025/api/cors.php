<?php
// CORS 허용 설정
$allowed_origins = [
    'https://pcikorea.com',
    'https://www.pcikorea.com',
    'https://disk-cms.simg.kr'  // 마지막 슬래시 제거
];

// HTTP_ORIGIN이 설정되어 있는지 확인
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if ($origin && in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
} else {
    // 기본 도메인 허용 (옵션)
    header("Access-Control-Allow-Origin: https://disk-cms.simg.kr");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept");
header("Access-Control-Allow-Credentials: true");

// Preflight 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>