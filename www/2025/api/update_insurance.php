<?php
include 'db_connection.php';

// POST 데이터에서 값 가져오기
$num = intval($_POST['id']); // num 값을 정수형으로 변환
$inscompany = intval($_POST['inscompany']); // inscompany 값을 정수형으로 변환

$conn = connect_db();

// 쿼리 실행
$query = "UPDATE questionnaire SET inscompany = $inscompany WHERE num = $num";
//echo $query ;
$result = mysqli_query($conn, $query);

if ($result) {
    echo "보험사 수정되었습니다"; // 성공 메시지 반환
} else {
    echo "보험사 수정에 실패했습니다: " . mysqli_error($conn); // 실패 메시지 반환
}

mysqli_close($conn); // DB 연결 종료
?>
