<?php
/**
 * 수정된 email_id2.php - 카카오 메일 발송 문제 해결
 */

// PHPMailer 라이브러리 포함 (use 문을 위해 상단에 배치)
require_once '/field0327/www/2025/phpmailer/src/PHPMailer.php';
require_once '/field0327/www/2025/phpmailer/src/SMTP.php';
require_once '/field0327/www/2025/phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// 공통 이메일 라이브러리 포함
require_once '/field0327/www/2025/includes/email_helper.php';

$iSql="SELECT * FROM `2014Costmer` WHERE num='$idnum'";
$iRs=mysqli_query($connect,$iSql);
$iRow=mysqli_fetch_assoc($iRs);

// 전화번호 처리 (기존 로직 유지)
$phone_clean = str_replace('-', '', $row2['school4']);
$phone_clean = preg_replace('/[^0-9]/', '', $phone_clean);
if (strlen($phone_clean) >= 8) {
    $pass = array(
        0 => substr($phone_clean, 0, -8),
        1 => substr($phone_clean, -8, 4),
        2 => substr($phone_clean, -4)
    );
} else {
    $pass = array(0 => '', 1 => '0000', 2 => '0000');
}
$passw = md5($pass[1].$pass[2]);

// 이메일 내용 생성
$user_id = $iRow['mem_id'] ?? '';
$password = ($pass[1] ?? '') . ($pass[2] ?? '');
$to_email = $row2['school5'];

// 카카오 메일인지 확인
$is_kakao = strpos($to_email, '@kakao.com') !== false;

// 🔧 카카오 메일 특별 처리
if ($is_kakao) {
    // 카카오 전용 설정으로 이메일 발송
    $special_options = [
        'from_email' => 'insokkibs@gmail.com',  // Gmail 주소 직접 사용
        'from_name' => '현장실습보험지원팀',
        'reply_to' => 'insokkibs@gmail.com',
        'force_smtp' => true  // 강제로 SMTP 사용
    ];
    
    // 카카오용 특별 제목 (스팸 필터 회피)
    $kakao_subject = "[현장실습보험] 로그인 정보 안내";
    
    // 카카오용 간소화된 HTML 내용
    $kakao_html = createKakaoCompatibleHTML($user_id, $password);
    
    error_log("🔍 카카오 메일 감지: " . $to_email . " - 특별 처리 모드");
    
    // 첫 번째 시도: 특별 설정으로 발송
    $mail_result = sendEmail($to_email, $kakao_subject, $kakao_html, $special_options);
    
    // 실패 시 두 번째 시도: 플레인 텍스트로 발송
    if (!$mail_result) {
        error_log("⚠️ 카카오 HTML 메일 실패, 플레인 텍스트로 재시도: " . $to_email);
        
        $plain_text_content = createPlainTextEmail($user_id, $password);
        $mail_result = sendKakaoPlainTextEmail($to_email, $kakao_subject, $plain_text_content);
    }
    
    // 세 번째 시도: 대체 SMTP 설정
    if (!$mail_result) {
        error_log("⚠️ 카카오 플레인 텍스트도 실패, 대체 방법 시도: " . $to_email);
        $mail_result = sendViaAlternativeSMTP($to_email, $kakao_subject, $kakao_html);
    }
    
} else {
    // 일반 메일은 기존 방식 사용
    $mail_result = sendLoginInfoEmail($to_email, $user_id, $password);
}

// 발송 결과 로그
if ($mail_result) {
    error_log("✅ 이메일 발송 성공: " . $to_email . ($is_kakao ? ' (카카오 특별처리)' : ' (일반처리)'));
    $response['email_status'] = 'success';
    $response['email_method'] = $is_kakao ? 'kakao_special' : 'normal';
} else {
    error_log("❌ 이메일 발송 최종 실패: " . $to_email);
    $response['email_status'] = 'failed';
    $response['email_error'] = 'All methods failed for kakao email';
}

// 데이터베이스 업데이트
$idUpdate = "UPDATE 2014Costmer SET idmail='".$row2['school5']."', passwd='$passw' WHERE num='$idnum'";
mysqli_query($connect, $idUpdate);

