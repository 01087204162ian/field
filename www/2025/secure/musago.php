<?php
/**
 * 보안 무사고 확인서 링크 처리기
 * 파일 위치: /2025/secure/musago.php
 */

session_start();

// 오류 보고 설정
error_reporting(E_ALL);
ini_set('display_errors', 0); // 운영환경에서는 0으로 설정

/**
 * 토큰 검증 및 데이터 추출
 */
function validateSecureToken($token) {
    try {
        $secretKey = 'musago_secret_key_2025'; // musagoNotice.php와 동일한 키 사용
        
        // Base64 디코딩
        $decoded = base64_decode($token);
        if (!$decoded) {
            return ['error' => '유효하지 않은 토큰 형식입니다.'];
        }
        
        // 데이터 분리
        $parts = explode('|', $decoded);
        if (count($parts) !== 4) {
            return ['error' => '토큰 구조가 올바르지 않습니다.'];
        }
        
        list($claimNum, $email, $timestamp, $signature) = $parts;
        
        // 타임스탬프 검증 (만료 확인)
        if (time() > $timestamp) {
            return ['error' => '링크가 만료되었습니다. 새로운 링크를 요청해주세요.'];
        }
        
        // 서명 검증
        $data = $claimNum . '|' . $email . '|' . $timestamp;
        $expectedSignature = hash_hmac('sha256', $data, $secretKey);
        
        if (!hash_equals($expectedSignature, $signature)) {
            return ['error' => '유효하지 않은 링크입니다.'];
        }
        
        return [
            'claimNum' => $claimNum,
            'email' => $email,
            'valid' => true
        ];
        
    } catch (Exception $e) {
        error_log("토큰 검증 오류: " . $e->getMessage());
        return ['error' => '링크 처리 중 오류가 발생했습니다.'];
    }
}

/**
 * 에러 페이지 출력
 */
function showErrorPage($message) {
    http_response_code(400);
    echo '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>링크 오류 - 한화 현장실습보험</title>
    <style>
        body {
            font-family: "Malgun Gothic", Arial, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .error-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 500px;
            text-align: center;
        }
        .error-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        h1 {
            color: #e74c3c;
            margin-bottom: 20px;
        }
        p {
            color: #555;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .contact-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #3498db;
        }
        .contact-info h3 {
            color: #2c3e50;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⚠️</div>
        <h1>링크 접근 오류</h1>
        <p>' . htmlspecialchars($message) . '</p>
        
        <div class="contact-info">
            <h3>📞 문의처</h3>
            <p><strong>이투엘보험대리점 / 현장실습보험지원팀</strong></p>
            <p>전화: <strong>1533-5013</strong></p>
            <p>이메일: <strong>lincinsu@lincinsu.kr</strong></p>
        </div>
    </div>
</body>
</html>';
    exit;
}

// 메인 처리 로직
if (!isset($_GET['token'])) {
    error_log("무사고 확인서 접근 시도: 토큰 없음 | IP: " . $_SERVER['REMOTE_ADDR']);
    showErrorPage('유효하지 않은 접근입니다. 이메일에서 제공된 링크를 사용해주세요.');
}

$token = $_GET['token'];
$result = validateSecureToken($token);

if (isset($result['error'])) {
    error_log("무사고 확인서 토큰 검증 실패: " . $result['error'] . " | IP: " . $_SERVER['REMOTE_ADDR']);
    showErrorPage($result['error']);
}

$claimNum = $result['claimNum'];
$email = $result['email'];

// 성공 로그 기록
error_log("✅ 무사고 확인서 접근 성공: " . $email . " | claimNum: " . $claimNum . " | IP: " . $_SERVER['REMOTE_ADDR']);

// 원본 페이지로 안전하게 리다이렉트
$originalUrl = "/2014/_pages/php/downExcel/claim7.php?claimNum=" . urlencode($claimNum);

// 추가 보안: Referrer 정책 설정
header("Referrer-Policy: no-referrer");

// 리다이렉트 실행
header("Location: " . $originalUrl);
exit;

?>