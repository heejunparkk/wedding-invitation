/**
 * Wedding Invitation - Main JavaScript
 * 희준 & 영은 결혼식 모바일 청첩장
 */

// 모바일 뷰포트 높이 고정 (주소창 변화에 의한 레이아웃 흔들림 방지)
(function fixViewportHeight() {
    var vh = window.innerHeight;
    document.documentElement.style.setProperty('--vh', vh + 'px');
})();

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initScrollProgress();
    initPetals();
    initScrollAnimation();
    initCountdown();
    initGallery();
    initAccountToggle();
    initCopyButtons();
    initMusicControl();
    initShareButtons();
    initKakaoMap();
});

/**
 * Scroll Progress Bar - 스크롤 진행 표시
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        progressBar.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

/**
 * Falling Petals - 떨어지는 꽃잎 애니메이션
 */
function initPetals() {
    const container = document.getElementById('petalsContainer');
    if (!container) return;

    const petalCount = 8;

    for (let i = 0; i < petalCount; i++) {
        createPetal(container, i);
    }
}

function createPetal(container, index) {
    const petal = document.createElement('div');
    petal.className = 'petal';

    // 랜덤 위치 및 애니메이션 설정
    const leftPos = Math.random() * 100;
    const size = 10 + Math.random() * 12;
    const duration = 8 + Math.random() * 6;
    const delay = index * 1.2 + Math.random() * 2;
    const swayAmount = 30 + Math.random() * 40;

    petal.style.cssText = `
        left: ${leftPos}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        --sway: ${swayAmount}px;
    `;

    // 좌우 흔들림을 위한 추가 애니메이션
    petal.style.animation = `petalFall ${duration}s linear ${delay}s infinite`;

    container.appendChild(petal);
}

/**
 * Scroll Animation - 컨텐츠 순차 등장 효과
 */
function initScrollAnimation() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    // 각 stagger-item을 개별적으로 관찰
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 해당 섹션 내의 모든 stagger-item 찾기
                const section = entry.target.closest('.section');
                if (section) {
                    const items = section.querySelectorAll('.stagger-item:not(.visible)');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('visible');

                            // 텍스트 라인 애니메이션 처리
                            const lines = item.querySelectorAll('.line-reveal');
                            lines.forEach((line, lineIndex) => {
                                setTimeout(() => {
                                    line.classList.add('visible');
                                }, lineIndex * 80);
                            });
                        }, index * 150);
                    });
                }
                itemObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 각 섹션의 첫 번째 stagger-item만 관찰 (트리거 역할)
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const firstItem = section.querySelector('.stagger-item');
        if (firstItem) {
            itemObserver.observe(firstItem);
        }
    });
}

/**
 * D-day Countdown - 결혼식까지 남은 시간 표시 (Flip Animation)
 */
