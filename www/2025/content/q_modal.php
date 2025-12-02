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
<!-- 두 번째 모달 -->
<div id="second-modal" class="modal">
    <div class="modal-content">
        <button class="close-modal">X</button>
        <div id="second-modal-body">
            <input type='hidden' id='questionwareNum_'><!-- questionware -->
            <input type='hidden' id='school9_'>
            <input type='hidden' id='inscompany_'>
            <input type='hidden' id='cNum_' /><!-- 아이디 -->
            <input type='hidden' id='userName' value='<?=$userName?>'>

            <!-- 두 번째 모달 내용 -->
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <span id="beforegabunho"></span>
                <select id="mem-id-select" class="styled-select"> </select>
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
                    <td colspan='3'><span id='school_9'></span> 대인대물 한도<span id='daein1_'></span> 산재초과 대인대물<span id='daein2_'></span></td>
                </tr>
                <tr> 
                    <td colspan='4'><span id='inwon'></span></td>
                </tr>
                <tr> 
                    <td colspan='4'>대인보험료: <span id='daein_'></span> 대물보험료 : <span id='daemool_'></span> 합계보험료 : <span id='totalP_'></span></td>
                </tr>
          
                <tr>
                    <td  class='s_td'>청약번호</td>
                    <td  >
                        <input type="text" id="gabunho-input" class="styled-input" placeholder="청약번호를 입력하세요" />
                    </td>
                    <td  class='s_td'>증권번호</td>
                    <td  >
                        <input type="text" id="certi_" class="styled-input" placeholder="증권번호를 입력하세요" />
                    </td>
                </tr>
                <tr>
                    <td class='s_td'>카드번호</td>
                    <td ><input type="text" id="card-number" class="styled-input" placeholder="카드번호를 입력하세요" /></td>
                    <td class='s_td'>유효기간</td>
                    <td ><input type="text" id="card-expiry" class="styled-input" placeholder="MM/YY" /></td>
                </tr>
                <tr>
                    <td class='s_td'>은행</td>
                    <td ><input type="text" id="bank-name" class="styled-input" placeholder="은행명을 입력하세요" /></td>
                    <td class='s_td'>은행계좌</td>
                    <td ><input type="text" id="bank-account" class="styled-input" placeholder="은행계좌를 입력하세요" /></td>
                </tr>
                <tr>
                    <td class='s_td'>담당자</td>
                    <td ><input type="text" id="damdanga" class="styled-input" placeholder="담당자 이름을 입력하세요" /></td>
                    <td class='s_td'>연락처</td>
                    <td ><input type="text" id="damdangat" class="styled-input" placeholder="담당자 연락처를 입력하세요" /></td>
                </tr>
            </table>

            <!-- 추가 버튼 -->
			<div class="button-group">
				<button id="print-questionnaire" class="btn-primary">질문서 프린트</button>
				<button id="print-application" class="btn-primary">청약서</button>
				<button id="send-id-email" class="btn-primary">아이디,비번초기화 메일</button>
				<button id="no-accident-check" class="btn-primary">무사고 확인서</button>
				<button id="send-guide" class="btn-primary">가입 안내문</button>
				
				<select id="noticeSelect" class="btn-primary">
				   <option value="-1">공지사항</option>
					<option value="1">[보험금 청구] 보험금 청구시 필요서류 안내</option>
					<option value="2">[이용안내문] 한화 현장실습 보험 이용 안내문</option>
					<option value="3">[무사고 확인서 메일]</option>
				</select>
			</div>
        </div>
    </div>
</div>




 <div id="sjModal" class="modal">
    <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
            <h4 class="modal-title">
                <span id="day__">일별 실적</span>
               
            </h4>
            <ul class="nav pull-right">
                <li>
				   <span id='year_'></span>
                </li>
                <li>  
				    <span id='month_'></span>
                    
                </li>
            </ul>
        </div>
			 <span id="dwonload__"></span>
        <!-- Modal Body -->
        <div id="day_list"></div>

        <!-- Modal Footer -->
        <div class="modal-footer">
            <span id="changeP"></span>
        </div>
    </div>
</div>

<div id="uploadModal" class="modal">
    <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
            <span id="cName">파일 업로드</span>
        </div>
        <input type="hidden" id="qNum" />

        <!-- Modal Body -->
        <form onsubmit="event.preventDefault(); uploadFile();">
            <div class="upload-container">
                <!-- 파일 타입 선택 -->
                <select class="u_select" name="fileType" id="fileType" onchange="toggleInputField()">
                    <option value="4" selected>청약서</option>
                    <option value="1">카드전표</option>
                    <option value="2">영수증</option>
                    <option value="7">보험증권</option>
                    <option value="5">과별인원현황</option>
                    <option value="6">보험사사업자등록증</option>
                    <option value="3">기타</option>
                </select>

                <!-- 동적 입력 필드 -->
                <div id="dynamicField">
                    <input type="text" id="dynamicInput" name="dynamicInput" placeholder="설계번호를 입력하세요" />
                </div>

                <!-- 파일 업로드 -->
                <input type="file" id="uploadedFile" name="uploadedFile" />

                <!-- 업로드 버튼 -->
                <button type="submit">업로드</button>
            </div>
        </form>

        <!-- 파일 목록 테이블 -->
        <div>
            <table class="file-table">
                <thead>
                    <tr>
                        <th>순번</th>
                        <th>파일의종류</th>
                        <th>(설계/증권)번호</th>
                        <th>파일명</th>
                        <th>입력일자</th>
                        <th>기타</th>
                    </tr>
                </thead>
                <tbody id="file_list"></tbody>
            </table>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">파일 업로드를 완료하세요.</div>
    </div>
</div>

