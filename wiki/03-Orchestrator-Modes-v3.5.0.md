# PowerPlay v3.5.0 — Orchestrator Modes Guide

**Complete reference for all available modes, commands, master prompts, and routing logic.**

> **v3.5.0 Update**: Added 6 master prompts + 23 aliases for project analysis, workspace conventions, and tech stack discovery.

---

## Quick Reference: All Modes

### 🎯 Master Orchestrators

| Mode | Speed | Use Case |
|------|-------|----------|
| **`/pp`** | 5-10 min | Describe task in natural language → auto-routes to best command |
| **`/play`** | 5-10 min | Alias for `/pp` (command consolidation v3.5.0+) |
| **`/quick`** | 1-2 min | Fast fixes, reviews, tests — immediate execution |
| **`/pp-requirements`** | 15-30 min | Full 4-phase requirements chain (Specs → Criteria → Risk → Review) |

### 📊 Master Prompts (NEW in v3.5.0)

| Command | Aliases | Purpose | Use Case |
|---------|---------|---------|----------|
| **`/master-prompt`** | `/project`, `/scan`, `/inventory`, `/profile`, `/assessment` | Comprehensive project analysis + tech stack inventory + PowerPlay fit | Analyze entire project, detect patterns, get top 10 commands |
| **`/master-prompt-builder`** | `/builder`, `/stack`, `/wizard` | Interactive HTML tech stack builder | Build project master prompt interactively |
| **`/learn`** | `/analyze`, `/context`, `/onboard`, `/audit`, `/discover`, `/patterns` | Workspace conventions + SmartWorkz patterns + top 5 PowerPlay fit | Onboard new developers, audit conventions, detect patterns |
| **`/requirement`** | `/spec`, `/specs`, `/rfc`, `/requirements` | Full 4-phase requirements chain with HANDOFF BLOCKs | Requirements engineering with context carry-over |
| **`/deep`** | `/dive`, `/explain`, `/understand` | Deep code explanation (Problem/Logic/Design/Failures/Edges) | Understand code internals deeply |
| **`/doc`** | `/docs`, `/document`, `/xml` | Add XML documentation comments | Document code with <summary>/<param>/<returns> |

### 🔐 Security

| Mode | Output | Use Case |
|------|--------|----------|
| **`/sec`** | OWASP table OR fix code OR zero-trust design | Security assessment + remediation |
| **`/security-scan`** | OWASP Top 10 table | Quick vulnerability check |
| **`/security-agent`** | Full OWASP audit + fix code | Complete security hardening |
| **`/zero-trust-design`** | Architecture diagram + policy matrix | Zero-trust architecture |
| **`/pentest-plan`** | Scope + methodology + ROE | Penetration test planning |
| **`/incident-response`** | IR playbook + post-mortem template | Incident handling |

### 🧪 Testing

| Mode | Output | Use Case |
|------|--------|----------|
| **`/test`** | Unit tests OR full suite OR gaps | Testing strategy + code |
| **`/add-tests`** | xUnit test class | Happy path + edge cases |
| **`/generate-tests-complete`** | Full test suite file | Unit + integration + boundary |
| **`/coverage-gaps`** | Gap analysis + 5 test cases | Identify untested code |

### 🗄️ Database

| Mode | Output | Use Case |
|------|--------|----------|
| **`/db`** | SQL optimization OR schema review OR design | Database work routing |
| **`/optimize-sql`** | Optimized procedure + index recommendations | SQL Server tuning |
| **`/database-design`** | CREATE TABLE + constraints + indexes | Schema design/review |
| **`/data-model`** | Schema from requirements | Design from scratch |

### 📋 Requirements Chain (v3.0.0+)

| Phase | Mode | Output | Carries Context |
|-------|------|--------|-----------------|
| **1. Specs** | `/requirements-to-specs` | REQ-F-### + REQ-NF-### | ✅ HANDOFF BLOCK 1 |
| **2. Criteria** | `/acceptance-criteria` | Gherkin Given/When/Then | ✅ HANDOFF BLOCK 2 |
| **3. Risk** | `/risk-assessment` | Risk register + Go/No-Go | ✅ HANDOFF BLOCK 3 |
| **4. Review** | `/requirements-review` | Quality audit + FINAL verdict | ✅ Ready/Needs Revision/Blocked |

