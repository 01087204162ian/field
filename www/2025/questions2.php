<?php
include './php/session.php'; // 세션 확인 및 사용자 정보 로드
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>질문서 관리</title>
    <link rel="stylesheet" href="./style/styles.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="./js/script.js" defer></script>
</head>
<body>
    <!-- 상단 바 -->
    <div class="top-bar">
        <div>환영합니다, <strong><?= htmlspecialchars($userName) ?></strong>님</div>
        <form action="logout.php" method="POST">
            <button type="submit" class="logout-btn">로그아웃</button>
        </form>
    </div>

    <!-- 상단 메뉴 -->
    <div class="menu">
        <a href="#" class="menu-item active" data-section="현장실습보험">현장실습보험</a>
        <a href="#" class="menu-item" data-section="kj대리">KJ대리</a>
        <a href="#" class="menu-item" data-section="das대리">DAS대리</a>
        <a href="#" class="menu-item" data-section="약국">약국</a>
        <a href="#" class="menu-item" data-section="여행자배상책임">여행자배상책임</a>
    </div>

    <!-- 좌측 메뉴 및 콘텐츠 -->
    <div class="content">
        <div class="sidebar">
            <ul id="left-menu"></ul>
        </div>
        <div class="main-content">
            <table id="questionnaire-table">
                <thead>
                    <tr>
                        <th>순번</th>
                        <th>사업자번호</th>
                        <th>계약자</th>
                        <th>총 주수</th>
                        <th>연락처</th>
                        <th>등록일</th>
                        <th>증권번호</th>
                        <th>보험료</th>
                        <th>보험사</th>
                        <th>상태</th>
                        <th>이메일</th>
                        <th>메모</th>
                        <th>담당자</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <div class="pagination"></div>
        </div>
    </div>

    <!-- 모달 -->
  

	 <div id="modal" class="modal">
        <div class="modal-content">
            <button class="close-modal">X</button>
            <div id="modal-body">
                <!-- 계약자 정보 -->
				<input type='hidden' id='questionwareNum'><!--questonware-->
				<input type='hidden' id='school9'>
				<input type='hidden' id='inscompany'>
                <h5>1. 계약자 정보</h5>
                <table>
                    <tr>
                        <th>사업자번호</th>
                        <td><input class='etc-input' type="text" id="school2" ></td>
                        <th>계약자</th>
                        <td><input class='etc-input' type="text" id="school1" ></td>
                    </tr>
                    <tr>
                        <th>주소</th>
                        <td colspan="3"><textarea class='etc-input'  id="school3" rows="2" ></textarea></td>
                    </tr>
                    <tr>
                        <th>연락처</th>
                        <td><input class='etc-input'  type="text" id="school4" ></td>
                        <th>이메일</th>
                        <td><input class='etc-input'  type="text" id="school5" ></td>
                    </tr>
                </table>

                <!-- 현장실습 관련 사항 -->
                <h5>2. 현장실습 관련 사항</h5>
				<table class="info-table">
					<tr>
						<th>현장실습시기</th>
						<td >
						   <div class="radio-group">
								<label class="radio-label"><input type="radio" name="school6" value="1"> 1학기</label>
								<label class="radio-label"><input type="radio" name="school6" value="2"> 하계계절</label>
								<label class="radio-label"><input type="radio" name="school6" value="3"> 2학기</label>
								<label class="radio-label"><input type="radio" name="school6" value="4"> 동계계절</label>
							</div>

						</td>
					</tr>
					<tr>
						<th>실습기간(보험기간)</th>
						<td>
							<input type="text" id="school7" class="date-input etc-input" placeholder="보험시작일" > ~ 
							<input type="text" id="school8" class="date-input etc-input" placeholder="보험종료일" >
						</td>
					</tr>
				</table>
				<h5>3. 가입유형</h5>
				<table >

				  <tr>
					<th width='25%' rowspan='2'>보장내용</th>
					
					<th width='75%' colspan='2'>가입유형선택</th>
				  </tr>
					<tr>
					 <th><div class="radio-group"><label class="radio-label"><input type="radio" class='plan' name='plan' value="1"> PLAN A</label></div></th>
					
					<th><div class="radio-group"><label class="radio-label"><input type="radio" class='plan' name='plan' value="2"> PLAN B</label></div></th>
				  </tr>
				   <tr>
					<th>대인 및 대물 보상 </th>
					<td>1사고당 <span id='daein1'></span>억원</td><!--2-->
					<td>1사고당 <span id='daein2'></span>억원</td><!--3-->
				  </tr>
				   <tr>
					<th>산재보험 초과 <br>사용자배상 </th>
					<td>1사고당 <span id='daein3'></span>억원</td><!--2-->
					<td>1사고당 <span id='daein4'></span>억원</td><!--3-->
				  </tr>
				  <tr>
					<th>배상책임 자기부담금 </th>
					<td>1십만원</td>
					<td>1십만원</td>
				  </tr>
				  <tr>
					<th>실습 중 치료비 </th>
					<td>1인당 및 1사고당 : 1천만원</td>
					<td>1인당 및 1사고당 : 1천만원</td>
				  </tr>

				</table>
                <!-- 참여인원 -->
                <h5>4. 실습기간 별 참여인원</h5>
                <table>
                    <tr>
                        <th>실습기간</th>
                        <th>참여인원</th>
                        <th>실습기간</th>
                        <th>참여인원</th>
                    </tr>
                    <!-- 반복 생성된 주차와 참여인원 -->
                    <script>
                        for (let i = 4; i <= 14; i ++) {
							let j=i + 12;
							
                            document.write(`
                                <tr>
                                    <td class='walign'>${i}주</td>
                                    <td><input  type="text" class="week-input" id="week${i}" ></td>
                                    <td class='walign'>${j}주</td>
                                    <td ><input class="week-input" type="text" id="week${j}" ></td>
                                </tr>
                            `);
                        }
                    </script>

					<tr>
						<td class='walign'>15주</td>
						<td><input  type="text" class="week-input" id="week15" ></td>
						<td class='walign'>대인보험료 <span id='daein'></td>
						<td >대물보험료 <span id='daemool'></td>
					</tr>
					<tr>
					<td colspan='2'>총 참여인원 수 </td>
					<td><span id='week_total' >명</td>
					<td>보험료계 <span id='totalP'></td>
				  </tr>
				  <tr>
					<td colspan='4'><input type="submit"  id="write_" class="btn btn-primary" value="작성완료"/></td>
				  </tr>
                </table>
            </div>
        </div>
    </div>
    
	<!-- 두 번째 모달 -->
    <div id="second-modal" class="modal">
        <div class="modal-content">
            <button class="close-modal">X</button>
            <div id="second-modal-body">
                <input type='hidden' id='questionwareNum_'><!--questionware-->
				<input type='hidden' id='school9_'>
				<input type='hidden' id='inscompany_'>
				<input type='hidden' id='cNum_' /><!--아이디-->
				<input type='hidden' id='userName' value='<?=$userName?>'>
				 <!-- 두 번째 모달 내용 -->
				<div style="display: flex; align-items: center; justify-content: space-between;">
					<span id="beforegabunho"></span>
					<select id="mem-id-select" class="styled-select"></select>
				</div>
                <table>

					 <tr> 
						<td width='12%'>사업자번호</td>
						<td width='38%'><span id='school_2'></span></td>
						<td width='12%'>계약자</td>
						<td width='38%'><span id='school_1'></span></td>
					  </tr>
					 <tr> 
						<td>주소</td>
						<td colspan='3'><span id='school_3'></span></td>
					 </tr>
					  <tr> 
						<td>연락처</td>
						<td><span id='school_4'></span></td>
						<td>이메일</td>
						<td><span id='school_5'></span></td>
					  </tr>
					 <tr> 
						<td>시기</td>
						<td><span id='school_6'></span></td>
						<td>실습기간</td>
						<td><span id='school_7'></span>~<span id='school_8'></span></td>
					   </tr>
					   <tr> 
						<td>가입유형</td>
						<td colspan='3'><span id='school_9'></span>    대인대물 한도<span id='daein1_'></span>  산재초과 대인대물<span id='daein2_'></span></td>
					   </tr>
					    <td colspan='4'><span id='inwon'></span></td>
					   <tr> 
						<td colspan='4'>  대인보험료: <span id='daein_'></span> 대물보험료 : <span id='daemool_'></span>합계보험료 :<span id='totalP_'></span></td>
					   </tr>
					</table>
					<table class="styled-table">
					<tr>
						<td class="label-cell">가입 설계번호</td>
						<td colspan="2">
							<input type="text" id="gabunho-input" class="styled-input" placeholder="가입 설계번호를 입력하세요" />
						</td>
						<td>
							<button id="save-gabunho-btn" class="btn-primary">저장</button>
						</td>
					</tr>
				</table>
            </div>
        </div>
    </div>
    
</body>

<script src="./js/lincModal.js" defer></script>
</html>
