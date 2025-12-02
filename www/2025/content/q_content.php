<div class="search-section">
		<!-- 좌측 검색 -->
		<div class="search-left">
			<div class="search-container">
				<div class="radio1-group">
					<label class="radio1-label">
						<input type="radio" name="search-mode" value="1" id="exact-search" checked>
						정확히 일치
					</label>
					<label class="radio1-label">
						<input type="radio" name="search-mode" value="2" id="contains-search">
						포함 검색
					</label>
					<input type="text" id="search-school" placeholder="학교명을 입력하세요">
					<button id="search-btn">검색</button>
				</div>
			</div>
		</div>

		<!-- 우측 버튼 -->
		<div class="button-group">
			<button class="btn btn-right" id="performance">실적</button>
			<button class="btn btn-right">버튼 2</button>
			<button class="btn btn-right">버튼 3</button>
		</div>
</div>

	<!-- 데이터 테이블 -->
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
				<th>업로드</th>
				<th>이메일</th>
				<th>클레임</th>
				<th>메모</th>
				<th>담당자</th>

			</tr>
		</thead>
		<tbody></tbody>
	</table>

	<!-- 페이지네이션 -->
	<div class="pagination"></div>