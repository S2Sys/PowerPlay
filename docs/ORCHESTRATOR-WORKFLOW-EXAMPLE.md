# PowerPlay Orchestrator Workflow — Complete Example with Approval Gates

**Scenario**: User wants to add a new "Order Management" feature
**Workflow**: Requirement → Design → Plan → Execute → Test → Release
**Approval Gates**: At each phase, orchestrator/planner asks for approval before proceeding

---

## Phase 0: INITIAL REQUEST

### User Input
```
"Add an order management system. Orders can be created, paid, shipped, 
and delivered. Need to track status changes, handle payment failures with retries, 
and maintain an audit log for compliance."
```

---

## Phase 1: REQUIREMENT ANALYSIS (Orchestrator)

### What Happens

Orchestrator (via `/play` or `/pp-requirements`) classifies the request:

1. **CLASSIFY** (Step 1 in `/play`)
   - Keywords: "order management system", "status changes", "audit log", "payment failures"
   - Primary intent: **Requirements** (full scope)
   - Secondary intents: **Testing** (audit log), **Database** (status tracking)
   - Tiebreaker: Requirements wins (explicitly mentioned "system" with phases)

2. **SELECT** (Step 2)
   - Scope: **FULL** (user said "system", implies complete requirements)
   - Primary command: `/pp-requirements` (full 4-phase requirements chain)

3. **PLAN** (Step 3)
   - One sentence: "I'll parse functional/non-functional requirements, generate acceptance criteria in Gherkin format, identify risks, and produce a quality audit for approval."

### Orchestrator/Planner Executes `/pp-requirements`

**Phase 1 — PARSE Requirements**

```
# REQUIREMENT HANDOFF BLOCK 1

## Functional Requirements
- REQ-F-001: Create order with items, customer, total
- REQ-F-002: Set order status (Pending → Paid → Shipped → Delivered)
- REQ-F-003: Process payment with automatic retry on failure
- REQ-F-004: Track order status changes (audit log)
- REQ-F-005: Retrieve order by ID with full history

## Non-Functional Requirements
- REQ-NF-001: Audit log must be immutable (compliance)
- REQ-NF-002: Payment retries use exponential backoff (1s, 2s, 4s, max 3 attempts)
- REQ-NF-003: Order creation response time < 500ms
- REQ-NF-004: Payment processing SLA: 99.9% success rate

## Technology Constraints
- REQ-T-001: .NET 8 / ASP.NET Core
- REQ-T-002: SQL Server for persistence
- REQ-T-003: Dapper ORM for queries
```

**Phase 2 — Acceptance Criteria (Gherkin)**

```
## AC-HP-001: Create Order Successfully
Scenario: Customer creates order with 2 items
  Given a customer with ID 123
  When they create an order with items [Item1: $50, Item2: $49.99]
  Then order status is "Pending"
  And order total is $99.99
  And order ID is returned

## AC-ALT-001: Invalid Customer
Scenario: Order creation fails for invalid customer
  Given a customer ID that doesn't exist
  When attempting to create order
  Then error "Customer not found" is returned
  And no order is created

## AC-ERR-001: Payment Retry on Network Failure
Scenario: Payment service times out, retry succeeds
  Given payment service is temporarily unavailable
  When processing payment
  Then 1st attempt fails (timeout)
  And waits 1 second
  Then 2nd attempt succeeds
  And order status becomes "Paid"

## AC-ERR-002: Payment Fails After 3 Retries
Scenario: Payment service remains unavailable
  Given payment service is down
  When processing payment
  Then retries 3 times (1s, 2s, 4s delays)
  And all attempts fail
  Then order status stays "Pending"
  And error logged to Dead Letter Queue
```

**Phase 3 — Risk Register**

