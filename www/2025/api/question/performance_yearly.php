<?php
include '../cors.php';
include '../db_connection.php'; 

header('Content-Type: application/json');
$connect = connect_db();

// GET 요청에서 기준 연도 가져오기
$year = isset($_GET['year']) ? intval($_GET['year']) : date("Y");
$previousYear = $year - 1;

// SQL 실행 (기준년도 및 기준년도 -1년 데이터 조회)
$sql = "SELECT 
            YEAR(wdate_3) AS year,
            DATE_FORMAT(wdate_3, '%m') AS month, 
            COUNT(*) AS gunsu, 
            SUM(preiminum) AS total_sum
        FROM questionnaire
        WHERE YEAR(wdate_3) IN ('$year', '$previousYear')
        AND ch = 6
        GROUP BY year, month
        ORDER BY year DESC, month ASC";

$result = mysqli_query($connect, $sql);

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = [
        "year" => intval($row["year"]),
        "month" => intval($row["month"]), 
        "gunsu" => $row["gunsu"], 
        "total_sum" => intval($row["total_sum"])
    ];
}

echo json_encode($data, JSON_UNESCAPED_UNICODE);
mysqli_close($connect);
?>
