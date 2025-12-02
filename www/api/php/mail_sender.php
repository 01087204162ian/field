<?php
/**
 * 고도화된 반응형 이메일 템플릿을 사용하는 보험 신청 완료 메일 발송
 */

// 공통 이메일 라이브러리 포함
require_once '/field0327/www/2025/includes/email_helper.php';

/**
 * 보험 신청 완료 메일 발송 함수
 */
function sendInsuranceApplicationMail($data) {
    try {
        // 필수 데이터 검증
        $required_fields = ['email', 'university_name', 'business_number', 'phone', 
                          'season', 'start_date', 'end_date', 'plan_type', 
                          'total_participants', 'premium'];
        
        foreach ($required_fields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                throw new Exception("필수 필드가 누락되었습니다: {$field}");
            }
        }
        
        // 메일 제목 설정
        $subject = "[현장실습보험] 보험 신청이 완료되었습니다 - " . $data['university_name'];
        
        // 이메일 HTML 내용 생성
        $html_content = buildAdvancedResponsiveHTML($data);
        
        // 🚀 공통 라이브러리 사용하여 메일 발송
        $mail_result = sendEmail($data['email'], $subject, $html_content);
        
        if ($mail_result) {
            error_log("✅ 보험 신청 메일 발송 성공: " . $data['email']);
            return [
                'success' => true,
                'message' => "메일이 성공적으로 발송되었습니다."
            ];
        } else {
            error_log("❌ 보험 신청 메일 발송 실패: " . $data['email']);
            return [
                'success' => false,
                'message' => "메일 발송에 실패했습니다."
            ];
        }
        
    } catch (Exception $e) {
        error_log("메일 발송 오류: " . $e->getMessage());
        return [
            'success' => false,
            'message' => "메일 발송 중 오류가 발생했습니다: " . $e->getMessage()
        ];
    }
}

/**
 * 고도화된 반응형 이메일 HTML 생성 함수
 */
