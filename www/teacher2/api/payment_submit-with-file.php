<?php
/**
 * 개인카드 결제 정보 제출 API (재직증명서 포함)
 * 참조: 일반 파일 업로드 API의 베스트 프랙티스 적용
 */

// ===== 에러 리포팅 설정 (수정됨) =====
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);

// 실제 로그 파일 경로 설정
$logDir = '/field0327/www/teacher2/api/logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}

ini_set('error_log', $logDir . '/payment_file_error.log');

// 디버깅 함수 (참조 파일 스타일 적용)
function debugLog($message) {
    $logFile = '/field0327/www/teacher2/api/logs/payment_file_debug.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[DEBUG] $timestamp - $message\n";
    
    error_log($message);
    @file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// 예외 처리 핸들러 (참조 파일과 동일)
function handleException($e) {
    debugLog("Exception: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    return [
        'success' => false,
        'message' => '서버 오류가 발생했습니다: ' . $e->getMessage(),
        'debug' => [
            'file' => basename($e->getFile()),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]
    ];
}

debugLog("========== 개인카드 결제 정보 제출 요청 시작 ==========");
debugLog("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);

// POST 데이터와 FILES 전체 출력 (참조 파일 스타일)
debugLog("POST 데이터: " . print_r($_POST, true));
debugLog("FILES 데이터: " . print_r($_FILES, true));

// 암호화 헬퍼 파일 포함
$encryptHelperPath = '/field0327/www/api/config/encrypt_helper.php';
debugLog("암호화 헬퍼 경로: " . $encryptHelperPath);

if (!file_exists($encryptHelperPath)) {
    $response = [
        'success' => false,
        'message' => 'encrypt_helper.php 파일을 찾을 수 없습니다.',
        'path' => $encryptHelperPath
    ];
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

require_once $encryptHelperPath;
debugLog("암호화 헬퍼 로드 완료");

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
    // 업로드 디렉토리 설정
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/static/user/';
    debugLog("업로드 디렉토리: " . $uploadDir);
    debugLog("DOCUMENT_ROOT: " . $_SERVER['DOCUMENT_ROOT']);

    // 업로드 폴더 생성 (참조 파일 스타일)
    if (!is_dir($uploadDir)) {
        debugLog("업로드 디렉토리가 존재하지 않음, 생성 시도");
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception('업로드 디렉토리 생성 실패: ' . $uploadDir);
        }
        debugLog("업로드 디렉토리 생성 완료");
    } else {
        debugLog("업로드 디렉토리 존재 확인");
        debugLog("쓰기 가능 여부: " . (is_writable($uploadDir) ? 'YES' : 'NO'));
    }

    // POST 데이터 파싱
    $paymentDataJson = $_POST['paymentData'] ?? '';
    debugLog("paymentData 길이: " . strlen($paymentDataJson));
    
    if (empty($paymentDataJson)) {
        throw new Exception('paymentData가 누락되었습니다.');
    }
    
    $paymentData = json_decode($paymentDataJson, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON 파싱 오류: ' . json_last_error_msg());
    }
    
    debugLog("파싱된 paymentData: " . json_encode($paymentData, JSON_UNESCAPED_UNICODE));
    
    // 필수 파라미터 검증
    $questionId = $paymentData['questionId'] ?? '';
    $paymentMethod = $paymentData['paymentMethod'] ?? '';
    $cardType = $paymentData['cardType'] ?? '';
    
    debugLog("파라미터 - questionId: $questionId, paymentMethod: $paymentMethod, cardType: $cardType");
    
    if (empty($questionId) || empty($paymentMethod) || $cardType !== 'personal') {
        throw new Exception("필수 파라미터 누락 - questionId: '$questionId', paymentMethod: '$paymentMethod', cardType: '$cardType'");
    }
    
    // 카드 정보 검증
    $cardInfo = $paymentData['cardInfo'] ?? [];
    $cardNumber = $cardInfo['cardNumber'] ?? '';
    $expiry = $cardInfo['expiry'] ?? '';
    $jumin = $cardInfo['birthDate'] ?? '';
    
    debugLog("카드정보 - 카드번호 길이: " . strlen($cardNumber) . ", 유효기간: '$expiry', 주민번호 길이: " . strlen($jumin));
    
    if (empty($cardNumber) || empty($expiry) || empty($jumin)) {
        throw new Exception('카드 정보가 불완전합니다.');
    }
    
    // 카드번호 정제 및 검증
    $cleanCardNumber = str_replace('-', '', $cardNumber);
    debugLog("정제된 카드번호 길이: " . strlen($cleanCardNumber));
    
    if (strlen($cleanCardNumber) < 13 || strlen($cleanCardNumber) > 19) {
        throw new Exception('올바르지 않은 카드번호입니다. (13-19자리) 현재: ' . strlen($cleanCardNumber) . '자리');
    }
    
    if (!ctype_digit($cleanCardNumber)) {
        throw new Exception('카드번호는 숫자만 입력 가능합니다.');
    }
    
    // 유효기간 검증
    if (!preg_match('/^\d{2}\/\d{2}$/', $expiry)) {
        throw new Exception('올바르지 않은 유효기간 형식입니다. (MM/YY) 현재: ' . $expiry);
    }
    
    list($month, $year) = explode('/', $expiry);
    if ((int)$month < 1 || (int)$month > 12) {
        throw new Exception('올바르지 않은 월입니다. (01-12) 현재: ' . $month);
    }
    
    // 주민등록번호 검증 및 정제
    debugLog("주민번호 원본: '$jumin'");
    $cleanJumin = str_replace('-', '', $jumin);
    debugLog("주민번호 정제 후: '$cleanJumin' (길이: " . strlen($cleanJumin) . ")");
    
    if (strlen($cleanJumin) !== 13) {
        throw new Exception('주민등록번호는 13자리여야 합니다. 현재: ' . strlen($cleanJumin) . '자리');
    }
    
    if (!ctype_digit($cleanJumin)) {
        throw new Exception('주민등록번호는 숫자만 입력 가능합니다.');
    }
    
    debugLog("✅ 카드 정보 및 주민등록번호 검증 완료");
    
    // 파일 검증 (참조 파일 스타일 적용)
    $file = $_FILES['employmentProof'] ?? null;
    debugLog("파일 존재 여부: " . ($file ? 'YES' : 'NO'));
    
    if (!$file) {
        throw new Exception('재직증명서 파일이 업로드되지 않았습니다.');
    }
    
    debugLog("파일 오류 코드: " . $file['error']);
    
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => '파일이 너무 큽니다 (php.ini 제한)',
            UPLOAD_ERR_FORM_SIZE => '파일이 너무 큽니다 (폼 제한)',
            UPLOAD_ERR_PARTIAL => '파일이 부분적으로만 업로드됨',
            UPLOAD_ERR_NO_FILE => '파일이 업로드되지 않음',
            UPLOAD_ERR_NO_TMP_DIR => '임시 디렉토리 없음',
            UPLOAD_ERR_CANT_WRITE => '디스크 쓰기 실패',
            UPLOAD_ERR_EXTENSION => 'PHP 확장에 의해 업로드 중단'
        ];
        
        $errorMsg = $errorMessages[$file['error']] ?? '알 수 없는 파일 오류: ' . $file['error'];
        throw new Exception($errorMsg);
    }
    
    $originalFilename = $file['name'];
    $fileExtension = strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));
    $fileSize = $file['size'];
    $tmpName = $file['tmp_name'];
    
    debugLog("파일 정보 - 원본명: '$originalFilename', 확장자: '$fileExtension', 크기: $fileSize bytes");
    
    // 파일 크기 제한 (10MB)
    $maxFileSize = 10 * 1024 * 1024;
    if ($fileSize > $maxFileSize) {
        throw new Exception('파일 크기가 10MB를 초과합니다. 현재 크기: ' . round($fileSize / (1024*1024), 2) . 'MB');
    }
    
    // 허용 확장자
    $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    if (!in_array($fileExtension, $allowedExtensions)) {
        throw new Exception('PDF, JPG, PNG 형식만 업로드 가능합니다. 현재: ' . $fileExtension);
    }
    
    // 고유 파일명 생성
    $timestamp = time();
    $uniqueFilename = 'employment_' . $questionId . '_' . $timestamp . '.' . $fileExtension;
    $targetFile = $uploadDir . $uniqueFilename;
    $fileUrl = '/static/user/' . $uniqueFilename;
    
    debugLog("대상 파일 경로: " . $targetFile);
    
    // 파일 업로드
    if (!move_uploaded_file($tmpName, $targetFile)) {
        $lastError = error_get_last();
        debugLog("move_uploaded_file 실패 - 마지막 에러: " . print_r($lastError, true));
        throw new Exception('파일 업로드 실패. 대상 경로: ' . $targetFile . ', 권한 확인 필요');
    }
    
    debugLog("✅ 파일 업로드 성공: $uniqueFilename");
    
    // 데이터베이스 연결
    $connect = null;
    $dbConnectionPath = '../../2025/api/db_connection.php';
    debugLog("DB 연결 파일 경로: " . $dbConnectionPath);
    
    if (!file_exists($dbConnectionPath)) {
        throw new Exception('데이터베이스 연결 파일을 찾을 수 없습니다: ' . $dbConnectionPath);
    }
    
    include $dbConnectionPath;
    debugLog("DB 연결 파일 포함 완료");
    
    if (!function_exists('connect_db')) {
        throw new Exception('connect_db 함수를 찾을 수 없습니다.');
    }
    
    $connect = connect_db();
    
    if (!$connect) {
        throw new Exception('데이터베이스 연결 실패: ' . mysqli_connect_error());
    }
    
    debugLog("✅ 데이터베이스 연결 성공");
    
    mysqli_set_charset($connect, 'utf8');
    
    // 트랜잭션 시작 (참조 파일 스타일)
    if (!mysqli_autocommit($connect, false)) {
        throw new Exception('트랜잭션 시작 실패: ' . mysqli_error($connect));
    }
    
    debugLog("트랜잭션 시작");
    
    try {
        // questionnaire 존재 확인
        $checkSql = "SELECT num, ch FROM questionnaire WHERE num = ?";
        $checkStmt = mysqli_prepare($connect, $checkSql);
        
        if (!$checkStmt) {
            throw new Exception('SQL 준비 실패: ' . mysqli_error($connect));
        }
        
        mysqli_stmt_bind_param($checkStmt, 's', $questionId);
        
        if (!mysqli_stmt_execute($checkStmt)) {
            throw new Exception('SQL 실행 실패: ' . mysqli_stmt_error($checkStmt));
        }
        
        $result = mysqli_stmt_get_result($checkStmt);
        $questionnaire = mysqli_fetch_assoc($result);
        mysqli_stmt_close($checkStmt);
        
        if (!$questionnaire) {
            throw new Exception('해당 질문서를 찾을 수 없습니다. questionId: ' . $questionId);
        }
        
        debugLog("✅ 질문서 확인 완료 - num: " . $questionnaire['num'] . ", 현재 상태: " . $questionnaire['ch']);
        
        // 카드번호와 주민번호 암호화
        debugLog("암호화 시작...");
        $encryptedCardNumber = encryptData($cleanCardNumber);
        $encryptedJumin = encryptData($cleanJumin);
        
        if ($encryptedCardNumber === false || empty($encryptedCardNumber)) {
            throw new Exception('카드번호 암호화 실패');
        }
        
        if ($encryptedJumin === false || empty($encryptedJumin)) {
            throw new Exception('주민번호 암호화 실패');
        }
        
        debugLog("✅ 암호화 완료 - 카드번호 길이: " . strlen($encryptedCardNumber) . ", 주민번호 길이: " . strlen($encryptedJumin));
        
        // questionnaire 업데이트
        $updateSql = "UPDATE questionnaire 
                     SET cardnum = ?, 
                         yymm = ?,
                         jumin = ?,
                         card_type = '2',
                         pMethod = '1',
                         ch = '47',
                         wdate_3 = NOW()
                     WHERE num = ?";
        
        $stmt = mysqli_prepare($connect, $updateSql);
        
        if (!$stmt) {
            throw new Exception('UPDATE SQL 준비 실패: ' . mysqli_error($connect));
        }
        
        mysqli_stmt_bind_param($stmt, 'ssss', $encryptedCardNumber, $expiry, $encryptedJumin, $questionId);
        
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception('카드 정보 저장 실패: ' . mysqli_stmt_error($stmt));
        }
        
        $affectedRows = mysqli_stmt_affected_rows($stmt);
        mysqli_stmt_close($stmt);
        
        debugLog("✅ 개인카드 정보 저장 완료 (영향받은 행: $affectedRows)");
        
        // 재직증명서 파일 정보 저장
        $kind = '11'; // 재직증명서
        $title = 'employment_' . $questionId;
        
        // 기존 재직증명서 확인 (참조 파일 스타일)
        $checkFileSql = "SELECT description2 FROM image WHERE qnum = ? AND kind = '11' AND deleteIs = '1'";
        $checkFileStmt = mysqli_prepare($connect, $checkFileSql);
        
        if (!$checkFileStmt) {
            throw new Exception('파일 확인 SQL 준비 실패: ' . mysqli_error($connect));
        }
        
        mysqli_stmt_bind_param($checkFileStmt, 's', $questionId);
        
        if (!mysqli_stmt_execute($checkFileStmt)) {
            throw new Exception('파일 확인 실행 실패: ' . mysqli_stmt_error($checkFileStmt));
        }
        
        $fileResult = mysqli_stmt_get_result($checkFileStmt);
        $existingFile = mysqli_fetch_assoc($fileResult);
        mysqli_stmt_close($checkFileStmt);
        
        $isUpdate = ($existingFile !== null);
        debugLog("기존 재직증명서 확인 완료. 기존 파일 존재: " . ($isUpdate ? 'Yes' : 'No'));
        
        if ($isUpdate) {
            // 기존 파일 삭제
            $oldFilePath = $_SERVER['DOCUMENT_ROOT'] . $existingFile['description2'];
            debugLog("기존 파일 경로: " . $oldFilePath);
            
            if (file_exists($oldFilePath)) {
                if (unlink($oldFilePath)) {
                    debugLog("✅ 기존 파일 삭제 완료");
                } else {
                    debugLog("⚠️ 기존 파일 삭제 실패 (권한 문제 가능)");
                }
            } else {
                debugLog("⚠️ 기존 파일이 실제로 존재하지 않음");
            }
            
            // 업데이트
            $updateFileSql = "UPDATE image SET description2 = ?, title = ?, wdate = NOW() 
                             WHERE qnum = ? AND kind = '11' AND deleteIs = '1'";
            $fileStmt = mysqli_prepare($connect, $updateFileSql);
            
            if (!$fileStmt) {
                throw new Exception('파일 정보 업데이트 SQL 준비 실패: ' . mysqli_error($connect));
            }
            
            mysqli_stmt_bind_param($fileStmt, 'sss', $fileUrl, $title, $questionId);
        } else {
            // 새로 삽입
            $insertFileSql = "INSERT INTO image (description2, qnum, kind, title, wdate, deleteIs) 
                             VALUES (?, ?, '11', ?, NOW(), '1')";
            $fileStmt = mysqli_prepare($connect, $insertFileSql);
            
            if (!$fileStmt) {
                throw new Exception('파일 정보 삽입 SQL 준비 실패: ' . mysqli_error($connect));
            }
            
            mysqli_stmt_bind_param($fileStmt, 'sss', $fileUrl, $questionId, $title);
        }
        
        if (!mysqli_stmt_execute($fileStmt)) {
            throw new Exception('재직증명서 정보 저장 실패: ' . mysqli_stmt_error($fileStmt));
        }
        
        $fileAffectedRows = mysqli_stmt_affected_rows($fileStmt);
        mysqli_stmt_close($fileStmt);
        
        debugLog("✅ 재직증명서 파일 정보 저장 완료 (영향받은 행: $fileAffectedRows, 작업: " . ($isUpdate ? 'UPDATE' : 'INSERT') . ")");
        
        // 트랜잭션 커밋 (참조 파일 스타일)
        if (!mysqli_commit($connect)) {
            throw new Exception('트랜잭션 커밋 실패: ' . mysqli_error($connect));
        }
        
        debugLog("✅ 트랜잭션 커밋 완료");
        
        // 성공 응답
        $response = [
            'success' => true,
            'message' => '개인카드 결제 정보 및 재직증명서가 등록되었습니다. 검토 후 승인됩니다.',
            'data' => [
                'questionId' => $questionId,
                'paymentMethod' => $paymentMethod,
                'cardType' => 'personal',
                'status' => '47',
                'filename' => $uniqueFilename,
                'fileUrl' => $fileUrl,
                'fileSize' => $fileSize,
                'isUpdate' => $isUpdate,
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ];
        
        debugLog("✅ 성공 응답 준비 완료");
        
    } catch (Exception $e) {
        // 트랜잭션 롤백
        if ($connect) {
            if (!mysqli_rollback($connect)) {
                debugLog("⚠️ 트랜잭션 롤백 실패: " . mysqli_error($connect));
            } else {
                debugLog("트랜잭션 롤백 완료");
            }
        }
        
        // 업로드된 파일 삭제
        if (isset($targetFile) && file_exists($targetFile)) {
            if (unlink($targetFile)) {
                debugLog("업로드된 파일 삭제 완료");
            } else {
                debugLog("⚠️ 업로드된 파일 삭제 실패");
            }
        }
        
        throw $e;
    }
    
} catch (Exception $e) {
    debugLog("❌ 오류 발생: " . $e->getMessage());
    debugLog("오류 위치: " . $e->getFile() . " (line " . $e->getLine() . ")");
    debugLog("Stack trace: " . $e->getTraceAsString());
    
    $response = handleException($e);
    http_response_code(500);
    
} finally {
    // 데이터베이스 연결 종료
    if (isset($connect) && $connect) {
        mysqli_close($connect);
        debugLog("데이터베이스 연결 종료");
    }
}

debugLog("응답 출력: " . substr(json_encode($response, JSON_UNESCAPED_UNICODE), 0, 200) . "...");
debugLog("========== 요청 처리 완료 ==========\n\n");

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>