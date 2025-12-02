<?php 
include '../cors.php';
include '../db_connection.php'; // DB 연결 파일

// DB 연결
$conn = connect_db();

// 요청된 연도 확인 (기본값: 현재 연도)
$year = isset($_GET['year']) ? intval($_GET['year']) : date("Y");

$data = array(
    "claims" => array(),
    "premiums" => array()
);

// ✅ 1️⃣ `claimList`에서 월별 건수 + 종결(ch=3) 보험금 합계 조회
$sql_claims = "SELECT 
                DATE_FORMAT(wdate, '%Y-%m') AS yearMonth,
                ch,
                COUNT(*) AS count,
                SUM(CASE WHEN ch = 3 THEN CAST(claimAmout AS UNSIGNED) ELSE 0 END) AS total_claim_amount
            FROM claimList
            WHERE YEAR(wdate) = $year
            GROUP BY yearMonth, ch
            ORDER BY yearMonth ASC";

$result_claims = mysqli_query($conn, $sql_claims);

if ($result_claims) {
    while ($row = mysqli_fetch_assoc($result_claims)) {
        $data["claims"][] = $row;
    }
}

// ✅ 2️⃣ `questionnaire`에서 월별 보험료 합계 조회 (`ch=6`)
$sql_premiums = "SELECT 
                DATE_FORMAT(wdate_3, '%Y-%m') AS yearMonth,
                SUM(CAST(preiminum AS UNSIGNED)) AS total_premium
            FROM questionnaire
            WHERE ch = 6 AND YEAR(wdate_3) = $year
            GROUP BY yearMonth
            ORDER BY yearMonth ASC";

$result_premiums = mysqli_query($conn, $sql_premiums);

if ($result_premiums) {
    while ($row = mysqli_fetch_assoc($result_premiums)) {
        $data["premiums"][] = $row;
    }
}

// JSON 출력
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data, JSON_UNESCAPED_UNICODE);

// DB 연결 종료
mysqli_close($conn);
?>
