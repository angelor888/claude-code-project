# Claude Code Quick Start Guide 🚀

## Installation

```bash
npm install -g @anthropic-ai/claude-code
```

## First Time Setup

1. **Navigate to your project**
   ```bash
   cd ~/Projects/claude-code-project
   ```

2. **Start Claude Code**
   ```bash
   claude-code
   ```

3. **Login** - Choose option 1 (Claude subscription)

4. **Trust the folder** - Select "Yes, proceed"

5. **CRITICAL: Paste the 7 rules** as your first message:
   ```
   1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
   2. The plan should have a list of todo items that you can check off as you complete them
   3. Before you begin working, check in with me and I will verify the plan.
   4. Then, begin working on the todo items, marking them as complete as you go.
   5. Please every step of the way just give me a high level explanation of what changes you made
   6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
   7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
   ```

## Power User Commands

- **Plan Mode**: `Shift + Tab` (twice)
- **Switch to Opus**: `/model opus` (for planning)
- **Switch to Sonnet**: `/model sonnet` (for building)
- **Clear Context**: `/clear` (after tasks)
- **Help**: `/help`
- **Status**: `/status`

## The 4-Step Cycle

1. **PLAN** (Opus)
   - Press Shift+Tab twice
   - Type: `/model opus`
   - Describe your feature
   - Let Claude create tasks/todo.md

2. **BUILD** (Sonnet)
   - Review the plan
   - Type: `/model sonnet`
   - Say: "Please proceed with the plan"
   - Watch Claude complete tasks

3. **COMMIT** (Git)
   ```bash
   git add .
   git commit -m "feat: completed feature X"
   ```

4. **SECURITY & LEARN**
   - Paste: `Please check through all the code you just wrote and make sure it follows security best practices. make sure there are no sensitive information in the front end and there are no vulnerabilities that can be exploited`
   - Then: `Please explain the functionality and code you just built out in detail. Walk me through what you changed and how it works. Act like you're a senior engineer teaching me code`

## Example First Project

```
[Shift + Tab twice]
/model opus

I want to build a simple todo app with React that includes:
- Add todo functionality
- Delete todo functionality  
- Mark complete functionality
- Local storage persistence
- Clean, modern UI

Please create a comprehensive plan in tasks/todo.md
```

## Remember Alex's #1 Rule

> "You want to OVERUSE plan mode. Never fire from the hip."

This is how he achieved zero bugs in months!