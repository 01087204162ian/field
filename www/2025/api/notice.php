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

// 📎 이용안내문 다운로드 링크 추가 처리
if (strpos($title, '이용안내') !== false) {
    // 이용안내문인 경우 본문에 다운로드 링크 추가
    $downloadLink = 'https://silbo.kr/static/lib/attachfile/한화%20현장실습%20보험%20안내%20팜플렛.pdf';
    
    // 기존 content에 다운로드 링크 추가
    $content = str_replace(
        '현장실습 이용방법이 담긴 안내문 첨부파일로 전달드립니다.',
        '현장실습 이용방법이 담긴 안내문을 아래 링크에서 다운로드 받으실 수 있습니다.<br><br>
        <div style="text-align: center; margin: 20px 0;">
            <a href="' . $downloadLink . '" 
               style="display: inline-block; background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%); 
                      color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; 
                      font-weight: bold; box-shadow: 0 2px 10px rgba(76,175,80,0.3);">
                📄 한화 현장실습 보험 안내문 다운로드
            </a>
        </div>',
        $content
    );
    
    error_log("📋 이용안내문 다운로드 링크 추가: " . $downloadLink);
}

// 💰 보험금 청구서류 다운로드 링크 추가 처리
if (strpos($title, '보험금 청구') !== false) {
    // 보험금 청구서류인 경우 본문에 다운로드 링크 추가
    $downloadLink = 'https://silbo.kr/static/lib/attachfile/보험금%20청구서,동의서,문답서_2023.pdf';
    
    // JavaScript에서 이미 변경된 링크 형태를 버튼 스타일로 교체
    $content = str_replace(
        '* <a href=\'https://silbo.kr/static/lib/attachfile/보험금 청구서,동의서,문답서_2023.pdf\' target=\'_blank\' style=\'color: #0066CC; text-decoration: underline;\'>보험금 청구서류 다운로드</a>',
        '* 아래 링크에서 다운로드 받으실 수 있습니다.<br><br>
        <div style="text-align: center; margin: 20px 0;">
            <a href="' . $downloadLink . '" 
               target="_blank"
               style="display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); 
                      color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; 
                      font-weight: bold; box-shadow: 0 2px 10px rgba(255,107,53,0.3);">
                💰 보험금 청구서류 다운로드
            </a>
        </div>',
        $content
    );
    
    error_log("💰 보험금 청구서류 다운로드 링크 추가: " . $downloadLink);
}

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

// 첨부 파일 처리
$absoluteAttachFile = null;
$hasAttachment = false;

// 보험금 청구 및 이용안내문은 링크로 처리하므로 첨부파일 제외
$isClaimNotice = strpos($title, '보험금 청구') !== false;
$isGuideNotice = strpos($title, '이용안내') !== false;

