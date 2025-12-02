// ===== 질문서 업로드 관리자 (새로 작성) =====

if (window.QCM_UPLOAD_SCRIPT_LOADED) {
    console.log('질문서 업로드 관리 스크립트가 이미 로드되어 있습니다.');
} else {
    window.QCM_UPLOAD_SCRIPT_LOADED = true;

    // ===== 업로드 관리자 클래스 =====
    class QCM_UploadManager {
        constructor() {
            this.maxFileSize = 10 * 1024 * 1024; // 10MB
            this.uploadEndpoint = 'api/fileUpload.php';
        }

        showError(message) {
            if (window.qcm_questionsManager && typeof window.qcm_questionsManager.qcm_showError === 'function') {
                window.qcm_questionsManager.qcm_showError(message);
            } else if (typeof showNotification === 'function') {
                showNotification(message, 'error');
            } else {
                console.error('QCM Upload Error:', message);
                alert('오류: ' + message);
            }
        }

        showSuccess(message) {
            if (window.qcm_questionsManager && typeof window.qcm_questionsManager.qcm_showSuccess === 'function') {
                window.qcm_questionsManager.qcm_showSuccess(message);
            } else if (typeof showNotification === 'function') {
                showNotification(message, 'success');
            } else {
                console.log('QCM Upload Success:', message);
            }
        }

        refreshQuestionsList() {
            if (typeof qcm_refreshQuestionsList === 'function') {
                qcm_refreshQuestionsList();
            } else if (window.qcm_questionsManager && typeof window.qcm_questionsManager.qcm_loadQuestionsList === 'function') {
                window.qcm_questionsManager.qcm_loadQuestionsList();
            } else {
                console.warn('질문서 목록 새로고침 함수를 찾을 수 없습니다.');
                window.location.reload();
            }
        }

        getCNum() {
            const cNum = sessionStorage.getItem('cNum');
            if (!cNum) {
                throw new Error('cNum을 찾을 수 없습니다. 로그인 상태를 확인해주세요.');
            }
            return cNum;
        }

        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        validateFile(file, documentType) {
            if (file.size > this.maxFileSize) {
                throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
            }

            const allowedTypes = {
                question: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
                subscription: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
                department: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'],
                certificate: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
                receipt: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
            };

            const allowed = allowedTypes[documentType];
            if (allowed && !allowed.includes(file.type)) {
                throw new Error(`${documentType} 문서는 ${allowed.join(', ')} 형식만 지원됩니다.`);
            }

            return true;
        }

        async uploadFile(questionId, documentType, file, progressCallback) {
            try {
                this.validateFile(file, documentType);

                const formData = new FormData();
                formData.append('action', 'upload');
                formData.append('questionId', questionId);
                formData.append('documentType', documentType);
                formData.append('file', file);
                formData.append('cNum', this.getCNum());

                return new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();

                    xhr.upload.addEventListener('progress', (e) => {
                        if (e.lengthComputable && progressCallback) {
                            const percentComplete = (e.loaded / e.total) * 100;
                            progressCallback(percentComplete);
                        }
                    });

                    xhr.addEventListener('load', () => {
                        if (xhr.status === 200) {
                            try {
                                const result = JSON.parse(xhr.responseText);
                                if (result.success) {
                                    resolve(result);
                                } else {
                                    reject(new Error(result.message || '업로드에 실패했습니다.'));
                                }
                            } catch (e) {
                                reject(new Error('서버 응답을 처리할 수 없습니다.'));
                            }
                        } else {
                            reject(new Error(`서버 오류: ${xhr.status}`));
                        }
                    });

                    xhr.addEventListener('error', () => {
                        reject(new Error('네트워크 오류가 발생했습니다.'));
                    });

                    xhr.open('POST', this.uploadEndpoint);
                    xhr.send(formData);
                });

            } catch (error) {
                console.error('파일 업로드 오류:', error);
                throw error;
            }
        }

        getDocumentConfig(documentType) {
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

            return documentConfig[documentType];
        }
    }

    // 전역 업로드 관리자 인스턴스
    if (typeof window.qcm_uploadManager === 'undefined') {
        window.qcm_uploadManager = new QCM_UploadManager();
    }

    // ===== 모달 관리자 클래스 =====
    class UploadModal {
        constructor(questionId, documentType) {
            this.questionId = questionId;
            this.documentType = documentType;
            this.modal = null;
            this.selectedFile = null;
        }

        open() {
            const config = window.qcm_uploadManager.getDocumentConfig(this.documentType);
            if (!config) {
                window.qcm_uploadManager.showError('알 수 없는 문서 유형입니다.');
                return;
            }

            // 기존 모달 제거
            this.close();

            // 모달 HTML 생성
            this.modal = document.createElement('div');
            this.modal.className = 'qcm-upload-modal';
            this.modal.innerHTML = `
                <div class="qcm-modal-overlay"></div>
                <div class="qcm-modal-content">
                    <div class="qcm-modal-header">
                        <h3>${config.title}</h3>
                        <button class="qcm-modal-close-btn">×</button>
                    </div>
                    <div class="qcm-modal-body">
                        <div class="qcm-upload-description">
                            <p>${config.description}</p>
                        </div>
                        
                        <div class="qcm-upload-instructions">
                            <h4>업로드 절차</h4>
                            <div>${config.instructions}</div>
                        </div>
                        
                        <div class="qcm-file-drop-zone">
                            <div class="qcm-drop-content">
                                <i class="fas fa-cloud-upload-alt"></i>
                                <p>파일을 드래그하여 놓거나 클릭하여 선택하세요</p>
                                <small>지원 형식: ${config.acceptFiles.replace(/\./g, '').toUpperCase()}</small>
                            </div>
                            <input type="file" class="qcm-file-input" accept="${config.acceptFiles}">
                        </div>
                        
                        <div class="qcm-selected-file" style="display: none;">
                            <div class="qcm-file-info">
                                <i class="fas fa-file"></i>
                                <span class="qcm-file-name"></span>
                                <span class="qcm-file-size"></span>
                            </div>
                            <button class="qcm-remove-file-btn">×</button>
                        </div>
                        
                        <div class="qcm-upload-progress" style="display: none;">
                            <div class="qcm-progress-bar">
                                <div class="qcm-progress-fill"></div>
                            </div>
                            <span class="qcm-progress-text">0%</span>
                        </div>
                    </div>
                    <div class="qcm-modal-footer">
                        <button class="qcm-cancel-btn">취소</button>
                        <button class="qcm-upload-btn" disabled>업로드</button>
                    </div>
                </div>
            `;

            document.body.appendChild(this.modal);
            this.setupEvents();
            
            // 애니메이션
            setTimeout(() => {
                this.modal.classList.add('qcm-modal-show');
            }, 10);
        }

        close() {
            const existingModal = document.querySelector('.qcm-upload-modal');
            if (existingModal) {
                // 이벤트 리스너 정리
                if (this.keydownHandler) {
                    document.removeEventListener('keydown', this.keydownHandler);
                }
                existingModal.remove();
            }
        }

        setupEvents() {
            const overlay = this.modal.querySelector('.qcm-modal-overlay');
            const closeBtn = this.modal.querySelector('.qcm-modal-close-btn');
            const cancelBtn = this.modal.querySelector('.qcm-cancel-btn');
            const dropZone = this.modal.querySelector('.qcm-file-drop-zone');
            const fileInput = this.modal.querySelector('.qcm-file-input');
            const removeBtn = this.modal.querySelector('.qcm-remove-file-btn');
            const uploadBtn = this.modal.querySelector('.qcm-upload-btn');

            // 파일 input 상태 확인
            console.log('File input element:', fileInput);
            console.log('File input style display:', fileInput?.style.display);
            console.log('File input visibility:', window.getComputedStyle(fileInput).visibility);
            console.log('File input opacity:', window.getComputedStyle(fileInput).opacity);

            // 모달 닫기 이벤트
            overlay.addEventListener('click', () => this.close());
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            });
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.close();
            });

            // 파일 input 이벤트가 자동으로 처리되므로 드롭존 클릭 이벤트는 제거
            // 대신 파일 input의 change 이벤트만 처리
            fileInput.addEventListener('change', (e) => {
                console.log('파일 input change 이벤트 발생');
                const file = e.target.files[0];
                if (file) {
                    console.log('파일 선택됨:', file.name, file.size, file.type);
                    this.handleFileSelection(file);
                } else {
                    console.log('파일이 선택되지 않음 또는 취소됨');
                }
            });

            // 파일 input 클릭 이벤트 (디버깅용)
            fileInput.addEventListener('click', (e) => {
                console.log('파일 input이 클릭됨');
            });

            // 드래그 앤 드롭 이벤트는 드롭존에서 처리
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.add('qcm-drag-over');
                console.log('드래그 오버');
            });

            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!dropZone.contains(e.relatedTarget)) {
                    dropZone.classList.remove('qcm-drag-over');
                    console.log('드래그 떠남');
                }
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropZone.classList.remove('qcm-drag-over');
                console.log('파일 드롭됨');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    console.log('드롭된 파일:', files[0].name);
                    // 드롭된 파일을 파일 input에도 설정
                    const dt = new DataTransfer();
                    dt.items.add(files[0]);
                    fileInput.files = dt.files;
                    
                    this.handleFileSelection(files[0]);
                }
            });

            // 파일 제거
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.removeFile();
            });

            // 업로드
            uploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.uploadFile();
            });

            // ESC 키
            this.keydownHandler = this.handleKeydown.bind(this);
            document.addEventListener('keydown', this.keydownHandler);

            // 디버깅용
            window.debugFileInput = fileInput;
            window.debugDropZone = dropZone;
            
            // 파일 input이 실제로 클릭 가능한지 테스트
            console.log('파일 input 위치:', fileInput.getBoundingClientRect());
            console.log('드롭존 위치:', dropZone.getBoundingClientRect());
        }

        handleKeydown(e) {
            if (e.key === 'Escape') {
                this.close();
            }
        }

        handleFileSelection(file) {
            try {
                window.qcm_uploadManager.validateFile(file, this.documentType);
                
                this.selectedFile = file;
                
                const dropZone = this.modal.querySelector('.qcm-file-drop-zone');
                const selectedFileDiv = this.modal.querySelector('.qcm-selected-file');
                const fileName = this.modal.querySelector('.qcm-file-name');
                const fileSize = this.modal.querySelector('.qcm-file-size');
                const uploadBtn = this.modal.querySelector('.qcm-upload-btn');
                
                fileName.textContent = file.name;
                fileSize.textContent = window.qcm_uploadManager.formatFileSize(file.size);
                
                dropZone.style.display = 'none';
                selectedFileDiv.style.display = 'flex';
                uploadBtn.disabled = false;
                
            } catch (error) {
                window.qcm_uploadManager.showError(error.message);
            }
        }

        removeFile() {
            this.selectedFile = null;
            
            const dropZone = this.modal.querySelector('.qcm-file-drop-zone');
            const selectedFileDiv = this.modal.querySelector('.qcm-selected-file');
            const fileInput = this.modal.querySelector('.qcm-file-input');
            const uploadBtn = this.modal.querySelector('.qcm-upload-btn');
            
            selectedFileDiv.style.display = 'none';
            dropZone.style.display = 'flex';
            uploadBtn.disabled = true;
            fileInput.value = '';
        }

        async uploadFile() {
            if (!this.selectedFile) {
                window.qcm_uploadManager.showError('업로드할 파일을 선택해주세요.');
                return;
            }

            const uploadBtn = this.modal.querySelector('.qcm-upload-btn');
            const progressDiv = this.modal.querySelector('.qcm-upload-progress');
            const progressFill = this.modal.querySelector('.qcm-progress-fill');
            const progressText = this.modal.querySelector('.qcm-progress-text');

            try {
                uploadBtn.disabled = true;
                uploadBtn.textContent = '업로드 중...';
                progressDiv.style.display = 'block';

                const progressCallback = (percentComplete) => {
                    progressFill.style.width = percentComplete + '%';
                    progressText.textContent = Math.round(percentComplete) + '%';
                };

                await window.qcm_uploadManager.uploadFile(
                    this.questionId, 
                    this.documentType, 
                    this.selectedFile, 
                    progressCallback
                );

                window.qcm_uploadManager.showSuccess('파일이 성공적으로 업로드되었습니다.');
                this.close();
                window.qcm_uploadManager.refreshQuestionsList();

            } catch (error) {
                console.error('파일 업로드 오류:', error);
                window.qcm_uploadManager.showError('파일 업로드 중 오류가 발생했습니다: ' + error.message);
                
                uploadBtn.disabled = false;
                uploadBtn.textContent = '업로드';
                progressDiv.style.display = 'none';
            }
        }
    }

    // ===== 전역 함수들 =====
    
    function qcm_openUploadModal(questionId, documentType) {
        console.log('업로드 모달 열기:', questionId, documentType);
        
        if (!questionId) {
            window.qcm_uploadManager.showError('질문서 ID가 없습니다.');
            return;
        }
        
        const modal = new UploadModal(questionId, documentType);
        modal.open();
    }

    // 다운로드 함수들
   function qcm_downloadDepartmentSample() {
        const url = `https://silbo.kr/static/user/%EA%B3%BC%EB%B3%84%EC%9D%B8%EC%9B%90.xlsx`;
        window.open(url, '_blank');
    }

    function qcm_downloadCertificate(questionId) {
        if (!questionId) {
            window.qcm_uploadManager.showError('질문서 ID가 없습니다.');
            return;
        }
        const url = `https://silbo.kr/2014/_pages/php/downExcel/certificate.php?claimNum=${questionId}`;
        window.open(url, '_blank');
    }

    function qcm_downloadReceipt(questionId) {
        if (!questionId) {
            window.qcm_uploadManager.showError('질문서 ID가 없습니다.');
            return;
        }
        const url = `https://silbo.kr/2014/_pages/php/downExcel/receipt.php?claimNum=${questionId}`;
        window.open(url, '_blank');
    }

    function qcm_downloadSubscriptionForm(questionId) {
        if (!questionId) {
            window.qcm_uploadManager.showError('질문서 ID가 없습니다.');
            return;
        }
        const url = `https://silbo.kr/2014/_pages/php/downExcel/subscription.php?claimNum=${questionId}`;
        window.open(url, '_blank');
    }

    function qcm_downloadQuestion(questionId) {
        if (!questionId) {
            window.qcm_uploadManager.showError('질문서 ID가 없습니다.');
            return;
        }
        const url = `https://silbo.kr/2014/_pages/php/downExcel/claim2.php?claimNum=${questionId}&download=1`;
        window.open(url, '_blank');
    }

    function qcm_viewImage(imageUrl, fileName) {
        const existingModal = document.querySelector('.qcm-image-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'qcm-image-modal';
        modal.innerHTML = `
            <div class="qcm-image-overlay"></div>
            <div class="qcm-image-content">
                <div class="qcm-image-header">
                    <span>${fileName}</span>
                    <button class="qcm-image-close">×</button>
                </div>
                <div class="qcm-image-body">
                    <img src="${imageUrl}" alt="${fileName}">
                </div>
                <div class="qcm-image-footer">
                    <button onclick="window.open('${imageUrl}', '_blank')">새 창에서 보기</button>
                    <button onclick="qcm_downloadImage('${imageUrl}', '${fileName}')">다운로드</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 이벤트
        modal.querySelector('.qcm-image-overlay').addEventListener('click', () => modal.remove());
        modal.querySelector('.qcm-image-close').addEventListener('click', () => modal.remove());
        
        setTimeout(() => modal.classList.add('qcm-modal-show'), 10);
    }

    function qcm_downloadImage(imageUrl, fileName) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 전역 함수 등록
    window.qcm_openUploadModal = qcm_openUploadModal;
    window.qcm_downloadDepartmentSample = qcm_downloadDepartmentSample;
    window.qcm_downloadCertificate = qcm_downloadCertificate;
    window.qcm_downloadReceipt = qcm_downloadReceipt;
    window.qcm_downloadSubscriptionForm = qcm_downloadSubscriptionForm;
    window.qcm_downloadQuestion = qcm_downloadQuestion;
    window.qcm_viewImage = qcm_viewImage;
    window.qcm_downloadImage = qcm_downloadImage;

    console.log('질문서 업로드 관리자 스크립트 로드 완료');
}

// CSS 스타일 추가
const style = document.createElement('style');
style.textContent = `
.qcm-upload-modal, .qcm-image-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    backdrop-filter: blur(2px);
}

.qcm-upload-modal.qcm-modal-show, .qcm-image-modal.qcm-modal-show {
    opacity: 1;
    visibility: visible;
}

.qcm-modal-overlay, .qcm-image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6));
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { 
        opacity: 0;
        transform: translate(-50%, -30%) scale(0.9);
    }
    to { 
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

.qcm-modal-content, .qcm-image-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 16px;
    box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.1);
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
    animation: slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.qcm-modal-content {
    width: 540px;
    max-width: 95vw;
}

