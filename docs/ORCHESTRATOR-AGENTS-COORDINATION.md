# PowerPlay Orchestrator & Agents Coordination Map

**Overview**: How `/play` orchestrator routes to agents, skills, and rules based on user intent

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    USER REQUEST (Plain English)                │
│  "Add order management with payment retry and audit logging"   │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│          /play ORCHESTRATOR (Step 1: CLASSIFY)                 │
│                                                                 │
│  Keywords detected: "order", "payment retry", "audit logging"  │
│  Primary: Requirements (full scope)                            │
│  Secondary: Testing, Database, Patterns                        │
│  Routing Decision: /pp-requirements (full chain)               │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  /pp-requirements AGENT (4-Phase Requirements Chain)           │
│                                                                 │
│  Phase 1: PARSE                                                │
│    → REQ-F-001: Create order                                   │
│    → REQ-NF-001: Audit log (immutable)                         │
│    → REQ-T-001: .NET 8, SQL Server                             │
│                                                                 │
│  Phase 2: GHERKIN CRITERIA                                     │
│    → AC-HP-001: Create order successfully                      │
│    → AC-ERR-001: Payment retry on failure                      │
│    → AC-ERR-002: DLQ after 3 retries                           │
│                                                                 │
│  Phase 3: RISK REGISTER                                        │
│    → Payment service unavailable (Medium/High)                 │
│    → Network timeout (Medium/High)                             │
│    → Concurrency race (Low/Medium)                             │
│                                                                 │
│  Phase 4: QUALITY AUDIT                                        │
│    → Completeness: ✅                                          │
│    → Testability: ✅                                           │
│    → Status: READY FOR DESIGN                                  │
│                                                                 │
│  OUTPUT: Handoff block with all 4 phases                       │
└────────────────┬───────────────────────────────────────────────┘
                 │
         ✋ APPROVAL GATE 1
         User: "Yes, approve"
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  /play ORCHESTRATOR (Step 4: EXECUTE Design Phase)             │
│                                                                 │
│  Pattern Detection → Keywords: "payment", "audit", "status"    │
│  Detected Patterns:                                            │
│    • State Pattern (status: Pending → Paid → Shipped)          │
│    • Saga Pattern (order → payment → inventory)                │
│    • Event Sourcing (audit log)                                │
│    • Point-to-Point Messaging (payment queue + DLQ)            │
│    • Idempotency (safe retries)                                │
│                                                                 │
│  Route Decision: /arch (architecture design)                   │
└────────────────┬───────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  /arch AGENT (Architecture Design)                             │
│                                                                 │
│  Scope: Feature architecture (not just review)                 │
│  Output:                                                        │
│    • ASCII layer diagram (API → Service → Repo → DB)           │
│    • Design pattern applications:                              │
│      - State Pattern: Order status transitions                 │
│      - Saga Pattern: Order → Payment → Inventory flow          │
│      - Event Sourcing: Audit log structure                     │
│    • Database schema (4 tables: Orders, Audit, Keys, DLQ)      │
│    • Dependency flow (domain → repos → services → API)         │
│                                                                 │
│  References:                                                    │
│    • /design-patterns-guide (State pattern details)            │
│    • /saga-pattern (orchestration vs choreography)             │
│    • /event-sourcing (event log structure)                     │
└────────────────┬───────────────────────────────────────────────┘
                 │
         ✋ APPROVAL GATE 2
         User: "Yes, approve"
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  PLAN AGENT (Implementation Planning)                          │
│                                                                 │
│  Input: Design from /arch                                      │
│  Output: 7-step implementation plan                            │
│                                                                 │
│  Step 1: Database schema (migrations)                          │
│  Step 2: Domain model + State pattern                          │
│  Step 3: Repositories (Dapper)                                 │
│  Step 4: Services (PaymentService with idempotency)            │
│  Step 5: API controller                                        │
│  Step 6: Dependency injection                                  │
│  Step 7: Comprehensive tests                                   │
│                                                                 │
│  Effort: 16-22 hours                                           │
│  Files: 15+                                                     │
│  Risks: Identified & mitigated                                 │
│                                                                 │
│  References:                                                    │
│    • /idempotency (safe payment retries)                       │
│    • /dead-letter-queue (payment failure handling)             │
│    • /state-pattern (order status implementation)              │
│    • /event-sourcing (audit log implementation)                │
└────────────────┬───────────────────────────────────────────────┘
                 │
         ✋ APPROVAL GATE 3
         User: "Yes, approve"
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  CODE GENERATION AGENT (Execute Implementation)                │
│                                                                 │
│  Step 1: Create database migrations ✅                         │
│          File: Migrations/001_CreateOrderTables.sql            │
│          File: Migrations/002_CreateAuditLog.sql               │
│          File: Migrations/003_CreateIdempotencyKeys.sql        │
│          File: Migrations/004_CreateDLQ.sql                    │
│                                                                 │
│  Step 2: Create domain model ✅                                │
│          File: Domain/Order.cs                                 │
│          File: Domain/OrderState.cs                            │
│          File: Domain/DomainEvents.cs                          │
│          Pattern Reference: State Pattern docs                 │
│                                                                 │
│  Step 3: Create repositories ✅                                │
│          File: Repositories/OrderRepository.cs (Dapper)        │
│          File: Repositories/AuditLogRepository.cs              │
│          File: Repositories/IdempotencyKeyRepository.cs        │
│                                                                 │
│  Step 4: Create services ✅                                    │
│          File: Services/OrderService.cs                        │
│          File: Services/PaymentService.cs                      │
│            ├─ Idempotency check before payment                 │
│            ├─ Retry logic (exponential backoff)                │
│            └─ DLQ publishing on failure                        │
│          Pattern Reference: /idempotency, /dead-letter-queue   │
│                                                                 │
│  Step 5: Create API controller ✅                              │
│          File: Controllers/OrdersController.cs                 │
│          File: DTOs/CreateOrderRequest.cs                      │
│          Validation: FluentValidation                          │
│                                                                 │
│  Step 6: Wire up DI ✅                                         │
│          File: Program.cs (DI registration)                    │
│                                                                 │
│  Step 7: Create tests ✅                                       │
│          File: Tests/OrderServiceTests.cs                      │
│          File: Tests/PaymentServiceTests.cs                    │
│          Test cases: Happy path, state transitions,            │
│                      retry/idempotency, DLQ, audit log         │
│          Coverage: 87%                                         │
│                                                                 │
│  All 15+ files generated with:                                 │
│    • XML documentation                                         │
│    • Error handling                                            │
│    • Structured logging                                        │
│    • Inline comments referencing patterns                      │
└────────────────┬───────────────────────────────────────────────┘
                 │
         ✋ APPROVAL GATE 4
         User: "Yes, implementation complete"
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  TEST ORCHESTRATOR (Quality Validation)                        │
│                                                                 │
│  Unit Tests: 35 tests ✅                                       │
│    • OrderServiceTests (12 tests)                              │
│    • PaymentServiceTests (15 tests)                            │
│      - Happy path (customer pays)                              │
│      - Idempotency (same key = cached result)                  │
│      - Retry (fail once, succeed 2nd time)                     │
│      - DLQ (fail 3x → goes to DLQ)                             │
│    • OrderControllerTests (8 tests)                            │
│                                                                 │
│  Code Quality: 0 issues ✅                                     │
│    • Code review: No High/Critical issues                      │
│    • Security scan: 0 OWASP violations                         │
│    • Test coverage: 87% (target > 80%)                         │
│                                                                 │
│  Integration: E2E scenarios ✅                                 │
│    • Create → Pay → Ship → Deliver                            │
│    • Payment failure → DLQ → manual replay                     │
│    • Audit log verification (all events present)               │
│                                                                 │
│  Database: Migrations ✅                                       │
│    • Apply without errors                                      │
│    • Rollback verified                                         │
│    • Schema validated                                          │
└────────────────┬───────────────────────────────────────────────┘
                 │
         ✋ APPROVAL GATE 5
         User: "Yes, tests passed"
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│  RELEASE ORCHESTRATOR (Go-live)                                │
│                                                                 │
│  Versioning: v1.0.0 (semantic)                                 │
│  Changelog: Generated (features, fixes, breaking)              │
│  Git: PR created → Reviewed → Approved → Merged to main        │
│  Deployment: Blue-green with canary                            │
│    • 5% traffic → 25% → 50% → 100% (monitoring SLOs)          │
│  Feature Flags: Kill switch enabled                            │
│  Monitoring: SLO dashboard, DLQ alerts, audit log              │
│  Documentation: Wiki, API docs                                 │
│  Team: Notification, user guide, on-call ready                │
│                                                                 │
│  References:                                                    │
│    • /deploy (deployment strategy)                             │
│    • /feature-flags-rules (kill switches)                      │
│    • /monitoring-alerting-rules (SLO tracking)                 │
│    • /incident-management-rules (on-call)                      │
└────────────────┬───────────────────────────────────────────────┘
                 │
         ✋ APPROVAL GATE 6
         User: "Yes, release"
                 │
                 ▼
         🚀 FEATURE LIVE IN PRODUCTION
            Monitoring active ✅
