<?php
// 한글 처리를 위한 문자셋 설정
header('Content-Type: application/json; charset=utf-8');

include '../cors.php';
include '../db_connection.php';

// DB 연결
$conn = connect_db();
if (!$conn) {
    echo json_encode(array('success' => false, 'error' => 'Database connection failed'), JSON_UNESCAPED_UNICODE);
    exit;
}

// 한글 처리를 위한 문자셋 설정
mysqli_set_charset($conn, "utf8mb4");

// POST 데이터 수신 및 초기화 (NOT NULL 필드 처리)
$school1 = isset($_POST['school1']) && trim($_POST['school1']) !== '' ? trim($_POST['school1']) : '';
$qNum = isset($_POST['qNum']) && trim($_POST['qNum']) !== '' ? intval(trim($_POST['qNum'])) : 0;
$cNum = isset($_POST['cNum']) && trim($_POST['cNum']) !== '' ? intval(trim($_POST['cNum'])) : 0;
$wdate = date('Y-m-d');
$certi = isset($_POST['certi']) && trim($_POST['certi']) !== '' ? trim($_POST['certi']) : '';
$claimNumber = isset($_POST['claimNumber']) && trim($_POST['claimNumber']) !== '' ? trim($_POST['claimNumber']) : null;
$ch = '1'; // char(2) 타입이므로 문자열로 설정
$wdate_2 = isset($_POST['wdate_2']) && trim($_POST['wdate_2']) !== '' ? trim($_POST['wdate_2']) : null;
$claimAmout = isset($_POST['claimAmout']) && trim($_POST['claimAmout']) !== '' ? trim($_POST['claimAmout']) : ''; // NOT NULL
$student = isset($_POST['student']) && trim($_POST['student']) !== '' ? trim($_POST['student']) : null;
$wdate_3 = isset($_POST['wdate_3']) && trim($_POST['wdate_3']) !== '' ? trim($_POST['wdate_3']) : null;
$accidentDescription = isset($_POST['accidentDescription']) && trim($_POST['accidentDescription']) !== '' ? trim($_POST['accidentDescription']) : '';
$manager = isset($_POST['manager']) && trim($_POST['manager']) !== '' ? trim($_POST['manager']) : '';
$damdanga = isset($_POST['damdanga']) && trim($_POST['damdanga']) !== '' ? trim($_POST['damdanga']) : '';
$damdangat = isset($_POST['damdangat']) && trim($_POST['damdangat']) !== '' ? trim($_POST['damdangat']) : '';
$claimNum = isset($_POST['claimNum__']) && trim($_POST['claimNum__']) !== '' ? intval(trim($_POST['claimNum__'])) : null;
$memo = ''; // memo 필드 추가 (NOT NULL)

// 필수 필드 확인 (NOT NULL 필드들)
if (empty($certi)) {
    echo json_encode(array('success' => false, 'error' => '증권번호는 필수 입력 사항입니다.'), JSON_UNESCAPED_UNICODE);
    exit;
}
if (empty($accidentDescription)) {
    echo json_encode(array('success' => false, 'error' => '사고경위는 필수 입력 사항입니다.'), JSON_UNESCAPED_UNICODE);
    exit;
}
if (empty($school1)) {
    echo json_encode(array('success' => false, 'error' => '학교명은 필수 입력 사항입니다.'), JSON_UNESCAPED_UNICODE);
    exit;
}
if (empty($manager)) {
    echo json_encode(array('success' => false, 'error' => '담당자는 필수 입력 사항입니다.'), JSON_UNESCAPED_UNICODE);
    exit;
}

// 디버깅용 로그 추가
error_log("Received data: " . print_r($_POST, true));
error_log("Processed claimNum: " . ($claimNum ?? 'null'));

// Prepared Statement를 사용한 안전한 쿼리
if ($claimNum && $claimNum > 0) {
    // UPDATE 쿼리 (memo 필드 추가)
    $sql = "UPDATE claimList 
            SET certi = ?,
                claimNumber = ?,
                ch = ?,
                wdate_2 = ?,
                claimAmout = ?,
                student = ?,
                wdate_3 = ?,
                accidentDescription = ?,
                manager = ?,
                damdanga = ?,
                damdangat = ?,
                memo = ?
            WHERE num = ?";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(array('success' => false, 'error' => 'Prepare failed: ' . $conn->error), JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $stmt->bind_param("ssssssssssssi", 
        $certi, $claimNumber, $ch, $wdate_2, $claimAmout, 
        $student, $wdate_3, $accidentDescription, $manager, 
        $damdanga, $damdangat, $memo, $claimNum
    );
    
    $operation_type = "UPDATE";
    
} else {
    // INSERT 쿼리 (memo 필드 추가)
    $sql = "INSERT INTO claimList 
            (school1, wdate, certi, claimNumber, ch, wdate_2, claimAmout, student, wdate_3, accidentDescription, memo, manager, damdanga, damdangat, qNum, cNum)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(array('success' => false, 'error' => 'Prepare failed: ' . $conn->error), JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    $stmt->bind_param("ssssssssssssssii", 
        $school1, $wdate, $certi, $claimNumber, $ch, $wdate_2, 
        $claimAmout, $student, $wdate_3, $accidentDescription, 
        $memo, $manager, $damdanga, $damdangat, $qNum, $cNum
    );
    
    $operation_type = "INSERT";
}

// 쿼리 실행
error_log("Operation type: " . $operation_type);
error_log("SQL: " . $sql);

if ($stmt->execute()) {
    $response = array('success' => true);
    $response['num'] = ($operation_type === "UPDATE") ? $claimNum : $conn->insert_id;
    $response['message'] = ($operation_type === "UPDATE") ? "업데이트 성공!!" : "성공적으로 저장!!";
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
} else {
    error_log("SQL Error: " . $stmt->error);
    echo json_encode(array('success' => false, 'error' => 'SQL execution failed: ' . $stmt->error), JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conn->close();

/*
// 임시 작업 - claimList 테이블과 questionnaire 데이터 조정 작업 2025-01-29
// 필요시 주석 해제하여 사용
$update_sql = "UPDATE claimList c
               JOIN questionnaire q ON c.certi = q.certi
               SET c.cNum = q.cNum,
                   c.qNum = q.num";

$result = mysqli_query($conn, $update_sql);
if ($result) {
    echo "claimList 업데이트 완료!";
} else {
    echo "업데이트 실패: " . mysqli_error($conn);
}
*/
?>