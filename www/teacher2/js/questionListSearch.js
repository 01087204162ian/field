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

    // ===== 질문서 카드 생성 함수 =====
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
        const currentDate = new Date();
        const status = this.qcm_getQuestionStatus(question, currentDate);
        
        // 각 문서별 상태 및 다운로드 버튼 생성
        const documentButtons = this.qcm_getDocumentButtons(question);
        
        // 우측 컬럼에 표시할 문서들을 동적으로 생성
        let rightColumnHTML = `
            <div class="info-row document-row">
                <span class="info-label">
                    <i class="fas fa-file-alt"></i>
                    질문서
                </span>
                <span class="info-value">
                    <span class="document-status available">다운로드 가능</span>
                    ${documentButtons.question}
                </span>
            </div>
        `;

        // 과별인원 (청약서가 있을 때만 표시)
        if (documentButtons.subscription.hasFile) {
            rightColumnHTML += `
                <div class="info-row document-row">
                    <span class="info-label">
                        <i class="fas fa-users-cog"></i>
                        과별인원
                    </span>
                    <span class="info-value">
                        <span class="document-status preparing">업로드 필요</span>
                        ${documentButtons.departmentList}
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
                        ${documentButtons.subscription.button}
                    </span>
                </div>
            `;
        }

        // 증권번호 (증권번호가 있을 때만 표시)
        if (question.certi) {
            rightColumnHTML += `
                <div class="info-row document-row">
                    <span class="info-label">
                        <i class="fas fa-certificate"></i>
                        증권번호
                    </span>
                    <span class="info-value">
                        <span class="certificate-number">${question.certi}</span> 
                        ${documentButtons.certificate}
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
                        ${documentButtons.receipt.button}
                    </span>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-number">No. ${cardNumber}</div>
                <div class="status-badge ${status.class}">${status.text}</div>
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

    // ===== 문서별 다운로드 버튼 생성 함수 =====
    qcm_getDocumentButtons(question) {
        const images = question.images || [];
        
        // 청약서 이미지 확인
        const hasSubscriptionForm = images.some(img => 
            img.kind_text && img.kind_text.includes('청약서')
        );
        
        // 영수증 이미지 확인
        const hasReceipt = images.some(img => 
            img.kind_text && (img.kind_text.includes('영수증') || img.kind_text.includes('receipt'))
        );
        
        return {
            // 질문서 (항상 다운로드 가능, 항상 업로드 가능)
            question: `
                <div class="document-buttons">
                    <button class="inline-download-btn" onclick="qcm_viewQuestionDetail(${question.num})" title="질문서 보기">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="inline-upload-btn" onclick="qcm_openUploadModal(${question.num}, 'question')" title="질문서 업로드">
                        <i class="fas fa-upload"></i>
                    </button>
                </div>`,
            
            // 청약서 (파일이 있을 때만 표시)
            subscription: {
                hasFile: hasSubscriptionForm,
                status: hasSubscriptionForm ? 
                    '<span class="document-status available">다운로드 가능</span>' : 
                    '<span class="document-status preparing">준비중</span>',
                button: hasSubscriptionForm ? 
                    `<div class="document-buttons">
                        <button class="inline-download-btn" onclick="qcm_downloadSubscriptionForm(${question.num})" title="청약서 다운로드">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="inline-upload-btn" onclick="qcm_openUploadModal(${question.num}, 'subscription')" title="청약서 업로드">
                            <i class="fas fa-upload"></i>
                        </button>
                    </div>` : ''
            },
            
            // 증권번호 (증권번호가 있으면 다운로드 가능)
            certificate: question.certi ? 
                `<button class="inline-download-btn" onclick="qcm_downloadCertificate(${question.num})" title="증권 다운로드">
                    <i class="fas fa-download"></i>
                </button>` : '',
            
            // 영수증 (파일이 있을 때만 표시)
            receipt: {
                hasFile: hasReceipt,
                status: hasReceipt ? 
                    '<span class="document-status available">다운로드 가능</span>' : 
                    '<span class="document-status preparing">준비중</span>',
                button: hasReceipt ? 
                    `<button class="inline-download-btn" onclick="qcm_downloadReceipt(${question.num})" title="영수증 다운로드">
                        <i class="fas fa-download"></i>
                    </button>` : ''
            },
            
            // 과별인원 (청약서가 있을 때만 업로드 버튼 표시)
            departmentList: hasSubscriptionForm ? `
                <div class="document-buttons">
                    <button class="inline-download-btn" onclick="qcm_downloadDepartmentSample()" title="과별인원 예시파일 다운로드">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="inline-upload-btn" onclick="qcm_openUploadModal(${question.num}, 'department')" title="과별인원 업로드">
                        <i class="fas fa-upload"></i>
                    </button>
                </div>` : `
                <button class="inline-download-btn" onclick="qcm_downloadDepartmentSample()" title="과별인원 예시파일 다운로드">
                    <i class="fas fa-download"></i>
                </button>`
        };
    }

    // ===== 질문서 상태 판단 =====
    qcm_getQuestionStatus(question, currentDate) {
        const startDate = new Date(question.school7);
        const endDate = new Date(question.school8);
        
        if (currentDate < startDate) {
            return { text: '시작 전', class: 'status-pending' };
        } else if (currentDate >= startDate && currentDate <= endDate) {
            return { text: '진행 중', class: 'status-active' };
        } else {
            return { text: '완료', class: 'status-completed' };
        }
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

// 과별인원 예시파일 다운로드 함수
function qcm_downloadDepartmentSample() {
    console.log('과별인원 예시파일 다운로드');
    
    // 예시파일 다운로드 URL (실제 파일 경로에 맞게 수정 필요)
    const url = `https://silbo.kr/2014/_pages/php/downExcel/department_sample.xlsx`;
    window.open(url, '_blank');
}

