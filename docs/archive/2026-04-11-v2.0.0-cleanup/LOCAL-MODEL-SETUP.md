# 🚀 Local Model Agent - Complete Setup Guide

## What You Got

You now have **3 powerful ways** to use local models reliably:

1. **Node.js Agent** (`local-model-agent.js`) - Quick, interactive, no dependencies
2. **Python Agent** (`local_model_agent.py`) - Better for data science, integration
3. **Claude Code Skill** (`local-model-skill.md`) - Built-in to Continue/Claude Code

---

## ⚡ Quick Start (Choose One)

### Option 1: Node.js Agent (Easiest)

**Prerequisites:**
- Node.js installed
- Local model running (Ollama or similar)

**Usage:**
```bash
cd s:\Code101\PowerPlay
node local-model-agent.js
```

Then follow the prompts:
- Select your model (Qwen, Deepseek, Llama)
- Choose task type (generate code, create file, sequential tasks)
- Describe what you want
- Get clean code back!

### Option 2: Python Agent (Recommended)

**Prerequisites:**
- Python 3.8+
- Install requests: `pip install requests`
- Local model running

**Usage:**
```bash
cd s:\Code101\PowerPlay
python local_model_agent.py
```

**Advantages:**
- Better error handling
- Faster for batch operations
- Easy to integrate with other Python projects

### Option 3: Claude Code Skill

Add to your `.continue/config.json` or load into Claude Code:

```json
{
  "skills": [
    "local-model-agent"
  ]
}
```

Then use: `/local-model-agent Your code request here`

---

## 📋 Setup: Get Your Local Model Running

### Option A: Ollama (Recommended)

1. **Install**: https://ollama.ai/download
2. **Run models**:
```bash
ollama pull qwen:latest
ollama pull deepseek-coder:latest
ollama pull llama2:latest

# Start server (default: localhost:11434)
ollama serve
```

3. **Check it works**:
```bash
curl http://localhost:11434/api/generate -d '{"model":"qwen:latest","prompt":"hello"}'
```

### Option B: LM Studio

1. **Install**: https://lmstudio.ai/
2. **Download models** in UI
3. **Start local server** (settings → "Enable local server")
4. **Update endpoint** in agent config if different

### Option C: Other Local Runners

**Adjust endpoint in config**:
```js
models: {
  qwen: {
    endpoint: "http://YOUR-ENDPOINT:PORT/api/generate",
    modelName: "qwen"
  }
}
```

---

## 🎯 How It Works (Behind the Scenes)

### The Problem You Had
Your local models were outputting **analysis instead of code**:
```
{"user_intent": "...", "classification": {...}, "plan": "..."}
```

### The Solution (4 Layers)

**Layer 1: Prompt Optimization**
```
TASK: Generate code directly.
DO NOT analyze, explain, or classify. Write only the code.
```

**Layer 2: Sequential Execution**
- Tasks run ONE at a time (not parallel)
- 2-second wait between tasks
- Model doesn't get overwhelmed

**Layer 3: Output Validation**
- Detects analysis vs code
- Auto-corrects if wrong
- Retries up to 2 times with lower temperature

**Layer 4: Error Recovery**
- If model fails: automatic retry
- If still fails: shows error clearly
- You can then use Claude Code for backup

---

## 📚 Usage Examples

### Example 1: Generate Single File
```bash
node local-model-agent.js

# Select: 1 (Qwen Coder 3.5B)
# Choose: 2 (Create file with code)
# Filename: form.html
# Request: Create an HTML form with email and password fields
```

**Result**: `form.html` created instantly!

### Example 2: Sequential HTML/CSS/JS Website
```bash
node local-model-agent.js

# Select: 2 (Deepseek Coder)
# Choose: 3 (Execute multiple tasks)

# Task 1: Create index.html with navigation and hero section
# Add another? y
# Task 2: Create style.css with responsive design
# Add another? y
# Task 3: Create script.js with mobile menu toggle
```

