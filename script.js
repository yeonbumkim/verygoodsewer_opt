// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 네비게이션 토글 기능
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.classList.contains('active');
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // 접근성을 위한 aria-expanded 업데이트
            navToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }
    
    // 네비게이션 링크 클릭 시 모바일 메뉴 닫기
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // 스크롤 시 헤더 스타일 변경
    const header = document.getElementById('header');
    
    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 스크롤 탑 버튼 표시/숨김
        const scrollTop = document.getElementById('scroll-top');
        if (window.scrollY > 500) {
            scrollTop.classList.add('show');
        } else {
            scrollTop.classList.remove('show');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // 스크롤 탑 버튼 클릭 이벤트
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // FAQ 아코디언 기능
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // 다른 FAQ 아이템들 닫기
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 현재 FAQ 아이템 토글
            item.classList.toggle('active');
        });
    });
    
    // 스무스 스크롤링 (네비게이션 링크용)
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 히어로 섹션 패럴랙스 효과
    const hero = document.querySelector('.hero');
    const heroBackground = document.querySelector('.hero-background');
    
    function handleParallax() {
        if (window.innerWidth > 768) { // 데스크톱에서만 패럴랙스 효과 적용
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallaxSpeed = scrolled * 0.3;
                if (heroBackground) {
                    heroBackground.style.transform = `translateY(${parallaxSpeed}px)`;
                }
            }
        }
    }
    
    window.addEventListener('scroll', handleParallax);
    
    // 카운터 애니메이션 (통계 수치용)
    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(start + (end - start) * progress);
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Intersection Observer를 사용한 카운터 트리거
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    const counter = entry.target;
                    const finalValue = parseInt(counter.dataset.count) || 100;
                    
                    counter.classList.add('counted');
                    animateCounter(counter, 0, finalValue, 2000);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // 이미지 레이지 로딩 (브라우저 네이티브 지원 확인)
    if ('loading' in HTMLImageElement.prototype) {
        // 브라우저가 네이티브 lazy loading을 지원하는 경우
        console.log('Native lazy loading supported');
    } else {
        // 폴백: Intersection Observer 사용
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.removeAttribute('loading');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // YouTube iframe 지연 로딩
    const lazyIframes = document.querySelectorAll('iframe.lazy-iframe');
    
    if (lazyIframes.length > 0) {
        const iframeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (iframe.dataset.src) {
                        iframe.src = iframe.dataset.src;
                        iframe.classList.add('loaded');
                        iframeObserver.unobserve(iframe);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        lazyIframes.forEach(iframe => {
            iframeObserver.observe(iframe);
        });
    }
    
    // 폼 유효성 검사 (컨택트 폼이 있을 경우)
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formFields = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };
            
            // 간단한 유효성 검사
            if (!formFields.name || !formFields.phone) {
                alert('이름과 전화번호는 필수 입력사항입니다.');
                return;
            }
            
            // 전화번호 형식 검사
            const phoneRegex = /^[0-9-]+$/;
            if (!phoneRegex.test(formFields.phone)) {
                alert('올바른 전화번호 형식을 입력해주세요.');
                return;
            }
            
            // 성공 메시지 (실제로는 서버로 전송)
            alert('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 연락드리겠습니다.');
            this.reset();
        });
    }
    
    // 전화번호 포맷팅
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            
            if (value.length >= 3 && value.length <= 7) {
                value = value.replace(/(\d{3})(\d{1,4})/, '$1-$2');
            } else if (value.length >= 8) {
                value = value.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
            }
            
            e.target.value = value;
        });
    });
    
    // 사이드바 진행 표시기 (스크롤 진행률)
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBar = document.querySelector('.scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    
    // 섹션 활성화 감지 (네비게이션 하이라이트용)
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link[href^="#"]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(navItem => {
                    navItem.classList.remove('active');
                    if (navItem.getAttribute('href') === `#${sectionId}`) {
                        navItem.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // 클릭 투 콜 기능 향상
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 모바일이 아닌 경우 확인 다이얼로그 표시
            if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                const phoneNumber = this.href.replace('tel:', '');
                const confirmed = confirm(`${phoneNumber}로 전화를 걸까요?`);
                if (!confirmed) {
                    e.preventDefault();
                }
            }
        });
    });
    
    // 페이지 로딩 완료 후 애니메이션 시작
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // AOS (Animate On Scroll) 초기화 - 비활성화
    /*
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    */
    
    // 키보드 네비게이션 지원
    document.addEventListener('keydown', function(e) {
        // ESC 키로 모바일 메뉴 닫기
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // 터치 이벤트 개선 (모바일 경험 향상)
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndY < touchStartY - 50) {
            // 위로 스와이프 - 현재는 특별한 동작 없음
        }
        if (touchEndY > touchStartY + 50) {
            // 아래로 스와이프 - 현재는 특별한 동작 없음
        }
    }
    
    // 서비스 워커 등록 (PWA 대응)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        });
    }
    
    // 성능 최적화를 위한 디바운스 함수
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    
    // 디바운스된 스크롤 핸들러들
    const debouncedScrollHandler = debounce(function() {
        handleScroll();
        handleParallax();
        updateScrollProgress();
        highlightNavigation();
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // 리사이즈 핸들러
    const debouncedResizeHandler = debounce(function() {
        // 리사이즈 시 모바일 메뉴 닫기
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, 250);
    
    window.addEventListener('resize', debouncedResizeHandler);
});

// 유틸리티 함수들
const Utils = {
    // 요소가 뷰포트에 있는지 확인
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // 스무스 스크롤
    smoothScrollTo: function(target, duration = 1000) {
        const targetPosition = target.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    },
    
    // 전화번호 형식 검증
    validatePhoneNumber: function(phone) {
        const phoneRegex = /^(\d{3}-?\d{4}-?\d{4}|\d{3}-?\d{3}-?\d{4})$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },
    
    // 이메일 형식 검증
    validateEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};