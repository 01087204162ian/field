<?php
// 에러 리포팅 설정 (개발 중에만 사용)
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', '/path/to/error.log'); // 실제 로그 경로로 변경

// 디버깅 함수
function debugLog($message) {
    error_log("[DEBUG] " . date('Y-m-d H:i:s') . " - " . $message);
}

// 예외 처리 핸들러
function handleException($e) {
    debugLog("Exception: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    return [
        'success' => false,
        'message' => '서버 오류가 발생했습니다: ' . $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]
    ];
}

debugLog("파일 업로드 요청 시작");

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

debugLog("POST 데이터: " . print_r($_POST, true));
debugLog("FILES 데이터: " . print_r($_FILES, true));

try {
    // 업로드 디렉토리 설정
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/static/user/';
    debugLog("업로드 디렉토리: " . $uploadDir);

    // 업로드 폴더 생성 (존재하지 않을 경우)
    if (!is_dir($uploadDir)) {
        debugLog("업로드 디렉토리가 존재하지 않음, 생성 시도");
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception('업로드 디렉토리 생성 실패: ' . $uploadDir);
        }
        debugLog("업로드 디렉토리 생성 완료");
    }

    // 데이터베이스 연결 변수 초기화
    $connect = null;

    // 데이터베이스 연결 파일 경로 확인
    $dbConnectionPath = '../../2025/api/db_connection.php';
    debugLog("데이터베이스 연결 파일 경로: " . $dbConnectionPath);
    
    if (!file_exists($dbConnectionPath)) {
        throw new Exception('데이터베이스 연결 파일을 찾을 수 없습니다: ' . $dbConnectionPath);
    }
    
    // 데이터베이스 연결 파일 포함
    include $dbConnectionPath;
    debugLog("데이터베이스 연결 파일 포함 완료");
    
    // 데이터베이스 연결 함수 존재 확인
    if (!function_exists('connect_db')) {
        throw new Exception('connect_db 함수를 찾을 수 없습니다.');
    }
    
    // 데이터베이스 연결
    $connect = connect_db();
    debugLog("데이터베이스 연결 시도 완료");
    
    if (!$connect) {
        throw new Exception('데이터베이스 연결 실패: ' . mysqli_connect_error());
    }
    
    debugLog("데이터베이스 연결 성공");
    
    // MySQL 문자셋 설정
    if (!mysqli_set_charset($connect, 'utf8')) {
        throw new Exception('문자셋 설정 실패: ' . mysqli_error($connect));
    }
    
    // POST 데이터 수신 및 검증
    $action = $_POST['action'] ?? '';
    $questionId = $_POST['questionId'] ?? '';
    $documentType = $_POST['documentType'] ?? '';
    $cNum = $_POST['cNum'] ?? '';
    
    debugLog("파라미터 - action: $action, questionId: $questionId, documentType: $documentType");
    
    // 파일 데이터 확인
    $file = $_FILES['file'] ?? null;
    
    if (!$file) {
        throw new Exception('파일이 업로드되지 않았습니다.');
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
    
    // 입력 데이터 검증
    if (empty($questionId) || empty($documentType)) {
        throw new Exception('필수 파라미터가 누락되었습니다. questionId: ' . $questionId . ', documentType: ' . $documentType);
    }
    
    // 문서 유형별 kind 값 매핑
    $kindMapping = [
        'question' => '9',      // 질문서
        'subscription' => '8',  // 청약서
        'department' => '10'    // 과별인원
    ];
    
    if (!isset($kindMapping[$documentType])) {
        throw new Exception('지원하지 않는 문서 유형입니다: ' . $documentType);
    }
    
    $kind = $kindMapping[$documentType];
    debugLog("문서 유형: $documentType, kind: $kind");
    
    // 파일 정보 추출
    $originalFilename = $file['name'];
    $fileExtension = strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));
    $fileSize = $file['size'];
    $tmpName = $file['tmp_name'];
    
    debugLog("파일 정보 - 원본명: $originalFilename, 확장자: $fileExtension, 크기: $fileSize");
    
    // 파일 크기 제한 (10MB)
    $maxFileSize = 10 * 1024 * 1024;
    if ($fileSize > $maxFileSize) {
        throw new Exception('파일 크기가 10MB를 초과합니다. 현재 크기: ' . round($fileSize / (1024*1024), 2) . 'MB');
    }
    
    // 문서 유형별 허용 확장자 검증
    // 문서 유형별 허용 확장자 검증
	$allowedExtensions = [
		'question' => ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp'],
		'subscription' => ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp'],
		'department' => ['xlsx', 'xls', 'csv', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp']  // Excel + PDF + 이미지
	];
    
    if (!in_array($fileExtension, $allowedExtensions[$documentType])) {
        throw new Exception($documentType . ' 문서는 ' . implode(', ', $allowedExtensions[$documentType]) . ' 형식만 지원됩니다. 현재: ' . $fileExtension);
    }
    
    // 고유한 파일명 생성
    $timestamp = time();
    $uniqueFilename = $documentType . '_' . $questionId . '_' . $timestamp . '.' . $fileExtension;
    $targetFile = $uploadDir . $uniqueFilename;
    $fileUrl = '/static/user/' . $uniqueFilename;
    
    debugLog("대상 파일 경로: " . $targetFile);
    
    // 파일 업로드
    if (!move_uploaded_file($tmpName, $targetFile)) {
        throw new Exception('파일 업로드 실패. 대상 경로: ' . $targetFile . ', 권한 확인 필요');
    }
    
    debugLog("파일 업로드 성공");
    
    // 트랜잭션 시작
    if (!mysqli_autocommit($connect, false)) {
        throw new Exception('트랜잭션 시작 실패: ' . mysqli_error($connect));
    }
    
    debugLog("트랜잭션 시작");
    
    try {
        // 기존 파일 확인
        $checkSql = "SELECT description2 FROM image WHERE qnum = ? AND kind = ? AND deleteIs = '1'";
        $checkStmt = mysqli_prepare($connect, $checkSql);
        
        if (!$checkStmt) {
            throw new Exception('기존 파일 확인 SQL 준비 실패: ' . mysqli_error($connect));
        }
        
        mysqli_stmt_bind_param($checkStmt, 'ss', $questionId, $kind);
        
        if (!mysqli_stmt_execute($checkStmt)) {
            throw new Exception('기존 파일 확인 실행 실패: ' . mysqli_stmt_error($checkStmt));
        }
        
        $checkResult = mysqli_stmt_get_result($checkStmt);
        $existingFile = mysqli_fetch_assoc($checkResult);
        mysqli_stmt_close($checkStmt);
        
        debugLog("기존 파일 확인 완료. 기존 파일 존재: " . ($existingFile ? 'Yes' : 'No'));
        
        $isUpdate = false;
        
        if ($existingFile) {
            // 기존 파일이 있는 경우 - 업데이트
            $isUpdate = true;
            
            // 기존 파일 삭제 (실제 파일)
            $oldFilePath = $_SERVER['DOCUMENT_ROOT'] . $existingFile['description2'];
            debugLog("기존 파일 경로: " . $oldFilePath);
            
            if (file_exists($oldFilePath)) {
                if (unlink($oldFilePath)) {
                    debugLog("기존 파일 삭제 완료");
                } else {
                    debugLog("기존 파일 삭제 실패");
                }
            } else {
                debugLog("기존 파일이 실제로 존재하지 않음");
            }
            
            // 데이터베이스 업데이트
            $updateSql = "UPDATE image SET description2 = ?, title = ?, wdate = NOW() 
                         WHERE qnum = ? AND kind = ? AND deleteIs = '1'";
            $stmt = mysqli_prepare($connect, $updateSql);
            
            if (!$stmt) {
                throw new Exception('업데이트 SQL 준비 실패: ' . mysqli_error($connect));
            }
            
            $title = $documentType . '_' . $questionId;
            mysqli_stmt_bind_param($stmt, 'ssss', $fileUrl, $title, $questionId, $kind);
            
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception('파일 정보 업데이트 실패: ' . mysqli_stmt_error($stmt));
            }
            
            debugLog("데이터베이스 업데이트 완료");
            mysqli_stmt_close($stmt);
            
        } else {
            // 기존 파일이 없는 경우 - 새로 삽입
            $insertSql = "INSERT INTO image (description2, qnum, kind, title, wdate, deleteIs) 
                         VALUES (?, ?, ?, ?, NOW(), '1')";
            $stmt = mysqli_prepare($connect, $insertSql);
            
            if (!$stmt) {
                throw new Exception('삽입 SQL 준비 실패: ' . mysqli_error($connect));
            }
            
            $title = $documentType . '_' . $questionId;
            mysqli_stmt_bind_param($stmt, 'ssss', $fileUrl, $questionId, $kind, $title);
            
            if (!mysqli_stmt_execute($stmt)) {
                throw new Exception('파일 정보 삽입 실패: ' . mysqli_stmt_error($stmt));
            }
            
            debugLog("데이터베이스 삽입 완료");
            mysqli_stmt_close($stmt);
        }
        
        // 상태 관리 시스템
        debugLog("상태 관리 시스템 시작");
        
        // 현재 업로드된 문서들 확인
        $docSql = "SELECT kind FROM image WHERE qnum = ? AND deleteIs = '1'";
        $docStmt = mysqli_prepare($connect, $docSql);
        mysqli_stmt_bind_param($docStmt, 's', $questionId);
        mysqli_stmt_execute($docStmt);
        $docResult = mysqli_stmt_get_result($docStmt);
        
        $uploadedDocs = [];
        while ($row = mysqli_fetch_assoc($docResult)) {
            $uploadedDocs[] = $row['kind'];
        }
        mysqli_stmt_close($docStmt);
        
        debugLog("업로드된 문서들: " . implode(', ', $uploadedDocs));
        
        // 새로운 상태 계산
        $hasSubscription = in_array('8', $uploadedDocs);
        $hasQuestion = in_array('9', $uploadedDocs);
        $hasDepartment = in_array('10', $uploadedDocs);
        
        if ($hasSubscription && $hasQuestion && $hasDepartment) {
            $newStatus = '44'; // 모든 문서 완료
        } else if ($hasSubscription && $hasQuestion) {
            $newStatus = '41'; // 청약서 + 질문서
        } else if ($hasSubscription && $hasDepartment) {
            $newStatus = '42'; // 청약서 + 과별인원
        } else if ($hasQuestion && $hasDepartment) {
            $newStatus = '43'; // 질문서 + 과별인원
        } else if ($hasSubscription) {
            $newStatus = '38'; // 청약서만
        } else if ($hasQuestion) {
            $newStatus = '39'; // 질문서만
        } else if ($hasDepartment) {
            $newStatus = '40'; // 과별인원만
        } else {
            $newStatus = '1'; // 초기 상태
        }
        
        debugLog("계산된 새 상태: " . $newStatus);
        
        // questionnaire 테이블 업데이트
        $statusSql = "UPDATE questionnaire SET ch = ?, wdate_3 = NOW() WHERE num = ?";
        $statusStmt = mysqli_prepare($connect, $statusSql);
        
        if (!$statusStmt) {
            throw new Exception('상태 업데이트 SQL 준비 실패: ' . mysqli_error($connect));
        }
        
        mysqli_stmt_bind_param($statusStmt, 'ss', $newStatus, $questionId);
        
        if (!mysqli_stmt_execute($statusStmt)) {
            throw new Exception('상태 업데이트 실패: ' . mysqli_stmt_error($statusStmt));
        }
        
        mysqli_stmt_close($statusStmt);
        debugLog("상태 업데이트 완료");
        
        // 트랜잭션 커밋
        if (!mysqli_commit($connect)) {
            throw new Exception('트랜잭션 커밋 실패: ' . mysqli_error($connect));
        }
        
        debugLog("트랜잭션 커밋 완료");
        
        // 상태별 메시지
        $statusMessages = [
            '1' => '문서 업로드를 시작해주세요.',
            '38' => '청약서가 업로드되었습니다. 질문서와 과별인원을 업로드해주세요.',
            '39' => '질문서가 업로드되었습니다. 청약서와 과별인원을 업로드해주세요.',
            '40' => '과별인원이 업로드되었습니다. 청약서와 질문서를 업로드해주세요.',
            '41' => '청약서와 질문서가 업로드되었습니다. 과별인원을 업로드해주세요.',
            '42' => '청약서와 과별인원이 업로드되었습니다. 질문서를 업로드해주세요.',
            '43' => '질문서와 과별인원이 업로드되었습니다. 청약서를 업로드해주세요.',
            '44' => '모든 문서 업로드가 완료되었습니다. 결제 방법을 알려주시면 결제를 진행하겠습니다..'
        ];
        
        $statusMessage = $statusMessages[$newStatus] ?? '알 수 없는 상태입니다.';
        
        // 성공 응답
        $response = [
            'success' => true,
            'message' => '파일 ' . ($isUpdate ? '업데이트' : '업로드') . '가 완료되었습니다.',
            'status' => $newStatus,
            'statusMessage' => $statusMessage,
            'uploadedDocuments' => $uploadedDocs,
            'data' => [
                'questionId' => $questionId,
                'documentType' => $documentType,
                'filename' => $uniqueFilename,
                'fileUrl' => $fileUrl,
                'fileSize' => $fileSize,
                'kind' => $kind,
                'isUpdate' => $isUpdate,
                'completedCount' => count($uploadedDocs),
                'totalCount' => 3,
                'progress' => round((count($uploadedDocs) / 3) * 100)
            ]
        ];
        
        debugLog("성공 응답 준비 완료");
        
    } catch (Exception $e) {
        // 트랜잭션 롤백
        mysqli_rollback($connect);
        debugLog("트랜잭션 롤백 완료");
        
        // 업로드된 파일 삭제
        if (file_exists($targetFile)) {
            unlink($targetFile);
            debugLog("업로드된 파일 삭제 완료");
        }
        
        throw $e;
    }
    
} catch (Exception $e) {
    debugLog("오류 발생: " . $e->getMessage());
    
    // 에러 응답
    $response = handleException($e);
    http_response_code(500);
    
} finally {
    // 데이터베이스 연결 종료
    if ($connect) {
        mysqli_close($connect);
        debugLog("데이터베이스 연결 종료");
    }
}

debugLog("응답 출력: " . json_encode($response, JSON_UNESCAPED_UNICODE));

// JSON 응답 출력
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>