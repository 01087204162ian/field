<?php
session_start();
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$cNum = $input['cNum'] ?? '';
$mem_id = $input['mem_id'] ?? '';

// 세션 유효성 체크 로직
$isValid = isset($_SESSION['cNum']) && 
          $_SESSION['cNum'] == $cNum && 
          isset($_SESSION['mem_id']) && 
          $_SESSION['mem_id'] == $mem_id;

echo json_encode([
    'success' => true,
    'valid' => $isValid,
    'timestamp' => time()
]);
?>