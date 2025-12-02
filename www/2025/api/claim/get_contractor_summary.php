<?php
include '../cors.php';
include '../db_connection.php'; // DB 연결 파일

// DB 연결
$conn = connect_db();

// 검색 연도 설정 (기본값: 현재 연도)
$year = isset($_GET['year']) ? intval($_GET['year']) : date("Y");

// 기본 SQL 템플릿 (`claimList`에서 계약자별 실적 조회 + `questionnaire`에서 보험료 합계 추가)
$sql = "SELECT 
            cl.school1,
            SUM(CASE WHEN cl.ch = 1 THEN 1 ELSE 0 END) AS received,
            SUM(CASE WHEN cl.ch = 2 THEN 1 ELSE 0 END) AS pending,
            SUM(CASE WHEN cl.ch = 3 THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN cl.ch = 4 THEN 1 ELSE 0 END) AS exempted,
            SUM(CASE WHEN cl.ch = 5 THEN 1 ELSE 0 END) AS canceled,
            SUM(CASE WHEN cl.ch = 3 THEN CAST(cl.claimAmout AS UNSIGNED) ELSE 0 END) AS total_claim_amount,
            (SELECT SUM(CAST(q.preiminum AS UNSIGNED)) 
                FROM questionnaire q 
                WHERE q.school1 = cl.school1 
                  AND q.ch = 6 
                  AND YEAR(q.wdate_3) = $year) AS total_premium
        FROM claimList cl
        WHERE YEAR(cl.wdate) = $year
        GROUP BY cl.school1
        ORDER BY cl.school1 ASC";

$result = mysqli_query($conn, $sql);

// 결과 배열 초기화
$data = array();

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        // 보험료 값이 NULL이면 0으로 변환
        $row['total_premium'] = isset($row['total_premium']) ? $row['total_premium'] : 0;
        $data[] = $row;
    }
}

// 데이터가 없으면 빈 배열 반환
if (empty($data)) {
    $data = array();
}

// JSON 출력
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data, JSON_UNESCAPED_UNICODE);

// DB 연결 종료
mysqli_free_result($result);
mysqli_close($conn);
?>
