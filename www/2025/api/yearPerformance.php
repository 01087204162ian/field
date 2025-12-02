<?php
include 'db_connection.php'; // DB 연결 파일 포함

// DB 연결
$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정

// 현재 날짜 기준
$sigi = date('Y-m');
$currentYear = (int)date('Y');
$currentMonth = (int)date('m');

// 시작 연도 설정
$minYear = $currentYear - 2;
if ($minYear < 2016) {
    $minYear = 2016; // 최소 연도를 2016으로 설정
}

$data = array(); // 결과 저장 배열

// 연도 루프
for ($year = $currentYear; $year >= $minYear; $year--) {
    // 해당 연도의 시작 월 설정
    $startMonth = ($year == $currentYear) ? $currentMonth : 12;

    // 월 루프
    for ($month = $startMonth; $month >= 1; $month--) {
        // 월 형식 맞춤 (1 -> 01)
        $formattedMonth = str_pad($month, 2, "0", STR_PAD_LEFT);

        // 해당 연도-월 조합
        $s_sigi = trim($year . "-" . $formattedMonth);
        $s_sigi2 = trim($year . "년 " . $formattedMonth . "월");

        // SQL 쿼리 작성
        $sql = "SELECT * FROM questionnaire WHERE SUBSTRING(wdate_3, 1, 7) = '$s_sigi' AND ch = 6";
        $query = mysqli_query($connect, $sql);

        $m_preminum = 0; // 월 보험료 합계
        $m_gunsu = 0;    // 월 건수

        if ($query && mysqli_num_rows($query) > 0) {
            while ($entry = mysqli_fetch_assoc($query)) {
                $num = $entry['num'];

                // num 기준 추가 조회
                $sql2 = "SELECT * FROM questionnaire WHERE num = '$num'";
                $query2 = mysqli_query($connect, $sql2);

                if ($query2 && mysqli_num_rows($query2) > 0) {
                    while ($entry2 = mysqli_fetch_assoc($query2)) {
                        $m_preminum += $entry2['preiminum']; // 월 보험료 합계 계산
                        $m_gunsu++;                          // 월 건수 증가
                    }
                }
            }
        }

        // 결과 데이터에 추가
        $data[] = array(
            'key0' => $s_sigi,
            'key1' => $m_preminum,
            'key2' => $m_gunsu
        );
    }
}

// JSON 데이터 반환
echo json_encode($data);
?>
