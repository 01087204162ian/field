// ========================================
// 설정 및 전역 변수
// ========================================

const CONFIG = {
    SESSION_TIMEOUT: 2 * 60 * 60 * 1000,  // 2시간
    LOGIN_PAGE: 'index.html'
};

// ========================================
// 페이지 콘텐츠 데이터
// ========================================

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
                <h3>3. 상품의 구성</h3>
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
            </div>
            <div class="guide-section">
                <h3>4. 보험료</h3>
                <div id="premium-loading" class="loading-message">
                    <p>📡 보험료 데이터를 불러오는 중...</p>
                </div>
                <div id="premium-content"></div>
            </div>
        `
    },
    application: {
        title: '➕ 신규 신청',
        content: `
            <div id="quote-page">
                <div class="container">
                    <h2 class="section-title" id="quote-title">현장실습보험 견적의뢰</h2>
                    
                    <div class="guide-section">
                        <div class="alert-enhanced">
                            <h5 class="alert-heading-enhanced">
                                <i class="fas fa-info-circle"></i>견적 신청 안내
                            </h5>
                            <p>본 질문서는 보험료 산출을 위한 중요한 자료로 활용됩니다.</p>
                            <p>사실과 다를 경우 보험금 지급 시 영향을 미칠 수 있사오니 정확하게 작성해 주시기 바랍니다.</p>
                        </div>
                    </div>

                    <div class="form-container">
                        <form id="quoteForm" class="quote-form-enhanced">
                            <!-- 1. 계약자 정보 -->
                            <div class="form-section">
                                <div class="form-section-header">
                                    <h4>
                                        <i class="fas fa-university" id="contractor-icon"></i>1. 계약자 정보 
                                        <small class="text-muted" id="contractor-subtitle">(대학교 또는 산학협력단)</small>
                                    </h4>
                                </div>
                                
                                <div class="form-grid">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="business_number">사업자번호 <span class="required">*</span></label>
                                            <input type="text" class="form-control" name="business_number" id="business_number"
                                                   placeholder="하이픈 없이 번호만 입력" maxlength="10" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="institution_name">계약자 (대학교명) <span class="required">*</span></label>
                                            <input type="text" class="form-control" name="institution_name" id="institution_name"
                                                   placeholder="대학교명을 입력해주세요" required>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="address">주소 <span class="required">*</span></label>
                                        <textarea class="form-control" name="address" id="address"
                                                  placeholder="상세주소를 포함하여 입력해주세요" required rows="2"></textarea>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="phone">연락처 <span class="required">*</span></label>
                                            <input type="tel" class="form-control" name="phone" id="phone"
                                                   placeholder="하이픈 없이 번호만 입력" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="email">이메일 <span class="required">*</span></label>
                                            <input type="email" class="form-control" name="email" id="email"
                                                   placeholder="example@university.ac.kr" required>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 2. 현장실습 관련 사항 -->
                            <div class="form-section">
                                <div class="form-section-header">
                                    <h4><i class="fas fa-clipboard-list"></i>2. 현장실습 관련 사항</h4>
                                </div>
                                
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label class="form-label">현장실습시기 <span class="required">*</span></label>
                                        <div class="radio-group">
                                            <label class="radio-item">
                                                <input type="radio" name="season" value="1" required>
                                                <span>1학기</span>
                                            </label>
                                            <label class="radio-item">
                                                <input type="radio" name="season" value="2" required>
                                                <span>하계계절</span>
                                            </label>
                                            <label class="radio-item">
                                                <input type="radio" name="season" value="3" required>
                                                <span>2학기</span>
                                            </label>
                                            <label class="radio-item">
                                                <input type="radio" name="season" value="4" required>
                                                <span>동계계절</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="start_date">보험 시작일 <span class="required">*</span></label>
                                            <input type="date" class="form-control" name="start_date" id="start_date" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="end_date">보험 종료일 <span class="required">*</span></label>
                                            <input type="date" class="form-control" name="end_date" id="end_date" required>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 3. 보험가입 유형 선택 -->
                            <div class="form-section">
                                <div class="form-section-header">
                                    <h4><i class="fas fa-shield-alt"></i>3. 보험가입 유형 선택</h4>
                                </div>
                                
                                <div class="table-responsive">
                                    <table class="coverage-table">
                                        <thead>
                                            <tr>
                                                <th>보장내용</th>
                                                <th>
                                                    <label class="radio-item">
                                                        <input type="radio" name="plan" value="A" required>
                                                        <span>PLAN A</span>
                                                    </label>
                                                </th>
                                                <th>
                                                    <label class="radio-item">
                                                        <input type="radio" name="plan" value="B" required>
                                                        <span>PLAN B</span>
                                                    </label>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody id="coverage-tbody">
                                            <tr>
                                                <td>상해사망</td>
                                                <td>1,000만원</td>
                                                <td>2,000만원</td>
                                            </tr>
                                            <tr>
                                                <td>상해후유장해</td>
                                                <td>1,000만원</td>
                                                <td>2,000만원</td>
                                            </tr>
                                            <tr>
                                                <td>상해의료비</td>
                                                <td>100만원</td>
                                                <td>200만원</td>
                                            </tr>
                                            <tr>
                                                <td>배상책임</td>
                                                <td>1억원</td>
                                                <td>2억원</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- 4. 실습기간별 참여인원 -->
                            <div class="form-section">
                                <div class="form-section-header">
                                    <h4><i class="fas fa-users"></i>4. 실습기간별 참여인원</h4>
                                </div>
                                
                                <div class="participants-grid" id="participants-grid">
                                    <!-- JavaScript로 동적 생성 -->
                                </div>
                                
                                <div class="total-participants">
                                    <strong>총 참여인원: <span id="totalParticipants">0</span> 명</strong>
                                </div>
                            </div>

                            <!-- 5. 추가 정보 -->
                            <div class="form-section">
                                <div class="form-section-header">
                                    <h4><i class="fas fa-plus-circle"></i>5. 추가 정보</h4>
                                </div>
                                
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="manager_name">담당자명 <span class="required">*</span></label>
                                        <input type="text" class="form-control" name="manager_name" id="manager_name"
                                               placeholder="담당자 성함을 입력해주세요" required>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="special_notes">특이사항 및 요청사항</label>
                                        <textarea class="form-control" name="special_notes" id="special_notes" rows="4"
                                                  placeholder="실습 중 특별히 주의해야 할 사항이나 요청사항을 입력해주세요."></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- 제출 버튼 -->
                            <div class="submit-section">
                                <button type="submit" class="btn-submit">
                                    <i class="fas fa-paper-plane"></i>견적 요청하기
                                </button>
                                <p class="submit-notice">
                                    <i class="fas fa-shield-alt"></i>
                                    귀하의 정보는 안전하게 보호되며, 견적 산출 목적으로만 사용됩니다.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `
    },
    // 다른 페이지들도 동일한 패턴으로 간소화...
    questions: { title: '📝 질문서 리스트', content: '<div class="content-text">질문서 관련 내용</div>' },
    process: { title: '🔄 처리절차 안내', content: '<div class="content-text">처리절차 관련 내용</div>' },
    faq: { title: '❓ 자주 묻는 질문', content: '<div class="content-text">FAQ 관련 내용</div>' },
    compensation: { title: '💰 보상 안내', content: '<div class="content-text">보상 관련 내용</div>' },
    notice: { title: '📢 공지사항', content: '<div class="content-text">공지사항 관련 내용</div>' }
};

// ========================================
// 초기화 및 이벤트 리스너
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadUserInfo();
    startSessionCheck();
    updateFloatingButton();
}

// ========================================
// 세션 관리
// ========================================

function loadUserInfo() {
    const schoolName = sessionStorage.getItem('schoolName') || '관리자';
    const schoolNameElement = document.getElementById('schoolName');
    if (schoolNameElement) {
        schoolNameElement.textContent = schoolName;
    }
}

function startSessionCheck() {
    setInterval(() => {
        const cNum = sessionStorage.getItem('cNum');
        if (!cNum) {
            redirectToLogin('세션이 만료되었습니다.');
        }
    }, CONFIG.SESSION_TIMEOUT);
}

function redirectToLogin(message) {
    if (message) alert(message);
    sessionStorage.clear();
    window.location.replace(CONFIG.LOGIN_PAGE);
}

function handleLogout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.clear();
        window.location.replace(CONFIG.LOGIN_PAGE);
    }
}

// ========================================
// 페이지 네비게이션
// ========================================

function goToPage(page) {
    if (!PAGE_CONTENT[page]) {
        alert('유효하지 않은 페이지입니다.');
        return;
    }

    // 메인 메뉴 숨기기
    hideMainMenu();
    
    // 콘텐츠 표시
    showContent(PAGE_CONTENT[page]);
    
    // 플로팅 버튼 업데이트
    updateFloatingButton();
    
    // 페이지별 초기화
    initializePage(page);
    
    // 상단으로 스크롤
    window.scrollTo(0, 0);
}

function showMainMenu() {
    const welcomeSection = document.querySelector('.welcome-section');
    const menuGrid = document.querySelector('.menu-grid');
    const contentArea = document.getElementById('content-area');
    
    if (welcomeSection) welcomeSection.style.display = 'block';
    if (menuGrid) menuGrid.style.display = 'grid';
    if (contentArea) contentArea.style.display = 'none';
    
    updateFloatingButton();
    window.scrollTo(0, 0);
}

function hideMainMenu() {
    const welcomeSection = document.querySelector('.welcome-section');
    const menuGrid = document.querySelector('.menu-grid');
    
    if (welcomeSection) welcomeSection.style.display = 'none';
    if (menuGrid) menuGrid.style.display = 'none';
}

function showContent(pageData) {
    const contentArea = document.getElementById('content-area');
    const dynamicContent = document.getElementById('dynamic-content');
    
    if (contentArea) contentArea.style.display = 'block';
    if (dynamicContent) {
        dynamicContent.innerHTML = `
            <h2 class="content-title">${pageData.title}</h2>
            ${pageData.content}
        `;
    }
}

function updateFloatingButton() {
    const floatingBtn = document.getElementById('floatingMenuBtn');
    if (floatingBtn) {
        floatingBtn.style.display = 'flex';
    }
}

// ========================================
// 페이지별 초기화
// ========================================

function initializePage(page) {
    switch(page) {
        case 'guide':
            loadPremiumData();
            break;
        case 'application':
            initializeQuoteForm();
            break;
        case 'faq':
        case 'notice':
            initializeFAQ();
            break;
    }
}

// ========================================
// 견적 폼 관련 함수
// ========================================

function initializeQuoteForm() {
    setTimeout(() => {
        const directory = sessionStorage.getItem('directory') || '1';
        setupFormByType(directory);
        createParticipantsGrid();
        setupFormValidation();
        setupFormSubmission();
    }, 100);
}

function setupFormByType(directory) {
    const isUniversity = directory === '1';
    const titleElement = document.getElementById('quote-title');
    const contractorIcon = document.getElementById('contractor-icon');
    const contractorSubtitle = document.getElementById('contractor-subtitle');
    
    if (titleElement) {
        titleElement.textContent = isUniversity ? 
            '대학교 현장실습보험 견적의뢰' : '고등학교 현장실습보험 견적의뢰';
    }
    
    if (contractorIcon) {
        contractorIcon.className = isUniversity ? 'fas fa-university' : 'fas fa-school';
    }
    
    if (contractorSubtitle) {
        contractorSubtitle.textContent = isUniversity ? 
            '(대학교 또는 산학협력단)' : '(고등학교)';
    }
}

function createParticipantsGrid() {
    const grid = document.getElementById('participants-grid');
    if (!grid) return;
    
    let html = '';
    for (let week = 4; week <= 26; week++) {
        html += `
            <div class="participant-item">
                <label>${week}주</label>
                <div class="input-group">
                    <input type="number" class="week-input" data-week="${week}" min="0" placeholder="0">
                    <span>명</span>
                </div>
            </div>
        `;
    }
    
    grid.innerHTML = html;
    
    // 참여인원 계산 이벤트 추가
    setupParticipantsCalculation();
}

function setupParticipantsCalculation() {
    const weekInputs = document.querySelectorAll('.week-input');
    const totalElement = document.getElementById('totalParticipants');
    
    function calculateTotal() {
        let total = 0;
        weekInputs.forEach(input => {
            total += parseInt(input.value) || 0;
        });
        if (totalElement) totalElement.textContent = total;
    }
    
    weekInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });
}

function setupFormValidation() {
    const form = document.getElementById('quoteForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

function validateForm() {
    const requiredFields = [
        'business_number', 'institution_name', 'address', 
        'phone', 'email', 'season', 'start_date', 'end_date', 
        'plan', 'manager_name'
    ];
    
    for (const field of requiredFields) {
        const element = document.querySelector(`[name="${field}"]`);
        if (!element || !element.value.trim()) {
            alert('모든 필수 항목을 입력해주세요.');
            return false;
        }
    }
    
    // 참여인원 검증
    const weekInputs = document.querySelectorAll('.week-input');
    let hasParticipants = false;
    weekInputs.forEach(input => {
        if (parseInt(input.value) > 0) hasParticipants = true;
    });
    
    if (!hasParticipants) {
        alert('실습기간별 참여인원을 1명 이상 입력해주세요.');
        return false;
    }
    
    return true;
}

function setupFormSubmission() {
    // 폼 제출 관련 로직
}

async function submitForm() {
    const submitBtn = document.querySelector('.btn-submit');
    if (!submitBtn) return;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>전송 중...';
        
        // 실제 제출 로직
        await new Promise(resolve => setTimeout(resolve, 2000)); // 시뮬레이션
        
        alert('견적 요청이 성공적으로 전송되었습니다.');
        document.getElementById('quoteForm').reset();
        document.getElementById('totalParticipants').textContent = '0';
        
    } catch (error) {
        alert('전송에 실패했습니다. 다시 시도해 주세요.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>견적 요청하기';
    }
}

// ========================================
// 보험료 데이터 관련
// ========================================

async function loadPremiumData() {
    try {
        // 시뮬레이션 데이터
        const data = {
            periods: [
                {weeks: '1~4주', planA: '3,000원', planB: '5,000원'},
                {weeks: '5~8주', planA: '5,000원', planB: '8,000원'},
                {weeks: '9~12주', planA: '7,000원', planB: '11,000원'}
            ]
        };
        
        const loadingElement = document.getElementById('premium-loading');
        const contentElement = document.getElementById('premium-content');
        
        if (loadingElement) loadingElement.style.display = 'none';
        if (contentElement) {
            contentElement.innerHTML = generatePremiumTable(data.periods);
        }
        
    } catch (error) {
        console.error('보험료 데이터 로드 실패:', error);
    }
}

function generatePremiumTable(periods) {
    let html = `
        <div class="table-responsive">
            <table class="guide-table">
                <thead>
                    <tr>
                        <th>실습기간</th>
                        <th>가입유형 A</th>
                        <th>가입유형 B</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    periods.forEach(period => {
        html += `
            <tr>
                <td>${period.weeks}</td>
                <td>${period.planA}</td>
                <td>${period.planB}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// ========================================
// FAQ 아코디언
// ========================================

function initializeFAQ() {
    setTimeout(() => {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            if (question && answer) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // 모든 FAQ 아이템 닫기
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // 현재 아이템 토글
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, 100);
}

// ========================================
// 유틸리티 함수
// ========================================

function formatNumber(num) {
    return parseInt(num).toLocaleString('ko-KR');
}