function buildAdvancedResponsiveHTML($data) {
    // 학기 텍스트 변환
    $season_map = [
        1 => "1학기",
        2 => "하계계절",
        3 => "2학기", 
        4 => "동계계절"
    ];
    $hargi = $season_map[$data['season']] ?? "기타";
    
    // 플랜 텍스트 변환
    $plan = (($data['plan_type'] == 1) || (strtoupper($data['plan_type']) === 'A')) ? "A 플랜" : "B 플랜";
    
    // 이메일 정보 배열 생성
    $info_items = [
        ['icon' => '🏢', 'label' => '계약자', 'value' => $data['university_name']],
        ['icon' => '📋', 'label' => '사업자번호', 'value' => $data['business_number']],
        ['icon' => '📞', 'label' => '연락처', 'value' => $data['phone']],
        ['icon' => '📧', 'label' => '이메일', 'value' => $data['email']],
        ['icon' => '📅', 'label' => '보험기간', 'value' => $data['start_date'] . ' ~ ' . $data['end_date']],
        ['icon' => '📚', 'label' => '학기', 'value' => $hargi],
        ['icon' => '🎯', 'label' => '플랜', 'value' => $plan],
        ['icon' => '👥', 'label' => '인원', 'value' => number_format($data['total_participants']) . '명']
    ];
    
    return '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <title>보험 신청 완료</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        /* CSS Reset for Email */
        * { box-sizing: border-box; }
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        
        /* Base Styles */
        body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #f8f9fa !important;
            font-family: "Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans KR", Arial, sans-serif !important;
            line-height: 1.6 !important;
            color: #333333 !important;
            width: 100% !important;
            min-width: 100% !important;
        }
        
        /* Container Styles */
        .email-container {
            max-width: 600px !important;
            margin: 0 auto !important;
            background-color: #ffffff !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
        }
        
        /* Header Styles */
        .header {
            background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%) !important;
            padding: 40px 30px !important;
            text-align: center !important;
            color: #ffffff !important;
        }
        
        .header h1 {
            margin: 0 !important;
            font-size: 28px !important;
            font-weight: bold !important;
            letter-spacing: -0.5px !important;
        }
        
        .header p {
            margin: 10px 0 0 0 !important;
            font-size: 16px !important;
            opacity: 0.9 !important;
        }
        
        /* Content Styles */
        .content {
            padding: 40px 30px !important;
        }
        
        .greeting {
            margin-bottom: 30px !important;
            font-size: 16px !important;
            line-height: 1.7 !important;
        }
        
        .greeting strong {
            color: #2E7D32 !important;
            font-weight: bold !important;
        }
        
        /* Info Cards - Table-based for Email Compatibility */
        .info-container {
            width: 100% !important;
        }
        
        .info-row {
            width: 100% !important;
            margin-bottom: 20px !important;
        }
        
        .info-table {
            width: 100% !important;
            border-collapse: separate !important;
            border-spacing: 10px !important;
        }
        
        .info-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
            border-radius: 12px !important;
            padding: 20px !important;
            border-left: 4px solid #4CAF50 !important;
            width: 48% !important;
            vertical-align: top !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }
        
        .info-card-header {
            display: flex !important;
            align-items: center !important;
            margin-bottom: 8px !important;
        }
        
        .info-icon {
            font-size: 20px !important;
            margin-right: 10px !important;
            width: 28px !important;
            text-align: center !important;
        }
        
        .info-label {
            font-size: 14px !important;
            color: #666666 !important;
            font-weight: 600 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
        }
        
        .info-value {
            font-size: 16px !important;
            color: #333333 !important;
            font-weight: 500 !important;
            word-break: break-all !important;
        }
        
        /* Premium Highlight */
        .premium-card {
            background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%) !important;
            border: 2px solid #FF9800 !important;
            border-radius: 16px !important;
            padding: 30px !important;
            text-align: center !important;
            margin: 30px 0 !important;
            box-shadow: 0 4px 20px rgba(255, 152, 0, 0.2) !important;
        }
        
        .premium-label {
            font-size: 18px !important;
            color: #E65100 !important;
            font-weight: bold !important;
            margin-bottom: 10px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        
        .premium-value {
            font-size: 32px !important;
            color: #E65100 !important;
            font-weight: bold !important;
            letter-spacing: -1px !important;
        }
        
        /* CTA Button */
        .cta-section {
            text-align: center !important;
            margin: 40px 0 !important;
        }
        
        .cta-button {
            display: inline-block !important;
            background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%) !important;
            color: #ffffff !important;
            text-decoration: none !important;
            padding: 16px 32px !important;
            border-radius: 50px !important;
            font-size: 16px !important;
            font-weight: bold !important;
            box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3) !important;
            transition: all 0.3s ease !important;
        }
        
        .cta-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4) !important;
        }
        
        /* Footer Styles */
        .footer-message {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%) !important;
            padding: 25px !important;
            border-radius: 12px !important;
            text-align: center !important;
            margin: 30px 0 !important;
            border-left: 4px solid #2196F3 !important;
        }
        
        .contact-info {
            background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%) !important;
            padding: 30px !important;
            border-radius: 16px !important;
            margin-top: 30px !important;
            text-align: center !important;
        }
        
        .contact-info h4 {
            margin: 0 0 20px 0 !important;
            color: #2E7D32 !important;
            font-size: 20px !important;
            font-weight: bold !important;
        }
        
        .contact-detail {
            margin: 12px 0 !important;
            font-size: 16px !important;
            color: #555555 !important;
        }
        
        .contact-detail strong {
            color: #2E7D32 !important;
        }
        
        .contact-detail a {
            color: #1976D2 !important;
            text-decoration: none !important;
            font-weight: 500 !important;
        }
        
        .contact-detail a:hover {
            text-decoration: underline !important;
        }
        
        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #1e1e1e !important;
            }
            
            .content {
                background-color: #1e1e1e !important;
                color: #ffffff !important;
            }
            
            .info-card {
                background: linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%) !important;
                color: #ffffff !important;
            }
            
            .info-value {
                color: #ffffff !important;
            }
        }
        
        /* Mobile Responsive Styles */
        @media screen and (max-width: 600px) {
            .email-container {
                margin: 10px !important;
                border-radius: 12px !important;
            }
            
            .header {
                padding: 30px 20px !important;
            }
            
            .header h1 {
                font-size: 24px !important;
            }
            
            .content {
                padding: 30px 20px !important;
            }
            
            .info-table {
                border-spacing: 0px !important;
            }
            
            .info-card {
                width: 100% !important;
                display: block !important;
                margin-bottom: 15px !important;
                padding: 18px !important;
            }
            
            .premium-card {
                padding: 25px 20px !important;
                margin: 25px 0 !important;
            }
            
            .premium-value {
                font-size: 28px !important;
            }
            
            .cta-button {
                padding: 14px 28px !important;
                font-size: 15px !important;
            }
            
            .contact-info {
                padding: 25px 20px !important;
            }
        }
        
        /* Extra Small Mobile */
        @media screen and (max-width: 420px) {
            .email-container {
                margin: 5px !important;
                border-radius: 8px !important;
            }
            
            .header {
                padding: 25px 15px !important;
            }
            
            .header h1 {
                font-size: 22px !important;
            }
            
            .content {
                padding: 25px 15px !important;
            }
            
            .info-card {
                padding: 15px !important;
            }
            
            .info-icon {
                font-size: 18px !important;
                width: 24px !important;
            }
            
            .info-label {
                font-size: 13px !important;
            }
            
            .info-value {
                font-size: 15px !important;
            }
            
            .premium-card {
                padding: 20px 15px !important;
            }
            
            .premium-value {
                font-size: 24px !important;
            }
            
            .contact-info h4 {
                font-size: 18px !important;
            }
            
            .contact-detail {
                font-size: 15px !important;
            }
        }
        
        /* High DPI Display Support */
        @media screen and (-webkit-min-device-pixel-ratio: 2), 
               screen and (min-resolution: 192dpi) {
            .email-container {
                box-shadow: 0 16px 64px rgba(0,0,0,0.15) !important;
            }
        }
        
        /* Print Styles */
        @media print {
            .email-container {
                box-shadow: none !important;
                border: 1px solid #cccccc !important;
            }
            
            .cta-button {
                border: 2px solid #4CAF50 !important;
                color: #4CAF50 !important;
                background: transparent !important;
            }
        }
    </style>
