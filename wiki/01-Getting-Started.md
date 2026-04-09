# Getting Started with SmartWorkz PowerStack

Welcome! This guide gets you from zero to productive in **5 minutes**.

---

## Prerequisites

- ✅ Continue.dev installed (VS Code or JetBrains)
- ✅ Admin access to copy files (for Continue config folder)
- ⚠️ **Optional**: Dhoni GPU running at `http://rohit:4000` (for local models)

---

## Step 1: Install Continue.dev

### VS Code
1. Open VS Code
2. **Ctrl+Shift+X** (Extensions)
3. Search **"Continue"**
4. Click **Install**
5. Reload VS Code

### JetBrains (IntelliJ, PyCharm, WebStorm, etc.)
1. **Settings** → **Plugins** → **Marketplace**
2. Search **"Continue"**
3. Click **Install**
4. Restart IDE

---

## Step 2: Install Config

### Windows
```bash
# Copy config.yaml to Continue's folder
Copy-Item "config.yaml" "$env:APPDATA\Continue\config.yaml"
```

### macOS
```bash
cp config.yaml ~/.continue/config.yaml
```

### Linux
```bash
cp config.yaml ~/.continue/config.yaml
```

**Verify**: Restart Continue → Settings ⚙️ → Should show "SmartWorkz PowerStack"

---

## Step 3: Start Chatting

1. Open Continue chat (**Ctrl+L** in VS Code, or continue panel in IDE)
2. Type your first prompt:
   ```
   What models are available in my config?
   ```
3. Should respond using **Qwen 3.5 9B** local model ✅

---

## Step 4: Try a Prompt

### Example: Code Review
```
@file

/review
```

Expected output:
- Summary of issues
- Security concerns table
- Performance notes
- Suggested refactors

---

## Step 5: Use Tab Autocomplete

Start typing code. You should see suggestions after **400ms** of pausing.

```csharp
public class UserService
{
    [Tab for autocomplete]
}
```

---

## Troubleshooting

### Issue: "Model not found: dhoni-qwen"
**Cause**: Dhoni GPU not running
**Fix**: 
- Ensure `http://rohit:4000` is accessible
- Check GPU service status
- Or disable local models and use cloud fallbacks

### Issue: "Autocomplete not working"
**Cause**: Model might be overloaded
**Fix**:
- Wait 5 seconds
- Restart Continue (Cmd+Shift+P → Reload Window)

### Issue: "Wrong model used"
**Cause**: Model selection override in Continue
**Fix**:
- Clear Continue cache: Settings → Advanced → Clear cache
- Restart

---

## Next Steps

- 📖 Read [Config Reference](./02-Config-Reference.md) to understand sections
- 📋 Read [Rules Guide](./03-Rules-Guide.md) to see all rules in detail
- 🛠️ Read [MCP Servers Guide](./05-MCP-Servers-Guide.md) to use tools like Git, FileSystem
- 💬 Read [Prompts Reference](./06-Prompts-Reference.md) for all /commands

---

## Quick Reference: Key Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+L** | Open Continue chat (VS Code) |
| **Cmd+M** | Open Continue chat (macOS) |
| **Ctrl+K** | Quick action menu |
| **/review** | Code review prompt |
| **/add-tests** | Generate xUnit tests |
| **@file** | Reference current file |
| **@codebase** | Search codebase context |

---

## When to Use Which Model

| Task | Model | Speed |
|------|-------|-------|
| Quick Q&A | Phi4 Mini | ⚡⚡⚡⚡ |
| Code chat | Qwen 3.5 9B | ⚡⚡⚡ |
| Complex reasoning | DeepSeek R1 | ⚡ |
| Code generation | Qwen Coder (apply) | ⚡⚡ |
| Cloud fallback | GPT-OSS 120B | ⚡ |

---

## What's Next?

1. ✅ Install + verify working
2. ⏭️ Read [Rules Guide](./03-Rules-Guide.md) to learn all rules
3. ⏭️ Try 3-4 different /prompts from [Prompts Reference](./06-Prompts-Reference.md)
4. ⏭️ Enable MCP servers from [MCP Guide](./05-MCP-Servers-Guide.md)

