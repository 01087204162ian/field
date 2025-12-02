<?php
// 에러 리포팅 설정 (개발 중에만 사용)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS 헤더 설정
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// OPTIONS 요청 처리
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 데이터베이스 연결 변수 초기화
$connect = null;

try {
    // 데이터베이스 연결 파일 포함
    if (file_exists('../../2025/api/db_connection.php')) {
        include '../../2025/api/db_connection.php';
    } else {
        throw new Exception('데이터베이스 연결 파일을 찾을 수 없습니다.');
    }
    
    // 데이터베이스 연결
    $connect = connect_db();
    
    if (!$connect) {
        throw new Exception('데이터베이스 연결 실패');
    }
    
    // MySQL 문자셋 설정
    mysqli_set_charset($connect, 'utf8');
    
    // 보험료 데이터 조회
    $query = "SELECT * FROM preiminum ORDER BY num DESC LIMIT 1";
    $result = mysqli_query($connect, $query);
    
    if (!$result) {
        throw new Exception('쿼리 실행 실패: ' . mysqli_error($connect));
    }
    
    $row = mysqli_fetch_assoc($result);
    
    if ($row) {
        // 데이터가 있는 경우
        $periods = array();
        
        // a1~a7, b1~b7 값이 존재하는지 확인 후 배열 생성
        $periods[] = array('weeks' => '1~4주', 'planA' => $row['a1'] ?? '3,000원', 'planB' => $row['b1'] ?? '5,000원');
        $periods[] = array('weeks' => '5~8주', 'planA' => $row['a2'] ?? '5,000원', 'planB' => $row['b2'] ?? '8,000원');
        $periods[] = array('weeks' => '9~12주', 'planA' => $row['a3'] ?? '7,000원', 'planB' => $row['b3'] ?? '11,000원');
        $periods[] = array('weeks' => '13~16주', 'planA' => $row['a4'] ?? '9,000원', 'planB' => $row['b4'] ?? '14,000원');
        $periods[] = array('weeks' => '17~20주', 'planA' => $row['a5'] ?? '11,000원', 'planB' => $row['b5'] ?? '17,000원');
        $periods[] = array('weeks' => '21~24주', 'planA' => $row['a6'] ?? '13,000원', 'planB' => $row['b6'] ?? '20,000원');
        $periods[] = array('weeks' => '25~26주', 'planA' => $row['a7'] ?? '15,000원', 'planB' => $row['b7'] ?? '23,000원');
        
        $lastUpdated = $row['end'] ? $row['end'] : ($row['sigi'] ? $row['sigi'] : date('Y-m-d'));
        
        $response = array(
            'success' => true,
            'message' => '데이터 조회 성공',
            'periods' => $periods,
            'lastUpdated' => $lastUpdated,
            'compensation' => array(
                'daein' => floatval($row['daein'] ?? 200000000),
                'daemool' => floatval($row['daemool'] ?? 300000000)
            )
        );
    } else {
        // 데이터가 없는 경우 기본값 반환
        $response = array(
            'success' => true,
            'message' => '기본 데이터 반환',
            'periods' => array(
                array('weeks' => '1~4주', 'planA' => '3,000원', 'planB' => '5,000원'),
                array('weeks' => '5~8주', 'planA' => '5,000원', 'planB' => '8,000원'),
                array('weeks' => '9~12주', 'planA' => '7,000원', 'planB' => '11,000원'),
                array('weeks' => '13~16주', 'planA' => '9,000원', 'planB' => '14,000원'),
                array('weeks' => '17~20주', 'planA' => '11,000원', 'planB' => '17,000원'),
                array('weeks' => '21~24주', 'planA' => '13,000원', 'planB' => '20,000원'),
                array('weeks' => '25~26주', 'planA' => '15,000원', 'planB' => '23,000원')
            ),
            'lastUpdated' => date('Y-m-d'),
            'compensation' => array(
                'daein' => 200000000,
                'daemool' => 300000000
            )
        );
    }
    
} catch (Exception $e) {
    // 에러 발생시 기본 데이터 반환 (에러를 숨기고 서비스 지속)
    $response = array(
        'success' => true,
        'message' => 'fallback 데이터 사용',
        'periods' => array(
            array('weeks' => '1~4주', 'planA' => '3,000원', 'planB' => '5,000원'),
            array('weeks' => '5~8주', 'planA' => '5,000원', 'planB' => '8,000원'),
            array('weeks' => '9~12주', 'planA' => '7,000원', 'planB' => '11,000원'),
            array('weeks' => '13~16주', 'planA' => '9,000원', 'planB' => '14,000원'),
            array('weeks' => '17~20주', 'planA' => '11,000원', 'planB' => '17,000원'),
            array('weeks' => '21~24주', 'planA' => '13,000원', 'planB' => '20,000원'),
            array('weeks' => '25~26주', 'planA' => '15,000원', 'planB' => '23,000원')
        ),
        'lastUpdated' => date('Y-m-d'),
        'error_info' => $e->getMessage()
    );
    
    // 에러 로그 기록
    error_log("Premium API Error: " . $e->getMessage());
} finally {
    // 데이터베이스 연결 종료
    if ($connect) {
        mysqli_close($connect);
    }
}

// JSON 응답 출력
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>