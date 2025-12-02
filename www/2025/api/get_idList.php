<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
include 'cors.php';
include 'db_connection.php'; // DB 연결 파일 포함
// DB 연결
$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정

// 데이터 조회
$query = "SELECT num, mem_id FROM 2014Costmer ORDER BY mem_id ASC";
$result = mysqli_query($connect, $query);

$mem_ids = array();
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $mem_ids[] = $row; // 배열로 저장
    }
}

// 결과 반환
echo json_encode($mem_ids);
?>
