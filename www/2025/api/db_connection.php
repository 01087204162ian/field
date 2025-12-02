
<?php


// 데이터베이스 연결 함수
function connect_db() {
    // 데이터베이스 설정
   $servername = "localhost"; // 데이터베이스 서버 주소
    $username = "field0327";        // 데이터베이스 사용자 이름
    $password = "pci@716671";            // 데이터베이스 비밀번호
    $dbname = "field0327"; // 데이터베이스 이름

    // MySQL 5.1 호환 연결
    $conn = mysqli_connect($servername, $username, $password, $dbname);

    // 연결 확인
    if (!$conn) {
        die("DB 연결 실패: " . mysqli_connect_error());
    }

    // 연결 성공 시 연결 객체 반환
    return $conn;
}



?>



