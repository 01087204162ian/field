// 현장실습보험 웹사이트 JavaScript - 완전 개선 버전
class InternshipInsuranceApp {
    constructor() {
        this.isInitialized = false;
        this.pageToNavMap = {
            'home': '홈',
            'products': '상품소개',
            'guide': '가입안내',
            'university-quote': '대학교견적의뢰',
            'highschool-quote': '고등학교견적의뢰',
            '12': '보상안내',
            'faq': '자주하는질문',
            'notice': '공지사항'
        };
        
        // 서버 엔드포인트 설정
        this.serverEndpoints = {
            university: './api/university_quote.php',
            highschool: './api/highschool_quote.php'
        };
        
        this.init();
    }

    // ================== 초기화 ==================
    init() {
        if (this.isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.initializeNavigation();
        this.initializeFormHandlers();
        this.initializeParticipantCalculation();
        this.initializeFormFieldEffects();
        this.initializeAnimations();
        
        this.isInitialized = true;
        console.log('현장실습보험 앱이 초기화되었습니다.');
    }

    // ================== 네비게이션 관련 ==================
    initializeNavigation() {
        this.initializeSmoothScrolling();
    }

    showPage(pageId) {
        // 모든 페이지 숨기기
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('current-page');
            page.classList.add('hidden-page');
        });
        
        // 선택된 페이지 보이기
        const selectedPage = document.getElementById(pageId);
        if (selectedPage) {
            selectedPage.classList.remove('hidden-page');
            selectedPage.classList.add('current-page');
        }
        
        // 네비게이션 활성 상태 업데이트
        this.updateNavActiveState(pageId);
        
        // 모바일 메뉴 닫기
        this.closeMobileMenu();
        
