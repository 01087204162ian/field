<?php
include 'db_connection.php';

// POST 데이터 가져오기
$id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
$ch = isset($_POST['ch']) ? (int)$_POST['ch'] : 0;

// DB 연결
$conn = connect_db();

// SQL 쿼리 준비 및 실행
$query = "UPDATE questionnaire SET ch = ? WHERE num = ?";
$stmt = mysqli_prepare($conn, $query);
if ($stmt) {
    mysqli_stmt_bind_param($stmt, "ii", $ch, $id);
    if (mysqli_stmt_execute($stmt)) {
        echo "상태 변경 성공"; // 성공 메시지 출력
    } else {
        echo "상태 변경 실패"; // 실패 메시지 출력
    }
    mysqli_stmt_close($stmt);
} else {
    echo "쿼리 준비 실패"; // 쿼리 준비 실패 시 메시지 출력
}

// DB 연결 종료
mysqli_close($conn);
?>
