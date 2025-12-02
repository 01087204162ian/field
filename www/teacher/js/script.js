// 보안 설정 (완화된 버전)
const SECURITY_CONFIG = {
    SESSION_TIMEOUT: 2 * 60 * 60 * 1000, // 2시간
    REFRESH_INTERVAL: 30 * 60 * 1000,    // 30분마다 세션 체크
    LOGIN_PAGE: 'index.html',
    ENABLE_DEV_TOOLS_BLOCK: false        // 개발자 도구 차단 비활성화
};

// 각 페이지별 콘텐츠 정의
const PAGE_CONTENT = {
    guide: {
        title: '📋 현장실습보험 안내문',
        content: `
            <div class="guide-header">
                <h1 class="guide-main-title">현장실습보험 안내문</h1>
            </div>

            <div class="guide-section">
                <h3>1. 상품개발 배경</h3>
                <div class="content-text">
                    교육부 고시 제 2016-89호 "현장실습 운영규정" 등에서 정하는 학생보호에 대한 규정을 지원하기 위해 본 상품 개발
                </div>
                <ul class="guide-list">
                    <li>학생의 현장실습 중 발생한 치료비를 보상</li>
                    <li>학생의 현장실습 중 과실로 인한 법률상의 배상책임 보상</li>
                    <li>실습기관의 과실로 현장실습중인 학생에 대한 법률상의 배상책임 보상</li>
                </ul>
            </div>

            <div class="guide-section">
                <h3>2. 상품의 특징</h3>
                <ul class="guide-list">
                    <li>보험가입 시 참여학생의 이름 및 주민번호 없이 보험가입가능</li>
                    <li>개인이 가입한 실손의료비와 무관하게 중복으로 치료비 지급, 보상한도 1천만원</li>
                    <li>현장실습 중 학생의 과실에 따른 배상책임, 실습기관의 배상책임을 교차하여 담보</li>
                    <li>보험계약자 - 대학교(고등학교)또는 대학교(고등학교) 산학협력팀 / 피보험자 - 참여학생 및 실습기관</li>
                </ul>
            </div>

            <div class="guide-section">
                <h3>3. ※ 왜 (산재사고) 사용자배상책임 보장이 필요한가?</h3>
                <div class="table-responsive">
                    <table class="guide-table">
                        <thead>
                            <tr>
                                <th>구분</th>
                                <th>산재보험</th>
                                <th>사용자배상책임보험</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="row-header">보험성격</td>
                                <td>산재보험</td>
                                <td>임의보험</td>
                            </tr>
                            <tr>
                                <td class="row-header">보장내용</td>
                                <td>과실여부와 상관없이 업무상의 재해보상</td>
                                <td>사용자의 과실에 의한 것으로 산재법상의 재해보상을 초과하는 민법상 손해배상</td>
                            </tr>
                            <tr>
                                <td class="row-header">성립요건</td>
                                <td>사용자의 무과실 책임</td>
                                <td>사용자의 고의 또는 과실책임</td>
                            </tr>
                            <tr>
                                <td class="row-header">보상범위</td>
                                <td>요양보상, 휴업보상, 장해보상, 유족보상, 장제비<br>(요양보상은 실손보상, 나머지는 평균임금의 일정부분을 지급)</td>
                                <td>보상한도 내에서 적극적손해, 소극적손해, 위자료로 구분하여 완전배상하며, 정신적•육체적 손해를 포함<br>예) 산재초과 상실 수익금, 향후치료비, 위자료, 소송비용</td>
                            </tr>
                            <tr>
                                <td class="row-header">상계처리</td>
                                <td>무과실책임</td>
                                <td>근로자와 사용자의 과실을 상계하며 지급받은 산재보험금을 공제함</td>
                            </tr>
                            <tr>
                                <td class="row-header">근거법령</td>
                                <td>산재보험법 및 근로기준법</td>
                                <td>민법 및 상법</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="guide-section">
                <h3>4. 상품의 구성</h3>
                <div class="table-responsive">
                    <table class="guide-table table-striped table-bordered">
                        <thead class="table-primary">
                            <tr>
                                <th rowspan="2" class="text-center align-middle">구분</th>
                                <th colspan="2" class="text-center">가입유형별 보상한도</th>
                            </tr>
                            <tr>
                                <th class="text-center">가입유형 A</th>
                                <th class="text-center">가입유형 B</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-center"><strong>(대인 및 대물) 배상책임</strong></td>
                                <td class="text-center">사고당 2억원</td>
                                <td class="text-center">사고당 3억원</td>
                            </tr>
                            <tr>
                                <td class="text-center"><strong>(산재보험 초과) 배상책임</strong></td>
                                <td class="text-center">사고당 2억원</td>
                                <td class="text-center">사고당 3억원</td>
                            </tr>
                            <tr>
                                <td class="text-center"><strong>(실습중) 치료비</strong></td>
                                <td class="text-center">1인당 1천만원</td>
                                <td class="text-center">1인당 1천만원</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-3">
                    <p class="text-primary mb-2"><strong>※ 보험 증권당 총 보상한도 10억원</strong></p>
                    <p class="text-danger"><strong>※ 배상책임 자기부담금 1사고당 10만원 / 치료비 자기부담금 없음</strong></p>
                </div>
            </div>

            <div class="guide-section">
                <h3>5. 보험료</h3>
                <div id="premium-loading" style="text-align: center; padding: 20px;">
                    <p>📡 보험료 데이터를 불러오는 중...</p>
                </div>
                <div id="premium-content"></div>
            </div>
        `
    },
    application: {
        title: '➕ 신규 신청',
        content: `
			 <div id="quote-page" style="padding-top: 20px;">
				<div class="container">
					<h2 class="section-title" id="quote-title">현장실습보험 견적의뢰</h2>
					
					<!-- 개선된 안내 메시지 -->
					<div class="guide-section">
						<div class="alert-enhanced">
							<h5 class="alert-heading-enhanced">
								<i class="fas fa-info-circle"></i>견적 신청 안내
							</h5>
							<p class="mb-2" style="color: #495057; font-size: 1.05rem; line-height: 1.7;">본 질문서는 보험료 산출을 위한 중요한 자료로 활용됩니다.</p>
							<p class="mb-0" style="color: #495057; font-size: 1.05rem; line-height: 1.7;">사실과 다를 경우 보험금 지급 시 영향을 미칠 수 있사오니 정확하게 작성해 주시기 바랍니다.</p>
						</div>
					</div>

					<!-- 개선된 폼 컨테이너 -->
					<div class="form-container">
						<div class="quote-form-enhanced">
							<form id="quoteForm">
								<!-- 1. 계약자 정보 -->
								<div class="form-section mb-5">
									<div class="form-section-header">
										<h4 id="contractor-header">
											<i class="fas fa-university" id="contractor-icon"></i>1. 계약자 정보 
											<small class="text-muted" id="contractor-subtitle">(대학교 또는 산학협력단)</small>
										</h4>
									</div>
									
									<div class="form-grid-enhanced">
										<!-- 사업자번호와 계약자명을 한 행에 -->
										<div class="form-row-inline">
											<div class="form-group">
												<label for="business_number">사업자번호 <span class="required-asterisk">*</span></label>
												<input type="text" class="form-control form-control-white" 
													   name="business_number" id="business_number"
													   placeholder="하이픈 없이 번호만 입력" maxlength="10" required>
											</div>
											<div class="form-group">
												<label for="institution_name">계약자 (대학교명) <span class="required-asterisk">*</span></label>
												<input type="text" class="form-control form-control-white" 
													   name="institution_name" id="institution_name"
													   placeholder="대학교명을 입력해주세요" required>
											</div>
										</div>

										<!-- 주소는 한 행에 -->
										<div class="form-row-single">
											<label for="address">주소 <span class="required-asterisk">*</span></label>
											<textarea class="form-control form-control-white" 
													  name="address" id="address"
													  placeholder="상세주소를 포함하여 입력해주세요" required rows="2"></textarea>
										</div>

										<!-- 연락처와 이메일을 한 행에 -->
										<div class="form-row-inline">
											<div class="form-group">
												<label for="phone">연락처 <span class="required-asterisk">*</span></label>
												<input type="tel" class="form-control form-control-white" 
													   name="phone" id="phone"
													   placeholder="하이픈 없이 번호만 입력" required>
											</div>
											<div class="form-group">
												<label for="email">이메일 <span class="required-asterisk">*</span></label>
												<input type="email" class="form-control form-control-white" 
													   name="email" id="email"
													   placeholder="example@university.ac.kr" required>
											</div>
										</div>
									</div>
								</div>

								<!-- 2. 현장실습 관련 사항 -->
								<div class="form-section mb-5">
									<div class="form-section-header">
										<h4>
											<i class="fas fa-clipboard-list"></i>2. 현장실습 관련 사항
										</h4>
									</div>
									
									<div class="form-grid-enhanced">
										<div class="mb-4">
											<label class="form-label-enhanced mb-3">
												현장실습시기 <span class="required-asterisk">*</span>
											</label>
											<div class="radio-group-enhanced d-flex flex-wrap gap-3">
												<div class="form-check-enhanced">
													<input class="form-check-input" type="radio" name="season" value="1" id="season1">
													<label class="form-check-label" for="season1">1학기</label>
												</div>
												<div class="form-check-enhanced">
													<input class="form-check-input" type="radio" name="season" value="2" id="season2">
													<label class="form-check-label" for="season2">하계계절</label>
												</div>
												<div class="form-check-enhanced">
													<input class="form-check-input" type="radio" name="season" value="3" id="season3">
													<label class="form-check-label" for="season3">2학기</label>
												</div>
												<div class="form-check-enhanced">
													<input class="form-check-input" type="radio" name="season" value="4" id="season4">
													<label class="form-check-label" for="season4">동계계절</label>
												</div>
											</div>
										</div>

										<div class="form-row-inline">
											<div class="form-group">
												<label for="start_date">보험 시작일 <span class="required-asterisk">*</span></label>
												<input type="date" class="form-control form-control-white" 
													   name="start_date" id="start_date" required>
											</div>
											<div class="form-group">
												<label for="end_date">보험 종료일 <span class="required-asterisk">*</span></label>
												<input type="date" class="form-control form-control-white" 
													   name="end_date" id="end_date" required>
											</div>
										</div>
									</div>
								</div>

								<!-- 3. 보험가입 유형 선택 -->
								<div class="form-section mb-5">
									<div class="form-section-header">
										<h4>
											<i class="fas fa-shield-alt"></i>3. 보험가입 유형 선택
										</h4>
									</div>
									
									<div class="table-responsive">
										<table class="table table-enhanced" id="coverage-table">
											<thead>
												<tr>
													<th width="30%" class="text-center">보장내용</th>
													<th width="35%" class="text-center">
														<div class="form-check">
															<input class="form-check-input" type="radio" name="plan" value="A" id="planA">
															<label class="form-check-label" for="planA">PLAN A</label>
														</div>
													</th>
													<th width="35%" class="text-center">
														<div class="form-check">
															<input class="form-check-input" type="radio" name="plan" value="B" id="planB">
															<label class="form-check-label" for="planB">PLAN B</label>
														</div>
													</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td class="text-center fw-bold" data-label="보장내용">상해사망</td>
													<td class="text-center" data-label="PLAN A">1,000만원</td>
													<td class="text-center" data-label="PLAN B">2,000만원</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="보장내용">상해후유장해</td>
													<td class="text-center" data-label="PLAN A">1,000만원</td>
													<td class="text-center" data-label="PLAN B">2,000만원</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="보장내용">상해의료비</td>
													<td class="text-center" data-label="PLAN A">100만원</td>
													<td class="text-center" data-label="PLAN B">200만원</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="보장내용">배상책임</td>
													<td class="text-center" data-label="PLAN A">1억원</td>
													<td class="text-center" data-label="PLAN B">2억원</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>

								<!-- 4. 실습기간별 참여인원 -->
								<div class="form-section mb-5">
									<div class="form-section-header">
										<h4>
											<i class="fas fa-users"></i>4. 실습기간별 참여인원
										</h4>
									</div>
									
									<div class="table-responsive">
										<table class="table participants-table">
											<thead class="table-light">
												<tr>
													<th width="20%" class="text-center">실습기간</th>
													<th width="30%" class="text-center">참여인원</th>
													<th width="20%" class="text-center">실습기간</th>
													<th width="30%" class="text-center">참여인원</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">4주</td>
													<td class="text-center" data-label="참여인원">
													  <div class="week-input-wrapper">
														<input type="text" class="week-input" data-week="4" >
														<span class="unit-label">명</span>
													  </div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">16주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="16" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">5주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="5" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">17주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="17" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">6주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="6" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">18주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="18" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">7주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="7" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">19주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="19" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">8주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="8" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">20주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="20" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">9주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="9" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">21주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="21" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">10주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="10" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">22주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="22" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">11주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="11" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">23주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="23" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">12주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="12" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">24주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="24" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">13주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="13" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">25주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="25" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												<tr>
													<td class="text-center fw-bold" data-label="실습기간">14주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="14" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td class="text-center fw-bold" data-label="실습기간">26주</td>
													<td class="text-center" data-label="참여인원">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="26" >
															<span class="unit-label">명</span>
														</div>
													</td>
												</tr>
												
												
												<tr>
													<td class="text-center fw-bold">15주</td>
													<td class="text-r">
														<div class="week-input-wrapper">
															<input type="text" class="week-input" data-week="15" >
															<span class="unit-label">명</span>
														</div>
													</td>
													<td></td>
													<td></td>
												</tr>
											</tbody>
											<tfoot>
												<tr>
													<th colspan="3" class="text-center">총 참여인원 수</th>
													<th class="text-center">
														<span id="totalParticipants" class="total-participants">0</span> 명
													</th>
												</tr>
											</tfoot>
										</table>
									</div>
								</div>

								<!-- 5. 추가 정보 -->
								<div class="form-section mb-4">
									<div class="form-section-header">
										<h4>
											<i class="fas fa-plus-circle"></i>5. 추가 정보
										</h4>
									</div>
									
									<div class="form-grid-enhanced">
										<div class="form-row-single">
											<label for="manager_name">담당자명 <span class="required-asterisk">*</span></label>
											<input type="text" class="form-control form-control-white" 
												   name="manager_name" id="manager_name"
												   placeholder="담당자 성함을 입력해주세요" required>
										</div>
										
										<div class="form-row-single">
											<label for="special_notes">특이사항 및 요청사항</label>
											<textarea class="form-control form-control-white" rows="4" 
													  name="special_notes" id="special_notes"
													  placeholder="실습 중 특별히 주의해야 할 사항이나 요청사항을 입력해주세요." 
													  style="min-height: 120px; resize: vertical;"></textarea>
										</div>
									</div>
								</div>

								<!-- 제출 버튼 -->
								<div class="submit-section">
									<button type="submit" class="btn btn-submit-enhanced">
										<i class="fas fa-paper-plane me-2"></i>견적 요청하기
									</button>
									<p class="text-muted mt-3 mb-0">
										<i class="fas fa-shield-alt me-1"></i>
										귀하의 정보는 안전하게 보호되며, 견적 산출 목적으로만 사용됩니다.
									</p>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
        `
    },
    questions: {
        title: '📝 질문서 리스트',
        content: `
            <div class="content-section">
                <h3>질문서 양식</h3>
                <ul class="content-list">
                    <li>현장실습 사전 질문서</li>
                    <li>안전교육 이수 확인서</li>
                    <li>실습기관 정보 조사서</li>
                    <li>실습 종료 후 평가서</li>
                </ul>
            </div>
            <div class="content-section">
                <h3>작성 가이드</h3>
                <div class="content-text">
                    각 질문서는 실습의 안전성과 효과성을 확보하기 위한 중요한 자료입니다.
                    정확하고 자세하게 작성해 주시기 바랍니다.
                </div>
            </div>
        `
    },
    process: {
        title: '🔄 가입 절차 안내',
        content: `
            <div class="content-section">
                <div class="step-container">
                    <div class="step-item">
                        <h3>STEP 1: 견적의뢰 신청</h3>
                        <div class="step-content">
                            <p>홈페이지 "견적의뢰" 내용 작성 및 신청</p>
                            <div class="notice-box">
                                ※ 대학교견적의뢰 / 고등학교견적의뢰 선택에 유의하여 작성해주시기 바랍니다.
                            </div>
                        </div>
                    </div>

                    <div class="step-item">
                        <h3>STEP 2: 담당자 메일 송신</h3>
                        <div class="step-content">
                            <p>업무 담당자가 신청 선생님께 메일 송신</p>
                            <p>진행 내용을 확인할 수 있는 담당자 전용 사이트 주소와 로그인 정보를 메일로 전달드립니다.</p>
                            <div class="info-box">
                                <strong>메일로 제공되는 내용:</strong>
                                <ul>
                                    <li>의뢰한 내용 확인</li>
                                    <li>보험료 확인 및 청약서 출력</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="step-item">
                        <h3>STEP 3: 담당자 선생님 관리사이트 로그인</h3>
                        <div class="step-content">
                            <ol>
                                <li>질문서, 청약서 다운로드하여 내용 확인 후 신청 내용 일치하면 직인 날인</li>
                                <li>학과별 참여 인원 현황(예시 파일)</li>
                                <li>결제 방식을 선택
                                    <ul>
                                        <li>현금이면 가상계좌로 입금 (청약서 가상계좌)</li>
                                        <li>카드이면 카드번호 유효기간</li>
                                    </ul>
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div class="step-item">
                        <h3>STEP 4: 이투엘 현장실습보험 담당자가 보험료 결제</h3>
                        <div class="step-content">
                            <p>현금이면 입금 확인, 카드이면 카드승인 후 수납하여 영수증, 증권발급하여 관리사이트에 업로드 하고 메일을 드립니다.</p>
                            
                        </div>
                    </div>

                    <div class="step-item">
                        
                        <div class="step-content">
                            
                            <div class="notice-box">
                                <strong>주요 안내사항:</strong>
                                <ul>
                                    <li>입금 또는 카드 승인을 받기 전까지는 질문서를 수정 가능합니다.</li>
                                    <li>증권발급 후 참여인원 등의 변경사항이 발생하면 신규추가로 처리하시면 됩니다.</li>
                                    <li>실습기간이 2016.09.01부터 2016.12.23일 경우<br>
                                        보험기간은 2016.09.01 01:00부터 2016.12.24 01:00까지입니다.<br>
                                        (보험증권의 종료일은 실습기간의 마지막날보다 하루 더 길게 표시)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    faq: {
        title: '❓ 자주 묻는 질문',
        content: `
            <div class="faq-accordion" id="faqAccordion">
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q1. 보험가입시 이름과 주민번호 없이 보험에 가입하는데 보상에 문제가 없나요?</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                <div class="content-text">
                            보상처리에 전혀 문제가 되지 않습니다. 사고로 보험금을 청구할 때 현장실습에 참여하고 있었음을 증명하는 서류를 함께 제출해야 하기 때문입니다. (실습기관의 출석부 및 대학교 현장실습 전산에서 '참여학생정보 화면 캡쳐')<br><br>
                            유사한 다른 보험의 사례로는, 대학교가 재학생의 학교생활 중 사고를 보장해주는 "학교경영자배상책임보험"이 있습니다. 이 보험에서도 이름과 주민번호 없이 보험가입 시점의 재학생수를 기준으로 보험가입 합니다.<br><br>
                            단, 사고발생시에는 재학중임을 증명하는 '재학증명서'를 반드시 제출해야 합니다.
                </div>
            </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q2. 실습을 중도에 포기하거나, 중단해야 할 경우 보험료를 환급 받을 수 있나요?</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                <div class="content-text">
                            학생 개개인의 사유로 실습을 중도에 포기하거나 중단하는 경우 보험료를 환급해주지 않습니다.<br><br>
                            단, 이번과 같은 코로나 팬데믹 상황, 자연재해 등으로 학과 전체가 실습을 중단하는 경우 또는 합리적 이유로 학과 전체의 실습이 중단 취소되는 경우에는 보험을 해지하고 해지에 따른 보험료를 환급해 드립니다.<br><br>
                            유사한 다른 보험의 사례로는, 대학교가 재학생의 학교생활 중 사고를 보장해주는 "학교경영자배상책임보험"이 있습니다. 이 보험에서도 중도 휴학, 퇴학 등의 학업중단 상황이 발생해도 개개인의 사유에 따른 보험료 환급은 없습니다.
                </div>
            </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q3. 보험가입 후 실습생이 추가로 발생하는 경우, 추가로 보험에 가입해야 보상받을 수 있나요?</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                <div class="content-text">
                            보험가입시 대학교는 '학과별 인원수 현황'을 제출합니다. 추가로 실습을 나가게 된 학생이 기 제출한 학과에 소속된 학생이라면 보상받는데 문제가 없습니다.<br><br>
                            즉, 기 제출한 학과에 소속된 학생이 3명 이내로 추가 발생한다 하더라도 추가로 보험에 가입하지 않아도 보상받을 수 있습니다.<br><br>
                            단, 새로운 학과의 학생이라면 반드시 추가로 보험에 가입해야 합니다.
                        </div>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q4. 보험기간을 어떻게 설정해야 하는지 설명해주세요.</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            실습기간(보험기간)은 가장 빨리 현장실습을 나가는 학생의 시작일과 가장 늦게 현장실습이 끝나는 학생의 종료일을 보험기간으로 잡으시면 됩니다.<br><br>
                            참고로, 위의 보험기간은 보험료에 영향을 미치지 않습니다. 보험료는 실습기간별 참여인원을 기초로 합니다. (예, 4주 20명, 8주 30명…) 실습기간은 실제로 학생이 실습을 참여한 기간을 주수로 계산합니다.<br><br>
                            예시) 총 실습인원이 100명이고, 50명 씩 파트가 나뉘어져 실습이 이루어진다는 전제<br>
                            A파트의 실습기간 : 2023.05.01 ~ 2023.07.31<br>
                            B파트의 실습기간 : 2023.06.01 ~ 2023.08.31<br><br>
                            현장실습 보험 가입 시 보험기간 설정은 2023.05.01 ~ 2023.08.31 로 해주시면 됩니다.
                        </div>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q5. 혹시 현장실습보험에 가입할 수 없는 학과가 있습니까?</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            아래의 학과는 현장실습보험에 가입이 제한됩니다.<br><br>
                            가. 의사, 한의사, 약사, 치과의사, 한약사<br>
                            나. 철도 및 항공종사관련 : 조종사, 기관사, 항공사, 정비사<br>
                            다. 해양수관련 : 해기사(항해사, 기관사, 통신사, 운항사)<br>
                            라. 초.중.고 및 특수학교 교사<br><br>
                            나머지 학과는 모두 보험 가입이 가능합니다.
                        </div>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q6. 개인적으로 가입한 실비보험(실손보험)이 있어도 현장실습보험 치료비에서 별도로 보상받을 수 있습니까?</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            실습중 상해사고로 치료비가 발생했을 경우 본인부담 치료비에 대해서 개인이 가입한 실손보험과는 별도로 이 보험에서 보장하는 치료비보장을 별도(추가)로 받을 수 있습니다.<br><br>
                            단체상해보험이나 공제상품처럼 비례보상 하지 않고 별도로 계산하여 추가 보장하는 이유는 보험상품의 성격이 근본적으로 다르기 때문입니다.
                        </div>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q7. 실습 중 사망시 실습기관과의 과실비율을 따져서 실습기관의 학생에 대한 배상책임액만큼을 보상한다고 알고 있습니다. 그렇다면 실습중 상해사망 보험을 별도로 가입할 수는 없나요?</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            가입이 가능합니다.<br><br>
                            단, 이경우 학생이 이름과 주민번호 그리고 속속 학과정보를 저희 쪽에 제출해 주셔야 합니다.<br><br>
                            제출해주신 자료를 근거로 보험료를 산출하여 추가 가입할 수 있도록 안내드립니다.
                        </div>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q8. 우리학교는 기존에 단체상해보험 또는 학생실습보험을 가입했습니다. 추가로 이 보험이 필요한가요?</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            대부분의 대학들이 위의 단체상해보험(공제포함), 학생실습보험에 가입했었고, 현재도 가입중인 대학들이 있습니다.<br><br>
                            이 상품들이 "실습기관의 민사상 배상책임"을 보장하지 않고 있기 때문에 본 상품이 개발된 것 입니다.<br><br>
                            18.9.11 대학생현장실습생의 산재보험가입 의무화가 법으로 강제화 된 이유도 "실습기관의 민사상 배상책임"을 최소한이라도 법으로 강제하기 위함입니다.<br><br>
                            기존에 가입하던 단체상해보험, 실습보험의 사망보험금 등은 민사상 배상책임과는 전혀 무관하기 때문에 실습중 발생하는 사망, 후유장해 등으로 인한 배상책임을 전혀 담보하지 못하고 있습니다.
                        </div>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q9. 산재보험에서 실습중 사고에 대해서 보장해주는데 이 보험에 추가 가입해야 하는 이유는 무엇인가요?</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            아래의 사유로 보험가입이 꼭 필요합니다.<br><br>
                            첫째, 산재보험에서 제외되는 간호학과, 유아교육과 등의 실습수업 등은 산재보험에서 보장받을 수 없으므로 이 보험에서 보상합니다.<br><br>
                            둘째, 산재보험은<br>
                            * 위자료(1억원 한도)를 지급하지 않습니다.<br>
                            * 휴업으로 인해 취업을 못할 경우 평균임의 70% 수준 보장.<br>
                            * 장해가 발생했을 때, 연금이나 일시금으로 지급 받을 수 있는데 장해급수에 따른 금액산정액이 정해져 있으므로 충분하다 할 수 없음.<br>
                            * 치료비에 대해서는 요양급여에서 지급되는데, 비급여 항목은 보상에서 제외.<br>
                            * 위자료, 휴업급여의 차액, 장해연금의 차액 및 요양급여 중 비급여항목 등 산재보험에서 지급받지 못한 금액을 현장실습보험에서 보장받을 수 있습니다.<br>
                            -> (단체상해보험 및 학생실습보험 보장은 위 산재보험에서 제외되는 차액 등을 보장하거나 및 대체할 수 없음)<br><br>
                            셋째, 산재사고 발생시 피해당사자(학생) 및 가족 그리고 사망시 유족 등은 산재보상 외에 추가 피해보상을 요구합니다. 추가 피해보상이 원만하게 이루어지지 않을경우 법적 소송(근거:민사상 배상책임)을 청구합니다.<br>
                            * 대부분의 실습기관들은 산재보험 외에 이러한 추가 피해보상 및 법적 소송에 대한 대비책을 가지고 있지 못한 경우가 대부분이고, 이런 피해자 측의 요구에 해당 대학교도 사고책자로 연결될 수 밖에 없습니다.<br>
                            * 이 경우 현장실습보험은 실습기관이 책임져야하는 산재보험 초과 손해에 대해 보상해주고, 합의를 하면서 사건을 종결시킵니다.<br>
                            * 만약 합의에 이르지 못할 경우 법적 소송에 따른 변호사 선임비용 등을 이 보험에서 보상하며, 판사가 결정한 판결금액을 보험금으로 지급하며서 사건을 종결합니다.<br><br>
                            ※ 대기업, 건설회사, 선박회사 등은 근로자의 산재사고시 추가 피해보상에 대비하기 위해 근재보험을 반드시 추가로 가입하고 있습니다. 근재보험의 보장내용이 이 보험의 배상책임과 동일함.
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    notice: {
        title: '📢 공지사항',
        content: `
            <div class="faq-accordion" id="faqAccordion">
                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q1. 보험청약서 예시자료</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            기존에 단체상해보험 등으로 가입했던 학교들의 현장실습 담당 선생님들께서
                            특히, 청약서 등을 확인하고 싶어하시는 것 같습니다. 참고하여 주시기 바랍니다.<br><br>
                            <a href="/api/file/보험청약서_예시.pdf" class="btn btn-primary" download>보험청약서 예시 다운로드</a>
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q2. 보험조건(Terms & Condition) - 보장하지 않는 조항</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            특별약관(보상하지 않는 조항) 세부 조건을 아래와 같이 정리하였습니다.<br>
                            약관 내용은 번역본과 영문원본을 첨부합니다.<br><br>
                            [ Terms & Conditions ]<br>
                            ◼ Commercial General Liability Policy Form(I) –Occurrence Basis<br>
                            영문영업배상책임보험약관적용_손해사고기준<br><br>
                            ◼ Products/Completed Operation Hazard Exclusion Clause<br>
                            생산물/완성작업위험 부보장 특약<br>
                            ◼ Cross Liability Clause<br>
                            교차배상책임담보 특약<br>
                            ◼ Punitive Damage Exclusion Clause<br>
                            징벌적 손해배상책임 부보장 특약<br>
                            ◼ Nuclear Energy Liability Exclusion Clause<br>
                            원자력배상책임 부보장 특약<br>
                            ◼ Compulsory Gas Accident Liability Exclusion Clause<br>
                            (의무)가스사고배상 부보장 특약<br>
                            ◼ Premium and Claim Payment Clause<br>
                            보험료 & 보험금 청구 지불조건<br>
                            ◼ Deductible Liability Insurance Clause<br>
                            기초공제 특약<br>
                            ◼ Property Entrusted Exclusion Clause<br>
                            수탁물건 부보장 특약<br>
                            ◼ Millennium Exclusion Clause<br>
                            서기 2000년 부보장 특약<br>
                            ◼ All costs & Expenses are included within the L.O.L.<br>
                            제비용 보상한도액 내 담보조항<br>
                            ◼ Terrorism Exclusion Endorsement(NMA2952)<br>
                            테러위험 부보장 특약<br>
                            ◼ EMF & Asbestos & Silica Risk Excluded.<br>
                            전자기기.전자장/설면/실리카 위험 부보장 특약<br>
                            ◼ Exclusion of dust and noise<br>
                            먼지 및 소음관련 부보장 특약<br>
                            ◼ Limitation of Coverage to Designated Premises or Project Clause<br>
                            특정구내 또는 사업만의 보장 특약<br>
                            ◼ Policy Territory and Jurisdiction : Korea only<br>
                            담보지역 및 재판관할권 : 대한민국<br><br>
                            <a href="/api/file/보험조건_특별약관_번역본.pdf" class="btn btn-primary" download>번역본 다운로드</a>
                            <a href="/api/file/보험조건_특별약관_영문원본.pdf" class="btn btn-primary" download>영문원본 다운로드</a>
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q3. 상품 약관</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            본 상품은 "영문영업배상책임보험"을 채택하여 사용하고 있습니다.<br><br>
                            - 영문영업배상책임보험은 포괄주의 약관이 특징입니다.<br>
                            즉, 보통약관에서 모든 위험을 포괄하여 보장하며, 특별약관에서 보장에서 제외되는 항목을
                            나열하고 있습니다.<br><br>
                            - 보통약관 영문 원문과 번역본을 첨부하오니 참고하여 주시기 바랍니다.<br><br>
                            <a href="/api/file/현장실습보험-약관-(CGL).pdf" class="btn btn-primary" download>약관 다운로드</a>
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q4. 간호학과 현장실습보험 가입</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            기존에 현장실습보험 가입에서 제외되었던 "간호학과"에 대해서
                            2016년 12월 1일부터 가입이 가능하게 되었습니다.<br><br>
                            참고해 주시기 바랍니다.
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q5. 보험금 청구서 양식 및 작성 예시</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            <strong>필요서류</strong><br>
                            1. 보험금 청구서(+필수 동의서) 및 문답서 (첨부파일 참고)<br>
                            * 보험금 청구 기간은 최대 1년까지 가능합니다.<br>
                            2. 신분증 및 통장사본<br>
                            3. 진단서 또는 초진차트<br>
                            4. 병원치료비 영수증(계산서)_치료비세부내역서, 약제비 영수증<br>
                            5. 실습기관의 현장실습 출석부 사본 또는 실습일지<br>
                            6. 학생 학적을 확인할 수 있는 학교 전산 캡처본<br>
                            7. (고등학생 현장 실습 사고 접수 경우만 해당)<br>
                            보험금 청구서 밑의 법정대리인의 서명, 가족관계증명서, 보호자 신분증 및 통장사본<br><br>
                            
                            <strong>보내주실 곳</strong><br>
                            이메일: lincinsu@simg.kr<br><br>
                            
                            <strong>서류 접수 후 처리되는 시간</strong><br>
                            서류에 이상이 없을 경우 3~5일 이내에 본인 통장으로 계산된 보험금이 지급되며
                            청구서 상의 연락처로 문자를 보내드립니다.<br><br>
                            
                            <a href="/api/file/보험금-청구서,동의서,문답서.pdf" class="btn btn-primary" download>청구 서류 양식 다운로드</a>
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q6. 질문서 양식</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            홈페이지 카테고리 중에서 "견적의뢰" 란에서 직접 질문서 작성을 해 주셔도 됩니다.<br>
                            혹시라도 오류가 발생하거나, 문서로 필요하신 경우에는 첨부하는 질문서 양식을
                            출력하여 사용해 주시기 바랍니다.<br><br>
                            <strong>제출 방법</strong><br>
                            질문서 출력 -> 작성 -> 이메일 발송<br>
                            이메일: sy@fstudent.kr (담당자_전선양 팀장)<br><br>
                            <a href="/api/file/질문서양식_현장실습보험.pdf" class="btn btn-primary" download>질문서 양식 다운로드</a>
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q7. 보험가입 제외대상</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            아래의 경우는 현장실습의 범위에서 제외합니다.<br>
                            - 학과(전공) 특성상(전문)자격취득요건 충족을 위해 아래의 현장실습을 나가는 경우 제외합니다.<br><br>
                            가. 의사, 한의사, 약사, 치과의사, 한약사<br>
                            나. 철도 및 항공종사관련 : 조종사, 기관사, 항공사, 정비사<br>
                            다. 해양수관련 : 해기사(항해사, 기관사, 통신사, 운항사)<br>
                            라. 초.중.고 및 특수학교 교사<br><br>
                            위와 같이 제외되는 현장실습생들의 경우에는 어쩔 수 없이 "단체상해보험"으로 안내가 가능합니다.<br>
                            따라서, 제외되는 현장실습생들의 경우에는 "이름/주민번호/학과/기간"의 개인정보를 정리해서
                            문의해 주시기 바랍니다.
                        </div>
                    </div>
                </div>

                <div class="faq-item">
                    <div class="faq-question">
                        <h3>Q8. 보험기간 설정</h3>
                        <span class="faq-arrow">▼</span>
                    </div>
                    <div class="faq-answer">
                        <div class="content-text">
                            현장실습 관련하여 보험계약은 특별한 경우를 제외하고는 아래와 같이 연간 4회 이루어집니다.<br>
                            - 1학기, 하계 계절학기, 2학기, 동계 계절학기<br><br>
                            보험견적을 의뢰할 때(질문서 작성시) 실습기간(보험기간)을 작성할때, 가장빨리 현장실습을 나가는
                            학생의 시작일과 가장 늦게 현장실습이 끝나는 학생의 종료일을 보험기간으로 설정하시면 됩니다.<br><br>
                            <strong>예시) 하계 여름학기 실습기간(보험기간) 설정</strong><br>
                            - 가장 빨리 현장실습 시작하는 학생의 시작일 : 2016년 06월 25일<br>
                            - 가장 늦게 현장실습 종료되는 학생의 종료일 : 2016년 09월 02일<br>
                            => 하계 여름학기 보험기간 (2016.06.25) ~ (2016.09.02)<br><br>
                            ※ 참고) 보험기간은 위와 같이 설정하고 보험료는 실습기간별 참여인원을 기준으로 계산합니다.
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    compensation: {
        title: '💰 보상 안내',
        content: `
            <div class="container">
                
                
                <!-- 보험금 청구 절차 -->
                <div class="feature-card">
                    <h3><span style="color: #000000;"><strong>■ 보험금 청구 절차</strong></span></h3>
                    
                    <div class="mb-4">
                        <h5><strong><span class="step-highlight">STEP1</span> <span class="step-text">보험금 청구서류 구비</span></strong></h5>
                        <p class="step-description">보험금 신청전 청구서류를 꼭 확인하시길 바랍니다.</p>
                    </div>
                    
                    <div class="mb-4">
                        <h5><strong><span class="step-highlight">STEP2</span> <span class="step-text">이메일로 보험금 청구</span></strong></h5>
                        <p class="step-description">메일로 확인 및 서류 보완 요청 등 회신드립니다.</p>
                    </div>
                    
                    <div class="mb-4">
                        <h5><strong><span class="step-highlight">STEP3</span> <span class="step-text">보험금 접수</span></strong></h5>
                        <p class="step-description">접수 후 절차에 따라 심사 후 처리됩니다. 서류에 이상이 없을 경우 영업일 기준 3~5일 이내에 본인 통장으로 계산된 보험금이 지급되며
                            청구서 상의 연락처로 문자를 보내드립니다.</p>
                    </div>
                </div>
                
                <!-- 필요 서류 안내 -->
                <div class="feature-card">
                    <h3><span style="color: #000000;"><strong>■ 필요 서류 안내</strong></span></h3>
                    
                    <ul class="document-list">
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span class="step-text"><strong>보험금 청구서 및 동의서, 문답서</strong></span>
                            <a href="/api/file/보험금-청구서,동의서,문답서.pdf" class="btn-download" download>
                                <i class="fas fa-download"></i>보험금-청구서,동의서,문답서.pdf
                            </a>
                        </li>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span class="step-text"><strong>신분증 및 통장사본</strong></span>
                        </li>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span class="step-text"><strong>진단서 또는 초진차트</strong></span>
                        </li>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span class="step-text"><strong>병원치료비 영수증(계산서)_치료비세부내역서, 약제비 영수증</strong></span>
                        </li>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span class="step-text"><strong>실습기관의 현장실습 출석부 사본 또는 실습일지</strong></span>
                        </li>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span class="step-text"><strong>학생 학적을 확인할 수 있는 학교 <span class="step-highlight">전산화면출력(화면copy_대상학생 참여자료)</span></strong></span>
                        </li>
                        <li>
                            <i class="fas fa-check-circle"></i>
                            <span class="step-text"><strong>(고등학생 현장 실습 사고 접수 경우만 해당)<br>
                            보험금 청구서 밑의 법정대리인의 서명, 가족관계증명서, 보호자 신분증 및 통장사본</strong></span>
                        </li>
                    </ul>
                    
                    <div class="contact-box">
                        <h5><i class="fas fa-info-circle"></i>보험금 청구 문의</h5>
                        <p><i class="fas fa-phone"></i><strong>전화:</strong> 1533-5013</p>
                        <p><i class="fas fa-envelope"></i><strong>이메일:</strong> lincinsu@simg.kr</p>
                    </div>
                </div>
            </div>
        `
    }
};

// 페이지 로드 시 초기화
window.addEventListener('load', function() {
    if (SECURITY_CONFIG.ENABLE_DEV_TOOLS_BLOCK) {
        initializeSecurity(); // 필요시에만 보안 기능 활성화
    }
    checkAuthentication();
    loadUserInfo();
    startSessionMonitoring();
    
    // 초기 상태 설정 - 메인메뉴에서는 floating 버튼 숨기기
    updateButtonVisibility();
});

// 보안 초기화 (선택적 활성화)
function initializeSecurity() {
    // 브라우저 히스토리 조작 방지
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };

    // 개발자 도구 감지 (완화된 버전)
    if (SECURITY_CONFIG.ENABLE_DEV_TOOLS_BLOCK) {
        let devtools = {open: false, orientation: null};
        const threshold = 200; // 임계값을 높여서 오탐 방지

        let devtoolsInterval = setInterval(() => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.warn('개발자 도구가 감지되었습니다.');
                    // alert 대신 console.warn 사용하여 덜 방해적으로 변경
                    // window.location.href = SECURITY_CONFIG.LOGIN_PAGE;
                }
            } else {
                devtools.open = false;
            }
        }, 1000); // 검사 간격을 늘려서 성능 개선
    }

    // 일부 키보드 단축키만 제한적으로 차단
    document.addEventListener('keydown', function(e) {
        // Ctrl+S (페이지 저장)만 차단하고 나머지는 허용
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });

    // 우클릭 차단 제거 (개발자가 디버깅할 수 있도록)
    // 텍스트 선택 차단 제거
    // 드래그 차단 제거
}

// 인증 확인 (핵심 기능만 유지)
function checkAuthentication() {
    const cNum = sessionStorage.getItem('cNum');
    const schoolName = sessionStorage.getItem('schoolName');
    
    // 기본 세션 체크
    if (!cNum || !schoolName) {
        redirectToLogin('세션이 만료되었습니다.');
        return false;
    }

    return true;
}

// 로그인 페이지로 리다이렉트
function redirectToLogin(message) {
    if (message) {
        alert(message);
    }
    sessionStorage.clear();
    window.location.replace(SECURITY_CONFIG.LOGIN_PAGE);
}

// 세션 모니터링 시작 (단순화)
function startSessionMonitoring() {
    // 주기적 세션 체크
    setInterval(() => {
        if (!checkAuthentication()) {
            return;
        }
        refreshSession();
    }, SECURITY_CONFIG.REFRESH_INTERVAL);
}

// 세션 갱신
function refreshSession() {
    try {
        const currentTime = new Date().toISOString();
        sessionStorage.setItem('lastActivity', currentTime);
    } catch (error) {
        console.error('세션 갱신 실패:', error);
    }
}

// 사용자 정보 로드 (XSS 방지)
function loadUserInfo() {
    try {
        // 세션에서 사용자 정보 가져오기 (실제로는 서버에서 가져와야 함)
        const userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
            const parsedInfo = JSON.parse(userInfo);
            // 사용자 정보 표시
            console.log('사용자 정보 로드됨:', parsedInfo);
            
            // directory 값 설정 (서버에서 가져온 값 사용)
            if (parsedInfo.directory) {
                sessionStorage.setItem('directory', parsedInfo.directory);
            }
        }
    } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
    }
}

// HTML 이스케이프 함수 (XSS 방지)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 로그아웃 처리
function handleLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        try {
            sessionStorage.clear();
            localStorage.clear();
            
            if (window.history && window.history.pushState) {
                window.history.replaceState(null, null, SECURITY_CONFIG.LOGIN_PAGE);
            }
            
            window.location.replace(SECURITY_CONFIG.LOGIN_PAGE);
        } catch (error) {
            console.error('로그아웃 처리 중 오류:', error);
            window.location.href = SECURITY_CONFIG.LOGIN_PAGE;
        }
    }
}

// 페이지 표시 함수 (SPA 방식)
function goToPage(page) {
    const allowedPages = ['guide', 'application', 'questions', 'process', 'faq', 'compensation', 'notice'];
    
    if (!allowedPages.includes(page)) {
        alert('유효하지 않은 페이지 요청입니다.');
        return;
    }

    if (!checkAuthentication()) {
        return;
    }

    sessionStorage.setItem('lastActivity', new Date().toISOString());
    
    // 메인 메뉴 숨기기
    document.querySelector('.welcome-section').style.display = 'none';
    document.querySelector('.menu-grid').style.display = 'none';
    
    // 콘텐츠 영역 표시
    document.getElementById('content-area').style.display = 'block';
    
    // 버튼 표시 상태 업데이트
    updateButtonVisibility();
    
    // 동적 콘텐츠 업데이트
    const content = PAGE_CONTENT[page];
    document.getElementById('dynamic-content').innerHTML = `
        <h2 class="content-title">${content.title}</h2>
        ${content.content}
    `;
    
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);

    // guide 페이지일 때 보험료 데이터 로드
    if (page === 'guide') {
        loadPremiumData();
    }

    // application 페이지일 때 견적 폼 초기화
    if (page === 'application') {
        initializeQuoteForm();
    }

    // FAQ 또는 공지사항 페이지일 때 아코디언 초기화
    if (page === 'faq' || page === 'notice') {
        initializeFAQ();
    }
}

// 견적 폼 초기화 함수
function initializeQuoteForm() {
    setTimeout(() => {
        // 세션에서 directory 값 가져오기 (임시로 localStorage 사용)
        const directory = sessionStorage.getItem('directory') || '1'; // 기본값: 대학교
        
        setupQuoteFormByType(directory);
        setupParticipantsCalculation();
        setupFormSubmission();
    }, 100);
}

// directory 값에 따른 폼 설정
function setupQuoteFormByType(directory) {
    const isUniversity = directory === '1';
    
    // 제목 변경
    const titleElement = document.getElementById('quote-title');
    if (titleElement) {
        titleElement.textContent = isUniversity ? '대학교 현장실습보험 견적의뢰' : '고등학교 현장실습보험 견적의뢰';
    }
    
    // 아이콘 및 계약자 정보 변경
    const contractorIcon = document.getElementById('contractor-icon');
    const contractorSubtitle = document.getElementById('contractor-subtitle');
    const institutionLabel = document.getElementById('institution-label');
    const institutionNameInput = document.getElementById('institution_name');
    const emailInput = document.getElementById('email');
    const managerLabel = document.getElementById('manager-label');
    const managerNameInput = document.getElementById('manager_name');
    
    if (isUniversity) {
        // 대학교 설정
        if (contractorIcon) contractorIcon.className = 'fas fa-university';
        if (contractorSubtitle) contractorSubtitle.textContent = '(대학교 또는 산학협력단)';
        if (institutionLabel) institutionLabel.innerHTML = '계약자 (대학교명) <span class="required-asterisk">*</span>';
        if (institutionNameInput) institutionNameInput.placeholder = '대학교명을 입력해주세요';
        if (emailInput) emailInput.placeholder = 'example@university.ac.kr';
        if (managerLabel) managerLabel.innerHTML = '담당자명 <span class="required-asterisk">*</span>';
        if (managerNameInput) managerNameInput.placeholder = '담당자 성함을 입력해주세요';
    } else {
        // 고등학교 설정
        if (contractorIcon) contractorIcon.className = 'fas fa-school';
        if (contractorSubtitle) contractorSubtitle.textContent = '(고등학교)';
        if (institutionLabel) institutionLabel.innerHTML = '계약자 (고등학교명) <span class="required-asterisk">*</span>';
        if (institutionNameInput) institutionNameInput.placeholder = '고등학교명을 입력해주세요';
        if (emailInput) emailInput.placeholder = 'example@school.ac.kr';
        if (managerLabel) managerLabel.innerHTML = '담당교사명 <span class="required-asterisk">*</span>';
        if (managerNameInput) managerNameInput.placeholder = '담당교사 성함을 입력해주세요';
    }
    
    // 보험가입 유형 테이블 설정
    setupCoverageTable(isUniversity);
}

// 보험가입 유형 테이블 설정
function setupCoverageTable(isUniversity) {
    const coverageTbody = document.getElementById('coverage-tbody');
    if (!coverageTbody) return;
    
    if (isUniversity) {
        // 대학교 보장 내용
        coverageTbody.innerHTML = `
            <tr>
                <td class="fw-bold text-center">대인 및 대물 보상</td>
                <td class="text-center">1사고당 2억원</td>
                <td class="text-center">1사고당 3억원</td>
            </tr>
            <tr>
                <td class="fw-bold text-center">산재보험 초과 사용자배상</td>
                <td class="text-center">1사고당 2억원</td>
                <td class="text-center">1사고당 3억원</td>
            </tr>
            <tr>
                <td class="fw-bold text-center">배상책임 자기부담금</td>
                <td class="text-center">10만원</td>
                <td class="text-center">10만원</td>
            </tr>
            <tr>
                <td class="fw-bold text-center">실습 중 치료비</td>
                <td class="text-center">1인당 및 1사고당: 1천만원</td>
                <td class="text-center">1인당 및 1사고당: 1천만원</td>
            </tr>
        `;
    } else {
        // 고등학교 보장 내용
        coverageTbody.innerHTML = `
            <tr>
                <td class="fw-bold text-center">대인 및 대물 보상</td>
                <td class="text-center">1사고당 1억원</td>
                <td class="text-center">1사고당 2억원</td>
            </tr>
            <tr>
                <td class="fw-bold text-center">산재보험 초과 사용자배상</td>
                <td class="text-center">1사고당 1억원</td>
                <td class="text-center">1사고당 2억원</td>
            </tr>
            <tr>
                <td class="fw-bold text-center">배상책임 자기부담금</td>
                <td class="text-center">10만원</td>
                <td class="text-center">10만원</td>
            </tr>
            <tr>
                <td class="fw-bold text-center">실습 중 치료비</td>
                <td class="text-center">1인당 및 1사고당: 1천만원</td>
                <td class="text-center">1인당 및 1사고당: 1천만원</td>
            </tr>
        `;
    }
}

// 참여인원 계산 설정
function setupParticipantsCalculation() {
    const weekInputs = document.querySelectorAll('.week-input');
    const totalElement = document.getElementById('totalParticipants');
    
    if (!weekInputs.length || !totalElement) return;
    
    function calculateTotal() {
        let total = 0;
        weekInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            total += value;
        });
        totalElement.textContent = total;
    }
    
    weekInputs.forEach(input => {
        input.addEventListener('input', function() {
            // 숫자만 입력 허용
            this.value = this.value.replace(/[^0-9]/g, '');
            calculateTotal();
        });
    });
    
    // 초기 계산
    calculateTotal();
}

// 폼 제출 설정
function setupFormSubmission() {
    const quoteForm = document.getElementById('quoteForm');
    if (!quoteForm) return;
    
    quoteForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 폼 데이터 수집
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // 참여인원 데이터 수집
        const participants = {};
        document.querySelectorAll('.week-input').forEach(input => {
            const week = input.getAttribute('data-week');
            const count = parseInt(input.value) || 0;
            if (count > 0) {
                participants[week] = count;
            }
        });
        data.participants = participants;
        
        // 세션 directory 값 추가
        data.directory = sessionStorage.getItem('directory') || '1';
        
        // 폼 검증
        if (!validateQuoteForm(data)) {
            return;
        }
        
        // 서버로 데이터 전송
        submitQuoteForm(data);
    });
}

// 폼 검증
function validateQuoteForm(data) {
    // 필수 필드 검증
    const requiredFields = [
        'business_number', 'institution_name', 'address', 
        'phone', 'email', 'season', 'start_date', 'end_date', 
        'plan', 'manager_name'
    ];
    
    for (const field of requiredFields) {
        if (!data[field]) {
            alert('모든 필수 항목을 입력해주세요.');
            return false;
        }
    }
    
    // 참여인원 검증
    if (!data.participants || Object.keys(data.participants).length === 0) {
        alert('실습기간별 참여인원을 1명 이상 입력해주세요.');
        return false;
    }
    
    return true;
}

// 폼 제출
async function submitQuoteForm(data) {
    try {
        const submitButton = document.querySelector('.btn-submit-enhanced');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>전송 중...';
        }
        
        const response = await fetch('api/submit_quote.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('견적 요청이 성공적으로 전송되었습니다.\n담당자가 검토 후 연락드리겠습니다.');
            document.getElementById('quoteForm').reset();
            document.getElementById('totalParticipants').textContent = '0';
        } else {
            alert('견적 요청 전송에 실패했습니다.\n' + (result.message || '다시 시도해 주세요.'));
        }
    } catch (error) {
        console.error('견적 요청 전송 실패:', error);
        alert('네트워크 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.');
    } finally {
        const submitButton = document.querySelector('.btn-submit-enhanced');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>견적 요청하기';
        }
    }
}

// 메인 메뉴로 돌아가기
function showMainMenu() {
    const contentArea = document.getElementById('content-area');
    
    // 이미 메인메뉴에 있다면 페이지 상단으로 스크롤만 하기
    if (!contentArea || contentArea.style.display === 'none') {
        window.scrollTo(0, 0);
        return;
    }

    // 콘텐츠 페이지에서 메인메뉴로 돌아가기
    document.querySelector('.welcome-section').style.display = 'block';
    document.querySelector('.menu-grid').style.display = 'grid';
    document.getElementById('content-area').style.display = 'none';
    
    // 버튼 표시 상태 업데이트
    updateButtonVisibility();
    
    window.scrollTo(0, 0);
}

// 에러 핸들링
window.addEventListener('error', function(e) {
    console.error('JavaScript 오류 감지:', e.error);
});

// 개발자를 위한 친화적 메시지
console.log('%c🔧 개발자 모드', 'color: blue; font-size: 16px; font-weight: bold;');
console.log('%c개발자 도구 사용이 허용됩니다. 디버깅을 진행하세요.', 'color: green; font-size: 12px;');

// 보험료 API 호출
async function fetchPremiumData() {
    try {
        const response = await fetch('api/premium.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('보험료 데이터 조회 실패:', error);
        // 폴백 데이터 반환
        return {
            success: true,
            message: 'fallback 데이터 사용',
            periods: [
                {weeks: '1~4주', planA: '3,000원', planB: '5,000원'},
                {weeks: '5~8주', planA: '5,000원', planB: '8,000원'},
                {weeks: '9~12주', planA: '7,000원', planB: '11,000원'},
                {weeks: '13~16주', planA: '9,000원', planB: '14,000원'},
                {weeks: '17~20주', planA: '11,000원', planB: '17,000원'},
                {weeks: '21~24주', planA: '13,000원', planB: '20,000원'},
                {weeks: '25~26주', planA: '15,000원', planB: '23,000원'}
            ],
            lastUpdated: new Date().toISOString().split('T')[0],
            compensation: {
                daein: 200000000,
                daemool: 300000000
            }
        };
    }
}

// 숫자 포맷팅 함수 (천단위 구분자 추가)
function formatPremium(premiumStr) {
    // "1인당 : 3,000원" 또는 "3,000원" 형태에서 숫자만 추출
    const numbers = premiumStr.replace(/[^0-9]/g, '');
    if (numbers) {
        return parseInt(numbers).toLocaleString('ko-KR');
    }
    return premiumStr;
}

// 보험료 테이블 동적 생성
function generatePremiumTable(periods, lastUpdated) {
    let tableHTML = `
       
        <div class="table-responsive">
            <table class="guide-table" id="premium-table">
                <thead>
                    <tr>
                        <th>실습기간</th>
                        <th>가입유형 A</th>
                        <th>가입유형 B</th>
                    </tr>
                </thead>
                <tbody>`;
    
    periods.forEach(period => {
        tableHTML += `
            <tr>
                        <td class="row-header">${period.weeks}</td>
                        <td class="premium-amount">${formatPremium(period.planA)}</td>
                        <td class="premium-amount">${formatPremium(period.planB)}</td>
                    </tr>`;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>`;
    
    return tableHTML;
}

// 보상한도 테이블 동적 업데이트
function updateCompensationTable(compensation) {
    if (!compensation) return;
    
    const formatCurrency = (amount) => {
        return (amount / 100000000).toFixed(0) + '억원';
    };
    
    // 4번 테이블의 보상한도 업데이트
    setTimeout(() => {
        const compensationTable = document.querySelector('.guide-section:nth-of-type(5) .guide-table tbody');
        if (compensationTable) {
            const planA = formatCurrency(compensation.daein || 200000000);
            const planB = formatCurrency(compensation.daemool || 300000000);
            
            compensationTable.innerHTML = `
                <tr>
                    <td class="text-center"><strong>(대인 및 대물) 배상책임</strong></td>
                    <td class="text-center">사고당 ${planA}</td>
                    <td class="text-center">사고당 ${planB}</td>
                </tr>
                <tr>
                    <td class="text-center"><strong>(산재보험 초과) 배상책임</strong></td>
                    <td class="text-center">사고당 ${planA}</td>
                    <td class="text-center">사고당 ${planB}</td>
                </tr>
                <tr>
                    <td class="text-center"><strong>(실습중) 치료비</strong></td>
                    <td class="text-center">1인당 1천만원</td>
                    <td class="text-center">1인당 1천만원</td>
                </tr>
    `;
        }
    }, 100);
}

// 보험료 데이터 로드 및 테이블 업데이트
async function loadPremiumData() {
    try {
        const data = await fetchPremiumData();
        
        // 로딩 표시 숨기기
        const loadingElement = document.getElementById('premium-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // 보험료 테이블 생성
        const premiumContent = document.getElementById('premium-content');
        if (premiumContent && data.periods) {
            premiumContent.innerHTML = generatePremiumTable(data.periods, data.lastUpdated);
        }
        
        // 보상한도 테이블 업데이트
        if (data.compensation) {
            updateCompensationTable(data.compensation);
        }
        
        console.log('보험료 데이터 로드 완료:', data.message);
        
    } catch (error) {
        console.error('보험료 데이터 로드 실패:', error);
        
        // 에러 발생시 로딩 메시지를 에러 메시지로 변경
        const loadingElement = document.getElementById('premium-loading');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <p style="color: #dc3545;">⚠️ 서버 연결에 실패했습니다. 기본 보험료를 표시합니다.</p>
            `;
        }
        
        // 기본 보험료 테이블 표시
        const premiumContent = document.getElementById('premium-content');
        if (premiumContent) {
            const defaultPeriods = [
                {weeks: '1~4주', planA: '3,000원', planB: '5,000원'},
                {weeks: '5~8주', planA: '5,000원', planB: '8,000원'}
            ];
            premiumContent.innerHTML = generatePremiumTable(defaultPeriods, new Date().toISOString().split('T')[0]);
        }
    }
}

// FAQ 초기화 함수
function initializeFAQ() {
    setTimeout(() => {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                // 초기 상태에서 답변 높이 설정
                answer.style.height = '0px';
                
                question.addEventListener('click', () => {
                    // 다른 모든 항목 닫기
                    faqItems.forEach((otherItem, otherIndex) => {
                        if (index !== otherIndex) {
                            otherItem.classList.remove('active');
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            if (otherAnswer) {
                                otherAnswer.style.height = '0px';
                            }
                        }
                    });
                    
                    // 현재 항목 토글
                    const isActive = item.classList.contains('active');
                    item.classList.toggle('active');
                    
                    if (!isActive) {
                        // 답변 열기
                        answer.style.height = answer.scrollHeight + 'px';
                    } else {
                        // 답변 닫기
                        answer.style.height = '0px';
                    }
                });
            }
        });
    }, 100); // DOM이 완전히 업데이트될 때까지 잠시 대기
}

// 버튼 표시 상태 업데이트 함수
function updateButtonVisibility() {
    const floatingBtn = document.getElementById('floatingMenuBtn');
    
    // Floating 버튼은 항상 표시
    if (floatingBtn) {
        floatingBtn.style.display = 'flex';
    }
} 