```
| Risk | Category | Probability | Impact | Mitigation |
|------|----------|-------------|--------|-----------|
| Payment service unavailable | Technical | Medium | High | Implement retry + DLQ + manual replay |
| Network timeout mid-transaction | Technical | Medium | High | Idempotency key on payment (REQ-F-003) |
| Audit log tampering | Security | Low | Critical | Immutable append-only log, signed entries |
| Concurrent order creation race condition | Technical | Low | Medium | Database unique constraint on order ID |

## Go/No-Go Decision
✅ GO — Risks are mitigated, requirements are testable, no blockers detected
```

**Phase 4 — Quality Audit**

```
| Criterion | Status | Notes |
|-----------|--------|-------|
| Completeness | ✅ READY | All happy path, alt, error cases covered |
| Clarity | ✅ READY | REQ-F/NF clearly stated, Gherkin unambiguous |
| Testability | ✅ READY | All AC are testable, can write automated tests |
| Consistency | ✅ READY | No contradictions (payment retry + idempotency aligned) |
| Traceability | ✅ READY | All AC trace back to REQ-F/NF (AC-HP-001 → REQ-F-001/003) |

## Status: ✅ READY FOR DESIGN
```

### ✋ APPROVAL GATE #1: REQUIREMENTS APPROVED?

**Orchestrator asks user**:
```
══════════════════════════════════════════════════════════════
PHASE 1 COMPLETE — Requirements Analysis

Summary:
  5 Functional Requirements (create, pay, ship, track, retrieve)
  4 Non-Functional Requirements (audit, retry, latency, availability)
  5 Acceptance Criteria with happy path, alternatives, errors
  5 Identified Risks (payment, network, security, concurrency) — all mitigated

Quality Audit: ✅ READY
Risk Assessment: ✅ GO

══════════════════════════════════════════════════════════════

Next Step: Move to DESIGN phase (architecture, patterns, structure)

Proceed to DESIGN? [Yes / No / Ask Questions]
```

**User Response Options**:
- ✅ **Yes** → Continue to DESIGN
- ❌ **No** → Back to REQUIREMENT refinement
- ❓ **Ask Questions** → Clarify specific REQ or AC

---

## Phase 2: DESIGN ARCHITECTURE (Planner)

### What Happens

Orchestrator routes to **Design Pattern Matching**:

1. **PATTERN DETECTION**
   - User mentioned: "order status changes" → **State Pattern**
   - User mentioned: "payment failures with retries" → **Point-to-Point Messaging**, **Idempotency**, **Dead Letter Queue**
   - User mentioned: "audit log for compliance" → **Event Sourcing**

2. **DESIGN DECISION**
   - Call `/arch` → architecture design
   - Call `/design-patterns-guide` → pattern selection
   - Call `/saga-pattern` → order workflow coordination

### Planner Executes Design Analysis

**Architecture Layer Diagram**:

```
┌─────────────────────────────────────────────────────┐
│                   API Controller Layer               │
│  POST /orders, GET /orders/{id}, PUT /orders/{id}   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────┐
│                  Service Layer                      │
│  ├─ OrderService (create, update status)            │
│  ├─ PaymentService (charge, retry logic)            │
│  └─ AuditService (log changes)                      │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────┐
│              Repository Layer (Dapper)              │
│  ├─ OrderRepository (CRUD)                          │
│  ├─ AuditLogRepository (append-only)                │
│  └─ IdempotencyKeyRepository (dedup)                │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────┐
│                   Database (SQL Server)             │
│  ├─ Orders (id, customerId, status, total)         │
│  ├─ OrderItems (orderId, itemId, price)            │
│  ├─ AuditLog (orderId, event, timestamp, data)     │
│  ├─ PaymentIdempotencyKeys (orderId, key, status)  │
│  └─ DeadLetterQueue (message, error, retry_count)  │
└─────────────────────────────────────────────────────┘
```

**Pattern Recommendations**:

