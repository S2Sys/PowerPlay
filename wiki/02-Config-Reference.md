# Configuration Reference

Complete breakdown of every section in `config.yaml`.

---

## 1. Metadata (Version 1.0.0+)

```yaml
metadata:
  releaseDate: "2026-04-09"
  lastUpdated: "2026-04-09"
  releaseUrl: "https://github.com/SmartWorkz-Dev/PowerPlay/releases/tag/v1.0.0"
  wikiUrl: "https://github.com/SmartWorkz-Dev/PowerPlay/wiki"
  changelogUrl: "..."
  supportedContinueVersions: ">=0.8.0"
  author: "SmartWorkz Dev"
  license: "MIT"
```

**What it does**: Documents release info, links, version compatibility.

**When to update**: On every release (bump version, update dates).

---

## 2. Default Completion Options

```yaml
defaultCompletionOptions:
  maxTokens: 4096
  temperature: 0.3
```

- **maxTokens: 4096** → Max response length (increase for long outputs, decrease for speed)
- **temperature: 0.3** → Low = deterministic (good for code), high = creative (good for brainstorming)

**Overridden by**: Individual models can have their own `defaultCompletionOptions`

---

## 3. Rules (System Instructions)

```yaml
rules:
  - name: smartworkz-core
    alwaysApply: true  # Applied to ALL files
    rule: |
      [Instructions for all chat, edit, agent tasks]
```

### Rule Structure
- **name**: Unique identifier (used in logs)
- **globs**: `["**/*.cs", "**/*.ts"]` — Which files this rule applies to
- **alwaysApply**: If true, applies regardless of file type
- **rule**: The actual instruction text

### Built-in Rules

| Rule | Applies To | Purpose |
|------|-----------|---------|
| **smartworkz-core** | All files | C# 12, async/await, ILogger |
| **dotnet-rules** | `**/*.cs` | Controllers, Services, Repositories, validation |
| **angular-rules** | `**/*.ts`, `**/*.html` | Standalone, inject(), OnPush, Signals |
| **sql-rules** | `**/*.sql` | SET NOCOUNT, NOLOCK, SARGable WHERE |
| **security-always** | All files | No secrets, parameterized queries, input sanitization |

### How to Add a New Rule

1. Add block to `rules:` section
2. Give it a name and glob pattern
3. Write instruction text
4. Bump version (minor)
5. Update CHANGELOG

Example:
```yaml
  - name: react-rules
    globs: ["**/*.tsx", "**/*.jsx"]
    alwaysApply: false
    rule: |
      React 18+ standards:
      - Functional components only
      - Use hooks (useState, useEffect, useContext)
      - Memo for expensive renders
      - Suspense for async data
```

---

## 4. Models (9 Total)

### Structure
```yaml
- name: Model Display Name
  provider: openai  # All use OpenAI-compatible API
  model: identifier-used-in-api
  apiBase: http://... or https://...
  apiKey: your-key-here
  roles: [chat, edit, apply]  # What Continue uses it for
  capabilities: [tool_use]  # MCP server support
  defaultCompletionOptions:
    maxTokens: 8192
    temperature: 0.3
```

### Roles Explained
- **chat**: Respond to user questions
- **edit**: Apply edits to code (careful mode)
- **apply**: Generate code blocks (fast mode)
- **embed**: Embeddings for semantic search (not used for chat)

### Capabilities
- **tool_use**: Can invoke MCP servers (Git, Files, etc.)

### Local Models (Dhoni GPU)

| Model | Speed | Best For |
|-------|-------|----------|
| Qwen 3.5 9B | ⚡⚡⚡ | General chat, reasoning |
| DeepSeek R1 8B | ⚡ | Complex logic, debugging |
| Phi4 Mini | ⚡⚡⚡⚡ | Quick answers, autocomplete |
| Qwen Coder | ⚡⚡ | Code generation (apply/edit) |
| DeepSeek Coder 6.7B | ⚡⚡ | Code editing, refactoring |

### Cloud Models (OpenRouter Free)

| Model | Speed | Best For |
|-------|-------|----------|
| GPT-OSS 120B | ⚡ | Complex reasoning, fallback |
| MiniMax M2.5 | ⚡ | Creative tasks, brainstorming |
| Qwen3 Coder | ⚡ | Cloud code generation (free) |
| Gemma 4 26B | ⚡ | General reasoning (free) |

### How to Add a Model

1. Add new block to `models:` section
2. Get `apiBase` and `apiKey` from provider
3. Set `roles` (which modes use this model)
4. Set `defaultCompletionOptions` (temperature, maxTokens)
5. Bump version (minor)
6. Update CHANGELOG

---

## 5. Tab Autocomplete

```yaml
tabAutocompleteModel:
  provider: openai
  model: kapil-qwen-coder
  apiBase: http://rohit:4000/v1
  apiKey: ...

tabAutocompleteOptions:
  debounceDelay: 400            # Wait 400ms after typing stops
  maxPromptTokens: 1500         # Context window size
  prefixPercentage: 0.75        # 75% of context = what you've typed
  multilineCompletions: "auto"  # Multi-line suggests possible
  useCache: true                # Avoid re-generating same suggestions
  useOtherFiles: true           # Cross-file context (like Copilot)
```

