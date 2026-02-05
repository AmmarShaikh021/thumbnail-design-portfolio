/**
 * Ammar Designs Portfolio
 * Professional JavaScript functionality
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMarquee();
    initCounterAnimation();
    initScrollReveal();
    initLazyLoading();
    initSmoothScroll();
    initLightbox();
});

/* Navigation */
function initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');
        });
        
        // Close menu on link click
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
        
        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !toggle.contains(e.target)) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
            }
        });
    }
    
    // Navbar scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 80) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            navbar.style.background = 'rgba(13, 27, 42, 0.98)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(13, 27, 42, 0.92)';
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/* Marquee Slideshow */
function initMarquee() {
    const track = document.querySelector('.marquee-track');
    const prevBtn = document.querySelector('.marquee-prev');
    const nextBtn = document.querySelector('.marquee-next');
    const wrapper = document.querySelector('.marquee-wrapper');
    
    if (!track || !prevBtn || !nextBtn || !wrapper) return;
    
    const scrollAmount = 320;
    let isAnimating = false;
    
    // Pause animation on hover
    track.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
    });
    
    track.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
    });
    
    // Arrow click handlers
    prevBtn.addEventListener('click', () => {
        if (isAnimating) return;
        scrollMarquee(-scrollAmount);
    });
    
    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        scrollMarquee(scrollAmount);
    });
    
    function scrollMarquee(amount) {
        isAnimating = true;
        
        // Pause animation
        track.style.animationPlayState = 'paused';
        
        // Get current transform
        const computedStyle = window.getComputedStyle(track);
        const matrix = new DOMMatrix(computedStyle.transform);
        const currentX = matrix.m41;
        
        // Calculate new position
        let newX = currentX - amount;
        
        // Get track width (half because of duplicate content)
        const trackWidth = track.scrollWidth / 2;
        
        // Wrap around
        if (newX < -trackWidth) {
            newX += trackWidth;
        } else if (newX > 0) {
            newX -= trackWidth;
        }
        
        // Apply transition
        track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = `translateX(${newX}px)`;
        
        // Reset after transition
        setTimeout(() => {
            track.style.transition = '';
            track.style.animationPlayState = 'running';
            isAnimating = false;
        }, 400);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !isAnimating) {
            if (e.key === 'ArrowLeft') {
                scrollMarquee(-scrollAmount);
            } else if (e.key === 'ArrowRight') {
                scrollMarquee(scrollAmount);
            }
        }
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        track.style.animationPlayState = 'paused';
    }, { passive: true });
    
    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                scrollMarquee(scrollAmount);
            } else {
                scrollMarquee(-scrollAmount);
            }
        } else {
            track.style.animationPlayState = 'running';
        }
    }
}

/* Counter Animation */
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (!statNumbers.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const steps = 50;
    const stepDuration = duration / steps;
    
    // Easing function for smooth animation
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    
    let step = 0;
    
    const timer = setInterval(() => {
        step++;
        const progress = easeOutQuart(step / steps);
        const current = Math.round(target * progress);
        
        element.textContent = formatNumber(current);
        
        if (step >= steps) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        }
    }, stepDuration);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
    }
    return num.toString();
}

