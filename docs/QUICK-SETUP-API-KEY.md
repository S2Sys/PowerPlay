# Quick Setup: OpenRouter API Key

## Fastest Way (3 Minutes)

### Windows Command Prompt

```bash
cd C:\path\to\Code101\PowerPlay
scripts\setup-openrouter-api-key.bat
```

That's it! Script does everything:
1. Opens https://openrouter.ai/keys
2. Asks you to paste your API key
3. Sets it permanently in Windows
4. Verifies it worked

### Windows PowerShell

```powershell
# Run as Administrator first (right-click PowerShell → Run as admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
cd C:\path\to\Code101\PowerPlay
.\scripts\setup-openrouter-api-key.ps1
```

### macOS / Linux

```bash
cd /path/to/Code101/PowerPlay
node scripts/setup-openrouter-api-key.js
```

---

## After Running Script

1. **Close VS Code completely** (important!)
2. **Wait 3 seconds**
3. **Reopen VS Code**
4. **Open Continue chat:** `Ctrl+Shift+Space`
5. **Select a cloud model** from dropdown
6. **Type:** "hello"
7. **Should get response!** ✅

---

## Verify It Worked

```bash
# Windows Command Prompt
echo %OPENROUTER_API_KEY%

# Windows PowerShell
$env:OPENROUTER_API_KEY

# macOS/Linux
echo $OPENROUTER_API_KEY
```

Should show something like: `sk-or-v1-abc123def456...`

---

## Get API Key (If You Don't Have One)

1. Go to: https://openrouter.ai
2. Click **Sign Up** (top right)
3. Enter email + password (no credit card needed!)
4. Confirm email
5. Go to: https://openrouter.ai/keys
6. **Copy your API key** (starts with `sk-or-v1-`)
7. Paste into the script when it asks

**Free tier:** $5/month in credits (plenty for testing!)

---

## What the Script Does

✅ Checks if you already have an API key set  
✅ Opens OpenRouter website in your browser  
✅ Validates the key format (must start with `sk-or-v1-`)  
✅ Sets `OPENROUTER_API_KEY` environment variable **permanently**  
✅ Verifies it's set in current session  
✅ Shows next steps

---

## Troubleshooting

### "Permission denied" or "Access denied"

**Windows:**
- Run Command Prompt **as Administrator**
- Right-click → "Run as administrator"
- Then run the script

**macOS/Linux:**
- Run with `sudo`:
  ```bash
  sudo node scripts/setup-openrouter-api-key.js
  ```

### "Script not found"

Make sure you're in the right directory:
```bash
# Should be in: C:\path\to\Code101\PowerPlay
# Check with:
dir scripts

# Should show:
# setup-openrouter-api-key.bat
# setup-openrouter-api-key.ps1
# setup-openrouter-api-key.js
```

### API key still not working after script

1. Check if it's set:
   ```bash
   echo %OPENROUTER_API_KEY%  # Windows
   echo $OPENROUTER_API_KEY   # macOS/Linux
   ```

2. If empty, run script again

3. **Restart VS Code completely** (not just reload)

4. Check your API key is correct at: https://openrouter.ai/keys

### "API key doesn't start with sk-or-v1-"

- Go to: https://openrouter.ai/keys
- Copy your EXACT API key
- Make sure no extra spaces
- Try script again

---

## Which Script to Use?

| OS | Best Script |
|----|---|
| Windows (CMD) | `setup-openrouter-api-key.bat` |
| Windows (PowerShell) | `setup-openrouter-api-key.ps1` |
| macOS | `setup-openrouter-api-key.js` |
| Linux | `setup-openrouter-api-key.js` |
| All platforms | `setup-openrouter-api-key.js` |

Not sure? **Use the `.bat` file (always works on Windows)**

---

## Next Steps

Once your API key is set:

1. Ollama runs on **localhost:11434** for chat (local models)
2. OpenRouter runs on **cloud** for auto-apply (cloud models)
3. Both automatically selected based on what you're doing

**Your setup is now complete!** 🎉

---

**See Also:**
- [docs/CHECK-ENV-VARIABLES.md](CHECK-ENV-VARIABLES.md) — Manual setup if script doesn't work
- [docs/FIX-AUTO-APPLY-WITH-OLLAMA.md](FIX-AUTO-APPLY-WITH-OLLAMA.md) — Why we need cloud models for auto-apply
- [docs/OLLAMA-NOT-RUNNING-FIX.md](OLLAMA-NOT-RUNNING-FIX.md) — If Ollama won't start

