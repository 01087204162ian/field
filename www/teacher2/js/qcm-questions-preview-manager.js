// 수정된 코드로 변경:
// 질문서 날인본이 있으면 날인본 미리보기 버튼
if (imageCategories.question.stamped) {
    questionButtons += `
        <button class="inline-view-btn stamped-premium" 
                onclick="qcm_openStampedPreviewModal(${question.num}, 'question', 'stamped')" 
                title="질문서 날인본 미리보기">
            <i class="fas fa-stamp"></i>
            <span class="btn-text">날인본</span>
        </button>`;
}

// ===== 추가할 새로운 함수들 (스크립트 맨 끝에 추가) =====

// 날인본 미리보기 모달 열기 함수
function qcm_openStampedPreviewModal(questionId, docType, version = 'stamped') {
    console.log('날인본 미리보기 모달 열기:', { questionId, docType, version });
    
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
    
    // 디버깅: 전체 이미지 데이터 출력
    console.log('질문서 전체 이미지 데이터:', question.images);
    
    // 이미지 분류
    const imageCategories = window.qcm_questionsManager.qcm_categorizeImages(question.images);
    console.log('분류된 이미지:', imageCategories);
    
    let targetImage = null;
    
    // 문서 타입에 따라 날인본 이미지 선택
    switch (docType) {
        case 'question':
            targetImage = imageCategories.question.stamped;
            break;
        case 'subscription':
            targetImage = imageCategories.subscription.stamped;
            break;
        case 'department':
            targetImage = imageCategories.department.stamped;
            break;
    }
    
    console.log('선택된 타겟 이미지:', targetImage);
    
    if (!targetImage) {
        alert(`${window.qcm_questionsManager.qcm_getDocumentName(docType)} 날인본을 찾을 수 없습니다.`);
        return;
    }
    
    // 이미지 URL 확인 및 보정
    let imageUrl = targetImage.description2;
    if (!imageUrl) {
        // description2가 없으면 다른 필드들 확인
        imageUrl = targetImage.url || targetImage.file_path || targetImage.image_url;
        console.log('대체 이미지 URL 사용:', imageUrl);
    }
    
    if (!imageUrl) {
        console.error('이미지 URL을 찾을 수 없음:', targetImage);
        alert('이미지 파일 경로를 찾을 수 없습니다.');
        return;
    }
    
    // URL 보정 (상대경로를 절대경로로 변환)
    if (imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
        imageUrl = window.location.origin + '/' + imageUrl.replace(/^\.\//, '').replace(/^\.\.\//, '');
    } else if (imageUrl.startsWith('/')) {
        imageUrl = window.location.origin + imageUrl;
    } else if (!imageUrl.startsWith('http')) {
        imageUrl = window.location.origin + '/' + imageUrl;
    }
    
    console.log('최종 이미지 URL:', imageUrl);
    
    // 모달 생성 및 표시
    qcm_createStampedPreviewModal(targetImage, docType, questionId, imageUrl);
}

// 날인본 미리보기 모달 생성 함수
function qcm_createStampedPreviewModal(imageData, docType, questionId, imageUrl) {
    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById('stampedPreviewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const documentName = window.qcm_questionsManager.qcm_getDocumentName(docType);
    const fileName = imageData.title || `${documentName}_날인본`;
    
    console.log('모달 생성 정보:', {
        documentName,
        fileName,
        imageUrl,
        imageData
    });
    
    // 모달 HTML 생성
    const modalHTML = `
        <div id="stampedPreviewModal" class="stamped-preview-modal">
            <div class="modal-overlay" onclick="qcm_closeStampedPreviewModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-stamp"></i> ${documentName} 날인본 미리보기</h3>
                    <button class="modal-close-btn" onclick="qcm_closeStampedPreviewModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="image-container">
                        <img src="${imageUrl}" alt="${documentName} 날인본" id="previewImage" />
                        <div class="image-loading" id="imageLoading">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>이미지 로딩 중...</p>
                        </div>
                        <div class="image-error" id="imageError" style="display: none;">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p>이미지를 불러올 수 없습니다.</p>
                            <small>URL: ${imageUrl}</small>
                            <button onclick="qcm_retryImageLoad('${imageUrl}')" class="retry-btn">
                                <i class="fas fa-redo"></i> 다시 시도
                            </button>
                            <button onclick="qcm_showImageDebugInfo()" class="debug-btn">
                                <i class="fas fa-info"></i> 디버그 정보
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-download-btn" onclick="qcm_downloadFromPreview('${imageUrl}', '${fileName}')">
                        <i class="fas fa-download"></i>
                        다운로드
                    </button>
                    <button class="modal-cancel-btn" onclick="qcm_closeStampedPreviewModal()">
                        <i class="fas fa-times"></i>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 모달을 body에 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 모달 스타일 추가 (한 번만)
    if (!document.getElementById('stampedPreviewModalStyles')) {
        qcm_addStampedPreviewModalStyles();
    }
    
    // 이미지 로딩 이벤트 처리
    const previewImage = document.getElementById('previewImage');
    const loadingDiv = document.getElementById('imageLoading');
    const errorDiv = document.getElementById('imageError');
    
    console.log('이미지 로딩 시작:', imageUrl);
    
    previewImage.onload = function() {
        console.log('이미지 로딩 성공');
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'none';
        previewImage.style.display = 'block';
    };
    
    previewImage.onerror = function() {
        console.error('이미지 로딩 실패:', imageUrl);
        loadingDiv.style.display = 'none';
        errorDiv.style.display = 'flex';
        previewImage.style.display = 'none';
        
        // 추가 디버깅 정보
        qcm_debugImageLoad(imageUrl, imageData);
    };
    
    // 이미지 로딩 타임아웃 (10초)
    setTimeout(() => {
        if (loadingDiv.style.display !== 'none') {
            console.warn('이미지 로딩 타임아웃');
            previewImage.onerror();
        }
    }, 10000);
    
    // 모달 표시
    const modal = document.getElementById('stampedPreviewModal');
    modal.style.display = 'flex';
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', qcm_handleModalKeydown);
}

// 날인본 미리보기 모달 스타일 추가
function qcm_addStampedPreviewModalStyles() {
    const styles = `
        <style id="stampedPreviewModalStyles">
        .stamped-preview-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            align-items: center;
            justify-content: center;
        }
        
        .stamped-preview-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
        }
        
        .stamped-preview-modal .modal-content {
            position: relative;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(255, 255, 255, 0.3);
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            animation: modalFadeIn 0.3s ease-out;
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .stamped-preview-modal .modal-header {
            padding: 20px 25px 15px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
            border-radius: 12px 12px 0 0;
        }
        
        .stamped-preview-modal .modal-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .stamped-preview-modal .modal-header h3 i {
            color: #e74c3c;
        }
        
        .stamped-preview-modal .modal-close-btn {
            background: none;
            border: none;
            font-size: 20px;
            color: #666;
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }
        
        .stamped-preview-modal .modal-close-btn:hover {
            background: #f0f0f0;
            color: #333;
        }
        
        .stamped-preview-modal .modal-body {
            padding: 0;
            flex: 1;
            overflow: hidden;
            position: relative;
            min-height: 400px;
        }
        
        .stamped-preview-modal .image-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            max-height: 70vh;
        }
        
        .stamped-preview-modal .image-container img {
            max-width: 100%;
            max-height: 100%;
            display: none;
            border-radius: 0 0 12px 12px;
            object-fit: contain;
        }
        
        .stamped-preview-modal .image-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #666;
        }
        
        .stamped-preview-modal .image-loading i {
            font-size: 32px;
            margin-bottom: 15px;
            color: #3498db;
        }
        
        .stamped-preview-modal .image-loading p {
            margin: 0;
            font-size: 16px;
        }
        
        .stamped-preview-modal .image-error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #e74c3c;
            flex-direction: column;
            align-items: center;
            gap: 15px;
        }
        
        .stamped-preview-modal .image-error i {
            font-size: 48px;
            margin-bottom: 15px;
            color: #e74c3c;
        }
        
        .stamped-preview-modal .image-error p {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .stamped-preview-modal .image-error small {
            display: block;
            font-size: 12px;
            color: #666;
            word-break: break-all;
            max-width: 400px;
            margin: 10px 0;
        }
        
        .stamped-preview-modal .retry-btn,
        .stamped-preview-modal .debug-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            margin: 0 5px;
            transition: all 0.2s ease;
        }
        
        .stamped-preview-modal .retry-btn {
            background: #3498db;
            color: white;
        }
        
        .stamped-preview-modal .retry-btn:hover {
            background: #2980b9;
        }
        
        .stamped-preview-modal .debug-btn {
            background: #95a5a6;
            color: white;
        }
        
        .stamped-preview-modal .debug-btn:hover {
            background: #7f8c8d;
        }
        
        .stamped-preview-modal .modal-footer {
            padding: 20px 25px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            background: #f8f9fa;
            border-radius: 0 0 12px 12px;
        }
        
        .stamped-preview-modal .modal-download-btn,
        .stamped-preview-modal .modal-cancel-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .stamped-preview-modal .modal-download-btn {
            background: #27ae60;
            color: white;
        }
        
        .stamped-preview-modal .modal-download-btn:hover {
            background: #219a52;
            transform: translateY(-1px);
        }
        
        .stamped-preview-modal .modal-cancel-btn {
            background: #95a5a6;
            color: white;
        }
        
        .stamped-preview-modal .modal-cancel-btn:hover {
            background: #7f8c8d;
        }
        
        /* 반응형 디자인 */
        @media (max-width: 768px) {
            .stamped-preview-modal .modal-content {
                max-width: 95vw;
                max-height: 95vh;
                margin: 10px;
            }
            
            .stamped-preview-modal .modal-header {
                padding: 15px 20px 12px;
            }
            
            .stamped-preview-modal .modal-header h3 {
                font-size: 16px;
            }
            
            .stamped-preview-modal .modal-footer {
                padding: 15px 20px;
                flex-direction: column;
            }
            
            .stamped-preview-modal .modal-download-btn,
            .stamped-preview-modal .modal-cancel-btn {
                width: 100%;
                justify-content: center;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// 미리보기에서 다운로드 함수
function qcm_downloadFromPreview(imageUrl, fileName) {
    console.log('미리보기에서 다운로드:', { imageUrl, fileName });
    
    const fileExtension = imageUrl.split('.').pop() || 'jpg';
    const downloadFileName = `${fileName}.${fileExtension}`;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 다운로드 후 모달 닫기
    qcm_closeStampedPreviewModal();
    
    // 성공 메시지
    if (window.qcm_questionsManager) {
        window.qcm_questionsManager.qcm_showSuccess('파일이 다운로드되었습니다.');
    }
}

// 날인본 미리보기 모달 닫기 함수
function qcm_closeStampedPreviewModal() {
    const modal = document.getElementById('stampedPreviewModal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
    
    // ESC 키 이벤트 리스너 제거
    document.removeEventListener('keydown', qcm_handleModalKeydown);
}

// 모달 키보드 이벤트 처리
function qcm_handleModalKeydown(event) {
    if (event.key === 'Escape') {
        qcm_closeStampedPreviewModal();
    }
}

// 전역 함수로 등록
window.qcm_openStampedPreviewModal = qcm_openStampedPreviewModal;
window.qcm_closeStampedPreviewModal = qcm_closeStampedPreviewModal;
window.qcm_downloadFromPreview = qcm_downloadFromPreview;

// 이미지 로딩 디버깅 함수
function qcm_debugImageLoad(imageUrl, imageData) {
    console.group('=== 이미지 로딩 디버깅 ===');
    console.log('시도한 URL:', imageUrl);
    console.log('원본 이미지 데이터:', imageData);
    console.log('현재 페이지 URL:', window.location.href);
    console.log('Base URL:', window.location.origin);
    
    // 가능한 모든 URL 필드 확인
    const urlFields = ['description2', 'url', 'file_path', 'image_url', 'src', 'href'];
    console.log('이미지 데이터의 URL 관련 필드들:');
    urlFields.forEach(field => {
        if (imageData[field]) {
            console.log(`- ${field}:`, imageData[field]);
        }
    });
    console.groupEnd();
}

// 이미지 재시도 함수
function qcm_retryImageLoad(originalUrl) {
    const previewImage = document.getElementById('previewImage');
    const loadingDiv = document.getElementById('imageLoading');
    const errorDiv = document.getElementById('imageError');
    
    if (!previewImage) return;
    
    // 다양한 URL 변형 시도
    const urlVariations = [
        originalUrl,
        originalUrl.replace(/^https:/, 'http:'),
        originalUrl.replace(/^http:/, 'https:'),
        originalUrl.replace(/\/+/g, '/').replace(/:\//g, '://'),
        window.location.origin + originalUrl.replace(window.location.origin, ''),
        window.location.origin + '/' + originalUrl.replace(/^.*\/([^\/]+)$/, '$1')
    ];
    
    console.log('이미지 재시도 URL 목록:', urlVariations);
    
    let currentIndex = 0;
    
    function tryNextUrl() {
        if (currentIndex >= urlVariations.length) {
            console.error('모든 URL 변형 시도 실패');
            errorDiv.style.display = 'flex';
            loadingDiv.style.display = 'none';
            return;
        }
        
        const testUrl = urlVariations[currentIndex];
        console.log(`URL 시도 ${currentIndex + 1}:`, testUrl);
        
        errorDiv.style.display = 'none';
        loadingDiv.style.display = 'block';
        
        previewImage.onload = function() {
            console.log('성공한 URL:', testUrl);
            loadingDiv.style.display = 'none';
            previewImage.style.display = 'block';
        };
        
        previewImage.onerror = function() {
            console.log('실패한 URL:', testUrl);
            currentIndex++;
            setTimeout(tryNextUrl, 500); // 0.5초 후 다음 URL 시도
        };
        
        previewImage.src = testUrl;
    }
    
    tryNextUrl();
}

// 디버그 정보 표시 함수
function qcm_showImageDebugInfo() {
    if (!window.qcm_questionsManager || !window.qcm_questionsManager.currentData) {
        alert('디버그 정보를 가져올 수 없습니다.');
        return;
    }
    
    const debugInfo = {
        currentData: window.qcm_questionsManager.currentData,
        location: window.location,
        userAgent: navigator.userAgent
    };
    
    console.log('=== 전체 디버그 정보 ===', debugInfo);
    
    // 디버그 정보를 새 창에 표시
    const debugWindow = window.open('', '_blank', 'width=800,height=600');
    debugWindow.document.write(`
        <html>
        <head><title>이미지 로딩 디버그 정보</title></head>
        <body>
            <h3>이미지 로딩 디버그 정보</h3>
            <pre>${JSON.stringify(debugInfo, null, 2)}</pre>
        </body>
        </html>
    `);
}

// 전역 함수 등록
window.qcm_retryImageLoad = qcm_retryImageLoad;
window.qcm_showImageDebugInfo = qcm_showImageDebugInfo;
window.qcm_debugImageLoad = qcm_debugImageLoad;// 수정된 코드로 변경:
// 질문서 날인본이 있으면 날인본 미리보기 버튼
if (imageCategories.question.stamped) {
    questionButtons += `
        <button class="inline-view-btn stamped-premium" 
                onclick="qcm_openStampedPreviewModal(${question.num}, 'question', 'stamped')" 
                title="질문서 날인본 미리보기">
            <i class="fas fa-stamp"></i>
            <span class="btn-text">날인본</span>
        </button>`;
}

// ===== 수정 부분 2: 질문서 날인본 다운로드 버튼 수정 =====
// 기존 코드 (약 320-330번째 줄 근처):
// 질문서 날인본이 있으면 날인본 다운로드 버튼
if (imageCategories.question.stamped) {
    questionButtons += `
        <button class="inline-download-btn stamped" 
                onclick="qcm_downloadDocument(${question.num}, 'question', 'stamped')" 
                title="질문서 날인본 다운로드">
            <i class="fas fa-stamp"></i>
            <span class="btn-text">날인본</span>
        </button>`;
}

// 수정된 코드로 변경:
// 질문서 날인본이 있으면 날인본 미리보기 버튼
if (imageCategories.question.stamped) {
    questionButtons += `
        <button class="inline-view-btn stamped-premium" 
                onclick="qcm_openStampedPreviewModal(${question.num}, 'question', 'stamped')" 
                title="질문서 날인본 미리보기">
            <i class="fas fa-stamp"></i>
            <span class="btn-text">날인본</span>
        </button>`;
}

// ===== 추가할 새로운 함수들 (스크립트 맨 끝에 추가) =====

// 날인본 미리보기 모달 열기 함수
function qcm_openStampedPreviewModal(questionId, docType, version = 'stamped') {
    console.log('날인본 미리보기 모달 열기:', { questionId, docType, version });
    
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
    
    // 디버깅: 전체 이미지 데이터 출력
    console.log('질문서 전체 이미지 데이터:', question.images);
    
    // 이미지 분류
    const imageCategories = window.qcm_questionsManager.qcm_categorizeImages(question.images);
    console.log('분류된 이미지:', imageCategories);
    
    let targetImage = null;
    
    // 문서 타입에 따라 날인본 이미지 선택
    switch (docType) {
        case 'question':
            targetImage = imageCategories.question.stamped;
            break;
        case 'subscription':
            targetImage = imageCategories.subscription.stamped;
            break;
        case 'department':
            targetImage = imageCategories.department.stamped;
            break;
    }
    
    console.log('선택된 타겟 이미지:', targetImage);
    
    if (!targetImage) {
        alert(`${window.qcm_questionsManager.qcm_getDocumentName(docType)} 날인본을 찾을 수 없습니다.`);
        return;
    }
    
    // 이미지 URL 확인 및 보정
    let imageUrl = targetImage.description2;
    if (!imageUrl) {
        // description2가 없으면 다른 필드들 확인
        imageUrl = targetImage.url || targetImage.file_path || targetImage.image_url;
        console.log('대체 이미지 URL 사용:', imageUrl);
    }
    
    if (!imageUrl) {
        console.error('이미지 URL을 찾을 수 없음:', targetImage);
        alert('이미지 파일 경로를 찾을 수 없습니다.');
        return;
    }
    
    // URL 보정 (상대경로를 절대경로로 변환)
    if (imageUrl.startsWith('./') || imageUrl.startsWith('../')) {
        imageUrl = window.location.origin + '/' + imageUrl.replace(/^\.\//, '').replace(/^\.\.\//, '');
    } else if (imageUrl.startsWith('/')) {
        imageUrl = window.location.origin + imageUrl;
    } else if (!imageUrl.startsWith('http')) {
        imageUrl = window.location.origin + '/' + imageUrl;
    }
    
    console.log('최종 이미지 URL:', imageUrl);
    
    // 모달 생성 및 표시
    qcm_createStampedPreviewModal(targetImage, docType, questionId, imageUrl);
}

// 날인본 미리보기 모달 생성 함수
function qcm_createStampedPreviewModal(imageData, docType, questionId, imageUrl) {
    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById('stampedPreviewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const documentName = window.qcm_questionsManager.qcm_getDocumentName(docType);
    const fileName = imageData.title || `${documentName}_날인본`;
    
    console.log('모달 생성 정보:', {
        documentName,
        fileName,
        imageUrl,
        imageData
    });
    
    // 파일 확장자 확인
    const fileExtension = imageUrl.split('.').pop().toLowerCase();
    const isPDF = fileExtension === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
    
    console.log('파일 타입 확인:', { fileExtension, isPDF, isImage });
    
    let contentHTML = '';
    
    if (isPDF) {
        // PDF인 경우 embed 또는 iframe 사용
        contentHTML = `
            <div class="pdf-container">
                <embed src="${imageUrl}" type="application/pdf" width="100%" height="600px" />
                <div class="pdf-fallback" style="display: none;">
                    <div class="pdf-message">
                        <i class="fas fa-file-pdf"></i>
                        <h4>PDF 미리보기</h4>
                        <p>이 브라우저에서는 PDF 미리보기가 지원되지 않습니다.</p>
                        <p>파일을 다운로드하여 확인해주세요.</p>
                        <button onclick="qcm_downloadFromPreview('${imageUrl}', '${fileName}')" class="pdf-download-btn">
                            <i class="fas fa-download"></i>
                            PDF 다운로드
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else if (isImage) {
        // 이미지인 경우 기존 방식 사용
        contentHTML = `
            <div class="image-container">
                <img src="${imageUrl}" alt="${documentName} 날인본" id="previewImage" />
                <div class="image-loading" id="imageLoading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>이미지 로딩 중...</p>
                </div>
                <div class="image-error" id="imageError" style="display: none;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>이미지를 불러올 수 없습니다.</p>
                    <small>URL: ${imageUrl}</small>
                    <button onclick="qcm_retryImageLoad('${imageUrl}')" class="retry-btn">
                        <i class="fas fa-redo"></i> 다시 시도
                    </button>
                    <button onclick="qcm_showImageDebugInfo()" class="debug-btn">
                        <i class="fas fa-info"></i> 디버그 정보
                    </button>
                </div>
            </div>
        `;
    } else {
        // 지원하지 않는 파일 형식
        contentHTML = `
            <div class="unsupported-container">
                <div class="unsupported-message">
                    <i class="fas fa-file"></i>
                    <h4>지원하지 않는 파일 형식</h4>
                    <p>파일 형식: .${fileExtension}</p>
                    <p>이 파일은 미리보기할 수 없습니다.</p>
                    <button onclick="qcm_downloadFromPreview('${imageUrl}', '${fileName}')" class="unsupported-download-btn">
                        <i class="fas fa-download"></i>
                        파일 다운로드
                    </button>
                </div>
            </div>
        `;
    }
    
    // 모달 HTML 생성
    const modalHTML = `
        <div id="stampedPreviewModal" class="stamped-preview-modal">
            <div class="modal-overlay" onclick="qcm_closeStampedPreviewModal()"></div>
            <div class="modal-content ${isPDF ? 'pdf-modal' : ''}">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-${isPDF ? 'file-pdf' : 'stamp'}"></i> 
                        ${documentName} 날인본 ${isPDF ? 'PDF' : '미리보기'}
                    </h3>
                    <button class="modal-close-btn" onclick="qcm_closeStampedPreviewModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${contentHTML}
                </div>
                <div class="modal-footer">
                    <button class="modal-download-btn" onclick="qcm_downloadFromPreview('${imageUrl}', '${fileName}')">
                        <i class="fas fa-download"></i>
                        다운로드
                    </button>
                    <button class="modal-cancel-btn" onclick="qcm_closeStampedPreviewModal()">
                        <i class="fas fa-times"></i>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 모달을 body에 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 모달 스타일 추가 (한 번만)
    if (!document.getElementById('stampedPreviewModalStyles')) {
        qcm_addStampedPreviewModalStyles();
    }
    
    // 이미지인 경우에만 이미지 로딩 이벤트 처리
    if (isImage) {
        const previewImage = document.getElementById('previewImage');
        const loadingDiv = document.getElementById('imageLoading');
        const errorDiv = document.getElementById('imageError');
        
        console.log('이미지 로딩 시작:', imageUrl);
        
        previewImage.onload = function() {
            console.log('이미지 로딩 성공');
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            previewImage.style.display = 'block';
        };
        
        previewImage.onerror = function() {
            console.error('이미지 로딩 실패:', imageUrl);
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'flex';
            previewImage.style.display = 'none';
            
            // 추가 디버깅 정보
            qcm_debugImageLoad(imageUrl, imageData);
        };
        
        // 이미지 로딩 타임아웃 (10초)
        setTimeout(() => {
            if (loadingDiv.style.display !== 'none') {
                console.warn('이미지 로딩 타임아웃');
                previewImage.onerror();
            }
        }, 10000);
    } else if (isPDF) {
        // PDF embed 실패 시 대체 메시지 표시
        setTimeout(() => {
            const embed = document.querySelector('.pdf-container embed');
            const fallback = document.querySelector('.pdf-fallback');
            
            if (embed && fallback) {
                // PDF 로딩 확인 (간단한 방법)
                try {
                    // embed 요소의 실제 높이가 0이면 로딩 실패로 간주
                    if (embed.offsetHeight === 0) {
                        embed.style.display = 'none';
                        fallback.style.display = 'flex';
                    }
                } catch (e) {
                    console.warn('PDF 로딩 상태 확인 실패:', e);
                }
            }
        }, 3000); // 3초 후 체크
    }
    
    // 모달 표시
    const modal = document.getElementById('stampedPreviewModal');
    modal.style.display = 'flex';
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', qcm_handleModalKeydown);
}

// 날인본 미리보기 모달 스타일 추가 (모바일 최적화)
function qcm_addStampedPreviewModalStyles() {
    const styles = `
        <style id="stampedPreviewModalStyles">
        .stamped-preview-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            align-items: center;
            justify-content: center;
            /* 모바일에서 스크롤 방지 */
            overflow: hidden;
        }
        
        .stamped-preview-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
        }
        
        .stamped-preview-modal .modal-content {
            position: relative;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(255, 255, 255, 0.3);
            max-width: 1200px;
            max-height: 90vh;
            width: 95vw;
            display: flex;
            flex-direction: column;
            animation: modalFadeIn 0.3s ease-out;
            /* 모바일에서 안전한 영역 확보 */
            margin: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-left, 0);
        }
        
        .stamped-preview-modal .modal-content.pdf-modal {
            max-width: 1400px;
            width: 98vw;
            max-height: 95vh;
        }
        
        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .stamped-preview-modal .modal-header {
            padding: 20px 25px 15px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
            border-radius: 12px 12px 0 0;
            /* 모바일에서 헤더 고정 */
            flex-shrink: 0;
        }
        
        .stamped-preview-modal .modal-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            display: flex;
            align-items: center;
            gap: 10px;
            /* 모바일에서 텍스트 줄바꿈 방지 */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: calc(100% - 50px);
        }
        
        .stamped-preview-modal .modal-header h3 i {
            color: #e74c3c;
            flex-shrink: 0;
        }
        
        .stamped-preview-modal .modal-close-btn {
            background: none;
            border: none;
            font-size: 20px;
            color: #666;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            /* 모바일에서 터치 영역 확대 */
            min-width: 40px;
            min-height: 40px;
            flex-shrink: 0;
        }
        
        .stamped-preview-modal .modal-close-btn:hover {
            background: #f0f0f0;
            color: #333;
        }
        
        .stamped-preview-modal .modal-body {
            padding: 0;
            flex: 1;
            overflow: auto;
            position: relative;
            min-height: 300px;
            /* 모바일에서 스크롤 가능하도록 */
            -webkit-overflow-scrolling: touch;
        }
        
        .stamped-preview-modal .image-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            max-height: none;
            /* 모바일에서 이미지 컨테이너 유연성 */
            padding: 20px;
            box-sizing: border-box;
        }
        
        .stamped-preview-modal .image-container img {
            max-width: 100%;
            max-height: 100%;
            display: none;
            object-fit: contain;
            /* 모바일에서 이미지 터치 제스처 */
            touch-action: pan-x pan-y zoom;
        }
        
        .stamped-preview-modal .image-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #666;
        }
        
        .stamped-preview-modal .image-loading i {
            font-size: 32px;
            margin-bottom: 15px;
            color: #3498db;
        }
        
        .stamped-preview-modal .image-loading p {
            margin: 0;
            font-size: 16px;
        }
        
        .stamped-preview-modal .image-error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #e74c3c;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            max-width: 90%;
            padding: 20px;
            box-sizing: border-box;
        }
        
        .stamped-preview-modal .image-error i {
            font-size: 48px;
            margin-bottom: 15px;
            color: #e74c3c;
        }
        
        .stamped-preview-modal .image-error p {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        
        .stamped-preview-modal .image-error small {
            display: block;
            font-size: 12px;
            color: #666;
            word-break: break-all;
            max-width: 100%;
            margin: 10px 0;
        }
        
        .stamped-preview-modal .retry-btn,
        .stamped-preview-modal .debug-btn {
            padding: 10px 16px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            margin: 5px;
            transition: all 0.2s ease;
            /* 모바일에서 터치 영역 확대 */
            min-height: 44px;
            touch-action: manipulation;
        }
        
        .stamped-preview-modal .retry-btn {
            background: #3498db;
            color: white;
        }
        
        .stamped-preview-modal .retry-btn:hover {
            background: #2980b9;
        }
        
        .stamped-preview-modal .debug-btn {
            background: #95a5a6;
            color: white;
        }
        
        .stamped-preview-modal .debug-btn:hover {
            background: #7f8c8d;
        }
        
        /* PDF 컨테이너 스타일 */
        .stamped-preview-modal .pdf-container {
            width: 100%;
            height: 600px;
            min-height: 400px;
            position: relative;
            background: #f8f9fa;
            border-radius: 8px;
            overflow: hidden;
            margin: 10px;
        }
        
        .stamped-preview-modal .pdf-container embed {
            width: 100%;
            height: 100%;
            border: none;
        }
        
        .stamped-preview-modal .pdf-fallback {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
        }
        
        .stamped-preview-modal .pdf-message {
            text-align: center;
            color: #666;
            max-width: 90%;
            padding: 20px;
        }
        
        .stamped-preview-modal .pdf-message i {
            font-size: 48px;
            color: #e74c3c;
            margin-bottom: 20px;
        }
        
        .stamped-preview-modal .pdf-message h4 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #2c3e50;
        }
        
        .stamped-preview-modal .pdf-message p {
            margin: 10px 0;
            line-height: 1.5;
            font-size: 14px;
        }
        
        .stamped-preview-modal .pdf-download-btn {
            margin-top: 20px;
            padding: 12px 24px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            min-height: 44px;
            touch-action: manipulation;
        }
        
        .stamped-preview-modal .pdf-download-btn:hover {
            background: #c0392b;
            transform: translateY(-1px);
        }
        
        /* 지원하지 않는 파일 형식 스타일 */
        .stamped-preview-modal .unsupported-container {
            width: 100%;
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8f9fa;
            border-radius: 8px;
            margin: 10px;
        }
        
        .stamped-preview-modal .unsupported-message {
            text-align: center;
            color: #666;
            max-width: 90%;
            padding: 20px;
        }
        
        .stamped-preview-modal .unsupported-message i {
            font-size: 48px;
            color: #95a5a6;
            margin-bottom: 20px;
        }
        
        .stamped-preview-modal .unsupported-message h4 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #2c3e50;
        }
        
        .stamped-preview-modal .unsupported-message p {
            margin: 10px 0;
            line-height: 1.5;
            font-size: 14px;
        }
        
        .stamped-preview-modal .unsupported-download-btn {
            margin-top: 20px;
            padding: 12px 24px;
            background: #95a5a6;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            min-height: 44px;
            touch-action: manipulation;
        }
        
        .stamped-preview-modal .unsupported-download-btn:hover {
            background: #7f8c8d;
            transform: translateY(-1px);
        }
        
        .stamped-preview-modal .modal-footer {
            padding: 20px 25px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            background: #f8f9fa;
            border-radius: 0 0 12px 12px;
            /* 모바일에서 푸터 고정 */
            flex-shrink: 0;
        }
        
        .stamped-preview-modal .modal-download-btn,
        .stamped-preview-modal .modal-cancel-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            /* 모바일에서 터치 영역 확대 */
            min-height: 44px;
            touch-action: manipulation;
        }
        
        .stamped-preview-modal .modal-download-btn {
            background: #27ae60;
            color: white;
        }
        
        .stamped-preview-modal .modal-download-btn:hover {
            background: #219a52;
            transform: translateY(-1px);
        }
        
        .stamped-preview-modal .modal-cancel-btn {
            background: #95a5a6;
            color: white;
        }
        
        .stamped-preview-modal .modal-cancel-btn:hover {
            background: #7f8c8d;
        }
        
        /* 데스크톱 대형 화면 */
        @media (min-width: 1200px) {
            .stamped-preview-modal .modal-content {
                max-width: 1400px;
                width: 90vw;
            }
            
            .stamped-preview-modal .modal-content.pdf-modal {
                max-width: 1600px;
                width: 95vw;
            }
            
            .stamped-preview-modal .pdf-container {
                height: 800px;
            }
            
            .stamped-preview-modal .image-container {
                min-height: 600px;
                max-height: 80vh;
            }
        }
        
        /* 태블릿 화면 */
        @media (max-width: 1024px) and (min-width: 769px) {
            .stamped-preview-modal .modal-content {
                width: 90vw;
                max-height: 85vh;
            }
            
            .stamped-preview-modal .pdf-container {
                height: 550px;
            }
            
            .stamped-preview-modal .image-container {
                min-height: 400px;
                padding: 15px;
            }
        }
        
        /* 모바일 화면 (가장 중요한 부분) */
        @media (max-width: 768px) {
            .stamped-preview-modal {
                /* 모바일에서 확실히 표시되도록 */
                display: flex !important;
                padding: 10px;
                align-items: flex-start;
                padding-top: max(10px, env(safe-area-inset-top));
            }
            
            .stamped-preview-modal.show {
                display: flex !important;
            }
            
            .stamped-preview-modal .modal-content {
                width: calc(100vw - 20px);
                max-width: none;
                max-height: calc(100vh - 20px);
                margin: 0;
                border-radius: 8px;
                /* 모바일에서 세로 스크롤 허용 */
                overflow: hidden;
            }
            
            .stamped-preview-modal .modal-content.pdf-modal {
                width: calc(100vw - 10px);
                max-height: calc(100vh - 10px);
            }
            
            .stamped-preview-modal .modal-header {
                padding: 12px 15px 10px;
                flex-shrink: 0;
            }
            
            .stamped-preview-modal .modal-header h3 {
                font-size: 15px;
                max-width: calc(100% - 45px);
            }
            
            .stamped-preview-modal .modal-close-btn {
                width: 36px;
                height: 36px;
                font-size: 18px;
            }
            
            .stamped-preview-modal .modal-body {
                flex: 1;
                min-height: 250px;
                max-height: calc(100vh - 180px);
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
            
            .stamped-preview-modal .image-container {
                min-height: 250px;
                padding: 10px;
                max-height: none;
            }
            
            .stamped-preview-modal .image-container img {
                width: 100%;
                height: auto;
                max-height: calc(100vh - 200px);
            }
            
            .stamped-preview-modal .pdf-container {
                height: calc(100vh - 200px);
                min-height: 300px;
                margin: 5px;
                border-radius: 4px;
            }
            
            .stamped-preview-modal .pdf-message {
                padding: 15px;
            }
            
            .stamped-preview-modal .pdf-message i {
                font-size: 36px;
            }
            
            .stamped-preview-modal .pdf-message h4 {
                font-size: 16px;
            }
            
            .stamped-preview-modal .pdf-message p {
                font-size: 13px;
            }
            
            .stamped-preview-modal .unsupported-container {
                height: 300px;
                margin: 5px;
            }
            
            .stamped-preview-modal .unsupported-message {
                padding: 15px;
            }
            
            .stamped-preview-modal .unsupported-message i {
                font-size: 36px;
            }
            
            .stamped-preview-modal .unsupported-message h4 {
                font-size: 16px;
            }
            
            .stamped-preview-modal .modal-footer {
                padding: 12px 15px;
                flex-direction: column;
                gap: 10px;
                flex-shrink: 0;
            }
            
            .stamped-preview-modal .modal-download-btn,
            .stamped-preview-modal .modal-cancel-btn {
                width: 100%;
                justify-content: center;
                padding: 14px 20px;
                font-size: 15px;
            }
            
            .stamped-preview-modal .image-error {
                max-width: 95%;
                padding: 15px;
            }
            
            .stamped-preview-modal .image-error i {
                font-size: 36px;
            }
            
            .stamped-preview-modal .image-error p {
                font-size: 14px;
            }
            
            .stamped-preview-modal .image-error small {
                font-size: 11px;
            }
            
            .stamped-preview-modal .retry-btn,
            .stamped-preview-modal .debug-btn {
                padding: 12px 16px;
                font-size: 13px;
                margin: 3px;
            }
        }
        
        /* 작은 모바일 화면 */
        @media (max-width: 480px) {
            .stamped-preview-modal {
                padding: 5px;
                padding-top: max(5px, env(safe-area-inset-top));
            }
            
            .stamped-preview-modal .modal-content {
                width: calc(100vw - 10px);
                max-height: calc(100vh - 10px);
                border-radius: 6px;
            }
            
            .stamped-preview-modal .modal-header {
                padding: 10px 12px 8px;
            }
            
            .stamped-preview-modal .modal-header h3 {
                font-size: 14px;
            }
            
            .stamped-preview-modal .modal-close-btn {
                width: 32px;
                height: 32px;
                font-size: 16px;
            }
            
            .stamped-preview-modal .modal-body {
                max-height: calc(100vh - 140px);
            }
            
            .stamped-preview-modal .image-container {
                padding: 8px;
                min-height: 200px;
            }
            
            .stamped-preview-modal .pdf-container {
                height: calc(100vh - 160px);
                min-height: 250px;
                margin: 3px;
            }
            
            .stamped-preview-modal .unsupported-container {
                height: 250px;
                margin: 3px;
            }
            
            .stamped-preview-modal .modal-footer {
                padding: 10px 12px;
            }
            
            .stamped-preview-modal .modal-download-btn,
            .stamped-preview-modal .modal-cancel-btn {
                padding: 12px 16px;
                font-size: 14px;
            }
        }
        
        /* iOS Safari 특별 처리 */
        @supports (-webkit-touch-callout: none) {
            .stamped-preview-modal .modal-content {
                /* iOS에서 안전 영역 고려 */
                margin-top: env(safe-area-inset-top, 0);
                margin-bottom: env(safe-area-inset-bottom, 0);
            }
            
            .stamped-preview-modal .modal-body {
                /* iOS에서 스크롤 개선 */
                -webkit-overflow-scrolling: touch;
                overflow-scrolling: touch;
            }
        }
        
        /* 가로 모드 모바일 */
        @media (max-width: 768px) and (orientation: landscape) {
            .stamped-preview-modal .modal-content {
                max-height: calc(100vh - 10px);
            }
            
            .stamped-preview-modal .modal-body {
                max-height: calc(100vh - 120px);
            }
            
            .stamped-preview-modal .pdf-container {
                height: calc(100vh - 140px);
            }
            
            .stamped-preview-modal .image-container img {
                max-height: calc(100vh - 140px);
            }
        }
        
        
		
		
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// 모달 생성 함수 수정 (모바일 최적화)
function qcm_createStampedPreviewModal(imageData, docType, questionId, imageUrl) {
    // 기존 모달이 있으면 제거
    const existingModal = document.getElementById('stampedPreviewModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 모바일 감지
    const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const documentName = window.qcm_questionsManager.qcm_getDocumentName(docType);
    const fileName = imageData.title || `${documentName}_날인본`;
    
    console.log('모달 생성 정보:', {
        documentName,
        fileName,
        imageUrl,
        imageData,
        isMobile
    });
    
    // 파일 확장자 확인
    const fileExtension = imageUrl.split('.').pop().toLowerCase();
    const isPDF = fileExtension === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
    
    console.log('파일 타입 확인:', { fileExtension, isPDF, isImage, isMobile });
    
    let contentHTML = '';
    
    if (isPDF) {
        // 모바일에서는 PDF 미리보기를 다르게 처리
        if (isMobile) {
            contentHTML = `
                <div class="pdf-container">
                    <div class="pdf-fallback" style="display: flex;">
                        <div class="pdf-message">
                            <i class="fas fa-file-pdf"></i>
                            <h4>PDF 파일</h4>
                            <p>모바일에서는 PDF 미리보기가 제한적입니다.</p>
                            <p>파일을 다운로드하여 확인해주세요.</p>
                            <button onclick="qcm_downloadFromPreview('${imageUrl}', '${fileName}')" class="pdf-download-btn">
                                <i class="fas fa-download"></i>
                                PDF 다운로드
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 데스크톱에서는 embed 시도
            contentHTML = `
                <div class="pdf-container">
                    <embed src="${imageUrl}" type="application/pdf" width="100%" height="600px" />
                    <div class="pdf-fallback" style="display: none;">
                        <div class="pdf-message">
                            <i class="fas fa-file-pdf"></i>
                            <h4>PDF 미리보기</h4>
                            <p>이 브라우저에서는 PDF 미리보기가 지원되지 않습니다.</p>
                            <p>파일을 다운로드하여 확인해주세요.</p>
                            <button onclick="qcm_downloadFromPreview('${imageUrl}', '${fileName}')" class="pdf-download-btn">
                                <i class="fas fa-download"></i>
                                PDF 다운로드
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    } else if (isImage) {
        // 이미지인 경우 기존 방식 사용
        contentHTML = `
            <div class="image-container">
                <img src="${imageUrl}" alt="${documentName} 날인본" id="previewImage" />
                <div class="image-loading" id="imageLoading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>이미지 로딩 중...</p>
                </div>
                <div class="image-error" id="imageError" style="display: none;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>이미지를 불러올 수 없습니다.</p>
                    <small>URL: ${imageUrl}</small>
                    <button onclick="qcm_retryImageLoad('${imageUrl}')" class="retry-btn">
                        <i class="fas fa-redo"></i> 다시 시도
                    </button>
                    <button onclick="qcm_showImageDebugInfo()" class="debug-btn">
                        <i class="fas fa-info"></i> 디버그 정보
                    </button>
                </div>
            </div>
        `;
    } else {
        // 지원하지 않는 파일 형식
        contentHTML = `
            <div class="unsupported-container">
                <div class="unsupported-message">
                    <i class="fas fa-file"></i>
                    <h4>지원하지 않는 파일 형식</h4>
                    <p>파일 형식: .${fileExtension}</p>
                    <p>이 파일은 미리보기할 수 없습니다.</p>
                    <button onclick="qcm_downloadFromPreview('${imageUrl}', '${fileName}')" class="unsupported-download-btn">
                        <i class="fas fa-download"></i>
                        파일 다운로드
                    </button>
                </div>
            </div>
        `;
    }
    
    // 모달 HTML 생성
    const modalHTML = `
        <div id="stampedPreviewModal" class="stamped-preview-modal ${isMobile ? 'mobile-modal' : ''}">
            <div class="modal-overlay" onclick="qcm_closeStampedPreviewModal()"></div>
            <div class="modal-content ${isPDF ? 'pdf-modal' : ''}">
                <div class="modal-header">
                    <h3>
                        <i class="fas fa-${isPDF ? 'file-pdf' : 'stamp'}"></i> 
                        ${documentName} 날인본 ${isPDF ? 'PDF' : '미리보기'}
                    </h3>
                    <button class="modal-close-btn" onclick="qcm_closeStampedPreviewModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${contentHTML}
                </div>
                <div class="modal-footer">
                    <button class="modal-download-btn" onclick="qcm_downloadFromPreview('${imageUrl}', '${fileName}')">
                        <i class="fas fa-download"></i>
                        다운로드
                    </button>
                    <button class="modal-cancel-btn" onclick="qcm_closeStampedPreviewModal()">
                        <i class="fas fa-times"></i>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 모달을 body에 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 모바일에서 body 스크롤 방지
    if (isMobile) {
        document.body.style.overflow = 'hidden';
        // 모바일 Safari의 주소창 숨김 처리
        setTimeout(() => {
            window.scrollTo(0, 1);
        }, 100);
    }
    
    // 모달 스타일 추가 (한 번만)
    if (!document.getElementById('stampedPreviewModalStyles')) {
        qcm_addStampedPreviewModalStyles();
    }
    
    // 이미지인 경우에만 이미지 로딩 이벤트 처리
    if (isImage) {
        const previewImage = document.getElementById('previewImage');
        const loadingDiv = document.getElementById('imageLoading');
        const errorDiv = document.getElementById('imageError');
        
        console.log('이미지 로딩 시작:', imageUrl);
        
        previewImage.onload = function() {
            console.log('이미지 로딩 성공');
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'none';
            previewImage.style.display = 'block';
        };
        
        previewImage.onerror = function() {
            console.error('이미지 로딩 실패:', imageUrl);
            loadingDiv.style.display = 'none';
            errorDiv.style.display = 'flex';
            previewImage.style.display = 'none';
            
            // 추가 디버깅 정보
            qcm_debugImageLoad(imageUrl, imageData);
        };
        
        // 이미지 로딩 타임아웃 (10초)
        setTimeout(() => {
            if (loadingDiv && loadingDiv.style.display !== 'none') {
                console.warn('이미지 로딩 타임아웃');
                previewImage.onerror();
            }
        }, 10000);
    } else if (isPDF && !isMobile) {
        // 데스크톱에서만 PDF embed 실패 시 대체 메시지 표시
        setTimeout(() => {
            const embed = document.querySelector('.pdf-container embed');
            const fallback = document.querySelector('.pdf-fallback');
            
            if (embed && fallback) {
                try {
                    // embed 요소의 실제 높이가 0이면 로딩 실패로 간주
                    if (embed.offsetHeight === 0) {
                        embed.style.display = 'none';
                        fallback.style.display = 'flex';
                    }
                } catch (e) {
                    console.warn('PDF 로딩 상태 확인 실패:', e);
                }
            }
        }, 3000); // 3초 후 체크
    }
    
    // 모달 표시
    const modal = document.getElementById('stampedPreviewModal');
    if (modal) {
        // 모바일에서 확실히 표시되도록 클래스 추가
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // 모바일에서 애니메이션 후 포커스 설정
        if (isMobile) {
            setTimeout(() => {
                const closeBtn = modal.querySelector('.modal-close-btn');
                if (closeBtn) {
                    closeBtn.focus();
                }
            }, 300);
        }
    }
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', qcm_handleModalKeydown);
    
    // 모바일에서 터치 이벤트 처리
    if (isMobile) {
        qcm_handleMobileTouch(modal);
    }
    
    console.log('모달 생성 완료, 표시 상태:', modal ? modal.style.display : 'modal not found');
}

// 모바일 터치 이벤트 처리 함수
function qcm_handleMobileTouch(modal) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) return;
    
    // 터치 시작
    modalContent.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
        currentY = startY;
        isDragging = false;
    }, { passive: true });
    
    // 터치 이동
    modalContent.addEventListener('touchmove', function(e) {
        if (!startY) return;
        
        currentY = e.touches[0].clientY;
        const diffY = startY - currentY;
        
        // 위로 스와이프하면 모달을 닫지 않음
        if (diffY < -50) {
            isDragging = true;
        }
    }, { passive: true });
    
    // 터치 끝
    modalContent.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        
        const diffY = startY - currentY;
        
        // 아래로 100px 이상 스와이프하면 모달 닫기
        if (diffY < -100) {
            qcm_closeStampedPreviewModal();
        }
        
        startY = 0;
        currentY = 0;
        isDragging = false;
    }, { passive: true });
}

// 모달 닫기 함수 수정 (모바일 최적화)
function qcm_closeStampedPreviewModal() {
    const modal = document.getElementById('stampedPreviewModal');
    if (modal) {
        // 모바일에서 body 스크롤 복원
        const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            document.body.style.overflow = '';
        }
        
        // 페이드 아웃 애니메이션
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.remove();
        }, 200);
    }
    
    // ESC 키 이벤트 리스너 제거
    document.removeEventListener('keydown', qcm_handleModalKeydown);
}

