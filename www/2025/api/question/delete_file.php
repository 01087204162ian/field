<?php
include '../cors.php';
include '../db_connection.php'; // DB 연결 파일 포함

// DB 연결
$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정

// 요청 데이터 가져오기
$num = isset($_GET['id']) ? trim($_GET['id']) : '';

if (!$num || !is_numeric($num)) {
    echo json_encode(['success' => false, 'error' => '유효하지 않은 파일 번호입니다.']);
    mysqli_close($connect);
    exit;
}

// 파일 정보 가져오기 (prepared statement 사용)
$sql = "SELECT * FROM image WHERE num = ?";
$stmt = mysqli_prepare($connect, $sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'error' => 'SQL 준비 실패: ' . mysqli_error($connect)]);
    mysqli_close($connect);
    exit;
}

mysqli_stmt_bind_param($stmt, 'i', $num);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$row = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);

if (!$row) {
    echo json_encode(['success' => false, 'error' => '파일 정보를 찾을 수 없습니다.']);
    mysqli_close($connect);
    exit;
}

// 실제 파일 경로 생성
$relativePath = $row['description2']; // '/static/user/filename.jpg'
$fullPath = $_SERVER['DOCUMENT_ROOT'] . $relativePath; // 절대 경로

$fileDeleted = false;
$fileError = '';

// 파일 삭제 시도
if (file_exists($fullPath)) {
    if (unlink($fullPath)) {
        $fileDeleted = true;
    } else {
        $fileError = '파일 삭제 권한이 없습니다.';
    }
} else {
    $fileDeleted = true; // 파일이 이미 없으면 삭제된 것으로 간주
    $fileError = '파일이 이미 존재하지 않습니다.';
}

// 데이터베이스에서 레코드 삭제 (prepared statement 사용)
$sqlDelete = "DELETE FROM image WHERE num = ?";
$deleteStmt = mysqli_prepare($connect, $sqlDelete);

if (!$deleteStmt) {
    echo json_encode([
        'success' => false, 
        'error' => 'DELETE SQL 준비 실패: ' . mysqli_error($connect),
        'file_status' => $fileDeleted ? 'deleted' : 'failed',
        'file_error' => $fileError
    ]);
    mysqli_close($connect);
    exit;
}

mysqli_stmt_bind_param($deleteStmt, 'i', $num);

if (mysqli_stmt_execute($deleteStmt)) {
    $affectedRows = mysqli_affected_rows($connect);
    
    if ($affectedRows > 0) {
        echo json_encode([
            'success' => true,
            'message' => '파일이 성공적으로 삭제되었습니다.',
            'file_status' => $fileDeleted ? 'deleted' : 'failed',
            'file_path' => $relativePath
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => '삭제할 레코드가 없습니다.',
            'file_status' => $fileDeleted ? 'deleted' : 'failed'
        ]);
    }
} else {
    echo json_encode([
        'success' => false, 
        'error' => '데이터베이스 삭제 실패: ' . mysqli_stmt_error($deleteStmt),
        'file_status' => $fileDeleted ? 'deleted' : 'failed'
    ]);
}

mysqli_stmt_close($deleteStmt);
mysqli_close($connect);
?>