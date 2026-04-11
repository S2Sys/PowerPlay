# Fix: "Invalid control character" JSON Error from DeepSeek R1

## Error Details

```
500 litellm.APIConnectionError: Invalid control character at: line 2 column 74 (char 75)
json.decoder.JSONDecodeError: Invalid control character at: line 2 column 74 (char 75)
```

## Root Cause

Your `config.yaml` has models pointing to `http://rohit:4000/v1` with `${DHONI_API_KEY}` environment variables:

```yaml
- name: DeepSeek R1 8B [Reasoning]
  provider: openai
  model: dhoni-deepseek
  apiBase: http://rohit:4000/v1        # ❌ Hardcoded external server
  apiKey: ${DHONI_API_KEY}             # ❌ Env var not set
```

### What's Happening

1. **`rohit:4000`** is someone else's server, not available to you
2. **`DHONI_API_KEY`** environment variable is not set on your system
3. Continue.dev tries to connect to `rohit:4000` and either:
   - Gets a timeout or 500 error
   - Gets malformed/invalid JSON response
4. **litellm** tries to parse the invalid response and fails with JSON decode error

---

## Solution: 3 Quick Fixes

### Option 1: Use Ollama (Recommended - Fastest)

**Step 1:** Download and install Ollama
```
https://ollama.ai
```

**Step 2:** Start Ollama and download a model
```bash
ollama serve
# In another terminal:
ollama pull deepseek-coder:6.7b
```

**Step 3:** Update your config.yaml

Replace the entire models section with:

```yaml
models:
  - name: DeepSeek Coder 6.7B [Local]
    provider: ollama
    model: deepseek-coder:6.7b
    roles: [chat, edit]
    capabilities: [tool_use]
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.05

  - name: Qwen 2.5 7B [Local]
    provider: ollama
    model: qwen2.5:7b
    roles: [chat]
    defaultCompletionOptions:
      maxTokens: 8192
      temperature: 0.3
```

**Why this works:**
- ✅ Ollama runs locally (no external server needed)
- ✅ No API keys required
- ✅ Fast responses (sub-second)
- ✅ Free and open-source

---

### Option 2: Use LM Studio (GUI-Based)

**Step 1:** Download LM Studio
```
https://lmstudio.ai
```

**Step 2:** Load a model
- Open LM Studio
- Search: "DeepSeek Coder 6.7B"
- Click download
- Wait for completion

**Step 3:** Start the server
- Click "Start Server"
- Leave it running (port 1234)

**Step 4:** Update config.yaml

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

**Why this works:**
- ✅ GUI makes it easy to manage models
- ✅ No command line needed
- ✅ Clear visual feedback on model status
- ✅ Free

---

### Option 3: Use OpenRouter (Cloud - No Local Setup)

**Step 1:** Sign up for OpenRouter (FREE)
```
https://openrouter.ai
```

**Step 2:** Get API key
- Go to Settings
- Copy your API key
- **No credit card needed** — $5/month free tier

**Step 3:** Set environment variable

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

**Step 4:** Update config.yaml

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

  - name: Qwen Coder [OpenRouter]
    provider: openai
    model: qwen/qwen3-coder:free
    apiBase: https://openrouter.ai/api/v1
    apiKey: ${OPENROUTER_API_KEY}
    roles: [chat, edit]
    defaultCompletionOptions:
      maxTokens: 8192
      temperature: 0.3
```

**Why this works:**
- ✅ No local setup needed
- ✅ Cloud-based (always available)
- ✅ Free tier with $5/month credits
- ✅ No infrastructure on your machine

---

## How to Apply the Fix

1. **Open your Continue.dev config:**
   - Press `Ctrl+Shift+P`
   - Type: "Continue: Open Config"
   - Select your config.yaml

2. **Find the models section:**
   - Look for lines with `apiBase: http://rohit:4000/v1`
   - These are the broken models

3. **Replace with one of the options above:**
   - Copy the appropriate config snippet
   - Paste it into your models section
   - Delete the old `rohit:4000` models

4. **Save your config file**

5. **Restart Continue.dev:**
   - Close the chat panel
   - Close VS Code completely
   - Reopen VS Code
   - Wait 15 seconds for activation
   - Press `Ctrl+Shift+Space` to test

6. **Test with a message:**
   - Type something simple
   - Should get a response from your chosen model
   - If error, check that your server is running (Ollama/LM Studio) or API key is set (OpenRouter)

---

## Verification Steps

### For Ollama
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# You should see your downloaded models
```

### For LM Studio
- Open LM Studio
- Check "Server" tab shows "Server is running"
- Check port shows `1234`

### For OpenRouter
- Test API key in Continue settings
- Click "Test Connection" button
- Should show ✅ success message

---

## Common Issues After Fix

### Still Getting "Invalid control character"
**Check:**
- ❌ Is your chosen server running? (Ollama/LM Studio window must be open)
- ❌ Did you completely remove the `rohit:4000` models?
- ❌ Did you restart Continue.dev after changing config?

**Fix:** Restart everything:
```bash
1. Close Continue panel
2. Close VS Code
3. Wait 3 seconds
4. Reopen VS Code
5. Wait 15 seconds
6. Try again
```

### "Connection refused" or "Cannot reach server"
**Check:**
- ❌ Is Ollama running? (should show `Ollama is running` in terminal)
- ❌ Is LM Studio showing "Server is running"?
- ❌ Are you on the right port? (Ollama=11434, LM Studio=1234)

**Fix:**
- **Ollama:** Run `ollama serve` in terminal
- **LM Studio:** Click "Start Server" button in GUI
- **OpenRouter:** Check internet connection and API key is valid

### "Model not found"
**Check:**
- ❌ For Ollama: Did you run `ollama pull deepseek-coder:6.7b`?
- ❌ For LM Studio: Is the model downloaded and showing in the GUI?
- ❌ For OpenRouter: Is the model name exactly right?

**Fix:**
- **Ollama:** `ollama pull deepseek-coder:6.7b`
- **LM Studio:** Download the model in the GUI
- **OpenRouter:** Check model name matches (e.g., `deepseek/deepseek-coder:free`)

---

## Why This Happens

The original config was designed for a shared development environment where:
- One machine (`rohit`) hosted the models
- Other machines connected to it via `rohit:4000`
- Everyone had `DHONI_API_KEY` set

This doesn't work for individual developers because:
- You don't have access to `rohit:4000`
- `DHONI_API_KEY` isn't defined on your system
- The server is either offline or unreachable

---

## Recommended Setup

**For fastest local performance:**
1. Use **Ollama** (Option 1)
2. Download once with `ollama pull`
3. Run `ollama serve` to start
4. Get sub-second responses

**For easiest GUI management:**
1. Use **LM Studio** (Option 2)
2. Visual model downloader
3. One-click server start
4. Clean interface

**For no local setup needed:**
1. Use **OpenRouter** (Option 3)
2. Cloud-based (works anywhere)
3. Free tier (no credit card)
4. Always available

---

## After You Fix It

Once working:

```
1. ✅ Type: "Hello"
2. ✅ Get response from your model
3. ✅ Type: "/review" → autocomplete shows /review command
4. ✅ Chat works smoothly
5. ✅ No more JSON errors!
```

---

## Need More Help?

See [docs/LOCAL-MODEL-SETUP-FIX.md](LOCAL-MODEL-SETUP-FIX.md) for detailed troubleshooting.

**Continue.dev Docs:** https://docs.continue.dev

---

**Last Updated:** April 11, 2026  
**For:** PowerPlay v2.0.0
