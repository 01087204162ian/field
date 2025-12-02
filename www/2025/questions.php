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
	<link rel="stylesheet" href="./style/upload.css">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"><!-- 날력-->
	<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script><!-- 날력-->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./js/question.js" defer></script>
	<script src="./js/menu.js" defer></script>
	
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
      
       <? include "./content/q_content.php"?>

    </div>
</div>
</body>
<? include "./content/q_modal.php";?>
<?  //클레임 조회 또는 등록
include "./content/claim_c_q_modal.php"; 
//include "./content/q_bottom.php"; 
?>
<script>
function toggleInputField() {  //파일 업로드 사용함
	const fileType = document.getElementById("fileType").value;
	const dynamicField = document.getElementById("dynamicField");
	const dynamicLabel = document.getElementById("dynamicLabel");
	const dynamicInput = document.getElementById("dynamicInput");

	if (fileType === "4") {
		// 청약서: 설계번호 입력
		dynamicField.style.display = "block";
		dynamicLabel.textContent = "설계번호 입력:";
		dynamicInput.placeholder = "설계번호를 입력하세요";
	} else if (fileType === "7") {
		// 보험증권: 증권번호 입력
		dynamicField.style.display = "block";
		dynamicLabel.textContent = "증권번호 입력:";
		dynamicInput.placeholder = "증권번호를 입력하세요";
	} else {
		// 다른 파일 타입 선택 시 동적 필드 숨김
		dynamicField.style.display = "none";
		dynamicInput.value = ""; // 입력 값 초기화
	}
}

</script>

    


<script src="./js/lincModal.js" defer></script>
<script src="./js/c_q_modal.js" defer></script> <!-- 클레임 조회 또는 수정 modal-->
<script src="./js/claimEtc.js" defer></script> <!-- 클레임 관련 modal-->
<script src="./js/performance.js" defer></script>
<script src="./js/upload.js" defer></script>

    
</html>
