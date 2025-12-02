<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

include 'cors.php';
include 'db_connection.php';
header('Content-Type: application/json; charset=UTF-8');

// POST 데이터 가져오기
$num = isset($_POST['num']) ? $_POST['num'] : '';

if (empty($num)) {
    echo json_encode(['success' => false, 'message' => '잘못된 요청입니다.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// DB 연결
$connect = connect_db();

if (!$connect) {
    echo json_encode(['success' => false, 'message' => '데이터베이스 연결 실패'], JSON_UNESCAPED_UNICODE);
    exit;
}

// SQL 쿼리
$query = sprintf("SELECT * FROM questionnaire WHERE num = %d", intval($num));
$result = mysqli_query($connect, $query);

if ($result) {
    $row2 = mysqli_fetch_assoc($result);
    if ($row2) {
        $idnum = $row2['cNum'];
        
        // 디버깅: 데이터 확인
        error_log("DEBUG - num: " . $num);
        error_log("DEBUG - idnum: " . $idnum);
        error_log("DEBUG - school4 (phone): " . $row2['school4']);
        error_log("DEBUG - school5 (email): " . $row2['school5']);
        
        // 이메일 주소 검증
        if (empty($row2['school5'])) {
            echo json_encode([
                'success' => false, 
                'message' => '이메일 주소가 없습니다.',
                'debug' => 'school5 is empty'
            ], JSON_UNESCAPED_UNICODE);
            mysqli_close($connect);
            exit;
        }
        
        if (!filter_var($row2['school5'], FILTER_VALIDATE_EMAIL)) {
            echo json_encode([
                'success' => false, 
                'message' => '올바르지 않은 이메일 형식입니다.',
                'debug' => 'Invalid email: ' . $row2['school5']
            ], JSON_UNESCAPED_UNICODE);
            mysqli_close($connect);
            exit;
        }
        
        // 2014Costmer 테이블 확인
        $iSql = "SELECT * FROM `2014Costmer` WHERE num='$idnum'";
        $iRs = mysqli_query($connect, $iSql);
        
        if (!$iRs) {
            echo json_encode([
                'success' => false, 
                'message' => '2014Costmer 테이블 조회 실패',
                'debug' => mysqli_error($connect)
            ], JSON_UNESCAPED_UNICODE);
            mysqli_close($connect);
            exit;
        }
        
        $iRow = mysqli_fetch_assoc($iRs);
        if (!$iRow) {
            echo json_encode([
                'success' => false, 
                'message' => '2014Costmer 테이블에 데이터가 없습니다.',
                'debug' => 'No data found for idnum: ' . $idnum
            ], JSON_UNESCAPED_UNICODE);
            mysqli_close($connect);
            exit;
        }
        
        error_log("DEBUG - 2014Costmer data found: " . print_r($iRow, true));
        
        // PHP mail() 함수 사용 가능 여부 확인
        if (!function_exists('mail')) {
            echo json_encode([
                'success' => false, 
                'message' => 'PHP mail() 함수를 사용할 수 없습니다.',
                'debug' => 'mail() function not available'
            ], JSON_UNESCAPED_UNICODE);
            mysqli_close($connect);
            exit;
        }
        
        // 이메일 발송 처리
        $email_file = "../php/email_id2.php";
        if (file_exists($email_file)) {
            try {
                // 이메일 발송 전 로그
                error_log("EMAIL SENDING - To: " . $row2['school5']);
                error_log("EMAIL SENDING - From: lincinsu@lincinsu.kr");
                
                // 이메일 발송
                ob_start(); // 출력 버퍼링 시작
                include $email_file;
                $email_output = ob_get_clean(); // 출력 버퍼 내용 가져오기
                
                // 이메일 발송 후 로그
                error_log("EMAIL SENT - Output: " . $email_output);
                
                // 성공 응답 (디버깅 정보 포함)
                echo json_encode([
                    'success' => true, 
                    'idnum' => $idnum,
                    'debug' => [
                        'email_to' => $row2['school5'],
                        'phone' => $row2['school4'],
                        'customer_id' => $iRow['mem_id'] ?? 'N/A',
                        'email_output' => $email_output
                    ]
                ], JSON_UNESCAPED_UNICODE);
                
            } catch (Exception $e) {
                error_log("EMAIL ERROR: " . $e->getMessage());
                echo json_encode([
                    'success' => false, 
                    'message' => '이메일 발송 중 오류 발생',
                    'debug' => $e->getMessage()
                ], JSON_UNESCAPED_UNICODE);
            }
        } else {
            echo json_encode([
                'success' => false, 
                'message' => 'email_id2.php 파일을 찾을 수 없습니다.',
                'debug' => 'File not found: ' . $email_file
            ], JSON_UNESCAPED_UNICODE);
        }
        
        // 🔧 핵심 수정: mysqli_free_result 호출 제거
        // email_id2.php에서 리소스 해제를 담당하도록 함
        
    } else {
        echo json_encode(['success' => false, 'message' => '데이터를 찾을 수 없습니다.'], JSON_UNESCAPED_UNICODE);
    }
} else {
    $error_message = mysqli_error($connect);
    echo json_encode(['success' => false, 'message' => '쿼리 실행 실패: ' . $error_message], JSON_UNESCAPED_UNICODE);
}

// DB 연결 닫기
mysqli_close($connect);
?>