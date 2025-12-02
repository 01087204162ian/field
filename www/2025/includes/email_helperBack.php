<?php
/**
 * 공통 이메일 발송 라이브러리
 * 파일명: /field0327/www/2025/includes/email_helper.php
 */

// PHPMailer 라이브러리 포함 (경로는 실제 환경에 맞게 조정)
require_once '/field0327/www/2025/phpmailer/src/PHPMailer.php';
require_once '/field0327/www/2025/phpmailer/src/SMTP.php';
require_once '/field0327/www/2025/phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

/**
 * 이메일 발송 설정
 */
class EmailConfig {
    // Gmail SMTP 설정 (실제 값으로 변경 필요)
    const SMTP_HOST = 'smtp.gmail.com';
    const SMTP_PORT = 587;
    const SMTP_USERNAME = 'insokkibs@gmail.com';      // ⚠️ 실제 Gmail로 변경
    const SMTP_PASSWORD = 'beotwvqhowvdgdfq'; // ⚠️ 실제 앱 비밀번호로 변경
    
    // 기본 발신자 정보
    const DEFAULT_FROM_EMAIL = 'lincinsu@lincinsu.kr';
    const DEFAULT_FROM_NAME = '현장실습보험지원팀';
    const DEFAULT_REPLY_TO = 'lincinsu@lincinsu.kr';
}

/**
 * 통합 이메일 발송 함수
 * Gmail/카카오는 SMTP, 다른 도메인은 mail() 사용
 */
function sendEmail($to_email, $subject, $html_content, $options = []) {
    // 기본 옵션 설정
    $default_options = [
        'from_email' => EmailConfig::DEFAULT_FROM_EMAIL,
        'from_name' => EmailConfig::DEFAULT_FROM_NAME,
        'reply_to' => EmailConfig::DEFAULT_REPLY_TO,
        'force_smtp' => false // true로 설정하면 모든 메일을 SMTP로 발송
    ];
    
    $options = array_merge($default_options, $options);
    
    // Gmail/카카오 또는 force_smtp가 true인 경우 SMTP 사용
    $use_smtp = $options['force_smtp'] || 
                strpos($to_email, '@gmail.com') !== false || 
                strpos($to_email, '@kakao.com') !== false ||
                strpos($to_email, '@hotmail.com') !== false ||
                strpos($to_email, '@outlook.com') !== false;
    
    if ($use_smtp) {
        return sendViaSMTP($to_email, $subject, $html_content, $options);
    } else {
        return sendViaMailFunction($to_email, $subject, $html_content, $options);
    }
}

/**
 * SMTP를 통한 이메일 발송
 */
function sendViaSMTP($to_email, $subject, $html_content, $options) {
    $mail = new PHPMailer(true);

    try {
        // SMTP 설정
        $mail->isSMTP();
        $mail->Host = EmailConfig::SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = EmailConfig::SMTP_USERNAME;
        $mail->Password = EmailConfig::SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = EmailConfig::SMTP_PORT;
        $mail->CharSet = 'UTF-8';

        // 발신자/수신자 설정
        $mail->setFrom($options['from_email'], $options['from_name']);
        $mail->addAddress($to_email);
        $mail->addReplyTo($options['reply_to'], $options['from_name']);

        // 이메일 내용
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $html_content;

        // 발송
        $result = $mail->send();
        
        if ($result) {
            error_log("✅ SMTP 발송 성공: " . $to_email . " | Subject: " . $subject);
            return true;
        }
        
    } catch (Exception $e) {
        error_log("❌ SMTP 발송 실패: " . $to_email . " | Error: " . $mail->ErrorInfo);
        return false;
    }
    
    return false;
}

/**
 * PHP mail() 함수를 통한 이메일 발송
 */
