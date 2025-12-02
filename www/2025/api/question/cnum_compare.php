<?php
/**
 * cnum_compare.php
 * 여러 cNum을 비교하기 위한 상세 정보 조회
 * 
 * 요청 예시: /api/question/cnum_compare.php?cNums=2431,2203,2160
 */

include '../cors.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../db_connection.php';

try {
    $conn = connect_db();
    
    if (!$conn) {
        throw new Exception('데이터베이스 연결 실패');
    }
    
    // cNums 파라미터 받기 (예: "2431,2203,2160")
    $cNumsParam = isset($_GET['cNums']) ? trim($_GET['cNums']) : '';
    
    if (empty($cNumsParam)) {
        throw new Exception('cNums 파라미터가 필요합니다. (예: cNums=2431,2203,2160)');
    }
    
    // 쉼표로 분리하여 배열로 변환
    $cNumArray = array_map('intval', explode(',', $cNumsParam));
    
    // 유효하지 않은 값 제거 (0 이하)
    $cNumArray = array_filter($cNumArray, function($num) {
        return $num > 0;
    });
    
    if (empty($cNumArray)) {
        throw new Exception('유효한 cNum이 없습니다.');
    }
    
    // 최대 10개까지만 비교 허용
    if (count($cNumArray) > 10) {
        throw new Exception('한 번에 최대 10개까지만 비교할 수 있습니다.');
    }
    
    // IN 절을 위한 플레이스홀더 생성
    $placeholders = implode(',', array_fill(0, count($cNumArray), '?'));
    $types = str_repeat('i', count($cNumArray));
    
    error_log("=== cNum 비교 조회 ===");
    error_log("cNums: " . implode(',', $cNumArray));
    
    // 각 cNum별 데이터 조회
    $compareData = array();
    
    foreach ($cNumArray as $cNum) {
        // 해당 cNum의 모든 데이터 조회
        $query = "
            SELECT 
                q.*,
                c.mem_id,
                c.schoolName as customer_school_name
            FROM questionnaire q
            LEFT JOIN 2014Costmer c ON q.cNum = c.num
            WHERE q.cNum = ?
            ORDER BY q.wdate ASC
        ";
        
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            throw new Exception('쿼리 준비 실패: ' . $conn->error);
        }
        
        $stmt->bind_param('i', $cNum);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $items = array();
        $totalStudents = 0;
        $totalPremium = 0;
        $firstWdate = null;
		$lastWdate = null;  // ⭐ 추가
        $school1 = '';
        $school3 = '';
        $school4 = '';
        $school5 = '';
        $memId = '';
        
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $items[] = $row;
                
                // 통계 계산
                $totalStudents += intval($row['week_total']);
                $totalPremium += intval($row['preiminum']);
                
                // 최초 등록일 (가장 빠른 날짜)
                if ($firstWdate === null || $row['wdate'] < $firstWdate) {
                    $firstWdate = $row['wdate'];
                }
                
				 // ⭐ 마지막 등록일 (가장 늦은 날짜)
				if ($lastWdate === null || $row['wdate'] > $lastWdate) {
					$lastWdate = $row['wdate'];
				}
                // 기본 정보 (첫 번째 레코드에서)
                if (empty($school1)) {
                    $school1 = $row['school1'];
                    $school3 = $row['school3'];
                    $school4 = $row['school4'];
                    $school5 = $row['school5'];
                    $memId = $row['mem_id'] ?? '-';
                }
            }
        }
        
        $stmt->close();
        
        // cNum별 요약 데이터 생성
        $compareData[] = array(
            'cNum' => $cNum,
            'mem_id' => $memId,
            'school1' => $school1,
            'school3' => $school3,
            'school4' => $school4,
            'school5' => $school5,
            'first_wdate' => $firstWdate,
			'last_wdate' => $lastWdate,  // ⭐ 추가
            'total_count' => count($items),
            'total_students' => $totalStudents,
            'total_premium' => $totalPremium,
            'items' => $items  // 전체 데이터 (선택사항)
        );
        
        error_log("cNum {$cNum}: {$school1}, 총 " . count($items) . "건, 학생수 {$totalStudents}명, 보험료 {$totalPremium}원");
    }
    
    // 응답 생성
    header('Content-Type: application/json; charset=utf-8');
    
    $response = array(
        'success' => true,
        'data' => $compareData,
        'summary' => array(
            'compare_count' => count($compareData),
            'cNums' => $cNumArray
        )
    );
    
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    
    error_log("=== cNum 비교 조회 완료 ===");

} catch (Exception $e) {
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    
    echo json_encode(array(
        'success' => false,
        'error' => array(
            'message' => $e->getMessage()
        )
    ), JSON_UNESCAPED_UNICODE);
    
    error_log("cNum 비교 API Error: " . $e->getMessage());
    
} finally {
    if (isset($conn) && $conn) {
        $conn->close();
    }
}
?>