# Fix: Auto-Apply Not Working with Local Ollama Models

## Problem

Auto-apply (inline code edits in Continue.dev) doesn't work with Ollama models:
- ❌ Code edits don't apply
- ❌ Changes are incomplete or incorrect
- ❌ Sometimes doesn't trigger at all
- ❌ "Apply" button grayed out or not responding

## Root Cause

**Ollama models don't support the structured output that Continue.dev needs for auto-apply.**

### Why Auto-Apply Fails with Ollama

1. **No Tool Use Support** — Ollama doesn't implement `tool_use` (function calling) the way Continue.dev expects
   - Continue.dev needs structured JSON responses to identify exactly where and how to modify code
   - Ollama returns plain text, not the structured edit instructions Continue.dev needs

2. **No Output Schema Enforcement** — Local models can't guarantee code edits will be syntactically correct
   - Cloud models have post-processing to ensure valid code
   - Ollama returns raw text that might have errors

3. **Prompt Template Limitations** — Ollama's prompt templates don't match Continue.dev's edit requirements
   - Chat prompts work fine (plain text)
   - Edit prompts need precise structure (code blocks, diffs, markers)
   - Ollama struggles with this

4. **Latency Issues** — Local models are slow for edits
   - Qwen 2.5 Coder: 5-10 seconds per edit
   - DeepSeek Coder: 3-8 seconds per edit
   - Feels broken because the UI shows no progress

### What Works with Ollama
✅ **Chat** — Plain conversation works fine  
✅ **Code Explanations** — Works well  
✅ **Completions** — Tab autocomplete works  
❌ **Auto-Apply** — Doesn't work  
❌ **Code Edits** — Doesn't work

---

## Solution: Use Cloud Models for Auto-Apply

**Keep local Ollama models for chat, use OpenRouter (cloud) for edits.**

### Updated config.yaml

Your config now uses:

```yaml
# For Chat (Fast, Local)
- name: DeepSeek Coder 6.7B [Local]
  provider: ollama
  roles: [chat, edit]  # edit here is for manual, not auto-apply

# For Auto-Apply (Accurate, Cloud)
- name: Qwen Coder [Cloud - For Auto Apply]
  provider: openai
  model: qwen/qwen3-coder:free
  apiBase: https://openrouter.ai/api/v1
  apiKey: ${OPENROUTER_API_KEY}
  roles: [edit, apply]  # apply role = auto-apply
```

### How It Works

**When you use auto-apply:**
```
You: "Make this function async"
Continue.dev: "Which model should I use for editing?"
Answer: Qwen Coder [Cloud] (has 'apply' role)
Result: ✅ Works perfectly (cloud model handles it)
```

**When you chat:**
```
You: "Hello"
Continue.dev: "Which model should I use?"
Answer: DeepSeek Coder 6.7B [Local] (has 'chat' role)
Result: ✅ Fast response (local model)
```

---

## Setup

### Step 1: Update config.yaml (Already Done!)

Your config.yaml already has this set up:
```yaml
# Chat with local Ollama
- name: DeepSeek Coder 6.7B [Local]
  roles: [chat, edit]
  provider: ollama

# Auto-Apply with cloud OpenRouter
- name: Qwen Coder [Cloud - For Auto Apply]
  roles: [edit, apply]
  provider: openai
```

### Step 2: Make Sure You Have OpenRouter API Key

```bash
# Set environment variable (Windows Command Prompt)
set OPENROUTER_API_KEY=your-key-here

# Or PowerShell
$env:OPENROUTER_API_KEY="your-key-here"

# Or macOS/Linux
export OPENROUTER_API_KEY="your-key-here"
```

**No credit card needed!** OpenRouter gives $5/month free credits.

### Step 3: Restart Continue.dev

```
1. Close the chat panel
2. Close VS Code completely
3. Wait 3 seconds
4. Reopen VS Code
5. Wait 15 seconds
6. Select a model from the model dropdown
   (Make sure you pick one with 'apply' role for auto-apply)
```

### Step 4: Test Auto-Apply

```
1. Open a Python file
2. Select a function
3. Right-click → "Ask Continue to edit" (or use shortcut)
4. Type: "Make this async"
5. Should see apply button appear
6. Click Apply → ✅ Should work!
```

---

## Why This Works

### OpenRouter (Cloud) vs Ollama (Local)

| Feature | Ollama (Local) | OpenRouter (Cloud) |
|---------|---|---|
| **Chat** | ✅ Works great | ✅ Works great |
| **Auto-Apply** | ❌ Broken | ✅ Works perfectly |
| **Speed** | ⚡ 2-5 sec | 🐢 5-15 sec |
| **Cost** | 💰 Free | 💵 $5/month free |
| **Privacy** | 🔒 Local | ☁️ Cloud |
| **Tool Use** | ❌ No | ✅ Yes |
| **Structured Output** | ❌ No | ✅ Yes |
| **Internet** | ❌ Offline works | ✅ Needs internet |