```

---

## Agent Routing Reference

### When User Says → Orchestrator Routes → Primary Agent → Secondary Skills

| User Intent | Orchestrator Routes | Primary Agent | Secondary Skills |
|---|---|---|---|
| "add feature..." | /play → /pp-requirements | Requirements Agent | /pp-requirements (4-phase chain) |
| "how should I design..." | /play → /arch | Architecture Agent | /design-patterns-guide, /saga-pattern, /event-sourcing |
| "create order with complex params" | /play → /arch | Architecture Agent | /builder-pattern, /composite-pattern |
| "payment with retries" | /play → /saga-pattern | Saga Agent | /idempotency, /dead-letter-queue, /point-to-point-messaging |
| "safe distributed transaction" | /play → /choreography-vs-orchestration | Decision Framework | /saga-pattern, /eventual-consistency |
| "cache strategy" | /play → /proxy-pattern | Proxy Agent | /eventual-consistency, /monitoring-alerting-rules |
| "audit trail" | /play → /event-sourcing | Event Sourcing Agent | /pub-sub-messaging, /choreography-vs-orchestration |
| "implement X pattern" | /play → /design-patterns-guide | Pattern Reference | [relevant pattern rule] |
| "test this" | /play → /generate-tests-complete | Test Agent | /coverage-gaps, /performance-check |
| "security review" | /play → /security-scan | Security Agent | /zero-trust-design, /incident-response |

---

## Approval Gate Flow

### Each Phase Requires Explicit User Approval

```
Phase → Agent Executes → Output Generated → ✋ GATE: Proceed? 
                                                     ├─ Yes → Next Phase
                                                     ├─ No → Revise Current Phase
                                                     └─ Questions → Clarify Current Phase
