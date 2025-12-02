<?php 
header("Content-Type: text/html; charset=utf-8");
session_start();
include 'db_connection.php'; // DB 연결 파일

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $mem_id = $_POST['mem_id'];
    $passwd = $_POST['passwd'];

//echo $passwd; echo "<br>";
    // DB 연결
    $conn = connect_db();

    // 아이디와 비밀번호 검증 쿼리
    $query = "SELECT num, passwd, name, level FROM 2012Member WHERE mem_id = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        die("쿼리 준비 실패: " . $conn->error);
    }

    $stmt->bind_param("s", $mem_id);
    $stmt->execute();
    $stmt->store_result();

    // 결과 확인
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($num, $stored_passwd, $name, $level);
        $stmt->fetch();

	//echo md5($passwd);echo "<br>";
	//echo $stored_passwd;echo "<br>";
        // 비밀번호 확인 (입력한 비밀번호를 암호화하여 비교)
        if (md5($passwd) === $stored_passwd) {
            $_SESSION['dnum'] = $num;
            $_SESSION['userName'] = $name;
            $_SESSION['user_level'] = $level;

            // 관리자와 일반 사용자 구분
            if ((int)$level === 5) { // 관리자 확인
                header("Location: ../admin_dashboard.php");
            } else {
                header("Location: ../user_dashboard.php");
            }
            exit();
        } else {
            echo "비밀번호가 잘못되었습니다.";
        }
    } else {
        echo "존재하지 않는 아이디입니다.";
    }

    $stmt->close();
    $conn->close();
}
?>
