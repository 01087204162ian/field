<?php
session_start();

// 모든 세션 데이터 제거
session_unset();

// 세션 파괴
session_destroy();

// 로그인 페이지로 리디렉션
header("Location: ../login.php");
exit();
?>