// 업로드 모달 열기 함수
function qcm_openUploadModal(questionId, documentType) {
    console.log('업로드 모달 열기:', questionId, documentType);
    
    if (!questionId) {
        alert('질문서 ID가 없습니다.');
        return;
    }
    
    // 문서 유형별 설정
    const documentConfig = {
        question: {
            title: '질문서 업로드',
            description: '날인된 질문서를 업로드해주세요.',
            acceptFiles: '.pdf,.jpg,.jpeg,.png',
            instructions: '1. 질문서를 다운로드하여 출력합니다.<br>2. 필요한 서명 및 날인을 합니다.<br>3. 스캔하거나 사진 촬영합니다.<br>4. 파일을 업로드합니다.'
        },
        subscription: {
            title: '청약서 업로드',
            description: '작성 완료된 청약서를 업로드해주세요.',
            acceptFiles: '.pdf,.jpg,.jpeg,.png',
            instructions: '1. 청약서를 다운로드하여 출력합니다.<br>2. 모든 필수 항목을 작성합니다.<br>3. 서명 및 날인을 합니다.<br>4. 스캔하거나 사진 촬영합니다.<br>5. 파일을 업로드합니다.'
        },
        department: {
            title: '과별인원 업로드',
            description: '과별인원 명단 파일을 업로드해주세요.',
            acceptFiles: '.xlsx,.xls,.csv',
            instructions: '1. 예시파일을 다운로드합니다.<br>2. 예시 형식에 맞춰 과별인원 정보를 입력합니다.<br>3. 파일을 저장합니다.<br>4. 파일을 업로드합니다.'
        }
    };
    
    const config = documentConfig[documentType];
    if (!config) {
        alert('알 수 없는 문서 유형입니다.');
        return;
    }
    
    // 기존 모달이 있으면 제거
    const existingModal = document.querySelector('.upload-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'upload-modal';
    modal.innerHTML = `
        <div class="upload-modal-content">
            <div class="upload-modal-header">
                <h3 class="upload-modal-title">
                    <i class="fas fa-upload"></i>
                    ${config.title}
                </h3>
                <button class="upload-modal-close" onclick="this.closest('.upload-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="upload-modal-body" onclick="event.stopPropagation()">
                <div class="upload-description">
                    <p>${config.description}</p>
                </div>
                
                <div class="upload-instructions">
                    <h4><i class="fas fa-info-circle"></i> 업로드 절차</h4>
                    <div class="instructions-content">${config.instructions}</div>
                </div>
                
                <div class="upload-section">
                    <div class="file-drop-zone" id="fileDropZone_${questionId}_${documentType}" onclick="event.stopPropagation()">
                        <div class="drop-zone-content">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>파일을 드래그하여 놓거나 클릭하여 선택하세요</p>
                            <small>지원 형식: ${config.acceptFiles.replace(/\./g, '').toUpperCase()}</small>
                        </div>
                        <input type="file" 
                               id="fileInput_${questionId}_${documentType}" 
                               accept="${config.acceptFiles}" 
                               style="display: none;">
                    </div>
                    
                    <div class="selected-file" id="selectedFile_${questionId}_${documentType}" style="display: none;" onclick="event.stopPropagation()">
                        <div class="file-info">
                            <i class="fas fa-file"></i>
                            <span class="file-name"></span>
                            <span class="file-size"></span>
                        </div>
                        <button type="button" class="remove-file-btn" onclick="qcm_removeSelectedFile('${questionId}', '${documentType}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="upload-progress" id="uploadProgress_${questionId}_${documentType}" style="display: none;" onclick="event.stopPropagation()">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <span class="progress-text">0%</span>
                    </div>
                </div>
            </div>
            <div class="upload-modal-footer" onclick="event.stopPropagation()">
                <button type="button" class="btn btn-secondary" onclick="this.closest('.upload-modal').remove()">
                    취소
                </button>
                <button type="button" class="btn btn-primary" id="uploadBtn_${questionId}_${documentType}" 
                        onclick="qcm_uploadFile(${questionId}, '${documentType}')" disabled>
                    <i class="fas fa-upload"></i>
                    업로드
                </button>
            </div>
        </div>
        <div class="upload-modal-backdrop" onclick="this.closest('.upload-modal').remove()"></div>
    `;
    
    document.body.appendChild(modal);
    
    // 모달 표시 애니메이션
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // 파일 드롭 존 이벤트 설정
    qcm_setupFileDropZone(questionId, documentType, config.acceptFiles);
}

// 파일 드롭 존 설정
function qcm_setupFileDropZone(questionId, documentType, acceptFiles) {
    const dropZone = document.getElementById(`fileDropZone_${questionId}_${documentType}`);
    const fileInput = document.getElementById(`fileInput_${questionId}_${documentType}`);
    
    if (!dropZone || !fileInput) {
        console.error('드롭존 또는 파일 입력 요소를 찾을 수 없습니다.');
        return;
    }
    
    // 클릭으로 파일 선택
    dropZone.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });
    
    // 파일 선택 이벤트
    fileInput.addEventListener('change', (e) => {
        e.stopPropagation();
        const file = e.target.files[0];
        if (file) {
            qcm_handleFileSelection(questionId, documentType, file);
        }
    });
    
    // 드래그 앤 드롭 이벤트
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            qcm_handleFileSelection(questionId, documentType, files[0]);
        }
    });
}