        // 페이지 최상단으로 스크롤
        window.scrollTo(0, 0);
    }

    updateNavActiveState(pageId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        
        const targetText = this.pageToNavMap[pageId];
        if (targetText) {
            navLinks.forEach(link => {
                if (link.textContent.trim() === targetText) {
                    link.classList.add('active');
                }
            });
        }
    }

    closeMobileMenu() {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    }

    initializeSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (!href || href === '#' || href.length <= 1) {
                    return;
                }
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // ================== 폼 초기화 ==================
    initializeFormHandlers() {
        this.initializeUniversityForm();
        this.initializeHighschoolForm();
    }

    initializeUniversityForm() {
        const form = document.getElementById('universityQuoteForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form, 'university');
        });

        // 엔터키 제출 방지
        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.shouldPreventEnterSubmit(e.target)) {
                e.preventDefault();
                return false;
            }
        });
    }

    initializeHighschoolForm() {
        const form = document.getElementById('highschoolQuoteForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form, 'highschool');
        });

        // 엔터키 제출 방지
        form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && this.shouldPreventEnterSubmit(e.target)) {
                e.preventDefault();
                return false;
            }
        });
    }

    shouldPreventEnterSubmit(target) {
        return target.classList.contains('week-input') || 
               (target.tagName === 'INPUT' && target.type !== 'submit');
    }

    // ================== 통합 폼 제출 처리 ==================
    async handleFormSubmit(form, formType) {
        // 폼 검증
        if (!this.validateForm(form, formType)) return;

        const submitBtn = form.querySelector('.btn-submit-enhanced, button[type="submit"]');
        
        try {
            // 로딩 상태 표시
            this.showLoadingState(submitBtn, true);
            
            // 폼 데이터 수집
            const formData = this.collectFormData(form, formType);
            
            // 디버깅용 로그
            console.log(`${formType} 폼 전송 데이터:`, this.debugFormData(formData));
            
            // 서버로 전송
            const endpoint = this.serverEndpoints[formType];
            const response = await this.sendFormData(endpoint, formData);
            
            // 로딩 상태 해제
            this.showLoadingState(submitBtn, false);
            
            if (response.success) {
                this.showSubmitSuccess(submitBtn, () => {
                    const message = this.buildSuccessMessage(response, formType);
                    alert(message);
                    form.reset();
                    this.updateTotalParticipants(); // 총 참여인원 초기화
                });
            } else {
                throw new Error(response.message || '서버 오류가 발생했습니다.');
            }
            
        } catch (error) {
            console.error(`${formType} 폼 전송 오류:`, error);
            this.showLoadingState(submitBtn, false);
            this.showSubmitError(submitBtn, error.message);
        }
    }

    // ================== 폼 데이터 수집 (통합) ==================
    collectFormData(form, formType) {
        const formData = new FormData();
        
        // 공통 헬퍼 함수
        const getFieldValue = (selectors) => {
            const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
            
            for (const selector of selectorArray) {
                const element = form.querySelector(selector);
                if (element && element.value !== null && element.value !== undefined) {
                    return element.value.trim();
                }
            }
            return '';
        };
        
        const getCheckedValue = (name) => {
            const element = form.querySelector(`input[name="${name}"]:checked`);
            return element ? element.value : '';
        };
        
        // 기본 필드 수집
        const fields = this.getFormFields(getFieldValue, getCheckedValue, formType);

        // FormData에 필드 추가
        Object.keys(fields).forEach(key => {
            const value = fields[key];
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        // 참여인원 데이터 수집 및 추가
        const participantData = this.collectParticipantDataFromForm(form);
        Object.keys(participantData).forEach(week => {
            formData.append(week, participantData[week]);
        });

        // 총 참여인원 계산 및 추가
        const totalParticipants = Object.values(participantData).reduce((sum, count) => sum + parseInt(count || 0), 0);
        formData.append('total_participants', totalParticipants);

        // 메타데이터 추가
        formData.append('form_type', formType);
        formData.append('submitted_at', new Date().toISOString());

        // 디버깅 정보
        console.log(`${formType} - 수집된 필드:`, fields);
        console.log(`${formType} - 참여인원:`, participantData);
        console.log(`${formType} - 총 참여인원:`, totalParticipants);

        return formData;
    }

    // 폼 타입별 필드 정의
    getFormFields(getFieldValue, getCheckedValue, formType) {
        const commonFields = {
            business_number: getFieldValue([
                'input[name="business_number"]',
                'input[id="business_number"]'
            ]),
            address: getFieldValue([
                'textarea[name="address"]',
                'textarea[id="address"]'
            ]),
            phone: getFieldValue([
                'input[name="phone"]',
                'input[id="phone"]'
            ]),
            email: getFieldValue([
                'input[name="email"]',
                'input[id="email"]'
            ]),
            season: getCheckedValue('season') || '1',
            start_date: getFieldValue([
                'input[name="start_date"]',
                'input[id="start_date"]'
            ]),
            end_date: getFieldValue([
                'input[name="end_date"]',
                'input[id="end_date"]'
            ]),
            plan_type: getCheckedValue('plan') || 'A',
            special_notes: getFieldValue([
                'textarea[name="special_notes"]',
                'textarea[id="special_notes"]'
            ])
        };

        if (formType === 'university') {
            return {
                ...commonFields,
                university_name: getFieldValue([
                    'input[name="university_name"]',
                    'input[id="university_name"]'
                ]),
                manager_name: getFieldValue([
                    'input[name="manager_name"]',
                    'input[id="manager_name"]'
                ])
            };
        } else if (formType === 'highschool') {
            return {
                ...commonFields,
                school_name: getFieldValue([
                    'input[name="school_name"]',
                    'input[id="school_name"]'
                ]),
                teacher_name: getFieldValue([
                    'input[name="teacher_name"]',
                    'input[id="teacher_name"]'
                ])
            };
        }

        return commonFields;
    }

    // 특정 폼에서 참여인원 데이터 수집
    collectParticipantDataFromForm(form) {
        const participantData = {};
        const weekInputs = form.querySelectorAll('.week-input, input[data-week]');
        
        weekInputs.forEach(input => {
            const week = input.getAttribute('data-week') || 
                        input.dataset.week || 
                        input.name?.match(/week[_-]?(\d+)/)?.[1] ||
                        input.id?.match(/week[_-]?(\d+)/)?.[1];
            
            const count = parseInt(input.value) || 0;
            
            if (week && count > 0) {
                participantData[`week_${week}`] = count;
            }
        });
        
        return participantData;
    }

    // ================== 폼 검증 (통합) ==================
    validateForm(form, formType) {
        // 필수 필드 검증
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        let firstErrorField = null;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                field.style.borderColor = '#dc3545';
                if (isValid) {
                    firstErrorField = field;
                }
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
                field.style.borderColor = '#28a745';
            }
        });

        // 시기 선택 검증
        const season = form.querySelector('input[name="season"]:checked');
        if (!season) {
            alert('현장실습시기를 선택해주세요.');
            return false;
        }

        // 보험 유형 선택 검증  
        const plan = form.querySelector('input[name="plan"]:checked');
        if (!plan) {
            alert('보험가입 유형을 선택해주세요.');
            return false;
        }

        // 총 참여인원 검증
        const totalParticipants = this.calculateTotalFromForm(form);
        if (totalParticipants === 0) {
            alert('최소 한 명 이상의 실습 참여인원을 입력해주세요.');
            return false;
        }

        // 사업자번호 유효성 검증
        const businessNumberInput = form.querySelector('input[name="business_number"]');
        const businessNumber = businessNumberInput ? businessNumberInput.value : '';
        if (businessNumber && !this.validateBusinessNumber(businessNumber)) {
            alert('올바른 사업자번호를 입력해주세요. (10자리 숫자)');
            return false;
        }

        // 이메일 유효성 검증
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value : '';
        if (email && !this.validateEmail(email)) {
            alert('올바른 이메일 주소를 입력해주세요.');
            return false;
        }

        // 날짜 유효성 검증
        const startDateInput = form.querySelector('input[name="start_date"]');
        const endDateInput = form.querySelector('input[name="end_date"]');
        const startDate = startDateInput ? startDateInput.value : '';
        const endDate = endDateInput ? endDateInput.value : '';
        
        if (startDate && endDate) {
            if (new Date(startDate) >= new Date(endDate)) {
                alert('보험 종료일은 시작일보다 늦은 날짜여야 합니다.');
                return false;
            }
        }

        if (firstErrorField) {
            firstErrorField.focus();
        }

        return isValid;
    }

    // 특정 폼의 총 참여인원 계산
    calculateTotalFromForm(form) {
        const weekInputs = form.querySelectorAll('.week-input');
        let total = 0;
        
        weekInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            total += value;
        });
        
        return total;
    }

    // 사업자번호 유효성 검증
    validateBusinessNumber(businessNumber) {
        const cleanNumber = businessNumber.replace(/[^0-9]/g, '');
        return cleanNumber.length === 10;
    }

    // 이메일 유효성 검증
    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // ================== 서버 통신 ==================
    async sendFormData(endpoint, formData) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`서버 오류 (${response.status}): ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                const jsonResponse = await response.json();
                console.log('서버 응답:', jsonResponse);
                return jsonResponse;
            } else {
                const text = await response.text();
                console.log('서버 텍스트 응답:', text);
                
                try {
                    const jsonResponse = JSON.parse(text);
                    console.log('파싱된 JSON 응답:', jsonResponse);
                    return jsonResponse;
                } catch (e) {
                    console.warn('JSON 파싱 실패, 원본 텍스트:', text);
                    
                    if (text.includes('Fatal error') || text.includes('Parse error') || text.includes('Warning')) {
                        throw new Error('서버에서 PHP 오류가 발생했습니다. 관리자에게 문의하세요.');
                    }
                    
                    return { success: true, message: '요청이 처리되었습니다.' };
                }
            }
        } catch (error) {
            console.error('서버 통신 오류:', error);
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
            }
            
            throw error;
        }
    }

    // ================== UI 상태 관리 ==================
    showLoadingState(submitBtn, isLoading) {
        if (!submitBtn) return;

        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>전송 중...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
        } else {
            submitBtn.disabled = false;
            if (submitBtn.dataset.originalText) {
                submitBtn.innerHTML = submitBtn.dataset.originalText;
            }
            submitBtn.style.opacity = '';
            submitBtn.style.cursor = '';
        }
    }

    showSubmitSuccess(submitBtn, callback) {
        if (!submitBtn) {
            callback();
            return;
        }

        const originalText = submitBtn.innerHTML;
        const originalStyle = submitBtn.style.background;
        
        submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>접수 완료!';
        submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = originalStyle;
            submitBtn.disabled = false;
            callback();
        }, 2000);
    }

    showSubmitError(submitBtn, errorMessage) {
        if (!submitBtn) {
            alert('오류: ' + errorMessage);
            return;
        }

        const originalText = submitBtn.innerHTML;
        const originalStyle = submitBtn.style.background;
        
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>전송 실패';
        submitBtn.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = originalStyle;
            submitBtn.disabled = false;
            alert('전송 실패:\n' + errorMessage + '\n\n문제가 지속되면 관리자에게 문의하세요.');
        }, 2000);
    }

    // 성공 메시지 구성
    buildSuccessMessage(response, formType) {
        const baseMessage = '견적 요청이 성공적으로 접수되었습니다.';
        const applicationId = response.data?.id || 'N/A';
        const premium = response.data?.premium;
        
        let message = `${baseMessage}\n신청번호: ${applicationId}`;
        
        if (premium) {
            message += `\n보험료: ${premium.toLocaleString()}원`;
        } else {
            message += '\n보험료: 계산중';
        }
        
        message += '\n담당자가 확인 후 연락드리겠습니다.';
        
        return message;
    }

    // ================== 참여인원 계산 ==================
    initializeParticipantCalculation() {
        const weekInputs = document.querySelectorAll('.week-input');
        
        weekInputs.forEach(input => {
            input.addEventListener('input', () => this.handleWeekInputChange(input));
            input.addEventListener('change', () => this.updateTotalParticipants());
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    return false;
                }
            });
            
            input.addEventListener('focus', function() {
                this.select();
            });
        });

        this.updateTotalParticipants();
    }

    handleWeekInputChange(input) {
        // 숫자만 입력 허용
        input.value = input.value.replace(/[^0-9]/g, '');
        
        // 음수 방지
        if (parseInt(input.value) < 0) {
            input.value = '0';
        }
        
        // 최대값 제한 (999명)
        if (parseInt(input.value) > 999) {
            input.value = '999';
        }
        
        this.updateTotalParticipants();
    }

    updateTotalParticipants() {
        // 현재 활성화된 페이지의 총 참여인원 업데이트
        const activePage = document.querySelector('.page:not(.hidden-page)');
        if (!activePage) return;

        const weekInputs = activePage.querySelectorAll('.week-input');
        const totalElement = activePage.querySelector('#totalParticipants');
        
        if (!totalElement) return;

        let total = 0;
        weekInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            total += value;
        });
        
        totalElement.textContent = total;
        
        // 시각적 피드백
        if (total > 0) {
            totalElement.style.color = '#28a745';
            totalElement.style.fontWeight = 'bold';
        } else {
            totalElement.style.color = '#6c757d';
            totalElement.style.fontWeight = 'normal';
        }
    }

    // ================== 폼 필드 효과 ==================
    initializeFormFieldEffects() {
        const self = this;
        
        // 입력 필드 포커스 효과
        document.querySelectorAll('.form-control-enhanced').forEach(field => {
            field.addEventListener('focus', function() {
                if (this.parentElement) {
                    this.parentElement.style.transform = 'translateY(-2px)';
                }
            });
            
            field.addEventListener('blur', function() {
                if (this.parentElement) {
                    this.parentElement.style.transform = '';
                }
            });
        });

        // 라디오 버튼 클릭 효과
        document.querySelectorAll('.form-check-enhanced').forEach(checkBox => {
            checkBox.addEventListener('click', function() {
                const radio = this.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    
                    const groupName = radio.name;
                    document.querySelectorAll(`input[name="${groupName}"]`).forEach(otherRadio => {
                        otherRadio.closest('.form-check-enhanced')?.classList.remove('checked');
                    });
                    
                    this.classList.add('checked');
                }
            });
        });

        // 날짜 입력 필드 개선
        document.querySelectorAll('input[type="date"].form-control-enhanced').forEach(input => {
            input.addEventListener('focus', function() {
                this.showPicker && this.showPicker();
            });
            
            input.addEventListener('change', function() {
                const value = this.value;
                if (value) {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        this.classList.add('is-invalid');
                        this.classList.remove('is-valid');
                    } else {
                        this.classList.add('is-valid');
                        this.classList.remove('is-invalid');
                    }
                } else {
                    this.classList.remove('is-valid', 'is-invalid');
                }
            });
        });

        // 전화번호 입력 제한
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
            });
            
            input.addEventListener('blur', function() {
                const phonePattern = /^[0-9]{10,11}$/;
                if (this.value && phonePattern.test(this.value)) {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                } else if (this.value) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                }
            });
        });
        
        // 이메일 유효성 검사
        document.querySelectorAll('input[type="email"]').forEach(input => {
            input.addEventListener('blur', function() {
                if (this.value && self.validateEmail(this.value)) {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                } else if (this.value) {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                }
            });
        });
    }

    // ================== 애니메이션 ==================
    initializeAnimations() {
        this.initializeScrollAnimations();
    }

    initializeScrollAnimations() {
        window.addEventListener('scroll', () => this.animateOnScroll());
        this.animateOnScroll();
    }

    animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .stat-item');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in-up');
            }
        });
    }

    // ================== 유틸리티 ==================
    debugFormData(formData) {
        const debugData = {};
        for (let [key, value] of formData.entries()) {
            debugData[key] = value;
        }
        return debugData;
    }

    // ================== 정적 메서드 ==================
    static getInstance() {
        if (!window.internshipApp) {
            window.internshipApp = new InternshipInsuranceApp();
        }
        return window.internshipApp;
    }
}

// ================== 앱 초기화 및 전역 함수 등록 ==================
const app = InternshipInsuranceApp.getInstance();

// 전역 함수로 노출
window.showPage = (pageId) => app.showPage(pageId);
window.updateTotalParticipants = () => app.updateTotalParticipants();

// ================== 텍스트에리어 높이 조정 ==================
function adjustTextareaHeight() {
    const textarea = document.querySelector('.textarea-full-height');
    const rightColumn = document.querySelector('.col-md-6:nth-child(2) .row.g-3');
    
    if (textarea && rightColumn && window.innerWidth >= 768) {
        const rightColumnHeight = rightColumn.offsetHeight;
        const paddingAndBorder = 24;
        const adjustedHeight = rightColumnHeight - paddingAndBorder;
        
        if (adjustedHeight > 100) {
            textarea.style.height = adjustedHeight + 'px';
        }
    }
}

// ================== DOM 로드 완료 후 실행 ==================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(adjustTextareaHeight, 100);
    
    window.addEventListener('resize', function() {
        setTimeout(adjustTextareaHeight, 100);
    });
    
    if (document.fonts) {
        document.fonts.ready.then(function() {
            setTimeout(adjustTextareaHeight, 100);
        });
    }
});

// 개발 모드용 전역 객체 노출
if (typeof window !== 'undefined') {
    window.InternshipApp = app;
}