```
1. STATE PATTERN — Order Status Transitions
   Structure: Abstract OrderState (interface)
              ├─ PendingState (can Pay)
              ├─ PaidState (can Ship)
              ├─ ShippedState (can Deliver)
              └─ DeliveredState (terminal)
   
   Benefit: Invalid transitions raise errors (can't ship "Pending" order)
   Implementation: Order holds IOrderState, delegates Pay/Ship/Deliver to state

2. SAGA PATTERN (Orchestration) — Order → Payment → Inventory → Shipping
   Orchestrator: OrderSaga coordinates steps
   ├─ Step 1: Reserve inventory (no payment yet)
   ├─ Step 2: Process payment (with retry + idempotency)
   ├─ Step 3: Confirm inventory
   └─ If payment fails: compensation (release inventory)
   
   Idempotency Key: Per-order payment (same key = same result even on retry)

3. EVENT SOURCING — Audit Log for Compliance
   Event Store: Immutable append-only log
   Events: OrderCreated, PaymentProcessed, OrderShipped, OrderDelivered
   Reconstruction: Replay events to get current order state
   
   Benefit: Complete audit trail, compliance, time-travel queries

4. POINT-TO-POINT MESSAGING — Payment Retry Queue
   Queue: PaymentQueue (priority: high for urgent orders)
   Consumer: PaymentProcessor (picks up payment jobs)
   Failure: Goes to DeadLetterQueue after 3 retries
   
   Monitoring: DLQ depth alert if > 10 messages

5. IDEMPOTENCY — Safe Payment Retries
   Key: Hash(OrderId + PaymentAmount) = deterministic
   Store: IdempotencyKeyRepository (Redis or DB)
   Logic: Before charging, check "already processed?" → return cached result
   TTL: 24 hours (business window for payment dispute)
```

**Database Schema**:

```sql
-- Orders table
CREATE TABLE Orders (
  OrderId INT PRIMARY KEY IDENTITY(1,1),
  CustomerId INT NOT NULL,
  Status NVARCHAR(20) CHECK (Status IN ('Pending', 'Paid', 'Shipped', 'Delivered')),
  Total DECIMAL(10, 2) NOT NULL,
  CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
  UpdatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- Audit log (immutable append-only)
CREATE TABLE AuditLog (
  AuditId BIGINT PRIMARY KEY IDENTITY(1,1),
  OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(OrderId),
  Event NVARCHAR(50), -- OrderCreated, PaymentProcessed, OrderShipped, etc.
  Data NVARCHAR(MAX), -- JSON: {amount: 99.99, processor: 'Stripe', ...}
  Timestamp DATETIME2 DEFAULT GETUTCDATE(),
  INDEX IX_OrderId_Timestamp (OrderId, Timestamp)
);

-- Idempotency keys for payment
CREATE TABLE PaymentIdempotencyKeys (
  KeyId INT PRIMARY KEY IDENTITY(1,1),
  OrderId INT NOT NULL UNIQUE,
  IdempotencyKey NVARCHAR(64) UNIQUE NOT NULL,
  Status NVARCHAR(20), -- Pending, Succeeded, Failed
  Response NVARCHAR(MAX), -- Cached payment response
  CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
  ExpiresAt DATETIME2, -- 24 hours for dispute window
  FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
);

-- Dead letter queue for failed payments
CREATE TABLE DeadLetterQueue (
  DlqId BIGINT PRIMARY KEY IDENTITY(1,1),
  MessageType NVARCHAR(50), -- 'PaymentFailed'
  Payload NVARCHAR(MAX), -- JSON: {orderId, amount, error}
  ErrorMessage NVARCHAR(MAX),
  RetryCount INT DEFAULT 0,
  CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
  ProcessedAt DATETIME2 NULL,
  Status NVARCHAR(20) DEFAULT 'Pending' -- Pending, Replayed, Archived
);
```

### ✋ APPROVAL GATE #2: DESIGN APPROVED?