function initCountdown() {
    const weddingDate = new Date('2026-03-21T12:00:00+09:00').getTime();
    let prevValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };

    function flipNumber(element, newValue) {
        element.classList.add('flip');
        setTimeout(() => {
            element.textContent = newValue;
        }, 300);
        setTimeout(() => {
            element.classList.remove('flip');
        }, 600);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        // Days - flip only when changed
        if (prevValues.days !== days) {
            if (prevValues.days !== -1) flipNumber(daysEl, days);
            else daysEl.textContent = days;
            prevValues.days = days;
        }

        // Hours
        const hoursStr = hours.toString().padStart(2, '0');
        if (prevValues.hours !== hours) {
            if (prevValues.hours !== -1) flipNumber(hoursEl, hoursStr);
            else hoursEl.textContent = hoursStr;
            prevValues.hours = hours;
        }

        // Minutes
        const minutesStr = minutes.toString().padStart(2, '0');
        if (prevValues.minutes !== minutes) {
            if (prevValues.minutes !== -1) flipNumber(minutesEl, minutesStr);
            else minutesEl.textContent = minutesStr;
            prevValues.minutes = minutes;
        }

        // Seconds - always flip
        const secondsStr = seconds.toString().padStart(2, '0');
        if (prevValues.seconds !== seconds) {
            if (prevValues.seconds !== -1) flipNumber(secondsEl, secondsStr);
            else secondsEl.textContent = secondsStr;
            prevValues.seconds = seconds;
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Gallery - 사진 갤러리 및 모달 (Carousel) - 개선 버전
 */
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalClose = document.getElementById('modalClose');
    const modalPrev = document.getElementById('modalPrev');
    const modalNext = document.getElementById('modalNext');
    const currentIndexEl = document.getElementById('currentIndex');
    const totalCountEl = document.getElementById('totalCount');

    let currentIndex = 0;
    let isAnimating = false;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    // 터치/드래그 관련 변수
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let dragOffset = 0;

    totalCountEl.textContent = images.length;

    // 캐러셀 컨테이너 생성
    function createCarousel() {
        modalContent.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-track">
                    ${images.map((src, i) => `<div class="carousel-slide"><img src="${src}" alt="웨딩 사진 ${i + 1}" draggable="false"></div>`).join('')}
                </div>
            </div>
        `;
    }

    createCarousel();

    const track = modalContent.querySelector('.carousel-track');
    const container = modalContent.querySelector('.carousel-container');

    function getTranslateX() {
        return -currentIndex * container.offsetWidth;
    }

    function updateCarousel(animate = true) {
        if (animate) {
            track.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(${getTranslateX()}px)`;
        currentIndexEl.textContent = currentIndex + 1;
    }

    function openModal(index) {
        currentIndex = index;
        modal.style.display = 'flex';
        // 강제 리플로우 후 애니메이션 시작
        modal.offsetHeight;
        modal.classList.add('active');
        updateCarousel(false);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
        document.body.style.overflow = '';
    }

    function showPrev() {
        if (isAnimating || currentIndex === 0) return;
        isAnimating = true;
        currentIndex--;
        updateCarousel(true);
        setTimeout(() => { isAnimating = false; }, 350);
    }

    function showNext() {
        if (isAnimating || currentIndex === images.length - 1) return;
        isAnimating = true;
        currentIndex++;
        updateCarousel(true);
        setTimeout(() => { isAnimating = false; }, 350);
    }

    // 드래그 시작
    function handleDragStart(e) {
        if (isAnimating) return;
        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        track.style.transition = 'none';
    }

    // 드래그 중
    function handleDragMove(e) {
        if (!isDragging) return;
        currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        dragOffset = currentX - startX;

        // 경계 저항 효과
        const baseTranslate = getTranslateX();
        let newTranslate = baseTranslate + dragOffset;

        // 첫/마지막 슬라이드에서 저항 효과
        if ((currentIndex === 0 && dragOffset > 0) ||
            (currentIndex === images.length - 1 && dragOffset < 0)) {
            dragOffset = dragOffset * 0.3;
            newTranslate = baseTranslate + dragOffset;
        }

        track.style.transform = `translateX(${newTranslate}px)`;
    }

    // 드래그 종료
    function handleDragEnd() {
        if (!isDragging) return;
        isDragging = false;

        const threshold = container.offsetWidth * 0.2;

        if (dragOffset < -threshold && currentIndex < images.length - 1) {
            currentIndex++;
        } else if (dragOffset > threshold && currentIndex > 0) {
            currentIndex--;
        }

        dragOffset = 0;
        updateCarousel(true);
    }

    // Event listeners - 갤러리 아이템 클릭
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });

    // 모달 버튼
    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', showPrev);
    modalNext.addEventListener('click', showNext);

    // 모달 배경 클릭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // 터치 이벤트
    container.addEventListener('touchstart', handleDragStart, { passive: true });
    container.addEventListener('touchmove', handleDragMove, { passive: true });
    container.addEventListener('touchend', handleDragEnd);

    // 마우스 드래그 이벤트
    container.addEventListener('mousedown', handleDragStart);
    container.addEventListener('mousemove', handleDragMove);
    container.addEventListener('mouseup', handleDragEnd);
    container.addEventListener('mouseleave', handleDragEnd);
}

/**
 * Account Toggle - 계좌번호 아코디언
 */
function initAccountToggle() {
    const toggleButtons = document.querySelectorAll('.account-toggle');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetList = document.getElementById(targetId);
            const isActive = button.classList.contains('active');

            // Close all toggles
            toggleButtons.forEach(btn => {
                btn.classList.remove('active');
                const list = document.getElementById(btn.getAttribute('data-target'));
                list.classList.remove('active');
            });

            // Open clicked toggle if it was closed
            if (!isActive) {
                button.classList.add('active');
                targetList.classList.add('active');
            }
        });
    });
}

/**
 * Copy Buttons - 계좌번호 복사
 */
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const accountInfo = button.getAttribute('data-account');

            try {
                await navigator.clipboard.writeText(accountInfo);
                showToast('계좌번호가 복사되었습니다.');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = accountInfo;
                textArea.style.position = 'fixed';
                textArea.style.left = '-9999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('계좌번호가 복사되었습니다.');
            }
        });
    });
}

/**
 * Music Control - 배경음악 재생/정지
 */
