<?php
include '../cors.php';
include '../db_connection.php'; // DB 연결 파일 포함

header('Content-Type: application/json; charset=UTF-8');

// POST 데이터 가져오기
$num = isset($_POST['num']) ? $_POST['num'] : '';
$memo = isset($_POST['memo']) ? $_POST['memo'] : '';

if (empty($num) || empty($memo)) {
    echo json_encode(['success' => false, 'message' => '잘못된 요청입니다.']);
    exit;
}

// DB 연결
$connect = connect_db();

// SQL 업데이트 쿼리
$sql = "UPDATE questionnaire SET memo = ? WHERE num = ?";
if ($stmt = $connect->prepare($sql)) {
    $stmt->bind_param('si', $memo, $num); // 's' = string, 'i' = integer
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => '메모 업데이트 실패.']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'SQL 준비 실패: ' . $connect->error]);
}

$connect->close();
?>