**Planner asks user**:
```
══════════════════════════════════════════════════════════════
PHASE 2 COMPLETE — Architecture & Design

Summary:
  Architecture: 5-layer (API → Service → Repository → DB)
  Patterns Selected:
    - State Pattern (order status)
    - Saga Pattern (payment orchestration with idempotency)
    - Event Sourcing (audit log)
    - Point-to-Point Messaging (retry queue + DLQ)
    - Idempotency (payment deduplication)
  
  Database: 4 tables (Orders, AuditLog, PaymentIdempotencyKeys, DLQ)
  Technology: .NET 8, ASP.NET Core, Dapper, SQL Server

══════════════════════════════════════════════════════════════

Next Step: Move to PLAN phase (implementation steps, file structure, effort)

Proceed to PLAN? [Yes / No / Ask Questions]
```

---

## Phase 3: IMPLEMENTATION PLAN (Plan Agent)

### What Happens

Orchestrator routes to **Plan Agent** with command: `/arch` (scope: refactor/large)

Plan Agent generates detailed implementation plan:

### Plan Agent Executes

```
## IMPLEMENTATION PLAN — Order Management System

### Step 1: Create Database Schema (2-3 hours)
Files to create:
  - Migrations/001_CreateOrderTables.sql
  - Migrations/002_CreateAuditLog.sql
  - Migrations/003_CreateIdempotencyKeys.sql
  - Migrations/004_CreateDeadLetterQueue.sql

Effort: 2-3 hours (review, test migration, rollback plan)
Risk: Medium (data schema changes — test migrations thoroughly)

### Step 2: Create Domain Model & State Pattern (2-3 hours)
Files to create:
  - Domain/Order.cs (aggregate root, IOrderState)
  - Domain/OrderState.cs (PendingState, PaidState, ShippedState, DeliveredState)
  - Domain/OrderCreatedEvent.cs, PaymentProcessedEvent.cs, etc.

Effort: 2-3 hours
Risk: Low (domain logic, no external dependencies)

### Step 3: Create Repositories (2 hours)
Files to create:
  - Infrastructure/Repositories/OrderRepository.cs (Dapper)
  - Infrastructure/Repositories/AuditLogRepository.cs (append-only)
  - Infrastructure/Repositories/IdempotencyKeyRepository.cs

Effort: 2 hours (Dapper queries, parameterized SQL)
Risk: Low

### Step 4: Create Services (3-4 hours)
Files to create:
  - Application/Services/OrderService.cs
  - Application/Services/PaymentService.cs (with retry logic + idempotency)
  - Application/Services/AuditService.cs

Key logic:
  - OrderService.CreateOrderAsync: Create + publish OrderCreatedEvent
  - PaymentService.ProcessPaymentAsync: Check idempotency key before charging
  - Compensation for saga rollback (ReleaseInventory)

Effort: 3-4 hours
Risk: Medium (payment logic, retry edge cases)

### Step 5: Create API Controller (2 hours)
Files to create:
  - Controllers/OrdersController.cs
  - DTOs/CreateOrderRequest.cs, CreateOrderResponse.cs

Endpoints:
  - POST /api/v1/orders (create)
  - GET /api/v1/orders/{id} (retrieve with audit log)
  - PUT /api/v1/orders/{id}/pay (process payment)
  - PUT /api/v1/orders/{id}/ship (ship order)

Validation: FluentValidation for inputs

Effort: 2 hours
Risk: Low

### Step 6: Wire Up DI & Config (1 hour)
Files to modify:
  - Program.cs (register services, repositories, middleware)

Effort: 1 hour
Risk: Low

### Step 7: Create Comprehensive Tests (4-6 hours)
Files to create:
  - Tests/OrderServiceTests.cs
  - Tests/PaymentServiceTests.cs (idempotency, retry, DLQ)
  - Tests/OrderControllerTests.cs

Test cases:
  - Happy path (create → pay → ship → deliver)
  - State transition validation (can't ship "Pending" order)
  - Payment retry (fail once, succeed on 2nd attempt)
  - Idempotency (same payment key returns cached result)
  - DLQ (payment fails 3x → goes to DLQ)
  - Audit log (all events logged)

Effort: 4-6 hours
Risk: Low (comprehensive coverage prevents bugs)

### TOTAL EFFORT: 16-22 hours
Estimated timeline: 3-4 days (if 4-5 hours/day coding)

### File Summary
Files to create: 15+
Files to modify: 1 (Program.cs)
Lines of code: ~1500 (domain + services + repos + API + tests)

### Dependency Order (to avoid circular deps)
1. Domain (Order, OrderState) — no dependencies
2. Infrastructure (Repositories) — depends on Domain
3. Application (Services) — depends on Domain + Infrastructure
4. API (Controllers) — depends on Application
5. Tests — depends on Application + Infrastructure

### Risks & Mitigations
| Risk | Mitigation |
|------|-----------|
| Payment retry loop | Idempotency key prevents duplicates |
| Concurrent status change | Database constraint on status transition |
| Audit log tampering | Append-only, timestamp, immutable |
| DLQ growth | Monitoring + auto-cleanup (archive old records) |
| Test failures | Each component tested independently |
```