function sendViaMailFunction($to_email, $subject, $html_content, $options) {
    // 헤더 구성
    $headers = "";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: \"{$options['from_name']}\" <{$options['from_email']}>\r\n";
    $headers .= "Reply-To: {$options['reply_to']}\r\n";
    $headers .= "X-Mailer: lincinsu.kr-system\r\n";
    $headers .= "X-Priority: 3\r\n";
    $headers .= "Message-ID: <" . time() . "." . rand(1000,9999) . "@lincinsu.kr>\r\n";
    
    // 메일 발송
    $result = mail($to_email, $subject, $html_content, $headers);
    
    if ($result) {
        error_log("✅ mail() 발송 성공: " . $to_email . " | Subject: " . $subject);
    } else {
        error_log("❌ mail() 발송 실패: " . $to_email . " | Subject: " . $subject);
    }
    
    return $result;
}

/**
 * 현장실습보험 로그인 정보 메일 발송 (특화 함수)
 */
function sendLoginInfoEmail($to_email, $user_id, $password) {
    $subject = "[lincinsu.kr] 현장실습보험 로그인 정보";
    
    $html_content = createLoginInfoHTML($user_id, $password);
    
    return sendEmail($to_email, $subject, $html_content);
}

/**
 * 문의 접수 확인 메일 발송 (특화 함수)
 */
function sendContactConfirmEmail($to_email, $contact_data) {
    $subject = "[lincinsu.kr] 문의 접수 완료";
    
    $html_content = createContactConfirmHTML($contact_data);
    
    return sendEmail($to_email, $subject, $html_content);
}

/**
 * 로그인 정보 HTML 생성
 */
function createLoginInfoHTML($user_id, $password) {
    return '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>현장실습보험 로그인 정보</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    
                    <!-- 헤더 -->
                    <tr>
                        <td style="background: #009E25; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">현장실습보험</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0;">로그인 정보 안내</p>
                        </td>
                    </tr>
                    
                    <!-- 로그인 정보 -->
                    <tr>
                        <td style="padding: 40px;">
                            
                            <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                <h2 style="color: #009E25; margin: 0 0 20px 0;">🔐 로그인 정보</h2>
                                
                                <table width="100%" style="border-collapse: collapse;">
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 15px; border: 1px solid #ccc; font-weight: bold; text-align: center; width: 30%;">아이디</td>
                                        <td style="background: #ffffff; padding: 15px; border: 1px solid #ccc; text-align: center; font-family: monospace; font-size: 16px;">' . htmlspecialchars($user_id) . '</td>
                                    </tr>
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 15px; border: 1px solid #ccc; font-weight: bold; text-align: center;">비밀번호</td>
                                        <td style="background: #ffffff; padding: 15px; border: 1px solid #ccc; text-align: center; font-family: monospace; font-size: 16px; font-weight: bold;">' . htmlspecialchars($password) . '</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <p style="line-height: 1.6;">안녕하십니까.</p>
                            <p style="line-height: 1.6;">현장실습보험 문의에 깊이 감사드립니다.</p>
                            <p style="line-height: 1.6;">상단에 기재된 ID와 비밀번호로 아래 사이트에 접속하여 보험 관련 업무를 진행하시면 됩니다.</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://www.lincinsu.kr/1.html" 
                                   style="background: #009E25; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                    현장실습보험 지원 사이트 바로가기
                                </a>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <!-- 푸터 -->
                    <tr>
                        <td style="background: #f8f9fa; padding: 25px; text-align: center;">
                            <div style="color: #009E25; font-weight: bold;">이투엘보험대리점</div>
                            <div style="color: #009E25; font-weight: bold;">현장실습보험지원팀</div>
                            <div style="color: #009E25; font-weight: bold;">070-7813-1675</div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
    
</body>
</html>';
}

/**
 * 문의 확인 HTML 생성
 */
