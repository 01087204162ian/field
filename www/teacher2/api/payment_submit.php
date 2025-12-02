<?php
/**
 * 결제 정보 제출 API (법인카드/가상계좌)
 * 카드번호는 암호화하여 저장
 */

// 에러 리포팅 설정
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/error.log');

// 암호화 함수 포함
// ===== 기존 =====
// require_once __DIR__ . '/api/config/encrypt_helper.php';

// ===== 수정 (절대 경로 사용) =====
$encryptHelperPath = '/field0327/www/api/config/encrypt_helper.php';

if (!file_exists($encryptHelperPath)) {
    die(json_encode([
        'success' => false,
        'message' => 'encrypt_helper.php 파일을 찾을 수 없습니다.',
        'path' => $encryptHelperPath
    ], JSON_UNESCAPED_UNICODE));
}

require_once $encryptHelperPath;
// 디버깅 함수
function debugLog($message) {
    error_log("[PAYMENT] " . date('Y-m-d H:i:s') . " - " . $message);
}

// 예외 처리 핸들러
function handleException($e) {
    debugLog("Exception: " . $e->getMessage());
    return [
        'success' => false,
        'message' => '서버 오류가 발생했습니다: ' . $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ];
}

debugLog("결제 정보 제출 요청 시작");

// CORS 헤더 설정
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// OPTIONS 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    debugLog("OPTIONS 요청 처리");
    http_response_code(200);
    exit();
}