// 모바일 감지 개선 함수
function qcm_isMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
        'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
        'windows phone', 'mobile', 'opera mini', 'iemobile'
    ];
    
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isMobileScreen = window.innerWidth <= 768;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    return isMobileUserAgent || isMobileScreen || isTouchDevice;
}

// 화면 크기 변경 감지 및 모달 조정
function qcm_handleResize() {
    const modal = document.getElementById('stampedPreviewModal');
    if (!modal || modal.style.display === 'none') return;
    
    const isMobile = qcm_isMobileDevice();
    const modalContent = modal.querySelector('.modal-content');
    
    if (modalContent) {
        if (isMobile) {
            modalContent.style.width = 'calc(100vw - 20px)';
            modalContent.style.maxHeight = 'calc(100vh - 20px)';
        } else {
            modalContent.style.width = '95vw';
            modalContent.style.maxHeight = '90vh';
        }
    }
}

// 리사이즈 이벤트 리스너 등록
window.addEventListener('resize', qcm_handleResize);
window.addEventListener('orientationchange', function() {
    setTimeout(qcm_handleResize, 500); // 오리엔테이션 변경 후 약간의 지연
});

// 뷰포트 메타 태그 확인 및 추가
function qcm_ensureViewportMeta() {
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(viewportMeta);
        console.log('뷰포트 메타 태그 추가됨');
    } else {
        // 기존 뷰포트 메타 태그 업데이트
        const currentContent = viewportMeta.content;
        if (!currentContent.includes('user-scalable=no')) {
            viewportMeta.content = currentContent + ', user-scalable=no';
            console.log('뷰포트 메타 태그 업데이트됨');
        }
    }
}

// 초기화 시 뷰포트 메타 태그 확인
document.addEventListener('DOMContentLoaded', qcm_ensureViewportMeta);

// 이미 DOM이 로드된 경우 즉시 실행
if (document.readyState !== 'loading') {
    qcm_ensureViewportMeta();
}

// 전역 함수 등록 (모바일 최적화 버전)
window.qcm_createStampedPreviewModal = qcm_createStampedPreviewModal;
window.qcm_closeStampedPreviewModal = qcm_closeStampedPreviewModal;
window.qcm_isMobileDevice = qcm_isMobileDevice;
window.qcm_handleMobileTouch = qcm_handleMobileTouch;
window.qcm_handleResize = qcm_handleResize;