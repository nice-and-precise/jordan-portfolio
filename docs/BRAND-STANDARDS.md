# Brand Standards - Strategy & Change Leadership

## Brand Personality
**Voice:** Trusted advisor, clear and calm but with momentum
**UI Feel:** Professional, high trust, low noise. Warm but not playful. Clear hierarchy and strong typography.

---

## Color System

### Light Theme

| Token | Hex | Purpose |
|-------|-----|---------|
| `--bg` | #f4f5f7 | Page background |
| `--surface` | #ffffff | Cards, panels, content areas |
| `--surface-soft` | #eef2f7 | Hero sections, subtle blocks |
| `--text` | #111827 | Primary text, headings |
| `--muted` | #6b7280 | Secondary text, metadata |
| `--primary` | #1f3b63 | Strategy navy - key headings, important links |
| `--primary-soft` | #d9e2f2 | Soft panels, subtle outlines |
| `--accent` | #0f9d8a | Teal "change" accent - emphasis, key tags |
| `--accent-soft` | #e0f4f1 | Light backgrounds for pills, chips |
| `--border-subtle` | #e5e7eb | Dividers, borders |
| `--focus-ring` | #0f9d8a | Keyboard focus indicator |

### Dark Theme

| Token | Hex | Purpose |
|-------|-----|---------|
| `--bg` | #050816 | Page background |
| `--surface` | #0b1220 | Cards, panels |
| `--surface-soft` | #111827 | Hero sections |
| `--text` | #e5e7eb | Primary text |
| `--muted` | #9ca3af | Secondary text |
| `--primary` | #7ea3e3 | Headings, links |
| `--primary-soft` | #1f2937 | Subtle borders |
| `--accent` | #2dd4bf | Highlights, buttons |
| `--accent-soft` | #064e3b | Chip backgrounds |
| `--border-subtle` | #1f2937 | Dividers |
| `--focus-ring` | #2dd4bf | Focus indicator |

---

## Usage Guidelines

### When to Use Primary vs Accent
- **Primary (`--primary`):** Major headings, main CTAs, navigation links
- **Accent (`--accent`):** Role tags, key metrics, secondary actions, visual highlights
- **Rule:** Accent is for emphasis. If everything is accent, nothing is.

### When to Use Surface vs Surface-Soft
- **Surface (`--surface`):** Main content cards, modals, primary panels
- **Surface-Soft (`--surface-soft`):** Hero strips, alternating sections, subtle visual separation

### When to Use Text vs Muted
- **Text (`--text`):** Headlines, body copy, primary content
- **Muted (`--muted`):** Dates, job locations, captions, helper text

---

## Do's and Don'ts

### Do
- Use `var(--primary)` for major headings and main CTAs
- Use `var(--muted)` for dates, locations, and metadata
- Use `var(--accent)` sparingly for role tags and key metrics
- Test all text/background combinations for WCAG AA contrast
- Use the theme toggle to verify both light and dark modes

### Don't
- Mix arbitrary hex colors outside the token system
- Use accent teal for large background areas or long text blocks
- Hard-code colors in components - always reference tokens
- Add new colors without updating this document and the token file

---

## Theme Implementation

### How It Works
- Theme is controlled via `data-theme` attribute on `<html>`
- Default: Light theme
- User preference persisted in `localStorage`
- Respects `prefers-color-scheme` for initial load

### For Contributors
1. All colors must use CSS custom properties
2. Never introduce new color values without team review
3. When adding components, decide:
   - Base surface: `surface` or `surface-soft`?
   - Text level: `text` or `muted`?
   - Brand role: `primary`, `accent`, or neutral?

---

## Accessibility

- All text meets WCAG 2.1 AA contrast requirements
- Focus states use visible `--focus-ring` color
- Color is never the only means of conveying information
- Skip link provided for keyboard navigation
- All interactive elements have 44px minimum touch targets

---

## CSS Token Quick Reference

```css
/* Backgrounds */
background: var(--bg);           /* Page background */
background: var(--surface);      /* Cards, panels */
background: var(--surface-soft); /* Subtle sections */

/* Typography */
color: var(--text);              /* Primary text */
color: var(--muted);             /* Secondary text */

/* Brand Colors */
color: var(--primary);           /* Headings, CTAs */
background: var(--primary-soft); /* Soft panels */
color: var(--accent);            /* Highlights */
background: var(--accent-soft);  /* Accent backgrounds */

/* Utility */
border-color: var(--border-subtle);
outline: 2px solid var(--focus-ring);
```

---

## Button Variants

### Primary Button
```css
.btn-primary {
    background: var(--primary);
    color: var(--surface);
}
```
Use for main CTAs, form submissions, important actions.

### Secondary Button
```css
.btn-secondary {
    background: transparent;
    color: var(--primary);
    border-color: var(--primary);
}
```
Use for secondary actions, cancel buttons.

### Outline Button
```css
.btn-outline {
    background: transparent;
    color: var(--text);
    border-color: var(--border-subtle);
}
```
Use for tertiary actions, filters.

---

## Changelog

| Date | Change |
|------|--------|
| 2024 | Initial brand system implementation |
