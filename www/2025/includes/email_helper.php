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
    $contents = getApplicationGuideEmailContent();
    
    // ✅ sendEmail() 함수 사용으로 변경 (Gmail SMTP 지원)
    return sendEmail($to_email, $subject, $contents);
}

/**
 * 증권 발급 안내 이메일 발송
 * @param string $to_email 받는 사람 이메일
 * @return bool 발송 성공 여부
 */
function sendCertificateNotificationEmail($to_email) {
    $subject = "현장실습보험 증권 발급 안내";
    $contents = getCertificateNotificationEmailContent();
    
    // ✅ sendEmail() 함수 사용으로 변경 (Gmail SMTP 지원)
    return sendEmail($to_email, $subject, $contents);
}

/**
 * 청약서 발행 안내 이메일 내용 반환 (모던 반응형 버전)
 */
function getApplicationGuideEmailContent() {
    return '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>현장실습보험 청약서 발행 안내</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #009E25 0%, #00B82F 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 24px;
            color: #2c3e50;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%);
            border-left: 4px solid #009E25;
            padding: 24px;
            margin: 24px 0;
            border-radius: 8px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #009E25;
            margin: 32px 0 16px 0;
            display: flex;
            align-items: center;
        }
        
        .section-title::before {
            content: "💼";
            margin-right: 8px;
        }
        
        .payment-section::before {
            content: "💳";
        }
        
        .documents-section::before {
            content: "📋";
        }
        
        .info-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 16px 0;
        }
        
        .payment-options {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin: 20px 0;
        }
        
        .payment-option {
            flex: 1;
            min-width: 250px;
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            transition: all 0.3s ease;
        }
        
        .payment-option:hover {
            border-color: #009E25;
            box-shadow: 0 2px 8px rgba(0, 158, 37, 0.1);
        }
        
        .payment-option h4 {
            color: #009E25;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        .document-list {
            list-style: none;
            padding: 0;
        }
        
        .document-list li {
            background: white;
            margin: 12px 0;
            padding: 16px;
            border-radius: 6px;
            border-left: 3px solid #009E25;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .document-list li::before {
            content: "✓";
            color: #009E25;
            font-weight: bold;
            margin-right: 8px;
        }
        
        .example-table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .example-table th {
            background: #009E25;
            color: white;
            padding: 12px;
            text-align: center;
            font-weight: 600;
        }
        
        .example-table td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #e9ecef;
        }
        
        .example-table tr:last-child td {
            border-bottom: none;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #009E25 0%, #00B82F 100%);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(0, 158, 37, 0.3);
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 158, 37, 0.4);
        }
        
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .company-info {
            color: #009E25;
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .company-phone {
            color: #009E25;
            font-size: 18px;
            font-weight: 700;
            margin: 8px 0;
        }
        
        .insurance-note {
            font-size: 12px;
            color: #6c757d;
            margin-top: 16px;
        }
        
        /* 반응형 디자인 */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .payment-options {
                flex-direction: column;
            }
            
            .payment-option {
                min-width: auto;
            }
            
            .section-title {
                font-size: 18px;
            }
        }
        
        @media only screen and (max-width: 480px) {
            .header {
                padding: 20px 15px;
            }
            
            .content {
                padding: 20px 15px;
            }
            
            .header h1 {
                font-size: 20px;
            }
            
            .section-title {
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- 헤더 -->
        <div class="header">
            <h1>현장실습보험</h1>
            <p>청약서 발행 완료 안내</p>
        </div>
        
        <!-- 메인 컨텐츠 -->
        <div class="content">
            <div class="greeting">
                안녕하십니까. 🙏
            </div>
            
            <div class="highlight-box">
                <strong>견적 의뢰를 바탕으로 청약서를 발행하였습니다.</strong><br>
                아래 안내에 따라 결제 정보와 필요 서류를 메일로 회신해주시기 바랍니다.
            </div>
            
            <!-- 결제 정보 섹션 -->
            <h2 class="section-title payment-section">결제 정보</h2>
            <p>보험료는 <strong>가상계좌</strong> 또는 <strong>법인카드</strong>로 결제하실 수 있습니다.</p>
            
            <div class="payment-options">
                <div class="payment-option">
                    <h4>🏦 가상계좌 결제</h4>
                    <p>선호하시는 은행 정보를 회신해주세요.</p>
                    <p><small>당일 가상계좌 발급 후 지원사이트 업로드</small></p>
                </div>
                
                <div class="payment-option">
                    <h4>💳 법인카드 결제</h4>
                    <p>카드번호와 유효기간을 회신해주세요.</p>
                    <p><small>당일 결제 진행</small></p>
                </div>
            </div>
            
            <div class="info-card">
                <strong>⚠️ 개인 소유 법인카드 결제 시 추가 서류:</strong>
                <ul style="margin: 8px 0 0 20px;">
                    <li>최초 결제: 최근 3개월 내 재직증명서</li>
                    <li>재결제: 카드 사본 + 소유자 사원증</li>
                </ul>
            </div>
            
            <!-- 필요 서류 섹션 -->
            <h2 class="section-title documents-section">필요 서류</h2>
            <ul class="document-list">
                <li><strong>질문서 스캔본</strong> - 지원사이트에서 출력 후 직인 날인</li>
                <li><strong>청약서 스캔본</strong> - 지원사이트에서 출력 후 직인 날인</li>
                <li><strong>학과별 인원 현황</strong> - 아래 예시 참고하여 엑셀 작성</li>
            </ul>
            
            <!-- 예시 테이블 -->
            <table class="example-table">
                <thead>
                    <tr>
                        <th colspan="2">📊 ㅇㅇ대학교 인원 현황 예시</th>
                    </tr>
                    <tr>
                        <th>학과명</th>
                        <th>인원수</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>A학과</td>
                        <td>1명</td>
                    </tr>
                    <tr>
                        <td>B학과</td>
                        <td>3명</td>
                    </tr>
                    <tr style="background: #f8f9fa; font-weight: bold;">
                        <td>총계</td>
                        <td>4명</td>
                    </tr>
                </tbody>
            </table>
            
            <div style="text-align: center; margin: 32px 0;">
                <a href="https://www.lincinsu.kr/index2.php/school/rider" class="cta-button">
                    📄 지원사이트 바로가기
                </a>
            </div>
            
            <div class="info-card">
                <strong>📅 처리 일정:</strong> 메일 회신 완료 후 카드 결제 진행 또는 가상계좌 입금 확인 후 1~2영업일 내 증권 발급
            </div>
        </div>
        
        <!-- 푸터 -->
        <div class="footer">
            <div class="company-info">이투엘보험대리점</div>
            <div class="company-info">현장실습보험지원팀</div>
            <div class="company-phone">📞 070-7813-1675</div>
            <div class="insurance-note">
                현장실습보험은 <span style="color: #ff4411; font-weight: 600;">한화손해보험</span>에서 제공합니다.
            </div>
        </div>
    </div>
</body>
</html>';
}

/**
 * 증권 발급 안내 이메일 내용 반환 (모던 반응형 버전)
 */
function getCertificateNotificationEmailContent() {
    return '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>현장실습보험 증권 발급 안내</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #009E25 0%, #00B82F 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
            position: relative;
        }
        
        .header::before {
            content: "🎉";
            font-size: 48px;
            display: block;
            margin-bottom: 16px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .success-badge {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 50px;
            text-align: center;
            font-weight: 600;
            font-size: 18px;
            margin: 0 auto 32px auto;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        }
        
        .success-badge::before {
            content: "✅ ";
            font-size: 20px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 24px;
            color: #2c3e50;
            text-align: center;
        }
        
        .main-message {
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%);
            border: 2px solid #009E25;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            margin: 32px 0;
        }
        
        .main-message h2 {
            color: #009E25;
            font-size: 24px;
            margin-bottom: 16px;
        }
        
        .main-message p {
            font-size: 16px;
            color: #2c3e50;
            margin-bottom: 24px;
        }
        
        .download-section {
            background: white;
            border: 2px dashed #009E25;
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            margin: 32px 0;
        }
        
        .download-section::before {
            content: "📄";
            font-size: 48px;
            display: block;
            margin-bottom: 16px;
        }
        
        .download-section h3 {
            color: #009E25;
            font-size: 20px;
            margin-bottom: 16px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #009E25 0%, #00B82F 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 18px;
            box-shadow: 0 6px 16px rgba(0, 158, 37, 0.3);
            transition: all 0.3s ease;
            margin: 16px 0;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 158, 37, 0.4);
        }
        
        .cta-button::before {
            content: "🔗 ";
        }
        
        .steps {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
        }
        
        .steps h3 {
            color: #009E25;
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
        }
        
        .step-item {
            display: flex;
            align-items: center;
            margin: 16px 0;
            padding: 12px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .step-number {
            background: #009E25;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 16px;
            flex-shrink: 0;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        
        .company-info {
            color: #009E25;
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .company-phone {
            color: #009E25;
            font-size: 18px;
            font-weight: 700;
            margin: 8px 0;
        }
        
        .insurance-note {
            font-size: 12px;
            color: #6c757d;
            margin-top: 16px;
        }
        
        /* 반응형 디자인 */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .main-message {
                padding: 24px;
            }
            
            .main-message h2 {
                font-size: 20px;
            }
            
            .download-section {
                padding: 24px;
            }
        }
        
        @media only screen and (max-width: 480px) {
            .header {
                padding: 20px 15px;
            }
            
            .content {
                padding: 20px 15px;
            }
            
            .header h1 {
                font-size: 20px;
            }
            
            .cta-button {
                padding: 14px 24px;
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- 헤더 -->
        <div class="header">
            <h1>현장실습보험</h1>
            <p>증권 발급 완료</p>
        </div>
        
        <!-- 메인 컨텐츠 -->
        <div class="content">
            <div class="success-badge">
                증권 발급 완료
            </div>
            
            <div class="greeting">
                안녕하십니까. 🙏
            </div>
            
            <div class="main-message">
                <h2>🎊 축하합니다!</h2>
                <p>견적 의뢰하셨던 <strong>현장실습보험 증권</strong>이 성공적으로 발급되었습니다.</p>
                <p>이제 안전한 현장실습을 진행하실 수 있습니다.</p>
            </div>
            
            <div class="download-section">
                <h3>📋 증권 다운로드</h3>
                <p>아래 지원사이트에 로그인하여 증권을 다운로드하세요.</p>
                
                <a href="https://www.lincinsu.kr/index2.php/school/rider" class="cta-button">
                    지원사이트 접속하기
                </a>
            </div>
            
            <div class="steps">
                <h3>📝 다운로드 방법</h3>
                <div class="step-item">
                    <div class="step-number">1</div>
                    <div>지원사이트에 로그인</div>
                </div>
                <div class="step-item">
                    <div class="step-number">2</div>
                    <div>증권 메뉴 선택</div>
                </div>
                <div class="step-item">
                    <div class="step-number">3</div>
                    <div>증권 파일 다운로드</div>
                </div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
                <strong>💡 문의사항이 있으시면 언제든지 연락주세요!</strong>
            </div>
        </div>
        
        <!-- 푸터 -->
        <div class="footer">
            <div class="company-info">이투엘보험대리점</div>
            <div class="company-info">현장실습보험지원팀</div>
            <div class="company-phone">📞 070-7813-1675</div>
            <div class="insurance-note">
                현장실습보험은 <span style="color: #ff4411; font-weight: 600;">한화손해보험</span>에서 제공합니다.
            </div>
        </div>
    </div>
</body>
</html>';
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