// POST 요청만 처리
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    debugLog("잘못된 요청 방식: " . $_SERVER['REQUEST_METHOD']);
    echo json_encode([
        'success' => false, 
        'message' => '잘못된 요청 방식입니다.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

try {
    // JSON 데이터 파싱
    $jsonInput = file_get_contents('php://input');
    $paymentData = json_decode($jsonInput, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON 파싱 오류: ' . json_last_error_msg());
    }
    
    debugLog("받은 데이터: " . print_r($paymentData, true));
    
    // 필수 파라미터 검증
    if (empty($paymentData['questionId'])) {
        throw new Exception('questionId가 누락되었습니다.');
    }
    
    if (empty($paymentData['paymentMethod'])) {
        throw new Exception('paymentMethod가 누락되었습니다.');
    }
    
    $questionId = $paymentData['questionId'];
    $paymentMethod = $paymentData['paymentMethod'];
    
    // 데이터베이스 연결
    $connect = null;
    $dbConnectionPath = '../../2025/api/db_connection.php';
    
    if (!file_exists($dbConnectionPath)) {
        throw new Exception('데이터베이스 연결 파일을 찾을 수 없습니다.');
    }
    
    include $dbConnectionPath;
    
    if (!function_exists('connect_db')) {
        throw new Exception('connect_db 함수를 찾을 수 없습니다.');
    }
    
    $connect = connect_db();
    
    if (!$connect) {
        throw new Exception('데이터베이스 연결 실패: ' . mysqli_connect_error());
    }
    
    debugLog("데이터베이스 연결 성공");
    
    // MySQL 문자셋 설정
    mysqli_set_charset($connect, 'utf8');
    
    // 트랜잭션 시작
    mysqli_autocommit($connect, false);
    debugLog("트랜잭션 시작");
    
    try {
        // questionnaire 존재 확인
        $checkSql = "SELECT num, ch FROM questionnaire WHERE num = ?";
        $checkStmt = mysqli_prepare($connect, $checkSql);
        
        if (!$checkStmt) {
            throw new Exception('SQL 준비 실패: ' . mysqli_error($connect));
        }
        
        mysqli_stmt_bind_param($checkStmt, 's', $questionId);
        mysqli_stmt_execute($checkStmt);
        $result = mysqli_stmt_get_result($checkStmt);
        $questionnaire = mysqli_fetch_assoc($result);
        mysqli_stmt_close($checkStmt);
        
        if (!$questionnaire) {
            throw new Exception('해당 질문서를 찾을 수 없습니다.');
        }
        
        debugLog("질문서 확인 완료 - 현재 상태: " . $questionnaire['ch']);
        
        if ($paymentMethod === 'card') {
            // ===== 카드 결제 처리 (법인카드만) =====
            if (empty($paymentData['cardType']) || $paymentData['cardType'] !== 'corporate') {
                throw new Exception('잘못된 카드 타입입니다.');
            }
            
            if (empty($paymentData['cardInfo'])) {
                throw new Exception('카드 정보가 누락되었습니다.');
            }
            
            $cardInfo = $paymentData['cardInfo'];
            $cardNumber = $cardInfo['cardNumber'] ?? '';
            $expiry = $cardInfo['expiry'] ?? '';
            
            if (empty($cardNumber) || empty($expiry)) {
                throw new Exception('카드번호 또는 유효기간이 누락되었습니다.');
            }
            
            // 카드번호 정제 (하이픈 제거)
            $cleanCardNumber = str_replace('-', '', $cardNumber);
            
            // 카드번호 검증 (13-19자리)
            if (strlen($cleanCardNumber) < 13 || strlen($cleanCardNumber) > 19) {
                throw new Exception('올바르지 않은 카드번호입니다. (13-19자리)');
            }
            
            if (!ctype_digit($cleanCardNumber)) {
                throw new Exception('카드번호는 숫자만 입력 가능합니다.');
            }
            
            // 유효기간 검증 (MM/YY)
            if (!preg_match('/^\d{2}\/\d{2}$/', $expiry)) {
                throw new Exception('올바르지 않은 유효기간 형식입니다. (MM/YY)');
            }
            
            list($month, $year) = explode('/', $expiry);
            if ((int)$month < 1 || (int)$month > 12) {
                throw new Exception('올바르지 않은 월입니다. (01-12)');
            }
            
            debugLog("카드번호 검증 완료");
            
            // ===== 카드번호 암호화 =====
            $encryptedCardNumber = encryptData($cleanCardNumber);
            
            if ($encryptedCardNumber === false || empty($encryptedCardNumber)) {
                throw new Exception('카드번호 암호화 실패');
            }
            
            debugLog("카드번호 암호화 완료 (길이: " . strlen($encryptedCardNumber) . ")");
            
            // questionnaire 업데이트
            $updateSql = "UPDATE questionnaire 
                         SET cardnum = ?, 
                             yymm = ?, 
                             card_type = '1',
                             pMethod = '1',
                             ch = '45',
                             wdate_3 = NOW()
                         WHERE num = ?";
            
            $stmt = mysqli_prepare($connect, $updateSql);
            
            if (!$stmt) {
                throw new Exception('UPDATE SQL 준비 실패: ' . mysqli_error($connect));
            }
            
            mysqli_stmt_bind_param($stmt, 'sss', $encryptedCardNumber, $expiry, $questionId);
            
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception('카드 정보 저장 실패: ' . mysqli_stmt_error($stmt));
            }
            
            $affectedRows = mysqli_stmt_affected_rows($stmt);
            mysqli_stmt_close($stmt);
            
            debugLog("법인카드 정보 저장 완료 (영향받은 행: $affectedRows)");
            
            $responseMessage = '법인카드 결제 정보가 등록되었습니다.';
            $newStatus = '45'; // 법인카드 결제 대기
            
        } else if ($paymentMethod === 'account') {
            // ===== 가상계좌 처리 =====
            if (empty($paymentData['accountInfo'])) {
                throw new Exception('계좌 정보가 누락되었습니다.');
            }
            
            $accountInfo = $paymentData['accountInfo'];
            $bank = $accountInfo['bank'] ?? '';
            $bankName = $accountInfo['bankName'] ?? '';
            $accountNumber = $accountInfo['accountNumber'] ?? '';
            
            if (empty($bank) || empty($accountNumber)) {
                throw new Exception('은행 또는 계좌번호가 누락되었습니다.');
            }
            
            debugLog("가상계좌 정보 - 은행: $bankName, 계좌: $accountNumber");
            
            // questionnaire 업데이트
            $updateSql = "UPDATE questionnaire 
                         SET bankname = ?, 
                             bank = ?,
                             pMethod = '2',
                             ch = '46',
                             wdate_3 = NOW()
                         WHERE num = ?";
            
            $stmt = mysqli_prepare($connect, $updateSql);
            
            if (!$stmt) {
                throw new Exception('UPDATE SQL 준비 실패: ' . mysqli_error($connect));
            }
            
            mysqli_stmt_bind_param($stmt, 'sss', $bankName, $accountNumber, $questionId);
            
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception('계좌 정보 저장 실패: ' . mysqli_stmt_error($stmt));
            }
            
            $affectedRows = mysqli_stmt_affected_rows($stmt);
            mysqli_stmt_close($stmt);
            
            debugLog("가상계좌 정보 저장 완료 (영향받은 행: $affectedRows)");
            
            $responseMessage = '가상계좌 정보가 등록되었습니다. 입금 후 자동으로 처리됩니다.';
            $newStatus = '46'; // 가상계좌 입금 대기
            
        } else {
            throw new Exception('지원하지 않는 결제 방법입니다: ' . $paymentMethod);
        }
        
        // 트랜잭션 커밋
        if (!mysqli_commit($connect)) {
            throw new Exception('트랜잭션 커밋 실패: ' . mysqli_error($connect));
        }
        
        debugLog("트랜잭션 커밋 완료");
        
        // 성공 응답
        $response = [
            'success' => true,
            'message' => $responseMessage,
            'data' => [
                'questionId' => $questionId,
                'paymentMethod' => $paymentMethod,
                'status' => $newStatus,
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ];
        
        debugLog("성공 응답 준비 완료");
        
    } catch (Exception $e) {
        // 트랜잭션 롤백
        if ($connect) {
            mysqli_rollback($connect);
            debugLog("트랜잭션 롤백");
        }
        throw $e;
    }
    
} catch (Exception $e) {
    debugLog("오류 발생: " . $e->getMessage());
    $response = handleException($e);
    http_response_code(500);
    
} finally {
    // 데이터베이스 연결 종료
    if (isset($connect) && $connect) {
        mysqli_close($connect);
        debugLog("데이터베이스 연결 종료");
    }
}

debugLog("응답 출력");
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>