/* Scroll Reveal Animation */
function initScrollReveal() {
    // Main reveal elements
    const revealElements = document.querySelectorAll('.niche-block, .stat-card, .result-item, .section-header');
    
    if (!revealElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealElements.forEach((el, index) => {
        el.classList.add('reveal-element');
        el.style.transitionDelay = `${(index % 6) * 0.08}s`;
        observer.observe(el);
    });
    
    // Add CSS for reveal animation
    const style = document.createElement('style');
    style.textContent = `
        .reveal-element {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .reveal-element.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Stagger animation for niche items
    const nicheBlocks = document.querySelectorAll('.niche-block');
    
    const nicheObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.niche-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('item-revealed');
                    }, index * 100);
                });
                nicheObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Add CSS for niche item animation
    const nicheStyle = document.createElement('style');
    nicheStyle.textContent = `
        .niche-item {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .niche-item.item-revealed {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    `;
    document.head.appendChild(nicheStyle);
    
    nicheBlocks.forEach(block => {
        nicheObserver.observe(block);
    });
}

/* Lazy Loading Enhancement */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(img => {
        // Set initial state
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.4s ease';
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            
            img.addEventListener('error', () => {
                img.style.opacity = '0.5';
                // Optional: Set a placeholder image
                // img.src = 'path/to/placeholder.jpg';
            });
        }
    });
}

/* Smooth Scroll */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* Image Lightbox */
function initLightbox() {
    const nicheItems = document.querySelectorAll('.niche-item');
    const resultItems = document.querySelectorAll('.result-item');
    
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            <button class="lightbox-nav lightbox-prev" aria-label="Previous image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>
            <img class="lightbox-image" src="" alt="">
            <button class="lightbox-nav lightbox-next" aria-label="Next image">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>
        </div>
    `;
    document.body.appendChild(lightbox);
    
    const overlay = lightbox.querySelector('.lightbox-overlay');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Collect all images
    let allImages = [];
    let currentIndex = 0;
    
    function collectImages() {
        allImages = [];
        nicheItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) allImages.push(img.src);
        });
        resultItems.forEach(item => {
            const img = item.querySelector('img');
            if (img) allImages.push(img.src);
        });
    }
    
    collectImages();
    
    // Add lightbox styles
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }
        .lightbox.active {
            opacity: 1;
            visibility: visible;
        }
        .lightbox-overlay {
            position: absolute;
            inset: 0;
            background: rgba(10, 20, 33, 0.95);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }
        .lightbox-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: scale(0.95);
            transition: transform 0.3s ease;
        }
        .lightbox.active .lightbox-content {
            transform: scale(1);
        }
        .lightbox-image {
            max-width: 100%;
            max-height: 85vh;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            object-fit: contain;
        }
        .lightbox-close {
            position: absolute;
            top: -50px;
            right: 0;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
        }
        .lightbox-close:hover {
            background: rgba(205, 0, 253, 0.5);
            transform: scale(1.1);
        }
        .lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
        }
        .lightbox-prev {
            left: -70px;
        }
        .lightbox-next {
            right: -70px;
        }
        .lightbox-nav:hover {
            background: rgba(205, 0, 253, 0.5);
            transform: translateY(-50%) scale(1.1);
        }
        @media (max-width: 768px) {
            .lightbox-content {
                max-width: 95vw;
            }
            .lightbox-nav {
                width: 40px;
                height: 40px;
            }
            .lightbox-prev {
                left: 10px;
            }
            .lightbox-next {
                right: 10px;
            }
            .lightbox-close {
                top: -45px;
                right: 5px;
                width: 40px;
                height: 40px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Open lightbox
    function openLightbox(src) {
        currentIndex = allImages.indexOf(src);
        if (currentIndex === -1) currentIndex = 0;
        
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        updateNavButtons();
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Navigate
    function navigate(direction) {
        currentIndex += direction;
        
        if (currentIndex < 0) {
            currentIndex = allImages.length - 1;
        } else if (currentIndex >= allImages.length) {
            currentIndex = 0;
        }
        
        lightboxImg.style.opacity = '0';
        setTimeout(() => {
            lightboxImg.src = allImages[currentIndex];
            lightboxImg.style.opacity = '1';
        }, 150);
        
        updateNavButtons();
    }
    
    function updateNavButtons() {
        // Always show nav buttons for loop navigation
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
    
    // Event listeners for niche items
    nicheItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) openLightbox(img.src);
        });
    });
    
    // Event listeners for result items
    resultItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) openLightbox(img.src);
        });
    });
    
    // Close events
    overlay.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    
    // Navigation events
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(-1);
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigate(-1);
        } else if (e.key === 'ArrowRight') {
            navigate(1);
        }
    });
    
    // Touch swipe for lightbox
    let lightboxTouchStartX = 0;
    let lightboxTouchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        lightboxTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        lightboxTouchEndX = e.changedTouches[0].screenX;
        const diff = lightboxTouchStartX - lightboxTouchEndX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                navigate(1);
            } else {
                navigate(-1);
            }
        }
    }, { passive: true });
}

/* Parallax Effect for Hero (Optional Enhancement) */
function initParallax() {
    const heroGradient = document.querySelector('.hero-gradient');
    const heroGrid = document.querySelector('.hero-grid');
    
    if (!heroGradient || !heroGrid) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        heroGradient.style.transform = `translateX(-50%) translateY(${rate * 0.5}px)`;
        heroGrid.style.transform = `translateY(${rate * 0.2}px)`;
    }, { passive: true });
}

/* Active Navigation Link Highlight */
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // Add active link styles
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: var(--accent-primary);
        }
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initActiveNavigation();
});

/* Preloader (Optional) */
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-spinner"></div>
    `;
    document.body.appendChild(preloader);
    
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        .preloader.hidden {
            opacity: 0;
            visibility: hidden;
        }
        .preloader-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--border-color);
            border-top-color: var(--accent-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.remove(), 400);
        }, 500);
    });
}

// Uncomment to enable preloader
// initPreloader();