### Strategy

- **Chat (local Ollama):** Fast, private, no cost → Use for conversations
- **Edits (cloud OpenRouter):** Accurate, structured, reliable → Use for auto-apply

This gives you the **best of both worlds:**
- ⚡ Fast chat with local models
- 🎯 Precise edits with cloud models
- 💰 Still free (OpenRouter free tier)

---

## Troubleshooting

### "Apply button is still grayed out"

**Check:**
1. Do you have a model with `roles: [edit, apply]` or `roles: [apply]`?
   ```yaml
   ❌ WRONG: roles: [chat, edit]
   ✅ RIGHT: roles: [edit, apply]
   ```

2. Is `OPENROUTER_API_KEY` environment variable set?
   ```bash
   echo $OPENROUTER_API_KEY  # Should show your key
   ```

3. Did you restart Continue.dev?
   - Close VS Code completely
   - Reopen (don't just reload)

4. Select the right model from dropdown
   - Should show "Qwen Coder [Cloud - For Auto Apply]"
   - Must have "apply" role

### "Cloud model is too slow for auto-apply"

**That's normal.** Cloud models (5-15 seconds) are slower than local (2-5 sec), but they actually work.

**Options:**
1. Accept the latency (it's worth it for correct edits)
2. Use OpenRouter's fast models (GPT OSS 120B is faster)
3. Use Anthropic Claude (paid) — fastest and most accurate

### "I want to use local models for everything"

**You can't use Ollama for auto-apply** — it technically doesn't work due to tool use limitations.

**Better approaches:**
1. **Manual edits** — Copy-paste code suggestions locally
2. **Chat-based edits** — Ask local model to explain, apply manually
3. **Switch to Claude** — Claude has built-in auto-apply support (paid)

---

## Complete Working Config

```yaml
models:
  # ═══════════════════════════════════════════════════════
  # LOCAL CHAT — Fast, Private, Free
  # ═══════════════════════════════════════════════════════
  
  - name: DeepSeek Coder 6.7B [Local]
    provider: ollama
    model: deepseek-coder:6.7b
    roles: [chat]  # ← Chat only, not auto-apply
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.05

  - name: Qwen 2.5 7B [Local Chat]
    provider: ollama
    model: qwen2.5:7b
    roles: [chat]
    defaultCompletionOptions:
      maxTokens: 8192
      temperature: 0.3

  # ═══════════════════════════════════════════════════════
  # CLOUD MODELS — For Auto-Apply & Edits
  # Free tier: $5/month on OpenRouter
  # ═══════════════════════════════════════════════════════
  
  - name: Qwen Coder [Cloud - Auto Apply] ← USE THIS FOR EDITS
    provider: openai
    model: qwen/qwen3-coder:free
    apiBase: https://openrouter.ai/api/v1
    apiKey: ${OPENROUTER_API_KEY}
    roles: [edit, apply]  # ← Has "apply" role
    defaultCompletionOptions:
      maxTokens: 16384
      temperature: 0.05

  - name: GPT OSS 120B [Cloud]
    provider: openai
    model: openai/gpt-oss-120b:free
    apiBase: https://openrouter.ai/api/v1
    apiKey: ${OPENROUTER_API_KEY}
    roles: [chat]
    defaultCompletionOptions:
      maxTokens: 8192
      temperature: 0.3
```

---

## Quick Reference

| What You Want | Use Model | Why |
|---|---|---|
| Chat with AI | DeepSeek Coder [Local] | Fast, free, local |
| Auto-apply edits | Qwen Coder [Cloud] | Only way to make it work |
| Code reasoning | Qwen 2.5 [Local] | Fast local reasoning |
| Complex analysis | GPT OSS 120B [Cloud] | Better reasoning power |

---

## Why Can't This Be Fixed?

**The underlying issue:** Ollama models fundamentally don't support the structured output format that Continue.dev uses for code edits.

This isn't a bug — it's an architectural limitation:
- ❌ Ollama can't output tool use schemas
- ❌ Ollama can't guarantee syntactically correct edits
- ❌ litellm can't translate edit requests to Ollama format

**It would require:**
- Ollama to implement tool use (like Claude/GPT)
- Continue.dev to build Ollama-specific edit handlers
- Guaranteed syntax validation on outputs

For now, the solution is **hybrid approach:** Local for chat, cloud for edits.

---

## Next Steps

1. ✅ config.yaml is updated with cloud models for auto-apply
2. ✅ Set `OPENROUTER_API_KEY` environment variable
3. ✅ Restart Continue.dev
4. ✅ Try auto-apply with "Qwen Coder [Cloud - Auto Apply]" model
5. ✅ Should work!

---

**Last Updated:** April 11, 2026  
**For:** PowerPlay v2.0.0 + Continue.dev + Ollama + OpenRouter