function initMusicControl() {
    const musicBtn = document.getElementById('musicBtn');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;
    let hasUserInteracted = false;

    // 음악 재생 함수
    function playMusic() {
        bgMusic.volume = 0.5; // 볼륨 설정
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                musicBtn.classList.remove('paused');
                console.log('Music playing');
            }).catch((error) => {
                isPlaying = false;
                musicBtn.classList.add('paused');
                console.log('Music play failed:', error.message);
            });
        }
    }

    // 첫 사용자 인터랙션 시 자동재생 (모바일 브라우저 정책 대응)
    function handleFirstInteraction(e) {
        if (hasUserInteracted) return;

        // 음악 버튼 클릭은 별도 처리
        if (e.target === musicBtn || musicBtn.contains(e.target)) return;

        hasUserInteracted = true;
        playMusic();

        // 모든 이벤트 리스너 제거
        document.removeEventListener('click', handleFirstInteraction, true);
        document.removeEventListener('touchstart', handleFirstInteraction, true);
        document.removeEventListener('scroll', handleFirstInteraction, true);
    }

    // 다양한 인터랙션에 대응 (capture: true로 이벤트 캡처 단계에서 처리)
    document.addEventListener('click', handleFirstInteraction, true);
    document.addEventListener('touchstart', handleFirstInteraction, true);
    document.addEventListener('scroll', handleFirstInteraction, true);

    // 음악 버튼 클릭
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hasUserInteracted = true;

        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.add('paused');
            isPlaying = false;
        } else {
            playMusic();
        }
    });

    // 오디오 로드 에러 처리
    bgMusic.addEventListener('error', (e) => {
        console.error('Audio load error:', e);
    });
}

/**
 * Share Buttons - 공유하기 기능
 */
function initShareButtons() {
    const kakaoShareBtn = document.getElementById('kakaoShare');
    const linkShareBtn = document.getElementById('linkShare');

    // 카카오톡 공유 (카카오 SDK 초기화 필요)
    kakaoShareBtn.addEventListener('click', () => {
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
            var invitationUrl = 'https://heejunparkk.github.io/wedding-invitation/';
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '박희준 ♥ 김영은 결혼합니다.',
                    description: '3월 21일 (토) 낮 12시\n씨마크호텔 , 2F, 바다홀',
                    imageUrl: 'https://heejunparkk.github.io/wedding-invitation/images/main.jpg',
                    imageWidth: 793,
                    imageHeight: 990,
                    link: {
                        mobileWebUrl: invitationUrl,
                        webUrl: invitationUrl
                    }
                },
                buttons: [
                    {
                        title: '모바일청첩장',
                        link: {
                            mobileWebUrl: invitationUrl,
                            webUrl: invitationUrl
                        }
                    },
                    {
                        title: '위치보기',
                        link: {
                            mobileWebUrl: 'https://map.naver.com/v5/search/강원특별자치도%20강릉시%20해안로406번길%202%20씨마크호텔',
                            webUrl: 'https://map.naver.com/v5/search/강원특별자치도%20강릉시%20해안로406번길%202%20씨마크호텔'
                        }
                    }
                ]
            });
        } else {
            showToast('카카오톡 공유 기능을 사용할 수 없습니다.');
        }
    });

    // 링크 복사
    linkShareBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showToast('링크가 복사되었습니다.');
        } catch (err) {
            // Fallback
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('링크가 복사되었습니다.');
        }
    });
}

/**
 * Naver Map - 네이버 지도 표시
 */
function initKakaoMap() {
    const mapContainer = document.getElementById('map');

    console.log('Naver Maps API check:', typeof naver, naver?.maps);

    // 네이버 지도 API가 로드되었는지 확인
    if (typeof naver !== 'undefined' && naver.maps) {
        const mapOptions = {
            center: new naver.maps.LatLng(37.7980351, 128.9151714), // 씨마크호텔 좌표
            zoom: 16,
            zoomControl: true,
            zoomControlOptions: {
                position: naver.maps.Position.TOP_RIGHT
            }
        };

        const map = new naver.maps.Map(mapContainer, mapOptions);

        // 마커 생성
        const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(37.7980351, 128.9151714),
            map: map
        });

        // 인포윈도우
        const infowindow = new naver.maps.InfoWindow({
            content: '<div style="padding:10px 15px;font-size:13px;text-align:center;line-height:1.5;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">씨마크호텔<br><span style="color:#9c8b7a;font-size:12px;">아산트리움</span></div>',
            borderWidth: 0,
            backgroundColor: 'transparent',
            anchorSize: new naver.maps.Size(0, 0)
        });
        infowindow.open(map, marker);

        // 마커 클릭 시 인포윈도우 토글
        naver.maps.Event.addListener(marker, 'click', function() {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, marker);
            }
        });
    } else {
        // 네이버 지도 API가 없을 경우 대체 이미지 표시
        mapContainer.innerHTML = `
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f5f3ef;color:#6b6b6b;font-size:0.85rem;text-align:center;line-height:1.6;">
                지도를 불러올 수 없습니다.<br>
                아래 버튼을 이용해주세요.
            </div>
        `;
    }
}

/**
 * Toast Message - 토스트 메시지 표시
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

/**
 * Kakao SDK 초기화
 */
Kakao.init('269a76adc9d3e077637c03ffee7f4cd8');
