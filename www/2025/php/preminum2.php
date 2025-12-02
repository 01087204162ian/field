<?php
// 플랜 구분
// 플랜 A: $school9 = 1
// 플랜 B: $school9 = 2
// 주차별 구분: 1~4주(1), 5~8주(2), 9~12주(3), 13~16주(4), 17~20주(5), 21~26주(6,7)

// 보험료 산출을 위한 기준 데이터 조회
$pSql = "SELECT * FROM preiminum WHERE sigi <= '$school7' AND end >= '$school7'";
$prs = mysqli_query($connect, $pSql);
$pRow = mysqli_fetch_assoc($prs);

// 디버깅용 주석 (필요시 활성화)
// echo "SQL: " . $pSql . "<br>";
// echo "24주차 값: " . $weeks["week24"] . "<br>";
// echo "pRow[a6]: " . $pRow['a6'] . "<br>";
// echo "school9: " . $school9 . "<br>";
// echo "5주차 값: " . $weeks["week5"] . "<br>";

// 플랜에 따른 보험료 계산
switch($school9) {
    case 1: // 플랜 A
        $Preminum = $weeks["week4"] * $pRow['a1']
                   + $weeks["week5"] * $pRow['a2'] + $weeks["week6"] * $pRow['a2'] 
                   + $weeks["week7"] * $pRow['a2'] + $weeks["week8"] * $pRow['a2']
                   + $weeks["week9"] * $pRow['a3'] + $weeks["week10"] * $pRow['a3'] 
                   + $weeks["week11"] * $pRow['a3'] + $weeks["week12"] * $pRow['a3']
                   + $weeks["week13"] * $pRow['a4'] + $weeks["week14"] * $pRow['a4'] 
                   + $weeks["week15"] * $pRow['a4'] + $weeks["week16"] * $pRow['a4']
                   + $weeks["week17"] * $pRow['a5'] + $weeks["week18"] * $pRow['a5'] 
                   + $weeks["week19"] * $pRow['a5'] + $weeks["week20"] * $pRow['a5']
                   + $weeks["week21"] * $pRow['a6'] + $weeks["week22"] * $pRow['a6'] 
                   + $weeks["week23"] * $pRow['a6'] + $weeks["week24"] * $pRow['a6']
                   + $weeks["week25"] * $pRow['a7'] + $weeks["week26"] * $pRow['a7'];
        break;
        
    case 2: // 플랜 B
        $Preminum = $weeks["week4"] * $pRow['b1']
                   + $weeks["week5"] * $pRow['b2'] + $weeks["week6"] * $pRow['b2'] 
                   + $weeks["week7"] * $pRow['b2'] + $weeks["week8"] * $pRow['b2']
                   + $weeks["week9"] * $pRow['b3'] + $weeks["week10"] * $pRow['b3'] 
                   + $weeks["week11"] * $pRow['b3'] + $weeks["week12"] * $pRow['b3']
                   + $weeks["week13"] * $pRow['b4'] + $weeks["week14"] * $pRow['b4'] 
                   + $weeks["week15"] * $pRow['b4'] + $weeks["week16"] * $pRow['b4']
                   + $weeks["week17"] * $pRow['b5'] + $weeks["week18"] * $pRow['b5'] 
                   + $weeks["week19"] * $pRow['b5'] + $weeks["week20"] * $pRow['b5']
                   + $weeks["week21"] * $pRow['b6'] + $weeks["week22"] * $pRow['b6'] 
                   + $weeks["week23"] * $pRow['b6'] + $weeks["week24"] * $pRow['b6']
                   + $weeks["week25"] * $pRow['b7'] + $weeks["week26"] * $pRow['b7'];
        break;
        
    default:
        $Preminum = 0; // 기본값 설정
        break;
}

// 보험료가 변경된 경우에만 업데이트 실행
// 보험료 산출 시마다 가계약번호, 인수심사번호를 삭제하고 상태를 '보험료 안내중(ch=2)'으로 변경
if ($oldPreminum != $Preminum) {
    
    // 보험회사별 처리 구분
    if ($inscompany == 2) { 
        // 메리츠화재: 설계번호를 업데이트하지만 한화는 그대로 사용
        $sql2 = "UPDATE " . $table . " SET 
                 ch = '2', 
                 preiminum = '$Preminum', 
                 gabunho = '', 
                 simbuho = '' 
                 WHERE num = '$num'";
    } else {
        // 기타 보험회사
        $sql2 = "UPDATE " . $table . " SET 
                 ch = '2', 
                 preiminum = '$Preminum', 
                 simbuho = '' 
                 WHERE num = '$num'";
    }
    
    // 업데이트 실행
    $result = mysqli_query($connect, $sql2);
    if (!$result) {
        error_log("보험료 업데이트 실패: " . mysqli_error($connect));
    }
    
    // 관련 이미지 삭제 (kind='4'인 이미지)
    $sql3 = "DELETE FROM image WHERE qnum = '$num' AND kind = '4'";
    $result3 = mysqli_query($connect, $sql3);
    if (!$result3) {
        error_log("이미지 삭제 실패: " . mysqli_error($connect));
    }
    
    // 디버깅용 주석 (필요시 활성화)
    // echo "보험료: " . $Preminum . "<br>";
    // echo "이전 보험료: " . $oldPreminum . "<br>";
    // echo "업데이트 SQL: " . $sql2 . "<br>";
    // echo "삭제 SQL: " . $sql3 . "<br>";
}
?>