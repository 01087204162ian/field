<?php
include '../cors.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include '../db_connection.php'; // DB 연결 파일 포함

    // 응답 헤더 설정 (UTF-8)
    header('Content-Type: application/json; charset=UTF-8');

    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/static/user/';
    
    // 업로드 폴더 생성 (존재하지 않을 경우)
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $file = isset($_FILES['file']) ? $_FILES['file'] : null;
    $fileType = isset($_POST['fileType']) ? $_POST['fileType'] : '';
    $qnum = isset($_POST['qNum']) ? $_POST['qNum'] : '';
    $title = isset($_POST['qNum']) ? $_POST['qNum'] : '';
    $designNumber = isset($_POST['designNumber']) ? $_POST['designNumber'] : null;
    $certificateNumber = isset($_POST['certificateNumber']) ? $_POST['certificateNumber'] : null;
    $userName = isset($_POST['userName']) ? $_POST['userName'] : null;

    if ($file && $file['error'] === UPLOAD_ERR_OK) {
        $filename = basename($file['name']);
        $targetFile = $uploadDir . $filename;
        $url = '/static/user/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetFile)) {
            $connect = connect_db();

            // 파일 정보 삽입 (deleteIs 필드 포함)
            $sql = "INSERT INTO image (description2, qnum, kind, title, wdate, deleteIs) 
                    VALUES (?, ?, ?, ?, NOW(), '1')";
            $stmt = mysqli_prepare($connect, $sql);

            if ($stmt) {
                mysqli_stmt_bind_param($stmt, 'ssss', $url, $qnum, $fileType, $title);

                if (mysqli_stmt_execute($stmt)) {
                    // 추가 업데이트 처리 (청약서 및 증권 업로드 시)
                    // 추가 업데이트 처리 (청약서 및 증권 업로드 시)
                        if ($fileType == '4' && $designNumber) {
                            // 청약서: 설계번호 + 담당자(manager) 업데이트
                            $updateSql = "UPDATE questionnaire 
                                          SET gabunho = ?, ch = '3', wdate_3 = NOW(), manager = ?
                                          WHERE num = ?";
                            $updateStmt = mysqli_prepare($connect, $updateSql);
                            $to = 2;
                            $num = $qnum;
                            
                            // ✅ 추가: 청약서 이메일 발송 로그
                            error_log("=== 청약서 이메일 발송 시작 ===");
                            error_log("to: $to, num: $num");
                            
                            include "../../php/email_simsa.php";  // 청약서 발송 메일
                            
                            error_log("=== 청약서 이메일 발송 완료 ===");
                            
                            if ($updateStmt) {
                                mysqli_stmt_bind_param($updateStmt, 'sss', $designNumber, $userName, $qnum);
                                mysqli_stmt_execute($updateStmt);
                                mysqli_stmt_close($updateStmt);
                            }
                        } elseif ($fileType == '7' && $certificateNumber) {
                            // 증권: 증권번호 + 담당자(manager) 업데이트
                            $updateSql = "UPDATE questionnaire 
                                          SET certi = ?, ch = '6', wdate_3 = NOW(), manager = ?
                                          WHERE num = ?";
                            $updateStmt = mysqli_prepare($connect, $updateSql);
                            $to = 3;
                            $num = $qnum;
                            
                            // ✅ 추가: 증권 이메일 발송 로그
                            error_log("=== 증권 이메일 발송 시작 ===");
                            error_log("to: $to, num: $num");
                            error_log("target email: insokkibs@gmail.com (확인됨)");
                            
                            // ✅ 추가: email_simsa.php 파일 존재 확인
                            $email_file = "../../php/email_simsa.php";
                            if (file_exists($email_file)) {
                                error_log("✅ email_simsa.php 파일 존재함");
                                include $email_file; // 증권 발송 메일
                                error_log("✅ email_simsa.php include 완료");
                            } else {
                                error_log("❌ email_simsa.php 파일이 존재하지 않음: $email_file");
                            }
                            
                            error_log("=== 증권 이메일 발송 완료 ===");
                            
                            if ($updateStmt) {
                                mysqli_stmt_bind_param($updateStmt, 'sss', $certificateNumber, $userName, $qnum);
                                mysqli_stmt_execute($updateStmt);
                                mysqli_stmt_close($updateStmt);
                            }
                        }

                    echo json_encode(['status' => 'success', 'message' => '파일 업로드 및 데이터 업데이트 성공'], JSON_UNESCAPED_UNICODE);
                } else {
                    echo json_encode(['status' => 'error', 'message' => '파일 업로드 성공, 데이터 삽입 실패: ' . mysqli_stmt_error($stmt)], JSON_UNESCAPED_UNICODE);
                }

                mysqli_stmt_close($stmt);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'SQL 준비 실패: ' . mysqli_error($connect)], JSON_UNESCAPED_UNICODE);
            }

            mysqli_close($connect);
        } else {
            echo json_encode(['status' => 'error', 'message' => '파일 업로드 실패'], JSON_UNESCAPED_UNICODE);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => '파일 업로드 중 오류 발생: ' . ($file ? $file['error'] : '파일이 존재하지 않습니다.')], JSON_UNESCAPED_UNICODE);
    }
} else {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(['status' => 'error', 'message' => '잘못된 요청입니다.'], JSON_UNESCAPED_UNICODE);
}
?>