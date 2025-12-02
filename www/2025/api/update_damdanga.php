<?php
include 'db_connection.php'; // DB 연결 파일 포함

// DB 연결
$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정

// 연결 확인
if ($connect->connect_error) {
    die('데이터베이스 연결 실패: ' . $connect->connect_error);
}

// POST 데이터 수신
$num = isset($_POST['num']) ? $_POST['num'] : null;
$damdanga = isset($_POST['damdanga']) ? $_POST['damdanga'] : null;

if ($num && $damdanga) {
    // SQL 쿼리 작성
    $sql = "UPDATE 2014Costmer SET damdanga = ? WHERE num = ?";
    $stmt = $connect->prepare($sql);

    if ($stmt) {
        $stmt->bind_param('si', $damdanga, $num);
        if ($stmt->execute()) {
            echo '담당자  성공적으로 업데이트되었습니다.';
        } else {
            echo '업데이트 실패: ' . $stmt->error;
        }
        $stmt->close();
    } else {
        echo 'SQL 준비 실패: ' . $connect->error;
    }
} else {
    echo '필수 데이터가 누락되었습니다.';
}

// DB 연결 종료
$connect->close();
?>
