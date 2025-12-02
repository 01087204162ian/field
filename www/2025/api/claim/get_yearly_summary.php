<?php 
include '../cors.php';
include '../db_connection.php'; // DB 연결 파일

// DB 연결
$conn = connect_db();

// 요청된 기준 연도 확인 (기본값: 현재 연도)
$year = isset($_GET['year']) ? intval($_GET['year']) : date("Y");
$startYear = $year - 9; // 최근 10년간 데이터 조회

$data = array(
    "claims" => array(),
    "premiums" => array()
);
// ✅ 2️⃣ `questionnaire`에서 최근 10년간 연도별 보험료 합계 조회 (`ch=6`)
$sql_premiums = "SELECT 
                YEAR(wdate_3) AS premiumYear,
                SUM(CAST(preiminum AS UNSIGNED)) AS total_premium
            FROM questionnaire
            WHERE ch = 6 AND YEAR(wdate_3) BETWEEN $startYear AND $year
            GROUP BY premiumYear
            ORDER BY premiumYear DESC";

$result_premiums = mysqli_query($conn, $sql_premiums);

if ($result_premiums) {
    while ($row = mysqli_fetch_assoc($result_premiums)) {
        $data["premiums"][] = $row;
    }
}
// ✅ 1️⃣ `claimList`에서 최근 10년간 연도별 접수/미결/종결/면책/취소 건수 및 종결 보험금 합계 조회
$sql_claims = "SELECT 
                YEAR(wdate) AS claimYear,
                ch,
                COUNT(*) AS count,
                SUM(CASE WHEN ch = 3 THEN CAST(claimAmout AS UNSIGNED) ELSE 0 END) AS total_claim_amount
            FROM claimList
            WHERE YEAR(wdate) BETWEEN $startYear AND $year
            GROUP BY claimYear, ch
            ORDER BY claimYear DESC";

$result_claims = mysqli_query($conn, $sql_claims);

if ($result_claims) {
    while ($row = mysqli_fetch_assoc($result_claims)) {
        $data["claims"][] = $row;
    }
}



// JSON 출력
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data, JSON_UNESCAPED_UNICODE);

// DB 연결 종료
mysqli_close($conn);
?>