function createContactConfirmHTML($contact_data) {
    return '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>문의 접수 완료</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    
                    <!-- 헤더 -->
                    <tr>
                        <td style="background: #009E25; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">현장실습보험</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0;">문의 접수 완료</p>
                        </td>
                    </tr>
                    
                    <!-- 내용 -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="line-height: 1.6;">안녕하십니까.</p>
                            <p style="line-height: 1.6;">현장실습보험 문의를 접수했습니다.</p>
                            <p style="line-height: 1.6;">빠른 시일 내에 담당자가 연락드리겠습니다.</p>
                            
                            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <h3 style="color: #009E25; margin: 0 0 15px 0;">접수 내용</h3>
                                <p><strong>이름:</strong> ' . htmlspecialchars($contact_data['name'] ?? '') . '</p>
                                <p><strong>연락처:</strong> ' . htmlspecialchars($contact_data['phone'] ?? '') . '</p>
                                <p><strong>이메일:</strong> ' . htmlspecialchars($contact_data['email'] ?? '') . '</p>
                            </div>
                            
                            <p style="line-height: 1.6;">감사합니다.</p>
                        </td>
                    </tr>
                    
                    <!-- 푸터 -->
                    <tr>
                        <td style="background: #f8f9fa; padding: 25px; text-align: center;">
                            <div style="color: #009E25; font-weight: bold;">이투엘보험대리점</div>
                            <div style="color: #009E25; font-weight: bold;">현장실습보험지원팀</div>
                            <div style="color: #009E25; font-weight: bold;">070-7813-1675</div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
    
</body>
</html>';
}

/**
 * 이메일 헬퍼 라이브러리 - 추가 함수들
 * /field0327/www/2025/includes/email_helper.php 파일에 추가할 함수들
 */

/**
 * 청약서 발행 안내 이메일 발송
 * @param string $to_email 받는 사람 이메일
 * @return bool 발송 성공 여부
 */
function sendApplicationGuideEmail($to_email) {
    $subject = "현장실습보험 청약서 발행 안내";
    $mail_from = "lincinsu@lincinsu.kr";
    
    // 이메일 헤더 설정
    $headers = "";
    $headers .= "Return-Path: " . trim($mail_from) . "\r\n";
    $headers .= "From: lincinsu@lincinsu.kr\r\n";
    $headers .= "Content-Type: text/html; charset=utf-8\r\n";
    
    // 제목 인코딩
    $charset = 'UTF-8';
    $encoded_subject = "=?" . $charset . "?B?" . base64_encode($subject) . "?=\n";
    
    // 이메일 내용
    $contents = getApplicationGuideEmailContent();
    
    // 이메일 발송
    try {
        $result = mail($to_email, $encoded_subject, $contents, $headers);
        return $result;
    } catch (Exception $e) {
        error_log("청약서 안내 이메일 발송 오류: " . $e->getMessage());
        return false;
    }
}

/**
 * 증권 발급 안내 이메일 발송
 * @param string $to_email 받는 사람 이메일
 * @return bool 발송 성공 여부
 */
function sendCertificateNotificationEmail($to_email) {
    $subject = "현장실습보험 증권 발급 안내";
    $mail_from = "lincinsu@lincinsu.kr";
    
    // 이메일 헤더 설정
    $headers = "";
    $headers .= "Return-Path: " . trim($mail_from) . "\r\n";
    $headers .= "From: lincinsu@lincinsu.kr\r\n";
    $headers .= "Content-Type: text/html; charset=utf-8\r\n";
    
    // 제목 인코딩
    $charset = 'UTF-8';
    $encoded_subject = "=?" . $charset . "?B?" . base64_encode($subject) . "?=\n";
    
    // 이메일 내용
    $contents = getCertificateNotificationEmailContent();
    
    // 이메일 발송
    try {
        $result = mail($to_email, $encoded_subject, $contents, $headers);
        return $result;
    } catch (Exception $e) {
        error_log("증권 발급 안내 이메일 발송 오류: " . $e->getMessage());
        return false;
    }
}

/**
 * 청약서 발행 안내 이메일 내용 반환
 * @return string HTML 형식의 이메일 내용
 */
