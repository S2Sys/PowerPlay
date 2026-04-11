# How to Check & Set Environment Variables

## Quick Check

### Windows Command Prompt

**Check if OPENROUTER_API_KEY is set:**
```bash
echo %OPENROUTER_API_KEY%
```

**Expected output:**
```
sk-or-v1-abc123def456...  (your API key)
```

**If empty or not found:**
```
%OPENROUTER_API_KEY%
```
Then the variable is NOT set → Follow "Set Environment Variables" section below.

### Windows PowerShell

**Check if OPENROUTER_API_KEY is set:**
```powershell
$env:OPENROUTER_API_KEY
```

**Expected output:**
```
sk-or-v1-abc123def456...  (your API key)
```

**If empty:**
Then the variable is NOT set.

### macOS / Linux

**Check if OPENROUTER_API_KEY is set:**
```bash
echo $OPENROUTER_API_KEY
```

**Expected output:**
```
sk-or-v1-abc123def456...  (your API key)
```

**If empty:**
Then the variable is NOT set.

---

## Set Environment Variables

### Option 1: Temporary (Current Session Only)

This only works for the current terminal/session. When you close the terminal, it's forgotten.

#### Windows Command Prompt

```bash
set OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

**Verify it's set:**
```bash
echo %OPENROUTER_API_KEY%
```

#### Windows PowerShell

```powershell
$env:OPENROUTER_API_KEY = "sk-or-v1-your-actual-key-here"
```

**Verify:**
```powershell
$env:OPENROUTER_API_KEY
```

#### macOS / Linux

```bash
export OPENROUTER_API_KEY="sk-or-v1-your-actual-key-here"
```

**Verify:**
```bash
echo $OPENROUTER_API_KEY
```

---

### Option 2: Permanent (System-Wide)

This persists even after restart. **This is better for Continue.dev.**

#### Windows (Permanent)

**Method A: GUI (Easiest)**

1. Press: **Windows Key + X**
2. Select: **System** (or open Settings)
3. Click: **Advanced system settings** (on left side)
   - OR: Settings → System → About → Advanced system settings
4. Click: **Environment Variables** (bottom right)
5. Under "User variables" → Click: **New**
6. Variable name: `OPENROUTER_API_KEY`
7. Variable value: `sk-or-v1-your-actual-key-here`
8. Click: **OK** (three times to close all dialogs)
9. **Restart VS Code completely**

**Verify it worked:**
- Open Command Prompt (fresh window)
- Run: `echo %OPENROUTER_API_KEY%`
- Should show your API key

---

**Method B: Command Prompt (Advanced)**

Open Command Prompt **as Administrator** and run:

```bash
setx OPENROUTER_API_KEY "sk-or-v1-your-actual-key-here"
```

Then:
1. Close the Command Prompt
2. Open a **new** Command Prompt window
3. Run: `echo %OPENROUTER_API_KEY%`
4. Should show your key

---

#### macOS (Permanent)

Add to your shell profile file:

**Step 1: Find your shell**
```bash
echo $SHELL
```
- If shows `/bin/zsh` → Edit `~/.zshrc`
- If shows `/bin/bash` → Edit `~/.bash_profile` or `~/.bashrc`

**Step 2: Edit the file**

```bash
# Open with nano (easy text editor)
nano ~/.zshrc

