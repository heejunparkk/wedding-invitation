/**
 * Wedding Invitation - Main JavaScript
 * 희준 & 영은 결혼식 모바일 청첩장
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
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
 * Scroll Animation - 스크롤 시 섹션 페이드인 효과
 */
function initScrollAnimation() {
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // Cover는 이미 보이게 처리
        if (section.classList.contains('cover')) {
            section.classList.add('visible');
        } else {
            observer.observe(section);
        }
    });
}

/**
 * D-day Countdown - 결혼식까지 남은 시간 표시
 */
function initCountdown() {
    const weddingDate = new Date('2026-03-21T12:00:00+09:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            // 결혼식 날짜가 지났을 경우
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Gallery - 사진 갤러리 및 모달 (Carousel)
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

    totalCountEl.textContent = images.length;

    // 캐러셀 컨테이너 생성
    function createCarousel() {
        modalContent.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-track">
                    ${images.map((src, i) => `<div class="carousel-slide"><img src="${src}" alt="웨딩 사진 ${i + 1}"></div>`).join('')}
                </div>
            </div>
        `;
    }

    createCarousel();

    const track = modalContent.querySelector('.carousel-track');

    function updateCarousel(animate = true) {
        if (animate) {
            track.style.transition = 'transform 0.4s ease-out';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        currentIndexEl.textContent = currentIndex + 1;
    }

    function openModal(index) {
        currentIndex = index;
        updateCarousel(false);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel(true);
        setTimeout(() => { isAnimating = false; }, 400);
    }

    function showNext() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel(true);
        setTimeout(() => { isAnimating = false; }, 400);
    }

    // Event listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });

    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', showPrev);
    modalNext.addEventListener('click', showNext);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNext();
            } else {
                showPrev();
            }
        }
    }
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

    // 배경음악 파일이 있을 경우에만 자동재생 시도
    bgMusic.addEventListener('canplaythrough', () => {
        // 자동재생 시도 (브라우저 정책에 따라 차단될 수 있음)
        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                musicBtn.classList.remove('paused');
            }).catch(() => {
                // 자동재생 차단됨 - 사용자 인터랙션 필요
                isPlaying = false;
                musicBtn.classList.add('paused');
            });
        }
    });

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.classList.add('paused');
        } else {
            bgMusic.play();
            musicBtn.classList.remove('paused');
        }
        isPlaying = !isPlaying;
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
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '희준 ♥ 영은 결혼합니다',
                    description: '2026년 3월 21일 토요일 낮 12시\n씨마크호텔 아산트리움',
                    imageUrl: window.location.origin + '/images/main.jpg',
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href
                    }
                },
                buttons: [
                    {
                        title: '청첩장 보기',
                        link: {
                            mobileWebUrl: window.location.href,
                            webUrl: window.location.href
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
 * Kakao Map - 카카오맵 표시
 */
function initKakaoMap() {
    const mapContainer = document.getElementById('map');

    // 카카오맵 API가 로드되었는지 확인
    if (typeof kakao !== 'undefined' && kakao.maps) {
        const mapOption = {
            center: new kakao.maps.LatLng(37.7896, 128.9207), // 씨마크호텔 좌표
            level: 3
        };

        const map = new kakao.maps.Map(mapContainer, mapOption);

        // 마커 생성
        const markerPosition = new kakao.maps.LatLng(37.7896, 128.9207);
        const marker = new kakao.maps.Marker({
            position: markerPosition
        });
        marker.setMap(map);

        // 인포윈도우
        const infowindow = new kakao.maps.InfoWindow({
            content: '<div style="padding:5px;font-size:12px;text-align:center;">씨마크호텔<br>아산트리움</div>'
        });
        infowindow.open(map, marker);

        // 지도 컨트롤 추가
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
    } else {
        // 카카오맵 API가 없을 경우 대체 이미지 표시
        mapContainer.innerHTML = `
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f5f3ef;color:#6b6b6b;font-size:0.85rem;">
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
 * Kakao SDK 초기화 (카카오 공유용)
 * 실제 사용 시 아래 주석을 해제하고 본인의 JavaScript 키를 입력하세요
 */
// Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY');
