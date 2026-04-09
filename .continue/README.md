# .continue/ — Continue.dev Integration Files

This directory contains Continue.dev specific configuration and rules.

## 📁 Structure

```
.continue/
├── README.md               (This file)
└── rules/                  (6 Production-ready rule files)
    ├── core-standards.md       (Always applied — universal patterns)
    ├── security-guard.md       (Always applied — OWASP Top 10)
    ├── dotnet-csharp.md        (Applied to **/*.cs files)
    ├── sql-server.md           (Applied to **/*.sql files)
    ├── angular-typescript.md   (Applied to **/*.ts files)
    └── test-standards.md       (Applied to **/*Tests.cs, **/*.spec.ts)
```

## 📋 What Are Rules?

Rules are **system instructions** injected into every Continue.dev interaction:
- **Chat**: Rules inform responses
- **Apply/Edit**: Rules enforce code generation standards
- **Agent mode**: Rules guide autonomous actions

Equivalent to Cursor's `.cursorrules` file.

## 🎯 Rule Coverage

| Rule | Applies | Coverage |
|------|---------|----------|
| **core-standards** | All interactions | C# async/await, Angular modern patterns, universal naming, documentation, no TODOs, no hardcoded secrets |
| **security-guard** | All interactions | OWASP Top 10, SQL injection prevention, XSS protection, input validation, secret management |
| **dotnet-csharp** | `**/*.cs` | Controllers, services, repositories, validation, error handling, logging, dependency injection |
| **sql-server** | `**/*.sql` | Stored procedures, parameterized queries, performance optimization, indexes, transactions |
| **angular-typescript** | `**/*.ts` | Standalone components, inject(), OnPush, signals, forms, HTTP, routing, DevExtreme |
| **test-standards** | Test files | Naming convention, AAA pattern, mocking, coverage, FluentAssertions, Moq |

## 📖 Using Rules

### Automatically Applied
When you open a file in Continue.dev, the matching rules are automatically injected:

```
You open MyService.cs
→ core-standards applied (always)
→ security-guard applied (always)
→ dotnet-csharp applied (matches *.cs)
→ AI responds following all 3 rules
```

### For Chat
```
Open Continue chat
Type your question
→ All matching rules applied
→ AI considers all standards
→ Response follows all rules
```

### For /Slash Commands
```
Highlight code
Type /review
→ core-standards applied
→ security-guard applied
→ dotnet-csharp applied (if C#)
→ Security issues flagged
→ Code quality issues flagged
```

## 🔧 Modifying Rules

### Add a New Rule
1. Create `.continue/rules/new-rule.md`
2. Follow format in existing rules
3. Add to config.yaml `rules:` section
4. Test in Continue
5. Update CHANGELOG
6. Release as v1.1.0+

### Update Existing Rule
1. Edit `.continue/rules/{name}.md`
2. Test changes in Continue
3. Update CHANGELOG
4. Release as v1.0.2 (patch) or v1.1.0 (minor)

### Delete a Rule
1. Remove from `.continue/rules/`
2. Remove from config.yaml
3. Update CHANGELOG
4. Release as v2.0.0 (major breaking change)

## 📚 Rule File Format

```markdown
---
name: rule-name                    (Must match config.yaml)
description: What this does       (Short one-liner)
globs: ["**/*.cs"]                (Optional — file patterns)
alwaysApply: true|false           (Apply to all? or only matched globs?)
---

# Rule Title

## Section 1
Content explaining the rule...

**ALWAYS**:
- Do this
- Do that

**NEVER**:
- Don't do this
- Don't do that
```

## ✅ Best Practices for Rules

### DO:
✅ Be specific ("Use async/await with CancellationToken")
✅ Include examples (✅ GOOD code, ❌ BAD code)
✅ Explain WHY (reason, benefit, consequence)
✅ Keep rules focused (one rule = one topic)
✅ Make rules actionable (developers can follow them)

### DON'T:
❌ Be vague ("Write clean code")
❌ Skip examples (rules without examples are hard to follow)
❌ Assume knowledge (spell it out)
❌ Mix topics (split into multiple rules)
❌ Make unenforceable rules (need to be checkable by AI)

## 🚀 Quick Rule Lookup

### "How should I write C#?"
→ `.continue/rules/core-standards.md` (always)
→ `.continue/rules/dotnet-csharp.md` (C# specific)

### "What are the security requirements?"
→ `.continue/rules/security-guard.md`

### "How should I structure Angular?"
→ `.continue/rules/angular-typescript.md`

### "What's the SQL standard?"
→ `.continue/rules/sql-server.md`

### "How do I write tests?"
→ `.continue/rules/test-standards.md`

## 📊 Rules Statistics

- **6 rule files** created
- **1,500+** lines of documented standards
- **28+ error patterns** prevented
- **Coverage**: C#, TypeScript, SQL, testing, security, universal patterns
- **OWASP Top 10**: All covered in security-guard.md
- **Languages**: .NET 8, Angular 17+, SQL Server 2022

## 🔗 Related Files

**Config Integration**:
- `config.yaml` — Rules configured here

**Documentation**:
- `docs/guides/STRUCTURE.md` — Project organization
- `docs/audit/CONFIGARCHITECT_AUDIT.md` — Quality audit
- `wiki/03-Rules-Guide.md` — Detailed rule breakdown (planned)

**Implementation**:
- When you write code, rules are automatically applied
- When you use /prompts, rules are automatically applied
- When you're in agent mode, rules guide autonomous actions

## ⚡ Pro Tips

1. **Ctrl+I to see rules** — In VS Code with Continue, use Ctrl+I (Quick Action) to see what rules apply
2. **Test prompts** — Try `/review` on your code to see rules in action
3. **Read rules.md files** — They have good examples in ✅ GOOD / ❌ BAD format
4. **Check CHANGELOG** — When rules change, it's documented there
5. **Grep for specific rules** — `grep -r "async" .continue/rules/` to find related standards

---

**Last Updated**: 2026-04-09 | **Rules Created**: 6 | **Status**: Production Ready