// 파일 선택 처리
function qcm_handleFileSelection(questionId, documentType, file) {
    const selectedFileDiv = document.getElementById(`selectedFile_${questionId}_${documentType}`);
    const uploadBtn = document.getElementById(`uploadBtn_${questionId}_${documentType}`);
    const dropZone = document.getElementById(`fileDropZone_${questionId}_${documentType}`);
    
    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('파일 크기는 10MB를 초과할 수 없습니다.');
        return;
    }
    
    // 파일 정보 표시
    const fileName = selectedFileDiv.querySelector('.file-name');
    const fileSize = selectedFileDiv.querySelector('.file-size');
    
    fileName.textContent = file.name;
    fileSize.textContent = qcm_formatFileSize(file.size);
    
    // UI 업데이트
    dropZone.style.display = 'none';
    selectedFileDiv.style.display = 'flex';
    uploadBtn.disabled = false;
    
    // 파일 객체 저장
    selectedFileDiv.dataset.file = JSON.stringify({
        name: file.name,
        size: file.size,
        type: file.type
    });
    selectedFileDiv.fileObject = file;
}

// 선택된 파일 제거
function qcm_removeSelectedFile(questionId, documentType) {
    const selectedFileDiv = document.getElementById(`selectedFile_${questionId}_${documentType}`);
    const uploadBtn = document.getElementById(`uploadBtn_${questionId}_${documentType}`);
    const dropZone = document.getElementById(`fileDropZone_${questionId}_${documentType}`);
    const fileInput = document.getElementById(`fileInput_${questionId}_${documentType}`);
    
    selectedFileDiv.style.display = 'none';
    dropZone.style.display = 'flex';
    uploadBtn.disabled = true;
    fileInput.value = '';
    delete selectedFileDiv.fileObject;
}

