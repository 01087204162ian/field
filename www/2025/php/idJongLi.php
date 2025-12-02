<?php
/* questionnaire TABLE cNum 값이 없는 경우
    school5(이메일) // 2014Costmer 에 신청한 이메일로 등록된 아이디가 있는지 조회하여 
    2014Costmer TABLE cNum 값을 questionnaire TABLE cNum업데이트 한다
*/

if (isset($row['school5']) && !empty($row['school5'])) {
    $school5 = mysqli_real_escape_string($connect, $row['school5']);
    
    // 1단계: 이메일로 기존 고객 조회 (정확히 일치하는 이메일)
    $stmt3 = mysqli_prepare($connect, "SELECT * FROM `2014Costmer` WHERE `idmail` = ? ORDER BY `num` DESC LIMIT 1");
    if ($stmt3) {
        mysqli_stmt_bind_param($stmt3, "s", $school5);
        mysqli_stmt_execute($stmt3);
        $result3 = mysqli_stmt_get_result($stmt3);
        
        if ($result3 && mysqli_num_rows($result3) > 0) {
            // 기존 고객이 있는 경우 - questionnaire 테이블의 cNum 업데이트
            $row3 = mysqli_fetch_assoc($result3);
            $cNum = $row3['num'];
            
            $updateStmt = mysqli_prepare($connect, "UPDATE `questionnaire` SET `cNum` = ? WHERE num = ?");
            if ($updateStmt) {
                mysqli_stmt_bind_param($updateStmt, "ii", $cNum, $num);
                if (mysqli_stmt_execute($updateStmt)) {
                    $row['cNum'] = $cNum; // 응답 데이터에 반영
                    $response['debug_info'] = "기존 고객 연결 완료: cNum = $cNum";
                } else {
                    $response['warning_update'] = "questionnaire 테이블 업데이트 실패: " . mysqli_error($connect);
                }
                mysqli_stmt_close($updateStmt);
            }
        } else {
            // 기존 고객이 없는 경우 - 새 고객 등록
            $parts = explode('@', $school5);
            $baseId = isset($parts[0]) ? $parts[0] : '';
            
            if (!empty($baseId)) {
                $baseId = mysqli_real_escape_string($connect, $baseId);
                
                // 중복되지 않는 mem_id 생성 함수
                function generateUniqueMemId($connect, $baseId) {
                    $uniqueId = $baseId;
                    $counter = 1;
                    
                    while (true) {
                        $checkStmt = mysqli_prepare($connect, "SELECT COUNT(*) as count FROM `2014Costmer` WHERE `mem_id` = ?");
                        if ($checkStmt) {
                            mysqli_stmt_bind_param($checkStmt, "s", $uniqueId);
                            mysqli_stmt_execute($checkStmt);
                            $checkResult = mysqli_stmt_get_result($checkStmt);
                            $countRow = mysqli_fetch_assoc($checkResult);
                            mysqli_stmt_close($checkStmt);
                            
                            if ($countRow['count'] == 0) {
                                // 중복이 없으면 사용 가능한 ID
                                return $uniqueId;
                            } else {
                                // 중복이 있으면 숫자를 붙여서 다시 시도
                                $uniqueId = $baseId . $counter;
                                $counter++;
                            }
                        } else {
                            // 에러가 발생하면 기본값에 타임스탬프 추가
                            return $baseId . time();
                        }
                        
                        // 무한루프 방지 (최대 100번 시도)
                        if ($counter > 100) {
                            return $baseId . time();
                        }
                    }
                }
                
                // 고유한 mem_id 생성
                $uniqueMemId = generateUniqueMemId($connect, $baseId);
                
                // 새 고객 등록
                $phone = isset($row['school4']) ? $row['school4'] : '';
                $schoolName = isset($row['school1']) ? $row['school1'] : '';
                
                if (!empty($phone) && !empty($schoolName)) {
                    // 비밀번호 생성 (연락처에서)
                    $phoneParts = explode('-', $phone);
                    $passwd = '';
                    if (count($phoneParts) >= 3) {
                        $passwd = md5($phoneParts[1] . $phoneParts[2]);
                    } else {
                        // 하이픈이 없는 경우 뒤 8자리 사용
                        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
                        if (strlen($cleanPhone) >= 8) {
                            $passwd = md5(substr($cleanPhone, -8));
                        } else {
                            $passwd = md5($cleanPhone);
                        }
                    }
                    
                    $schoolName = mysqli_real_escape_string($connect, $schoolName);
                    $passwd = mysqli_real_escape_string($connect, $passwd);
                    
                    // 새 고객 등록 (모든 필수 필드 포함)
                    $insertStmt = mysqli_prepare($connect, "INSERT INTO `2014Costmer` (`schoolName`, `mem_id`, `passwd`, `idmail`, `cardnum`, `yymm`, `cardap`, `damdanga`, `damdangat`, `bank`, `bankname`, `wdate`) VALUES (?, ?, ?, ?, '', '', '', '', '', '', '', now())");
                    if ($insertStmt) {
                        mysqli_stmt_bind_param($insertStmt, "ssss", $schoolName, $uniqueMemId, $passwd, $school5);
                        
                        if (mysqli_stmt_execute($insertStmt)) {
                            $insertedId = mysqli_insert_id($connect);
                            
                            // questionnaire 테이블의 cNum 업데이트
                            $updateStmt2 = mysqli_prepare($connect, "UPDATE `questionnaire` SET `cNum` = ? WHERE num = ?");
                            if ($updateStmt2) {
                                mysqli_stmt_bind_param($updateStmt2, "ii", $insertedId, $num);
                                if (mysqli_stmt_execute($updateStmt2)) {
                                    $row['cNum'] = $insertedId;
                                    $response['debug_info'] = "신규 고객 등록 완료: cNum = $insertedId, mem_id = $uniqueMemId (원래: $baseId)";
                                    
                                    // 이메일 발송 준비
                                    $idnum = $insertedId;
                                    $row2 = array();
                                    $row2['school5'] = $school5; // 이메일 주소
                                    $row2['school4'] = $phone;   // 핸드폰번호
                                    
                                    // 이메일 발송에 사용할 변수들 설정
                                    $iRow = array();
                                    $iRow['mem_id'] = $uniqueMemId; // 생성된 고유 아이디
                                    
                                    // 이메일 발송 파일 포함
                                    $email_file = "../php/email_id2.php";
                                    if (file_exists($email_file)) {
                                        include $email_file;
                                        $response['email_sent'] = "이메일 발송 시도 완료 (ID: $uniqueMemId)";
                                    } else {
                                        $response['warning_email'] = "이메일 발송 파일을 찾을 수 없습니다.";
                                    }
                                } else {
                                    $response['warning_update2'] = "questionnaire 테이블 업데이트 실패: " . mysqli_error($connect);
                                }
                                mysqli_stmt_close($updateStmt2);
                            }
                        } else {
                            $response['warning_insert'] = "새 고객 등록 실패: " . mysqli_error($connect);
                        }
                        mysqli_stmt_close($insertStmt);
                    }
                } else {
                    $response['warning_data'] = "필수 데이터(학교명 또는 연락처)가 누락되었습니다.";
                }
            } else {
                $response['warning_email_format'] = "이메일 형식이 올바르지 않습니다.";
            }
        }
        mysqli_stmt_close($stmt3);
    } else {
        $response['warning_prepare'] = "쿼리 준비 실패: " . mysqli_error($connect);
    }
} else {
    $response['warning_no_email'] = "school5(이메일) 데이터가 없습니다.";
}
?>