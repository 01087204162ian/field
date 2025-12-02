<?php
session_start();
if (!isset($_SESSION['dnum']) || $_SESSION['user_level'] != 5) {
    // 관리자 권한 확인
    header("Location: login.php");
    exit();
}

// 로그인한 대상자의 이름 가져오기
$userName = $_SESSION['userName'];
// 현재 페이지 URL을 가져옴
$current_page = basename($_SERVER['PHP_SELF']);


?>