// 파일 크기 포맷팅
function qcm_formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 파일 업로드 실행
async function qcm_uploadFile(questionId, documentType) {
    const selectedFileDiv = document.getElementById(`selectedFile_${questionId}_${documentType}`);
    const uploadBtn = document.getElementById(`uploadBtn_${questionId}_${documentType}`);
    const progressDiv = document.getElementById(`uploadProgress_${questionId}_${documentType}`);
    
    if (!selectedFileDiv.fileObject) {
        alert('업로드할 파일을 선택해주세요.');
        return;
    }
    
    const file = selectedFileDiv.fileObject;
    
    try {
        // UI 업데이트
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 업로드 중...';
        progressDiv.style.display = 'block';
        
        // FormData 생성
        const formData = new FormData();
        formData.append('action', 'upload');
        formData.append('questionId', questionId);
        formData.append('documentType', documentType);
        formData.append('file', file);
        
        // cNum 추가
        const cNum = sessionStorage.getItem('cNum');
        if (cNum) {
            formData.append('cNum', cNum);
        }
        
        // 업로드 진행률 추적을 위한 XMLHttpRequest 사용
        const xhr = new XMLHttpRequest();
        
        // 진행률 업데이트
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                const progressFill = progressDiv.querySelector('.progress-fill');
                const progressText = progressDiv.querySelector('.progress-text');
                
                progressFill.style.width = percentComplete + '%';
                progressText.textContent = Math.round(percentComplete) + '%';
            }
        });
        
        // 업로드 완료 처리
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                try {
                    const result = JSON.parse(xhr.responseText);
                    if (result.success) {
                        alert('파일이 성공적으로 업로드되었습니다.');
                        document.querySelector('.upload-modal').remove();
                        // 페이지 새로고침 또는 카드 업데이트
                        qcm_refreshQuestionsList();
                    } else {
                        throw new Error(result.message || '업로드에 실패했습니다.');
                    }
                } catch (e) {
                    throw new Error('서버 응답을 처리할 수 없습니다.');
                }
            } else {
                throw new Error(`서버 오류: ${xhr.status}`);
            }
        });
        
        // 오류 처리
        xhr.addEventListener('error', () => {
            throw new Error('네트워크 오류가 발생했습니다.');
        });
        
        // 업로드 시작
        xhr.open('POST', 'api/fileUpload.php');
        xhr.send(formData);
        
    } catch (error) {
        console.error('파일 업로드 오류:', error);
        alert('파일 업로드 중 오류가 발생했습니다: ' + error.message);
        
        // UI 복원
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> 업로드';
        progressDiv.style.display = 'none';
    }
}

// 증권 다운로드 함수
function qcm_downloadCertificate(questionId) {
    console.log('증권 다운로드:', questionId);
    
    if (!questionId) {
        alert('질문서 ID가 없습니다.');
        return;
    }
    
    // 증권 다운로드 URL (실제 API 경로에 맞게 수정 필요)
    const url = `https://silbo.kr/2014/_pages/php/downExcel/certificate.php?claimNum=${questionId}`;
    window.open(url, '_blank');
}

// 영수증 다운로드 함수
function qcm_downloadReceipt(questionId) {
    console.log('영수증 다운로드:', questionId);
    
    if (!questionId) {
        alert('질문서 ID가 없습니다.');
        return;
    }
    
    // 영수증 다운로드 URL (실제 API 경로에 맞게 수정 필요)
    const url = `https://silbo.kr/2014/_pages/php/downExcel/receipt.php?claimNum=${questionId}`;
    window.open(url, '_blank');
}

