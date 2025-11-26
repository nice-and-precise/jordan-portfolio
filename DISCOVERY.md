# Brand System Discovery

## Styling Approach
**Plain CSS** with CSS custom properties (`:root` variables)

## Token Location
- **File:** `styles.css`
- **Light theme:** Lines 28-127 (`:root` block)
- **Dark theme:** Lines 132-160 (`[data-theme="dark"]` block)

## Current Token Structure
```css
/* Existing Light Theme */
--color-primary: #1a1a2e    /* Dark navy */
--color-secondary: #16213e  /* Darker navy */
--color-accent: #0f3460     /* Deep blue */
--color-highlight: #e94560  /* Pink/red */
--color-text: #1a1a2e
--color-text-muted: #6b7280
--color-bg: #ffffff
--color-bg-alt: #f9fafb
--color-border: #e5e7eb
```

## Files with Hard-Coded Colors
| File | Lines | Issue |
|------|-------|-------|
| `styles.css` | 389-390 | `.nav-cta` uses `#1a1a2e`, `#ffffff` |
| `styles.css` | 405-409 | Dark mode nav hover uses `#ff8fa3` |
| `styles.css` | 668-674 | `.contact` section hard-coded colors |
| `styles.css` | 682 | Dark contact `#0a0a12` |
| `styles.css` | 711-712 | `.outcome-card--featured` gradients |
| `styles.css` | 1110 | Headshot fallback `#d63d56` |
| `styles.css` | 1134-1141 | Footer hard-coded colors |
| `styles.css` | 1206-1265 | All button variants hard-coded |

**Total hard-coded hex values:** ~50+ instances

## Dark Mode Status
**Already Implemented**
- Theme toggle: `#theme-toggle` button
- Storage: `localStorage.getItem('theme-preference')`
- JS Class: `DarkMode` in `script.js` (line 350)
- Respects: `prefers-color-scheme` media query

## Refactoring Strategy
1. Replace `:root` color tokens with new brand palette
2. Replace `[data-theme="dark"]` with new dark palette
3. Replace all hard-coded hex values with `var(--token)` references
4. Add missing tokens: `--surface`, `--surface-soft`, `--focus-ring`

## New Token Mapping
| Old Token | New Token | Purpose |
|-----------|-----------|---------|
| `--color-bg` | `--bg` | Page background |
| `--color-bg-alt` | `--surface-soft` | Hero sections |
| NEW | `--surface` | Cards, panels |
| `--color-text` | `--text` | Primary text |
| `--color-text-muted` | `--muted` | Secondary text |
| `--color-primary` | `--primary` | Headings, CTAs |
| `--color-highlight` | `--accent` | Emphasis, tags |
| `--color-border` | `--border-subtle` | Dividers |
| NEW | `--focus-ring` | Accessibility |
