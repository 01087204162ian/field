// ===== 질문서 카드 관리 기본 함수 (고유 접두사: qcm_) =====

// 스크립트 중복 로드 방지 및 디버깅 강화
if (window.QCM_SCRIPT_LOADED) {
    console.log('질문서 카드 관리 스크립트가 이미 로드되어 있습니다.');
    // 기존 관리자가 있으면 재사용하되, DOM 요소 확인 후 재초기화
    if (window.qcm_questionsManager) {
        console.log('기존 질문서 관리자를 재사용합니다.');
        // DOM 요소가 변경되었을 수 있으므로 재확인
        setTimeout(() => {
            const questionsGrid = document.getElementById('questionsGrid');
            const questionsLoading = document.getElementById('questionsLoading');
            
            if (questionsGrid && questionsLoading) {
                console.log('DOM 요소 재확인 완료, 데이터 로드 재시작');
                window.qcm_questionsManager.qcm_loadQuestionsList();
            } else {
                console.warn('DOM 요소를 찾을 수 없어 관리자를 재생성합니다.');
                window.qcm_questionsManager = new QCM_QuestionsCardManagerV2();
            }
        }, 100);
    }
} else {
    // 스크립트가 처음 로드되는 경우에만 실행
    window.QCM_SCRIPT_LOADED = true;

// 전역 변수 (중복 선언 방지)
if (typeof window.qcm_questionsManager === 'undefined') {
    window.qcm_questionsManager = null;
}

// 기존 클래스가 있다면 제거
if (typeof window.QCM_QuestionsCardManagerV2 !== 'undefined') {
    delete window.QCM_QuestionsCardManagerV2;
}

// ===== 질문서 관리 클래스 =====
class QCM_QuestionsCardManagerV2 {
    constructor() {
        this.isLoading = false;
        this.currentData = null;
        this.hasInitialized = false;
        this.domCheckInterval = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.init();
    }

    // ===== 초기화 =====
    init() {
        console.log('질문서 카드 관리 시스템 초기화...');
        
        // 기존 인터벌 정리
        if (this.domCheckInterval) {
            clearInterval(this.domCheckInterval);
            this.domCheckInterval = null;
        }

        // DOM 요소가 준비될 때까지 대기
        this.qcm_waitForDOM();
        this.hasInitialized = true;
    }

    // ===== DOM 요소 대기 함수 (개선) =====
    qcm_waitForDOM() {
        const checkDOM = () => {
            const questionsGrid = document.getElementById('questionsGrid');
            const questionsLoading = document.getElementById('questionsLoading');
            
            console.log('DOM 확인:', {
                questionsGrid: !!questionsGrid,
                questionsLoading: !!questionsLoading,
                retryCount: this.retryCount
            });
            
            if (questionsGrid && questionsLoading) {
                console.log('DOM 요소 확인 완료, 데이터 로드 시작');
                if (this.domCheckInterval) {
                    clearInterval(this.domCheckInterval);
                    this.domCheckInterval = null;
                }
                this.qcm_loadQuestionsList();
            } else {
                console.log('DOM 요소 대기 중...');
            }
        };

        // 즉시 한 번 체크
        checkDOM();
        
        // DOM이 없으면 100ms마다 체크 (최대 10초)
        if (!this.domCheckInterval) {
            let attempts = 0;
            this.domCheckInterval = setInterval(() => {
                attempts++;
                if (attempts > 100) { // 10초 후 포기
                    console.warn('DOM 요소를 찾을 수 없습니다. 타임아웃.');
                    clearInterval(this.domCheckInterval);
                    this.domCheckInterval = null;
                    return;
                }
                checkDOM();
            }, 100);
        }
    }

    // ===== cNum을 서버에 전달하는 기본 함수 (개선) =====
    async qcm_sendToServer(action = 'list', additionalData = {}) {
        try {
            // 이미 로딩 중인 경우 중복 요청 방지
            if (this.isLoading) {
                console.log('이미 로딩 중입니다. 요청을 건너뜁니다.');
                return null;
            }

            this.isLoading = true;
            this.qcm_showLoading(true);
            
            console.log('서버 요청 시작:', { action, additionalData });
            
            // FormData 생성
            const formData = new FormData();
            
            // 기본 액션 설정
            formData.append('action', action);
            
            // cNum 추가 (세션에서 가져오기)
            const cNum = sessionStorage.getItem('cNum');
            if (cNum) {
                formData.append('cNum', cNum);
                console.log('cNum 전달:', cNum);
            } else {
                throw new Error('cNum을 찾을 수 없습니다. 로그인 상태를 확인해주세요.');
            }
            
            // 추가 데이터가 있으면 FormData에 추가
            for (const [key, value] of Object.entries(additionalData)) {
                formData.append(key, value);
            }
            
            // 서버로 POST 요청 전송
            const response = await fetch('api/questionsList.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            console.log('서버 응답 상태:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('서버 응답 데이터:', result);
            
            if (!result.success) {
                throw new Error(result.message || '서버 처리 중 오류가 발생했습니다.');
            }
            
            this.currentData = result;
            this.retryCount = 0; // 성공 시 재시도 카운트 리셋
            return result;

        } catch (error) {
            console.error('서버 전송 오류:', error);
            
            // 재시도 로직 추가
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`재시도 ${this.retryCount}/${this.maxRetries}...`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
                return this.qcm_sendToServer(action, additionalData);
            }
            
            this.qcm_showError('서버 통신 중 오류가 발생했습니다: ' + error.message);
            throw error;
        } finally {
            this.isLoading = false;
            this.qcm_showLoading(false);
        }
    }

    // ===== 로딩 상태 표시/숨김 (안전성 강화) =====
    qcm_showLoading(show) {
        try {
            const loadingElement = document.getElementById('questionsLoading');
            const gridElement = document.getElementById('questionsGrid');
            const noDataElement = document.getElementById('noDataMessage');
            const paginationElement = document.getElementById('questionsPagination');
            
            console.log('로딩 상태 변경:', show, {
                loadingElement: !!loadingElement,
                gridElement: !!gridElement,
                noDataElement: !!noDataElement,
                paginationElement: !!paginationElement
            });
            
            if (loadingElement) {
                loadingElement.style.display = show ? 'block' : 'none';
            }
            if (gridElement) {
                gridElement.style.display = show ? 'none' : 'grid';
            }
            if (noDataElement && !show) {
                noDataElement.style.display = 'none';
            }
            if (paginationElement) {
                paginationElement.style.display = show ? 'none' : 'flex';
            }
        } catch (error) {
            console.error('로딩 상태 변경 오류:', error);
        }
    }

    // ===== 질문서 카드 그리드 렌더링 (안전성 강화) =====
    qcm_renderQuestionsGrid(data) {
        try {
            const gridElement = document.getElementById('questionsGrid');
            const noDataElement = document.getElementById('noDataMessage');
            
            console.log('카드 그리드 렌더링 시작:', {
                gridElement: !!gridElement,
                noDataElement: !!noDataElement,
                dataExists: !!(data && data.questions),
                questionCount: data && data.questions ? data.questions.length : 0
            });
            
            if (!gridElement) {
                console.error('questionsGrid 요소를 찾을 수 없습니다.');
                return;
            }

            // 그리드 초기화
            gridElement.innerHTML = '';

            // 데이터가 없는 경우
            if (!data || !data.questions || data.questions.length === 0) {
                gridElement.style.display = 'none';
                if (noDataElement) noDataElement.style.display = 'block';
                console.log('데이터가 없어 빈 상태를 표시합니다.');
                return;
            }

            // 그리드 표시
            gridElement.style.display = 'grid';
            if (noDataElement) noDataElement.style.display = 'none';

            // 각 질문서 데이터를 카드로 변환
            data.questions.forEach((question, index) => {
                try {
                    const card = this.qcm_createQuestionCard(question, index + 1);
                    gridElement.appendChild(card);
                } catch (cardError) {
                    console.error(`카드 생성 오류 (${index + 1}):`, cardError, question);
                }
            });

            // 페이지네이션 정보 업데이트
            this.qcm_updatePaginationInfo(data);
            
            console.log('카드 그리드 렌더링 완료');
        } catch (error) {
            console.error('카드 그리드 렌더링 오류:', error);
        }
    }

    // ===== 학기 구분 함수 =====
    qcm_getSemesterName(school6) {
        let hargi = '';
        switch (parseInt(school6)) {
            case 1:
                hargi = '1학기';
                break;
            case 2:
                hargi = '하계계절';
                break;
            case 3:
                hargi = '2학기';
                break;
            case 4:
                hargi = '동계계절';
                break;
            default:
                hargi = '미정';
                break;
        }
        return hargi;
    }

    // ===== 이미지 타입별 분류 함수 (카드전표 추가) =====
    qcm_categorizeImages(images) {
        const categories = {
            question: { original: null, stamped: null },          // 질문서 (원본/날인본)
            subscription: { original: null, stamped: null },      // 청약서 (원본/날인본)
            department: { original: null, stamped: null },        // 과별인원 (원본/날인본)
            receipt: { original: null },                          // 영수증 (원본만)
            certificate: { original: null },                     // 증권 (원본만)
            cardSlip: { original: null }                          // 카드전표 (원본만) - 새로 추가
        };

        if (!images || !Array.isArray(images)) {
            return categories;
        }

        console.log('이미지 분류 시작:', images);

        images.forEach(img => {
            if (!img.kind_text && !img.kind) return;

            // kind_text와 kind 모두 확인
            const kindText = (img.kind_text || '').toLowerCase();
            const kind = img.kind ? parseInt(img.kind) : null;
            
            console.log('이미지 분류 중:', { kind, kindText, img });
            
            // kind 숫자로 먼저 분류 (더 정확함)
            if (kind !== null) {
                switch (kind) {
                    case 1: // 카드전표
                        categories.cardSlip.original = img;
                        console.log('카드전표 분류됨');
                        break;
                    case 8: // 청약서날인본
                        categories.subscription.stamped = img;
                        console.log('청약서 날인본 분류됨');
                        break;
                    case 9: // 질문서날인본
                        categories.question.stamped = img;
                        console.log('질문서 날인본 분류됨');
                        break;
                    case 10: // 과별인원날인본
                        categories.department.stamped = img;
                        console.log('과별인원 날인본 분류됨');
                        break;
                    default:
                        // 기타 kind 값들은 텍스트로 분류
                        this.qcm_categorizeByText(img, kindText, categories);
                        break;
                }
            } else {
                // kind가 없으면 텍스트로 분류
                this.qcm_categorizeByText(img, kindText, categories);
            }
        });

        console.log('이미지 분류 결과:', categories);
        return categories;
    }

    // ===== 텍스트 기반 이미지 분류 보조 함수 (카드전표 추가) =====
    qcm_categorizeByText(img, kindText, categories) {
        // 카드전표 분류 (새로 추가)
        if (kindText.includes('카드전표') || kindText.includes('card')) {
            categories.cardSlip.original = img;
            console.log('카드전표 분류됨 (텍스트)');
        }
        // 질문서 분류
        else if (kindText.includes('질문서')) {
            if (kindText.includes('날인본')) {
                categories.question.stamped = img;
                console.log('질문서 날인본 분류됨 (텍스트)');
            } else {
                categories.question.original = img;
                console.log('질문서 원본 분류됨 (텍스트)');
            }
        }
        // 청약서 분류
        else if (kindText.includes('청약서')) {
            if (kindText.includes('날인본')) {
                categories.subscription.stamped = img;
                console.log('청약서 날인본 분류됨 (텍스트)');
            } else {
                categories.subscription.original = img;
                console.log('청약서 원본 분류됨 (텍스트)');
            }
        }
        // 과별인원 분류
        else if (kindText.includes('과별인원')) {
            if (kindText.includes('날인본')) {
                categories.department.stamped = img;
                console.log('과별인원 날인본 분류됨 (텍스트)');
            } else {
                categories.department.original = img;
                console.log('과별인원 원본 분류됨 (텍스트)');
            }
        }
        // 영수증 분류 (원본만)
        else if (kindText.includes('영수증') || kindText.includes('receipt')) {
            categories.receipt.original = img;
            console.log('영수증 분류됨 (텍스트)');
        }
        // 증권 분류 (원본만, 기타 문서들)
        else {
            categories.certificate.original = img;
            console.log('증권 분류됨 (텍스트)');
        }
    }

    // ===== 질문서 카드 생성 함수 (카드전표 지원 추가) =====
    qcm_createQuestionCard(question, cardNumber) {
        const card = document.createElement('div');
        card.className = 'question-card fade-in';
        
        // 학기 구분
        const semester = this.qcm_getSemesterName(question.school6);
        
        // 보험기간 계산 (시작일 ~ 종료일)
        const insurancePeriod = `${question.school7} ~ ${question.school8}`;
        
        // 실습기간 계산 (시작일부터 종료일까지의 일수)
        const startDate = new Date(question.school7);
        const endDate = new Date(question.school8);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        // 보험료 포맷팅 (천단위 콤마)
        const formattedPrice = Number(question.preiminum || 0).toLocaleString('ko-KR');
        
        // 진행상태 결정
        const status = this.qcm_getQuestionStatus(question, question.ch);
		
		 // ✅ 여기에 추가! ✅
		// 상태가 '44'일 때 결제 버튼 추가
		let paymentButton = '';
		
		 console.log(' 결제정보',question.ch);
		if (question.ch === '44') {
			paymentButton = `
				<button class="logout-btn" onclick="qcm_showPaymentModal(${question.num})" title="결제 정보를 입력해주세요">
					💳 결제하기
				</button>
			`;
		}
    // ✅ 여기까지 추가! ✅
        
        // 이미지 분류 (카드전표 포함)
        const imageCategories = this.qcm_categorizeImages(question.images);
        
        // 디버깅용 로그 추가
        console.log(`질문서 ${question.num} 이미지 분류:`, imageCategories);
        
        // 각 문서별 상태 및 다운로드 버튼 생성
        const documentButtons = this.qcm_getDocumentButtons(question, imageCategories);
        
        // 우측 컬럼에 표시할 문서들을 동적으로 생성
        let rightColumnHTML = `
            <div class="info-row document-row">
                <span class="info-label">
                    <i class="fas fa-file-alt"></i>
                    질문서
                </span>
                <span class="info-value">
                    <span class="document-status available"></span>
                    ${documentButtons.question}
                </span>
            </div>
        `;

        // 증권번호가 있는지 확인
        const hasCertificate = question.certi && question.certi.trim() !== '';
        
        // 학교 구분 확인 (고등학교인지)
        const directory = sessionStorage.getItem('directory');
        const isHighSchool = directory === '2';

        // 증권번호가 없을 때만 청약서 관련 문서들 표시
        if (!hasCertificate) {
            // 과별인원 (청약서가 있을 때만 표시)
            if (documentButtons.subscription.hasFile) {
                rightColumnHTML += `
                    <div class="info-row document-row">
                        <span class="info-label">
                            <i class="fas fa-users-cog"></i>
                            과별인원
                        </span>
                        <span class="info-value">
                            ${documentButtons.department.status}
                            ${documentButtons.department.buttons}
                        </span>
                    </div>
                `;
            }

            // 청약서 (파일이 있을 때만 표시)
            if (documentButtons.subscription.hasFile) {
                rightColumnHTML += `
                    <div class="info-row document-row">
                        <span class="info-label">
                            <i class="fas fa-file-contract"></i>
                            청약서
                        </span>
                        <span class="info-value">
                            ${documentButtons.subscription.status}
                            ${documentButtons.subscription.buttons}
                        </span>
                    </div>
                `;
            }
        }

        // 가입안내문 (고등학교일 때만 표시)
        if (isHighSchool) {
            rightColumnHTML += `
                <div class="info-row document-row">
                    <span class="info-label">
                        <i class="fas fa-file-text"></i>
                        가입안내문
                    </span>
                    <span class="info-value">
                        <span class="document-status available"></span>
                        <div class="document-buttons">
                            <button class="inline-download-btn" 
                                    onclick="qcm_downloadGuidance(${question.num})" 
                                    title="가입안내문 다운로드">
                                <i class="fas fa-download"></i>
                                <span class="btn-text">다운로드</span>
                            </button>
                        </div>
                    </span>
                </div>
            `;
        }

        // 증권번호 (증권번호가 있을 때만 표시)
        if (hasCertificate) {
            rightColumnHTML += `
                <div class="info-row document-row">
                    <span class="info-label">
                        <i class="fas fa-certificate"></i>
                        증권번호
                    </span>
                    <span class="info-value">
                        <span class="certificate-number">${question.certi}</span> 
                        ${documentButtons.certificate.buttons}
                    </span>
                </div>
            `;
        }

        // 영수증 (파일이 있을 때만 표시)
        if (documentButtons.receipt.hasFile) {
            rightColumnHTML += `
                <div class="info-row document-row">
                    <span class="info-label">
                        <i class="fas fa-receipt"></i>
                        영수증
                    </span>
                    <span class="info-value">
                        ${documentButtons.receipt.status}
                        ${documentButtons.receipt.buttons}
                    </span>
                </div>
            `;
        }

        // 카드전표 (파일이 있을 때만 표시)
        if (documentButtons.cardSlip.hasFile) {
            rightColumnHTML += `
                <div class="info-row document-row">
                    <span class="info-label">
                        <i class="fas fa-credit-card"></i>
                        카드전표
                    </span>
                    <span class="info-value">
                        ${documentButtons.cardSlip.status}
                        ${documentButtons.cardSlip.buttons}
                    </span>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-number">No. ${cardNumber}</div>
                <div class="status-badge ${status.class}">${status.text}</div>
				${paymentButton}
            </div>
            <div class="card-content">
                <div class="insurance-period-full">
                    <span class="info-label">
                        <i class="fas fa-calendar-check"></i>
                        보험기간
                    </span>
                    <span class="info-value">${insurancePeriod}</span>
                </div>
                <div class="card-body-columns">
                    <div class="card-left-column">
                        <div class="info-row">
                            <span class="info-label">
                                <i class="fas fa-calendar-alt"></i>
                                학기구분
                            </span>
                            <span class="info-value">
                                <span class="semester-badge">${semester}</span>
                            </span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">
                                <i class="fas fa-clock"></i>
                                실습기간
                            </span>
                            <span class="info-value">${diffDays}일</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">
                                <i class="fas fa-users"></i>
                                참여인원
                            </span>
                            <span class="info-value">${question.week_total || 0}명</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">
                                <i class="fas fa-won-sign"></i>
                                보험료
                            </span>
                            <span class="info-value">${formattedPrice}원</span>
                        </div>
                    </div>
                    <div class="card-right-column">
                        ${rightColumnHTML}
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    // ===== 문서별 다운로드 버튼 생성 함수 (카드전표 지원 추가) =====
    qcm_getDocumentButtons(question, imageCategories) {
        // 각 문서 타입별 버튼 생성 함수
        const createDocumentButtons = (category, docType, questionNum, hasStampedVersion = true) => {
            let buttons = '';
            let status = '';
            let hasFile = false;

            // 원본 파일이 있는지 확인
            const hasOriginal = category.original !== null;
            // 날인본 파일이 있는지 확인 (해당 문서 타입이 날인본을 지원하는 경우만)
            const hasStamped = hasStampedVersion && category.stamped !== null;
            
            hasFile = hasOriginal || hasStamped;

            if (hasFile) {
                status = '<span class="document-status available"></span>';
                
                // 다운로드 버튼들
                let downloadButtons = '<div class="document-buttons">';
                
                if (hasOriginal) {
                    // 날인본이 지원되는 문서 타입이면 "원본" 표시, 아니면 문서명만 표시
                    const btnText = hasStampedVersion ? '원본' : this.qcm_getDocumentName(docType);
                    downloadButtons += `
                        <button class="inline-download-btn" 
                                onclick="qcm_downloadDocument(${questionNum}, '${docType}', 'original')" 
                                title="${this.qcm_getDocumentName(docType)} ${hasStampedVersion ? '원본' : ''} 다운로드">
                            <i class="fas fa-download"></i>
                            <span class="btn-text">${btnText}</span>
                        </button>`;
                }
                
                // 날인본 버튼 (날인본이 지원되는 문서만)
                if (hasStamped) {
                    downloadButtons += `
                        <button class="inline-view-btn stamped-premium" 
                                onclick="qcm_openStampedPreviewModal(${questionNum}, '${docType}', 'stamped')" 
                                title="${this.qcm_getDocumentName(docType)} 날인본 미리보기">
                            <i class="fas fa-stamp"></i>
                            <span class="btn-text">날인본</span>
                        </button>`;
                }
                
                // 업로드 버튼 (질문서, 청약서, 과별인원만 지원)
                if (docType === 'question' || docType === 'subscription' || docType === 'department') {
                    downloadButtons += `
                        <button class="inline-upload-btn" 
                                onclick="qcm_openUploadModal(${questionNum}, '${docType}')" 
                                title="${this.qcm_getDocumentName(docType)} 업로드">
                            <i class="fas fa-upload"></i>
                        </button>`;
                }
                
                downloadButtons += '</div>';
                buttons = downloadButtons;
            } else {
                status = '<span class="document-status preparing">준비중</span>';
                // 업로드 버튼은 질문서, 청약서, 과별인원만 제공
                if (docType === 'question' || docType === 'subscription' || docType === 'department') {
                    buttons = `
                        <button class="inline-upload-btn" 
                                onclick="qcm_openUploadModal(${question.num}, '${docType}')" 
                                title="${this.qcm_getDocumentName(docType)} 업로드">
                            <i class="fas fa-upload"></i>
                        </button>`;
                }
            }

            return { hasFile, status, buttons };
        };

        return {
            // 질문서 (날인본 지원, 동적 처리)
            question: (() => {
                const questionResult = createDocumentButtons(imageCategories.question, 'question', question.num, true);
                
                // 증권이 있는지 확인
                const hasCertificate = question.certi && question.certi.trim() !== '';
                
                let questionButtons = '<div class="document-buttons">';
                
                if (hasCertificate) {
                    // 증권이 있는 경우: 날인본만 표시
                    if (imageCategories.question.stamped) {
                        questionButtons += `
                            <button class="inline-view-btn stamped-premium" 
                                    onclick="qcm_openStampedPreviewModal(${question.num}, 'question', 'stamped')" 
                                    title="질문서 날인본 미리보기">
                                <i class="fas fa-stamp"></i>
                                <span class="btn-text">날인본</span>
                            </button>`;
                    }
                } else {
                    // 증권이 없는 경우: 기존 로직 유지 (모든 버튼 표시)
                    
                    // 기본 질문서 보기 버튼 (항상 표시)
                    questionButtons += `
                        <button class="inline-download-btn" onclick="qcm_viewQuestionDetail(${question.num})" title="질문서 보기">
                            <i class="fas fa-stamp"></i>
                            <span class="btn-text">보기</span>
                        </button>`;
                    
                    // 질문서 원본이 있으면 원본 다운로드 버튼
                    if (imageCategories.question.original) {
                        questionButtons += `
                            <button class="inline-download-btn" 
                                    onclick="qcm_downloadDocument(${question.num}, 'question', 'original')" 
                                    title="질문서 원본 다운로드">
                                <i class="fas fa-download"></i>
                                <span class="btn-text">원본</span>
                            </button>`;
                    }
                    
                    // 질문서 날인본이 있으면 날인본 다운로드 버튼
                    if (imageCategories.question.stamped) {
                        questionButtons += `
                            <button class="inline-view-btn stamped-premium" 
                                    onclick="qcm_openStampedPreviewModal(${question.num}, 'question', 'stamped')" 
                                    title="질문서 날인본 미리보기">
                                <i class="fas fa-stamp"></i>
                                <span class="btn-text">날인본</span>
                            </button>`;
                    }
                    
                    // 업로드 버튼 (항상 표시)
                    questionButtons += `
                        <button class="inline-upload-btn" onclick="qcm_openUploadModal(${question.num}, 'question')" title="질문서 업로드">
                            <i class="fas fa-upload"></i>
                        </button>`;
                }
                
                questionButtons += '</div>';
                
                return questionButtons;
            })(),
            
            // 청약서 (날인본 지원)
            subscription: createDocumentButtons(imageCategories.subscription, 'subscription', question.num, true),
            
            // 과별인원 (날인본 지원)
            department: (() => {
                const result = createDocumentButtons(imageCategories.department, 'department', question.num, true);
                // 과별인원은 청약서가 있을 때만 표시하되, 예시파일 다운로드는 항상 가능
                if (!result.hasFile) {
                    result.buttons = `
                        <div class="document-buttons">
                            <button class="inline-download-btn" onclick="qcm_downloadDepartmentSample()" title="과별인원 예시파일 다운로드">
                                <i class="fas fa-download"></i>
                                <span class="btn-text">예시</span>
                            </button>
                            <button class="inline-upload-btn" onclick="qcm_openUploadModal(${question.num}, 'department')" title="과별인원 업로드">
                                <i class="fas fa-upload"></i>
                            </button>
                        </div>`;
                    result.status = '<span class="document-status preparing"></span>';
                }
                return result;
            })(),
            
            // 증권번호 (날인본 지원 안함)
            certificate: (() => {
                const result = createDocumentButtons(imageCategories.certificate, 'certificate', question.num, false);
                if (question.certi && !result.hasFile) {
                    // 증권번호는 있지만 파일이 없는 경우 기본 다운로드 버튼
                    result.buttons = `
                        <button class="inline-download-btn" onclick="qcm_downloadCertificate(${question.num})" title="증권 다운로드">
                            <i class="fas fa-download"></i>
                        </button>`;
                    result.hasFile = true;
                }
                return result;
            })(),
            
            // 영수증 (날인본 지원 안함)
            receipt: createDocumentButtons(imageCategories.receipt, 'receipt', question.num, false),

            // 카드전표 (날인본 지원 안함) - 새로 추가
            cardSlip: createDocumentButtons(imageCategories.cardSlip, 'cardSlip', question.num, false)
        };
    }

    // ===== 문서명 반환 함수 (카드전표 추가) =====
    qcm_getDocumentName(docType) {
        const names = {
            'question': '질문서',
            'subscription': '청약서',
            'department': '과별인원',
            'certificate': '증권',
            'receipt': '영수증',
            'cardSlip': '카드전표'  // 새로 추가
        };
        return names[docType] || '문서';
    }

    // ===== 질문서 상태 판단 =====
    qcm_getQuestionStatus(question, ch) {
        // ch 값을 문자열로 변환 (안전한 비교를 위해)
        const chValue = String(ch);
        
        // ch 값에 따른 상태 매핑
        const statusMap = {
            // 기본 상태
            '1': { text: '신청 완료', class: 'status-pending' },

            '3': { text: '청약서준비 완료되었으니, 질문서,과별인원,청약서 날인하여 업로드 하세요', class: 'status-pending' },
            
            '6': { text: '증권발급,영수증 다운로드 하세요 계약 완료입니다.', class: 'status-completed' },
            
            // 문서 업로드 상태 (단일)
            '38': { text: '청약서 업로드 완료', class: 'status-partial' },
            '39': { text: '청약서,과별인원 업로드 하세요', class: 'status-partial' },
            '40': { text: '과별인원 업로드 완료', class: 'status-partial' },
            
            // 문서 업로드 상태 (조합)
            '41': { text: '청약서+질문서 완료 과별인원 업로드 하세요 ', class: 'status-progress' },
            '42': { text: '청약서+과별인원 완료 질문서 업로드 하세요' , class: 'status-progress' },
            '43': { text: '질문서+과별인원 완료 청약서 업로드 하세요', class: 'status-progress' },
            
            // 모든 문서 업로드 완료
           '44': { 
				text: '서류 완료 - 결제 정보를 입력해주세요', 
				class: 'status-ready',
				action: 'showPaymentModal'  // 👈 액션 추가
			},
            
            // 심사 단계
       /*     '45': { text: '심사 대기중', class: 'status-review' },
            '46': { text: '심사 진행중', class: 'status-active' },
            '47': { text: '심사 완료', class: 'status-completed' },*/
		   '45': { text: '법인카드 결제 대기', class: 'status-review' },
			'46': { text: '가상계좌 입금 대기', class: 'status-active' },
			'47': { text: '개인카드 승인 대기', class: 'status-completed' },
            
            // 승인/반려
            '50': { text: '승인 완료', class: 'status-approved' },
            '51': { text: '조건부 승인', class: 'status-conditional' },
            '52': { text: '반려', class: 'status-rejected' },
            
            // 추가 조치 필요
            '60': { text: '서류 보완 요청', class: 'status-supplement' },
            '61': { text: '질의응답 대기', class: 'status-qa-pending' },
            '62': { text: '질의응답 완료', class: 'status-qa-completed' },
            
            // 최종 상태
            '70': { text: '프로세스 완료', class: 'status-finished' },
            '71': { text: '취소됨', class: 'status-cancelled' }
        };
        
        // ch 값에 해당하는 상태 반환, 없으면 기본값
        return statusMap[chValue] || { text: '상태 불명', class: 'status-unknown' };
    }

    // ===== 페이지네이션 정보 업데이트 =====
    qcm_updatePaginationInfo(data) {
        try {
            const paginationElement = document.getElementById('questionsPagination');
            const paginationInfo = document.getElementById('paginationInfo');
            const paginationButtons = document.getElementById('paginationButtons');
            
            if (!paginationElement) return;

            // 페이지네이션 정보 업데이트
            if (paginationInfo) {
                paginationInfo.textContent = `전체 ${data.total}개 (${data.page}/${data.total_pages} 페이지)`;
            }

            // 페이지가 1개보다 많을 때만 페이지네이션 표시
            if (data.total_pages > 1) {
                paginationElement.style.display = 'flex';
                this.qcm_renderPagination(data, paginationButtons);
            } else {
                paginationElement.style.display = 'none';
            }
        } catch (error) {
            console.error('페이지네이션 업데이트 오류:', error);
        }
    }

    // ===== 페이지네이션 렌더링 =====
    qcm_renderPagination(data, paginationButtons) {
        if (!paginationButtons) return;

        let paginationHTML = '';
        
        // 이전 페이지 버튼
        if (data.page > 1) {
            paginationHTML += `<button onclick="qcm_loadQuestionsList({page: ${data.page - 1}})" class="page-btn">이전</button>`;
        }
        
        // 페이지 번호 버튼들
        const startPage = Math.max(1, data.page - 2);
        const endPage = Math.min(data.total_pages, data.page + 2);
        
        for (let i = startPage; i <= endPage; i++) {
            const activeClass = i === data.page ? 'active' : '';
            paginationHTML += `<button onclick="qcm_loadQuestionsList({page: ${i}})" class="page-btn ${activeClass}">${i}</button>`;
        }
        
        // 다음 페이지 버튼
        if (data.page < data.total_pages) {
            paginationHTML += `<button onclick="qcm_loadQuestionsList({page: ${data.page + 1}})" class="page-btn">다음</button>`;
        }
        
        paginationButtons.innerHTML = paginationHTML;
    }

    // ===== 질문서 목록 요청 (메인 함수) =====
    async qcm_loadQuestionsList(options = {}) {
        try {
            console.log('질문서 목록 로드 요청:', options);
            
            const searchParams = {
                page: options.page || 1,
                limit: options.limit || 15,
                search_school: options.searchSchool || '',
                search_mode: options.searchMode || 1
            };
            
            const result = await this.qcm_sendToServer('list', searchParams);
            console.log('질문서 목록 조회 결과:', result);
            
            if (result && result.success) {
                // 카드 그리드 렌더링
                this.qcm_renderQuestionsGrid(result.data);
                this.qcm_showSuccess(result.message);
            } else {
                console.error('질문서 목록 조회 실패:', result);
            }
            
            return result;
        } catch (error) {
            console.error('질문서 목록 조회 실패:', error);
            return null;
        }
    }

    // ===== 에러 메시지 표시 =====
    qcm_showError(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            console.error('QCM Error:', message);
            alert('오류: ' + message);
        }
    }

    // ===== 성공 메시지 표시 =====
    qcm_showSuccess(message) {
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        } else {
            console.log('QCM Success:', message);
        }
    }

    // ===== 인스턴스 정리 =====
    destroy() {
        console.log('질문서 관리자 인스턴스 정리');
        if (this.domCheckInterval) {
            clearInterval(this.domCheckInterval);
            this.domCheckInterval = null;
        }
        this.hasInitialized = false;
        this.isLoading = false;
        this.currentData = null;
    }
}

// 전역 클래스 등록
window.QCM_QuestionsCardManagerV2 = QCM_QuestionsCardManagerV2;

// ===== 전역 함수들 (외부에서 호출 가능, 고유 접두사 사용) =====

// 질문서 목록 로드 (페이지네이션 및 검색 지원) - 강화된 버전
function qcm_loadQuestionsList(options = {}) {
    console.log('전역 qcm_loadQuestionsList 호출:', options);
    
    // 관리자 인스턴스 확인 및 생성
    if (!window.qcm_questionsManager) {
        console.log('새로운 질문서 관리자 생성');
        window.qcm_questionsManager = new QCM_QuestionsCardManagerV2();
    } else {
        console.log('기존 질문서 관리자 사용');
    }
    
    return window.qcm_questionsManager.qcm_loadQuestionsList(options);
}

// 관리자 재시작 함수 (디버깅용)
function qcm_restartManager() {
    console.log('질문서 관리자 재시작');
    
    if (window.qcm_questionsManager) {
        window.qcm_questionsManager.destroy();
    }
    
    window.qcm_questionsManager = new QCM_QuestionsCardManagerV2();
    return window.qcm_questionsManager;
}

// 현재 상태 확인 함수 (디버깅용)
function qcm_getStatus() {
    return {
        scriptLoaded: !!window.QCM_SCRIPT_LOADED,
        managerExists: !!window.qcm_questionsManager,
        classExists: !!window.QCM_QuestionsCardManagerV2,
        isLoading: window.qcm_questionsManager ? window.qcm_questionsManager.isLoading : false,
        hasInitialized: window.qcm_questionsManager ? window.qcm_questionsManager.hasInitialized : false,
        domElements: {
            questionsGrid: !!document.getElementById('questionsGrid'),
            questionsLoading: !!document.getElementById('questionsLoading'),
            noDataMessage: !!document.getElementById('noDataMessage'),
            questionsPagination: !!document.getElementById('questionsPagination')
        }
    };
}

// 특정 질문서 조회
async function qcm_getQuestion(questionId) {
    if (!window.qcm_questionsManager) {
        window.qcm_questionsManager = new QCM_QuestionsCardManagerV2();
    }
    
    if (!questionId) {
        window.qcm_questionsManager.qcm_showError('질문서 ID가 필요합니다.');
        return null;
    }
    
    try {
        const result = await window.qcm_questionsManager.qcm_sendToServer('get', { id: questionId });
        console.log('질문서 조회 완료:', result);
        return result;
    } catch (error) {
        console.error('질문서 조회 실패:', error);
        return null;
    }
}

// 질문서 검색 (편의 함수)
function qcm_searchQuestions(searchSchool = '', searchMode = 1, page = 1) {
    return qcm_loadQuestionsList({
        searchSchool: searchSchool,
        searchMode: searchMode,
        page: page
    });
}

// 질문서 상세보기
function qcm_viewQuestionDetail(questionId) {
    console.log('질문서 상세보기:', questionId);
    
    if (!questionId) {
        alert('질문서 ID가 없습니다.');
        return;
    }
    
    // 새창으로 질문서 열기
    const url = `https://silbo.kr/2014/_pages/php/downExcel/claim2.php?claimNum=${questionId}`;
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
}

// ===== 날인본 지원 문서 다운로드 함수 (카드전표 지원 추가) =====
function qcm_downloadDocument(questionId, docType, version = 'original') {
    console.log('문서 다운로드:', { questionId, docType, version });
    
    if (!questionId) {
        alert('질문서 ID가 없습니다.');
        return;
    }
    
    // 현재 질문서 데이터에서 해당 문서 찾기
    if (!window.qcm_questionsManager || !window.qcm_questionsManager.currentData) {
        alert('질문서 데이터를 찾을 수 없습니다. 페이지를 새로고침하세요.');
        return;
    }
    
    const questions = window.qcm_questionsManager.currentData.data.questions;
    const question = questions.find(q => q.num == questionId);
    
    if (!question) {
        alert('해당 질문서를 찾을 수 없습니다.');
        return;
    }
    
    // 이미지 분류
    const imageCategories = window.qcm_questionsManager.qcm_categorizeImages(question.images);
    
    let targetImage = null;
    
    // 문서 타입과 버전에 따라 적절한 이미지 선택
    switch (docType) {
        case 'question':
            targetImage = version === 'stamped' ? imageCategories.question.stamped : imageCategories.question.original;
            break;
        case 'subscription':
            targetImage = version === 'stamped' ? imageCategories.subscription.stamped : imageCategories.subscription.original;
            break;
        case 'department':
            targetImage = version === 'stamped' ? imageCategories.department.stamped : imageCategories.department.original;
            break;
        case 'receipt':
            // 영수증은 날인본이 없으므로 항상 original
            targetImage = imageCategories.receipt.original;
            break;
        case 'certificate':
            // 증권은 날인본이 없으므로 항상 original
            targetImage = imageCategories.certificate.original;
            break;
        case 'cardSlip':
            // 카드전표는 날인본이 없으므로 항상 original - 새로 추가
            targetImage = imageCategories.cardSlip.original;
            break;
    }
    
    if (!targetImage) {
        alert(`${window.qcm_questionsManager.qcm_getDocumentName(docType)} ${version === 'stamped' ? '날인본' : '원본'}을 찾을 수 없습니다.`);
        return;
    }
    
    // 파일 다운로드 실행
    if (targetImage.description2) {
        const downloadUrl = `${targetImage.description2}`;
        const fileName = targetImage.title || `${window.qcm_questionsManager.qcm_getDocumentName(docType)}_${version === 'stamped' ? '날인본' : '원본'}`;
        const fileExtension = targetImage.description2.split('.').pop() || 'jpg';
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${fileName}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('파일 다운로드 시작:', downloadUrl);
    } else {
        alert('파일 경로를 찾을 수 없습니다.');
    }
}

// 카드전표 다운로드 (새로 추가)
function qcm_downloadCardSlip(questionId) {
    qcm_downloadDocument(questionId, 'cardSlip', 'original');
}

// 청약서 다운로드 (호환성 유지)
function qcm_downloadSubscriptionForm(questionId) {
    qcm_downloadDocument(questionId, 'subscription', 'original');
}

// 증권 다운로드 (호환성 유지)
function qcm_downloadCertificate(questionId) {
    console.log('증권 다운로드:', questionId);
    
    if (!questionId) {
        alert('질문서 ID가 없습니다.');
        return;
    }
    
    // 기존 증권 다운로드 로직 유지 (서버에서 직접 생성하는 경우)
    const url = `api/downloadCertificate.php?questionId=${questionId}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `증권_${questionId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 영수증 다운로드 (호환성 유지)
function qcm_downloadReceipt(questionId) {
    qcm_downloadDocument(questionId, 'receipt', 'original');
}

// 과별인원 예시파일 다운로드
function qcm_downloadDepartmentSample() {
    console.log('과별인원 예시파일 다운로드');
    
    // 수정된 예시파일 다운로드 URL
    const url = 'https://silbo.kr/static/user/%EA%B3%BC%EB%B3%84%EC%9D%B8%EC%9B%90.xlsx';
    const link = document.createElement('a');
    link.href = url;
    link.download = '과별인원_예시.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 가입안내문 다운로드 (고등학교 전용)
function qcm_downloadGuidance(questionId) {
    console.log('가입안내문 다운로드:', questionId);
    
    if (!questionId) {
        alert('질문서 ID가 없습니다.');
        return;
    }
    
    // 고등학교인지 확인
    const directory = sessionStorage.getItem('directory');
    if (directory !== '2') {
        alert('가입안내문은 고등학교에서만 제공됩니다.');
        return;
    }
    
    // 가입안내문 다운로드 URL
    const url = `https://silbo.kr/2014/_pages/php/downExcel/claim9.php?claimNum=${questionId}`;
    window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
}

// 업로드 모달 열기 (기존 함수, 별도 파일에서 구현)
function qcm_openUploadModal(questionId, docType) {
    console.log('업로드 모달 열기:', { questionId, docType });
    
    // 업로드 관리자가 있는 경우 호출
    if (typeof window.qcm_uploadManager !== 'undefined' && window.qcm_uploadManager.openUploadModal) {
        window.qcm_uploadManager.openUploadModal(questionId, docType);
    } else {
        alert('업로드 기능을 사용할 수 없습니다. 업로드 관리자가 로드되지 않았습니다.');
    }
}

// 날인본 미리보기 모달 (새로 추가 - 카드전표 지원)
function qcm_openStampedPreviewModal(questionId, docType, version = 'stamped') {
    console.log('날인본 미리보기 모달 열기:', { questionId, docType, version });
    
    // 스탬프 미리보기 관리자가 있는 경우 호출
    if (typeof window.qcm_stampedPreviewManager !== 'undefined' && window.qcm_stampedPreviewManager.openPreviewModal) {
        window.qcm_stampedPreviewManager.openPreviewModal(questionId, docType, version);
    } else {
        // 간단한 팝업으로 대체
        const confirmDownload = confirm(`${window.qcm_questionsManager.qcm_getDocumentName(docType)} 날인본을 다운로드 하시겠습니까?`);
        if (confirmDownload) {
            qcm_downloadDocument(questionId, docType, version);
        }
    }
}

// 질문서 목록 새로고침 (강화된 버전)
function qcm_refreshQuestionsList() {
    console.log('질문서 목록 새로고침 요청');
    
    // 상태 확인
    const status = qcm_getStatus();
    console.log('현재 상태:', status);
    
    // DOM 요소가 없으면 관리자 재시작
    if (!status.domElements.questionsGrid || !status.domElements.questionsLoading) {
        console.log('DOM 요소가 없어 관리자를 재시작합니다.');
        qcm_restartManager();
        return;
    }
    
    // 관리자가 없으면 생성
    if (!window.qcm_questionsManager) {
        console.log('관리자가 없어 새로 생성합니다.');
        window.qcm_questionsManager = new QCM_QuestionsCardManagerV2();
        return;
    }
    
    // 정상적으로 목록 로드
    qcm_loadQuestionsList();
}

// 검색 폼 핸들러
function qcm_handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('searchSchool');
    const searchValue = searchInput ? searchInput.value.trim() : '';
    
    console.log('검색 요청:', searchValue);
    qcm_searchQuestions(searchValue, 2, 1); // 포함 검색으로 설정
}

// 검색 초기화
function qcm_resetSearch() {
    const searchInput = document.getElementById('searchSchool');
    if (searchInput) {
        searchInput.value = '';
    }
    console.log('검색 초기화');
    qcm_loadQuestionsList(); // 전체 목록 다시 로드
}

// ===== HTML에서 호출하는 전역 함수들 (중복 방지 및 강화) =====
if (typeof window.refreshQuestionsList === 'undefined') {
    window.refreshQuestionsList = function() {
        qcm_refreshQuestionsList();
    };
}

if (typeof window.handleSearch === 'undefined') {
    window.handleSearch = function(event) {
        qcm_handleSearch(event);
    };
}

if (typeof window.resetSearch === 'undefined') {
    window.resetSearch = function() {
        qcm_resetSearch();
    };
}

// ===== 초기화 함수 (강화) =====
function qcm_initQuestionsManager() {
    console.log('질문서 관리자 초기화 시도');
    
    if (typeof QCM_QuestionsCardManagerV2 !== 'undefined') {
        if (!window.qcm_questionsManager) {
            console.log('새로운 질문서 관리자 생성');
            window.qcm_questionsManager = new QCM_QuestionsCardManagerV2();
        } else {
            console.log('기존 관리자 존재, 상태 확인');
            const status = qcm_getStatus();
            console.log('관리자 상태:', status);
            
            // DOM 요소가 변경되었거나 초기화되지 않은 경우
            if (!status.domElements.questionsGrid || !status.hasInitialized) {
                console.log('관리자 재초기화 필요');
                window.qcm_questionsManager.destroy();
                window.qcm_questionsManager = new QCM_QuestionsCardManagerV2();
            }
        }
        console.log('질문서 카드 관리자 초기화 완료');
    } else {
        console.warn('QCM_QuestionsCardManagerV2 클래스를 찾을 수 없습니다.');
    }
}

// 강화된 초기화 로직
if (!window.qcm_initialized) {
    window.qcm_initialized = true;
    
    console.log('질문서 관리 시스템 최초 초기화');
    
    // DOM 로드 완료 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', qcm_initQuestionsManager);
    } else {
        // 이미 DOM이 로드된 경우 즉시 초기화
        setTimeout(qcm_initQuestionsManager, 100);
    }

    // 페이지 로드 완료 후에도 한 번 더 확인
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!window.qcm_questionsManager) {
                console.log('페이지 로드 후 관리자가 없어 재초기화');
                qcm_initQuestionsManager();
            }
        }, 200);
    });
} else {
    console.log('질문서 관리 시스템 재초기화');
    
    // 이미 초기화되었지만 DOM 요소가 바뀌었을 수 있으므로 관리자 재시작
    setTimeout(() => {
        const status = qcm_getStatus();
        console.log('재초기화 시 상태:', status);
        
        if (status.domElements.questionsGrid && status.domElements.questionsLoading) {
            if (window.qcm_questionsManager) {
                console.log('기존 관리자로 데이터 로드');
                window.qcm_questionsManager.qcm_loadQuestionsList();
            } else {
                console.log('관리자가 없어 새로 생성');
                qcm_initQuestionsManager();
            }
        } else {
            console.log('DOM 요소가 준비되지 않음, 대기');
        }
    }, 100);
}

