---
name: local-model-agent
description: Generate code reliably from local models (Qwen, Deepseek) with validation and sequential execution
---

# Local Model Agent Skill

You're about to interact with a **local AI model** (Qwen Coder, Deepseek Coder, Llama, etc). This skill optimizes your prompts for reliable code generation.

## Key Rules

### 1. **Sequential Execution Only**
- ❌ NO parallel tasks
- ✅ One task at a time
- ✅ Wait for completion before starting next
- ✅ Use `/loop` or queue system for multiple tasks

**Why**: Local models have limited memory. Parallel execution confuses them.

### 2. **Direct Code Generation**
Your prompt will be reframed as:

```
TASK: Generate code directly.
DO NOT analyze, explain, or classify. Write only the code.

REQUEST: [your request]

OUTPUT FORMAT:
```[language]
[code only]
```
```

This stops models from outputting analysis instead of code.

### 3. **Output Validation**
If the model outputs:
- 🚫 Analysis (JSON classification, planning, etc) → Auto-corrected
- 🚫 Explanations instead of code → Auto-fixed
- ✅ Valid code → Accepted

### 4. **Automatic Retry**
If the model fails (analysis instead of code):
1. Prompt is resubmitted with lower temperature
2. Explicitly asks: "Generate the actual code without explanation"
3. Retries up to 2 times
4. Falls back to human intervention if needed

---

## How to Use

### Single Code Generation
```
/local-model-agent Create an HTML form for user registration with email validation
```

This will:
1. Reframe request as direct code generation
2. Send to local model
3. Validate output
4. Show you the code

### Multiple Tasks (Sequential)
```
/local-model-agent
STEP 1: Create index.html for a website homepage
STEP 2: Create style.css with responsive design
STEP 3: Create script.js with interactive menu
```

This will:
1. Execute STEP 1, wait for completion
2. Execute STEP 2, wait for completion
3. Execute STEP 3, wait for completion
4. Show results for each step separately

### Save to File
```
/local-model-agent
FILE: src/components/Button.tsx
REQUEST: Create a TypeScript React button component with onClick handler
```

This will:
1. Generate the code
2. Save directly to `src/components/Button.tsx`
3. Show confirmation

---

## Common Patterns

### ✅ Good Requests
```
Create a Python function that validates email addresses using regex
```

### ❌ Avoid These
```
What would be the best way to validate emails?
Help me understand how email validation works
Can you review this code and suggest improvements?
```

(Use the general AI for explanations, use this skill for direct code generation)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Model returns analysis/JSON | Automatically retried. If persists, ask more explicitly for code |
| Model stops responding | Likely out of memory. Restart local model or use smaller model |
| Code quality is poor | Lower temperature (0.1), shorter requests, more specific examples |
| Takes too long | Local models are slower. Normal. Be patient or use fallback |

---

## Model-Specific Notes

**Qwen 3.5B**: Fastest, good for HTML/CSS/JavaScript  
**Deepseek Coder 6.7B**: Better for Python/Node.js, slightly slower  
**Llama 2 7B**: Good for general code, may need more explicit prompts

---

## Behind the Scenes

This skill:
1. Detects your request type
2. Reformats prompt for local model optimization
3. Calls local model API (Ollama-compatible)
4. Validates output (code vs analysis)
5. Retries with corrections if needed
6. Returns clean code

**No cloud calls, no data collection, fully local.**