### ✋ APPROVAL GATE #3: PLAN APPROVED?

**Plan Agent asks user**:
```
══════════════════════════════════════════════════════════════
PHASE 3 COMPLETE — Implementation Plan

Summary:
  7 implementation steps (schema, domain, repos, services, API, DI, tests)
  15+ files to create/modify
  16-22 hours total effort (3-4 days)
  Dependency order clear (domain → repos → services → API → tests)
  Risks identified & mitigated

Estimated Timeline:
  ├─ Step 1-2: Day 1 (schema + domain)
  ├─ Step 3-5: Day 2 (repos + services + API)
  ├─ Step 6: Day 2 afternoon (DI setup)
  └─ Step 7: Day 3-4 (comprehensive tests)

══════════════════════════════════════════════════════════════

Ready to proceed with implementation?

Proceed to EXECUTE? [Yes / No / Ask Questions]
```

---

## Phase 4: EXECUTION (Code Generation)

### What Happens

Once plan is approved, orchestrator routes to **Code Generation**:
- File-by-file implementation following the plan
- Each file is generated with comments, error handling, logging
- Each step is marked as complete before moving to next

### Example Output (Domain Model)

```csharp
// Domain/Order.cs (generated with step 2 plan)
using System;
using System.Collections.Generic;

namespace OrderManagement.Domain
{
    /// <summary>
    /// Order aggregate root. Represents customer order with status lifecycle.
    /// Pattern: State Pattern (status behavior varies by internal state)
    /// </summary>
    public class Order
    {
        public int OrderId { get; private set; }
        public int CustomerId { get; private set; }
        public decimal Total { get; private set; }
        
        /// <summary>
        /// Current state determines valid transitions (State Pattern)
        /// PendingState -> PaidState -> ShippedState -> DeliveredState
        /// </summary>
        public IOrderState State { get; set; }
        
        private List<DomainEvent> _domainEvents = new(); // Event Sourcing

        private Order() { } // EF Core

        public static Order Create(int customerId, decimal total)
        {
            var order = new Order
            {
                CustomerId = customerId,
                Total = total,
                State = new PendingState() // Initial state
            };
            order._domainEvents.Add(new OrderCreatedEvent { OrderId = order.OrderId });
            return order;
        }

        /// <summary>
        /// Process payment. State pattern ensures only PendingState can pay.
        /// Idempotency key prevents duplicate charges on retry.
        /// </summary>
        public void Pay(string idempotencyKey)
        {
            State.Pay(this); // Delegates to current state
            _domainEvents.Add(new PaymentProcessedEvent { IdempotencyKey = idempotencyKey });
        }

        public void Ship() => State.Ship(this);
        public void Deliver() => State.Deliver(this);

        public IReadOnlyCollection<DomainEvent> GetDomainEvents() => _domainEvents.AsReadOnly();
        public void ClearDomainEvents() => _domainEvents.Clear();
    }

    // State Pattern interface
    public interface IOrderState
    {
        void Pay(Order order);
        void Ship(Order order);
        void Deliver(Order order);
    }

    public class PendingState : IOrderState
    {
        public void Pay(Order order) => order.State = new PaidState();
        public void Ship(Order order) => throw new InvalidOperationException("Cannot ship pending order");
        public void Deliver(Order order) => throw new InvalidOperationException("Cannot deliver pending order");
    }

    public class PaidState : IOrderState
    {
        public void Pay(Order order) => throw new InvalidOperationException("Order already paid");
        public void Ship(Order order) => order.State = new ShippedState();
        public void Deliver(Order order) => throw new InvalidOperationException("Cannot deliver unshipped order");
    }

    public class ShippedState : IOrderState
    {
        public void Pay(Order order) => throw new InvalidOperationException("Order already paid");
        public void Ship(Order order) => throw new InvalidOperationException("Order already shipped");
        public void Deliver(Order order) => order.State = new DeliveredState();
    }

    public class DeliveredState : IOrderState
    {
        public void Pay(Order order) => throw new InvalidOperationException("Cannot pay delivered order");
        public void Ship(Order order) => throw new InvalidOperationException("Cannot ship delivered order");
        public void Deliver(Order order) => throw new InvalidOperationException("Order already delivered");
    }
}
```