console.log('질문서 카드 관리 스크립트 로드 완료 (카드전표 지원 버전)');

// 스크립트 중복 로드 방지 블록 종료
}

// ===== 전역 함수들은 항상 최신 상태로 유지 (중복 로드 방지 블록 외부) =====

// 질문서 목록 로드 함수 (항상 사용 가능하도록)
if (typeof window.qcm_loadQuestionsList === 'undefined') {
    window.qcm_loadQuestionsList = function(options = {}) {
        console.log('전역 qcm_loadQuestionsList 호출 (fallback):', options);
        
        if (!window.qcm_questionsManager && window.QCM_QuestionsCardManagerV2) {
            window.qcm_questionsManager = new QCM_QuestionsCardManagerV2();
        }
        
        if (window.qcm_questionsManager) {
            return window.qcm_questionsManager.qcm_loadQuestionsList(options);
        } else {
            console.error('질문서 관리자를 초기화할 수 없습니다.');
            return null;
        }
    };
}

// 기타 전역 함수들 (HTML에서 호출하는 함수들)
if (typeof window.refreshQuestionsList === 'undefined') {
    window.refreshQuestionsList = function() {
        if (typeof qcm_refreshQuestionsList === 'function') {
            qcm_refreshQuestionsList();
        }
    };
}