function getApplicationGuideEmailContent() {
    return '<p class="MsoNormal" style="line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt; text-align: justify;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">안녕하십니까.</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">견적의뢰를 바탕으로 청약서를 발행하였습니다.</span>
    </p>
    
    <p class="MsoNormal" style="line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt; text-align: justify;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">결제 정보와 필요 서류를 <b>메일로 회신</b>해주세요.</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <b style="font-size: 10pt; font-family: \'맑은 고딕\';">
            <span style="font-size: 12.0pt; color: black;">1. 결제 정보</span>
        </b>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">보험료는 가상계좌를 발급받아 입금하시거나, 법인카드로 결제하실 수 있습니다.</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">1) <b>가상계좌</b> 발급을 원하시는 경우 선호하시는 은행 정보를 적어주세요.</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">메일 주신 당일에 가상계좌를 발급하여 지원 사이트(
        <a href="https://www.lincinsu.kr/index2.php/school/rider">https://www.lincinsu.kr/index2.php/school/rider</a>)에 업로드 해드립니다.</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">2) <b>법인카드</b>로 결제하실 경우 카드 번호와 유효기간을 적어주세요. 메일 주신 당일에 결제를 진행합니다.</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 9pt; color: black; font-family: \'맑은 고딕\';">(개인 소유의 법인카드일 경우, 해당 카드로 최초 결제시 담당자 분의 최근 3개월 내 발급된 재직증명서가 필요합니다.</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 9pt; color: black; font-family: \'맑은 고딕\';">동일한 카드로 결제한 이력이 있으시면, 카드 사본과 소유자 사원증이 필요합니다.)</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">*메일 회신 완료 후 카드 결제 진행 또는 가상계좌 입금을 확인 후 1~2영업일 안에 증권을 발급하여 메일로 안내 드립니다.</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <b style="font-size: 10pt; font-family: \'맑은 고딕\';">
            <span style="font-size: 12.0pt; color: black;">2. 필요 서류</span>
        </b>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">1) 질문서 스캔본 (
        <a href="https://www.lincinsu.kr/index2.php/school/rider">https://www.lincinsu.kr/index2.php/school/rider</a> 접속하셔서 파일을 출력해 직인을 날인해주세요)</span>
    </p>
    
    <p class="MsoNormal" align="left" style="margin: 0cm; text-align: left; line-height: normal; word-break: keep-all;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">2) 청약서 스캔본 (
        <a href="https://www.lincinsu.kr/index2.php/school/rider">https://www.lincinsu.kr/index2.php/school/rider</a> 접속하셔서 파일을 출력해 직인을 날인해주세요)</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">3) 학과별 인원 현황 (예시를 참고하여 학과 및 인원 수만 기재한 엑셀파일)</span>
    </p>
    
    <table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" width="144" style="width: 108.0pt;border-collapse: collapse;">
        <tr style="height: 16.5pt;">
            <td width="144" colspan="2" style="width: 108.0pt;border: solid windowtext 1.0pt;padding: 0cm 4.95pt 0cm 4.95pt;height: 16.5pt;">
                <p class="MsoNormal" align="center" style="margin: 0cm; text-align: center; line-height: normal; word-break: keep-all;">
                    <span style="font-size: 11pt; color: black; font-family: \'맑은 고딕\';">ㅇㅇ대학교</span>
                </p>
            </td>
        </tr>
        <tr style="height: 16.5pt;">
            <td width="72" style="width: 54.0pt;border: solid windowtext 1.0pt;border-top: none;padding: 0cm 4.95pt 0cm 4.95pt;height: 16.5pt;">
                <p class="MsoNormal" align="center" style="margin: 0cm; text-align: center; line-height: normal; word-break: keep-all;">
                    <span style="font-size: 11pt; color: black; font-family: \'맑은 고딕\';">학과명</span>
                </p>
            </td>
            <td width="72" style="width: 54.0pt;border-top: none;border-left: none;border-bottom: solid windowtext 1.0pt;border-right: solid windowtext 1.0pt;padding: 0cm 4.95pt 0cm 4.95pt;height: 16.5pt;">
                <p class="MsoNormal" align="center" style="margin: 0cm; text-align: center; line-height: normal; word-break: keep-all;">
                    <span style="font-size: 11pt; color: black; font-family: \'맑은 고딕\';">인원수</span>
                </p>
            </td>
        </tr>
        <tr style="height: 16.5pt;">
            <td width="72" style="width: 54.0pt;border: solid windowtext 1.0pt;border-top: none;padding: 0cm 4.95pt 0cm 4.95pt;height: 16.5pt;">
                <p class="MsoNormal" align="center" style="margin: 0cm; text-align: center; line-height: normal; word-break: keep-all;">
                    <span style="font-size: 11pt; color: black; font-family: \'맑은 고딕\';">A학과</span>
                </p>
            </td>
            <td width="72" style="width: 54.0pt;border-top: none;border-left: none;border-bottom: solid windowtext 1.0pt;border-right: solid windowtext 1.0pt;padding: 0cm 4.95pt 0cm 4.95pt;height: 16.5pt;">
                <p class="MsoNormal" align="center" style="margin: 0cm; text-align: center; line-height: normal; word-break: keep-all;">
                    <span style="font-size: 11pt; color: black; font-family: \'맑은 고딕\';">1</span>
                </p>
            </td>
        </tr>
        <tr style="height: 16.5pt;">
            <td width="72" style="width: 54.0pt;border: solid windowtext 1.0pt;border-top: none;padding: 0cm 4.95pt 0cm 4.95pt;height: 16.5pt;">
                <p class="MsoNormal" align="center" style="margin: 0cm; text-align: center; line-height: normal; word-break: keep-all;">
                    <span style="font-size: 11pt; color: black; font-family: \'맑은 고딕\';">B학과</span>
                </p>
            </td>
            <td width="72" style="width: 54.0pt;border-top: none;border-left: none;border-bottom: solid windowtext 1.0pt;border-right: solid windowtext 1.0pt;padding: 0cm 4.95pt 0cm 4.95pt;height: 16.5pt;">
                <p class="MsoNormal" align="center" style="margin: 0cm; text-align: center; line-height: normal; word-break: keep-all;">
                    <span style="font-size: 11pt; color: black; font-family: \'맑은 고딕\';">3</span>
                </p>
            </td>
        </tr>
        <tr style="height: 16.5pt;">
            <td width="72" style="width: 54.0pt;border: solid windowtext 1.0pt;border-top: none;padding: 0cm 4.95pt 0cm 4.95pt;height: 16.5pt;">
                <p class="MsoNormal" align="center" style="margin: 0cm; text-align: center; line-height: normal; word-break: keep-all;">
                    <span style="font-size: 11pt; color: black; font-family: \'맑은 고딕\';">총</span>
                </p>
            </td>
            <td width="72" style="width: 54.0pt;border-top: none;border-left: none;border-bottom: solid windowtext 1.0pt;border-right: solid windowtext 1.0pt;padding: 0cm 4.95pt 0cm 4.95pt;height: 16.5pt;">
                <p class="MsoNormal" align="center" style="margin: 0cm; text-align: center; line-height: normal; word-break: keep-all;">
                    <span style="font-size: 11pt; color: black; font-family: \'맑은 고딕\';">4</span>
                </p>
            </td>
        </tr>
    </table>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">4) 개인 소유의 법인카드로 결제하실 경우</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">- 해당 카드로 최초 결제시 담당자 분의 최근 3개월 내 발급된 재직증명서.</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 10.5pt; color: black; font-family: \'맑은 고딕\';">- 결제한 이력이 있으시면 카드 사본과 소유자 사원증 사본.</span>
    </p>
    
    <br>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 9pt; color: rgb(0, 158, 37); font-family: \'맑은 고딕\';">이투엘보험대리점</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 9pt; color: rgb(0, 158, 37); font-family: \'맑은 고딕\';">현장실습보험지원팀</span>
    </p>
    
    <p class="MsoNormal" align="left" style="text-align: left; line-height: normal; word-break: keep-all; margin: 0cm 0cm 10pt;">
        <span style="font-size: 9pt; color: rgb(0, 158, 37); font-family: \'맑은 고딕\';">1533-5013</span>
    </p>
    
    <p class="MsoNormal" align="left" style="margin: 0cm; text-align: left; line-height: normal; word-break: keep-all;">
        <span style="font-size: 8pt; color: rgb(99, 99, 99); background: white; font-family: \'맑은 고딕\';">현장실습보험은 </span>
        <span style="font-size: 8pt; color: rgb(255, 68, 17); background: white; font-family: \'맑은 고딕\';">한화손해보험</span>
        <span style="font-size: 8pt; color: rgb(99, 99, 99); background: white; font-family: \'맑은 고딕\';">에서 제공합니다.</span>
    </p>';
}