// attachfile이 "."이 아니고, 보험금 청구나 이용안내가 아닌 경우에만 첨부파일 처리
if (!empty($attachfile) && $attachfile !== '.' && !$isClaimNotice && !$isGuideNotice) {
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
 * 현장실습보험 안내 이메일 HTML 생성 함수
 */
function createNoticeEmailHTML($title, $content, $hasAttachment = false) {
    // 제목에 따른 아이콘 설정
    $icon = '📄';
    $headerColor = '#FF6B35';
    $headerColorEnd = '#F7931E';
    
    if (strpos($title, '보험금 청구') !== false) {
        $icon = '💰';
        $headerColor = '#4CAF50';
        $headerColorEnd = '#2E7D32';
    } else if (strpos($title, '이용안내') !== false) {
        $icon = '📋';
        $headerColor = '#2196F3';
        $headerColorEnd = '#1565C0';
    }
    
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
            background: linear-gradient(135deg, ' . $headerColor . ' 0%, ' . $headerColorEnd . ' 100%);
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
        
        .notice-content div {
            font-size: 16px;
            line-height: 1.7;
        }
        
        .notice-content br {
            line-height: 2.0;
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
        
        .notice-content span[style*="color: #FB2C10"] {
            background-color: #ffebee;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        .attachment-notice {
            background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
            margin-bottom: 25px;
            text-align: center;
        }
        
        .attachment-notice .icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .attachment-notice p {
            margin: 0;
            color: #2E7D32;
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
            
            .notice-content div {
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
            <h1>' . $icon . ' 현장실습보험 안내</h1>
            <p>한화손해보험 현장실습보험지원팀</p>
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
            <p>웹사이트: <a href="http://silbo.kr">현장실습보험 홈페이지</a></p>
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
    $html_content = createNoticeEmailHTML($title, $content, $hasAttachment);
    
    // 첨부파일이 있는 경우와 없는 경우 구분하여 처리
    if ($hasAttachment && !empty($absoluteAttachFile)) {
        // 경계 문자열 및 헤더 개선
        $boundary = "----=_Part_" . md5(time() . uniqid());
        
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "From: \"현장실습보험지원팀\" <lincinsu@lincinsu.kr>\r\n";
        $headers .= "Reply-To: lincinsu@lincinsu.kr\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $headers .= "X-Priority: 3\r\n";
        
        // 제목 인코딩
        $encoded_title = '=?UTF-8?B?' . base64_encode($title) . '?=';
        
        // 메시지 시작
        $message = "This is a multi-part message in MIME format.\r\n\r\n";
        $message .= "--$boundary\r\n";
        $message .= "Content-Type: text/html; charset=UTF-8\r\n";
        $message .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $message .= $html_content . "\r\n\r\n";
        
        // 첨부 파일 추가 (개선된 버전)
        $file_content = file_get_contents($absoluteAttachFile);
        if ($file_content !== false) {
            $file_name = basename($absoluteAttachFile);
            $file_size = strlen($file_content);
            
            // 로그 기록
            error_log("📎 첨부파일 처리: " . $file_name . " (크기: " . round($file_size/1024, 2) . "KB)");
            
            // Base64 인코딩
            $file_content_encoded = chunk_split(base64_encode($file_content), 76, "\r\n");
            
            // MIME 타입 결정 (PDF 파일 명시적 지정)
            $mime_type = 'application/pdf';
            if (function_exists('mime_content_type')) {
                $detected_mime = mime_content_type($absoluteAttachFile);
                if ($detected_mime) {
                    $mime_type = $detected_mime;
                }
            }
            
            // 파일명 인코딩 (한글 파일명 처리)
            $encoded_filename = '=?UTF-8?B?' . base64_encode($file_name) . '?=';
            
            $message .= "--$boundary\r\n";
            $message .= "Content-Type: $mime_type; name=\"$encoded_filename\"\r\n";
            $message .= "Content-Transfer-Encoding: base64\r\n";
            $message .= "Content-Disposition: attachment; filename=\"$encoded_filename\"\r\n";
            $message .= "Content-ID: <attachment_" . time() . ">\r\n\r\n";
            $message .= $file_content_encoded;
            
            error_log("📎 첨부파일 인코딩 완료: " . strlen($file_content_encoded) . " bytes");
        } else {
            error_log("❌ 첨부파일 읽기 실패: " . $absoluteAttachFile);
        }
        
        $message .= "\r\n--$boundary--\r\n";
        
        // 메일 발송 로깅
        error_log("📧 메일 발송 시도 - 받는사람: " . $email);
        error_log("📧 제목: " . $title);
        error_log("📧 메시지 크기: " . strlen($message) . " bytes");
        error_log("📧 헤더: " . str_replace("\r\n", " | ", $headers));
        
        // 직접 mail() 함수 사용
        $mail_result = mail($email, $encoded_title, $message, $headers);
        
        if ($mail_result) {
            error_log("✅ 현장실습보험 안내 메일 발송 성공 (첨부파일 포함): " . $email . " | 첨부파일: " . basename($absoluteAttachFile));
        } else {
            error_log("❌ 현장실습보험 안내 메일 발송 실패 (첨부파일 포함): " . $email);
        }
        
    } else {
        // 첨부파일이 없는 경우 (이용안내문, 보험금 청구서류, 기타 모든 메일): 공통 라이브러리 사용
        $mail_result = sendEmail($email, $title, $html_content);
        
        if ($mail_result) {
            if (strpos($title, '이용안내') !== false) {
                error_log("✅ 이용안내문 메일 발송 성공 (다운로드 링크 포함): " . $email);
            } else if (strpos($title, '보험금 청구') !== false) {
                error_log("✅ 보험금 청구서류 메일 발송 성공 (다운로드 링크 포함): " . $email);
            } else {
                error_log("✅ 현장실습보험 안내 메일 발송 성공: " . $email . " | 제목: " . $title);
            }
        } else {
            error_log("❌ 현장실습보험 안내 메일 발송 실패: " . $email . " | 제목: " . $title);
        }
    }
    
    // DB에 발송 기록 저장 (옵션)
    try {
        if (isset($conn) && $mail_result) {
            $stmt = $conn->prepare("INSERT INTO mail_log (email, title, content_type, has_attachment, sent_at) VALUES (?, ?, 'notice', ?, NOW())");
            $has_attach_int = $hasAttachment ? 1 : 0;
            $stmt->bind_param("ssi", $email, $title, $has_attach_int);
            $stmt->execute();
            error_log("📝 메일 발송 기록 DB 저장 완료: " . $email);
        }
    } catch (Exception $e) {
        error_log("⚠️ DB 로그 저장 실패: " . $e->getMessage());
    }
    
    // 결과 응답
    if ($mail_result) {
        $message = '현장실습보험 안내 메일이 성공적으로 발송되었습니다.';
        
        if (strpos($title, '이용안내') !== false) {
            $message = '이용안내문이 다운로드 링크와 함께 성공적으로 발송되었습니다.';
        } else if (strpos($title, '보험금 청구') !== false) {
            $message = '보험금 청구서류 안내가 다운로드 링크와 함께 성공적으로 발송되었습니다.';
        }
            
        echo json_encode(array(
            'success' => true, 
            'message' => $message,
            'details' => [
                'email' => $email,
                'title' => $title,
                'has_attachment' => $hasAttachment,
                'has_download_link' => strpos($title, '이용안내') !== false || strpos($title, '보험금 청구') !== false,
                'attachment_file' => $hasAttachment ? basename($absoluteAttachFile) : null,
                'method' => $hasAttachment ? 'mail() with attachment' : 'sendEmail()',
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ), JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(array(
            'success' => false, 
            'message' => '현장실습보험 안내 메일 발송에 실패했습니다.',
            'details' => [
                'email' => $email,
                'title' => $title,
                'has_attachment' => $hasAttachment,
                'timestamp' => date('Y-m-d H:i:s')
            ]
        ), JSON_UNESCAPED_UNICODE);
    }
    
} catch (Exception $e) {
    error_log("현장실습보험 안내 메일 발송 오류: " . $e->getMessage());
    echo json_encode(array(
        'success' => false, 
        'message' => '메일 발송 중 오류가 발생했습니다: ' . $e->getMessage()
    ), JSON_UNESCAPED_UNICODE);
}

?>