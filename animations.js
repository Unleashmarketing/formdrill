// Enhanced animation functions for Formdrill website
document.addEventListener('DOMContentLoaded', function() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Preloader with improved handling
    setupPreloader();
    
    // Initialize animations only if user doesn't prefer reduced motion
    if (!prefersReducedMotion) {
        // Set up scroll-based reveal animations
        setupScrollAnimations();
        
        // Set up hero section animations (which should play on load)
        setupHeroAnimations();
        
        // Set up hover animations for feature cards, material cards, and advantage cards
        setupHoverAnimations();
    } else {
        // If user prefers reduced motion, make all elements visible immediately
        document.querySelectorAll('.reveal, .feature-card, .what-is-formdrill, .video-showcase, .highlight-item, .benefits-summary, .benefits-list li, .process-steps, .step, .material-card, .advantage-card, .hero-content h1, .hero-content p, .hero-content .btn').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }
    
    // Setup smooth scroll - we keep this functionality here
    setupSmoothScroll();
});

// ===== ANIMATION SETUP FUNCTIONS =====

function setupPreloader() {
    const preloader = document.querySelector('.preloader') || createPreloader();
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // Remove from DOM after fade out
        }, 500);
    });
}

function createPreloader() {
    // Create preloader if it doesn't exist in the HTML
    const preloader = document.createElement('div');
    preloader.classList.add('preloader');
    
    const loader = document.createElement('div');
    loader.classList.add('loader');
    
    preloader.appendChild(loader);
    document.body.prepend(preloader);
    
    return preloader;
}

function setupScrollAnimations() {
    // Initial check for elements in viewport on page load
    checkElementsInViewport();
    
    // Add scroll event listener with throttling for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(function() {
            checkElementsInViewport();
        });
    });
}

function setupHeroAnimations() {
    // Make sure hero animations play on page load
    const heroElements = document.querySelectorAll('.hero-content h1, .hero-content p, .hero-content .btn');
    
    // Reset any inline styles that might interfere with the CSS animations
    heroElements.forEach(el => {
        el.style.opacity = '';
        el.style.transform = '';
    });
}

function setupHoverAnimations() {
    // Apply CSS styles to remove video hover animation
    const styleEl = document.createElement('style');
    styleEl.id = 'hover-animation-fixes';
    styleEl.textContent = `
        /* Feature card specific hover timings */
        .feature-card:nth-child(1) {
            transition: transform 0.15s, box-shadow 0.15s !important;
        }
        .feature-card:nth-child(2),
        .feature-card:nth-child(3) {
            transition: transform 0.3s, box-shadow 0.3s !important;
        }
        
        /* Material card specific hover timings */
        .material-card:nth-child(1),
        .material-card:nth-child(2),
        .material-card:nth-child(3) {
            transition: transform 0.15s, box-shadow 0.15s !important;
        }
        .material-card:nth-child(4),
        .material-card:nth-child(5),
        .material-card:nth-child(6) {
            transition: transform 0.3s, box-shadow 0.3s !important;
        }
        
        /* Advantage card specific hover timings */
        .advantage-card:nth-child(1),
        .advantage-card:nth-child(2),
        .advantage-card:nth-child(3) {
            transition: transform 0.15s, background-color 0.15s !important;
        }
        .advantage-card:nth-child(4),
        .advantage-card:nth-child(5),
        .advantage-card:nth-child(6),
        .advantage-card:nth-child(7),
        .advantage-card:nth-child(8),
        .advantage-card:nth-child(9) {
            transition: transform 0.3s, background-color 0.3s !important;
        }
    `;
    document.head.appendChild(styleEl);
}

// ===== UTILITY FUNCTIONS =====

function checkElementsInViewport() {
    // Select all elements that should be animated on scroll
    const elements = document.querySelectorAll('.reveal, .feature-card, .what-is-formdrill, .video-showcase, .highlight-item, .benefits-summary, .benefits-list li, .process-steps, .step, .material-card, .advantage-card');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('active');
            
            // For elements that contain child elements with staggered animations
            const staggeredChildren = element.querySelectorAll('.staggered');
            if (staggeredChildren.length > 0) {
                activateStaggeredChildren(staggeredChildren);
            }
        }
    });
}

function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Element is considered in viewport when it's top part is within 150px of being visible
    // or when it's at least partially visible
    const threshold = 150;
    return (
        rect.top <= windowHeight - threshold &&
        rect.bottom >= 0
    );
}

function activateStaggeredChildren(children) {
    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('active');
        }, 100 * index); // Stagger timing
    });
}

// ===== UI FUNCTIONALITY =====

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Get the height of the fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the comparison slider
    initComparisonSlider();
    
    // Make sure to update translations if language is changed
    if (typeof i18next !== 'undefined') {
        i18next.on('languageChanged', function() {
            // Update all translations
            updateContent();
        });
    }
});

// Comparison Slider Functionality
function initComparisonSlider() {
    const slider = document.querySelector('.comparison-slider');
    if (!slider) return;
    
    const before = slider.querySelector('.comparison-before');
    const handle = slider.querySelector('.comparison-handle');
    let isResizing = false;
    
    // Initial position
    setSliderPosition(50);
    
    // Mouse events
    handle.addEventListener('mousedown', startResize);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    
    // Touch events
    handle.addEventListener('touchstart', startResize);
    document.addEventListener('touchmove', resize);
    document.addEventListener('touchend', stopResize);
    
    // Slider click event
    slider.addEventListener('click', function(e) {
        if (e.target === handle || e.target.parentNode === handle) return;
        
        const sliderRect = slider.getBoundingClientRect();
        const position = ((e.clientX - sliderRect.left) / sliderRect.width) * 100;
        setSliderPosition(position);
    });
    
    function startResize(e) {
        e.preventDefault();
        isResizing = true;
    }
    
    function resize(e) {
        if (!isResizing) return;
        
        let clientX;
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
        } else {
            clientX = e.clientX;
        }
        
        const sliderRect = slider.getBoundingClientRect();
        const position = ((clientX - sliderRect.left) / sliderRect.width) * 100;
        setSliderPosition(position);
    }
    
    function stopResize() {
        isResizing = false;
    }
    
    function setSliderPosition(position) {
        // Constrain position between 10% and 90%
        const clampedPosition = Math.max(10, Math.min(90, position));
        
        before.style.width = clampedPosition + '%';
        handle.style.left = clampedPosition + '%';
    }
}


