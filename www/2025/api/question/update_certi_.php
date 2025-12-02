<?php
include '../cors.php';
include '../db_connection.php'; // DB 연결 파일 포함
// DB 연결
$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정

// POST 데이터 가져오기
$certi_ = isset($_POST['certi_']) ? mysqli_real_escape_string($connect, $_POST['certi_']) : null;
$num = isset($_POST['num']) ? mysqli_real_escape_string($connect, $_POST['num']) : null;
$userName=isset($_POST['userName']) ? mysqli_real_escape_string($connect, $_POST['userName']) : null;

if (!$certi_ || !$num) {
    echo json_encode(array("success" => false, "error" => "필수 데이터가 없습니다."));
    exit;
}
//증권번호 입력자가  당사 담당자 ";
// DB 업데이트
$query = "UPDATE questionnaire SET certi = '$certi_',ch=6,certi_wdate=now(),wdate_3=now(),manager='$userName' WHERE num = '$num'";

$result = mysqli_query($connect, $query);


    $to=3;
	include "../php/email_simsa.php";
if ($result) {
    echo json_encode(array("success" => true));
} else {
    echo json_encode(array("success" => false, "error" => "쿼리 실행 실패: " . mysqli_error($connect)));
}
?>
