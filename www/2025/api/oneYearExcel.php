<?php
include 'db_connection.php'; // DB 연결 파일 포함

// DB 연결
$connect = connect_db();
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment; filename="export_' . date('Ymd') . '.xls"');
header('Content-Description: PHP4 Generated Data');

// 현재와 1년 전의 날짜 계산
$now_time = date('Y-m');
$sigi = explode("-", $now_time);

$s_sigi = $sigi[0] . "-" . $sigi[1];
$sigi2 = ($sigi[0] - 1) . "-" . $sigi[1];

// SQL 쿼리 실행
$sql = "SELECT * FROM questionnaire 
        WHERE (SUBSTRING(wdate_3, 1, 7) <= '$s_sigi' AND SUBSTRING(wdate_3, 1, 7) >= '$sigi2') 
        AND ch = 6 
        ORDER BY wdate_3 DESC";
$srs = mysqli_query($connect, $sql);
$sNUM = mysqli_num_rows($srs);

// 엑셀 데이터 작성
$EXCEL_STR = "
<table border='1'>
<tr style='text-align:center;'>
   <th>구분</th>
   <th>계약자</th>
   <th>주소</th>
   <th>연락처</th>
   <th>이메일</th>
   <th>보험료</th>
   <th>신청일</th>
   <th>영수일</th>
   <th>보험시기</th>
</tr>";

$preminumTotal = 0;

for ($i = 0; $i < $sNUM; $i++) {
    $sRow = mysqli_fetch_assoc($srs);
    $m = $i + 1;

    // 보험사 이름 변경
    $inscompany = $sRow['inscompany'] == 1 ? '한화' : ($sRow['inscompany'] == 2 ? '메리츠' : '기타');

    $preminumTotal += $sRow['preiminum'];

    // 행 데이터 작성
    $EXCEL_STR .= "
    <tr>
       <td style='text-align:center;'>$m</td>
       <td style='text-align:center;'>{$sRow['school1']}</td>
       <td style='text-align:center;'>{$sRow['school3']}</td>
       <td style='text-align:center;'>{$sRow['school4']}</td>
       <td style='text-align:center;'>{$sRow['school5']}</td>
       <td style='text-align:right;'>" . number_format($sRow['preiminum']) . "</td>
       <td style='text-align:center;'>" . substr($sRow['wdate'], 0, 10) . "</td>
       <td style='text-align:center;'>{$sRow['wdate_3']}</td>
       <td style='text-align:center;'>{$sRow['school7']}</td>
    </tr>";
}

// 총합 행 추가
$EXCEL_STR .= "
<tr>
    <td colspan='5' style='text-align:center;'>보험료 합계</td>
    <td style='text-align:right;'>" . number_format($preminumTotal) . "</td>
</tr>";

$EXCEL_STR .= "</table>";

// 엑셀 출력
echo $EXCEL_STR;

// DB 연결 종료
mysqli_close($connect);
?>