/**
 * 증권 발급 안내 이메일 내용 반환
 * @return string HTML 형식의 이메일 내용
 */
function getCertificateNotificationEmailContent() {
    return '<p class="MsoNormal" style="margin: 0cm 0cm 10pt; text-align: justify; line-height: 115%;">
        <span style="font-size: 10.5pt; line-height: 115%; color: black; font-family: \'맑은 고딕\';">안녕하십니까.</span>
    </p>
    
    <p class="MsoNormal" style="margin: 0cm 0cm 10pt; text-align: justify; line-height: 115%;">
        <span style="font-size: 10.5pt; line-height: 115%; font-family: \'맑은 고딕\';">견적 의뢰하셨던 현장실습보험 증권이 발급되었습니다.</span>
    </p>
    
    <p class="MsoNormal" style="margin: 0cm 0cm 10pt; text-align: justify; line-height: 115%;">
        <span style="font-size: 10.5pt; line-height: 115%; color: black; font-family: \'맑은 고딕\';">아래 지원 사이트에 로그인하셔서 증권을 다운 받으시기 바랍니다.</span>
    </p>
    
    <p class="MsoNormal" style="margin: 0cm 0cm 10pt; text-align: justify; line-height: 115%;">
        <span style="font-size: 10pt; font-family: \'맑은 고딕\';">
            <a href="https://www.lincinsu.kr/index2.php/school/rider" target="_blank">
                <span style="font-size: 10.5pt;line-height: 115%;">https://www.lincinsu.kr/index2.php/school/rider</span>
            </a>
        </span>
    </p>
    
    <br>
    
    <p class="MsoNormal" style="margin: 0cm 0cm 10pt; text-align: justify; line-height: 115%;">
        <span style="font-size: 9pt; line-height: 115%; color: rgb(0, 158, 37); font-family: \'맑은 고딕\';">이투엘보험대리점</span>
    </p>
    
    <p class="MsoNormal" style="margin: 0cm 0cm 10pt; text-align: justify; line-height: 115%;">
        <span style="font-size: 9pt; line-height: 115%; color: rgb(0, 158, 37); font-family: \'맑은 고딕\';">현장실습보험지원팀</span>
    </p>
    
    <p class="MsoNormal" style="margin: 0cm 0cm 10pt; text-align: justify; line-height: 115%;">
        <span style="font-size: 9pt; line-height: 115%; color: rgb(0, 158, 37); font-family: \'맑은 고딕\';">1533-5013</span>
    </p>
    
    <p class="MsoNormal" style="margin: 0cm 0cm 10pt; text-align: justify; line-height: 115%;">
        <span style="font-size: 8pt; line-height: 115%; color: rgb(99, 99, 99); background: white; font-family: \'맑은 고딕\';">현장실습보험은 </span>
        <span style="font-size: 8pt; line-height: 115%; color: rgb(255, 68, 17); background: white; font-family: \'맑은 고딕\';">한화손해보험</span>
        <span style="font-size: 8pt; line-height: 115%; color: rgb(99, 99, 99); background: white; font-family: \'맑은 고딕\';">에서 제공합니다.</span>
    </p>';
}