```

### Phase Sequence

| Phase | Agent | Output | Gate Decision |
|-------|-------|--------|---|
| 1 | Requirements | REQ, AC, Risk, Audit | Approve requirements? |
| 2 | Design | Architecture, patterns, schema | Approve design? |
| 3 | Plan | Steps, effort, risks, files | Approve plan? |
| 4 | Execute | Code, 15+ files, ~1500 LOC | Implementation complete? |
| 5 | Test | 35 tests, 87% coverage, 0 issues | Tests passed? |
| 6 | Release | v1.0.0, deployment, monitoring | Release? |

---

## Pattern-to-Skill Mapping

### Design Patterns

```
/design-patterns-guide
├─ Creational: Singleton, Factory, Builder, Abstract Factory, Prototype, Object Pool
├─ Structural: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
└─ Behavioral: Chain, Command, Iterator, Mediator, Memento, State, Template, Visitor, etc.

Individual Pattern Rules:
├─ /builder-pattern (fluent construction)
├─ /composite-pattern (tree structures)
├─ /decorator-pattern (dynamic behavior)
├─ /proxy-pattern (lazy loading, caching, auth)
└─ /state-pattern (state machines)
```

### Messaging Patterns

```
/saga-pattern
├─ Orchestration (central coordinator)
└─ Choreography (event-driven)

/pub-sub-messaging (broadcast)
/point-to-point-messaging (work queues)
/request-reply-messaging (sync over async)
/eventual-consistency (stale data acceptance)

Support Patterns:
├─ /idempotency (safe retries)
├─ /dead-letter-queue (failure handling)
└─ /event-sourcing (audit trails)
```

### Distributed System Patterns

```
/choreography-vs-orchestration
├─ Decision matrix (sync vs async, tight vs loose coupling)
├─ Use orchestration for: Simple workflows (< 5 services)
└─ Use choreography for: Complex, loosely-coupled systems

/event-sourcing (event log as source of truth)
└─ Supports: Audit trails, time-travel queries, replay capability
```

---

## Quality Checkpoints

### At Each Gate

| Gate | Checks | Approval Required |
|------|--------|---|
| **After Requirement** | Functional completeness, non-functional coverage, risk identification, testability | User acknowledges all AC are testable |
| **After Design** | Architecture clarity, pattern applicability, schema correctness, layer separation | User agrees with design & patterns |
| **After Plan** | Step ordering, effort estimate, risk assessment, file structure | User accepts timeline & approach |
| **After Execute** | Code compiles, no TODOs, comments present, error handling, logging | User code review complete |
| **After Test** | 100% pass rate, > 80% coverage, 0 High/Critical issues, E2E passing | User runs tests locally & verifies |
| **After Release** | Deployed, monitoring active, kill switch ready, team notified | User confirms live & stable |

---

## No Phase Proceeds Without Approval

**Key principle**: Each phase explicitly asks for approval before proceeding.

```
Requirement (draft) ✅ 
         ↓ ✋ Gate: Approve? 
Requirement (approved) ✅
         ↓
Design (draft) ✅
         ↓ ✋ Gate: Approve?
Design (approved) ✅
         ↓
Plan (draft) ✅
         ↓ ✋ Gate: Approve?
Plan (approved) ✅
         ↓
... and so on
```

**If user says "No"**: Phase repeats with revisions before re-submitting for approval.

**If user says "Questions"**: Agent clarifies before re-submitting.

---

## Summary

PowerPlay's orchestrator ecosystem ensures:

✅ **Clear routing** — Plain English → Relevant agent/skill
✅ **Intelligent pattern detection** — Automatically identifies which patterns apply
✅ **Approval gates** — No phase proceeds without user sign-off
✅ **Quality checkpoints** — Requirements → Design → Plan → Execute → Test → Release
✅ **Agent coordination** — Requirements agent → Design agent → Plan agent → Code agent → Test agent → Release agent
✅ **Skill integration** — Each agent uses relevant PowerPlay skills (patterns, deployment, testing, etc.)
✅ **User agency** — User can question, approve, or request changes at each phase

**Result**: Feature delivery with high quality, clear documentation, pattern application, and user oversight.
