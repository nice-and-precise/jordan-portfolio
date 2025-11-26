# Jordan Damhof Portfolio - Claude Code Instructions

## Project Overview
Building a professional portfolio website for Jordan Damhof, an operations and project management consultant. The site demonstrates technical competence through subtle motion design while maintaining accessibility and performance.

## Tech Stack
- **Vanilla HTML5** - Semantic, accessible markup
- **Vanilla CSS3** - Custom properties, Grid, animations
- **Vanilla JavaScript** - ES6+, no dependencies
- **Deployment** - GitHub Pages (static hosting)

## Critical Constraints
- Zero external dependencies (no npm, no CDNs)
- GitHub Pages compatible (static only)
- Performance budget: 60fps animations, < 3s load on 3G
- WCAG 2.1 AA accessibility compliance
- Works 320px to 2560px viewports

## File Structure
```
jordan-portfolio/
├── CLAUDE.md           # This file - project instructions
├── CONTEXT.md          # Build progress and decisions log
├── index.html          # Main HTML file
├── styles.css          # All styles including animations
├── script.js           # Parallax + sliding numbers
└── assets/             # Any future assets (images, etc.)
```

## Motion Design Requirements

### 1. Parallax Hero Background
- Two radial gradient layers (blue #c1d9f5, peach #f4d4b7)
- data-speed attributes: 0.15 (back), 0.3 (front)
- Blur: 40px, Opacity: 0.18
- Disabled on mobile (< 768px) and prefers-reduced-motion

### 2. Handwriting SVG Accent
- Stroke-dasharray animation on SVG path
- Duration: 2.1s ease-out, delay: 0.6s
- Appears near "Operations and strategy partner"

### 3. Sliding Numbers (63%)
- Digit columns containing 0-9, transform to show digit
- IntersectionObserver trigger (threshold: 0.5)
- Transition: 0.9s cubic-bezier(0.19, 1, 0.22, 1)

### 4. GitHub-Style Project Card
- Match GitHub visual language (borders, badges, lang dots)
- TypeScript blue: #3178c6
- Repo link: https://github.com/nice-and-precise/midwest-underground-ops

## Content (Use Exactly)
- **Name**: Jordan Damhof
- **Email**: jordandamhof@gmail.com
- **GitHub**: https://github.com/nice-and-precise
- **Key Metric**: 63% throughput increase (for sliding number)

## Accessibility Checklist
- [ ] `@media (prefers-reduced-motion: reduce)` disables all motion
- [ ] ARIA labels on all sections
- [ ] Keyboard accessible navigation (Tab order, focus states)
- [ ] Color contrast 4.5:1 minimum
- [ ] Touch targets 44x44px minimum
- [ ] Skip link for screen readers

## Build Commands

### Initial Setup
```bash
# Run with permissions skip for autonomous building
claude --dangerously-skip-permissions
```

### Development Workflow
```bash
# Serve locally for testing
python3 -m http.server 8000
# Then open http://localhost:8000
```

### Deployment
```bash
# Initialize git and push to GitHub
git init
git add .
git commit -m "Initial portfolio build"
git remote add origin https://github.com/nice-and-precise/jordan-portfolio.git
git push -u origin main
# Then enable GitHub Pages in repo settings (main branch, root)
```

## Context Management (Serena MCP)

When working on this project, track progress in CONTEXT.md:
1. Log completed tasks
2. Note any deviations from spec
3. Record accessibility test results
4. Track deployment status

## Quality Gates

Before considering a task complete:
1. **HTML**: Valid semantic markup, no WAVE errors
2. **CSS**: No unused styles, proper cascade
3. **JS**: No console errors, 60fps animations
4. **A11y**: Keyboard nav works, reduced-motion works
5. **Mobile**: Renders correctly at 320px
6. **Performance**: Lighthouse score > 90

## Task Breakdown

### Phase 1: Structure
1. Create index.html with all sections
2. Add semantic HTML and ARIA labels
3. Include meta tags for SEO

### Phase 2: Visual Design
1. Create styles.css with base system
2. Implement responsive grid layout
3. Add typography and color system

### Phase 3: Motion
1. Add parallax background CSS
2. Implement handwriting SVG animation
3. Build sliding number markup and styles

### Phase 4: Interactivity
1. Create script.js with parallax handler
2. Add IntersectionObserver for sliding numbers
3. Implement mobile breakpoint detection

### Phase 5: Polish
1. Add reduced-motion media query
2. Test accessibility
3. Optimize performance

### Phase 6: Deploy
1. Initialize git repository
2. Push to GitHub
3. Enable GitHub Pages
4. Verify live site

## Emergency Procedures

### If context is lost:
1. Read CONTEXT.md for progress
2. Check git log for recent changes
3. Reference this CLAUDE.md for requirements

### If build fails:
1. Check browser console for errors
2. Validate HTML at validator.w3.org
3. Test CSS at jigsaw.w3.org/css-validator

### If animations stutter:
1. Reduce parallax speed values
2. Increase animation transition duration
3. Check for layout thrashing in DevTools
