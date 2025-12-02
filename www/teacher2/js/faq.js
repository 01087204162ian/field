// 검색 기능
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const accordionItems = document.querySelectorAll('.accordion-item');
            
            accordionItems.forEach(item => {
                const keywords = item.getAttribute('data-keywords');
                const questionText = item.querySelector('.accordion-button').textContent;
                const answerText = item.querySelector('.accordion-body').textContent;
                
                const searchText = (keywords + ' ' + questionText + ' ' + answerText).toLowerCase();
                
                if (searchText.includes(searchTerm)) {
                    item.style.display = 'block';
                    item.classList.add('slide-in');
                    
                    // 검색어 하이라이트
                    if (searchTerm.length > 0) {
                        highlightText(item, searchTerm);
                    } else {
                        removeHighlight(item);
                    }
                } else {
                    item.style.display = 'none';
                    item.classList.remove('slide-in');
                }
            });
        });

        // 텍스트 하이라이트 함수
        function highlightText(element, searchTerm) {
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            textNodes.forEach(textNode => {
                const text = textNode.textContent;
                const regex = new RegExp(`(${searchTerm})`, 'gi');
                if (regex.test(text)) {
                    const highlightedText = text.replace(regex, '<mark style="background: linear-gradient(135deg, #fef3c7, #fbbf24); color: #92400e; padding: 2px 4px; border-radius: 3px; font-weight: 600;">$1</mark>');
                    const wrapper = document.createElement('span');
                    wrapper.innerHTML = highlightedText;
                    textNode.parentNode.replaceChild(wrapper, textNode);
                }
            });
        }

        // 하이라이트 제거 함수
        function removeHighlight(element) {
            const marks = element.querySelectorAll('mark');
            marks.forEach(mark => {
                mark.outerHTML = mark.innerHTML;
            });
        }

        // 부드러운 스크롤 효과
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // 아코디언 애니메이션 개선
        document.addEventListener('DOMContentLoaded', function() {
            const accordionButtons = document.querySelectorAll('.accordion-button');
            
            accordionButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // 클릭 효과
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });

            // 아코디언 열림/닫힘 이벤트 처리
            const accordionItems = document.querySelectorAll('.accordion-collapse');
            accordionItems.forEach(item => {
                item.addEventListener('show.bs.collapse', function() {
                    this.style.opacity = '0';
                    setTimeout(() => {
                        this.style.transition = 'opacity 0.4s ease';
                        this.style.opacity = '1';
                    }, 50);
                });

                item.addEventListener('hide.bs.collapse', function() {
                    this.style.transition = 'opacity 0.2s ease';
                    this.style.opacity = '0';
                });
            });

            // 스크롤 시 플로팅 버튼 표시/숨김
            const floatingBtn = document.querySelector('.floating-help-btn');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    floatingBtn.style.opacity = '1';
                    floatingBtn.style.visibility = 'visible';
                } else {
                    floatingBtn.style.opacity = '0';
                    floatingBtn.style.visibility = 'hidden';
                }
            });

            // 초기 상태 설정
            floatingBtn.style.opacity = '0';
            floatingBtn.style.visibility = 'hidden';
            floatingBtn.style.transition = 'all 0.3s ease';
        });

        // 키보드 접근성 개선
        document.addEventListener('keydown', function(e) {
            // ESC 키로 모든 아코디언 접기
            if (e.key === 'Escape') {
                const openAccordions = document.querySelectorAll('.accordion-collapse.show');
                openAccordions.forEach(accordion => {
                    const button = document.querySelector(`[data-bs-target="#${accordion.id}"]`);
                    if (button) {
                        button.click();
                    }
                });
            }
        });

        // 성능 최적화를 위한 디바운스 함수
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // 검색 입력에 디바운스 적용
        const searchInput = document.getElementById('searchInput');
        const debouncedSearch = debounce(function(e) {
            // 검색 로직은 이미 위에서 정의됨
        }, 300);

        searchInput.addEventListener('input', debouncedSearch);