</head>
<body>
    <div style="padding: 20px 0; background-color: #f8f9fa;">
        <div class="email-container">
            
            <!-- Header -->
            <div class="header">
                <h1>🎓 보험 신청 완료</h1>
                <p>현장실습보험 신청이 성공적으로 접수되었습니다</p>
            </div>
            
            <!-- Content -->
            <div class="content">
                
                <!-- Greeting -->
                <div class="greeting">
                    <p>안녕하세요 <strong>' . htmlspecialchars($data['university_name']) . '</strong> 담당자님,</p>
                    <p>귀하의 보험 신청이 성공적으로 접수되었습니다. 아래 신청 내용을 확인해 주세요.</p>
                </div>
                
                <!-- Info Cards -->
                <div class="info-container">
                    <table class="info-table" cellpadding="0" cellspacing="10" border="0">
                        <tr class="info-row">
                            <td class="info-card">
                                <div class="info-card-header">
                                    <span class="info-icon">🏢</span>
                                    <span class="info-label">계약자</span>
                                </div>
                                <div class="info-value">' . htmlspecialchars($data['university_name']) . '</div>
                            </td>
                            <td class="info-card">
                                <div class="info-card-header">
                                    <span class="info-icon">📋</span>
                                    <span class="info-label">사업자번호</span>
                                </div>
                                <div class="info-value">' . htmlspecialchars($data['business_number']) . '</div>
                            </td>
                        </tr>
                        <tr class="info-row">
                            <td class="info-card">
                                <div class="info-card-header">
                                    <span class="info-icon">📞</span>
                                    <span class="info-label">연락처</span>
                                </div>
                                <div class="info-value">' . htmlspecialchars($data['phone']) . '</div>
                            </td>
                            <td class="info-card">
                                <div class="info-card-header">
                                    <span class="info-icon">📧</span>
                                    <span class="info-label">이메일</span>
                                </div>
                                <div class="info-value">' . htmlspecialchars($data['email']) . '</div>
                            </td>
                        </tr>
                        <tr class="info-row">
                            <td class="info-card">
                                <div class="info-card-header">
                                    <span class="info-icon">📅</span>
                                    <span class="info-label">보험기간</span>
                                </div>
                                <div class="info-value">' . htmlspecialchars($data['start_date']) . ' ~ ' . htmlspecialchars($data['end_date']) . '</div>
                            </td>
                            <td class="info-card">
                                <div class="info-card-header">
                                    <span class="info-icon">📚</span>
                                    <span class="info-label">학기</span>
                                </div>
                                <div class="info-value">' . htmlspecialchars($hargi) . '</div>
                            </td>
                        </tr>
                        <tr class="info-row">
                            <td class="info-card">
                                <div class="info-card-header">
                                    <span class="info-icon">🎯</span>
                                    <span class="info-label">플랜</span>
                                </div>
                                <div class="info-value">' . htmlspecialchars($plan) . '</div>
                            </td>
                            <td class="info-card">
                                <div class="info-card-header">
                                    <span class="info-icon">👥</span>
                                    <span class="info-label">인원</span>
                                </div>
                                <div class="info-value">' . number_format($data['total_participants']) . '명</div>
                            </td>
                        </tr>
                    </table>
                </div>
                
                <!-- Premium Highlight -->
                <div class="premium-card">
                    <div class="premium-label">
                        💰 총 보험료
                    </div>
                    <div class="premium-value">' . number_format($data['premium']) . '원</div>
                </div>
                
                <!-- CTA Section -->
                <div class="cta-section">
                    <a href="http://www.lincinsu.kr/1.html" class="cta-button">
                        📋 보험 관리 사이트 바로가기
                    </a>
                </div>
                
                <!-- Footer Message -->
                <div class="footer-message">
                    <p><strong>📋 다음 단계 안내</strong></p>
                    <p>보험증권은 별도로 발송될 예정이며, 추가 서류나 절차가 필요한 경우 개별 연락드리겠습니다.</p>
                    <p>문의사항이 있으시면 언제든지 연락주세요.</p>
                </div>
                
                <!-- Contact Info -->
                <div class="contact-info">
                    <h4>📞 문의처</h4>
                    <div class="contact-detail"><strong>이투엘보험대리점 / 대학보험지원팀</strong></div>
                    <div class="contact-detail">전화: <strong>1533-5013</strong></div>
                    <div class="contact-detail">이메일: <strong>support@lincinsu.kr</strong></div>
                    <div class="contact-detail">웹사이트: <a href="http://www.lincinsu.kr/1.html">www.lincinsu.kr</a></div>
                    <div class="contact-detail" style="margin-top: 15px; font-size: 14px; color: #777;">
                        현장실습보험은 <strong style="color: #FF4411;">한화손해보험</strong>에서 제공합니다.
                    </div>
                </div>
                
            </div>
            
        </div>
    </div>
</body>
</html>';

    return $html_content;
}

?>