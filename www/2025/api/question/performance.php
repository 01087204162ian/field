<?php


// DB 연결
$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정

// POST 데이터 처리
$sigi = isset($_POST['sigi']) ? mysqli_real_escape_string($connect, $_POST['sigi']) : null;

if ($sigi) {
    $mothsend = date("t", strtotime($sigi)); // 해당 월의 총 일 수
    $nowtime = $sigi . "-01"; // 해당 월의 첫날
    $month_ = 1; // 월별 보기
} else {
    $mothsend = 30; // 기본 30일
    $nowtime = date("Y-m-d"); // 현재 날짜
    $month_ = 2; // 역순 보기
}

// 초기화
$data = array();
$week = array("일", "월", "화", "수", "목", "금", "토");
$week_1 = array(0, 1, 2, 3, 4, 5, 6);
$total_preminum = 0; // 통계 합계
$total_gunsu = 0;    // 건수 합계

// 반복문을 통해 각 날짜별 데이터를 처리
for ($i = 0; $i < $mothsend; $i++) {
    // 날짜 계산
    if ($month_ == 1) { // 월별로 보는 경우
        $day_ = date("Y-m-d", strtotime("$nowtime + $i day"));
    } else {
        $day_ = date("Y-m-d", strtotime("$nowtime - $i day"));
    }

    $yoil = $week[date("w", strtotime($day_))]; // 요일
    $yoil_2 = $week_1[date("w", strtotime($day_))]; // 요일 번호

    // SQL 쿼리: 해당 날짜와 상태(ch = 6) 조건
    $day_ = trim($day_);
    $sql = "SELECT * FROM questionnaire WHERE wdate_3 = '$day_' AND ch = 6"; // 영수일 기준

    $query = mysqli_query($connect, $sql);
    $preminum = 0;
    $gunsu = 0;

    if ($query && mysqli_num_rows($query) > 0) {
        while ($entry = mysqli_fetch_assoc($query)) {
            $num = $entry['num'];

            // num 기준으로 데이터 조회
            $sql2 = "SELECT * FROM questionnaire WHERE num = '$num'";
            $query2 = mysqli_query($connect, $sql2);

            if ($query2 && mysqli_num_rows($query2) > 0) {
                while ($entry2 = mysqli_fetch_assoc($query2)) {
                    $preminum += $entry2['preiminum']; // 일자별 합계
                    $gunsu++;
                }
            }
        }
    }

    // 총합 계산
    $total_preminum += $preminum; // 통계 합계
    $total_gunsu += $gunsu;

    // 결과 배열에 추가
    $data[] = array(
        'key0' => number_format($total_preminum),
        'key1' => $day_,
        'key2' => $yoil,
        'key3' => number_format($preminum),
        'key4' => number_format($gunsu),
        'key5' => $yoil_2,
        'key6' => $total_gunsu
    );
}


// 결과 반환
echo json_encode($data);
?>
