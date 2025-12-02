<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include '../cors.php';
include '../db_connection.php'; // DB 연결 파일 포함

// DB 연결
$connect = connect_db();
// ⭐⭐⭐ 이 두 줄을 추가하세요 ⭐⭐⭐
mysqli_query($connect, "SET sql_mode = (SELECT REPLACE(@@sql_mode,'STRICT_TRANS_TABLES',''))");
mysqli_query($connect, "SET sql_mode = (SELECT REPLACE(@@sql_mode,'STRICT_ALL_TABLES',''))");
header('Content-Type: application/json; charset=UTF-8'); // JSON 응답 설정
$response = array();

try {
    if (isset($_GET['id'])) {
        $num = intval($_GET['id']);
        
        // Prepared statement 사용으로 SQL 인젝션 방지
        $stmt = mysqli_prepare($connect, "SELECT * FROM questionnaire WHERE num = ?");
        if (!$stmt) {
            throw new Exception("Prepare statement 오류: " . mysqli_error($connect));
        }
        
        mysqli_stmt_bind_param($stmt, "i", $num);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        if ($result && mysqli_num_rows($result) > 0) {
            $row = mysqli_fetch_assoc($result);
            $response['success'] = true;
            
            // preminum.php 파일 포함 및 처리
            $preminum_file = "../../php/preminum.php";
            if (file_exists($preminum_file)) {
                include $preminum_file;
                
                // 변수 존재 확인 후 처리
                if (isset($pRow) && isset($Preminum)) {
                    if (isset($pRow['daein'])) {
                        $daeinP = round($pRow['daein'] * $Preminum / 100, -2);
                        $response['daeinP'] = number_format($daeinP);
                    } else {
                        $response['daeinP'] = '0';
                    }
                    
                    if (isset($pRow['daemool'])) {
                        $daemoolP = round($pRow['daemool'] * $Preminum / 100, -2);
                        $response['daemoolP'] = number_format($daemoolP);
                    } else {
                        $response['daemoolP'] = '0';
                    }
                } else {
                    $response['daeinP'] = '0';
                    $response['daemoolP'] = '0';
                    $response['warning'] = 'preminum.php에서 필요한 변수를 찾을 수 없습니다.';
                }
            } else {
                $response['daeinP'] = '0';
                $response['daemoolP'] = '0';
                $response['warning'] = 'preminum.php 파일을 찾을 수 없습니다.';
            }
            
            // preiminum 값 처리 (배열 키 수정)
            if (isset($row['preiminum'])) {
                $response['preiminum'] = number_format($row['preiminum']);
            } else {
                $response['preiminum'] = '0';
            }
            
            // 전 증권의 설계번호를 찾기 위해 
            if (isset($row['school2'])) {
                $school2 = mysqli_real_escape_string($connect, $row['school2']); // 안전하게 이스케이프 처리
                
                $stmt2 = mysqli_prepare($connect, "SELECT * FROM questionnaire WHERE school2 = ? AND ch = 6");
                if ($stmt2) {
                    mysqli_stmt_bind_param($stmt2, "s", $school2);
                    mysqli_stmt_execute($stmt2);
                    $result2 = mysqli_stmt_get_result($stmt2);
                    
                    if ($result2 && mysqli_num_rows($result2) > 0) {
                        $row2 = mysqli_fetch_assoc($result2);
                        if (isset($row2['gabunho']) && $row2['gabunho']) {
                            $response['beforeGabunho'] = $row2['gabunho']; // 전 증권의 설계번호를 찾기 위해 
                        } else {
                            $response['beforeGabunho'] = '';
                        }
                    } else {
                        $response['beforeGabunho'] = '';
                    }
                    mysqli_stmt_close($stmt2);
                } else {
                    $response['beforeGabunho'] = '';
                    $response['warning2'] = "두 번째 쿼리 준비 중 오류 발생: " . mysqli_error($connect);
                }
            } else {
                $response['beforeGabunho'] = '';
            }
            
            /* questionnaire TABLE cNum 값이 없는 경우
                // 등록된 고객사 id 즉 2014Costmer TABLE num 값이 없다 매칭 하기 위함 작업을 함
                school5(이메일) // 2014Costmer 에 신청한 이메일로 등록된 아이디가 있는지 조회하여 
                2014Costmer TABLE cNum 값을 questionnaire TABLE cNum업데이트 한다
            */
            if (!isset($row['cNum']) || !$row['cNum']) { 
                $idJongLi_file = "../../php/idJongLi.php";
                if (file_exists($idJongLi_file)) {
                    include $idJongLi_file;
                } else {
                    $response['warning3'] = 'idJongLi.php 파일을 찾을 수 없습니다.';
                }
                
                // 초기값 설정
                $response['cardnum'] = '';
                $response['yymm'] = '';
                $response['cardap'] = '';
                $response['damdanga'] = '';
                $response['damdangat'] = '';
                $response['bank'] = '';
                $response['bankname'] = '';
                
            } else {
                // 카드번호, 유효기간, 담당자, 담당자 연락처 등을 가져오기
                $cStmt = mysqli_prepare($connect, "SELECT * FROM `2014Costmer` WHERE num = ?");
                if ($cStmt) {
                    mysqli_stmt_bind_param($cStmt, "s", $row['cNum']);
                    mysqli_stmt_execute($cStmt);
                    $cresult2 = mysqli_stmt_get_result($cStmt);
                    
                    if ($cresult2 && mysqli_num_rows($cresult2) > 0) {
                        $row3 = mysqli_fetch_assoc($cresult2);
                        
                        $response['cardnum'] = isset($row3['cardnum']) ? $row3['cardnum'] : '';                    // 카드번호
                        $response['yymm'] = isset($row3['yymm']) ? $row3['yymm'] : '';                           // 유효기간
                        $response['cardap'] = isset($row3['cardap']) ? $row3['cardap'] : '';                     // 승인번호
                        $response['damdanga'] = isset($row3['damdanga']) ? $row3['damdanga'] : '';               // 담당자
                        $response['damdangat'] = isset($row3['damdangat']) ? $row3['damdangat'] : '';             // 담당자전화번호
                        $response['bank'] = isset($row3['bank']) ? $row3['bank'] : '';                           // 계좌번호
                        $response['bankname'] = isset($row3['bankname']) ? $row3['bankname'] : '';               // 은행명
                    } else {    
                        // 데이터가 없는 경우 빈 값으로 설정
                        $response['cardnum'] = '';
                        $response['yymm'] = '';
                        $response['cardap'] = '';
                        $response['damdanga'] = '';
                        $response['damdangat'] = '';
                        $response['bank'] = '';
                        $response['bankname'] = '';
                        $response['warning4'] = '2014Costmer 테이블에서 해당 데이터를 찾을 수 없습니다.';
                    }
                    mysqli_stmt_close($cStmt);
                } else {    
                    $response['cardnum'] = '';
                    $response['yymm'] = '';
                    $response['cardap'] = '';
                    $response['damdanga'] = '';
                    $response['damdangat'] = '';
                    $response['bank'] = '';
                    $response['bankname'] = '';
                    $response['error_detail'] = "2014Costmer 쿼리 준비 중 오류 발생: " . mysqli_error($connect);
                }
            }
            
            $response['data'] = $row; // 전체 row를 JSON으로 반환
            
        } else {
            $response['success'] = false;
            $response['error'] = '데이터를 찾을 수 없습니다.';
        }
        
        mysqli_stmt_close($stmt);
        
    } else {
        $response['success'] = false;
        $response['error'] = '잘못된 요청입니다. ID 파라미터가 필요합니다.';
    }
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = '서버 오류: ' . $e->getMessage();
} catch (Error $e) {
    $response['success'] = false;
    $response['error'] = '치명적 오류: ' . $e->getMessage();
}

// 데이터베이스 연결 종료
if (isset($connect)) {
    mysqli_close($connect);
}

// JSON 형식으로 응답
echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>