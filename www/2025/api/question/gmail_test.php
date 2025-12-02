<?php
/**
 * Gmail SMTP 직접 테스트
 * 이 파일을 서버에 업로드하고 브라우저에서 실행
 */

header('Content-Type: text/html; charset=UTF-8');
echo "<h1>Gmail SMTP 테스트</h1>";

// 1. email_helper.php 로드 테스트
echo "<h2>1. email_helper.php 로드 테스트</h2>";
$email_helper_path = '/field0327/www/2025/includes/email_helper.php';

if (file_exists($email_helper_path)) {
    echo "✅ email_helper.php 파일 존재<br>";
    require_once $email_helper_path;
    echo "✅ email_helper.php 로드 완료<br>";
} else {
    echo "❌ email_helper.php 파일 없음<br>";
    die();
}

// 2. 함수 존재 확인
echo "<h2>2. 함수 존재 확인</h2>";
if (function_exists('sendEmail')) {
    echo "✅ sendEmail 함수 존재<br>";
} else {
    echo "❌ sendEmail 함수 없음<br>";
}

if (function_exists('sendCertificateNotificationEmail')) {
    echo "✅ sendCertificateNotificationEmail 함수 존재<br>";
} else {
    echo "❌ sendCertificateNotificationEmail 함수 없음<br>";
}

// 3. PHPMailer 확인
echo "<h2>3. PHPMailer 확인</h2>";
if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    echo "✅ PHPMailer 클래스 존재<br>";
} else {
    echo "❌ PHPMailer 클래스 없음<br>";
}

// 4. 실제 Gmail SMTP 테스트
echo "<h2>4. 실제 Gmail SMTP 테스트</h2>";
$test_email = "insokkibs@gmail.com";
echo "테스트 대상: $test_email<br>";

// sendEmail 함수로 직접 테스트
if (function_exists('sendEmail')) {
    echo "sendEmail 함수로 테스트 중...<br>";
    $subject = "SMTP 테스트 " . date('H:i:s');
    $content = "<h2>Gmail SMTP 테스트</h2><p>이 메일이 도착했다면 SMTP가 정상 작동합니다.</p>";
    
    $result = sendEmail($test_email, $subject, $content);
    echo "sendEmail 결과: " . ($result ? "✅ 성공" : "❌ 실패") . "<br>";
}

// sendCertificateNotificationEmail 함수로 테스트
if (function_exists('sendCertificateNotificationEmail')) {
    echo "sendCertificateNotificationEmail 함수로 테스트 중...<br>";
    $result2 = sendCertificateNotificationEmail($test_email);
    echo "sendCertificateNotificationEmail 결과: " . ($result2 ? "✅ 성공" : "❌ 실패") . "<br>";
}

// 5. 기본 mail() 함수와 비교
echo "<h2>5. 기본 mail() 함수 테스트</h2>";
$basic_result = mail($test_email, "기본 mail() 테스트", "기본 mail() 함수 테스트입니다.", "From: lincinsu@lincinsu.kr");
echo "기본 mail() 결과: " . ($basic_result ? "✅ 성공" : "❌ 실패") . "<br>";

echo "<br><strong>이 결과를 확인하여 어떤 방법이 작동하는지 파악하세요.</strong>";
?>