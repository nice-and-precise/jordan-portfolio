# Claude Code Session Starter

## Quick Start Commands

Copy and paste this entire block into Claude Code to begin the build:

```
I'm building a professional portfolio website for Jordan Damhof at C:\Users\Owner\Desktop\Jordan

Read these files in order:
1. CLAUDE.md - Main project requirements
2. CONTEXT.md - Build progress tracker
3. AGENTS.md - How to coordinate work

Then begin Phase 1: Create the index.html file with:
- Full semantic HTML5 structure
- All sections: Hero (with parallax containers), Outcomes (with sliding number markup), Projects (with GitHub-style card), How I work, About, Contact
- Proper meta tags for SEO and mobile
- ARIA labels for accessibility
- Links to styles.css and script.js

After creating index.html, update CONTEXT.md to mark Phase 1 tasks complete.

Use the exact content from CLAUDE.md:
- Name: Jordan Damhof
- Email: jordandamhof@gmail.com
- GitHub: https://github.com/nice-and-precise
- Midwest Underground repo: https://github.com/nice-and-precise/midwest-underground-ops
- Key metric: 63% throughput increase

Continue through all phases autonomously, updating CONTEXT.md after each phase.
```

---

## Terminal Commands

### Start Claude Code with permissions skip:
```bash
cd "C:\Users\Owner\Desktop\Jordan"
claude --dangerously-skip-permissions
```

### For local testing (run in separate terminal):
```bash
cd "C:\Users\Owner\Desktop\Jordan"
python -m http.server 8000
```
Then open: http://localhost:8000

---

## Resume Build Commands

If you need to resume a paused build, paste this:

```
Read CONTEXT.md to see current build progress, then read CLAUDE.md for requirements.
Continue from where we left off, completing the next incomplete phase.
Update CONTEXT.md after completing each task.
```

---

## Deployment Commands

When build is complete, paste this:

```
The build is complete. Now deploy:

1. Initialize git: git init
2. Add all files: git add .
3. Initial commit: git commit -m "Initial portfolio build with motion design"
4. Add remote: git remote add origin https://github.com/nice-and-precise/jordan-portfolio.git
5. Push: git branch -M main && git push -u origin main

After pushing, remind me to enable GitHub Pages in the repo settings.
```

---

## Emergency Recovery

If something breaks, paste this:

```
Something went wrong with the build. Please:
1. Check git status to see uncommitted changes
2. Read CONTEXT.md to see last known good state
3. Validate HTML at https://validator.w3.org/
4. Check browser console for JavaScript errors
5. Report what you find and suggest fixes
```

---

## Context Window Management

If you're running low on context, paste this:

```
We're running low on context. Please:
1. Summarize current build state in 5 bullet points
2. Update CONTEXT.md with that summary
3. List the next 3 specific tasks to complete
4. Continue with task 1
```
