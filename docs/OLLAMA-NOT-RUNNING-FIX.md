# Fix: "Unable to connect to local Ollama instance"

## Error Message

```
Unable to connect to local Ollama instance. Ollama may not be installed or may not be running.
```

## Root Cause

Ollama server is **not running** on your machine.

---

## Quick Fix

### Windows

**Step 1: Start Ollama**
1. Open Windows Start Menu
2. Search: "Ollama"
3. Click "Ollama" app
4. **Wait 10-15 seconds** for it to start
5. You should see Ollama icon in system tray (bottom right)

**Step 2: Verify it's running**
- Look for Ollama icon in taskbar/system tray
- Icon should show it's active (not grayed out)

**Step 3: Check in browser**
```
Open: http://localhost:11434
Should show: "Ollama is running"
```

**Step 4: Restart Continue.dev**
- Close VS Code completely
- Wait 3 seconds
- Reopen VS Code
- Wait 15 seconds
- Try chat again

### macOS

**Step 1: Start Ollama**
```bash
# If you installed from .app file:
# Open Applications folder → Ollama.app

# Or use Spotlight (Cmd+Space):
# Type: "Ollama"
# Press Enter
```

**Step 2: Keep it running**
- Ollama app should stay open
- Icon appears in menu bar (top right)

**Step 3: Check in browser**
```
Open: http://localhost:11434
Should show: "Ollama is running"
```

### Linux

**Step 1: Start Ollama service**
```bash
# If you installed as service:
systemctl start ollama

# Or manually:
ollama serve
# Keep this terminal open!
```

**Step 2: Check if running**
```bash
curl http://localhost:11434
# Should return something (not "Connection refused")
```

---

## Detailed Troubleshooting

### Step 1: Verify Ollama is Installed

**Windows:**
```bash
# Check if Ollama folder exists
dir "%LOCALAPPDATA%\Programs\Ollama"
```

**macOS:**
```bash
# Check if installed
ls /Applications/Ollama.app
```

**Linux:**
```bash
# Check if installed
which ollama
```

If not found → **Install Ollama first:** https://ollama.ai

### Step 2: Start Ollama Properly

**Windows:**
- Open Start Menu
- Type: "Ollama"
- Click the app
- **WAIT 10-15 seconds** for server to start
- Check system tray (bottom right corner)

**macOS:**
- Open Applications → Ollama.app
- Or Cmd+Space → type "Ollama" → Enter
- Wait for icon to appear in menu bar

**Linux:**
```bash
# Terminal 1: Start Ollama
ollama serve

# Output should show:
# Serving on 127.0.0.1:11434
```

### Step 3: Verify It's Accessible

**Test 1: Check port is open**
```bash
# Windows
netstat -ano | find "11434"
# Should show a process listening

# macOS/Linux
lsof -i :11434
# Should show ollama process
```

**Test 2: Test in browser**
```
Go to: http://localhost:11434
Expected: Plain text response "Ollama is running"
Error: "Connection refused" → Ollama not started
```

**Test 3: Check models are downloaded**
```bash
curl http://localhost:11434/api/tags
# Should return JSON with your models
```

### Step 4: Make Sure Models Are Downloaded

```bash
# List installed models
ollama list

# Should show:
# NAME                 ID              SIZE
# deepseek-coder:6.7b  ...             4.3GB
# qwen2.5:7b           ...             4.7GB
```

**If models are missing, download them:**
```bash
ollama pull deepseek-coder:6.7b
ollama pull qwen2.5:7b
ollama pull deepseek-r1:8b
ollama pull qwen2.5-coder:7b
```

---

## Common Issues & Fixes

### "Ollama app won't open"

**Try:**
1. Restart your computer
2. Reinstall Ollama from https://ollama.ai
3. Check if Windows Defender is blocking it
   - Settings → Firewall → Allow app through firewall
   - Add Ollama to allowed apps

### "Ollama opens but immediately closes"

**Causes:**
- Conflicting port (11434 already in use)
- Corrupted installation
- Not enough disk space

**Fix:**
```bash
# Check what's using port 11434
netstat -ano | find "11434"

# Kill the process (if not Ollama)
taskkill /PID <process-id>

# Then restart Ollama
```

### "Ollama won't download models"

**Check:**
1. Internet connection is working
2. Disk space available (models are 4-5GB each)
3. Try smaller model first:
   ```bash
   ollama pull neural-chat:7b  # Only 4GB
   ```

### "Models are very slow"

**Possible causes:**
1. Not enough GPU VRAM
2. Using CPU instead of GPU
3. Disk is full or slow
4. Other programs using GPU

**Check GPU usage:**
```bash
# Windows (PowerShell)
nvidia-smi  # If using NVIDIA GPU

# macOS
system_profiler SPDisplaysDataType

# Linux
nvidia-smi
```

**Solutions:**
- Use smaller models (7B instead of 13B)
- Close other GPU-intensive apps
- Add more RAM to system
- Use cloud models as fallback

### "Connection refused" error

This means:
- ❌ Ollama is not running
- ❌ Ollama is running but not on port 11434
- ❌ Firewall is blocking port 11434

