<?php
include 'cors.php';
include 'db_connection.php';

// 공통 이메일 라이브러리 포함
require_once '/field0327/www/2025/includes/email_helper.php';

// 오류 보고 수준 설정
error_reporting(E_ALL);
ini_set('display_errors', 1);

// JSON 응답 헤더 설정
header('Content-Type: application/json; charset=UTF-8');

// 요청 방식 확인
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(array('success' => false, 'message' => '잘못된 요청 방식입니다.'), JSON_UNESCAPED_UNICODE);
    exit;
}

// 데이터 수신
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$title = isset($_POST['title']) ? trim($_POST['title']) : '';
$content = isset($_POST['content']) ? trim($_POST['content']) : '';
$attachfile = isset($_POST['attachfile']) ? trim($_POST['attachfile']) : '';

// 🔧 무사고 확인서 링크 수정 (중복 도메인 제거)
$content = preg_replace(
    '/https:\/\/www\.silbo\.kr\/http:\/\/silbo\.kr\//',
    'https://www.silbo.kr/',
    $content
);

// 🔐 보안 링크 생성 (claimNum 숨김 처리)
$content = createSecureMusagoLink($content, $email);

// 필수 데이터 검증
if (empty($email) || empty($title) || empty($content)) {
    echo json_encode(array('success' => false, 'message' => '필수 데이터가 누락되었습니다.'), JSON_UNESCAPED_UNICODE);
    exit;
}

// 이메일 유효성 검증
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(array('success' => false, 'message' => '유효하지 않은 이메일 주소입니다.'), JSON_UNESCAPED_UNICODE);
    exit;
}

// 🔧 첨부 파일 처리 수정
$absoluteAttachFile = null;
$hasAttachment = false;

// attachfile이 "."이 아닌 경우에만 첨부파일 처리
if (!empty($attachfile) && $attachfile !== '.') {
    // 1단계: 경로 정리
    $cleanPath = trim($attachfile);
    
    // 상대 경로를 절대 경로로 변환
    if (!is_absolute_path($cleanPath)) {
        $cleanPath = $_SERVER['DOCUMENT_ROOT'] . $cleanPath;
    }
    
    // 2단계: 절대 경로로 변환
    $absoluteAttachFile = realpath($cleanPath);
    
    // 3단계: 파일 존재 및 타입 검증
    if (!$absoluteAttachFile || !file_exists($absoluteAttachFile)) {
        // 파일이 없어도 에러로 처리하지 않고 로그만 남김
        error_log("⚠️ 첨부파일을 찾을 수 없음: " . $cleanPath);
        $hasAttachment = false;
    } else if (is_dir($absoluteAttachFile)) {
        error_log("⚠️ 첨부파일 경로가 디렉토리임: " . $absoluteAttachFile);
        $hasAttachment = false;
    } else if (!is_readable($absoluteAttachFile)) {
        error_log("⚠️ 첨부파일 읽기 권한 없음: " . $absoluteAttachFile);
        $hasAttachment = false;
    } else {
        // 파일 크기 검증 (10MB 제한)
        $fileSize = filesize($absoluteAttachFile);
        $maxSize = 10 * 1024 * 1024; // 10MB
        
        if ($fileSize > $maxSize) {
            error_log("⚠️ 첨부파일 크기 초과: " . round($fileSize / 1024 / 1024, 2) . "MB");
            $hasAttachment = false;
        } else {
            // 파일 타입 검증
            $allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'zip'];
            $fileExtension = strtolower(pathinfo($absoluteAttachFile, PATHINFO_EXTENSION));
            
            if (!in_array($fileExtension, $allowedExtensions)) {
                error_log("⚠️ 허용되지 않는 파일 형식: " . $fileExtension);
                $hasAttachment = false;
            } else {
                $hasAttachment = true;
                error_log("✅ 첨부파일 검증 완료: " . $absoluteAttachFile . " (" . round($fileSize/1024, 2) . "KB)");
            }
        }
    }
}

// 절대 경로 확인 함수
function is_absolute_path($path) {
    return (substr($path, 0, 1) === '/' || (PHP_OS_FAMILY === 'Windows' && preg_match('/^[A-Za-z]:/', $path)));
}

