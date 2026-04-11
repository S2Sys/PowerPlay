# Fix: Ollama "Invalid control character" JSON Error

## Error You're Getting

```
500 litellm.APIConnectionError: Invalid control character at: line 2 column 74 (char 75)
json.decoder.JSONDecodeError: Invalid control character at: line 2 column 74 (char 75)
```

When using Ollama models with Continue.dev.

---

## Root Cause

**The problem:** Your Ollama model configuration has `capabilities: [tool_use]` enabled.

```yaml
❌ WRONG:
- name: DeepSeek R1 8B [Reasoning]
  provider: ollama
  model: dhoni-deepseek
  capabilities: [tool_use]  # ← This line causes the error!
  roles: [chat]
```

### Why This Breaks

1. `capabilities: [tool_use]` tells litellm the model supports function calling
2. litellm tries to format the request with JSON function schemas
3. Ollama's prompt template doesn't handle this format correctly
4. The JSON becomes malformed with invalid control characters
5. Python's JSON parser fails to decode it

**Tool use (function calling) is NOT supported by Ollama models** in the way Continue.dev expects.

---

## Solution: Remove `capabilities: [tool_use]`

### For Each Ollama Model

**Before (Broken):**
```yaml
- name: DeepSeek Coder 6.7B [Edit]
  provider: ollama
  model: deepseek-coder:6.7b
  capabilities: [tool_use]        # ❌ Remove this
  roles: [chat, edit]
```

**After (Fixed):**
```yaml
- name: DeepSeek Coder 6.7B [Edit]
  provider: ollama
  model: deepseek-coder:6.7b
  # ⚠️ No capabilities: [tool_use] for Ollama
  roles: [chat, edit]
```

---

## Quick Copy-Paste Solution

### Use This Working Configuration

Open your `Continue.dev config.yaml` and:

1. **Find** all models with `provider: ollama`
2. **Delete** any line that says `capabilities: [tool_use]`
3. **Keep** everything else

Or **replace the entire models section** with:

```yaml
models:
  - name: DeepSeek Coder 6.7B
    provider: ollama
    model: deepseek-coder:6.7b
    roles: [chat, edit]
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.05

  - name: Qwen 2.5 7B
    provider: ollama
    model: qwen2.5:7b
    roles: [chat]
    defaultCompletionOptions:
      maxTokens: 8192
      temperature: 0.3

  - name: DeepSeek R1 8B
    provider: ollama
    model: deepseek-r1:8b
    roles: [chat]
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.1

  - name: Qwen Coder [Fast]
    provider: ollama
    model: qwen2.5-coder:7b
    roles: [edit, chat]
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.05

  # Cloud fallback (for when Ollama is offline)
  - name: Qwen Coder [Cloud]
    provider: openai
    model: qwen/qwen3-coder:free
    apiBase: https://openrouter.ai/api/v1
    apiKey: ${OPENROUTER_API_KEY}
    roles: [edit, chat]
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.05
```

**Or use the ready-made config:**
📁 `config-backups/config-OLLAMA-WORKING.yaml` — Copy the models section from there.

---

## Step-by-Step Fix

### Step 1: Open Continue Config
```
Ctrl+Shift+P → Continue: Open Config
```

### Step 2: Find Ollama Models
Search for: `provider: ollama`

### Step 3: Remove Tool Use
Find any line with:
```yaml
capabilities: [tool_use]
```

**Delete it.**

### Step 4: Keep the Model
Keep the rest of the model config:
```yaml
- name: DeepSeek Coder 6.7B
  provider: ollama
  model: deepseek-coder:6.7b
  roles: [chat, edit]
  defaultCompletionOptions:
    maxTokens: 16384
    temperature: 0.05
```

### Step 5: Save Config
```
Ctrl+S
```

### Step 6: Restart Continue.dev
```
1. Close the chat panel
2. Close VS Code completely
3. Wait 3 seconds
4. Reopen VS Code
5. Wait 15 seconds for activation
6. Press Ctrl+Shift+Space to open chat
```

### Step 7: Test
```
Type: "hello"
Expected: Model responds normally
No more JSON error!
```

---

## Verify It's Fixed

### Test in Chat
```
You: "hello"
Model: "Hi! How can I help you today?" (or similar)

You: "what is 2+2?"
Model: "2+2 equals 4"
```

