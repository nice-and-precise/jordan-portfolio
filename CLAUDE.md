# CLAUDE.md - Portfolio Brand System

## Quick Reference

**This repo uses a centralized brand token system.** All colors must reference CSS custom properties.

## Token Location
- **CSS Variables:** `styles.css` (lines 28-82 for light, 158-210 for dark)
- **Documentation:** `docs/BRAND-STANDARDS.md`

## Color Token Usage

| Use Case | Token |
|----------|-------|
| Page background | `var(--bg)` |
| Cards/panels | `var(--surface)` |
| Hero sections | `var(--surface-soft)` |
| Primary text | `var(--text)` |
| Secondary text | `var(--muted)` |
| Headings/CTAs | `var(--primary)` |
| Soft panels | `var(--primary-soft)` |
| Highlights/tags | `var(--accent)` |
| Accent backgrounds | `var(--accent-soft)` |
| Borders | `var(--border-subtle)` |
| Focus rings | `var(--focus-ring)` |

## Theme System
- Controlled via `data-theme="light|dark"` on `<html>`
- User preference stored in `localStorage`
- Respects `prefers-color-scheme` on initial load
- Toggle: `#theme-toggle` button

## Rules

1. **NEVER hard-code hex colors in components**
2. **ALWAYS use CSS variables** - `var(--token-name)`
3. **Accent color is for emphasis only** - use sparingly
4. **Test both themes** before committing UI changes
5. **Update BRAND-STANDARDS.md** if adding new tokens

## File Structure
```
jordan-portfolio/
├── index.html              # Single-page application
├── styles.css              # All styles + brand tokens
├── script.js               # Interactive features
├── docs/
│   └── BRAND-STANDARDS.md  # Human documentation
├── assets/                 # Images
└── DISCOVERY.md            # Implementation notes
```

## Validation

```bash
# Find orphan hex colors (should return nothing)
grep -rn "#[0-9a-fA-F]\{6\}" styles.css | grep -v "^\s*--"
```

## Serena MCP Hints
When editing this codebase, prefer:
- `find_symbol --name="--primary"` over reading entire CSS files
- `search_for_pattern` for surgical color updates
- `find_referencing_symbols` to track token usage