.qcm-modal-header, .qcm-image-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 28px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    position: relative;
}

.qcm-modal-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
}

.qcm-modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
}

.qcm-modal-header h3::before {
    content: '📤';
    font-size: 18px;
}

.qcm-modal-close-btn, .qcm-image-close {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 18px;
    cursor: pointer;
    color: white;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
    backdrop-filter: blur(10px);
}

.qcm-modal-close-btn:hover, .qcm-image-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg) scale(1.1);
}

.qcm-modal-body {
    padding: 28px;
    background: #fafbfc;
}

.qcm-upload-description {
    margin-bottom: 24px;
    padding: 20px;
    background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
    border-radius: 12px;
    border-left: 4px solid #667eea;
}

.qcm-upload-description p {
    margin: 0;
    color: #37474f;
    font-size: 15px;
    line-height: 1.5;
}

.qcm-upload-instructions {
    margin-bottom: 28px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e1e8ed;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.qcm-upload-instructions h4 {
    margin: 0 0 16px 0;
    color: #1a1a1a;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
}

.qcm-upload-instructions h4::before {
    content: '📋';
    font-size: 16px;
}

.qcm-upload-instructions div {
    color: #5a6c7d;
    line-height: 1.6;
    font-size: 14px;
}

.qcm-file-drop-zone {
    border: 2px dashed #c1c9d2;
    border-radius: 16px;
    padding: 48px 20px;
    text-align: center;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    margin-bottom: 24px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    position: relative;
    overflow: hidden;
    user-select: none;
}

.qcm-file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 10;
    font-size: 0;
}