### Check for Success
- ✅ You get responses
- ✅ No red error messages
- ✅ No JSON decode errors in the error output
- ✅ Chat works smoothly

### If Still Broken
Check that:
1. ❌ You didn't accidentally leave `capabilities: [tool_use]`
2. ❌ All your Ollama models have this line removed
3. ❌ Ollama is still running (`ollama serve` in terminal)
4. ❌ You fully restarted Continue.dev (not just the chat panel)

---

## Why This Works

Ollama models:
- ✅ Support basic chat/completion
- ✅ Work great for code editing
- ✅ Handle markdown and code blocks
- ❌ Don't support tool_use (function calling) in the litellm format
- ❌ Return malformed JSON when tool schemas are included

By removing `capabilities: [tool_use]`, we tell Continue.dev:
- "This model doesn't do function calling"
- "Send plain text prompts only"
- "No JSON schema parsing needed"

This prevents litellm from trying to parse function call JSON, fixing the error.

---

## Which Ollama Models Work?

### ✅ Confirmed Working (No JSON Error)
- `deepseek-coder:6.7b` — Best for coding
- `qwen2.5:7b` — Fast, good quality
- `mistral:7b` — Fast, general purpose
- `neural-chat:7b` — Good for conversation
- `deepseek-r1:8b` — Best reasoning (slow)
- `qwen2.5-coder:7b` — Fast coding

### ✅ Likely Working
Any model that's installed via `ollama pull`

### ❌ Will Still Error
If you try to use models from other providers (OpenAI, Anthropic, etc.) with:
```yaml
provider: ollama
```
This only works with actual Ollama models.

---

## Common Issues After Fix

### "I removed `capabilities: [tool_use]` but still getting the error"

**Check these:**

1. **Did you restart Continue.dev?**
   ```
   ❌ Just reloading the config isn't enough
   ✅ Close VS Code completely and reopen
   ```

2. **Is Ollama still running?**
   ```bash
   # Terminal should still show:
   ollama serve
   Serving on 127.0.0.1:11434
   ```

3. **Is the model still there?**
   ```bash
   ollama list
   # Should show your models
   ```

4. **Did you update ALL Ollama models?**
   ```
   Search your config for: provider: ollama
   Make sure NONE have: capabilities: [tool_use]
   ```

### "I don't see `capabilities: [tool_use]` in my config"

Then the problem is something else:

**Check:**
- Is Ollama running? (`ollama serve` in terminal)
- Is the model downloaded? (`ollama list`)
- Is the model name spelled correctly in config?
- Is `apiBase` pointing to `localhost:11434`? (Ollama only)

**Try this test:**
```bash
curl http://localhost:11434/api/tags
# Should return JSON list of your models
```

### "Now the chat works but code editing is slow"

That's normal:
- Small models (7B) → 2-5 seconds per response
- Medium models (13B) → 5-15 seconds per response
- Large models (33B+) → 20+ seconds per response

**Try:**
- Use `qwen2.5:7b` instead of larger models
- Add more RAM to your system
- Use cloud models for editing (`openrouter` option)

### "I still see `capabilities: [tool_use]` getting added automatically"

This might be Continue.dev adding it back. Try:

1. **Delete your Continue config cache**
   ```bash
   # Windows
   del %APPDATA%\.continue\config.json
   
   # macOS
   rm ~/.continue/config.json
   
   # Linux
   rm ~/.continue/config.json
   ```

2. **Recreate the config manually** with our template above

3. **Restart VS Code**

---

## Summary

| What | Fix |
|------|-----|
| Error | `Invalid control character at: line 2 column 74` |
| Cause | `capabilities: [tool_use]` on Ollama models |
| Solution | Remove `capabilities: [tool_use]` from all Ollama models |
| Test | Type "hello" in chat → should work |
| Restart | Close VS Code completely and reopen |

---

## Need More Help?

- **Full setup guide:** [docs/LOCAL-MODEL-SETUP-FIX.md](LOCAL-MODEL-SETUP-FIX.md)
- **Ready-made config:** `config-backups/config-OLLAMA-WORKING.yaml`
- **Continue.dev docs:** https://docs.continue.dev
- **Ollama docs:** https://ollama.ai

---

**Last Updated:** April 11, 2026  
**For:** PowerPlay v2.0.0 + Continue.dev + Ollama