**Fix:**
```bash
# 1. Make sure Ollama is running
# 2. Test connection
curl http://localhost:11434

# 3. Check firewall (Windows)
# Settings → Firewall → Allow app through firewall
# Add Ollama to allowed apps
```

---

## Complete Startup Checklist

- [ ] Ollama is installed (https://ollama.ai)
- [ ] Ollama app is open/running
- [ ] Ollama appears in system tray/menu bar
- [ ] Models are downloaded (`ollama list` shows them)
- [ ] http://localhost:11434 works in browser
- [ ] Continue.dev is restarted (VS Code closed and reopened)
- [ ] OPENROUTER_API_KEY is set (for auto-apply)
- [ ] Chat works with local Ollama model selected

---

## Verify Everything is Working

**Test 1: Ollama server**
```bash
curl http://localhost:11434
# Response: Ollama is running
```

**Test 2: Models exist**
```bash
curl http://localhost:11434/api/tags | jq '.models[] | .name'
# Shows: deepseek-coder:6.7b, qwen2.5:7b, etc.
```

**Test 3: Simple request**
```bash
curl http://localhost:11434/api/generate \
  -d '{"model":"deepseek-coder:6.7b","prompt":"Hello"}'
# Returns model response
```

**Test 4: Continue.dev**
1. Press Ctrl+Shift+Space (open chat)
2. Type: "Hello"
3. Should get response from Ollama model
4. No "Unable to connect" error

---

## If Still Not Working

Try **cloud fallback** instead:

1. Use OpenRouter models in Continue.dev
2. No local Ollama needed
3. Always works (cloud-based)
4. Free tier: $5/month

**Models to use:**
- Qwen Coder [Cloud]
- GPT OSS 120B
- Llama 3.1 70B

See: [docs/FIX-AUTO-APPLY-WITH-OLLAMA.md](FIX-AUTO-APPLY-WITH-OLLAMA.md)

---

## Windows-Specific Help

### Ollama won't start on Windows

**Common causes:**
1. Windows Defender blocking it
2. Port 11434 already in use
3. Corrupted installation

**Fix steps:**

1. **Check Windows Defender**
   ```
   Settings → Virus & threat protection
   → Manage settings
   → Add exclusions (add Ollama folder)
   ```

2. **Check port is free**
   ```bash
   netstat -ano | find "11434"
   # If something else is using it, close that app
   ```

3. **Reinstall Ollama**
   - Uninstall: Control Panel → Uninstall a program → Ollama
   - Download fresh: https://ollama.ai
   - Run installer
   - Restart computer
   - Start Ollama app

### Check Ollama is in PATH

```bash
# Should show Ollama version
ollama --version

# If "ollama is not recognized":
# Add to PATH: C:\Users\<YourUsername>\AppData\Local\Programs\Ollama\bin
```

---

## macOS-Specific Help

### Ollama won't start on macOS

**Common causes:**
1. Not in Applications folder
2. Permission issues
3. Apple Silicon (M1/M2) compatibility

**Fix steps:**

1. **Check location**
   ```bash
   ls -la /Applications/Ollama.app
   ```

2. **Grant permissions**
   ```bash
   # Allow Ollama to run
   xattr -d com.apple.quarantine /Applications/Ollama.app
   ```

3. **Try manual start**
   ```bash
   /Applications/Ollama.app/Contents/MacOS/Ollama serve
   ```

### Apple Silicon (M1/M2) slow models

Ollama on M1/M2 might be slow with large models. Try:
- Smaller models: `qwen2.5:7b` instead of 13B+
- Neural Chat: `neural-chat:7b` (fastest)
- Cloud models as backup (OpenRouter)

---

## Linux-Specific Help

### Start Ollama on Linux

**If installed as service:**
```bash
# Start service
systemctl start ollama
systemctl enable ollama  # Auto-start on boot

# Check status
systemctl status ollama
```

**If using Docker:**
```bash
docker run -d -p 11434:11434 -v ollama:/root/.ollama ollama/ollama
# Then: docker exec <container-id> ollama pull deepseek-coder:6.7b
```

**Manual start:**
```bash
ollama serve
# Keep terminal open, don't close it
```

---

## Final Checklist

**Before reporting it doesn't work:**

1. ✅ Is Ollama actually running right now?
   ```bash
   curl http://localhost:11434
   ```

2. ✅ Are models downloaded?
   ```bash
   ollama list
   ```

3. ✅ Did you restart Continue.dev?
   - Closed VS Code completely
   - Waited 3 seconds
   - Reopened VS Code
   - Waited 15 seconds

4. ✅ Is the right model selected?
   - Model dropdown should show a local Ollama model
   - Not a cloud model

5. ✅ Does http://localhost:11434 work in your browser?
   - Open in Chrome/Firefox
   - Should show plain text response

If all above pass but still doesn't work → **Use cloud models (OpenRouter) instead.**

---

**Last Updated:** April 11, 2026  
**For:** PowerPlay v2.0.0 + Continue.dev + Ollama