.qcm-drop-content {
    position: relative;
    z-index: 1;
    pointer-events: none;
}

.qcm-file-drop-zone::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    transition: left 0.5s ease;
}

.qcm-file-drop-zone:hover::before {
    left: 100%;
}

.qcm-file-drop-zone:hover, .qcm-file-drop-zone.qcm-drag-over {
    border-color: #667eea;
    background: linear-gradient(135deg, #f0f4ff 0%, #e8f2ff 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.qcm-drop-content i {
    font-size: 56px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
    display: block;
}

.qcm-drop-content p {
    margin: 0 0 8px 0;
    color: #37474f;
    font-size: 16px;
    font-weight: 500;
}

.qcm-drop-content small {
    color: #78909c;
    font-size: 13px;
    padding: 6px 12px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 20px;
    display: inline-block;
}

.qcm-selected-file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: white;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;
}

.qcm-selected-file:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.qcm-file-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.qcm-file-info i {
    font-size: 24px;
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    padding: 12px;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.qcm-file-name {
    font-weight: 600;
    color: #1a1a1a;
    font-size: 15px;
}

.qcm-file-size {
    color: #78909c;
    font-size: 13px;
    margin-top: 4px;
}

.qcm-remove-file-btn {
    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(238, 90, 82, 0.3);
}

.qcm-remove-file-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(238, 90, 82, 0.4);
}

