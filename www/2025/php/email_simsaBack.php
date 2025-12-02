<?php
/**
 * 디버깅이 추가된 이메일 발송 시스템
 */

error_log("=== email_simsa.php 실행 시작 ===");
error_log("전달받은 변수 - num: " . (isset($num) ? $num : 'NULL') . ", to: " . (isset($to) ? $to : 'NULL'));

// DB 연결 확인
if (isset($connect) && $connect) {
    error_log("✅ DB 연결 상태 정상");
} else {
    error_log("❌ DB 연결 없음, 재연결 시도");
    include '../db_connection.php';
    $connect = connect_db();
    if ($connect) {
        error_log("✅ DB 재연결 성공");
    } else {
        error_log("❌ DB 재연결 실패");
        exit;
    }
}

// 공통 이메일 라이브러리 포함
$email_helper_path = '/field0327/www/2025/includes/email_helper.php';
error_log("이메일 헬퍼 경로 확인: $email_helper_path");

if (file_exists($email_helper_path)) {
    error_log("✅ email_helper.php 파일 존재");
    require_once $email_helper_path;
    error_log("✅ email_helper.php 로드 완료");
} else {
    error_log("❌ email_helper.php 파일 없음");
    
    // 대체 경로들 시도
    $alt_paths = [
        dirname(__FILE__) . '/../includes/email_helper.php',
        '/field0327/www/includes/email_helper.php'
    ];
    
    $found = false;
    foreach ($alt_paths as $alt_path) {
        error_log("대체 경로 시도: $alt_path");
        if (file_exists($alt_path)) {
            require_once $alt_path;
            error_log("✅ 대체 경로에서 로드 성공: $alt_path");
            $found = true;
            break;
        }
    }
    
    if (!$found) {
        error_log("❌ email_helper.php를 찾을 수 없습니다");
        exit;
    }
}

// 데이터베이스에서 questionnaire 테이블 조회
$table = "questionnaire";
$iSql = "SELECT * FROM " . $table . " WHERE num='$num'";
error_log("실행할 SQL: $iSql");

$iRs = mysqli_query($connect, $iSql);

if (!$iRs) {
    error_log("❌ 쿼리 실행 실패: " . mysqli_error($connect));
    exit;
}

$row2 = mysqli_fetch_assoc($iRs);

if (!$row2) {
    error_log("❌ 데이터 조회 실패: num=$num");
    exit;
}

error_log("✅ 데이터 조회 성공");
error_log("조회된 이메일: " . ($row2['school5'] ?? 'NULL'));

// 청약서 발행 안내 이메일 ($to == 2)
if ($to == 2) {
    error_log("--- 청약서 발행 안내 이메일 처리 시작 ---");
    $subject = "현장실습보험 청약서 발행 안내";
    $to_email = $row2['school5'];
    
    error_log("발송 대상: $to_email");
    
    // 함수 존재 확인
    if (function_exists('sendApplicationGuideEmail')) {
        error_log("✅ sendApplicationGuideEmail 함수 존재");
        $mail_result = sendApplicationGuideEmail($to_email);
        error_log("메일 발송 결과: " . ($mail_result ? "성공" : "실패"));
    } else {
        error_log("❌ sendApplicationGuideEmail 함수 없음");
        
        // 기본 mail() 함수로 대체
        $basic_result = mail($to_email, $subject, "청약서가 발행되었습니다.", "From: lincinsu@lincinsu.kr");
        error_log("기본 mail() 결과: " . ($basic_result ? "성공" : "실패"));
    }
}

// 증권 발급 안내 이메일 ($to == 3)
if ($to == 3) {
    error_log("--- 증권 발급 안내 이메일 처리 시작 ---");
    $subject = "현장실습보험 증권 발급 안내";
    $to_email = $row2['school5'];
    
    error_log("발송 대상: $to_email");
    
    // 함수 존재 확인
    if (function_exists('sendCertificateNotificationEmail')) {
        error_log("✅ sendCertificateNotificationEmail 함수 존재");
        $mail_result = sendCertificateNotificationEmail($to_email);
        error_log("메일 발송 결과: " . ($mail_result ? "성공" : "실패"));
    } else {
        error_log("❌ sendCertificateNotificationEmail 함수 없음");
        
        // 기본 mail() 함수로 대체
        $basic_result = mail($to_email, $subject, "증권이 발급되었습니다.", "From: lincinsu@lincinsu.kr");
        error_log("기본 mail() 결과: " . ($basic_result ? "성공" : "실패"));
    }
}

// 결과 리소스 해제
if ($iRs && is_object($iRs)) {
    mysqli_free_result($iRs);
}

error_log("=== email_simsa.php 실행 완료 ===");
?>