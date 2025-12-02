<?php
/**
 * 담당자 연락처 업데이트 API
 * 
 * 기능: 2014Costmer 테이블의 특정 고객 담당자 연락처를 업데이트
 * 메소드: POST
 * 파라미터: num (고객번호), damdangat (담당자 연락처)
 * 
 * ★ 데이터베이스 컬럼 정보:
 * - damdangat: varchar(20) NOT NULL COMMENT '담당자연락처'
 * - 현재 최대 20바이트까지 입력 가능
 * 
 * ★ 컬럼 크기 확장이 필요한 경우:
 * ALTER TABLE 2014Costmer MODIFY COLUMN damdangat VARCHAR(50) NOT NULL COMMENT '담당자연락처';
 */

// CORS 설정 및 데이터베이스 연결 파일 포함
include '../cors.php';
include '../db_connection.php';

// 데이터베이스 연결
$connect = connect_db();

// JSON 응답을 위한 헤더 설정
header('Content-Type: application/json; charset=UTF-8');

// 데이터베이스 연결 상태 확인
if ($connect->connect_error) {
    die(json_encode([
        'status' => 'error',
        'message' => '데이터베이스 연결 실패: ' . $connect->connect_error
    ]));
}

// POST 데이터 수신 및 검증
$num = isset($_POST['num']) ? $_POST['num'] : null;
$damdangat = isset($_POST['damdangat']) ? $_POST['damdangat'] : null;

// 필수 데이터 존재 여부 확인
if (!$num || !$damdangat) {
    echo json_encode([
        'status' => 'error',
        'message' => '필수 데이터가 누락되었습니다. (num, damdangat 필요)'
    ]);
    $connect->close();
    exit;
}

// 입력 데이터 유효성 검사 (선택사항)
if (!is_numeric($num)) {
    echo json_encode([
        'status' => 'error',
        'message' => '올바른 고객 번호가 아닙니다.'
    ]);
    $connect->close();
    exit;
}

// 담당자 연락처 길이 제한 검사 (DB 컬럼 크기: varchar(20))
$max_length = 20; // 실제 DB 컬럼 크기
if (strlen($damdangat) > $max_length) {
    echo json_encode([
        'status' => 'error',
        'message' => "담당자 연락처는 {$max_length}자 이하로 입력해주세요. (현재: " . strlen($damdangat) . "자)"
    ]);
    $connect->close();
    exit;
}

// 연락처 형식 검증 (선택사항 - 필요에 따라 주석 해제)
/*
if (!preg_match('/^[0-9-]+$/', $damdangat)) {
    echo json_encode([
        'status' => 'error',
        'message' => '올바른 연락처 형식이 아닙니다.'
    ]);
    $connect->close();
    exit;
}
*/

// 한글이 포함된 경우 바이트 길이 체크 (MySQL의 경우)
if (strlen($damdangat) !== mb_strlen($damdangat, 'UTF-8')) {
    $byte_length = strlen($damdangat);
    if ($byte_length > $max_length) {
        echo json_encode([
            'status' => 'error',
            'message' => "담당자 연락처의 바이트 길이가 초과되었습니다. (최대: {$max_length}바이트, 현재: {$byte_length}바이트)"
        ]);
        $connect->close();
        exit;
    }
}

try {
    // SQL 쿼리 준비 (SQL 인젝션 방지를 위한 준비문 사용)
    $sql = "UPDATE 2014Costmer SET damdangat = ? WHERE num = ?";
    $stmt = $connect->prepare($sql);
    
    if (!$stmt) {
        throw new Exception('SQL 준비 실패: ' . $connect->error);
    }
    
    // 파라미터 바인딩 (s: string, i: integer)
    $stmt->bind_param('si', $damdangat, $num);
    
    // 쿼리 실행
    if ($stmt->execute()) {
        // 영향받은 행 수 확인
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                'status' => 'success',
                'message' => '담당자 연락처가 성공적으로 업데이트되었습니다.',
                'affected_rows' => $stmt->affected_rows
            ]);
        } else {
            echo json_encode([
                'status' => 'warning',
                'message' => '해당 고객 번호를 찾을 수 없거나 동일한 데이터입니다.',
                'affected_rows' => 0
            ]);
        }
    } else {
        throw new Exception('업데이트 실행 실패: ' . $stmt->error);
    }
    
    // 준비문 리소스 해제
    $stmt->close();
    
} catch (Exception $e) {
    // 예외 처리
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    // 데이터베이스 연결 종료
    $connect->close();
}

/**
 * 사용 예시:
 * 
 * POST 요청으로 다음 데이터 전송:
 * - num: 123 (고객 번호)
 * - damdangat: "010-1234-5678" (새로운 담당자 연락처)
 * 
 * 응답 예시:
 * {
 *   "status": "success",
 *   "message": "담당자 연락처가 성공적으로 업데이트되었습니다.",
 *   "affected_rows": 1
 * }
 */
?>