**Result**: All 3 files generated sequentially, error-corrected automatically!

### Example 3: Python Script for Complex Code
```bash
python local_model_agent.py

# Select: 1 (Qwen)
# Choose: 2 (Create file)
# Filename: data_processor.py
# Request: Create a Python script that reads CSV, cleans data, exports JSON
```

---

## 🔧 Configuration

### Change Model Temperatures
Lower = more reliable code (0.1 recommended)  
Higher = more creative (0.5+ for brainstorming)

Edit in `local-model-agent.js`:
```js
models: {
  qwen: {
    temperature: 0.05,  // Even more deterministic
  }
}
```

### Add New Models
```js
models: {
  mistral: {
    name: "Mistral 7B",
    endpoint: "http://localhost:11434/api/generate",
    modelName: "mistral:latest",
    temperature: 0.1,
    topP: 0.9
  }
}
```

### Increase Retries
```js
CONFIG = {
  retries: 4,  // Try up to 4 times before giving up
  timeout: 90,  // Allow 90 seconds per request
}
```

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `Connection refused` | Start local model: `ollama serve` |
| `Model timeout` | Try smaller model (Qwen 3.5B instead of 7B) |
| `Output is still analysis` | Decrease temperature to 0.05 |
| `Model runs out of memory` | Close other apps, use smaller model |
| `Takes 2+ minutes per task` | Normal for local models. Use cloud backup |
| `Generated code has bugs` | Ask more specifically, add examples |

---

## 📊 Performance Guide

| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| **Qwen 3.5B** | ⚡⚡⚡ Fast | ⭐⭐⭐⭐ Good | HTML/CSS/JS, quick generation |
| **Deepseek 6.7B** | ⚡⚡ Medium | ⭐⭐⭐⭐⭐ Excellent | Python, Node.js, complex logic |
| **Llama 2 7B** | ⚡ Slow | ⭐⭐⭐⭐ Good | General code, all languages |

---

## 🔗 Integration With Claude Code

### Method 1: Use As Skill
```
/local-model-agent Create a React button component
```

### Method 2: Use As Fallback
When cloud model is down:
```
1. Try cloud model
2. If fails → use /local-model-agent
```

### Method 3: Batch Processing
For multiple file generation, use Python agent in loop:
```bash
for file in file1 file2 file3; do
  python local_model_agent.py
  # Interactive prompts for each
done
```

---

## 🎓 Best Practices

### ✅ Do This
- **One clear request**: "Create an HTML form with email validation"
- **Specific language**: "Create a Python Django model for users"
- **Single task**: Generate one file at a time for best results
- **Sequential**: Use multi-task queue for related tasks

### ❌ Avoid This
- **Generic**: "Create a website"
- **Analysis**: "What's the best way to..."
- **Parallel**: Don't run agent 5 times simultaneously
- **Too long**: Keep requests under 200 words

---

## 🆘 When Local Model Fails

**Fallback to Claude Code:**
```bash
# Local model failed
# Use Claude Code instead:
/frontend Create the UI I need
/api Create the backend endpoints
```

---

## 📦 What's Next?

1. **Run the agent**: `node local-model-agent.js`
2. **Generate your first file**: HTML, CSS, or Python
3. **Try sequential tasks**: 3-step website generation
4. **Integrate with PowerPlay**: Add skill to Continue.dev
5. **Scale up**: Use for production code generation

---

## 🎯 Summary

You now have a **powerful, local-model-optimized agent** that:
- ✅ Generates code directly (no analysis)
- ✅ Executes tasks sequentially (no parallelism issues)
- ✅ Validates & corrects output automatically
- ✅ Works with Qwen, Deepseek, Llama, and more
- ✅ Runs completely offline, no cloud dependency
- ✅ Integrates with Claude Code & Continue.dev

**Ready to start?** → `node local-model-agent.js` 🚀