### Tuning Tips
- **debounceDelay**: Increase if suggestions interrupt typing, decrease for responsiveness
- **maxPromptTokens**: Increase for more context, decrease for speed
- **prefixPercentage**: Higher = focus on what you've typed, lower = focus on following code
- **useOtherFiles**: Turn off if cross-file context causes wrong suggestions

---

## 6. Embeddings

```yaml
embeddingsProvider:
  provider: openai
  model: llama-nemotron-embed-vl-1b-v2
  apiBase: https://openrouter.ai/v1
  apiKey: sk-or-v1-...
```

Used for semantic search when using `@codebase`, `@docs` context providers.

---

## 7. MCP Servers

```yaml
mcpServers:
  - name: Git
    type: stdio
    command: uvx
    args: [mcp-server-git, --repository, .]
```

### Built-in Servers

| Server | Purpose | Works in Agent Mode? |
|--------|---------|--------|
| **Git** | Read git log, blame, branch info | ✅ |
| **FileSystem** | Autonomous read/write/create files | ✅ |
| **Continue Docs** | Search Continue documentation | ✅ |
| **SQLite Dev DB** | Query local development database | ✅ |
| **Playwright** | Browser automation (scrape, test) | ✅ |

### How to Add MCP Server

```yaml
  - name: My Custom Tool
    type: stdio
    command: npx
    args: ["-y", "my-mcp-tool"]
    env:
      CUSTOM_VAR: "value"
```

See [MCP Servers Guide](./05-MCP-Servers-Guide.md) for detailed setup.

---

## 8. Context Providers

```yaml
contextProviders:
  - name: code
    params:
      nRetrieveFiles: 15
```

### Available Providers

| Provider | Usage | Example |
|----------|-------|---------|
| **code** | Retrieve relevant code files | `@code user authentication` |
| **codebase** | Search entire codebase | `@codebase where is UserService` |
| **docs** | Indexed documentation | `@docs Angular routing` |
| **diff** | Git changes in current branch | `@diff what changed` |
| **terminal** | Terminal output | `@terminal last error` |
| **problems** | IDE errors/warnings | `@problems` |
| **folder** | Files in a folder | `@folder src/services` |
| **file** | Specific file | `@file src/app.ts` |
| **currentFile** | Active editor file | `@currentFile` |
| **repo-map** | High-level codebase structure | `@repo-map` |
| **open** | All open tabs | `@open` |

---

## 9. Docs Indexing

```yaml
docs:
  - name: Continue.dev
    startUrl: https://docs.continue.dev/intro
```

When you use `@docs`, Continue crawls these URLs and builds a semantic index.

### Adding Docs

```yaml
  - name: My Project Wiki
    startUrl: https://wiki.mycompany.com/
```

Continue will crawl and index all linked pages (be patient, may take minutes).

---

## 10. Prompts (Slash Commands)

```yaml
prompts:
  - name: review
    description: "Full code review — bugs, patterns, security"
    invokable: true
    prompt: |
      Perform a thorough code review...
```

### Structure
- **name**: Command (type `/review`)
- **description**: Shows in autocomplete
- **invokable**: If true, shows in slash command menu
- **prompt**: The actual instruction sent to the model

### Built-in Prompts
See [Prompts Reference](./06-Prompts-Reference.md) for all 10 commands.

### How to Add Prompt

```yaml
  - name: my-command
    description: "What this does"
    invokable: true
    prompt: |
      Do this thing:
      1. Step one
      2. Step two
      Output: expected result format
```

Then type `/my-command` in Continue chat.

---

## Versioning Changes by Release

### v1.0.0 (Current)
- Initial release with 5 local + 4 cloud models
- 10 prompts, 5 rules, 5 MCP servers

### v1.1.0 (Planned)
- New: Claude API model support
- New: `/architecture-design` prompt
- Changed: Tab autocomplete debounce 400ms → 350ms

### v2.0.0 (Future)
- **[BREAKING]** schema v2 (flatter structure)
- Built-in telemetry (opt-in)
- Environment variable interpolation

---

## Advanced: Overriding Defaults

You can override global settings per model:

```yaml
defaultCompletionOptions:
  maxTokens: 4096
  temperature: 0.3

models:
  - name: DeepSeek R1
    ...
    defaultCompletionOptions:
      maxTokens: 8192      # Override: use more tokens for reasoning
      temperature: 0.1     # Override: be deterministic
```

---

## Validation

Validate your config:
```bash
yamllint config.yaml
```

Or test a model:
```bash
curl -X POST http://rohit:4000/v1/chat/completions \
  -H "Authorization: Bearer YOUR-KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"dhoni-qwen","messages":[{"role":"user","content":"test"}]}'
```