/**
 * 보안 무사고 확인서 링크 생성
 */
function createSecureMusagoLink($content, $email) {
    // URL에서 claimNum 추출
    preg_match('/claimNum=(\d+)/', $content, $matches);
    
    if (!isset($matches[1])) {
        return $content; // claimNum이 없으면 원본 반환
    }
    
    $claimNum = $matches[1];
    
    // 보안 토큰 생성
    $secretKey = 'musago_secret_key_2025'; // 실제 운영시에는 더 복잡한 키 사용
    $timestamp = time() + (24 * 60 * 60); // 24시간 유효
    
    $data = $claimNum . '|' . $email . '|' . $timestamp;
    $signature = hash_hmac('sha256', $data, $secretKey);
    $token = base64_encode($data . '|' . $signature);
    
    // 보안 URL 생성
    $secureUrl = "https://www.silbo.kr/2025/secure/musago.php?token=" . urlencode($token);
    
    // 기존 링크를 보안 링크로 교체
    $secureContent = preg_replace(
        '/href=[\'"]https:\/\/www\.silbo\.kr\/2014\/_pages\/php\/downExcel\/claim7\.php\?claimNum=\d+[\'"]/i',
        'href="' . $secureUrl . '"',
        $content
    );
    
    // 로그 기록
    error_log("보안 무사고 링크 생성: " . $email . " | claimNum: " . $claimNum . " | token: " . substr($token, 0, 20) . "...");
    
    return $secureContent;
}

/**
 * 무사고 확인서 이메일 HTML 생성 함수
 */
function createMusagoEmailHTML($title, $content, $hasAttachment = false) {
    // content에서 HTML 태그 추출하여 사용
    $html = '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . htmlspecialchars($title) . '</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            font-family: "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
        }
        
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
            padding: 30px;
            text-align: center;
            color: #ffffff;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: -0.5px;
        }
        
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .notice-title {
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #FF9800;
            margin-bottom: 25px;
        }
        
        .notice-title h2 {
            margin: 0;
            color: #E65100;
            font-size: 20px;
            font-weight: bold;
        }
        
        .notice-content {
            background-color: #fafafa;
            padding: 25px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            margin-bottom: 25px;
            min-height: 150px;
        }
        
        .notice-content p {
            margin: 0 0 15px 0;
            font-size: 16px;
            line-height: 1.7;
        }
        
        .notice-content p:last-child {
            margin-bottom: 0;
        }
        
        .notice-content a {
            color: #1976D2;
            text-decoration: none;
            font-weight: 500;
            background-color: #e3f2fd;
            padding: 4px 8px;
            border-radius: 4px;
        }
        
        .notice-content a:hover {
            text-decoration: underline;
            background-color: #bbdefb;
        }
        
        .attachment-notice {
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #FF9800;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .attachment-notice .icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .attachment-notice p {
            margin: 0;
            color: #E65100;
            font-weight: 500;
        }
        
        .footer {
            background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
        }
        
        .footer h4 {
            margin: 0 0 15px 0;
            color: #2E7D32;
            font-size: 18px;
        }
        
        .footer p {
            margin: 5px 0;
            color: #555555;
            font-size: 14px;
        }
        
        .footer a {
            color: #1976D2;
            text-decoration: none;
            font-weight: 500;
        }
        
        .footer a:hover {
            text-decoration: underline;
        }
        
        /* 모바일 반응형 */
        @media screen and (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 8px;
            }
            
            .header {
                padding: 25px 20px;
            }
            
            .header h1 {
                font-size: 22px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .notice-title {
                padding: 18px;
            }
            
            .notice-title h2 {
                font-size: 18px;
            }
            
            .notice-content {
                padding: 20px;
            }
            
            .notice-content p {
                font-size: 15px;
            }
            
            .attachment-notice {
                padding: 18px;
            }
            
            .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        
        <!-- Header -->
        <div class="header">
            <h1>📋 무사고 확인서</h1>
            <p>한화 현장실습보험 관련 안내</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            
            <!-- Notice Title -->
            <div class="notice-title">
                <h2>' . htmlspecialchars($title) . '</h2>
            </div>
            
            <!-- Notice Content -->
            <div class="notice-content">' . 
                $content . '
            </div>';
    
    // 첨부파일이 있는 경우 안내 추가
    if ($hasAttachment) {
        $html .= '
            <!-- Attachment Notice -->
            <div class="attachment-notice">
                <div class="icon">📎</div>
                <p><strong>첨부파일이 포함되어 있습니다</strong></p>
                <p>메일 클라이언트에서 첨부파일을 확인해주세요.</p>
            </div>';
    }
    
    $html .= '
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <h4>📞 문의처</h4>
            <p><strong>이투엘보험대리점 / 현장실습보험지원팀</strong></p>
            <p>전화: <strong>1533-5013</strong></p>
            <p>이메일: <strong>lincinsu@lincinsu.kr</strong></p>
            <p>웹사이트: <a href="http://www.lincinsu.kr">www.lincinsu.kr</a></p>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #666;">현장실습보험은 <span style="color: #FB2C10; font-weight: bold;">한화손해보험</span>에서 제공합니다.</p>
        </div>
        
    </div>
</body>
</html>';

    return $html;
}

