<?php
// CORS 허용 설정
include '../cors.php';
include '../db_connection.php'; // DB 연결 파일 포함

$connect = connect_db();
header('Content-Type: application/json; charset=UTF-8');

$response = array();

try {
    // POST 요청만 허용
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('잘못된 요청 방식입니다. POST 요청만 허용됩니다.');
    }

    // 필수 파라미터 검증
    if (!isset($_POST['id']) || empty($_POST['id'])) {
        throw new Exception('ID가 누락되었습니다.');
    }

    // 입력 데이터 검증 및 정리
    $num = intval($_POST['id']);
    $school1 = isset($_POST['school1']) ? mysqli_real_escape_string($connect, trim($_POST['school1'])) : '';
    $school2 = isset($_POST['school2']) ? mysqli_real_escape_string($connect, trim($_POST['school2'])) : '';
    $school3 = isset($_POST['school3']) ? mysqli_real_escape_string($connect, trim($_POST['school3'])) : '';
    $school4 = isset($_POST['school4']) ? mysqli_real_escape_string($connect, trim($_POST['school4'])) : '';
    $school5 = isset($_POST['school5']) ? mysqli_real_escape_string($connect, trim($_POST['school5'])) : '';
    $school6 = isset($_POST['school6']) ? intval($_POST['school6']) : 0;
    $school7 = isset($_POST['school7']) ? mysqli_real_escape_string($connect, trim($_POST['school7'])) : '';
    $school8 = isset($_POST['school8']) ? mysqli_real_escape_string($connect, trim($_POST['school8'])) : '';
    $school9 = isset($_POST['plan']) ? intval($_POST['plan']) : 0;
    
    // 기존 보험료
    $oldPreminum = isset($_POST['totalP']) ? floatval(str_replace(',', '', $_POST['totalP'])) : 0;
    $inscompany = isset($_POST['inscompany']) ? intval($_POST['inscompany']) : 0;

    // 주차별 참여인원 데이터 처리
    $weeks = array();
    $total = 0;
    
    for ($i = 4; $i <= 26; $i++) {
        $weekValue = 0;
        if (isset($_POST["week$i"])) {
            // 콤마 제거 후 숫자로 변환
            $weekValue = intval(str_replace(',', '', $_POST["week$i"]));
        }
        $weeks["week$i"] = $weekValue;
        $total += $weekValue;
    }

    // 데이터베이스 트랜잭션 시작
    mysqli_autocommit($connect, false);

    // 업데이트 SQL 구성
    $updateQuery = "UPDATE questionnaire SET 
        school1 = '$school1',
        school2 = '$school2',
        school3 = '$school3',
        school4 = '$school4',
        school5 = '$school5',
        school6 = $school6,
        school7 = '$school7',
        school8 = '$school8',
        school9 = $school9,
        week_total = $total";

    // 주차별 데이터 추가
    foreach ($weeks as $week => $value) {
        $updateQuery .= ", $week = $value";
    }

    $updateQuery .= " WHERE num = $num";

    // 데이터베이스 업데이트 실행
    $result = mysqli_query($connect, $updateQuery);
    
    if (!$result) {
        throw new Exception('데이터베이스 업데이트 실패: ' . mysqli_error($connect));
    }

    // ===== 보험료 계산 시작 =====
    
    // 보험료 산출을 위한 기준 데이터 조회
    $pSql = "SELECT * FROM preiminum WHERE sigi <= '$school7' AND end >= '$school7'";
    $prs = mysqli_query($connect, $pSql);
    
    if (!$prs) {
        throw new Exception('보험료 기준 데이터 조회 실패: ' . mysqli_error($connect));
    }
    
    $pRow = mysqli_fetch_assoc($prs);
    
    if (!$pRow) {
        throw new Exception('해당 기간의 보험료 기준 데이터를 찾을 수 없습니다.');
    }

    // 플랜에 따른 보험료 계산
    $Preminum = 0;
    
    switch($school9) {
        case 1: // 플랜 A
            $Preminum = $weeks["week4"] * floatval($pRow['a1'])
                       + $weeks["week5"] * floatval($pRow['a2']) + $weeks["week6"] * floatval($pRow['a2']) 
                       + $weeks["week7"] * floatval($pRow['a2']) + $weeks["week8"] * floatval($pRow['a2'])
                       + $weeks["week9"] * floatval($pRow['a3']) + $weeks["week10"] * floatval($pRow['a3']) 
                       + $weeks["week11"] * floatval($pRow['a3']) + $weeks["week12"] * floatval($pRow['a3'])
                       + $weeks["week13"] * floatval($pRow['a4']) + $weeks["week14"] * floatval($pRow['a4']) 
                       + $weeks["week15"] * floatval($pRow['a4']) + $weeks["week16"] * floatval($pRow['a4'])
                       + $weeks["week17"] * floatval($pRow['a5']) + $weeks["week18"] * floatval($pRow['a5']) 
                       + $weeks["week19"] * floatval($pRow['a5']) + $weeks["week20"] * floatval($pRow['a5'])
                       + $weeks["week21"] * floatval($pRow['a6']) + $weeks["week22"] * floatval($pRow['a6']) 
                       + $weeks["week23"] * floatval($pRow['a6']) + $weeks["week24"] * floatval($pRow['a6'])
                       + $weeks["week25"] * floatval($pRow['a7']) + $weeks["week26"] * floatval($pRow['a7']);
            break;
            
        case 2: // 플랜 B
            $Preminum = $weeks["week4"] * floatval($pRow['b1'])
                       + $weeks["week5"] * floatval($pRow['b2']) + $weeks["week6"] * floatval($pRow['b2']) 
                       + $weeks["week7"] * floatval($pRow['b2']) + $weeks["week8"] * floatval($pRow['b2'])
                       + $weeks["week9"] * floatval($pRow['b3']) + $weeks["week10"] * floatval($pRow['b3']) 
                       + $weeks["week11"] * floatval($pRow['b3']) + $weeks["week12"] * floatval($pRow['b3'])
                       + $weeks["week13"] * floatval($pRow['b4']) + $weeks["week14"] * floatval($pRow['b4']) 
                       + $weeks["week15"] * floatval($pRow['b4']) + $weeks["week16"] * floatval($pRow['b4'])
                       + $weeks["week17"] * floatval($pRow['b5']) + $weeks["week18"] * floatval($pRow['b5']) 
                       + $weeks["week19"] * floatval($pRow['b5']) + $weeks["week20"] * floatval($pRow['b5'])
                       + $weeks["week21"] * floatval($pRow['b6']) + $weeks["week22"] * floatval($pRow['b6']) 
                       + $weeks["week23"] * floatval($pRow['b6']) + $weeks["week24"] * floatval($pRow['b6'])
                       + $weeks["week25"] * floatval($pRow['b7']) + $weeks["week26"] * floatval($pRow['b7']);
            break;
            
        default:
            $Preminum = 0;
            break;
    }

    // 보험료가 변경된 경우에만 업데이트 실행
    if ($oldPreminum != $Preminum) {
        
        // 보험회사별 처리 구분
        if ($inscompany == 2) { 
            // 메리츠화재: 가계약번호와 인수심사번호 모두 삭제
            $sql2 = "UPDATE questionnaire SET ch='2', preiminum='$Preminum', gabunho='', simbuho='' WHERE num='$num'";
        } else {
            // 기타 보험회사: 인수심사번호만 삭제
            $sql2 = "UPDATE questionnaire SET ch='2', preiminum='$Preminum', simbuho='' WHERE num='$num'";
        }
        
        // 업데이트 실행
        $result2 = mysqli_query($connect, $sql2);
        if (!$result2) {
            throw new Exception('보험료 업데이트 실패: ' . mysqli_error($connect));
        }
        
        // 관련 이미지 삭제 (kind='4'인 이미지)
        $sql3 = "DELETE FROM image WHERE qnum='$num' AND kind='4'";
        $result3 = mysqli_query($connect, $sql3);
        if (!$result3) {
            error_log("이미지 삭제 실패: " . mysqli_error($connect));
        }
    }

    // 보험료 관련 계산
    $daeinP = 0;
    $daemoolP = 0;
    
    if (isset($pRow['daein']) && isset($pRow['daemool'])) {
        // 대인 보험료 계산 (백원 단위로 반올림)
        $daeinP = round(floatval($pRow['daein']) * $Preminum / 100, -2);
        
        // 대물 보험료 계산 (백원 단위로 반올림)
        $daemoolP = round(floatval($pRow['daemool']) * $Preminum / 100, -2);
    }

    // 트랜잭션 커밋
    mysqli_commit($connect);
    
    // 성공 응답 데이터 구성
    $response['success'] = true;
    $response['message'] = '데이터가 성공적으로 업데이트되었습니다.';
    $response['data'] = array(
        'Preminum' => number_format($Preminum),
        'daeinP' => number_format($daeinP),
        'daemoolP' => number_format($daemoolP),
        'week_total' => number_format($total),
        'premium_changed' => ($oldPreminum != $Preminum),
        'plan' => $school9,
        'insurance_company' => $inscompany
    );

    // 디버깅 정보 (개발 환경에서만 사용)
    if (defined('DEBUG_MODE') && DEBUG_MODE) {
        $response['debug'] = array(
            'old_premium' => $oldPreminum,
            'new_premium' => $Preminum,
            'total_participants' => $total,
            'plan_type' => $school9 == 1 ? '플랜 A' : ($school9 == 2 ? '플랜 B' : '알 수 없음')
        );
    }

} catch (Exception $e) {
    // 트랜잭션 롤백
    if (isset($connect)) {
        mysqli_rollback($connect);
    }
    
    // 에러 응답
    $response['success'] = false;
    $response['error'] = $e->getMessage();
    
    // 에러 로그 기록
    error_log('보험료 계산 API 오류: ' . $e->getMessage());

} finally {
    // DB 연결 종료
    if (isset($connect)) {
        mysqli_autocommit($connect, true);
        
        // 결과셋 해제
        if (isset($prs)) {
            mysqli_free_result($prs);
        }
        
        mysqli_close($connect);
    }
}

// JSON 형식으로 응답 반환
echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>