if (typeof window.handleSearch === 'undefined') {
    window.handleSearch = function(event) {
        if (typeof qcm_handleSearch === 'function') {
            qcm_handleSearch(event);
        }
    };
}

if (typeof window.resetSearch === 'undefined') {
    window.resetSearch = function() {
        if (typeof qcm_resetSearch === 'function') {
            qcm_resetSearch();
        }
    };
}

// ===== 디버깅 및 문제 해결을 위한 추가 함수들 =====

// 강제 재로드 함수 (문제 발생 시 사용)
function qcm_forceReload() {
    console.log('질문서 시스템 강제 재로드');
    
    // 기존 관리자 정리
    if (window.qcm_questionsManager) {
        window.qcm_questionsManager.destroy();
        window.qcm_questionsManager = null;
    }
    
    // 스크립트 로드 플래그 초기화
    window.QCM_SCRIPT_LOADED = false;
    window.qcm_initialized = false;
    
    // 재초기화
    setTimeout(() => {
        window.QCM_SCRIPT_LOADED = true;
        window.qcm_initialized = true;
        qcm_initQuestionsManager();
    }, 100);
}

// 시스템 상태 진단 함수
function qcm_diagnose() {
    const status = qcm_getStatus();
    
    console.group('=== 질문서 시스템 진단 ===');
    console.log('스크립트 로드됨:', status.scriptLoaded);
    console.log('관리자 존재:', status.managerExists);
    console.log('클래스 존재:', status.classExists);
    console.log('로딩 중:', status.isLoading);
    console.log('초기화됨:', status.hasInitialized);
    console.log('DOM 요소들:', status.domElements);
    
    // 문제 진단
    const issues = [];
    if (!status.scriptLoaded) issues.push('스크립트가 로드되지 않음');
    if (!status.classExists) issues.push('클래스가 정의되지 않음');
    if (!status.managerExists) issues.push('관리자 인스턴스가 없음');
    if (!status.hasInitialized) issues.push('초기화되지 않음');
    if (!status.domElements.questionsGrid) issues.push('questionsGrid 요소 없음');
    if (!status.domElements.questionsLoading) issues.push('questionsLoading 요소 없음');
    
    if (issues.length > 0) {
        console.warn('발견된 문제들:', issues);
        console.log('해결 방법: qcm_forceReload() 함수를 실행하세요.');
    } else {
        console.log('✅ 모든 시스템이 정상입니다.');
    }
    
    console.groupEnd();
    
    return { status, issues };
}

// 수동 데이터 로드 함수 (문제 해결용)
function qcm_manualLoad() {
    console.log('수동 데이터 로드 시도');
    
    const diagnosis = qcm_diagnose();
    
    if (diagnosis.issues.length > 0) {
        console.log('문제가 있어 강제 재로드를 실행합니다.');
        qcm_forceReload();
        return;
    }
    
    if (window.qcm_questionsManager) {
        window.qcm_questionsManager.qcm_loadQuestionsList();
    } else {
        console.error('관리자가 없습니다. qcm_forceReload()를 실행하세요.');
    }
}

window.qcm_diagnose = qcm_diagnose;
window.qcm_forceReload = qcm_forceReload;
window.qcm_manualLoad = qcm_manualLoad;
window.qcm_getStatus = qcm_getStatus;
window.qcm_restartManager = qcm_restartManager;
window.qcm_downloadDocument = qcm_downloadDocument;
window.qcm_downloadCardSlip = qcm_downloadCardSlip; // 카드전표 다운로드 함수 추가
window.qcm_downloadGuidance = qcm_downloadGuidance; // 가입안내문 다운로드 함수 추가
window.qcm_openStampedPreviewModal = qcm_openStampedPreviewModal;


