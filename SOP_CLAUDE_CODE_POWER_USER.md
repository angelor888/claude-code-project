# Claude Code Power User SOP - Alex Finn Method

## Executive Summary

This SOP documents Alex Finn's proven methodology for using Claude Code to build production applications with zero bugs and 10x faster development speed. Following this workflow enabled him to build a $300k/year AI app.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [The 7 Rules](#the-7-rules)
3. [The 8 Productivity Tricks](#the-8-productivity-tricks)
4. [Daily Workflow](#daily-workflow)
5. [Power User Commands](#power-user-commands)
6. [Git Workflow](#git-workflow)
7. [Security & Quality Checks](#security--quality-checks)
8. [Productive Break System](#productive-break-system)
9. [Troubleshooting](#troubleshooting)
10. [Expected Outcomes](#expected-outcomes)

## Installation & Setup

### Prerequisites
- Node.js installed
- Git configured
- GitHub account
- Claude subscription

### Installation Steps
```bash
# Install Claude Code globally
npm install -g @anthropic-ai/claude-code

# Clone this repository
git clone https://github.com/angelone/claude-code-project.git
cd claude-code-project

# Start Claude Code
claude-code
```

### First Time Setup
1. Choose option 1 (Claude subscription)
2. Login with your Claude.ai credentials
3. Trust the project folder
4. **IMMEDIATELY paste the 7 rules as your first message**

## The 7 Rules

These rules must be pasted as your first message in every Claude Code session:

```
1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.

2. The plan should have a list of todo items that you can check off as you complete them

3. Before you begin working, check in with me and I will verify the plan.

4. Then, begin working on the todo items, marking them as complete as you go.

5. Please every step of the way just give me a high level explanation of what changes you made

6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.

7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
```

## The 8 Productivity Tricks

### 1. Claude.md Rules
- Forces task-based thinking
- Prevents "fire from the hip" coding
- Creates accountability and structure

### 2. Plan Mode (CRITICAL)
- **"You want to OVERUSE plan mode"**
- Always press `Shift + Tab` twice
- Use `/model opus` for planning
- Never skip planning phase

### 3. Git Checkpoints
- Commit after EVERY successful step
- "Constantly save... after every single step that works"
- Creates rollback points
- Maintains clean history

### 4. Image Input
- Use for UI inspiration
- Debug visual issues
- Show desired outcomes
- Reference existing designs

### 5. Context Clearing
- Use `/clear` after completing tasks
- Prevents context pollution
- Maintains performance
- Reduces errors

### 6. Security Checks
```
Please check through all the code you just wrote and make sure it follows security best practices. make sure there are no sensitive information in the front end and there are no vulnerabilities that can be exploited
```

### 7. Learning from Claude
```
Please explain the functionality and code you just built out in detail. Walk me through what you changed and how it works. Act like you're a senior engineer teaching me code
```

### 8. Productive Break Chat
- Open Claude.ai in separate tab
- Use during code generation
- 4000% productivity increase
- Prevents doom scrolling

## Daily Workflow

### The 4-Step Development Cycle

```
PLAN (Opus) → BUILD (Sonnet) → COMMIT (Git) → SECURITY/LEARN → REPEAT
```

### Step-by-Step Process

1. **Start Claude Code**
   ```bash
   cd ~/Projects/your-project
   claude-code
   ```

2. **Paste the 7 Rules**

3. **Enter Plan Mode**
   - Press `Shift + Tab` twice
   - Type: `/model opus`

4. **Describe Your Feature**
   ```
   I want to build [feature description].
   Please create a comprehensive plan in tasks/todo.md
   ```

5. **Review and Approve Plan**
   - Check tasks/todo.md
   - Verify the approach
   - Give approval to proceed

6. **Switch to Build Mode**
   - Type: `/model sonnet`
   - Say: "Please proceed with the plan"

7. **Monitor Progress**
   - Watch task completion
   - Review high-level summaries
   - Ask questions if needed

8. **Commit After Each Step**
   ```bash
   git add .
   git commit -m "feat: [description]"
   ```

9. **Run Security Check**
   - Paste the security prompt
   - Review and fix any issues

10. **Learn from the Code**
    - Paste the learning prompt
    - Understand what was built

11. **Clear Context**
    - Type: `/clear`
    - Ready for next feature

## Power User Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `Shift + Tab` (2x) | Enter plan mode | Start of every feature |
| `/model opus` | Use Opus model | Planning phase |
| `/model sonnet` | Use Sonnet model | Building phase |
| `/clear` | Clear context | After completing tasks |
| `/help` | Show help | When stuck |
| `/status` | Check status | Debugging |

## Git Workflow

### Commit Strategy
```bash
# After EVERY successful step
git add .
git commit -m "type: description"

# Commit types:
# feat: new feature
# fix: bug fix
# docs: documentation
# refactor: code refactoring
# test: adding tests
# chore: maintenance
```

### Example Workflow
```bash
# Plan approved
git commit -m "docs: add todo plan for user authentication"

# Component created
git commit -m "feat: add login component structure"

# API integrated
git commit -m "feat: connect login to backend API"

# Styling complete
git commit -m "style: add responsive design to login"

# Tests added
git commit -m "test: add unit tests for login flow"
```

## Security & Quality Checks

### After Each Feature
1. Run security prompt
2. Check for:
   - Exposed API keys
   - Client-side secrets
   - SQL injection vulnerabilities
   - XSS vulnerabilities
   - Proper authentication
   - Input validation

### Code Quality Checklist
- [ ] Simple, readable code
- [ ] Minimal complexity
- [ ] Proper error handling
- [ ] Clean commit history
- [ ] Updated documentation
- [ ] No console.logs in production

## Productive Break System

### Setup
1. Open Claude.ai in new tab
2. Save this prompt:

```
When I am coding with AI there are long breaks in between me giving commands to the AI. Typically I spend that time doom scrolling which distracts me and puts me in a bad mental state. I'd like to use that time now to chat with you and generate new ideas, and also reflect on my other ideas and businesses and content. I'm not sure how I'd like to use this chat or what role I'd like you to play, but I think it could be much more useful than me doom scrolling. What do you think? What could be the best way for us to use this chat?
```

### Benefits
- 4000% productivity increase
- Mental clarity
- Idea generation
- Problem solving
- Stress reduction

## Troubleshooting

### Common Issues

**Claude Code not found**
```bash
npm list -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code
```

**Authentication fails**
- Check Claude subscription
- Clear browser cookies
- Try incognito mode

**Context errors**
- Use `/clear` command
- Restart Claude Code
- Check file permissions

**Git conflicts**
- Always pull before starting
- Commit frequently
- Use feature branches

## Expected Outcomes

Following this SOP exactly as prescribed should result in:

### Immediate Benefits
- Zero bugs in production
- 10x faster development
- 10x code quality improvement
- Clear project structure
- Comprehensive documentation

### Long-term Results
- Build complex apps solo
- 4000% productivity increase
- Reduced stress and confusion
- Professional code quality
- Potential for $300k+ apps

## Key Success Factors

1. **ALWAYS use plan mode first**
2. **NEVER skip the 7 rules**
3. **Commit after EVERY step**
4. **Run security checks**
5. **Learn from the code**
6. **Use productive breaks**
7. **Clear context regularly**
8. **Trust the process**

## Conclusion

Alex Finn's methodology transforms Claude Code from a simple AI assistant into a powerful development system. By following this SOP exactly, you can achieve the same zero-bug, high-velocity development that enabled him to build a successful AI application.

Remember: "You want to OVERUSE plan mode. Never fire from the hip."

---

*Last Updated: 2025*
*Based on Alex Finn's proven methodology*