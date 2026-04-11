# ⚡ 30-Second Quick Start — Local Model Agent

## 1️⃣ Start Your Local Model
```bash
# Using Ollama (recommended)
ollama serve

# In another terminal, download if needed:
ollama pull qwen:latest
```

## 2️⃣ Run the Agent

**Node.js:**
```bash
cd s:\Code101\PowerPlay
node local-model-agent.js
```

**Python:**
```bash
cd s:\Code101\PowerPlay
python local_model_agent.py
```

## 3️⃣ Follow Prompts
- Select your model (Qwen, Deepseek, etc)
- Choose task (generate code / create file / sequential tasks)
- Describe what you want
- **Get clean code back!**

---

## 📝 Example Session

```
📦 Select model: 1 (Qwen Coder 3.5B)
✅ Using: Qwen Coder 3.5B

📝 What do you do?
  1. Generate code directly
  2. Create file with code
  3. Execute multiple tasks

Enter choice: 2

📁 Filename: button.tsx
📌 Describe what code you want: Create a TypeScript React button component with onClick handler

📡 Calling Qwen Coder 3.5B...
✅ File created: button.tsx
📊 Size: 287 bytes
```

**Result:** `button.tsx` is ready to use!

---

## 🎯 Common Use Cases

### Generate Single File
```
Choice: 2 (Create file)
Filename: api.py
Request: Create a Python FastAPI endpoint for user registration with email validation
```

### Generate Multiple Files (Sequential)
```
Choice: 3 (Execute multiple tasks)

Task 1: Create index.html with navigation bar
Task 2: Create style.css with responsive design
Task 3: Create script.js with menu toggle

Result: All 3 files created sequentially ✅
```

### Generate Code Directly
```
Choice: 1 (Generate code directly)
Request: Write a JavaScript function that validates phone numbers

Result: Function code printed to console ✅
```

---

## ✅ What It Does

- ✅ **Detects** when model outputs analysis instead of code
- ✅ **Auto-fixes** by resubmitting with better prompts
- ✅ **Retries** up to 2 times automatically
- ✅ **Executes** tasks sequentially (one at a time)
- ✅ **Validates** output is actual code
- ✅ **Saves** code to files on demand

---

## ⚠️ If Model Isn't Running

```
❌ Connection failed. Is local model running?
   Try: ollama serve
```

**Fix:**
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Run agent
node local-model-agent.js
```

---

## 🚀 Next Steps

1. **Run agent**: `node local-model-agent.js`
2. **Generate your first file**: HTML, CSS, Python, or JS
3. **Try sequential**: 3 files at once
4. **Integrate**: Use with Claude Code or Continue.dev
5. **Explore**: Different models & use cases

---

## 📊 Model Performance

| Model | Speed | Quality |
|-------|-------|---------|
| Qwen 3.5B | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| Deepseek 6.7B | ⚡⚡ | ⭐⭐⭐⭐⭐ |
| Llama 2 7B | ⚡ | ⭐⭐⭐⭐ |

**Tip:** Start with Qwen for speed, use Deepseek for complex code.

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| Model timeout | Use smaller model (Qwen) |
| Output is analysis | Automatic retry (wait 5-10s) |
| Connection refused | Run `ollama serve` first |
| Takes too long | Normal (2-5 min per file). Be patient! |

---

**Ready?** → `node local-model-agent.js` 🚀
