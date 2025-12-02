<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// OPTIONS 요청 처리 (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // 파일 존재 확인
    if (!file_exists('./config/db_config.php')) {
        throw new Exception('설정 파일을 찾을 수 없습니다.');
    }
    
    require_once './config/db_config.php';
    
    // 메일 발송 함수 include
    require_once './php/mail_sender.php';
    require_once '/field0327/www/2025/includes/email_helper.php';
    
    // 함수 존재 확인
    if (!function_exists('getDbConnection')) {
        throw new Exception('getDbConnection 함수가 정의되지 않았습니다.');
    }
    
    // PDO 연결 가져오기
    $pdo = getDbConnection();
    
    if (!$pdo instanceof PDO) {
        throw new Exception('데이터베이스 연결에 실패했습니다.');
    }
    
    // POST 요청만 허용
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('POST 요청만 허용됩니다.');
    }
    
    // 디버깅: 요청 방법과 데이터 확인
    $debug_info = [
        'method' => $_SERVER['REQUEST_METHOD'],
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set',
        'post_data_count' => count($_POST),
        'raw_input_length' => 0
    ];
    
    // JSON 데이터 읽기
    $json_input = file_get_contents('php://input');
    $debug_info['raw_input_length'] = strlen($json_input);
    $debug_info['raw_input_preview'] = substr($json_input, 0, 200);
    
    $data = null;
    
    // POST 데이터가 있으면 POST 방식으로, 없으면 JSON 방식으로 처리
    if (!empty($_POST)) {
        // 일반 POST 폼 데이터 처리
        $data = $_POST;
        $debug_info['data_source'] = 'POST';
        $debug_info['received_keys'] = array_keys($_POST);
        
        // participants가 JSON 문자열로 전송된 경우 파싱
        if (isset($data['participants'])) {
            if (is_string($data['participants'])) {
                $parsed_participants = json_decode($data['participants'], true);
                if ($parsed_participants !== null && json_last_error() === JSON_ERROR_NONE) {
                    $data['participants'] = $parsed_participants;
                    $debug_info['participants_parsed'] = 'JSON string decoded';
                } else {
                    $debug_info['participants_parse_error'] = json_last_error_msg();
                }
            }
        } else {
            // participants가 개별 필드로 전송된 경우 (week_4, week_5 등)
            $participants = [];
            foreach ($_POST as $key => $value) {
                if (preg_match('/^week_(\d+)$/', $key, $matches)) {
                    $participants[$key] = intval($value);
                }
            }
            if (!empty($participants)) {
                $data['participants'] = $participants;
                $debug_info['participants_source'] = 'individual fields';
            }
        }
    } elseif (!empty($json_input)) {
        // JSON 데이터 처리
        $data = json_decode($json_input, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('JSON 데이터 파싱 오류: ' . json_last_error_msg());
        }
        $debug_info['data_source'] = 'JSON';
    } else {
        // 디버깅 정보와 함께 에러 반환
        throw new Exception('요청 데이터가 없습니다. 디버그 정보: ' . json_encode($debug_info, JSON_UNESCAPED_UNICODE));
    }
    
    // 데이터가 제대로 파싱되었는지 확인
    if (!is_array($data) || empty($data)) {
        throw new Exception('데이터 파싱에 실패했습니다. 디버그 정보: ' . json_encode($debug_info, JSON_UNESCAPED_UNICODE));
    }
    
    // 필수 데이터 검증
    $required_fields = [
        'business_number', 'university_name', 'address', 'phone', 
        'email', 'season', 'start_date', 'end_date', 'plan_type', 
        'participants', 'total_participants', 'form_type'
    ];
    
    $missing_fields = [];
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
            $missing_fields[] = $field;
        }
    }
    
    if (!empty($missing_fields)) {
        throw new Exception('필수 필드가 누락되었습니다: ' . implode(', ', $missing_fields) . 
                          '. 받은 데이터: ' . json_encode(array_keys($data), JSON_UNESCAPED_UNICODE) .
                          '. 디버그: ' . json_encode($debug_info, JSON_UNESCAPED_UNICODE));
    }
    
    // 데이터 매핑 및 검증
    $school1 = trim($data['university_name']); // 계약자
    $school2 = preg_replace('/[^0-9]/', '', $data['business_number']); // 사업자번호 (숫자만)
    $school3 = trim($data['address']); // 주소
    $school4 = preg_replace('/[^0-9-]/', '', $data['phone']); // 연락처 (숫자와 하이픈만)
    $school5 = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL); // 이메일 검증
    $school6 = intval($data['season']); // 학기
    $school7 = $data['start_date']; // 보험시작일
    $school8 = $data['end_date']; // 보험종료일
    $school9 = (strtoupper($data['plan_type']) === 'A') ? 1 : 2; // 플랜 (A=1, B=2)
    
    // 이메일 검증 실패시 예외
    if ($school5 === false) {
        throw new Exception('올바른 이메일 주소를 입력해주세요: ' . $data['email']);
    }
    
    // 사업자번호 길이 확인
    if (strlen($school2) !== 10) {
        throw new Exception('사업자번호는 10자리 숫자여야 합니다: ' . $school2);
    }
    
    // 날짜 검증
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $school7)) {
        throw new Exception('보험시작일 형식이 올바르지 않습니다 (YYYY-MM-DD): ' . $school7);
    }
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $school8)) {
        throw new Exception('보험종료일 형식이 올바르지 않습니다 (YYYY-MM-DD): ' . $school8);
    }
    
    // 날짜 유효성 확인
    $start_date_check = DateTime::createFromFormat('Y-m-d', $school7);
    $end_date_check = DateTime::createFromFormat('Y-m-d', $school8);
    
    if (!$start_date_check || $start_date_check->format('Y-m-d') !== $school7) {
        throw new Exception('보험시작일이 유효하지 않습니다: ' . $school7);
    }
    if (!$end_date_check || $end_date_check->format('Y-m-d') !== $school8) {
        throw new Exception('보험종료일이 유효하지 않습니다: ' . $school8);
    }
    
    // 보험종료일 +1일 계산
    $nschool8 = date('Y-m-d', strtotime($school8 . ' +1 day'));
    
    // 참가자 데이터 파싱 및 검증
    $participants = $data['participants'];
    if (!is_array($participants)) {
        throw new Exception('참가자 데이터가 올바른 형식이 아닙니다.');
    }
    
    $week_data = [];
    $week_total = intval($data['total_participants']);
    
    // 모든 주차 데이터 초기화 (4주~26주)
    for ($i = 4; $i <= 26; $i++) {
        $week_key = "week_" . $i;  // JavaScript에서 week_4 형식으로 보냄
        $week_data["week" . $i] = isset($participants[$week_key]) ? intval($participants[$week_key]) : 0;
    }
    
    // 폼 타입에 따른 디렉토리 설정
    $directory = (strtolower($data['form_type']) === 'university') ? 1 : 2; // 1: 대학교, 2: 고등학교
    
    // 기타 필드
    $manager_name = isset($data['manager_name']) ? trim($data['manager_name']) : '';
    $special_notes = isset($data['special_notes']) ? trim($data['special_notes']) : '';
     // cNum 처리: POST 데이터에 있으면 사용, 없으면 기본값 0
    $cNum = isset($data['cNum']) ? intval($data['cNum']) : 0;
    
    // 보험료 계산 함수
    function calculatePremium($pdo, $school7, $school9, $week_data) {
        try {
            // 보험료 요율 조회 (날짜 기준) - end 컬럼명이 MySQL 예약어이므로 백틱 사용
            $stmt = $pdo->prepare("SELECT * FROM preiminum WHERE sigi <= ? AND `end` >= ? LIMIT 1");
            $stmt->execute([$school7, $school7]);
            
            $premium_row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$premium_row) {
                throw new Exception('해당 날짜(' . $school7 . ')의 보험료 요율을 찾을 수 없습니다.');
            }
            
            $premium = 0;
            
            // 플랜에 따른 보험료 계산
            $plan_prefix = ($school9 == 1) ? 'a' : 'b';
            
            // 주차별 보험료 계산 - 각 컬럼이 존재하는지 확인
            $required_columns = [$plan_prefix . '1', $plan_prefix . '2', $plan_prefix . '3', 
                               $plan_prefix . '4', $plan_prefix . '5', $plan_prefix . '6', $plan_prefix . '7'];
            
            foreach ($required_columns as $col) {
                if (!isset($premium_row[$col])) {
                    throw new Exception('보험료 테이블에 ' . $col . ' 컬럼이 없습니다.');
                }
            }
            
            // 4주
            $premium += $week_data['week4'] * floatval($premium_row[$plan_prefix . '1']);
            
            // 5-8주
            for ($i = 5; $i <= 8; $i++) {
                $premium += $week_data["week{$i}"] * floatval($premium_row[$plan_prefix . '2']);
            }
            
            // 9-12주
            for ($i = 9; $i <= 12; $i++) {
                $premium += $week_data["week{$i}"] * floatval($premium_row[$plan_prefix . '3']);
            }
            
            // 13-16주
            for ($i = 13; $i <= 16; $i++) {
                $premium += $week_data["week{$i}"] * floatval($premium_row[$plan_prefix . '4']);
            }
            
            // 17-20주
            for ($i = 17; $i <= 20; $i++) {
                $premium += $week_data["week{$i}"] * floatval($premium_row[$plan_prefix . '5']);
            }
            
            // 21-24주
            for ($i = 21; $i <= 24; $i++) {
                $premium += $week_data["week{$i}"] * floatval($premium_row[$plan_prefix . '6']);
            }
            
            // 25-26주
            for ($i = 25; $i <= 26; $i++) {
                $premium += $week_data["week{$i}"] * floatval($premium_row[$plan_prefix . '7']);
            }
            
            return round($premium, 0); // 소수점 반올림
            
        } catch (Exception $e) {
            throw new Exception('보험료 계산 중 오류가 발생했습니다: ' . $e->getMessage());
        }
    }
    
    // 보험료 계산
    try {
        $premium = calculatePremium($pdo, $school7, $school9, $week_data);
    } catch (Exception $e) {
        throw new Exception('보험료 계산 오류: ' . $e->getMessage() . 
                          ' | 시작일: ' . $school7 . ' | 플랜: ' . $school9 . 
                          ' | 주차데이터: ' . json_encode(array_filter($week_data), JSON_UNESCAPED_UNICODE));
    }
    
    // 데이터베이스에 저장
    $pdo->beginTransaction();
    
    try {
        $sql = "INSERT INTO questionnaire (
            school1, school2, school3, school4, school5, school6, 
            school7, school8, nschool8, school9,
            week4, week5, week6, week7, week8, week9, week10, week11, week12, week13,
            week14, week15, week16, week17, week18, week19, week20,
            week21, week22, week23, week24, week25, week26,
            week_total, wdate, directory, preiminum, special_notes, damdanga, damdangat,
            ch, pMethod, inscompany,  certi, wdate_3, bankname, bank,
            gabunho, simbuho, cNum
        ) VALUES (
            :school1, :school2, :school3, :school4, :school5, :school6,
            :school7, :school8, :nschool8, :school9,
            :week4, :week5, :week6, :week7, :week8, :week9, :week10, :week11, :week12, :week13,
            :week14, :week15, :week16, :week17, :week18, :week19, :week20,
            :week21, :week22, :week23, :week24, :week25, :week26,
            :week_total, NOW(), :directory, :premium, :special_notes, :damdanga, :damdangat,
            '1', '1', '1', '', :wdate_3, '', '',
            '', '',:cNum
        )";
        
        $stmt = $pdo->prepare($sql);
        
        // 파라미터 바인딩
        $stmt->bindParam(':school1', $school1);
        $stmt->bindParam(':school2', $school2);
        $stmt->bindParam(':school3', $school3);
        $stmt->bindParam(':school4', $school4);
        $stmt->bindParam(':school5', $school5);
        $stmt->bindParam(':school6', $school6);
        $stmt->bindParam(':school7', $school7);
        $stmt->bindParam(':school8', $school8);
        $stmt->bindParam(':nschool8', $nschool8);
        $stmt->bindParam(':school9', $school9);
        $stmt->bindParam(':cNum', $cNum);
        // 주차별 데이터 바인딩
        for ($i = 4; $i <= 26; $i++) {
            $stmt->bindParam(":week{$i}", $week_data["week{$i}"]);
        }
        
        $stmt->bindParam(':week_total', $week_total);
        $stmt->bindParam(':directory', $directory);
        $stmt->bindParam(':premium', $premium);
        $stmt->bindParam(':special_notes', $special_notes);
        $stmt->bindParam(':damdanga', $manager_name);
        $stmt->bindParam(':damdangat', $school4); // 담당자 연락처를 학교 연락처로 설정
        $stmt->bindParam(':wdate_3', $school7); // 영수일을 보험시작일로 설정
        
        $result = $stmt->execute();
        
        if (!$result) {
            throw new Exception('데이터 삽입에 실패했습니다: ' . implode(', ', $stmt->errorInfo()));
        }
        
        // 생성된 ID 가져오기
        $new_id = $pdo->lastInsertId();
        
        if (!$new_id) {
            throw new Exception('새 레코드 ID를 가져올 수 없습니다.');
        }
        
        $pdo->commit();
        
        // 견적 신청 확인 메일 발송
        try {
            $mail_data = [
                'email' => $school5,
                'university_name' => $school1,
                'business_number' => $school2,
                'phone' => $school4,
                'season' => $school6,
                'start_date' => $school7,
                'end_date' => $school8,
                'plan_type' => $school9,
                'total_participants' => $week_total,
                'premium' => $premium
            ];
            
            $mail_subject = "[lincinsu.kr] 현장실습보험 견적 신청 접수 완료";
            $mail_content = createUniversityQuoteConfirmHTML($mail_data);
            $mail_result = sendEmail($school5, $mail_subject, $mail_content);
            
            if ($mail_result) {
                $mail_status = "메일이 성공적으로 발송되었습니다.";
                error_log("✅ 대학교 견적 메일 발송 성공: " . $school5);
            } else {
                $mail_status = "메일 발송에 실패했습니다.";
                error_log("❌ 대학교 견적 메일 발송 실패: " . $school5);
            }
            
        } catch (Exception $e) {
            error_log("대학교 견적 메일 발송 오류: " . $e->getMessage());
            $mail_status = "메일 발송 중 오류가 발생했습니다: " . $e->getMessage();
        }
        
        // 성공 응답 (메일 발송 상태 포함)
        echo json_encode([
            'success' => true,
            'message' => '보험 신청이 성공적으로 완료되었습니다.',
            'mail_status' => $mail_status,
            'data' => [
                'id' => intval($new_id),
                'premium' => $premium,
                'university_name' => $school1,
                'business_number' => $school2,
                'start_date' => $school7,
                'end_date' => $school8,
                'total_participants' => $week_total,
                'plan_type' => ($school9 == 1) ? 'A' : 'B',
                'calculated_weeks' => array_filter($week_data) // 0이 아닌 주차만 표시
            ]
        ], JSON_UNESCAPED_UNICODE);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        throw new Exception('데이터 저장 중 오류가 발생했습니다: ' . $e->getMessage());
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => true,
        'message' => $e->getMessage(),
        'debug' => isset($debug_info) ? $debug_info : null
    ], JSON_UNESCAPED_UNICODE);
}