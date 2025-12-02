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
    






 <div id="sjModal" class="modal">
    <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
            <h4 class="modal-title">
              
				<span id='sjTitle'></span>
               
            </h4>
            <ul class="nav pull-right">
                <li>
					<div id="yearContainer"></div> <!-- 여기서 <select>를 동적으로 생성 -->
                </li>
                
            </ul>
        </div>

        <!-- Modal Body -->
		<div class="modal-body">
			<table id="claimTable">
				<thead>
					<tr>
						<th width='30%'>년 월</th>
						<th width='6%' >접수</th>
						<th width='6%' >미결</th>
						<th width='6%' >종결</th>
						<th width='6%' >면책</th>
						<th width='6%' >취소</th>
						<th width='6%' >계</th>
						<th width='13%' >종결 보험금 합계</th>
						<th width='13%' >보험료 합계</th>
						<th width='14%' >손해율</th>
					</tr>
				</thead>
				<tbody></tbody>
				<tfoot>
					<tr>
						<th>소계</th>
						<th id="totalReceived" class="right-align">0</th>
						<th id="totalPending" class="right-align">0</th>
						<th id="totalCompleted" class="right-align">0</th>
						<th id="totalExempted" class="right-align">0</th>
						<th id="totalCanceled" class="right-align">0</th>
						<th id="totalAll" class="right-align">0</th>
						<th id="totalClaimAmount" class="right-align">0</th>
						<th id="totalPremiumAmount" class="right-align">0</th> <!-- 보험료 합계 추가 -->
						<th id="totalLossRatio" class="right-align">0</th> <!-- 손해율 -->
					</tr>
				</tfoot>
			</table>



		</div>
        <!-- Modal Footer -->
        <div class="modal-footer">
           <span id='changeP'></span>
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
            <table id="file-table">
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

