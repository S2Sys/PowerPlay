# 🔧 Local Model Agent - Troubleshooting Guide

## Issue 1: `Connection refused` or `Cannot connect to local model`

### Symptoms
```
❌ Connection failed. Is local model running?
   Error: ECONNREFUSED 127.0.0.1:11434
```

### Causes
- Local model server not running
- Wrong endpoint configured
- Port is already in use

### Solutions

**Check if Ollama is running:**
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Test connection
curl http://localhost:11434/api/generate -d '{"model":"qwen:latest","prompt":"hello"}'
```

**If port 11434 is in use:**
```bash
# Kill process using port 11434
lsof -i :11434
kill -9 <PID>

# Or restart Ollama
ollama serve
```

**Custom endpoint:**
Edit `local-model-agent.js`:
```js
models: {
  qwen: {
    endpoint: "http://localhost:8000/api/generate",  // Your port
  }
}
```

---

## Issue 2: Model outputs analysis instead of code

### Symptoms
```json
{
  "user_intent": "Create HTML form",
  "classification": {
    "category": "Frontend",
    "scope": "Full Command"
  },
  "plan": "I'll generate the HTML..."
}
```

### Causes
- Model thinks it should analyze before acting
- Temperature too high (too creative)
- Prompt not clear enough

### Solutions

**Solution 1: Agent auto-fixes (should happen automatically)**
- Agent detects analysis → auto-retries
- Lower temperature on retry
- Forces code generation

**If auto-fix doesn't work:**

Lower temperature in config:
```js
models: {
  qwen: {
    temperature: 0.05,  // Even lower (was 0.1)
  }
}
```

Or manually add to prompt:
```js
GENERATE CODE DIRECTLY WITHOUT ANALYSIS OR EXPLANATION.
```

---

## Issue 3: Model takes too long (timeout)

### Symptoms
```
❌ Request timeout. Local model is too busy.
   (waited 60 seconds, no response)
```

### Causes
- Model is processing (normal for large models)
- System is slow/underpowered
- Model is out of memory
- Other programs using GPU/RAM

### Solutions

**Solution 1: Increase timeout**
```js
CONFIG = {
  timeout: 120000,  // 2 minutes instead of 60s
}
```

**Solution 2: Use faster model**
```
Switch from: Deepseek 6.7B (slow)
To: Qwen 3.5B (fast)
```

**Solution 3: Free up resources**
```bash
# Close other apps
# Clear memory
# Restart Ollama: ollama serve

# Check available memory
free -h  # Linux/Mac
tasklist | grep -i ollama  # Windows
```

**Solution 4: Reduce request size**
- Ask for smaller files
- Simpler requests
- Shorter prompts

---

## Issue 4: Model runs out of memory

### Symptoms
```
❌ Out of memory error
   Process killed
   Model stopped responding
```

### Causes
- Model too large for your RAM
- Multiple requests at once
- Background apps using memory

### Solutions

**Check available RAM:**
```bash
# Linux/Mac
free -h

# Windows
tasklist | grep ollama
```

**Use smaller model:**
```
Instead of: 13B or 70B models
Use: 3.5B or 7B models
```

**Configuration:**
```js
// In config, reduce context:
maxTokens: 2048,  // was 4096
```

**System setup:**
- Close browser
- Close IDE (except terminal)
- Disable background apps
- Use model swap to disk (slower but works)

---

## Issue 5: Generated code has syntax errors

### Symptoms
```
❌ Generated code doesn't work
   Missing semicolons
   Unclosed brackets
   Import statements missing
```

### Causes
- Model temperature too high (too creative)
- Model is underfitted for language
- Prompt was ambiguous

### Solutions

**Solution 1: Lower temperature**
```js
temperature: 0.05,  // More deterministic
```

**Solution 2: Be more specific in request**

❌ Bad:
```
Create a React component
```

✅ Good:
```
Create a TypeScript React functional component with useState hook 
for managing counter state, with increment/decrement buttons
```

**Solution 3: Add examples to prompt**

```js
PROMPTS.withExample = (task) => `Generate code directly.
DO NOT analyze, explain, or classify.

EXAMPLE:
// Good: Complete, working code
function add(a, b) {
  return a + b;
}

REQUEST: ${task}

GENERATE CODE:
`
```

**Solution 4: Use better model**

Switch to Deepseek (more accurate) instead of Qwen (faster).

---

## Issue 6: Sequential tasks don't wait properly

### Symptoms
```
🚀 Executing 3 tasks...
📋 TASK 1/3: ...
❌ TASK 2/3 starts before TASK 1 finishes
```

### Causes
- JavaScript async issue
- Python threading issue
- Race condition

### Solutions

**The fix is already built-in**, but verify in code:

```js
// Correct (sequential):
for (let i = 0; i < tasks.length; i++) {
  const result = await callLocalModel(prompt, model);  // WAIT
  sleep(2000);  // 2-second pause
}

