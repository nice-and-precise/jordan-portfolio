/**
 * Jordan Damhof Portfolio - Interactive Scripts
 * =============================================
 * Features:
 * 1. Parallax background effect
 * 2. Sliding number animations
 * 3. Mobile navigation toggle
 * 4. Smooth scroll enhancements
 * 5. Reduced motion detection
 */

(function() {
    'use strict';

    // ================================
    // Configuration
    // ================================
    const CONFIG = {
        parallax: {
            enabled: true,
            mobileBreakpoint: 768
        },
        slidingNumbers: {
            threshold: 0.5,
            rootMargin: '0px'
        },
        animation: {
            duration: 900,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)'
        }
    };

    // ================================
    // Utility Functions
    // ================================

    /**
     * Check if user prefers reduced motion
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Check if device is mobile
     */
    function isMobile() {
        return window.innerWidth < CONFIG.parallax.mobileBreakpoint;
    }

    /**
     * Debounce function for performance
     */
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

    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ================================
    // Parallax Background Effect
    // ================================
    class ParallaxBackground {
        constructor() {
            this.layers = document.querySelectorAll('.parallax-layer');
            this.enabled = CONFIG.parallax.enabled && !prefersReducedMotion() && !isMobile();
            this.ticking = false;
            this.scrollY = 0;

            if (this.layers.length > 0 && this.enabled) {
                this.init();
            }
        }

        init() {
            // Use requestAnimationFrame for smooth updates
            window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });

            // Handle resize
            window.addEventListener('resize', debounce(() => {
                this.enabled = CONFIG.parallax.enabled && !prefersReducedMotion() && !isMobile();
                if (!this.enabled) {
                    this.reset();
                }
            }, 150));

            // Initial position
            this.update();
        }

        onScroll() {
            this.scrollY = window.pageYOffset;

            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.update();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }

        update() {
            if (!this.enabled) return;

            this.layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.1;
                const yPos = -(this.scrollY * speed);
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }

        reset() {
            this.layers.forEach(layer => {
                layer.style.transform = '';
            });
        }
    }

    // ================================
    // Sliding Number Animation
    // ================================
    class SlidingNumbers {
        constructor() {
            this.numbers = document.querySelectorAll('.sliding-number');
            this.animated = new Set();

            if (this.numbers.length > 0 && !prefersReducedMotion()) {
                this.init();
            } else if (prefersReducedMotion()) {
                // Show final values immediately for reduced motion
                this.showAllFinalValues();
            }
        }

        init() {
            const observerOptions = {
                threshold: CONFIG.slidingNumbers.threshold,
                rootMargin: CONFIG.slidingNumbers.rootMargin
            };

            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                observerOptions
            );

            this.numbers.forEach(number => {
                this.observer.observe(number);
            });
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateNumber(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }

        animateNumber(element) {
            // Add animated class to trigger CSS transitions
            element.classList.add('animated');

            // Stagger digit animations for a cascading effect
            const digits = element.querySelectorAll('.sliding-digit');
            digits.forEach((digit, index) => {
                digit.style.transitionDelay = `${index * 100}ms`;
            });
        }

        showAllFinalValues() {
            this.numbers.forEach(number => {
                number.classList.add('animated');
            });
        }
    }

    // ================================
    // Mobile Navigation
    // ================================
    class MobileNav {
        constructor() {
            this.toggle = document.querySelector('.nav-toggle');
            this.navLinks = document.querySelector('.nav-links');
            this.isOpen = false;

            if (this.toggle && this.navLinks) {
                this.init();
            }
        }

        init() {
            this.toggle.addEventListener('click', this.handleToggle.bind(this));

            // Close on link click
            this.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isOpen) {
                        this.close();
                    }
                });
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                    this.toggle.focus();
                }
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (this.isOpen &&
                    !this.navLinks.contains(e.target) &&
                    !this.toggle.contains(e.target)) {
                    this.close();
                }
            });
        }

        handleToggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.isOpen = true;
            this.navLinks.classList.add('is-open');
            this.toggle.setAttribute('aria-expanded', 'true');

            // Focus first link for accessibility
            const firstLink = this.navLinks.querySelector('a');
            if (firstLink) {
                firstLink.focus();
            }
        }

        close() {
            this.isOpen = false;
            this.navLinks.classList.remove('is-open');
            this.toggle.setAttribute('aria-expanded', 'false');
        }
    }

    // ================================
    // Smooth Scroll Enhancement
    // ================================
    class SmoothScroll {
        constructor() {
            this.headerHeight = 80; // Approximate header height
            this.init();
        }

        init() {
            // Handle anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', this.handleClick.bind(this));
            });
        }

        handleClick(e) {
            const href = e.currentTarget.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - this.headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                });

                // Update URL without scrolling
                history.pushState(null, null, href);

                // Focus target for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        }
    }

    // ================================
    // Current Year Update
    // ================================
    function updateCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // ================================
    // Keyboard Navigation Enhancement
    // ================================
    class KeyboardNav {
        constructor() {
            this.init();
        }

        init() {
            // Add visible focus styles only for keyboard users
            document.body.addEventListener('mousedown', () => {
                document.body.classList.add('using-mouse');
            });

            document.body.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.remove('using-mouse');
                }
            });
        }
    }

    // ================================
    // Intersection Observer for Fade-in Effects
    // ================================
    class FadeInObserver {
        constructor() {
            this.elements = document.querySelectorAll('.outcome-card, .project-card, .process-step');

            if (this.elements.length > 0 && !prefersReducedMotion()) {
                this.init();
            }
        }

        init() {
            // Add initial hidden state
            this.elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            });

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry, index) => {
                        if (entry.isIntersecting) {
                            // Stagger the animations
                            setTimeout(() => {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                            }, index * 100);

                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
            );

            this.elements.forEach(el => observer.observe(el));
        }
    }

    // ================================
    // Initialize Everything
    // ================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootstrap);
        } else {
            bootstrap();
        }
    }

    function bootstrap() {
        // Initialize all modules
        new ParallaxBackground();
        new SlidingNumbers();
        new MobileNav();
        new SmoothScroll();
        new KeyboardNav();
        new FadeInObserver();

        // Update current year
        updateCurrentYear();

        // Log initialization (remove in production)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Portfolio initialized successfully');
            console.log('Reduced motion:', prefersReducedMotion());
            console.log('Mobile:', isMobile());
        }
    }

    // Start the application
    init();

})();