# OR if using bash
nano ~/.bash_profile
```

**Step 3: Add this line at the end**

```bash
export OPENROUTER_API_KEY="sk-or-v1-your-actual-key-here"
```

**Step 4: Save and exit**
- Press: `Ctrl + X`
- Press: `Y` (yes)
- Press: `Enter` (to save)

**Step 5: Reload shell**
```bash
source ~/.zshrc
# or: source ~/.bash_profile
```

**Step 6: Verify**
```bash
echo $OPENROUTER_API_KEY
```

---

#### Linux (Permanent)

Add to your shell profile:

**Step 1: Edit ~/.bashrc or ~/.zshrc**

```bash
nano ~/.bashrc
# or
nano ~/.zshrc
```

**Step 2: Add at the end**

```bash
export OPENROUTER_API_KEY="sk-or-v1-your-actual-key-here"
```

**Step 3: Save and exit**
- `Ctrl + X`
- `Y`
- `Enter`

**Step 4: Reload**
```bash
source ~/.bashrc
# or: source ~/.zshrc
```

**Step 5: Verify**
```bash
echo $OPENROUTER_API_KEY
```

---

## Get Your OpenRouter API Key

If you don't have one yet:

1. Go to: https://openrouter.ai
2. Sign up (free, no credit card needed)
3. Go to: Settings → API Keys
4. Copy your API key (starts with `sk-or-v1-...`)
5. Use it in the environment variable above

**Free tier:** $5/month in credits (plenty for testing)

---

## Verify for Continue.dev

After setting the environment variable:

### Step 1: Restart VS Code
```
1. Close VS Code completely
2. Wait 3 seconds
3. Reopen VS Code
4. Wait 15 seconds
```

### Step 2: Test in Continue.dev

1. Open chat: `Ctrl+Shift+Space`
2. Look at model dropdown
3. Should see models like:
   - "Qwen Coder [Cloud - For Auto Apply]"
   - "GPT OSS 120B [Cloud]"
4. Select one
5. Try: "hello"
6. Should get response ✅

### Step 3: Check for Errors

If you see error like:
```
Invalid API key
Authentication failed
```

Then:
- ❌ API key is wrong
- ❌ API key has extra spaces
- ❌ Environment variable not properly set

**Fix:**
1. Verify key at: https://openrouter.ai/keys
2. Copy it exactly (no extra spaces)
3. Set environment variable again
4. Restart VS Code

---

## Troubleshooting

### "API key not found" error

**Check:**
1. Did you set the environment variable?
   ```bash
   # Windows
   echo %OPENROUTER_API_KEY%
   
   # macOS/Linux
   echo $OPENROUTER_API_KEY
   ```

2. Is it showing your key? If empty → not set

3. Did you restart VS Code **after** setting it?
   - Must close VS Code completely
   - Then reopen
   - VS Code reads env vars on startup

### "Invalid API key" error

**Check:**
1. Is the key correct? Check at https://openrouter.ai/keys
2. Are there extra spaces?
   - ❌ `sk-or-v1-abc123 ` (space at end)
   - ✅ `sk-or-v1-abc123` (no space)
3. Did you copy the whole key?

### "Authentication failed"

**Try:**
1. Get a fresh key from https://openrouter.ai/keys
2. Set environment variable again
3. Restart VS Code
4. Test again

---

## Check Multiple Environment Variables

**Windows (Command Prompt):**
```bash
echo Ollama: %OLLAMA_HOST%
echo OpenRouter: %OPENROUTER_API_KEY%
```

**macOS/Linux:**
```bash
echo "Ollama: $OLLAMA_HOST"
echo "OpenRouter: $OPENROUTER_API_KEY"
```

---

## All Required Environment Variables

For full PowerPlay setup:

| Variable | Value | Required | How to Get |
|----------|-------|----------|-----------|
| `OPENROUTER_API_KEY` | `sk-or-v1-...` | ✅ For cloud models | https://openrouter.ai/keys |
| `OLLAMA_HOST` | `localhost:11434` | ❌ Optional (auto-detected) | Set only if Ollama on different port |

**Most common setup:** Only need `OPENROUTER_API_KEY`

---

## Quick Reference

### Windows
```bash
# Check
echo %OPENROUTER_API_KEY%

# Set (temporary)
set OPENROUTER_API_KEY=your-key

# Set (permanent)
setx OPENROUTER_API_KEY "your-key"
```

### macOS/Linux
```bash
# Check
echo $OPENROUTER_API_KEY

# Set (temporary)
export OPENROUTER_API_KEY="your-key"

# Set (permanent)
# Edit ~/.zshrc or ~/.bash_profile and add:
# export OPENROUTER_API_KEY="your-key"
```

---

## Complete Setup Checklist

- [ ] OpenRouter account created (https://openrouter.ai)
- [ ] API key obtained (https://openrouter.ai/keys)
- [ ] Environment variable `OPENROUTER_API_KEY` set
- [ ] Verified with `echo` or `$env:` command
- [ ] VS Code restarted (closed completely, reopened)
- [ ] Chat opened (Ctrl+Shift+Space)
- [ ] Cloud model selected from dropdown
- [ ] Test message sent ("hello")
- [ ] Got response ✅

---

## If Something Goes Wrong

1. **Verify Ollama is running**
   ```bash
   curl http://localhost:11434
   ```

2. **Check OPENROUTER_API_KEY is set**
   ```bash
   # Windows
   echo %OPENROUTER_API_KEY%
   
   # macOS/Linux
   echo $OPENROUTER_API_KEY
   ```

3. **Restart VS Code completely**
   - Close it entirely
   - Wait 3 seconds
   - Reopen

4. **Check config.yaml has both models**
   - Local Ollama models (for chat)
   - Cloud OpenRouter models (for auto-apply)

5. **Test each separately**
   - Chat with local model
   - Auto-apply with cloud model

---

**Last Updated:** April 11, 2026  
**For:** PowerPlay v2.0.0 + Continue.dev + Ollama + OpenRouter
