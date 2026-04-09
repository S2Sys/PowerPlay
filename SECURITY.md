# Security Guide — SmartWorkz PowerStack

## API Key Management

### Setup (First Time)

#### 1. Get Your API Keys

**OpenRouter (Free Cloud Models)**
1. Visit: https://openrouter.ai/account/api-keys
2. Click **"Create Key"**
3. Name it: `SmartWorkz` (optional)
4. Copy the key (starts with `sk-or-v1-...`)

**Local GPU Keys** (Dhoni/Kapil)
- Ask your DevOps/GPU admin
- Internal network only (safer)

#### 2. Create .env File

```bash
cp .env.example .env
```

Edit `.env`:
```bash
# Fill in your actual keys
DHONI_API_KEY=your-dhoni-key
KAPIL_API_KEY=your-kapil-key
OPENROUTER_API_KEY=sk-or-v1-xxxx...
```

**Save .env** — it's automatically excluded from git (.gitignore)

#### 3. Restart Continue
- VS Code: Ctrl+Shift+P → "Reload Window"
- JetBrains: Restart IDE
- Continue will load .env automatically

---

## If Your Key Was Exposed

**⚠️ Acts Required Immediately**

### For OpenRouter Keys

1. **Revoke the exposed key**
   - Go to: https://openrouter.ai/account/api-keys
   - Find your key in the list
   - Click the menu (⋮) → **"Revoke"**
   - The old key is **instantly invalid** ✓

2. **Generate a new key**
   - Click **"Create Key"**
   - Copy the new key

3. **Update .env**
   ```bash
   OPENROUTER_API_KEY=sk-or-v1-new-key-here
   ```

4. **Restart Continue**
   - Reload VS Code / Restart JetBrains

### For Local GPU Keys

1. **Contact DevOps** — They'll revoke on their end
2. **Get a new key** from them
3. **Update .env**
4. **Restart Continue**

---

## Never Do This

❌ **Hardcode API keys in config files**
```yaml
# ❌ BAD — Don't do this
apiKey: sk-or-v1-43ae7cba...
```

✅ **Use environment variables**
```yaml
# ✅ GOOD — Use ${ENV}
apiKey: ${OPENROUTER_API_KEY}
```

❌ **Commit .env to git**
```bash
# .env is in .gitignore — it won't be committed
# If you accidentally commit it:
# 1. Revoke all exposed keys
# 2. Generate new ones
# 3. Update .env
```

❌ **Share API keys via email, Slack, or chat**
- Keep keys private
- Only share `.env.example` (template, no real keys)

❌ **Reuse the same key across projects**
- Each project gets its own key
- Easier to revoke if one project's key is exposed

---

## Checking If Your Key Works

### Option 1: Continue Chat
```
Type in Continue chat:
"What models do I have?"

Expected response:
"I have access to Qwen 3.5, DeepSeek R1, Phi4..."
```

### Option 2: Curl Test (OpenRouter)
```bash
curl -X GET https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer sk-or-v1-your-key-here" \
  -H "Content-Type: application/json"
```

Should return list of models.

### Option 3: Manually in config.yaml
Check that your keys are being used:
```yaml
# ✅ Should look like this:
apiKey: ${OPENROUTER_API_KEY}

# ❌ NOT like this:
apiKey: sk-or-v1-43ae7cba...  # EXPOSED
```

---

## Environment Variables

### How Continue.dev Loads .env

1. **Looks for .env** in PowerPlay directory
2. **Reads all KEY=VALUE pairs**
3. **Substitutes ${KEY}** in config.yaml
4. **Done!** No extra setup needed

### Example:
```bash
# .env file:
OPENROUTER_API_KEY=sk-or-v1-secret123

# config.yaml:
apiKey: ${OPENROUTER_API_KEY}

# Result: apiKey becomes "sk-or-v1-secret123"
```

---

## Rotating Keys Proactively

Even without exposure, rotate keys periodically:

### Quarterly (Every 3 Months)
1. Generate new OpenRouter key
2. Update .env
3. Test in Continue
4. Revoke old key (optional, but safer)

### Steps:
```bash
# 1. Get new key from https://openrouter.ai/account/api-keys
# 2. Update .env
OPENROUTER_API_KEY=sk-or-v1-new-key-here

# 3. Restart Continue (Ctrl+Shift+P → Reload Window)

# 4. Test
# Type in Continue: "What models do I have?"

# 5. If working, revoke old key
# Go to https://openrouter.ai/account/api-keys
# Click menu (⋮) on old key → "Revoke"
```

---

## GitHub / Public Repository

### For Public Repos
- ✅ **Commit** `.env.example` (template only)
- ❌ **Never commit** `.env` (has real keys)
- ✅ **Always use** `${ENV}` in config.yaml

### For Private Repos
- Same rules apply (safer)
- Still use .env file
- Still use `${ENV}` in config

### If You Accidentally Committed .env
1. **Revoke all exposed keys immediately** (see steps above)
2. **Remove .env from git history**:
   ```bash
   git rm --cached .env
   git commit -m "Remove .env from git history"
   ```
3. **Generate new keys**
4. **Update .env with new keys**

---

## Troubleshooting

### "Model not found" Error
- Continue can't load .env
- **Fix**: 
  1. Check .env exists in PowerPlay root
  2. Verify key values are correct
  3. Restart Continue

### "API key invalid" Error
- Key might be expired or revoked
- **Fix**:
  1. Go to https://openrouter.ai/account/api-keys
  2. Check if key still exists
  3. If revoked, create new key
  4. Update .env

### "No models available" in Continue
- Config isn't loading environment variables
- **Fix**:
  1. Restart Continue (hard reload, not just refresh)
  2. Check that `${OPENROUTER_API_KEY}` appears in config.yaml (not hardcoded key)
  3. Verify .env file exists and has correct values

---

## Q&A

**Q: Is OpenRouter free?**
A: Yes, free tier with limits. Paid plans available for higher usage.

**Q: Can I use multiple OpenRouter keys?**
A: Yes, each project can have its own key. Easier to track and revoke.

**Q: What if I lose my .env file?**
A: Get new keys and recreate .env. Your old keys still work (until revoked).

**Q: Can I commit config.yaml if I use ${ENV}?**
A: Yes! `${ENV}` placeholders are safe to commit. Only the .env file (with real keys) is secret.

**Q: How do I know if a key is safe?**
A: If it's only in .env file and not in version control, it's safe. If it's in config.yaml or git history, revoke it.

---

**Last Updated**: 2026-04-09

