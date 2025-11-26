# Brand System Implementation

## Summary
Implemented a comprehensive brand token system for "Strategy & Change Leadership" portfolio.

## Token Location
- **Light theme:** `styles.css` lines 28-82 (`:root` block)
- **Dark theme:** `styles.css` lines 158-217 (`[data-theme="dark"]` block)

## Core Tokens
| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `--bg` | #f4f5f7 | #050816 | Page background |
| `--surface` | #ffffff | #0b1220 | Cards, panels |
| `--surface-soft` | #eef2f7 | #111827 | Subtle sections |
| `--text` | #111827 | #e5e7eb | Primary text |
| `--muted` | #6b7280 | #9ca3af | Secondary text |
| `--primary` | #1f3b63 | #7ea3e3 | Strategy navy |
| `--primary-soft` | #d9e2f2 | #1f2937 | Soft panels |
| `--accent` | #0f9d8a | #2dd4bf | Teal emphasis |
| `--accent-soft` | #e0f4f1 | #064e3b | Accent backgrounds |
| `--border-subtle` | #e5e7eb | #1f2937 | Borders |
| `--focus-ring` | #0f9d8a | #2dd4bf | Focus states |

## Documentation
- `docs/BRAND-STANDARDS.md` - Full brand reference
- `CLAUDE.md` - Quick reference for AI
- `IMPLEMENTATION-SUMMARY.md` - Migration details

## Theme System
- `DarkMode` class in `script.js`
- localStorage key: `theme-preference`
- Respects `prefers-color-scheme`
- Toggle: `#theme-toggle` button

## Legacy Aliases
Old variable names are aliased to new tokens for backward compatibility:
```css
--color-primary: var(--primary);
--color-text: var(--text);
--color-bg: var(--bg);
/* etc. */
```

## Verification
All hard-coded hex colors migrated to token references.
