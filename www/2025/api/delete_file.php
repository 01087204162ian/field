<?php
include 'db_connection.php'; // DB 연결 파일 포함

// DB 연결
$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정

// 요청 데이터 가져오기
$num = isset($_POST['num']) ? mysqli_real_escape_string($connect, $_POST['num']) : '';

if (!$num) {
    echo json_encode(['success' => false, 'error' => '유효하지 않은 파일 번호입니다.']);
    exit;
}

// 파일 정보 가져오기
$sql = "SELECT * FROM image WHERE num='$num'";
$result = mysqli_query($connect, $sql);
$row = mysqli_fetch_assoc($result);

if (!$row) {
    echo json_encode(['success' => false, 'error' => '파일 정보를 찾을 수 없습니다.']);
    exit;
}

// 파일 삭제
$filePath = $row['description2']; // 파일 경로
if (file_exists($filePath)) {
    unlink($filePath); // 실제 파일 삭제
}

// 데이터베이스에서 레코드 삭제
$sqlDelete = "DELETE FROM image WHERE num='$num'";
if (mysqli_query($connect, $sqlDelete)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => '데이터베이스 삭제 실패.']);
}
?>
