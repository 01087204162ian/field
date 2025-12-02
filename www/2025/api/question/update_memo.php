<?php
include '../cors.php';
include '../db_connection.php';

// OPTIONS 요청 처리
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json; charset=UTF-8');

try {
    // POST 데이터 가져오기
    $num = isset($_POST['num']) ? intval($_POST['num']) : 0;
    $memo = isset($_POST['memo']) ? $_POST['memo'] : '';
    
    // 유효성 검사
    if ($num <= 0) {
        echo json_encode([
            'success' => false, 
            'message' => '유효하지 않은 ID입니다.'
        ]);
        exit;
    }
    
    // 메모가 비어있어도 허용 (빈 문자열로 저장 가능)
    
    // DB 연결
    $connect = connect_db();
    
    if (!$connect) {
        throw new Exception('데이터베이스 연결 실패');
    }
    
    // SQL 업데이트 쿼리
    $sql = "UPDATE questionnaire SET memo = ? WHERE num = ?";
    
    if ($stmt = $connect->prepare($sql)) {
        $stmt->bind_param('si', $memo, $num);
        
        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => '메모가 저장되었습니다.'
            ]);
        } else {
            throw new Exception('메모 업데이트 실패: ' . $stmt->error);
        }
        
        $stmt->close();
    } else {
        throw new Exception('SQL 준비 실패: ' . $connect->error);
    }
    
    $connect->close();
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'message' => $e->getMessage()
    ]);
}
?>