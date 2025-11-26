# Jordan Portfolio - Architecture

## Tech Stack
- HTML5 (semantic markup)
- CSS3 (custom properties, Grid, Flexbox, animations)
- Vanilla JavaScript (ES6+)
- GitHub Pages (static hosting)

## File Structure
```
jordan-portfolio/
├── index.html          # Single-page application
├── styles.css          # Design system (~800 rules)
├── script.js           # Interactive features (~470 lines)
├── assets/
│   └── jordan.jpg      # Profile image
├── README.md           # Professional documentation
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

## CSS Architecture

### Custom Properties (Root)
```css
--color-primary: #1a1a2e
--color-accent: #2563eb
--color-highlight: #e63946
--parallax-blue: #c1d9f5
--parallax-peach: #f4d4b7
```

### Dark Mode Variables
Applied via `[data-theme="dark"]` selector on `<html>`:
```css
--color-bg: #0f0f1a
--color-text: #e8e8e8
--parallax-blue: #1a3a5c
--parallax-peach: #3d2a1f
```

### Key CSS Classes
- `.parallax-layer` - Background gradient layers
- `.hero-accent-path` - SVG handwriting animation
- `.sliding-number` - Counter animation containers
- `.theme-toggle` - Dark mode button
- `.btn-primary`, `.btn-secondary` - CTA buttons

## JavaScript Architecture

### Classes
1. `ParallaxBackground` - RAF-based scroll parallax
2. `SlidingNumbers` - IntersectionObserver counters
3. `MobileNav` - Hamburger menu toggle
4. `SmoothScroll` - Anchor link enhancement
5. `KeyboardNav` - Focus state management
6. `DarkMode` - Theme toggle with localStorage
7. `FadeInObserver` - Scroll reveal animations

### Configuration Object
```javascript
const CONFIG = {
    parallax: { enabled: true, mobileBreakpoint: 768 },
    slidingNumbers: { threshold: 0.5, rootMargin: '0px' },
    animation: { duration: 900, easing: 'cubic-bezier(0.19, 1, 0.22, 1)' }
};
```

## Performance Patterns
- `requestAnimationFrame` for parallax (60fps)
- `IntersectionObserver` for lazy triggers
- Passive scroll event listeners
- Debounced resize handlers
- `will-change` CSS hints

## Accessibility Patterns
- Skip link (`.skip-link`)
- ARIA labels on all sections
- `prefers-reduced-motion` media query
- Focus-visible styling
- Semantic HTML structure
