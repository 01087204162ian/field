<?php
include 'db_connection.php'; // DB 연결 파일 포함

// DB 연결
$connect = connect_db();

// HTTP 헤더 설정
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment; filename="month_' . date('Ymd') . '.xls"');
header('Content-Description: PHP4 Generated Data');

// POST 데이터 가져오기
$start = $_POST['start'];
$end = $_POST['end'];

// 기간 설정
$gigan = $start . "~" . $end;
$firstDate = new DateTime($start);
$secondDate = new DateTime($end);
$intvl = $firstDate->diff($secondDate);
$diffDay = $intvl->days + 1;

// 쿼리 작성
if ($firstDate > $secondDate) {
    $sql = "SELECT * FROM questionnaire WHERE wdate_3 <= '$start' AND wdate_3 >= '$end' AND ch = 6 ORDER BY wdate_3 DESC";
    $gigan = $end . "~" . $start;
} else {
    $sql = "SELECT * FROM questionnaire WHERE wdate_3 <= '$end' AND wdate_3 >= '$start' AND ch = 6 ORDER BY wdate_3 DESC";
    $gigan = $start . "~" . $end;
}

// 데이터 조회
$srs = mysqli_query($connect, $sql);
$sNUM = mysqli_num_rows($srs);

// 엑셀 헤더 작성
$EXCEL_STR = "
<table border='1'>
<tr style=\"text-align:center;mso-number-format:'\@';\">
   <th>구분</th>
   <th>영수일</th>
   <th>계약자</th>
   <th>주소</th>
   <th>연락처</th>
   <th>이메일</th>
   <th>보험료</th>
   <th>신청일</th>
   <th>보험시기</th>
   <th>증권번호</th>
</tr>";

$preminumTotal = 0;

// 데이터 작성
for ($i = 0; $i < $sNUM; $i++) {
    $sRow = mysqli_fetch_assoc($srs);

    $m = $i + 1;
    $inscompany = $sRow['inscompany'] == 1 ? '한화' : ($sRow['inscompany'] == 2 ? '메리츠' : '기타');
    $preminumTotal += $sRow['preiminum'];

    // 행 데이터 추가
    $EXCEL_STR .= "
    <tr>
       <td style=\"text-align:center;mso-number-format:'\@';\">$m</td>
       <td style=\"text-align:center;mso-number-format:'\@';\">{$sRow['wdate_3']}</td>
       <td style=\"text-align:center;mso-number-format:'\@';\">{$sRow['school1']}</td>
       <td style=\"text-align:center;mso-number-format:'\@';\">{$sRow['school3']}</td>
       <td style=\"text-align:center;mso-number-format:'\@';\">{$sRow['school4']}</td>
       <td style=\"text-align:center;mso-number-format:'\@';\">{$sRow['school5']}</td>
       <td style=\"text-align:right;mso-number-format:'\@';\">" . number_format($sRow['preiminum']) . "</td>
       <td style=\"text-align:center;mso-number-format:'\@';\">" . substr($sRow['wdate'], 0, 10) . "</td>
       <td style=\"text-align:center;mso-number-format:'\@';\">{$sRow['school7']}</td>
       <td style=\"text-align:right;mso-number-format:'\@';\">{$sRow['certi']}</td>
    </tr>";
}

// 보험료 총합 작성
$EXCEL_STR .= "
<tr>
    <td colspan='6' style=\"text-align:center;mso-number-format:'\@';\">보험료 합계</td>
    <td style=\"text-align:right;mso-number-format:'\@';\">" . number_format($preminumTotal) . "</td>
</tr>
</table>";

// 출력
echo "<meta content=\"application/vnd.ms-excel; charset=UTF-8\" name=\"Content-type\"> ";
echo $EXCEL_STR;

// DB 연결 종료
mysqli_close($connect);
?>