/**
 * 대학교 견적 신청 확인 메일 HTML 생성
 * 이 함수를 email_helper.php 파일의 맨 끝에 추가하세요 (?> 태그 제거 후)
 */
function createUniversityQuoteConfirmHTML($mail_data) {
    $university_name = htmlspecialchars($mail_data['university_name'] ?? '');
    $business_number = htmlspecialchars($mail_data['business_number'] ?? '');
    $phone = htmlspecialchars($mail_data['phone'] ?? '');
    $start_date = htmlspecialchars($mail_data['start_date'] ?? '');
    $end_date = htmlspecialchars($mail_data['end_date'] ?? '');
    $total_participants = htmlspecialchars($mail_data['total_participants'] ?? '');
    $premium = number_format($mail_data['premium'] ?? 0);
    $plan_type = ($mail_data['plan_type'] == 1) ? 'A형' : 'B형';
    $season = ($mail_data['season'] == 1) ? '1학기' : '2학기';
    
    return '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>현장실습보험 견적 신청 접수 완료</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                    
                    <!-- 헤더 -->
                    <tr>
                        <td style="background: #009E25; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">현장실습보험</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0;">견적 신청 접수 완료</p>
                        </td>
                    </tr>
                    
                    <!-- 내용 -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="line-height: 1.6;">안녕하십니까.</p>
                            <p style="line-height: 1.6;">현장실습보험 견적 신청이 성공적으로 접수되었습니다.</p>
                            <p style="line-height: 1.6;">담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.</p>
                            
                            <div style="background: #f8f9fa; border-radius: 8px; padding: 25px; margin: 30px 0;">
                                <h3 style="color: #009E25; margin: 0 0 20px 0;">📋 신청 정보</h3>
                                
                                <table width="100%" style="border-collapse: collapse; margin-bottom: 20px;">
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 12px; border: 1px solid #ccc; font-weight: bold; width: 30%;">대학교명</td>
                                        <td style="background: #ffffff; padding: 12px; border: 1px solid #ccc;">' . $university_name . '</td>
                                    </tr>
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 12px; border: 1px solid #ccc; font-weight: bold;">사업자번호</td>
                                        <td style="background: #ffffff; padding: 12px; border: 1px solid #ccc;">' . $business_number . '</td>
                                    </tr>
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 12px; border: 1px solid #ccc; font-weight: bold;">연락처</td>
                                        <td style="background: #ffffff; padding: 12px; border: 1px solid #ccc;">' . $phone . '</td>
                                    </tr>
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 12px; border: 1px solid #ccc; font-weight: bold;">실습시기</td>
                                        <td style="background: #ffffff; padding: 12px; border: 1px solid #ccc;">' . $season . '</td>
                                    </tr>
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 12px; border: 1px solid #ccc; font-weight: bold;">보험기간</td>
                                        <td style="background: #ffffff; padding: 12px; border: 1px solid #ccc;">' . $start_date . ' ~ ' . $end_date . '</td>
                                    </tr>
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 12px; border: 1px solid #ccc; font-weight: bold;">가입유형</td>
                                        <td style="background: #ffffff; padding: 12px; border: 1px solid #ccc;">' . $plan_type . '</td>
                                    </tr>
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 12px; border: 1px solid #ccc; font-weight: bold;">총 참여인원</td>
                                        <td style="background: #ffffff; padding: 12px; border: 1px solid #ccc;">' . $total_participants . '명</td>
                                    </tr>
                                    <tr>
                                        <td style="background: #DFEEF8; padding: 12px; border: 1px solid #ccc; font-weight: bold;">예상 보험료</td>
                                        <td style="background: #ffffff; padding: 12px; border: 1px solid #ccc; color: #009E25; font-weight: bold; font-size: 16px;">' . $premium . '원</td>
                                    </tr>
                                </table>
                                
                                <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; border-left: 4px solid #009E25;">
                                    <p style="margin: 0; font-size: 14px; color: #2d5a2d;">
                                        <strong>다음 단계:</strong><br>
                                        • 담당자가 신청 내용을 검토 후 연락드립니다<br>
                                        • 청약서 발행 및 결제 안내를 받으실 수 있습니다<br>
                                        • 문의사항이 있으시면 언제든지 연락주세요
                                    </p>
                                </div>
                            </div>
                            
                            <p style="line-height: 1.6;">감사합니다.</p>
                        </td>
                    </tr>
                    
                    <!-- 푸터 -->
                    <tr>
                        <td style="background: #f8f9fa; padding: 25px; text-align: center;">
                            <div style="color: #009E25; font-weight: bold;">이투엘보험대리점</div>
                            <div style="color: #009E25; font-weight: bold;">현장실습보험지원팀</div>
                            <div style="color: #009E25; font-weight: bold;">070-7813-1675</div>
                            <div style="margin-top: 10px; font-size: 12px; color: #666;">
                                현장실습보험은 <span style="color: #ff4411;">한화손해보험</span>에서 제공합니다.
                            </div>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
    
</body>
</html>';
}
?>
