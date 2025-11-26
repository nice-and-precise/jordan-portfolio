<div align="center">

# Jordan Damhof

**Operations & Strategy Partner**

[![Live Site](https://img.shields.io/badge/Live%20Site-Visit%20Portfolio-2563eb?style=for-the-badge)](https://nice-and-precise.github.io/jordan-portfolio/)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222?style=for-the-badge&logo=github)](https://github.com/nice-and-precise/jordan-portfolio)

*Helping teams move from chaos to clarity with measurable results.*

---

</div>

## Overview

A modern, performant portfolio website showcasing operations consulting expertise. Built with vanilla technologies for maximum performance and zero dependencies.

<div align="center">

| Metric | Target | Status |
|--------|--------|--------|
| Lighthouse Performance | > 90 | Passed |
| Accessibility (WCAG 2.1 AA) | Compliant | Passed |
| Animation Performance | 60fps | Achieved |
| Load Time (3G) | < 3s | Achieved |

</div>

## Features

### Motion Design
- **Parallax Hero** - Dual-layer gradient background with smooth scroll response
- **SVG Handwriting Animation** - Stroke-based path animation on page load
- **Sliding Numbers** - Intersection-triggered counter animations (63%, 40%, 95%)
- **Fade-in Cards** - Staggered reveal animations for content sections

### Accessibility
- Full keyboard navigation with visible focus states
- Screen reader optimized with ARIA labels and semantic HTML
- Skip link for quick navigation
- `prefers-reduced-motion` respected - all animations disabled when requested
- High contrast mode support
- Touch targets meet 44x44px minimum

### Dark Mode
- System preference detection (`prefers-color-scheme`)
- Manual toggle with localStorage persistence
- Smooth transitions between themes
- Optimized color palette for both modes

### Responsive Design
- Fluid layouts from 320px to 2560px
- Mobile-first approach
- Collapsible navigation with touch support
- Print stylesheet included

## Tech Stack

```
Zero Dependencies | Pure Web Standards
```

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic, accessible markup |
| CSS3 | Custom properties, Grid, Flexbox, animations |
| JavaScript (ES6+) | Intersection Observer, RAF-based animations |
| GitHub Pages | Static hosting with CDN |

## Project Structure

```
jordan-portfolio/
├── index.html      # Single-page application
├── styles.css      # Complete design system (~800 rules)
├── script.js       # Interactive features (~470 lines)
├── assets/
│   └── jordan.jpg  # Profile image
└── README.md
```

## Development

### Local Preview

```bash
# Clone the repository
git clone https://github.com/nice-and-precise/jordan-portfolio.git
cd jordan-portfolio

# Start local server
python -m http.server 8000

# Visit http://localhost:8000
```

### Making Changes

1. Edit files directly - no build process required
2. Test locally with the server above
3. Commit and push to deploy automatically via GitHub Pages

## Performance Optimizations

| Optimization | Implementation |
|--------------|----------------|
| No external requests | Zero CDNs, fonts, or libraries |
| RAF animations | `requestAnimationFrame` for smooth parallax |
| Passive listeners | Non-blocking scroll event handlers |
| CSS containment | `will-change` hints for animated elements |
| Lazy loading | Intersection Observer for below-fold content |
| Debounced resize | Prevents layout thrashing on window resize |

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 88+ |
| Firefox | 78+ |
| Safari | 14+ |
| Edge | 88+ |

*Graceful degradation for older browsers - content remains fully accessible.*

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**[View Live Site](https://nice-and-precise.github.io/jordan-portfolio/)** | **[View on GitHub](https://github.com/nice-and-precise/jordan-portfolio)**

Built with precision by Jordan Damhof

</div>
