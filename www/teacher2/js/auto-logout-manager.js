/**
 * 자동 로그아웃 관리자
 * 보안을 위한 세션 타이머 및 사용자 활동 모니터링
 * 
 * 사용법:
 * HTML에서 스크립트 로드 후 AutoLogoutManager.init() 호출
 */

class AutoLogoutManager {
    constructor() {
        // 설정 값들
        this.config = {
            // 자동 로그아웃 시간 (밀리초) - 기본 30분
            autoLogoutTime: 30 * 60 * 1000, // 30분
            
            // 경고 시작 시간 (로그아웃 5분 전)
            warningTime: 5 * 60 * 1000, // 5분
            
            // 활동 체크 간격
            checkInterval: 60 * 1000, // 1분마다 체크
            
            // 서버 세션 체크 간격 (선택사항)
            serverCheckInterval: 5 * 60 * 1000, // 5분마다 서버 체크
            
            // 모니터링할 사용자 활동 이벤트들
            activityEvents: ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'],
            
            // 디버그 모드 (개발 시에만 true)
            debug: false
        };
        
        // 내부 상태 변수들
        this.lastActivityTime = Date.now();
        this.warningTimer = null;
        this.logoutTimer = null;
        this.checkTimer = null;
        this.serverCheckTimer = null;
        this.isWarningShown = false;
        this.isInitialized = false;
        
        // 바인딩
        this.handleActivity = this.handleActivity.bind(this);
        this.checkSessionTimeout = this.checkSessionTimeout.bind(this);
        this.showWarningModal = this.showWarningModal.bind(this);
        this.executeLogout = this.executeLogout.bind(this);
        this.extendSession = this.extendSession.bind(this);
    }
    
    /**
     * 자동 로그아웃 관리자 초기화
     * @param {Object} options - 설정 옵션
     */
    init(options = {}) {
        if (this.isInitialized) {
            this.log('자동 로그아웃 관리자가 이미 초기화되었습니다.');
            return;
        }
        
        // 설정 병합
        this.config = { ...this.config, ...options };
        
        // 세션 체크
        if (!this.validateSession()) {
            this.log('유효한 세션이 없습니다. 초기화를 중단합니다.');
            return;
        }
        
        // 활동 모니터링 시작
        this.startActivityMonitoring();
        
        // 세션 타이머 시작
        this.startSessionTimer();
        
        // 서버 세션 체크 시작 (선택사항)
        if (this.config.serverCheckInterval > 0) {
            this.startServerSessionCheck();
        }
        
        // 페이지 언로드 시 정리
        window.addEventListener('beforeunload', () => this.cleanup());
        
        // 경고 모달 스타일 추가
        this.addWarningModalStyles();
        
        this.isInitialized = true;
        this.log('자동 로그아웃 관리자가 초기화되었습니다.', {
            autoLogoutTime: this.config.autoLogoutTime / 1000 / 60 + '분',
            warningTime: this.config.warningTime / 1000 / 60 + '분 전 경고'
        });
    }
    
    /**
     * 사용자 활동 모니터링 시작
     */
    startActivityMonitoring() {
        this.config.activityEvents.forEach(event => {
            document.addEventListener(event, this.handleActivity, true);
        });
        
        // 정기적인 세션 체크
        this.checkTimer = setInterval(this.checkSessionTimeout, this.config.checkInterval);
    }
    
    /**
     * 사용자 활동 감지 핸들러
     */
    handleActivity() {
        const now = Date.now();
        this.lastActivityTime = now;
        
        // 경고가 표시된 상태면 숨기기
        if (this.isWarningShown) {
            this.hideWarningModal();
        }
        
        // 세션 연장 로그
        this.log('사용자 활동 감지됨. 세션 연장.');
    }
    
    /**
     * 세션 타임아웃 체크
     */
    checkSessionTimeout() {
        const now = Date.now();
        const inactiveTime = now - this.lastActivityTime;
        const remainingTime = this.config.autoLogoutTime - inactiveTime;
        
        this.log(`세션 체크: 비활성 시간 ${Math.floor(inactiveTime / 1000 / 60)}분, 남은 시간 ${Math.floor(remainingTime / 1000 / 60)}분`);
        
        // 로그아웃 시간 도달
        if (remainingTime <= 0) {
            this.executeLogout('세션 시간 만료');
            return;
        }
        
        // 경고 시간 도달
        if (remainingTime <= this.config.warningTime && !this.isWarningShown) {
            this.showWarningModal(Math.floor(remainingTime / 1000 / 60));
        }
    }
    
    /**
     * 세션 타이머 시작
     */
    startSessionTimer() {
        // 기존 타이머 정리
        if (this.logoutTimer) {
            clearTimeout(this.logoutTimer);
        }
        
        // 새 타이머 설정
        this.logoutTimer = setTimeout(() => {
            this.executeLogout('세션 시간 만료');
        }, this.config.autoLogoutTime);
    }
    