// Wrong (parallel):
tasks.forEach(task => {
  callLocalModel(task, model);  // No await!
});
```

Check you're using the provided agents, not creating your own.

---

## Issue 7: File is not created

### Symptoms
```
✅ File created: button.tsx
(but file doesn't exist on disk)
```

### Causes
- Wrong directory
- Permission denied
- Path issue

### Solutions

**Check current directory:**
```js
console.log(process.cwd());  // Node.js
print(os.getcwd())  # Python
```

**Use absolute path:**
```js
const path = require('path');
const filePath = path.join(__dirname, 'button.tsx');
fs.writeFileSync(filePath, code);
```

**Fix permissions:**
```bash
chmod 755 .  # Mac/Linux
# Windows: Right-click → Properties → Security
```

---

## Issue 8: Agent crashes or exits unexpectedly

### Symptoms
```
Process exits with code 1
or
Uncaught exception: ...
```

### Causes
- Network error
- Invalid input
- Bug in agent code

### Solutions

**Run with error logging:**
```bash
# Node.js
node --trace-warnings local-model-agent.js

# Python
python -u local_model_agent.py
```

**Check logs:**
```
Look for error messages before "Process exits"
```

**Try simpler request:**
- Start with basic HTML
- Don't use special characters
- Keep it short

---

## Issue 9: Model returns empty response

### Symptoms
```
📡 Calling Qwen Coder 3.5B...
(waits...)
⚠️  Output is empty
❌ Failed to generate code
```

### Causes
- Model crashed
- Memory issue
- Prompt confused model

### Solutions

**Restart model:**
```bash
# Kill Ollama
pkill ollama
# Wait 5 seconds
# Restart
ollama serve
```

**Simplify prompt:**

❌ Complex:
```
Create a full-stack application with authentication, 
database models, API endpoints, and React frontend
```

✅ Simple:
```
Create a Python function that validates email addresses
```

**Check model is loaded:**
```bash
ollama list
# Should show: qwen:latest  5.5GB
```

---

## Issue 10: How do I see what the agent is doing?

### Enable Debug Logging

**Node.js:**
```js
const DEBUG = true;  // Add to top of file

if (DEBUG) console.log("Prompt:", prompt);
if (DEBUG) console.log("Response:", output);
```

**Python:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug(f"Prompt: {prompt}")
```

**Watch network calls:**
```bash
# Linux/Mac
tcpdump -i lo port 11434

# Windows
netsh trace start scenario=InternetClient capture=yes

# Simple: Just watch console output
```

---

## Quick Diagnostic Checklist

- [ ] Is Ollama running? (`ollama serve`)
- [ ] Is model downloaded? (`ollama pull qwen:latest`)
- [ ] Can you connect? (`curl http://localhost:11434/api/generate`)
- [ ] Is agent using right endpoint?
- [ ] Is temperature low enough? (< 0.2)
- [ ] Do you have enough RAM? (4GB+ for 7B models)
- [ ] Is prompt clear? (no analysis keywords)
- [ ] Did you wait for completion? (don't cancel early)

---

## Still Stuck?

### Minimum reproducible example:
```bash
# Test the endpoint directly
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen:latest",
    "prompt": "Write a hello world function in Python",
    "stream": false
  }'
```

If that works → agent issue  
If that fails → local model issue

### Get help:
- Check Ollama logs: `ollama logs`
- Run with verbose output: `node ... 2>&1 | tee debug.log`
- Check system resources: `top` or Task Manager
- See if model is loaded: `ollama list`

---

**Remember**: Local models are slower but reliable. Patience is key! ⏱️
