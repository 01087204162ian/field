// ===== 결제 안내 모달 (3단계 개선 버전) =====
// ===== 카드번호 자동 포맷팅 함수 =====
function formatCardNumber(input) {
    // 숫자만 추출
    let value = input.value.replace(/\D/g, '');
    
    // 4자리씩 끊어서 하이픈 추가
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formatted += '-';
        }
        formatted += value[i];
    }
    
    // 최대 19자리 (16자리 숫자 + 3개 하이픈)
    input.value = formatted.substring(0, 19);
}

// ===== 유효기간 자동 포맷팅 함수 =====
function formatExpiry(input) {
    // 숫자만 추출
    let value = input.value.replace(/\D/g, '');
    
    // MM/YY 형식으로 포맷팅
    if (value.length >= 2) {
        input.value = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else {
        input.value = value;
    }
}

// ===== 주민등록번호 자동 포맷팅 함수 ===== ← 여기에 추가
function formatJumin(input) {
    // 숫자만 추출
    let value = input.value.replace(/\D/g, '');
    
    // 123456-1234567 형식으로 포맷팅
    if (value.length > 6) {
        input.value = value.substring(0, 6) + '-' + value.substring(6, 13);
    } else {
        input.value = value;
    }
}
function qcm_showPaymentModal(questionId) {
    // 기존 모달 제거
    const existingModal = document.querySelector('.qcm-payment-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'qcm-payment-modal';
    modal.innerHTML = `
        <div class="qcm-modal-overlay" onclick="this.closest('.qcm-payment-modal').remove()"></div>
        <div class="qcm-modal-content payment-modal-content">
            <div class="qcm-modal-header">
                <h3>💳 결제 정보 입력</h3>
                <button class="qcm-modal-close-btn" onclick="this.closest('.qcm-payment-modal').remove()">×</button>
            </div>
            <div class="qcm-modal-body">
                <!-- 1단계: 결제 방법 선택 (카드/현금) -->
                <div id="step1-payment-method" class="payment-step active">
                   
                    
                    <div class="payment-method-selection" style="display: flex; justify-content: center; align-items: center; gap: 30px; padding: 20px; flex-wrap: wrap; margin: 0 auto; max-width: 700px;">
                        <button class="payment-method-card" onclick="qcm_selectPaymentMethod('card', ${questionId})" 
                                style="width: 280px; min-height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; border: 3px solid #e1e8ed; border-radius: 16px; padding: 40px 30px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-family: inherit;"
                                onmouseover="this.style.borderColor='#667eea'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(102,126,234,0.2)'; this.style.background='linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)'"
                                onmouseout="this.style.borderColor='#e1e8ed'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'; this.style.background='white'">
                            <div style="font-size: 64px; margin-bottom: 20px; line-height: 1;">💳</div>
                            <div style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 0;">카드 결제</div>
                        </button>
                        
                        <button class="payment-method-card" onclick="qcm_selectPaymentMethod('account', ${questionId})"
                                style="width: 280px; min-height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; border: 3px solid #e1e8ed; border-radius: 16px; padding: 40px 30px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.08); font-family: inherit;"
                                onmouseover="this.style.borderColor='#667eea'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(102,126,234,0.2)'; this.style.background='linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)'"
                                onmouseout="this.style.borderColor='#e1e8ed'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'; this.style.background='white'">
                            <div style="font-size: 64px; margin-bottom: 20px; line-height: 1;">🏦</div>
                            <div style="font-size: 22px; font-weight: 700; color: #1a1a1a; margin: 0;">현금 결제</div>
                        </button>
                    </div>
                </div>

                <!-- 2단계: 카드 종류 선택 (법인/개인) -->
                <div id="step2-card-type" class="payment-step" style="display: none;">
                    <h4 style="text-align: center; font-size: 20px; font-weight: 600; color: #333; margin: 0 0 32px 0;">
                        카드 종류를 선택하세요
                    </h4>
                    
                    <div class="card-type-options" style="display: flex; justify-content: center; align-items: center; gap: 24px; padding: 20px; flex-wrap: wrap; margin: 0 auto; max-width: 600px;">
                        <button type="button" class="card-type-btn" data-card-type="corporate" onclick="qcm_selectCardType('corporate', ${questionId})"
                                style="width: 240px; min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; border: 3px solid #e1e8ed; border-radius: 16px; padding: 32px 24px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"
                                onmouseover="this.style.borderColor='#667eea'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 16px rgba(102,126,234,0.3)';"
                                onmouseout="this.style.borderColor='#e1e8ed'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';">
                            <div style="font-size: 48px; margin-bottom: 16px;">🏢</div>
                            <div style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">법인카드</div>
                           
                        </button>
                        
                        <button type="button" class="card-type-btn" data-card-type="personal" onclick="qcm_selectCardType('personal', ${questionId})"
                                style="width: 240px; min-height: 180px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: white; border: 3px solid #e1e8ed; border-radius: 16px; padding: 32px 24px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.08);"
                                onmouseover="this.style.borderColor='#667eea'; this.style.transform='translateY(-4px)'; this.style.boxShadow='0 6px 16px rgba(102,126,234,0.3)';"
                                onmouseout="this.style.borderColor='#e1e8ed'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';">
                            <div style="font-size: 48px; margin-bottom: 16px;">👤</div>
                            <div style="font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">개인카드</div>
                            <div style="font-size: 13px; color: #666;">재직증명서 필요</div>
                        </button>
                    </div>
                </div>

                <!-- 3단계-A: 법인카드 입력 폼 -->
                <div id="step3-corporate-card" class="payment-step" style="display: none;">
                    <h4 style="text-align: center; font-size: 20px; font-weight: 600; color: #333; margin: 0 0 32px 0;">
                        🏢 법인카드 정보 입력
                    </h4>
                    
                    <div class="form-group">
                        <label>카드번호 <span class="required">*</span></label>
                        <input type="text" class="form-control" id="corpCardNumber" placeholder="1234-5678-1234-5678" maxlength="19" oninput="formatCardNumber(this)">
                        
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>유효기간 <span class="required">*</span></label>
                            <input type="text" class="form-control" id="corpExpiry" placeholder="MM/YY" maxlength="5" oninput="formatExpiry(this)">
                        </div>
                       
                    </div>
                    
                    <div class="payment-notice">
                         <ul>
                            <li>법인카드 정보는 암호화되어 안전하게 전송됩니다</li>
                            <li>결제 승인 후  저장된 카드번호는 삭제됩니다. </li>
                        </ul>
                    </div>
                </div>

                <!-- 3단계-B: 개인카드 입력 폼 -->
                <div id="step3-personal-card" class="payment-step" style="display: none;">
                    <h4 style="text-align: center; font-size: 20px; font-weight: 600; color: #333; margin: 0 0 32px 0;">
                        👤 개인카드 정보 입력
                    </h4>
                    
                    <div class="form-group">
                        <label>카드번호 <span class="required">*</span></label>
                        <input type="text" class="form-control" id="persCardNumber" placeholder="1234-5678-1234-5678" maxlength="19" oninput="formatCardNumber(this)">
                        
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>유효기간 <span class="required">*</span></label>
                            <input type="text" class="form-control" id="persExpiry" placeholder="MM/YY" maxlength="5" oninput="formatExpiry(this)">
                        </div>
                        <div class="form-group">
							<label>주민등록번호 <span class="required">*</span></label>
							<input type="text" class="form-control" id="persBirthDate" placeholder="123456-1234567" maxlength="14" oninput="formatJumin(this)">
						</div>
						</div>
                    <div class="form-group">
                        <label>재직증명서 업로드 <span class="required">*</span></label>
                        <input type="file" class="form-control" id="employmentProof" accept=".pdf,.jpg,.jpeg,.png">
                        <small class="text-danger">⚠️ 3개월 이내 재직증명서를 반드시 첨부해주세요</small>
                    </div>
                    
                    <div class="payment-notice">
                        <h5>⚠️ 주의사항</h5>
                        <ul>
                            <li>개인카드는 3개월 이내 재직증명서가 필수입니다</li>
                            <li>카드 정보는 암호화되어 안전하게 전송됩니다</li>
                            <li>결제 승인 후 영수증이 자동 발행됩니다</li>
                        </ul>
                    </div>
                </div>

                <!-- 2단계-B: 가상계좌 상세 (수정 버전) -->
				<div id="step2-account-payment" class="payment-step" style="display: none;">
					<h4 style="text-align: center; font-size: 20px; font-weight: 600; color: #333; margin: 0 0 32px 0;">
						🏦 가상계좌 입금
					</h4>
					
					<div class="bank-selection">
						<div class="form-group">
							<label>은행 선택 <span class="required">*</span></label>
							<select class="form-control bank-select" id="bankSelect" onchange="qcm_updateBankInfo()">
								<option value="">은행을 선택하세요</option>
								<option value="kookmin">🏦 국민은행</option>
								<option value="shinhan">🏦 신한은행</option>
								<option value="woori">🏦 우리은행</option>
								<option value="hana">🏦 하나은행</option>
								<option value="nh">🏦 NH농협은행</option>
								<option value="ibk">🏦 IBK기업은행</option>
								<option value="kdb">🏦 KDB산업은행</option>
								<option value="other">🏦 기타 은행 (직접 입력)</option>
							</select>
						</div>
						
						<!-- 기타 은행 직접 입력 필드 -->
						<div class="form-group" id="customBankInput" style="display: none;">
							<label>은행명 직접 입력 <span class="required">*</span></label>
							<input type="text" class="form-control" id="customBankName" placeholder="예: 카카오뱅크, 토스뱅크 등">
						</div>
						
						<!-- 가상계좌 안내 메시지 -->
						<div id="bankInfoDisplay" class="bank-info-display" style="display: none;">
							<div class="info-box-highlight" style="text-align: center; padding: 40px 30px;">
								<div style="font-size: 48px; margin-bottom: 20px;">📄</div>
								<h5 style="font-size: 18px; font-weight: 600; color: #333; margin-bottom: 16px;">
									가상계좌 발급 안내
								</h5>
								<p style="font-size: 15px; color: #666; line-height: 1.6; margin: 0;">
									선택하신 <strong id="selectedBankName" style="color: #667eea;">-</strong> 은행으로<br>
									가상계좌를 발급하여 안내하겠습니다.
								</p>
								<div style="margin-top: 24px; padding: 16px; background: #f8f9fa; border-radius: 8px; font-size: 14px; color: #666;">
									💡 계좌 정보는 신청 후 이메일 또는 문자로 발송됩니다
								</div>
							</div>
						</div>
					</div>
					
					<div class="payment-notice">
						<h5>⚠️ 주의사항</h5>
						<ul>
							<li>가상계좌는 발급 후 <strong>7일 이내</strong> 입금하셔야 합니다</li>
							<li>입금자명은 <strong>학교명 또는 담당자명</strong>으로 입금해주세요</li>
							<li>입금 확인 후 자동으로 영수증이 발행됩니다</li>
							<li>기한 내 미입금 시 계좌가 자동 소멸됩니다</li>
						</ul>
					</div>
				</div>

            <div class="qcm-modal-footer">
                <button class="qcm-cancel-btn" onclick="this.closest('.qcm-payment-modal').remove()">
                    취소
                </button>
                <button class="btn btn-primary" id="submitBtn" onclick="qcm_submitPaymentInfo(${questionId})" style="display: none;">
                    정보 전송
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('qcm-modal-show'), 10);
}

// 현재 단계 추적을 위한 변수
let currentStep = 1;
let selectedPaymentMethod = '';
let selectedCardType = '';

// 1단계: 결제 방법 선택 (카드/현금)
function qcm_selectPaymentMethod(method, questionId) {
    console.log('결제 방법 선택:', method);
    selectedPaymentMethod = method;
    
    // 1단계 숨기기
    document.getElementById('step1-payment-method').style.display = 'none';
    
    // 취소 버튼을 뒤로 버튼으로 변경
    const cancelBtn = document.querySelector('.qcm-cancel-btn');
    if (cancelBtn) {
        cancelBtn.innerHTML = '← 뒤로';
        cancelBtn.onclick = function(e) {
            e.preventDefault();
            qcm_goBackToStep(1);
        };
        cancelBtn.style.background = '#f0f0f0';
        cancelBtn.style.color = '#333';
    }
    
    // 선택한 방법에 따라 다음 단계 표시
    if (method === 'card') {
        // 카드 결제 → 2단계: 카드 종류 선택으로 이동
        currentStep = 2;
        document.getElementById('step2-card-type').style.display = 'block';
    } else if (method === 'account') {
        // 현금 결제 → 바로 가상계좌 단계로 이동
        currentStep = 2;
        document.getElementById('step2-account-payment').style.display = 'block';
    }
}

// 2단계: 카드 종류 선택 (법인/개인)
function qcm_selectCardType(cardType, questionId) {
    console.log('카드 종류 선택:', cardType);
    selectedCardType = cardType;
    
    // 2단계 숨기기
    document.getElementById('step2-card-type').style.display = 'none';
    
    // 3단계로 이동
    currentStep = 3;
    
    // 선택한 카드 타입에 따라 입력 폼 표시
    if (cardType === 'corporate') {
        document.getElementById('step3-corporate-card').style.display = 'block';
    } else if (cardType === 'personal') {
        document.getElementById('step3-personal-card').style.display = 'block';
    }
    
    // 전송 버튼 표시
    document.getElementById('submitBtn').style.display = 'inline-block';
    
    // 뒤로 버튼 업데이트
    const cancelBtn = document.querySelector('.qcm-cancel-btn');
    if (cancelBtn) {
        cancelBtn.onclick = function(e) {
            e.preventDefault();
            qcm_goBackToStep(2);
        };
    }
}

// 이전 단계로 돌아가기
function qcm_goBackToStep(targetStep) {
    console.log('이전 단계로 돌아가기:', targetStep);
    
    // 모든 단계 숨기기
    document.getElementById('step1-payment-method').style.display = 'none';
    document.getElementById('step2-card-type').style.display = 'none';
    document.getElementById('step3-corporate-card').style.display = 'none';
    document.getElementById('step3-personal-card').style.display = 'none';
    document.getElementById('step2-account-payment').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'none';
    
    const cancelBtn = document.querySelector('.qcm-cancel-btn');
    
    if (targetStep === 1) {
        // 1단계로 돌아가기
        currentStep = 1;
        selectedPaymentMethod = '';
        selectedCardType = '';
        
        document.getElementById('step1-payment-method').style.display = 'block';
        
        // 취소 버튼 원래대로
        if (cancelBtn) {
            cancelBtn.innerHTML = '취소';
            cancelBtn.onclick = function() {
                this.closest('.qcm-payment-modal').remove();
            };
            cancelBtn.style.background = '#e2e8f0';
            cancelBtn.style.color = '#4a5568';
        }
        
        // 입력 폼 초기화
        qcm_resetAllForms();
        
    } else if (targetStep === 2) {
        // 2단계로 돌아가기
        currentStep = 2;
        
        if (selectedPaymentMethod === 'card') {
            document.getElementById('step2-card-type').style.display = 'block';
            selectedCardType = '';
            
            // 카드 입력 폼만 초기화
            qcm_resetCardForms();
        } else if (selectedPaymentMethod === 'account') {
            document.getElementById('step2-account-payment').style.display = 'block';
        }
        
        // 뒤로 버튼 유지
        if (cancelBtn) {
            cancelBtn.innerHTML = '← 뒤로';
            cancelBtn.onclick = function(e) {
                e.preventDefault();
                qcm_goBackToStep(1);
            };
            cancelBtn.style.background = '#f0f0f0';
            cancelBtn.style.color = '#333';
        }
    }
}

// 모든 폼 초기화
function qcm_resetAllForms() {
    document.querySelectorAll('.qcm-modal-body .form-control').forEach(input => {
        if (input.type !== 'file') {
            input.value = '';
        } else {
            input.value = null;
        }
    });
    
    const bankInfoDisplay = document.getElementById('bankInfoDisplay');
    if (bankInfoDisplay) {
        bankInfoDisplay.style.display = 'none';
    }
}

// 카드 폼만 초기화
function qcm_resetCardForms() {
    ['corpCardNumber', 'corpExpiry', 'corpBusinessNum', 'persCardNumber', 'persExpiry', 'persBirthDate'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
    
    const proofInput = document.getElementById('employmentProof');
    if (proofInput) proofInput.value = null;
}

// 은행 선택 시 정보 표시 (수정 버전)
function qcm_updateBankInfo() {
    const bankSelect = document.getElementById('bankSelect');
    const customBankInput = document.getElementById('customBankInput');
    const bankInfoDisplay = document.getElementById('bankInfoDisplay');
    const selectedBankNameSpan = document.getElementById('selectedBankName');
    const selectedBank = bankSelect.value;

    if (selectedBank) {
        const bankNames = {
            'kookmin': '국민은행',
            'shinhan': '신한은행',
            'woori': '우리은행',
            'hana': '하나은행',
            'nh': 'NH농협은행',
            'ibk': 'IBK기업은행',
            'kdb': 'KDB산업은행',
            'other': '기타 은행'
        };
        
        // 기타 은행 선택 시 직접 입력 필드 표시
        if (selectedBank === 'other') {
            customBankInput.style.display = 'block';
            bankInfoDisplay.style.display = 'none';
            document.getElementById('submitBtn').style.display = 'none';
            
            // 직접 입력 필드에 입력 시 안내 메시지 표시
            const customInput = document.getElementById('customBankName');
            customInput.oninput = function() {
                const customBankName = this.value.trim();
                if (customBankName) {
                    selectedBankNameSpan.textContent = customBankName;
                    bankInfoDisplay.style.display = 'block';
                    document.getElementById('submitBtn').style.display = 'inline-block';
                } else {
                    bankInfoDisplay.style.display = 'none';
                    document.getElementById('submitBtn').style.display = 'none';
                }
            };
        } else {
            // 일반 은행 선택 시
            customBankInput.style.display = 'none';
            selectedBankNameSpan.textContent = bankNames[selectedBank];
            bankInfoDisplay.style.display = 'block';
            document.getElementById('submitBtn').style.display = 'inline-block';
        }
        
        // 부드러운 스크롤
        bankInfoDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        customBankInput.style.display = 'none';
        bankInfoDisplay.style.display = 'none';
        document.getElementById('submitBtn').style.display = 'none';
    }
}

// 가상계좌 번호 생성
function generateVirtualAccount(bank) {
    const bankCodes = {
        'kookmin': '1234',
        'shinhan': '5678',
        'woori': '9012',
        'hana': '3456',
        'nh': '7890',
        'ibk': '2345',
        'kdb': '6789',
        'other': '0123'
    };
    
    const code = bankCodes[bank] || '0000';
    const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return `${code}-${random.slice(0, 4)}-${random.slice(4)}`;
}

// 계좌번호 복사
function qcm_copyAccountNumber() {
    const accountNumber = document.getElementById('accountNumber').textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(accountNumber).then(() => {
            alert('✅ 계좌번호가 복사되었습니다!');
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = accountNumber;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✅ 계좌번호가 복사되었습니다!');
    }
}

// 결제 정보 전송
// 결제 정보 전송 (완성 버전 - 기존 스피너 사용)
// 결제 정보 전송 (수정 버전)
async function qcm_submitPaymentInfo(questionId) {
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        // 로딩 상태 표시
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><span class="loading-spinner" style="width: 14px; height: 14px; border-width: 2px; margin: 0;"></span>처리 중...</span>';
        
        let paymentData = {
            questionId: questionId,
            paymentMethod: selectedPaymentMethod,
            timestamp: new Date().toISOString()
        };
        
        if (selectedPaymentMethod === 'card') {
            // ===== 카드 결제 =====
            if (selectedCardType === 'corporate') {
                // --- 법인카드 처리 ---
                const cardNumber = document.getElementById('corpCardNumber').value.trim();
                const expiry = document.getElementById('corpExpiry').value.trim();
                
                // 입력 검증
                if (!cardNumber || !expiry) {
                    throw new Error('모든 필수 정보를 입력해주세요.');
                }
                
                // 카드번호 검증
                const cleanCardNumber = cardNumber.replace(/\D/g, '');
                if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
                    throw new Error('올바른 카드번호를 입력해주세요. (13-19자리)');
                }
                
                // 유효기간 검증
                if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                    throw new Error('유효기간을 MM/YY 형식으로 입력해주세요.');
                }
                
                const [month, year] = expiry.split('/');
                if (parseInt(month) < 1 || parseInt(month) > 12) {
                    throw new Error('올바른 월을 입력해주세요. (01-12)');
                }
                
                paymentData.cardType = 'corporate';
                paymentData.cardInfo = {
                    cardNumber: cleanCardNumber,
                    expiry: expiry
                };
                
                console.log('법인카드 결제 정보:', { 
                    cardNumber: maskCardNumber(cleanCardNumber), 
                    expiry 
                });
                
                // 법인카드는 일반 JSON으로 전송
                await submitPaymentData(paymentData);
                alert('✅ 법인카드 결제 정보가 전송되었습니다.');
                
            } else if (selectedCardType === 'personal') {
                // --- 개인카드 처리 ---
                const cardNumber = document.getElementById('persCardNumber').value.trim();
                const expiry = document.getElementById('persExpiry').value.trim();
                const birthDate = document.getElementById('persBirthDate').value.trim();
                const proofFile = document.getElementById('employmentProof').files[0];
                
                // 입력 검증
                if (!cardNumber || !expiry || !birthDate || !proofFile) {
                    throw new Error('모든 필수 정보를 입력하고 재직증명서를 첨부해주세요.');
                }
                
                // 카드번호 검증
                const cleanCardNumber = cardNumber.replace(/\D/g, '');
                if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
                    throw new Error('올바른 카드번호를 입력해주세요.');
                }
                
                // 유효기간 검증
                if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                    throw new Error('유효기간을 MM/YY 형식으로 입력해주세요.');
                }
                
                // 주민등록번호 검증
                const cleanJumin = birthDate.replace(/-/g, '');
                if (!/^\d{13}$/.test(cleanJumin)) {
                    throw new Error('주민등록번호 13자리를 모두 입력해주세요.');
                }
                
                // 파일 검증
                const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
                if (!allowedTypes.includes(proofFile.type)) {
                    throw new Error('PDF, JPG, PNG 형식의 파일만 업로드 가능합니다.');
                }
                
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (proofFile.size > maxSize) {
                    throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
                }
                
                paymentData.cardType = 'personal';
                paymentData.cardInfo = {
                    cardNumber: cleanCardNumber,
                    expiry: expiry,
                    birthDate: cleanJumin
                };
                
                // FormData 생성
                const formData = new FormData();
                formData.append('paymentData', JSON.stringify(paymentData));
                formData.append('employmentProof', proofFile);
                
                // 디버깅용 FormData 내용 출력
                debugFormData(formData, '개인카드 결제 정보');
                
                // 개인카드는 파일 포함하여 전송
                await submitPaymentWithFile(formData);
                alert('✅ 개인카드 결제 정보가 전송되었습니다.\n재직증명서 검토 후 승인됩니다.');
            }
            // ← 여기서 카드 결제 if 블록이 끝남
            
        } else if (selectedPaymentMethod === 'account') {
            // ===== 가상계좌 =====
            const bankSelect = document.getElementById('bankSelect');
            const bank = bankSelect.value;
            const accountNumber = document.getElementById('accountNumber').textContent;
            
            if (!bank || accountNumber === '선택 후 생성됩니다') {
                throw new Error('은행을 선택해주세요.');
            }
            
            const bankName = bankSelect.options[bankSelect.selectedIndex].text.replace('🏦 ', '');
            const deadline = document.getElementById('depositDeadline').textContent;
            
            paymentData.accountInfo = {
                bank: bank,
                bankName: bankName,
                accountNumber: accountNumber,
                depositor: '주식회사 이투엘',
                deadline: deadline
            };
            
            await submitPaymentData(paymentData);
            
            console.log('가상계좌 정보:', { bank: bankName, accountNumber });
            alert(`✅ 가상계좌가 발급되었습니다.\n\n은행: ${bankName}\n계좌번호: ${accountNumber}\n예금주: 주식회사 이투엘\n입금기한: ${deadline}\n\n입금 확인 후 자동으로 처리됩니다.`);
        }

        // 모달 닫기
        document.querySelector('.qcm-payment-modal').remove();
        
        // 상태 초기화
        resetPaymentState();
        
    } catch (error) {
        console.error('결제 정보 전송 오류:', error);
        alert(`❌ ${error.message || '결제 정보 전송 중 오류가 발생했습니다.'}`);
        
        // 버튼 복구
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// 결제 데이터 전송 (일반 JSON)
async function submitPaymentData(paymentData) {
    // TODO: 실제 API 엔드포인트로 변경
    const API_ENDPOINT = 'api/payment_submit.php'; // 백엔드 API 주소
    
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 필요시 인증 토큰 추가
            // 'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `서버 오류 (${response.status})`);
    }
    
    return await response.json();
}

// 파일 포함 결제 데이터 전송
// 파일 포함 결제 데이터 전송 (개선 버전)
async function submitPaymentWithFile(formData) {
    const API_ENDPOINT = 'api/payment_submit-with-file.php';
    
    console.log('=== 개인카드 결제 정보 전송 시작 ===');
    console.log('API 엔드포인트:', API_ENDPOINT);
    
    // FormData 내용 확인 (디버깅용)
    console.log('FormData 내용:');
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            console.log(`  ${key}:`, {
                name: value.name,
                size: value.size,
                type: value.type
            });
        } else {
            console.log(`  ${key}:`, value);
        }
    }
    
    try {
        console.log('fetch 요청 시작...');
        
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            // FormData 사용 시 Content-Type 헤더를 설정하지 않음 (자동 설정됨)
            body: formData
        });
        
        console.log('응답 상태:', response.status, response.statusText);
        console.log('응답 헤더:', {
            contentType: response.headers.get('Content-Type'),
            contentLength: response.headers.get('Content-Length')
        });
        
        // 응답 텍스트 먼저 받기 (JSON 파싱 전에 확인)
        const responseText = await response.text();
        console.log('응답 텍스트 (처음 500자):', responseText.substring(0, 500));
        
        // JSON 파싱 시도
        let responseData;
        try {
            responseData = JSON.parse(responseText);
            console.log('파싱된 응답 데이터:', responseData);
        } catch (jsonError) {
            console.error('JSON 파싱 실패:', jsonError);
            console.error('응답 전체 내용:', responseText);
            throw new Error('서버 응답이 올바른 JSON 형식이 아닙니다. 응답: ' + responseText.substring(0, 200));
        }
        
        // HTTP 상태 코드 확인
        if (!response.ok) {
            const errorMessage = responseData?.message || `서버 오류 (${response.status})`;
            console.error('서버 에러 응답:', responseData);
            throw new Error(errorMessage);
        }
        
        // 성공 여부 확인
        if (!responseData.success) {
            console.error('서버 처리 실패:', responseData);
            throw new Error(responseData.message || '서버에서 요청을 처리하지 못했습니다.');
        }
        
        console.log('✅ 개인카드 결제 정보 전송 성공');
        return responseData;
        
    } catch (error) {
        console.error('❌ 개인카드 결제 정보 전송 실패:', error);
        
        // 네트워크 에러인지 확인
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('네트워크 오류: 서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
        }
        
        // 그 외 에러는 그대로 전달
        throw error;
    }
}
// FormData 내용 확인 헬퍼 함수
function debugFormData(formData, label = 'FormData') {
    console.group(`📦 ${label} 내용`);
    
    let hasFile = false;
    let totalSize = 0;
    
    for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
            hasFile = true;
            totalSize += value.size;
            console.log(`📄 ${key}:`, {
                이름: value.name,
                크기: formatFileSize(value.size),
                타입: value.type,
                최종수정: new Date(value.lastModified).toLocaleString()
            });
        } else {
            // JSON 문자열인 경우 파싱해서 보기 좋게 출력
            if (key === 'paymentData') {
                try {
                    const parsed = JSON.parse(value);
                    console.log(`📋 ${key}:`, parsed);
                } catch (e) {
                    console.log(`📋 ${key}:`, value);
                }
            } else {
                console.log(`📋 ${key}:`, value);
            }
        }
    }
    
    if (hasFile) {
        console.log('📊 총 파일 크기:', formatFileSize(totalSize));
    }
    
    console.groupEnd();
}

// 파일 크기 포맷팅
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}


// 카드번호 마스킹 (보안)
function maskCardNumber(cardNumber) {
    if (cardNumber.length <= 4) return cardNumber;
    const lastFour = cardNumber.slice(-4);
    const masked = '*'.repeat(cardNumber.length - 4);
    return masked + lastFour;
}

// 상태 초기화
function resetPaymentState() {
    currentStep = 1;
    selectedPaymentMethod = '';
    selectedCardType = '';
}

// 전역 함수 등록
window.qcm_showPaymentModal = qcm_showPaymentModal;
window.qcm_selectPaymentMethod = qcm_selectPaymentMethod;
window.qcm_selectCardType = qcm_selectCardType;
window.qcm_goBackToStep = qcm_goBackToStep;
window.qcm_updateBankInfo = qcm_updateBankInfo;
window.qcm_copyAccountNumber = qcm_copyAccountNumber;
window.qcm_submitPaymentInfo = qcm_submitPaymentInfo;