    /**
     * 서버 세션 체크 시작
     */
    startServerSessionCheck() {
        this.serverCheckTimer = setInterval(async () => {
            try {
                const isValid = await this.checkServerSession();
                if (!isValid) {
                    this.executeLogout('서버 세션 만료');
                }
            } catch (error) {
                this.log('서버 세션 체크 오류:', error);
            }
        }, this.config.serverCheckInterval);
    }
    
    /**
     * 서버 세션 유효성 체크 (API 호출)
     * 실제 구현시 서버 API에 맞게 수정 필요
     */
    async checkServerSession() {
        try {
            // 예시 API 호출 - 실제 서버 엔드포인트로 변경 필요
            const response = await fetch('api/check-session.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cNum: sessionStorage.getItem('cNum'),
                    mem_id: sessionStorage.getItem('mem_id')
                })
            });
            
            const result = await response.json();
            return result.success && result.valid;
        } catch (error) {
            this.log('서버 세션 체크 실패:', error);
            return true; // 네트워크 오류 시 세션 유지
        }
    }
    
    /**
     * 경고 모달 표시
     */
    showWarningModal(remainingMinutes) {
        if (this.isWarningShown) return;
        
        this.isWarningShown = true;
        
        const modal = document.createElement('div');
        modal.id = 'autoLogoutWarning';
        modal.className = 'auto-logout-modal';
        modal.innerHTML = `
            <div class="auto-logout-modal-content">
                <div class="auto-logout-modal-header">
                    <h3>🔔 세션 만료 경고</h3>
                </div>
                <div class="auto-logout-modal-body">
                    <p>비활성 상태가 지속되어 약 <strong id="remainingTime">${remainingMinutes}분</strong> 후에 자동으로 로그아웃됩니다.</p>
                    <p>계속 사용하시려면 <strong>"세션 연장"</strong> 버튼을 클릭해주세요.</p>
                </div>
                <div class="auto-logout-modal-actions">
                    <button class="btn-extend" onclick="autoLogoutManager.extendSession()">
                        <i class="fas fa-clock"></i> 세션 연장
                    </button>
                    <button class="btn-logout" onclick="autoLogoutManager.executeLogout('사용자 선택')">
                        <i class="fas fa-sign-out-alt"></i> 지금 로그아웃
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 남은 시간 실시간 업데이트
        const timeElement = modal.querySelector('#remainingTime');
        const updateTimer = setInterval(() => {
            const now = Date.now();
            const inactiveTime = now - this.lastActivityTime;
            const remaining = this.config.autoLogoutTime - inactiveTime;
            const remainingMin = Math.floor(remaining / 1000 / 60);
            
            if (remainingMin <= 0) {
                clearInterval(updateTimer);
                return;
            }
            
            timeElement.textContent = remainingMin + '분';
        }, 1000);
        
        // 모달 애니메이션
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        this.log('경고 모달 표시됨');
    }
    
    /**
     * 경고 모달 숨기기
     */
    hideWarningModal() {
        const modal = document.getElementById('autoLogoutWarning');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        }
        this.isWarningShown = false;
        this.log('경고 모달 숨김');
    }
    
    /**
     * 세션 연장
     */
    extendSession() {
        this.lastActivityTime = Date.now();
        this.hideWarningModal();
        this.startSessionTimer(); // 타이머 재시작
        
        // 알림 표시
        this.showNotification('세션이 연장되었습니다.', 'success');
        
        this.log('세션이 연장되었습니다.');
    }
    
    /**
     * 로그아웃 실행
     */
    executeLogout(reason = '세션 만료') {
        this.log('자동 로그아웃 실행:', reason);
        
        // 정리 작업
        this.cleanup();
        
        // 세션 데이터 삭제
        try {
            sessionStorage.clear();
        } catch (error) {
            this.log('세션 스토리지 정리 오류:', error);
        }
        
        // 로그아웃 알림
        this.showNotification(`${reason}으로 인해 로그아웃됩니다.`, 'warning');
        
        // 로그인 페이지로 리다이렉트
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
    
    /**
     * 세션 유효성 검증
     */
    validateSession() {
        const cNum = sessionStorage.getItem('cNum');
        const schoolName = sessionStorage.getItem('schoolName');
        const mem_id = sessionStorage.getItem('mem_id');
        
        return !!(cNum && schoolName && mem_id);
    }
    
    /**
     * 정리 작업
     */
    cleanup() {
        // 이벤트 리스너 제거
        this.config.activityEvents.forEach(event => {
            document.removeEventListener(event, this.handleActivity, true);
        });
        
        // 타이머 정리
        if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }
        
        if (this.logoutTimer) {
            clearTimeout(this.logoutTimer);
            this.logoutTimer = null;
        }
        
        if (this.serverCheckTimer) {
            clearInterval(this.serverCheckTimer);
            this.serverCheckTimer = null;
        }
        
        // 경고 모달 제거
        this.hideWarningModal();
        
        this.isInitialized = false;
        this.log('자동 로그아웃 관리자 정리 완료');
    }
    
    /**
     * 경고 모달 스타일 추가
     */
    addWarningModalStyles() {
        if (document.getElementById('autoLogoutStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'autoLogoutStyles';
        styles.textContent = `
            .auto-logout-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .auto-logout-modal.show {
                opacity: 1;
            }
            
            .auto-logout-modal-content {
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                transform: translateY(-20px);
                transition: transform 0.3s ease;
            }
            
            .auto-logout-modal.show .auto-logout-modal-content {
                transform: translateY(0);
            }
            
            .auto-logout-modal-header {
                background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                color: white;
                padding: 1.5rem;
                border-radius: 20px 20px 0 0;
                text-align: center;
            }
            
            .auto-logout-modal-header h3 {
                margin: 0;
                font-size: 1.3rem;
                font-weight: 700;
            }
            
            .auto-logout-modal-body {
                padding: 2rem;
                text-align: center;
                line-height: 1.6;
                color: #4a5568;
            }
            
            .auto-logout-modal-body p {
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            .auto-logout-modal-body strong {
                color: #2d3748;
            }
            
            .auto-logout-modal-actions {
                padding: 0 2rem 2rem;
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            
            .auto-logout-modal-actions button {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.95rem;
            }
            
            .btn-extend {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
            }
            
            .btn-extend:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
            }
            
            .btn-logout {
                background: linear-gradient(135deg, #6b7280, #4b5563);
                color: white;
            }
            
            .btn-logout:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(107, 114, 128, 0.3);
            }
            
            @media (max-width: 768px) {
                .auto-logout-modal-content {
                    width: 95%;
                    margin: 1rem;
                }
                
                .auto-logout-modal-actions {
                    flex-direction: column;
                }
                
                .auto-logout-modal-actions button {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * 알림 표시 (기존 showNotification 함수 사용)
     */
    showNotification(message, type = 'info') {
        // 기존 시스템의 showNotification 함수가 있으면 사용
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // 없으면 간단한 알림 구현
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    /**
     * 설정 업데이트
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.log('설정이 업데이트되었습니다:', newConfig);
        
        // 타이머 재시작
        if (this.isInitialized) {
            this.cleanup();
            this.init(this.config);
        }
    }
    
    /**
     * 현재 세션 상태 정보 반환
     */
    getSessionInfo() {
        const now = Date.now();
        const inactiveTime = now - this.lastActivityTime;
        const remainingTime = this.config.autoLogoutTime - inactiveTime;
        
        return {
            isActive: remainingTime > 0,
            lastActivityTime: new Date(this.lastActivityTime),
            inactiveTime: Math.floor(inactiveTime / 1000),
            remainingTime: Math.floor(remainingTime / 1000),
            isWarningShown: this.isWarningShown,
            config: { ...this.config }
        };
    }
    
    /**
     * 디버그 로그
     */
    log(message, data = null) {
        if (!this.config.debug) return;
        
        const timestamp = new Date().toLocaleTimeString('ko-KR');
        console.log(`[AutoLogout ${timestamp}] ${message}`, data || '');
    }
    
    /**
     * 수동 로그아웃 (사용자가 직접 호출)
     */
    manualLogout() {
        this.executeLogout('사용자 요청');
    }
    
    /**
     * 활동 시뮬레이션 (테스트용)
     */
    simulateActivity() {
        this.handleActivity();
        this.log('활동 시뮬레이션 실행됨');
    }
}

// 전역 인스턴스 생성
const autoLogoutManager = new AutoLogoutManager();

// 전역 접근을 위해 window 객체에 할당
window.autoLogoutManager = autoLogoutManager;

// 즉시 사용 가능한 헬퍼 함수들
window.AutoLogout = {
    // 기본 설정으로 초기화
    init: (options = {}) => autoLogoutManager.init(options),
    
    // 세션 연장
    extend: () => autoLogoutManager.extendSession(),
    
    // 수동 로그아웃
    logout: () => autoLogoutManager.manualLogout(),
    
    // 설정 업데이트
    updateConfig: (config) => autoLogoutManager.updateConfig(config),
    
    // 세션 정보 조회
    getInfo: () => autoLogoutManager.getSessionInfo(),
    
    // 활동 시뮬레이션 (테스트용)
    simulate: () => autoLogoutManager.simulateActivity(),
    
    // 정리
    cleanup: () => autoLogoutManager.cleanup()
};

// 모듈 내보내기 (ES6 모듈 사용 시)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoLogoutManager;
}

// AMD 지원
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return AutoLogoutManager;
    });
}