try {
    // HTML 이메일 내용 생성
    $html_content = createMusagoEmailHTML($title, $content, $hasAttachment);
    
    // 🚀 첨부파일이 있는 경우와 없는 경우 구분하여 처리
    if ($hasAttachment && !empty($absoluteAttachFile)) {
        // 첨부파일이 있는 경우: mail() 함수 사용
        $boundary = md5(time());
        
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        $headers .= "From: \"현장실습보험지원팀\" <lincinsu@lincinsu.kr>\r\n";
        $headers .= "Reply-To: lincinsu@lincinsu.kr\r\n";
        
        $message = "--$boundary\r\n";
        $message .= "Content-Type: text/html; charset=UTF-8\r\n";
        $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $message .= $html_content . "\r\n\r\n";
        
        // 첨부 파일 추가
        $file_content = file_get_contents($absoluteAttachFile);
        $file_content_encoded = chunk_split(base64_encode($file_content));
        $file_name = basename($absoluteAttachFile);
        
        $message .= "--$boundary\r\n";
        $message .= "Content-Type: application/octet-stream; name=\"$file_name\"\r\n";
        $message .= "Content-Transfer-Encoding: base64\r\n";
        $message .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n\r\n";
        $message .= $file_content_encoded . "\r\n";
        $message .= "--$boundary--";
        
        // 직접 mail() 함수 사용
        $mail_result = mail($email, $title, $message, $headers);
        
        if ($mail_result) {
            error_log("✅ 무사고 확인서 메일 발송 성공 (첨부파일 포함): " . $email . " | 첨부파일: " . basename($absoluteAttachFile));
        } else {
            error_log("❌ 무사고 확인서 메일 발송 실패 (첨부파일 포함): " . $email);
        }
        
    } else {
        // 첨부파일이 없는 경우: 공통 라이브러리 사용
        $mail_result = sendEmail($email, $title, $html_content);
        
        if ($mail_result) {
            error_log("✅ 무사고 확인서 메일 발송 성공: " . $email);
        } else {
            error_log("❌ 무사고 확인서 메일 발송 실패: " . $email);
        }
    }
    
    // 결과 응답
    if ($mail_result) {
        echo json_encode(array(
            'success' => true, 
            'message' => '무사고 확인서 메일이 성공적으로 발송되었습니다.',
            'details' => [
                'email' => $email,
                'title' => $title,
                'has_attachment' => $hasAttachment,
                'method' => $hasAttachment ? 'mail() with attachment' : 'sendEmail()'
            ]
        ), JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(array(
            'success' => false, 
            'message' => '무사고 확인서 메일 발송에 실패했습니다.'
        ), JSON_UNESCAPED_UNICODE);
    }
    
} catch (Exception $e) {
    error_log("무사고 확인서 메일 발송 오류: " . $e->getMessage());
    echo json_encode(array(
        'success' => false, 
        'message' => '메일 발송 중 오류가 발생했습니다: ' . $e->getMessage()
    ), JSON_UNESCAPED_UNICODE);
}

?>