// 청약서 다운로드 함수
function qcm_downloadSubscriptionForm(questionId) {
    console.log('청약서 다운로드:', questionId);
    
    if (!questionId) {
        alert('질문서 ID가 없습니다.');
        return;
    }
    
    // 청약서 다운로드 URL (실제 API 경로에 맞게 수정 필요)
    const url = `https://silbo.kr/2014/_pages/php/downExcel/subscription.php?claimNum=${questionId}`;
    window.open(url, '_blank');
}

// 질문서 다운로드 함수
function qcm_downloadQuestion(questionId) {
    console.log('질문서 다운로드:', questionId);
    
    if (!questionId) {
        alert('질문서 ID가 없습니다.');
        return;
    }
    
    // 다운로드 URL로 이동
    const url = `https://silbo.kr/2014/_pages/php/downExcel/claim2.php?claimNum=${questionId}&download=1`;
    window.open(url, '_blank');
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

// ===== 이미지 관련 전역 함수들 =====

// 이미지 뷰어 함수
function qcm_viewImage(imageUrl, fileName) {
    // 기존 이미지 모달이 있으면 제거
    const existingModal = document.querySelector('.image-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 모달 창으로 이미지 표시
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="image-modal-content">
            <div class="image-modal-header">
                <span class="image-modal-title">${fileName}</span>
                <button class="image-modal-close" onclick="this.closest('.image-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="image-modal-body">
                <img src="${imageUrl}" alt="${fileName}" class="modal-image">
            </div>
            <div class="image-modal-footer">
                <button class="btn btn-primary" onclick="window.open('${imageUrl}', '_blank')">
                    <i class="fas fa-external-link-alt"></i>
                    새 창에서 보기
                </button>
                <button class="btn btn-secondary" onclick="qcm_downloadImage('${imageUrl}', '${fileName}')">
                    <i class="fas fa-download"></i>
                    다운로드
                </button>
            </div>
        </div>
        <div class="image-modal-backdrop" onclick="this.closest('.image-modal').remove()"></div>
    `;
    
    document.body.appendChild(modal);
    
    // 모달 표시 애니메이션
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// 이미지 다운로드 함수
function qcm_downloadImage(imageUrl, fileName) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

console.log('질문서 카드 관리 스크립트 로드 완료 (개선 버전)');

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

// 전역에서 접근 가능하도록 등록
window.qcm_diagnose = qcm_diagnose;
window.qcm_forceReload = qcm_forceReload;
window.qcm_manualLoad = qcm_manualLoad;
window.qcm_getStatus = qcm_getStatus;
window.qcm_restartManager = qcm_restartManager;

// ===== 사용 예시 및 문제 해결 가이드 =====
/*
=== 문제 해결 방법 ===

1. 첫 번째 로드는 되지만 두 번째부터 안 될 때:
   - 브라우저 콘솔에서 qcm_diagnose() 실행
   - 문제가 발견되면 qcm_forceReload() 실행

2. 수동으로 데이터 로드하려면:
   - qcm_manualLoad() 실행

3. 관리자 상태 확인:
   - qcm_getStatus() 실행

4. 완전 재시작:
   - qcm_forceReload() 실행

=== 사용 예시 ===

// 1. 질문서 목록 조회 (기본) - 자동으로 카드 그리드 렌더링됨
qcm_loadQuestionsList();

// 2. 질문서 목록 조회 (페이지네이션)
qcm_loadQuestionsList({ page: 2, limit: 10 });

// 3. 학교명으로 질문서 검색 (정확히 일치)
qcm_searchQuestions('서울대학교', 1, 1);

// 4. 학교명으로 질문서 검색 (포함 검색)
qcm_searchQuestions('서울', 2, 1);

// 5. 특정 질문서 조회
qcm_getQuestion(1);

// 6. 질문서 목록 새로고침
qcm_refreshQuestionsList();

// 7. 시스템 진단 (문제 발생 시)
qcm_diagnose();

// 8. 강제 재로드 (문제 해결용)
qcm_forceReload();

*/