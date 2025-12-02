<?php
include '../cors.php';
include '../db_connection.php';

// 응답 헤더 설정 (JSON)
header('Content-Type: application/json; charset=UTF-8');

// POST 데이터 가져오기
$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$ch = isset($_POST['ch']) ? (int)$_POST['ch'] : 0;

// DB 연결
$conn = connect_db();

// 응답 객체 초기화
$response = ["success" => false, "message" => ""];

// SQL 쿼리 준비 및 실행
$query = "UPDATE claimList SET ch = ? WHERE num = ?";
$stmt = mysqli_prepare($conn, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "ii", $ch, $id);
    if (mysqli_stmt_execute($stmt)) {
        $response["success"] = true;
        $response["message"] = "상태 변경 성공";
    } else {
        $response["message"] = "상태 변경 실패";
    }
    mysqli_stmt_close($stmt);
} else {
    $response["message"] = "쿼리 준비 실패";
}

// DB 연결 종료
mysqli_close($conn);

// JSON 형식으로 응답 반환
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>
