// Parallax and Mouse Interaction Handler
class ParallaxController {
    constructor() {
        this.hero = document.getElementById('hero');
        this.layers = document.querySelectorAll('.hero-layer');
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.isMobile = window.innerWidth <= 768;
        
        // Parallax settings
        this.scrollMultipliers = [0.5, 0.3, 0.1]; // Different speeds for each layer
        this.mouseMultiplier = 0.02; // Subtle mouse movement effect
        
        this.init();
    }
    
    init() {
        // Only initialize parallax if user hasn't requested reduced motion
        if (!this.isReducedMotion) {
            this.bindEvents();
            this.handleScroll(); // Initial call
        }
        
        // Listen for changes in motion preference
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
            this.isReducedMotion = e.matches;
            if (this.isReducedMotion) {
                this.resetLayers();
            }
        });
        
        // Handle resize events
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
        });
    }
    
    bindEvents() {
        // Scroll-based parallax
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        
        // Mouse-based parallax (desktop only)
        if (!this.isMobile) {
            this.hero.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
            this.hero.addEventListener('mouseleave', () => this.handleMouseLeave(), { passive: true });
        }
    }
    
    handleScroll() {
        if (this.isReducedMotion) return;
        
        // Get scroll position relative to hero section
        const heroRect = this.hero.getBoundingClientRect();
        const scrolled = -heroRect.top;
        const heroHeight = this.hero.offsetHeight;
        
        // Only apply parallax when hero is in viewport
        if (heroRect.bottom >= 0 && heroRect.top <= window.innerHeight) {
            this.layers.forEach((layer, index) => {
                // Calculate parallax offset based on scroll position and layer multiplier
                const yPos = scrolled * this.scrollMultipliers[index];
                
                // Apply transform with hardware acceleration
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }
    }
    
    handleMouseMove(e) {
        if (this.isReducedMotion || this.isMobile) return;
        
        // Get mouse position relative to hero center
        const heroRect = this.hero.getBoundingClientRect();
        const centerX = heroRect.width / 2;
        const centerY = heroRect.height / 2;
        
        const mouseX = e.clientX - heroRect.left - centerX;
        const mouseY = e.clientY - heroRect.top - centerY;
        
        // Apply subtle mouse-based movement to each layer
        this.layers.forEach((layer, index) => {
            // Different layers move at different rates and directions
            const multiplier = this.mouseMultiplier * (index + 1) * 0.5;
            const xOffset = mouseX * multiplier;
            const yOffset = mouseY * multiplier;
            
            // Get current scroll-based transform
            const scrolled = -this.hero.getBoundingClientRect().top;
            const scrollYPos = scrolled * this.scrollMultipliers[index];
            
            // Combine scroll and mouse effects
            layer.style.transform = `translate3d(${xOffset}px, ${scrollYPos + yOffset}px, 0)`;
        });
    }
    
    handleMouseLeave() {
        if (this.isReducedMotion || this.isMobile) return;
        
        // Reset to scroll-only parallax when mouse leaves
        this.handleScroll();
    }
    
    resetLayers() {
        // Reset all transforms when reduced motion is preferred
        this.layers.forEach(layer => {
            layer.style.transform = 'translate3d(0, 0, 0)';
        });
    }
}

// Smooth scrolling for anchor links
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Only add smooth scrolling if user hasn't requested reduced motion
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    }
}

// Intersection Observer for fade-in animations
class ScrollAnimations {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }
    
    init() {
        if (this.isReducedMotion) return;
        
        // Create intersection observer for fade-in effects
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe sections for fade-in animation
        document.querySelectorAll('section:not(.hero)').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxController();
    new SmoothScroll();
    new ScrollAnimations();
});

// Performance optimization: Debounce resize events
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

// Handle window resize with debouncing
window.addEventListener('resize', debounce(() => {
    // Recalculate any size-dependent values here if needed
}, 250));