// 결과 리소스 해제
if ($iRs && is_object($iRs)) {
    mysqli_free_result($iRs);
}

/**
 * 카카오 호환 HTML 생성 (간소화된 버전)
 */
function createKakaoCompatibleHTML($user_id, $password) {
    return '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>현장실습보험 로그인 정보</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
        
        <h2 style="color: #009E25; text-align: center;">현장실습보험 로그인 정보</h2>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; background: #e9e9e9; border: 1px solid #ddd; font-weight: bold;">아이디</td>
                    <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace;">' . htmlspecialchars($user_id) . '</td>
                </tr>
                <tr>
                    <td style="padding: 10px; background: #e9e9e9; border: 1px solid #ddd; font-weight: bold;">비밀번호</td>
                    <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace; font-weight: bold;">' . htmlspecialchars($password) . '</td>
                </tr>
            </table>
        </div>
        
        <p>안녕하십니까. 현장실습보험 문의에 감사드립니다.</p>
        <p>위 정보로 아래 사이트에 접속하여 보험 관련 업무를 진행하시면 됩니다.</p>
        
        <div style="text-align: center; margin: 20px 0;">
            <a href="http://www.lincinsu.kr/1.html" style="color: #009E25; font-weight: bold;">
                현장실습보험 지원 사이트: www.lincinsu.kr/1.html
            </a>
        </div>
        
        <div style="text-align: center; margin-top: 30px; font-size: 14px; color: #666;">
            <div>이투엘보험대리점 현장실습보험지원팀</div>
            <div>070-7813-1675</div>
        </div>
        
    </div>
</body>
</html>';
}

/**
 * 플레인 텍스트 이메일 생성
 */
function createPlainTextEmail($user_id, $password) {
    return "
=== 현장실습보험 로그인 정보 ===

안녕하십니까. 현장실습보험 문의에 감사드립니다.

로그인 정보:
- 아이디: {$user_id}
- 비밀번호: {$password}

위 정보로 아래 사이트에 접속하여 보험 관련 업무를 진행하시면 됩니다.

사이트 주소: http://www.lincinsu.kr/1.html

문의: 이투엘보험대리점 현장실습보험지원팀
전화: 070-7813-1675

감사합니다.
";
}

/**
 * 카카오용 플레인 텍스트 이메일 발송
 */
function sendKakaoPlainTextEmail($to_email, $subject, $plain_content) {
    $headers = "";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "From: \"현장실습보험지원팀\" <insokkibs@gmail.com>\r\n";
    $headers .= "Reply-To: insokkibs@gmail.com\r\n";
    $headers .= "X-Mailer: lincinsu-kakao-special\r\n";
    $headers .= "X-Priority: 3\r\n";
    
    $result = mail($to_email, $subject, $plain_content, $headers);
    
    if ($result) {
        error_log("✅ 카카오 플레인 텍스트 발송 성공: " . $to_email);
    } else {
        error_log("❌ 카카오 플레인 텍스트 발송 실패: " . $to_email);
    }
    
    return $result;
}

/**
 * 대체 SMTP 방법 (직접 PHPMailer 사용)
 */
function sendViaAlternativeSMTP($to_email, $subject, $html_content) {
    $mail = new PHPMailer(true);
    
    try {
        // 카카오 특화 SMTP 설정
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'insokkibs@gmail.com';
        $mail->Password = 'beotwvqhowvdgdfq';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        
        // 카카오 특화 설정
        $mail->SMTPOptions = array(
            'ssl' => array(
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            )
        );
        
        // 발신자/수신자 설정
        $mail->setFrom('insokkibs@gmail.com', '현장실습보험지원팀');
        $mail->addAddress($to_email);
        $mail->addReplyTo('insokkibs@gmail.com', '현장실습보험지원팀');
        
        // 이메일 내용
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $html_content;
        
        // 발송
        $result = $mail->send();
        
        if ($result) {
            error_log("✅ 대체 SMTP 발송 성공: " . $to_email);
            return true;
        }
        
    } catch (Exception $e) {
        error_log("❌ 대체 SMTP 발송 실패: " . $to_email . " | Error: " . $mail->ErrorInfo);
    }
    
    return false;
}
?>