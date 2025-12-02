// ===== 전역 함수들을 먼저 정의 (호이스팅 보장) =====

// 전역 변수
let quoteFormManager;

// 전역 함수들 (하위 호환용) - 함수 선언식으로 변경하여 호이스팅 보장
function updateTotalParticipants() {
    if (quoteFormManager) {
        return quoteFormManager.updateTotalParticipants();
    } else {
        // 클래스가 없는 경우 직접 계산
        const weekInputs = document.querySelectorAll('.week-input');
        let total = 0;

        weekInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            if (value >= 0) {
                total += value;
            }
        });

        const totalParticipantsElement = document.getElementById('totalParticipants');
        if (totalParticipantsElement) {
            totalParticipantsElement.textContent = total.toLocaleString();
        }

        return total;
    }
}

function handleQuoteSubmit(event) {
    if (quoteFormManager) {
        quoteFormManager.handleFormSubmit(event);
    } else {
        console.warn('QuoteFormManager가 초기화되지 않았습니다.');
    }
}

function generateParticipantsTable() {
    const weeks = [
        [4, 16], [5, 17], [6, 18], [7, 19], [8, 20],
        [9, 21], [10, 22], [11, 23], [12, 24], [13, 25],
        [14, 26], [15, null]
    ];

    const tbody = document.getElementById('participants-table-body');
    if (!tbody) {
        console.warn('participants-table-body 요소를 찾을 수 없습니다.');
        return;
    }

    const rows = weeks.map(([leftWeek, rightWeek]) => {
        const rightCell = rightWeek ? `
            <td class="text-center fw-bold">${rightWeek}주</td>
            <td class="text-center">
                <div class="week-input-wrapper">
                    <input type="text" class="week-input" data-week="${rightWeek}" 
                           onkeyup="updateTotalParticipants()" 
                           onchange="updateTotalParticipants()"
                           pattern="[0-9]*"
                           inputmode="numeric">
                    <span class="unit-label">명</span>
                </div>
            </td>
        ` : '<td></td><td></td>';

        return `
            <tr>
                <td class="text-center fw-bold">${leftWeek}주</td>
                <td class="text-center">
                    <div class="week-input-wrapper">
                        <input type="text" class="week-input" data-week="${leftWeek}" 
                               onkeyup="updateTotalParticipants()" 
                               onchange="updateTotalParticipants()"
                               pattern="[0-9]*"
                               inputmode="numeric">
                        <span class="unit-label">명</span>
                    </div>
                </td>
                ${rightCell}
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;

    // 클래스가 있다면 추가 이벤트 리스너 설정
    if (quoteFormManager) {
        quoteFormManager.setupParticipantsInputListeners();
    }
}

// ===== 현장실습 보험 견적 요청 폼 관리 =====

class QuoteFormManager {
    constructor() {
        this.form = null;
        this.submitButton = null;
        this.totalParticipantsElement = null;
        this.isSubmitting = false;
        
        this.init();
    }

    // ===== 초기화 =====
    init() {
        // DOM이 이미 로드되었는지 확인
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
                this.setupEventListeners();
                this.generateParticipantsTable();
                this.setupNumericInputs();
                this.setupDateValidation();
            });
        } else {
            // DOM이 이미 로드된 경우 즉시 실행
            setTimeout(() => {
                this.setupElements();
                this.setupEventListeners();
                this.generateParticipantsTable();
                this.setupNumericInputs();
                this.setupDateValidation();
            }, 100);
        }
    }

    // ===== DOM 요소 설정 =====
    setupElements() {
        this.form = document.getElementById('quoteForm');
        this.totalParticipantsElement = document.getElementById('totalParticipants');
        
        if (this.form) {
            this.submitButton = this.form.querySelector('.btn-submit-enhanced');
        }
    }

    // ===== 동적으로 폼 요소 재설정 =====
    refreshElements() {
        if (!this.form) {
            this.form = document.getElementById('quoteForm');
        }
        
        if (!this.totalParticipantsElement) {
            this.totalParticipantsElement = document.getElementById('totalParticipants');
        }
        
        if (this.form && !this.submitButton) {
            this.submitButton = this.form.querySelector('.btn-submit-enhanced');
        }
        
        return this.form !== null;
    }

    // ===== 이벤트 리스너 설정 =====
    setupEventListeners() {
        if (!this.form) return;

        // 폼 제출 이벤트
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // 제출 버튼 클릭 이벤트 (HTML onclick 대체)
        if (this.submitButton) {
            this.submitButton.addEventListener('click', (e) => this.handleFormSubmit(e));
        }

        // 실시간 입력 검증
        this.setupRealTimeValidation();
    }

    // ===== 실시간 입력 검증 설정 =====
    setupRealTimeValidation() {
        // 사업자번호 실시간 검증
        const businessNumberInput = this.form.querySelector('#business_number');
        if (businessNumberInput) {
            businessNumberInput.addEventListener('blur', () => {
                this.validateBusinessNumber(businessNumberInput);
            });
        }

        // 이메일 실시간 검증
        const emailInput = this.form.querySelector('#email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                this.validateEmail(emailInput);
            });
        }

        // 전화번호 실시간 검증
        const phoneInput = this.form.querySelector('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('blur', () => {
                this.validatePhone(phoneInput);
            });
        }
    }

    // ===== 참여인원 테이블 생성 =====
    generateParticipantsTable() {
        // 전역 함수 호출로 위임
        generateParticipantsTable();
    }

    // ===== 참여인원 입력 이벤트 리스너 설정 =====
    setupParticipantsInputListeners() {
        const weekInputs = document.querySelectorAll('.week-input');
        weekInputs.forEach(input => {
            // 기존 HTML onkeyup/onchange와 중복되지 않도록 추가 이벤트만 등록
            input.addEventListener('blur', () => this.validateParticipantInput(input));
        });
    }

    // ===== 총 참여인원 수 업데이트 =====
    updateTotalParticipants() {
        const weekInputs = document.querySelectorAll('.week-input');
        let total = 0;

        weekInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            if (value >= 0) {
                total += value;
            }
        });

        if (this.totalParticipantsElement) {
            this.totalParticipantsElement.textContent = total.toLocaleString();
        }

        return total;
    }

    // ===== 숫자 입력 필드 설정 =====
    setupNumericInputs() {
        // 사업자번호 입력 제한
        const businessNumberInput = document.getElementById('business_number');
        if (businessNumberInput) {
            businessNumberInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
            });
        }

        // 전화번호 입력 제한
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
            });
        }
    }

    // ===== 날짜 검증 설정 =====
    setupDateValidation() {
        const startDateInput = document.getElementById('start_date');
        const endDateInput = document.getElementById('end_date');

        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', () => {
                this.validateDateRange(startDateInput, endDateInput);
            });
            
            endDateInput.addEventListener('change', () => {
                this.validateDateRange(startDateInput, endDateInput);
            });
        }
    }

    // ===== 폼 제출 처리 =====
    async handleFormSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;

        try {
            this.isSubmitting = true;
            
            // 폼 요소 재확인 및 설정
            if (!this.refreshElements()) {
                throw new Error('폼을 찾을 수 없습니다. 페이지를 새로고침해주세요.');
            }
            
            this.setLoadingState(true);
            
            // 유효성 검사
            if (!this.validateForm()) {
                return;
            }
            
            // FormData 생성
            const formData = this.createFormData();
            
            // 서버 전송
            await this.submitToServer(formData);
            
            // 성공 처리
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('견적 요청 중 오류 발생:', error);
            this.showErrorMessage(error.message);
        } finally {
            this.isSubmitting = false;
            this.setLoadingState(false);
        }
    }

    // ===== 유효성 검사 =====
    validateForm() {
        // 폼이 없으면 에러
        if (!this.form) {
            throw new Error('폼을 찾을 수 없습니다.');
        }
        
        const errors = [];
        
        // 1. 필수 입력 필드 검사
        const requiredFields = {
            'business_number': '사업자번호',
            'institution_name': '계약자명',
            'address': '주소',
            'phone': '연락처',
            'email': '이메일',
            'start_date': '보험 시작일',
            'end_date': '보험 종료일',
            'teacher_name': '담당자명'
        };
        
        for (const [fieldName, fieldLabel] of Object.entries(requiredFields)) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!field || !field.value.trim()) {
                errors.push(`${fieldLabel}을(를) 입력해주세요.`);
            }
        }
        
        // 2. 현장실습시기 선택 검사
        const seasonRadios = this.form.querySelectorAll('input[name="season"]');
        const seasonSelected = Array.from(seasonRadios).some(radio => radio.checked);
        if (!seasonSelected) {
            errors.push('현장실습시기를 선택해주세요.');
        }
        
        // 3. 보험가입 유형 선택 검사
        const planRadios = this.form.querySelectorAll('input[name="plan"]');
        const planSelected = Array.from(planRadios).some(radio => radio.checked);
        if (!planSelected) {
            errors.push('보험가입 유형을 선택해주세요.');
        }
        
        // 4. 참여인원 검사
        const totalParticipants = this.updateTotalParticipants();
        if (totalParticipants === 0) {
            errors.push('최소 1명 이상의 참여인원을 입력해주세요.');
        }
        
        // 5. 사업자번호 형식 검사
        const businessNumber = this.form.querySelector('[name="business_number"]')?.value.trim();
        if (businessNumber && !this.isValidBusinessNumber(businessNumber)) {
            errors.push('사업자번호는 10자리 숫자로 입력해주세요.');
        }
        
        // 6. 이메일 형식 검사
        const email = this.form.querySelector('[name="email"]')?.value.trim();
        if (email && !this.isValidEmail(email)) {
            errors.push('올바른 이메일 형식으로 입력해주세요.');
        }
        
        // 7. 전화번호 형식 검사
        const phone = this.form.querySelector('[name="phone"]')?.value.trim();
        if (phone && !this.isValidPhone(phone)) {
            errors.push('연락처는 10-11자리 숫자로 입력해주세요.');
        }
        
        // 8. 날짜 유효성 검사
        const startDate = this.form.querySelector('[name="start_date"]')?.value;
        const endDate = this.form.querySelector('[name="end_date"]')?.value;
        if (!this.isValidDateRange(startDate, endDate)) {
            errors.push('보험 종료일은 시작일보다 늦어야 하며, 시작일은 오늘 이후여야 합니다.');
        }
        
        // 오류 메시지 표시
        if (errors.length > 0) {
            this.showValidationErrors(errors);
            return false;
        }
        
        return true;
    }

    // ===== 개별 유효성 검사 함수들 =====
    validateBusinessNumber(input) {
        const isValid = this.isValidBusinessNumber(input.value);
        this.setFieldValidation(input, isValid, '사업자번호는 10자리 숫자로 입력해주세요.');
        return isValid;
    }

    validateEmail(input) {
        const isValid = this.isValidEmail(input.value);
        this.setFieldValidation(input, isValid, '올바른 이메일 형식으로 입력해주세요.');
        return isValid;
    }

    validatePhone(input) {
        const isValid = this.isValidPhone(input.value);
        this.setFieldValidation(input, isValid, '연락처는 10-11자리 숫자로 입력해주세요.');
        return isValid;
    }

    validateDateRange(startInput, endInput) {
        const isValid = this.isValidDateRange(startInput.value, endInput.value);
        const message = '보험 종료일은 시작일보다 늦어야 하며, 시작일은 오늘 이후여야 합니다.';
        
        this.setFieldValidation(startInput, isValid, message);
        this.setFieldValidation(endInput, isValid, message);
        
        return isValid;
    }

    validateParticipantInput(input) {
        const value = input.value.trim();
        const numericValue = parseInt(value) || 0;
        
        // 숫자만 허용하고 0 이상 9999 이하로 제한
        if (value !== '' && (!/^\d+$/.test(value) || numericValue < 0 || numericValue > 9999)) {
            this.setFieldValidation(input, false, '0부터 9999까지의 숫자만 입력 가능합니다.');
            return false;
        } else {
            this.setFieldValidation(input, true, '');
            return true;
        }
    }

    // ===== 유효성 검사 헬퍼 함수들 =====
    isValidBusinessNumber(value) {
        return /^\d{10}$/.test(value?.trim());
    }

    isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim());
    }

    isValidPhone(value) {
        return /^\d{10,11}$/.test(value?.trim());
    }

    isValidDateRange(startDate, endDate) {
        if (!startDate || !endDate) return false;
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return start >= today && start < end;
    }

    // ===== 필드 유효성 표시 =====
    setFieldValidation(input, isValid, errorMessage) {
        const wrapper = input.closest('.form-group') || input.parentElement;
        let errorElement = wrapper.querySelector('.error-message');
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (errorElement) {
                errorElement.remove();
            }
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message text-danger small mt-1';
                wrapper.appendChild(errorElement);
            }
            errorElement.textContent = errorMessage;
        }
    }

    // ===== FormData 생성 =====
    createFormData() {
        if (!this.form) {
            throw new Error('폼을 찾을 수 없습니다.');
        }
        
        const formData = new FormData();
        
        // 기본 폼 데이터 추가
        const directory = sessionStorage.getItem('directory') || '2';
        const formElements = this.form.elements;
        
        for (let element of formElements) {
            if (element.name && element.value) {
                if (element.type === 'radio' && !element.checked) continue;
                
                // 필드명 매핑 처리
                let fieldName = element.name;
                
                // institution_name을 directory에 따라 변환
                if (element.name === 'institution_name') {
                    fieldName = directory === '1' ? 'university_name' : 'school_name';
                } 
                // plan을 plan_type으로 변환
                else if (element.name === 'plan') {
                    fieldName = 'plan_type';
                }
                
                formData.append(fieldName, element.value.trim());
            }
        }
        
        // 주별 참여인원 데이터 개별 추가 (week_4, week_5, ... 형태)
        const weekInputs = document.querySelectorAll('.week-input');
        weekInputs.forEach(input => {
            const week = input.dataset.week;
            const count = parseInt(input.value) || 0;
            if (count > 0) {
                formData.append(`week_${week}`, count);
            }
        });
        
        // 총 참여인원 수 추가
        const totalParticipants = this.updateTotalParticipants();
        formData.append('total_participants', totalParticipants);
        
        // form_type 결정 (directory 기반)
        const formType = directory === '1' ? 'university' : 'highschool';
        formData.append('form_type', formType);
        
        // cNum 추가
        const cNum = sessionStorage.getItem('cNum');
        if (cNum) {
            formData.append('cNum', cNum);
        }
        
        // 타임스탬프 추가
        formData.append('submitted_at', new Date().toISOString());
        
        return formData;
    }

    // ===== 서버 전송 =====
    async submitToServer(formData) {
        // sessionStorage에서 directory 값 가져오기 (기본값 설정)
        const directory = sessionStorage.getItem('directory') || '2';
        const endpoint = directory === '1' ? '/api/university_quote.php' : '/api/highschool_quote.php';
        
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || '견적 요청 처리 중 오류가 발생했습니다.');
        }
        
        return result;
    }

    // ===== UI 상태 관리 =====
    setLoadingState(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';
            this.submitButton.classList.add('loading');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> 견적 요청하기';
            this.submitButton.classList.remove('loading');
        }
    }

    // ===== 메시지 표시 =====
    showValidationErrors(errors) {
        const errorMessage = errors.join('\n');
        
        // 모던한 알림 시스템이 있다면 사용, 없으면 alert 사용
        if (typeof this.showModal === 'function') {
            this.showModal('입력 확인', '다음 항목을 확인해주세요:\n\n' + errorMessage, 'error');
        } else {
            alert('다음 항목을 확인해주세요:\n\n' + errorMessage);
        }
        
        // 첫 번째 오류 필드로 스크롤
        this.scrollToFirstError();
    }

    showSuccessMessage() {
        if (typeof this.showModal === 'function') {
            this.showModal('전송 완료', '견적 요청이 성공적으로 전송되었습니다.\n담당자가 검토 후 연락드리겠습니다.', 'success');
			
        } else {
            alert('견적 요청이 성공적으로 전송되었습니다.\n담당자가 검토 후 연락드리겠습니다.');
        }
		
		// 성공 메시지 표시 후 폼 초기화
		this.resetForm();
    }
	// 폼 완전 초기화 메서드
		resetForm() {
			if (!this.form) return;
			
			try {
				// 1. 기본 폼 리셋 (HTML 폼의 모든 입력값 초기화)
				this.form.reset();
				
				// 2. 참여인원 입력 필드들 개별 초기화
				const weekInputs = document.querySelectorAll('.week-input');
				weekInputs.forEach(input => {
					input.value = '';
					// 유효성 검사 클래스 제거
					input.classList.remove('is-valid', 'is-invalid');
				});
				
				// 3. 총 참여인원 초기화
				this.updateTotalParticipants(); // 0으로 업데이트됨
				
				// 4. 모든 입력 필드의 유효성 검사 클래스 제거
				const allInputs = this.form.querySelectorAll('input, select, textarea');
				allInputs.forEach(input => {
					input.classList.remove('is-valid', 'is-invalid');
				});
				
				// 5. 에러 메시지 제거
				const errorMessages = this.form.querySelectorAll('.error-message');
				errorMessages.forEach(errorMsg => {
					errorMsg.remove();
				});
				
				// 6. 라디오 버튼 선택 해제
				const radioInputs = this.form.querySelectorAll('input[type="radio"]');
				radioInputs.forEach(radio => {
					radio.checked = false;
				});
				
				// 7. 체크박스 선택 해제
				const checkboxInputs = this.form.querySelectorAll('input[type="checkbox"]');
				checkboxInputs.forEach(checkbox => {
					checkbox.checked = false;
				});
				
				// 8. 폼을 맨 위로 스크롤
				this.form.scrollIntoView({ 
					behavior: 'smooth', 
					block: 'start' 
				});
				
				// 9. 첫 번째 입력 필드에 포커스 (선택사항)
				setTimeout(() => {
					const firstInput = this.form.querySelector('input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"])');
					if (firstInput) {
						firstInput.focus();
					}
				}, 500);
				
				console.log('폼이 성공적으로 초기화되었습니다.');
				
			} catch (error) {
				console.error('폼 초기화 중 오류 발생:', error);
			}
		}
    showErrorMessage(message) {
        if (typeof this.showModal === 'function') {
            this.showModal('오류 발생', '견적 요청 중 오류가 발생했습니다:\n' + message + '\n\n잠시 후 다시 시도해주세요.', 'error');
        } else {
            alert('견적 요청 중 오류가 발생했습니다:\n' + message + '\n\n잠시 후 다시 시도해주세요.');
        }
    }

    // ===== 유틸리티 함수 =====
    scrollToFirstError() {
        if (!this.form) return;
        
        const firstErrorField = this.form.querySelector('.is-invalid');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // 포커스 설정 (약간의 지연 후)
            setTimeout(() => {
                firstErrorField.focus();
            }, 300);
        }
    }

    // ===== 모던 모달 시스템 (선택사항) =====
    showModal(title, message, type = 'info') {
        // 이 부분은 실제 모달 라이브러리나 커스텀 모달이 있을 때 구현
        // 예: Bootstrap Modal, SweetAlert2 등
        console.log(`Modal: ${title} - ${message} (${type})`);
        
        // 기본적으로는 여전히 alert 사용
        alert(`${title}\n\n${message}`);
    }
	
	
}

// ===== 초기화 함수 (안전한 방식) =====
function initializeQuoteFormManager() {
    if (typeof QuoteFormManager !== 'undefined') {
        quoteFormManager = new QuoteFormManager();
    } else {
        console.warn('QuoteFormManager 클래스를 찾을 수 없습니다.');
    }
}

// DOM 로드 완료 시 또는 즉시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeQuoteFormManager);
} else {
    initializeQuoteFormManager();
}

// 페이지 로드 완료 후에도 한 번 더 확인
window.addEventListener('load', () => {
    if (!quoteFormManager) {
        initializeQuoteFormManager();
    }
});