### Step Progress

```
✅ Step 1: Database Schema (COMPLETE)
   └─ Migrations/001_CreateOrderTables.sql ✅
   └─ Migrations/002_CreateAuditLog.sql ✅
   └─ Migrations/003_CreateIdempotencyKeys.sql ✅
   └─ Migrations/004_CreateDeadLetterQueue.sql ✅

✅ Step 2: Domain Model (COMPLETE)
   └─ Domain/Order.cs ✅
   └─ Domain/OrderState.cs ✅
   └─ Domain/DomainEvents.cs ✅

🔄 Step 3: Repositories (IN PROGRESS)
   └─ Infrastructure/Repositories/OrderRepository.cs
   └─ Infrastructure/Repositories/AuditLogRepository.cs
   └─ Infrastructure/Repositories/IdempotencyKeyRepository.cs

⏳ Step 4: Services (PENDING)
⏳ Step 5: API Controller (PENDING)
⏳ Step 6: DI Setup (PENDING)
⏳ Step 7: Tests (PENDING)
```

### ✋ APPROVAL GATE #4: EXECUTION COMPLETE?

After all 7 steps complete:

```
══════════════════════════════════════════════════════════════
PHASE 4 COMPLETE — Implementation

Summary:
  ✅ All 15+ files generated
  ✅ Code compiled without errors
  ✅ Comments and docs in place
  ✅ Following PowerPlay patterns (State, Saga, Event Sourcing, etc.)
  ✅ ~1500 LOC implemented

Files Generated:
  └─ Domain/Order.cs, OrderState.cs, DomainEvents.cs
  └─ Infrastructure/Repositories/OrderRepository.cs, etc.
  └─ Application/Services/OrderService.cs, PaymentService.cs, etc.
  └─ Controllers/OrdersController.cs
  └─ DTOs/CreateOrderRequest.cs, etc.
  └─ Program.cs (DI registration)
  └─ Tests/OrderServiceTests.cs, PaymentServiceTests.cs, etc.

══════════════════════════════════════════════════════════════

Ready to run tests?

Proceed to TEST? [Yes / No / Ask Questions]
```

---

## Phase 5: TESTING & VALIDATION

### What Happens

Orchestrator routes to **Test Execution**:

```
Step 1: Compile & Unit Tests
  ✅ dotnet build (no errors)
  ✅ dotnet test (all unit tests passing)
     ├─ OrderServiceTests: 12 tests ✅
     ├─ PaymentServiceTests: 15 tests ✅ (including retry, idempotency, DLQ)
     ├─ OrderControllerTests: 8 tests ✅
     └─ Total: 35 tests, 100% pass rate

Step 2: Code Quality
  ✅ Code review: No High/Critical issues
  ✅ Security scan: No OWASP vulnerabilities
  ✅ Test coverage: 87% (target: >80%) ✅

Step 3: Integration Test (Optional)
  ✅ Create order, pay, ship, deliver (end-to-end)
  ✅ Payment retry scenario (fail once, succeed)
  ✅ Idempotency check (same payment key returns cached result)
  ✅ DLQ simulation (payment fails 3x → DLQ)
  ✅ Audit log verification (all events logged)

Step 4: Database Validation
  ✅ Migrations apply without errors
  ✅ Schema verified (tables, constraints, indexes)
  ✅ Rollback tested (can revert migration)
```

### ✋ APPROVAL GATE #5: TESTS PASSED?

```
══════════════════════════════════════════════════════════════
PHASE 5 COMPLETE — Testing & Validation

Summary:
  ✅ 35 unit tests (100% pass)
  ✅ Code review: 0 High/Critical issues
  ✅ Security: 0 OWASP violations
  ✅ Test coverage: 87%
  ✅ Migrations: ✅ apply, ✅ rollback
  ✅ E2E scenarios: All passing

Ready to release?

Proceed to RELEASE? [Yes / No / Ask Questions]
```

---

## Phase 6: RELEASE & DEPLOYMENT

### What Happens

Orchestrator routes to **Release Process**:

```
Step 1: Version & Changelog
  ├─ Version: v1.0.0 (semantic versioning)
  ├─ CHANGELOG.md entry
  │  └─ Features: Order management (create, pay, ship, deliver)
  │     Fixes: N/A
  │     Breaking: N/A
  └─ Commit message: "Feature: Add order management system with payment retry and audit logging"

Step 2: Feature Branch → Main
  ├─ PR created: "Feature: Order Management (v1.0.0)"
  ├─ PR description: All acceptance criteria met, all tests passing
  ├─ Review: ✅ approved (code review passed)
  └─ Merge: main branch

Step 3: Deploy
  ├─ Environment: Production (blue-green deployment)
  ├─ Canary rollout: 5% → 25% → 50% → 100% (monitoring SLOs)
  ├─ Feature flags: /feature-flags-rules (kill switch enabled)
  └─ Monitoring: SLO dashboard, DLQ alerts, audit log

Step 4: Post-Release
  ├─ Documentation: /doc-complete (wiki, API docs)
  ├─ Team notification: Feature released, usage guide
  ├─ Monitoring: Track order creation, payment success rate, DLQ depth
  └─ Support: On-call ready for issues
```

### Final Approval

```
══════════════════════════════════════════════════════════════
PHASE 6 COMPLETE — Release & Deployment

Summary:
  ✅ Version: v1.0.0 (semantic versioning)
  ✅ Changelog: Generated
  ✅ PR: Approved & merged to main
  ✅ Deployment: Blue-green with canary rollout
  ✅ Feature flags: Kill switch enabled
  ✅ Monitoring: SLO dashboard active

Release Status: 🚀 LIVE IN PRODUCTION

User Guide:
  POST /api/v1/orders — Create order (Pending)
  PUT /api/v1/orders/{id}/pay — Process payment (Pending → Paid)
  PUT /api/v1/orders/{id}/ship — Ship order (Paid → Shipped)
  PUT /api/v1/orders/{id}/deliver — Deliver order (Shipped → Delivered)

Monitoring:
  - Order creation: SLO < 500ms
  - Payment success rate: 99.9%
  - DLQ depth: Alert if > 10 messages
  - Audit log: All events logged

══════════════════════════════════════════════════════════════

Feature released successfully! 🎉
```

---

## COMPLETE WORKFLOW SUMMARY

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: REQUIREMENT                                        │
│ ├─ Orchestrator: /play → /pp-requirements                   │
│ ├─ Output: REQ-F, REQ-NF, Gherkin AC, Risk Register        │
│ ├─ Quality Audit: ✅ READY                                  │
│ └─ ✋ Gate: Approve requirements? [Yes/No/Questions]        │
└─────────────────────────────────────────────────────────────┘
                           ↓ Approved
