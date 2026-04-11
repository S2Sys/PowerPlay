# Fix: Local Model Not Working in Continue.dev

## Error You're Seeing

```
There was an error handling the response from DeepSeek Coder 6.7B [Edit].
Please try to submit your message again.
No chat model selected
```

---

## Root Cause

The `config.yaml` has local models configured with:

```yaml
apiBase: http://rohit:4000/v1    # ❌ Hardcoded server address
apiKey: ${DHONI_API_KEY}         # ❌ Environment variable not set
```

This won't work because:
1. **`rohit:4000`** is someone else's server, not yours
2. **`DHONI_API_KEY`** environment variable is not defined
3. Continue.dev can't find/connect to a chat model

---

## Solution: 3 Easy Options

### Option 1: Use Ollama (Recommended - Fastest)

**Step 1: Install Ollama**
- Download: https://ollama.ai
- Install it

**Step 2: Download a Model**
```bash
ollama pull deepseek-coder:6.7b
# or
ollama pull qwen2.5:7b
```

**Step 3: Start Ollama**
```bash
ollama serve
# Runs on http://localhost:11434
```

**Step 4: Update config.yaml**

In Continue settings, add this model:

```yaml
models:
  - name: DeepSeek Coder 6.7B
    provider: ollama
    model: deepseek-coder:6.7b
    roles: [chat, edit]
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.05
```

**Step 5: Test**
- Open a file in Continue
- Send a message
- Should work! ✅

---

### Option 2: Use LM Studio (Easiest GUI)

**Step 1: Install LM Studio**
- Download: https://lmstudio.ai
- Install it

**Step 2: Load a Model**
- Open LM Studio
- Search: "DeepSeek Coder 6.7B" or "Qwen 2.5 Coder"
- Click download
- Wait for it to finish

**Step 3: Start Server**
- Click "Start Server"
- Leave it running
- Runs on http://localhost:1234/v1

**Step 4: Update config.yaml**

```yaml
models:
  - name: DeepSeek Coder [LM Studio]
    provider: openai
    model: local-model
    apiBase: http://localhost:1234/v1
    apiKey: not-needed
    roles: [chat, edit]
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.05
```

**Step 5: Test**
- Send a message in Continue
- Should work! ✅

---

### Option 3: Use OpenRouter (Cloud - No Setup)

**Step 1: Sign Up for OpenRouter**
- Go to: https://openrouter.ai
- Click "Sign Up"
- Get FREE $5/month credits (no credit card needed!)

**Step 2: Get API Key**
- Go to settings
- Copy your API key

**Step 3: Set Environment Variable**

**Windows (Command Prompt):**
```cmd
set OPENROUTER_API_KEY=your-api-key-here
```

**Windows (PowerShell):**
```powershell
$env:OPENROUTER_API_KEY="your-api-key-here"
```

**macOS/Linux:**
```bash
export OPENROUTER_API_KEY="your-api-key-here"
```

**Step 4: Update config.yaml**

```yaml
models:
  - name: DeepSeek Coder [OpenRouter]
    provider: openai
    model: deepseek/deepseek-coder:free
    apiBase: https://openrouter.ai/api/v1
    apiKey: ${OPENROUTER_API_KEY}
    roles: [chat, edit]
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.05
```

**Step 5: Test**
- Restart Continue
- Send a message
- Should work! ✅

---

## Quick Troubleshooting

### Error: "No chat model selected"
**Problem:** Server is not running  
**Solution:** Start your chosen server (Ollama/LM Studio/OpenRouter)

### Error: "Connection refused" 
**Problem:** Wrong server address  
**Solution:** Check apiBase is correct:
- Ollama: `http://localhost:11434/api` (provider: ollama)
- LM Studio: `http://localhost:1234/v1` (provider: openai)
- Jan.ai: `http://localhost:1337/v1` (provider: openai)
- OpenRouter: `https://openrouter.ai/api/v1` (provider: openai)

### Error: "Invalid API key"
**Problem:** API key is wrong or not set  
**Solution:**
- For local: Use `apiKey: not-needed` or leave blank
- For OpenRouter: Set `OPENROUTER_API_KEY` environment variable

### Error: "Model not found"
**Problem:** Model hasn't been downloaded  
**Solution:** Download the model first
- Ollama: `ollama pull model-name`
- LM Studio: Download in GUI
- OpenRouter: Uses their hosted models (automatic)

---

## Where to Find the Fixed Config

See: `config-backups/config-FIXED-LOCAL-SETUP.yaml`

This file has examples for all 4 options ready to use.

---

## Recommended Setup

**For Local Development (Fastest):**
1. Use **Ollama** (Option 1)
2. Models run on your machine
3. Zero latency
4. Free

**For Easiest GUI:**
1. Use **LM Studio** (Option 2)
2. Nice interface
3. Visual model management
4. Free

**For No Local Setup:**
1. Use **OpenRouter** (Option 3)
2. Cloud-based
3. Always available
4. $5/month free tier

---

## After You Fix It

Once you get it working:

1. ✅ Copy the working model config from `config-FIXED-LOCAL-SETUP.yaml`
2. ✅ Paste into Continue settings
3. ✅ Delete or comment out the broken `rohit:4000` models
4. ✅ Test with a message
5. ✅ You're done!

---

## Need More Help?

Check these Continue.dev resources:
- Docs: https://docs.continue.dev
- GitHub Issues: https://github.com/continuedev/continue/issues
- Discord: https://discord.gg/continue

---

**Last Updated:** 2026-04-11  
**For:** PowerPlay v2.0.0
