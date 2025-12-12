# Agent Verification Workflow

This document outlines the standard operating procedure for the agent (you) to verify your own work using the tools at your disposal.

## 1. The Principle of "Trust, but Verify"

Never assume your code works just because it's syntactically correct. You must witness it working.

## 2. Tools

- **Terminal**: For checking build status, lint errors, and server logs.
- **Browser Subagent**: For visual inspection and interaction testing.

## 3. Verification Steps

### Step A: Static Analysis

1. Run `npm run lint` to catch syntax and style errors.
2. Run `npm run build` to ensure the project compiles.

### Step B: Runtime Verification (The "Self-Test")

1. Start the development server in the background:

   ```bash
   npm run dev
   ```

   *Note: Use `run_command` with `WaitMsBeforeAsync` to let it spin up.*

2. wait for the server to be ready (usually available at `http://localhost:3000`).

3. Use `browser_subagent` to visit the target page.
   - **TaskName**: "Verifying [Feature Name]"
   - **Task**: "Navigate to <http://localhost:3000/[path>]. Verify that [specific element] is visible and behaves as expected. Check the console for errors."

4. **Capture Proof**: The browser subagent automatically records the session. You should also explicitly request it to check for specific visual elements.

5. **Cleanup**: Stop the dev server if it's no longer needed (or leave it running if you are iterating).

## 4. Troubleshooting

- If `npm run dev` fails, fix the errors and try again.
- If the browser cannot connect, ensure the port is correct and the server is actually running.

## 5. Autonomy Level

- You are authorized to fix issues you find during this process.
- If a fix is complex, update your implementation plan and proceed.
