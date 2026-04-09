# PowerPlay v3.1.0 — Shared Memory & Cross-Agent Context

**Version**: 3.1.0  
**Release Date**: 2026-04-09  
**Focus**: Shared Memory Orchestrator for Persistent Context Across Agents  
**Rules**: 1 | **Prompts**: 1 | **Total Coverage**: 62 rules, 86 prompts

---

## 💾 What's New in v3.1.0

v3.1.0 introduces **shared memory orchestration** — allowing /pp-requirements mega-agent and other multi-phase orchestrators to maintain context across sequential agent calls via HANDOFF BLOCKS and memory files.

### New Feature

| Feature | Purpose |
|---------|---------|
| **Shared Memory Orchestrator** | Maintains state across sequential agents (requirements chain, architecture design chain, etc.) |

### How It Works

**Problem**: When Phase 1 → Phase 2 → Phase 3 → Phase 4, each agent restarts without context from prior phases.

**Solution**: HANDOFF BLOCKS that pass complete output from phase N to phase N+1:

```
Phase 1 Output:
  - Functional specs
  - Non-functional specs
  - Technical design

        ↓ HANDOFF

Phase 2 Input (auto-prefixed):
  "Here's the context from Phase 1. Now convert to Gherkin..."
  [Full Phase 1 output embedded]

        ↓ [Phase 2 executes with context]

Phase 2 Output:
  - Acceptance criteria (Gherkin)

        ↓ HANDOFF

Phase 3 Input:
  "Here's context from Phases 1-2. Now assess risks..."
  [Phases 1-2 output embedded]

        ↓ [Phase 3 executes with context]

... (continues through Phase 4)
```

### Memory File Structure

```
.claude/memory/
├── requirements-chain-{sessionId}.md
│   ├── Phase 1: Specs (timestamp, status)
│   ├── Phase 2: Criteria (timestamp, status)
│   ├── Phase 3: Risk (timestamp, status)
│   └── Phase 4: Review (timestamp, status)
│
├── architecture-chain-{sessionId}.md
│   ├── Phase 1: Feature Design
│   ├── Phase 2: Component Design
│   ├── Phase 3: Database Schema
│   └── Phase 4: Deployment Plan
│
└── (other multi-phase chains)
```

---

## 🔄 HANDOFF BLOCK Format

Each phase produces a HANDOFF BLOCK:

```markdown
# ── HANDOFF: Phase N → Phase N+1 ──────────────────

## Summary of Phase N

[Full output from Phase N]

---

## Input for Phase N+1

[Instructions for next phase, with Phase N output as context]
```

**Benefits**:
- Phase N+1 knows exactly what Phase N produced
- No information loss between agents
- Clear "ready to proceed" signal
- Human-readable context trail

---

## 📋 Example: Requirements Chain with Handoffs

### Call 1: Phase 1 (Specs)
```
/pp-requirements phase:1 "Users upload profile pictures with crop/rotate/filters"

Output:
# ── HANDOFF: Phase 1 → Phase 2 ──────────────────

## Summary of Phase 1 (Requirements → Specs)

**Functional Specs**:
[5 functional specs listed]

**Non-Functional**:
[3 non-functional specs listed]

**Technical Design**:
[Tech stack, architecture]

---
## Input for Phase 2

[Auto-generated prompt for Phase 2 Agent]
```

### Call 2: Phase 2 (Criteria)
```
/pp-requirements phase:2 [paste HANDOFF BLOCK from Phase 1]

Output:
[Gherkin acceptance criteria using Phase 1 context]

# ── HANDOFF: Phase 2 → Phase 3 ──────────────────
[Criteria + Phase 1 summary]
```

### Call 3: Phase 3 (Risk)
```
/pp-requirements phase:3 [paste HANDOFF BLOCK from Phase 2]

Output:
[Risk register + mitigations]

# ── HANDOFF: Phase 3 → Phase 4 ──────────────────
[Risk + Phases 1-2 summary]
```

### Call 4: Phase 4 (Review)
```
/pp-requirements phase:4 [paste HANDOFF BLOCK from Phase 3]

Output:
[Quality review + approval]
```

---

## 🎯 Applicability to Other Chains

This pattern works for any multi-phase orchestrator:

**Architecture Design Chain**:
1. Feature design (HANDOFF) →
2. Component design (HANDOFF) →
3. Database schema (HANDOFF) →
4. Deployment plan

**API Development Chain**:
1. Endpoint spec (HANDOFF) →
2. Data model (HANDOFF) →
3. Error handling (HANDOFF) →
4. Documentation

**Security Assessment Chain**:
1. Threat model (HANDOFF) →
2. Vulnerability scan (HANDOFF) →
3. Remediation plan (HANDOFF) →
4. Compliance audit

---

## 💡 Key Patterns

### Pattern 1: Linear Chain
```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Output
```
**Use for**: Requirements, architecture, security assessments

### Pattern 2: Conditional Chain
```
Phase 1 → Phase 2 → [if high-risk] Phase 3 → Phase 4
```
**Use for**: Risk-driven workflows (skip low-risk phases)

### Pattern 3: Parallel Chains with Convergence
```
Requirements Chain (4 phases) ──┐
Arch Design Chain (4 phases) ───→ Integration Review
API Design Chain (4 phases) ─────┘
```
**Use for**: Large feature planning (sync requirements + architecture + APIs)

---

## 🏆 Benefits

✅ **Zero Context Loss**: Full Phase N output available to Phase N+1  
✅ **Human Checkpoints**: User can review & approve each phase before proceeding  
✅ **Flexible Pacing**: Do phases in same session or different sessions  
✅ **Audit Trail**: Each HANDOFF block is reviewable and timestamped  
✅ **Reusable Chains**: Same pattern applies to any multi-phase workflow  

---

## 📊 Supported Chains in v3.1.0

| Chain | Phases | Primary Use |
|-------|--------|-------------|
| Requirements | 4 | Specification → Approval |
| (Planned) Architecture | 4 | Feature Design → Deployment |
| (Planned) API | 4 | Contract → Documentation |
| (Planned) Security | 4 | Threat → Audit |

---

**Version**: 3.1.0  
**Released**: 2026-04-09  
**Status**: ✅ Complete

**Next**: v3.2.0 (Orchestrator hardening)
