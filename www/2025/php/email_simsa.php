<?php
/**
 * 공통 이메일 라이브러리를 사용하는 개선된 이메일 발송 시스템
 */

// 공통 이메일 라이브러리 포함
require_once '/field0327/www/2025/includes/email_helper.php';

// 데이터베이스에서 questionnaire 테이블 조회
$table = "questionnaire";
$iSql = "SELECT * FROM " . $table . " WHERE num='$num'";
$iRs = mysqli_query($connect, $iSql);
$row2 = mysqli_fetch_assoc($iRs);

// 청약서 발행 안내 이메일 ($to == 2)
if ($to == 2) {
    $subject = "현장실습보험 청약서 발행 안내";
    $to_email = $row2['school5'];
    
    // 🚀 공통 라이브러리 사용하여 청약서 안내 이메일 발송
    $mail_result = sendApplicationGuideEmail($to_email);
    
    // 발송 결과 로그
    if ($mail_result) {
        error_log("✅ 청약서 발행 안내 이메일 발송 성공: " . $to_email);
    } else {
        error_log("❌ 청약서 발행 안내 이메일 발송 실패: " . $to_email);
    }
}

// 증권 발급 안내 이메일 ($to == 3)
if ($to == 3) {
    $subject = "현장실습보험 증권 발급 안내";
    $to_email = $row2['school5'];
    
    // 🚀 공통 라이브러리 사용하여 증권 발급 안내 이메일 발송
    $mail_result = sendCertificateNotificationEmail($to_email);
    
    // 발송 결과 로그
    if ($mail_result) {
        error_log("✅ 증권 발급 안내 이메일 발송 성공: " . $to_email);
    } else {
        error_log("❌ 증권 발급 안내 이메일 발송 실패: " . $to_email);
    }
}

// 결과 리소스 해제
if ($iRs && is_object($iRs)) {
    mysqli_free_result($iRs);
}
?>