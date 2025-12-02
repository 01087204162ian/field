<?php
// GET 파라미터 안전하게 받기
$num = isset($_GET["claimNum"]) ? $_GET["claimNum"] : '';

// 빈 값 체크
if (empty($num)) {
    die("claimNum 파라미터가 필요합니다.");
}

$table = "questionnaire";

// SQL Injection 방지를 위한 이스케이프 처리
$num_escaped = mysqli_real_escape_string($connect, $num);
$sql = "SELECT * FROM " . $table . " WHERE num='" . $num_escaped . "'";

// 또는 더 안전한 방법 (Prepared Statement 사용)
/*
$stmt = mysqli_prepare($connect, "SELECT * FROM questionnaire WHERE num=?");
mysqli_stmt_bind_param($stmt, "s", $num);
mysqli_stmt_execute($stmt);
$rs = mysqli_stmt_get_result($stmt);
$row = mysqli_fetch_array($rs);
*/

// 기존 방식을 MySQLi로 변경
$rs = mysqli_query($connect, $sql);

// 쿼리 실행 확인
if (!$rs) {
    die("쿼리 실행 오류: " . mysqli_error($connect));
}

// 결과 가져오기
$row = mysqli_fetch_array($rs);

// 결과 확인
if (!$row) {
    die("해당 데이터를 찾을 수 없습니다. (num: " . htmlspecialchars($num) . ")");
}

// 디버깅용 (필요시 주석 해제)
// echo "sql: " . $sql . "<br>";
// print_r($row);
?>