---

## How `/pp` Works (Master Orchestrator)

### Step 1: CLASSIFY
Read your request and match keywords to 30+ categories from routing table:

- **Security** (vulnerability, injection, XSS, OWASP, breach, exploit)
- **Requirements** (requirement, spec, story, criteria, risk, feasibility)
- **Testing** (test, spec, coverage)
- **Database** (SQL, query, schema, procedure)
- **Performance** (slow, N+1, optimize, bottleneck)
- **Code Review** (review, look at, check, any issues)
- **Refactoring** (refactor, clean up, simplify, extract)
- And 23 more categories...

### Step 2: SELECT
Determine scope and apply tiebreaker:

- **Scope**: Code < 100 lines OR user says "quick/just/fast" → Quick | Code > 100 lines OR "full/complete/all/suite" → Full
- **Tiebreaker** (when 2+ keywords match equally):
  1. **Security** (highest priority)
  2. **Requirements**
  3. **Testing**
  4. **Database**
  5. **Performance**
  6. **Code Review** (default)

Example: "test this SQL query"
- Matches: Testing (test) + Database (SQL)
- Tiebreaker: Database wins (higher in precedence)
- Route: `/db` → optimize-sql

### Step 3: PLAN
One sentence describing what you'll check.

### Step 4: EXECUTE
Run the actual analysis/fix directly (don't say "I'll run /command", DO the work).

### Step 5: SUGGEST NEXT
After completing, suggest follow-up command if valuable:
- After `/review`: suggest `/refactor-large` if major refactor needed
- After `/security-scan`: suggest `/security-agent` for fix code
- etc.

---

## How `/quick` Works (Fast Path)

Fast-path router for simple, quick tasks. No planning ceremony.

| Request Contains | Execute | Output |
|-----------------|---------|--------|
| **fix, broken, error, bug** | Fix code | Corrected code only (no explanation) |
| **review, issues, problems, check** | Inline review | Severity \| Line \| Issue \| Fix (table) |
| **test, unit test, spec** | Generate tests | xUnit tests (happy + 2 edge cases only) |
| **document, docs, XML, JSDoc** | Add docs | <summary>/<param>/<returns> on public members |
| **security, vulnerable, injection, XSS** | Security scan | OWASP \| Severity \| Line \| Vulnerability \| Fix |
| **SQL, query, optimize** | Optimize SQL | SET NOCOUNT, SARGable, index suggestions |
| **performance, slow, N+1** | Performance check | Top 3 issues with fix code |
| **refactor, clean, simplify** | Refactor | Refactored code only |
| **type, types, any, untyped** | Add types | Typed code (no explanation) |
| **explain, what does, how does** | Explain | Problem → logic → failure modes |
| **git, commit, branch** | Git workflow | Branch name + Conventional Commits |

**Rule**: Execute without preamble. If intent unclear, ask ONE clarifying question.

---

## How `/sec` Works (Security Fast-Path)

Routes based on scope and intent:

### If code selected + no "fix/remediate"
→ **Quick OWASP scan** (table only)

### If code selected + "fix/remediate/address"
→ **Full OWASP audit** + exact fix code per issue

### If architecture/design-focused
→ **Zero-trust design** (5-step: identity, auth, network, encryption, monitoring)

### If compliance mentioned
→ **Compliance audit** (SOC 2, ISO 27001, HIPAA, PCI-DSS gaps)

### Otherwise
→ Ask: "Is this [quick scan] or [full audit] or [architecture]?"

---

## How `/test` Works (Testing Fast-Path)

Routes based on code size and scope:

### If code < 50 lines OR "unit test"
→ **Generate xUnit tests** (happy + edge cases + null + exceptions)

### If code > 200 lines OR "full suite/complete"
→ **Complete test file** (unit + integration + boundary)

### If "coverage/gaps/what's not tested"
→ **Gap analysis** (identify untested branches + 5 complete test cases)

### Otherwise
→ Ask: "Is this [single class] or [complete suite] or [coverage gaps]?"

---

## How `/db` Works (Database Fast-Path)

Routes based on content type:

### If has stored procedure or SQL query
→ **Optimize SQL** (SET NOCOUNT, cursors→sets, indexes, SARGable WHERE)

### If has existing schema (CREATE TABLE)
→ **Schema review** (normalization, indexes, constraints, naming)

### If feature description (no schema)
→ **Schema design from scratch** (tables, relationships, indexes)

### Otherwise
→ Ask: "Is this [SQL optimization] or [schema review] or [new design]?"

---

## Requirements Chain: Full Workflow

### Phase 1: `/requirements-to-specs`

Convert plain-language requirement → technical spec

**Input**: "As a customer, I want to reset my password via email, so I can regain access"

**Output**:
- **REQ-F-001, REQ-F-002, ...** (Functional requirements)
- **REQ-NF-001, REQ-NF-002, ...** (Performance, security, scalability, availability)
- **API Contracts** (POST /api/v1/auth/reset-password)
- **Database Entities** (PasswordResetToken table)
- **Design Implications** (Which rules apply? JWT? OAuth?)
- **Open Questions** (Token expiry: 1hr or 24hr?)
- **HANDOFF BLOCK** (For Phase 2)

### Phase 2: `/acceptance-criteria`

Convert tech spec → Gherkin acceptance criteria

**Input**: HANDOFF BLOCK from Phase 1 (or same requirement)

**Output**:
- **AC-HP-001**: Given user on login page, When enters reset request, Then reset email sent
- **AC-ALT-001**: Given invalid email, When reset requested, Then error message shown
- **AC-EDGE-001**: Given rate limit (5 resets/hour), When exceeded, Then user blocked
- **AC-ERR-001**: Given email service down, When reset requested, Then graceful error
- **Test Case Table** (inputs, expected outputs, actual vs. expected)
- **HANDOFF BLOCK** (For Phase 3)

### Phase 3: `/risk-assessment`

Assess feasibility and identify risks

**Input**: HANDOFF BLOCK from Phase 2

**Output**:
- **Risk Tier**: Low / Medium / High / Critical
- **Risk Register**:
  | Risk ID | Description | Likelihood | Impact | Score | Mitigation |
  | RISK-001 | Email service integration unknown | M | H | 6 | Spike: test with SendGrid sandbox |
  
- **Go/No-Go Decision**: GO with conditions, or NO-GO (spike needed)
- **HANDOFF BLOCK** (For Phase 4)

### Phase 4: `/requirements-review`

Quality audit across 5 dimensions

**Input**: HANDOFF BLOCK from Phase 3

**Output**:
- **Completeness**: ✅ All 6 dimensions covered (functional, NFR, edge cases, errors, security, performance)
- **Clarity**: ✅ No ambiguous words, all measurable
- **Testability**: ✅ All AC criteria testable
- **Consistency**: ✅ No contradictions
- **Traceability**: ✅ Each REQ has unique ID
- **FINAL VERDICT**: 
  - ✅ **READY** → copy HANDOFF BLOCK and run `/api-endpoint` to scaffold implementation
  - ⚠️ **NEEDS REVISION** → return to `/requirements-to-specs` with corrections
  - ❌ **BLOCKED** → return to Product Owner with Open Blockers

---

## Context Carry-Over: HANDOFF BLOCKS

Each requirements phase outputs a **HANDOFF BLOCK** — ~100 tokens of structured summary:

```
---
## HANDOFF BLOCK — Phase 1: Requirements to Specs
**Requirement**: [original requirement, one line]
**REQ-F IDs**: REQ-F-001, REQ-F-002
**REQ-NF IDs**: REQ-NF-001, REQ-NF-002
**Tech Stack Decisions**: JWT auth, Dapper, Angular 17 standalone
**API Contracts**: POST /api/v1/auth/reset-password
**AC IDs**: pending Phase 2
**Risk Tier**: pending Phase 3
**Risk IDs**: pending Phase 3
**Go/No-Go**: pending Phase 3
**Review Verdict**: pending Phase 4
**Open Blockers**: Email service integration approach
---
```

**How to use**: Copy this block and paste it as context when running the next phase. Agent reads `PRIOR CONTEXT` section, extracts fields, continues numbering, carries decisions forward.

---

## Tiebreaker Examples

### Example 1: "test this SQL query"
- Keywords match: **Testing** (test) + **Database** (SQL query)
- Tiebreaker: Database > Testing
- Route: **`/db`** → `/optimize-sql`

### Example 2: "security review of auth middleware"
- Keywords match: **Security** (security review) + **Code Review** (review)
- Tiebreaker: Security > Code Review
- Route: **`/sec`** → `/security-agent`

### Example 3: "refactor this payment service for performance"
- Keywords match: **Refactoring** (refactor) + **Performance** (performance)
- Tiebreaker: Performance > Refactoring
- Route: **`/pp`** → `/perf-optimize`

### Example 4: "unclear request like 'help with this'"
- No strong keyword match
- Route: Ask clarifying question → "Is this code review, security, testing, or refactoring?"

---

## When to Use Each Mode

### Use `/pp` When:
- Request is open-ended ("What should I do with this code?")
- You want automatic routing
- Request spans multiple concerns
- You're unsure which command applies

### Use `/quick` When:
- You know exactly what you need (fix, test, review)
- Want fastest possible execution
- Don't want planning or explanations
- Simple, focused task

### Use `/sec` When:
- Security is the primary concern
- Want quick scan OR full audit + fixes
- Architecture design or compliance
- Let routing decide between them

### Use `/test` When:
- Testing is primary concern
- Want unit tests OR full suite OR gap analysis
- Let routing decide between them

### Use `/db` When:
- Database is primary concern
- Want SQL optimization OR schema review OR design
- Let routing decide between them

### Use `/pp-requirements` When:
- Starting from business requirement
- Want complete spec → criteria → risk → review
- Need full 4-phase chain
- Want auto-cascade to next phase

---

## Common Workflows

### Workflow 1: Quick Security Fix
```
/sec
  ↓ [Code selected, "fix these vulnerabilities"]
  ↓ Full OWASP audit + exact fix code per issue
  ↓ Done
```

### Workflow 2: Full Requirements Spec
```
/pp-requirements
  ↓ [Business requirement pasted]
  ↓ Phase 1: REQ-F/REQ-NF + spec + HANDOFF BLOCK 1
  ↓ Phase 2: Gherkin AC + test cases + HANDOFF BLOCK 2
  ↓ Phase 3: Risk register + Go/No-Go + HANDOFF BLOCK 3
  ↓ Phase 4: Quality audit + FINAL VERDICT
  ↓ Ready to implement!
```

### Workflow 3: Manual Phase Progression
```
/requirements-to-specs [requirement]
  ↓ Copy HANDOFF BLOCK 1
  ↓ /acceptance-criteria [paste HANDOFF BLOCK 1]
  ↓ Copy HANDOFF BLOCK 2
  ↓ /risk-assessment [paste HANDOFF BLOCK 2]
  ↓ Copy HANDOFF BLOCK 3
  ↓ /requirements-review [paste HANDOFF BLOCK 3]
  ↓ Done!
```

### Workflow 4: Code Review → Refactor
```
/pp [select code: "review this"]
  ↓ Issues found
  ↓ Suggests: "Next: run /refactor-large for multi-step refactoring plan"
  ↓ /refactor-large [same code]
  ↓ Step-by-step refactoring plan delivered
```

### Workflow 5: Project Analysis → Onboarding (NEW in v3.5.0)
```
/master-prompt [on project root]
  ↓ Comprehensive project analysis
  ↓ Tech stack inventory + code standards audit
  ↓ Top 10 PowerPlay commands ranked by impact
  ↓ Improvement roadmap (30/90/180 days)

/learn [same project]
  ↓ Workspace conventions + SmartWorkz pattern detection
  ↓ Top 5 PowerPlay commands for this project
  ↓ WORKSPACE CONTEXT block (emitted for /pp calls to reference)
```

### Workflow 6: Tech Stack Builder (NEW in v3.5.0)
```
/builder [or /wizard or /stack]
  ↓ Interactive HTML form opens
  ↓ Select: Project basics, tech stack, code standards, patterns, compliance
  ↓ Auto-generate master prompt markdown
  ↓ Copy to clipboard / Download / Use as context
```

---

## Master Prompts (v3.5.0+)

Master prompts are comprehensive project analysis tools. Each has multiple aliases for easy discovery.

### `/master-prompt` — Full Project Analysis

**Aliases**: `/project`, `/scan`, `/inventory`, `/profile`, `/assessment`

**Input**: Project root or codebase selection

**Output**:
1. **Project Analysis** — Name, type, industry, scale, criticality, team
2. **Tech Stack Inventory** — Backend (runtime, framework, ORM, database), Frontend, Infrastructure, Data
3. **Code Standards Detection** — async/CancellationToken, ILogger<T>, FluentValidation, DevExtreme, WCAG, test coverage
4. **Architecture Patterns** — Layering, messaging, scaling, data flow, deployment
5. **Compliance & Security Posture** — SOC 2, HIPAA, PCI-DSS, GDPR requirements
6. **PowerPlay Fit Analysis** — Top 10 commands ranked by daily/weekly/rarely usage
7. **Improvement Roadmap** — 30/90/180-day priorities
8. **Master Rules** — Project-specific rules and constraints

**Use When**: Starting new project work, onboarding, assessing code quality, planning improvements

---

### `/master-prompt-builder` — Interactive Tech Stack Builder

**Aliases**: `/builder`, `/stack`, `/wizard`

**Input**: None (generates interactive HTML form)

**Output**: Interactive form with sections:
- Project Basics (name, description, industry)
- Tech Stack (backend, frontend, infrastructure, data)
- Code Standards (FluentValidation, ILogger<T>, async/CancellationToken, C# 12, etc.)
- Architecture Patterns (Repository, Service Layer, CQRS, Event-Driven, etc.)
- Compliance & Security (SOC 2, HIPAA, PCI-DSS, GDPR)

**Features**:
- Dynamic master prompt generation as you select options
- Copy to clipboard
- Export to markdown
- Download as `.md` file
- Self-contained HTML (no external dependencies)

**Use When**: Building project master prompt interactively, exploring tech stack options

---

### `/learn` — Workspace Analysis & Conventions

**Aliases**: `/analyze`, `/context`, `/onboard`, `/audit`, `/discover`, `/patterns`

**Input**: Project root or codebase selection

**Output**:
1. **Standard Conventions** — Naming, folder structure, patterns, error handling, testing, architecture
2. **SmartWorkz Pattern Detection** — DevExtreme, Dapper vs EF Core, Angular inject(), ILogger<T>, sw-BEM CSS, async/CancellationToken, FluentValidation, C# 12 primary constructors
3. **PowerPlay Fit Analysis** — Top 5 most relevant PowerPlay commands for THIS project
4. **WORKSPACE CONTEXT Block** — Structured summary (Stack, ORM, CSS Convention, Injection, Logging, Tests, CancellationToken, DevExtreme, C# Version, Top 5 Commands)

**Features**:
- Emits WORKSPACE CONTEXT block at end (future `/pp` calls can reference this)
- Saves to `docs/WORKSPACE_CONVENTIONS.md` (appends new sections if file exists)
- Update-friendly (prepends new date-stamped sections)

**Use When**: Onboarding new developers, auditing conventions, setting up workspace context

---

### `/requirement` — Full Requirements Chain (Alias for `/pp-requirements`)

**Aliases**: `/spec`, `/specs`, `/rfc`, `/requirements`

**Input**: Business requirement (plain language)

**Output**: Complete 4-phase requirements package:

1. **Phase 1: Specs** — REQ-F/REQ-NF + API contracts + database entities + design implications + open questions + HANDOFF BLOCK
2. **Phase 2: Criteria** — Gherkin Given/When/Then + test cases + HANDOFF BLOCK
3. **Phase 3: Risk** — Risk register + feasibility + Go/No-Go decision + HANDOFF BLOCK
4. **Phase 4: Review** — Quality audit across 5 dimensions (completeness, clarity, testability, consistency, traceability) + FINAL VERDICT

**Features**:
- Auto-cascade: Each phase automatically suggests next phase
- HANDOFF BLOCKs carry context forward
- Copyable blocks for manual progression

**Use When**: Converting business requirements to technical specs, creating acceptance criteria, assessing risk

---

### `/deep` — Deep Code Explanation

**Aliases**: `/dive`, `/explain`, `/understand`

**Input**: Code selection

**Output**: Structured explanation:
1. **Problem** — What is this code solving?
2. **Logic** — How does it work? (step-by-step)
3. **Design Decisions** — Why this approach? (alternatives + tradeoffs)
4. **Failure Modes** — What can go wrong?
5. **Edge Cases** — When does it break?

**Use When**: Understanding complex code, preparing code review comments, documenting design decisions

---

### `/doc` — Add XML Documentation

**Aliases**: `/docs`, `/document`, `/xml`

**Input**: Code selection

**Output**: Code with XML documentation:
- `<summary>` — one-line description
- `<param>` — parameter descriptions
- `<returns>` — return value description
- `<exception>` — thrown exceptions
- `<remarks>` — additional notes
- `<example>` — usage examples (for utilities)

**Use When**: Adding documentation to public APIs, preparing for code review, improving code discoverability

---

## Alias Quick Reference

**Documentation**: `/doc` → `/docs`, `/document`, `/xml` (4 total)
**Deep Explanation**: `/deep` → `/dive`, `/explain`, `/understand` (4 total)
**Workspace Analysis**: `/learn` → `/analyze`, `/context`, `/onboard`, `/audit`, `/discover`, `/patterns` (7 total)
**Requirements**: `/requirement` → `/spec`, `/specs`, `/rfc`, `/requirements` (5 total)
**Project Analysis**: `/master-prompt` → `/project`, `/scan`, `/inventory`, `/profile`, `/assessment` (6 total)
**Tech Stack Builder**: `/master-prompt-builder` → `/builder`, `/stack`, `/wizard` (4 total)

**Total**: 6 core master prompts + 23 aliases = **29 entry points**

---

## Fallback & Error Handling

### If request matches no category:
```
/pp will respond:

"I specialise in software engineering tasks — code review, security, testing, 
refactoring, requirements, database, cloud, and architecture. 
Could you rephrase your request in one of those areas?"
```

### If `/pp` Step 2 still has ambiguity after tiebreaker:
```
"Is this [Category A: use /command1] or [Category B: use /command2]?"
Waits for user clarification before proceeding.
```

### If intent is unclear in `/quick`, `/sec`, `/test`, `/db`:
Each asks ONE clarifying question (max), never assumes.

---

## Tips & Tricks

### Tip 1: Use Code Selection
Select the code you want analyzed when using `/pp`, `/quick`, `/sec`, `/test`:
- Selected code < 100 lines → Quick variant
- Selected code > 100 lines → Full variant

### Tip 2: Combine with @mentions
```
/pp @file
@codebase

This function looks wrong
```
Provides context without pasting code.

### Tip 3: Chain Commands
After `/pp` finishes, it suggests follow-up:
```
**Next**: run `/refactor-large` to plan multi-step refactoring. Select code and type it.
```

### Tip 4: Carry HANDOFF BLOCKs
Each requirements phase gives you a HANDOFF BLOCK. Copy it for next phase:
```
/acceptance-criteria [paste HANDOFF BLOCK from Phase 1]
```
Agent reads PRIOR CONTEXT, continues numbering, preserves decisions.

### Tip 5: Force Scope
Explicitly say "quick" or "full":
- `/pp quick` → Always use Quick Command
- `/pp full` → Always use Full Command

---

## Version History

| Version | Changes |
|---------|---------|
| **v3.5.0** | Command consolidation (92 → 40 via internal routing) + 6 master prompts + 23 aliases for project analysis, workspace conventions, tech stack discovery |
| **v3.4.0** | Machine Learning (ML) + Business Intelligence (BI) domains (5 ML + 5 BI + 2 orchestrators) |
| **v3.3.0** | Domain shortcuts `/api /arch /deploy /data /frontend` for discoverability |
| **v3.2.0** | Tiebreaker rule, orphaned commands routing, fallback clause, auto-cascade NEXT PHASE |
| **v3.1.0** | Shared memory orchestrator for requirements phases, mega-agent `/pp-requirements` |
| **v3.0.0** | Requirements phase agents (specs → criteria → risk → review) |
| **v2.9.0** | Master orchestrator `/pp`, fast-path routers `/quick /sec /test /db`, decision trees |
| **v2.8.0** | AI behavior rules (honesty, adaptive reasoning, session context) |

---

**Last Updated**: 2026-04-10 | **PowerPlay v3.5.0**
