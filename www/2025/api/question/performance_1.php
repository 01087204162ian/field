<?php
include '../cors.php';
include '../db_connection.php'; // DB 연결 파일 포함

// DB 연결
$connect = connect_db();
header('Content-Type: application/json');

// GET 요청에서 시작 날짜와 종료 날짜 가져오기
$startDate = isset($_GET['start']) ? $_GET['start'] : date("Y-m-d", strtotime("-1 month"));
$endDate = isset($_GET['end']) ? $_GET['end'] : date("Y-m-d");

// SQL 실행 (과거 1개월간 데이터 조회)
$sql = "SELECT 
            wdate_3 AS day_, 
            COUNT(*) AS gunsu, 
            SUM(preiminum) AS day_sum
        FROM questionnaire
        WHERE wdate_3 BETWEEN '$startDate' AND '$endDate'
        AND ch = 6
        GROUP BY wdate_3
        ORDER BY wdate_3";

$result = mysqli_query($connect, $sql);

$queryData = [];
while ($row = mysqli_fetch_assoc($result)) {
    $queryData[$row["day_"]] = [
        "gunsu" => $row["gunsu"],
        "day_sum" => number_format($row["day_sum"]) // 금액을 천 단위로 포맷
    ];
}

// 모든 날짜 생성 (시작일 ~ 종료일)
$period = new DatePeriod(
    new DateTime($startDate),
    new DateInterval('P1D'), // 하루 단위
    (new DateTime($endDate))->modify('+1 day') // 종료일 포함
);

$data = [];
foreach ($period as $date) {
    $formattedDate = $date->format("Y-m-d");
    if (isset($queryData[$formattedDate])) {
        // 실적이 있는 경우
        $data[] = [
            "day_" => $formattedDate,
            "gunsu" => $queryData[$formattedDate]["gunsu"],
            "day_sum" => $queryData[$formattedDate]["day_sum"]
        ];
    } else {
        // 실적이 없는 경우
        $data[] = [
            "day_" => $formattedDate,
            "gunsu" => 0,
            "day_sum" => "0"
        ];
    }
}

echo json_encode($data, JSON_UNESCAPED_UNICODE);
mysqli_close($connect);
?>