┌─────────────────────────────────────────────────────────────┐
│ PHASE 2: DESIGN                                             │
│ ├─ Orchestrator: /play → /arch + /design-patterns-guide    │
│ ├─ Output: Architecture diagram, patterns, database schema  │
│ ├─ Patterns: State, Saga, Event Sourcing, Messaging, etc.  │
│ └─ ✋ Gate: Approve design? [Yes/No/Questions]             │
└─────────────────────────────────────────────────────────────┘
                           ↓ Approved
┌─────────────────────────────────────────────────────────────┐
│ PHASE 3: PLAN                                               │
│ ├─ Planner Agent: Generates step-by-step implementation    │
│ ├─ Output: 7 steps, 16-22 hours, 15+ files, risks         │
│ ├─ Dependency order: domain → repos → services → API      │
│ └─ ✋ Gate: Approve plan? [Yes/No/Questions]              │
└─────────────────────────────────────────────────────────────┘
                           ↓ Approved
┌─────────────────────────────────────────────────────────────┐
│ PHASE 4: EXECUTE                                            │
│ ├─ Code Generation: Following plan step-by-step            │
│ ├─ Output: ~1500 LOC, 15+ files, documented               │
│ ├─ Quality: Comments, error handling, logging              │
│ └─ ✋ Gate: Implementation complete? [Yes/No/Ask]          │
└─────────────────────────────────────────────────────────────┘
                           ↓ Approved
┌─────────────────────────────────────────────────────────────┐
│ PHASE 5: TEST                                               │
│ ├─ Test Orchestrator: Unit, integration, security scans    │
│ ├─ Output: 35 tests passing, 87% coverage, 0 vulns        │
│ ├─ Validation: Migration tests, E2E scenarios              │
│ └─ ✋ Gate: Tests passed? [Yes/No/Ask]                    │
└─────────────────────────────────────────────────────────────┘
                           ↓ Approved
┌─────────────────────────────────────────────────────────────┐
│ PHASE 6: RELEASE                                            │
│ ├─ Release: v1.0.0, changelog, PR, merge, deploy          │
│ ├─ Output: Blue-green deployment, canary rollout, monitoring │
│ ├─ Go-live: Feature flags enabled, SLOs active            │
│ └─ ✋ Final: Feature released? [Yes/No/Ask]               │
└─────────────────────────────────────────────────────────────┘
                           ↓ Done
┌─────────────────────────────────────────────────────────────┐
│ 🚀 FEATURE LIVE — MONITORING ACTIVE                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Points

### ✅ Orchestrator/Planner Role
1. **Requirement Phase**: Parse, validate, ask questions before design
2. **Design Phase**: Pattern matching, architecture review, ask questions
3. **Plan Phase**: Step-by-step implementation with effort & risk
4. **Execute Phase**: Code generation following plan exactly
5. **Test Phase**: Automated validation, code quality checks
6. **Release Phase**: Versioning, deployment, monitoring

### ✅ Approval Gates at Each Phase
- After each major phase, **explicit approval needed** before proceeding
- User can ask questions, request changes, or approve
- No phase proceeds without approval (prevents rework)

### ✅ Pattern Integration
- Orchestrator detects patterns from requirements (saga, state, events)
- Planner uses pattern guidance (`/design-patterns-guide`, `/saga-pattern`, etc.)
- Code generation applies patterns consistently

### ✅ Quality Checkpoints
- Requirements: Quality audit before design
- Design: Architecture review before implementation
- Plan: Risk assessment before coding
- Execute: Code review during generation
- Test: 100% pass before release
- Release: Monitoring active post-deployment

---

**This workflow ensures**: Requirements → Design → Plan → Execute → Test → Release with approval gates and pattern guidance at each step.