.qcm-upload-progress {
    margin-bottom: 24px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    border: 1px solid #e1e8ed;
}

.qcm-progress-bar {
    background: #f0f2f5;
    border-radius: 12px;
    height: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.qcm-progress-fill {
    background: linear-gradient(135deg, #667eea, #764ba2);
    height: 100%;
    width: 0%;
    transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
}

.qcm-progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
    animation: shine 2s infinite;
}

@keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}

.qcm-progress-text {
    text-align: center;
    font-size: 14px;
    color: #37474f;
    margin-top: 12px;
    font-weight: 600;
}

.qcm-modal-footer, .qcm-image-footer {
    padding: 24px 28px;
    background: #f8fafc;
    border-top: 1px solid #e1e8ed;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.qcm-cancel-btn, .qcm-upload-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 100px;
    justify-content: center;
}

.qcm-cancel-btn {
    background: white;
    color: #5a6c7d;
    border: 1px solid #d1d9e0;
}

.qcm-cancel-btn:hover {
    background: #f1f5f9;
    border-color: #b0bec5;
    transform: translateY(-1px);
}

.qcm-upload-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.qcm-upload-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.qcm-upload-btn:disabled {
    background: linear-gradient(135deg, #9e9e9e, #757575);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.qcm-image-body {
    padding: 0;
    text-align: center;
    background: #f5f5f5;
}

.qcm-image-body img {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 0 0 16px 16px;
}

/* 반응형 디자인 */
@media (max-width: 640px) {
    .qcm-modal-content {
        width: 95vw;
        margin: 20px;
    }
    
    .qcm-modal-header, .qcm-modal-body, .qcm-modal-footer {
        padding: 20px;
    }
    
    .qcm-file-drop-zone {
        padding: 32px 16px;
    }
    
    .qcm-drop-content i {
        font-size: 48px;
    }
}


`;
document.head.appendChild(style);