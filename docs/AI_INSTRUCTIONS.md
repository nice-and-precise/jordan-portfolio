# AI Agent Instructions

**Primary Directive**: This document serves as the single source of truth for all AI agents (Claude, Gemini, Cursor) working on the Antigravity Portfolio.

## 📂 Project Structure
- **Root**: `c:/Users/Owner/Desktop/Jordan`
- **Active Project**: `portfolio-next` (Next.js App Router)
- **Legacy**: `_legacy/` (Do not modify unless extracting data)

## 🎨 Brand & Styling
- **Source of Truth**: [`docs/BRAND-STANDARDS.md`](./BRAND-STANDARDS.md)
- **Rule #1**: **NEVER hard-code hex colors.** Always use Tailwind utility classes or CSS variables defined in global styles.
- **Rule #2**: First preference is Tailwind classes (e.g., `bg-primary`, `text-white`).
- **Rule #3**: If custom CSS is needed, use variables from `brand-standards`.

## 🛠 Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Icons**: `lucide-react`
- **Animation**: `framer-motion`

## 🤖 Agent Protocols
1. **Context Loading**: Always check `task.md` and `implementation_plan.md` in the `.gemini` artifacts (if available) or project root.
2. **File Creation**: When creating components, place them in `portfolio-next/src/components/ui` unless otherwise specified.
3. **Verification**: Always verify builds (`npm run build`) before confirming task completion.
