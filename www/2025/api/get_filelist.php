<?php
include 'db_connection.php'; // DB 연결 파일 포함

// DB 연결
$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정

// GET 파라미터 처리
$qnum = isset($_GET['id']) ? mysqli_real_escape_string($connect, $_GET['id']) : '';

// 메인 쿼리 실행
$sql = "SELECT * FROM image WHERE qnum='$qnum' ORDER BY num DESC";
$result = mysqli_query($connect, $sql);

$file_list = array(); // 결과 저장 배열

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        // 서브 쿼리 실행
        $sql2 = "SELECT * FROM questionnaire WHERE num='$qnum'";
        $result2 = mysqli_query($connect, $sql2);

        if ($result2) {
            $row2 = mysqli_fetch_assoc($result2);

            // kind 값에 따른 처리
            switch ($row['kind']) {
                case 4: // 청약번호
                    $row['bunho'] = $row2['gabunho'];
                    break;
                case 7: // 증권번호
                    $row['bunho'] = $row2['certi'];
                    break;
                default:
                    $row['bunho'] = ''; // 기본 값
            }
        } else {
            $row['bunho'] = ''; // 서브 쿼리 실패 시 기본 값
        }

        // 결과 배열에 추가
        $file_list[] = $row;
    }
} else {
    // 메인 쿼리 실패 시 에러 반환
    echo json_encode(array('error' => 'Failed to fetch data from the database.'));
    exit;
}

// JSON 결과 반환
echo json_encode($file_list);
?>