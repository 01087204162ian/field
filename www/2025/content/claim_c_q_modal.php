<!-- 
1. 클레임 버튼 (questions.php)
	- 클릭 시: 
		$('#third-modal').fadeIn(); 실행 (JS 파일: lincModal.js)
	- 백엔드 요청:
		url: '_db/get_questionnaire_details.php'
	- 동작 방식:
		questionnaire 테이블에서 num 값을 이용하여 계약자 정보를 호출
		클레임 관련 정보를 저장 및 업데이트
2. 번호 클릭 (claimList2.php)
	- 클릭 시: 
		$('#third-modal').fadeIn(); 실행 (JS 파일: c_q_modal.js)
	- 백엔드 요청: 
		url: '_db/claim/get_claim_details.php'
	- 동작 방식:
		claim 테이블의 num 값을 이용하여 클레임 정보를 호출
		questionnaire 테이블의 certi 값을 참조하여 계약자 번호를 가져옴
3. 클레임 저장 (claimStore 버튼)
	- 클릭 시: 
		클레임 정보 저장 (claimEtc.js) 
		 questions.php 저장은 cNum 저장 또는 업데이트 가능
		 claimList2.php 업데이트 
-->
<div id="third-modal" class="modal">
    <div class="modal-content">
        
        <div id="second-modal-body">
            <input type='hidden' id='claimNum__'><!-- claim Table ㅜㅕㅡ -->
			<input type='hidden' id='questionNum__'><!-- questionnaire Table num -->
            <input type='hidden' id='userName__' value='<?=$userName?>'>
			<input type='hidden' id='cNum__'><!-- 2014Costmer Table num -->
            <!-- 두 번째 모달 내용 -->
            <div style="display: flex; align-items: center; line-height: 1.5;">
				 증권번호 : <span id="certi__" style="margin-left: 5px; display: inline-block;"></span>
				<!--<div class="button-group">
				<select id="noticeSelect" class="btn-primary">
				   <option value="-1">공지사항</option>
					<option value="1">[보험금 청구] 보험금 청구시 필요서류 안내</option>
					<option value="2">[이용안내문] 한화 현장실습 보험 이용 안내문</option>
					<option value="3">[무사고 확인서 메일]</option>
				</select>-->
			</div>
            </div>
            <table class="file-table">
                <tr> 
                    <th width='20%'>사업자번호</th>
                    <td width='30%'><span id='school_2_'></span></td>
                    <th width='20%'>계약자</th>
                    <td width='30%'><span id='school_1_'></span></td>
					
                    
                </tr>
                <tr> 
                    <th>주소</th>
                    <td colspan='3'><span id='school_3_'></span></td>
                </tr>

                <tr> 
                    <th>시기</th>
                    <td><span id='school_6_'></span></td>
                    <th>실습기간</th>
                    <td><span id='school_7_'></span>~<span id='school_8_'></span></th>
				</tr>
					<th>연락처</th>
                    <td><span id='school_4_'></span></td>
					<th>이메일</th>
                    <td><span id='school_5_'></span></td>
                </tr>
                <tr> 
                    <th>가입유형</th>
                    <td colspan='3'><span id='school_9_'></span> 대인대물 한도<span id='daein1__'></span> 산재초과 대인대물<span id='daein2__'></span></td>
                </tr>
				 <tr >

					<td  class='btd' colspan='4'><button type="button" id="claimStore" class="styled-button">클레임저장</button></td>
				</tr>
				 <tr>
                    <th>학생</th>
                    <td ><input type="text" id="student" class="styled-input" placeholder="학생명을 입력하세요" /></td>
					<td  colspan='2'></td>
				</tr>
                <tr>
                    <th>사고일자</th>
                    <td  >
                        <input type="text" id="wdate_3" class="styled-input" placeholder="사고일자 입력하세요" />
                    </td>
                    <th>사고접수번호</th>
                    <td  >
                        <input type="text" id="claimNumber" class="styled-input" placeholder="사고 접수번호를 입력하세요" />
                    </td>
					
                </tr>
			
               
				<tr>
					<th>보험금지급일</th>
                    <td ><input type="text" id="wdate_2" class="styled-input" placeholder="보험금 지급일 입력하세요" /></td>
                    <th >보험금</th>
                    <td ><input type="text" id="claimAmout" class="styled-input right-align" placeholder="보험금" /></td>
                </tr>
               
				 <tr>
                    <th >사고경위</th>
                    <td colspan='3'><textarea id="accidentDescription" class="styled-input" placeholder="사고경위를 입력하세요" rows="4" maxlength="500"></textarea></td>
                </tr>
                <tr>
                    <th >담당자</th>
                    <td ><input type="text" id="damdanga_" class="styled-input" placeholder="담당자 이름을 입력하세요" /></td>
                    <th>연락처</th>
                    <td ><input type="text" id="damdangat_" class="styled-input" placeholder="숫자만 입력하세요" /></td>
                </tr>
            </table>

            <!-- 추가 버튼 -->
			
        </div>
    </div>
</div>
