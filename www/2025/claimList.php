<?php
include './php/session.php'; // 세션 확인 및 사용자 정보 로드
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>현장실습보험</title>
    <link rel="stylesheet" href="./style/styles.css">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
   
	<script src="./js/menu.js" defer></script>
	<script src="./js/google.js" defer></script>
	
</head>
<body>
<!-- 상단 바 -->

<? include "./str/top.php"?>
<!-- 콘텐츠 영역 -->
<div class="content">
    <!-- 좌측 메뉴 -->
    <? include "./str/left.php"?>

    <!-- 메인 콘텐츠 -->
    <div class="main-content">
       
       <? include "./content/claim_content.php"?>

    </div>
</div>
</body>
<? include "./content/q_modal.php";?>
    
</html>
