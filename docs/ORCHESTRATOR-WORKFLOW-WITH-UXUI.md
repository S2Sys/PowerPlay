# PowerPlay Orchestrator Workflow — COMPLETE with UI/UX Integration

**Scenario**: User wants to add a new "Order Management" feature
**Workflow**: Requirement → Design (Backend + UI/UX) → Plan → Execute → Test → Release
**Approval Gates**: At each phase, orchestrator/planner asks for approval before proceeding

---

## Issue with Previous Workflow

❌ **Missing**: UI/UX was completely absent from the workflow
❌ **Problem**: Backend design happened without considering user interface
❌ **Impact**: UI/UX added late → rework, disconnected user experience

## Corrected Workflow

```
REQUIREMENT → DESIGN (Backend + UI/UX) → PLAN → EXECUTE → TEST → RELEASE
                      ↓              ↓
                  Backend          Frontend
                  Patterns         Patterns
                  Database         Components
                  APIs             Flows
```

---

## Phase 0: INITIAL REQUEST

### User Input
```
"Add an order management system. Orders can be created, paid, shipped, 
and delivered. Need to track status changes, handle payment failures with retries, 
and maintain an audit log for compliance. 

User should see order list with status, create new order form, 
payment confirmation modal, and audit trail view."
```

---

## Phase 1: REQUIREMENT ANALYSIS (Orchestrator)

### Functional Requirements (Including UI/UX)

```
# REQUIREMENT HANDOFF BLOCK 1

## Functional Requirements — Backend
- REQ-F-001: Create order with items, customer, total
- REQ-F-002: Set order status (Pending → Paid → Shipped → Delivered)
- REQ-F-003: Process payment with automatic retry on failure
- REQ-F-004: Track order status changes (audit log)
- REQ-F-005: Retrieve order by ID with full history
- REQ-F-006: API endpoints (POST /orders, GET /orders/{id}, PUT /orders/{id}/pay)

## Functional Requirements — UI/UX
- REQ-F-UX-001: Display order list with status badges (Pending/Paid/Shipped/Delivered)
- REQ-F-UX-002: Create order form (customer selector, item selector, quantity, price)
- REQ-F-UX-003: Payment confirmation modal (amount, processor, confirm/cancel)
- REQ-F-UX-004: Order status lifecycle view (show transitions: Pending → Paid → Shipped)
- REQ-F-UX-005: Audit log view (timeline of all status changes with timestamps)
- REQ-F-UX-006: Error handling UI (payment failure, retry attempts, DLQ alert)

## Non-Functional Requirements
- REQ-NF-001: API response time < 500ms
- REQ-NF-002: UI responsiveness: form submit < 1s feedback
- REQ-NF-003: Mobile responsive (320px-1280px breakpoints)
- REQ-NF-004: Accessibility (WCAG 2.1 AA, 4.5:1 contrast)
- REQ-NF-005: Audit log immutable (compliance)

## Technology Constraints
- REQ-T-001: Backend: .NET 8 / ASP.NET Core
- REQ-T-002: Frontend: Angular 17+ (standalone components)
- REQ-T-003: Database: SQL Server
- REQ-T-004: UI library: DevExtreme components
```

### Gherkin Acceptance Criteria (Including UI/UX)

```
## AC-HP-001: User creates order via UI
Scenario: Customer creates order through order creation form
  Given the order creation form is displayed
  And customer "John Doe" is selected
  And 2 items are added (Item1: $50, Item2: $49.99)
  When user clicks "Create Order"
  Then order is created with status "Pending"
  And order list is refreshed showing new order
  And success toast message appears "Order created successfully"

## AC-HP-002: User initiates payment
Scenario: Customer confirms payment through payment modal
  Given order status is "Pending"
  And payment modal shows amount: $99.99
  When user clicks "Confirm Payment"
  Then payment is processed
  And order status updates to "Paid" (UI reflects change)
  And modal closes automatically
  And order list shows status badge "Paid" ✅

## AC-ERR-UX-001: Payment failure with retry UI
Scenario: Payment fails, user sees retry attempts
  Given payment processing initiated
  And payment service temporarily unavailable
  When 1st payment attempt fails (timeout)
  Then UI shows "Processing payment... Attempt 1/3"
  And waits 1 second
  When 2nd payment attempt succeeds
  Then UI updates to "Payment successful ✅"
  And modal closes

## AC-ERR-UX-002: Payment fails, goes to DLQ
Scenario: Payment fails permanently after 3 retries
  Given payment service is permanently unavailable
  When user initiates payment
  Then UI shows retry attempts: "Attempt 1/3", "Attempt 2/3", "Attempt 3/3"
  And all attempts fail
  Then UI displays error: "Payment processing failed. Please contact support."
  And order status remains "Pending"
  And support team sees alert in DLQ dashboard

## AC-UX-001: Order status lifecycle visible
Scenario: User sees complete order transition
  Given order is in "Pending" state
  And order detail view is open
  Then user sees lifecycle timeline:
    Pending (current) → Paid (next) → Shipped (next) → Delivered (next)
  When payment is processed
  Then status automatically updates to "Paid"
  And timeline shows timestamp of status change

## AC-UX-002: Audit log view
Scenario: User reviews complete order history
  Given order detail view is open
  When user clicks "View Audit Trail"
  Then modal/drawer opens showing:
    | Event | Timestamp | Details |
    | OrderCreated | 2026-04-10 10:00:00 | Customer: John, Total: $99.99 |
    | PaymentProcessed | 2026-04-10 10:02:30 | Amount: $99.99, Processor: Stripe |
    | OrderShipped | 2026-04-10 11:30:00 | Tracking: XYZ123 |
  And user sees immutable log (no edit/delete capability)

## AC-UX-003: Responsive design (mobile)
Scenario: Order form works on mobile (320px)
  Given viewport width is 320px (iPhone SE)
  When user opens order creation form
  Then form layout is single-column
  And inputs stack vertically
  And buttons are full-width, touch-friendly (44px height min)
  And form is usable without horizontal scroll

## AC-WCAG-001: Accessibility (contrast, keyboard)
Scenario: Status badges meet WCAG 2.1 AA
  Given order list with status badges
  When checking badge colors:
    | Status | Background | Text | Contrast Ratio |
    | Pending | #FFF3CD | #333 | 4.5:1 ✅ |
    | Paid | #D4EDDA | #155724 | 7.8:1 ✅ |
    | Shipped | #D1ECF1 | #0C5460 | 6.2:1 ✅ |
    | Delivered | #C3E6CB | #155724 | 8.1:1 ✅ |
  Then all badges meet 4.5:1 minimum
  And keyboard navigation works (Tab → Shift+Tab)
  And screen reader announces status ("Paid order")
```

---

## Phase 2: DESIGN (Backend + UI/UX in Parallel)

### What Happens

Orchestrator routes to **Two Design Agents in Parallel**:
1. **Backend Design** → `/arch` agent
2. **UI/UX Design** → `/ng-component` + `/design-component` agents

Both happen simultaneously (not sequentially).

### Design A: Backend Architecture

```
Layer Diagram:
┌─────────────────────────────────────────────────┐
│            API Controller Layer                  │
│  POST /orders, GET /orders/{id}, PUT /orders/{id}/pay │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────┐
│         Service Layer (with Patterns)           │
│  ├─ OrderService (state pattern)                │
│  ├─ PaymentService (idempotency, retry)        │
│  └─ AuditService (event sourcing)               │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────┐
│          Repository Layer (Dapper)              │
│  ├─ OrderRepository                             │
│  ├─ AuditLogRepository (append-only)            │
│  └─ IdempotencyKeyRepository                    │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────┐
│       Database (SQL Server)                     │
│  ├─ Orders, OrderItems, AuditLog, DLQ          │
└─────────────────────────────────────────────────┘

Patterns Applied:
  • State Pattern (order status transitions)
  • Saga Pattern (order → payment → inventory)
  • Event Sourcing (audit log)
  • Point-to-Point Messaging (payment queue + DLQ)
  • Idempotency (safe retries)
```

### Design B: UI/UX Architecture

```
Component Hierarchy:

┌─────────────────────────────────────────────────┐
│      OrderManagement (Container Component)      │
│  ├─ OrderList (smart component)                 │
│  │  ├─ OrderListTable (presentational)          │
│  │  │  └─ OrderRow (status badge, actions)      │
│  │  └─ StatusBadge (WCAG: 4.5:1 contrast)       │
│  │                                              │
│  ├─ CreateOrderModal (smart)                    │
│  │  ├─ CustomerSelector (dropdown)              │
│  │  ├─ ItemSelector (table with add/remove)     │
│  │  └─ PriceCalculator (real-time total)        │
│  │                                              │
│  ├─ PaymentModal (smart)                        │
│  │  ├─ PaymentForm (amount, processor)          │
│  │  ├─ RetryIndicator (Attempt X/3)             │
│  │  └─ ErrorMessage (if payment fails)          │
│  │                                              │
│  └─ OrderDetailView (smart)                     │
│     ├─ OrderSummary (display only)              │
│     ├─ StatusTimeline (Pending→Paid→Shipped)    │
│     └─ AuditLogDrawer (append-only table)       │
└─────────────────────────────────────────────────┘

Patterns Applied:
  • Smart/Presentational components (separation of concerns)
  • OnPush change detection (performance)
  • Standalone components (Angular 17+)
  • Typed FormGroup<T> (type safety)
  • Signals for local state (reactive)
  • Custom composables for logic (reusability)

DevExtreme Components Used:
  • DxDataGrid (order list)
  • DxForm (create order form)
  • DxButton, DxTextBox, DxSelectBox
  • DxDrawer (audit log modal)

Responsive Design:
  ├─ Mobile (320px): Single column, stacked
  ├─ Tablet (768px): Two columns
  └─ Desktop (1024px+): Full layout

Accessibility (WCAG 2.1 AA):
  ├─ Color contrast: 4.5:1 (normal text)
  ├─ Focus indicators: Visible on all interactive elements
  ├─ Keyboard navigation: Tab → Shift+Tab
  ├─ Screen reader: ARIA labels on all inputs
  └─ Motion: Respects prefers-reduced-motion
```

### Design Artifacts

**Backend Design Output**:
- Architecture diagram (5 layers)
- Database schema (4 tables)
- Patterns applied (State, Saga, Event Sourcing, etc.)
- API contract (endpoints, DTOs)

**UI/UX Design Output**:
- Component hierarchy diagram
- Wireframes (Create Order form, Payment modal, Audit Log)
- Responsive breakpoints (320, 768, 1024px)
- Color palette (status badges with contrast checks)
- Accessibility checklist (WCAG 2.1 AA)
- User flows (Create → Pay → Confirm)

### ✋ APPROVAL GATE #2: Design Approved?

```
══════════════════════════════════════════════════════════════
PHASE 2 COMPLETE — Architecture & UI/UX Design

Backend Design:
  ✅ 5-layer architecture (API → Service → Repo → DB)
  ✅ Patterns: State, Saga, Event Sourcing, Messaging
  ✅ Database: 4 tables designed

UI/UX Design:
  ✅ Component hierarchy (6 components)
  ✅ DevExtreme components selected
  ✅ Responsive: 320px, 768px, 1024px breakpoints
  ✅ Accessibility: WCAG 2.1 AA (4.5:1 contrast, keyboard nav)
  ✅ User flows: Create order → Pay → Confirm → View audit

══════════════════════════════════════════════════════════════

Ready to proceed with implementation?

Proceed to PLAN? [Yes / No / Ask Questions]
```

---

## Phase 3: IMPLEMENTATION PLAN (Parallel Backend + Frontend)

### Plan Structure

```
Step 1: Database Schema (2-3 hours)
  ├─ Backend Task
  └─ No UI dependency

Step 2: Domain Model + State Pattern (2-3 hours)
  ├─ Backend Task
  └─ No UI dependency

Step 3: Backend Services + Repositories (4-5 hours)
  ├─ Backend Task (PaymentService with idempotency, DLQ)
  └─ No UI dependency (but provides API)

Step 4: API Controller + DTOs (2 hours)
  ├─ Backend Task
  └─ UI dependency: Defines request/response contracts

Step 5: Frontend Components (4-5 hours) ← PARALLEL with Step 3
  ├─ Standalone components (Angular 17+)
  ├─ Component files:
  │  ├─ OrderListComponent (dxGrid for display)
  │  ├─ CreateOrderModalComponent (dxForm)
  │  ├─ PaymentModalComponent (retry UI, error handling)
  │  └─ OrderDetailComponent (status timeline, audit log)
  └─ Dependency: Waits for Step 4 (API contract)

Step 6: Frontend Services + API Integration (2-3 hours)
  ├─ OrderService (HTTP client wrapper)
  ├─ PaymentService (retry logic, idempotency on client)
  └─ StateManagement (NgRx for order list state)

Step 7: Styling + Responsive + Accessibility (2-3 hours)
  ├─ SCSS with sw- BEM naming
  ├─ Mobile responsive (media queries)
  ├─ WCAG accessibility (contrast, focus, ARIA)
  └─ Theme integration (DevExtreme theme)

Step 8: Frontend + Backend Integration Testing (2-3 hours)
  ├─ E2E tests (create order → pay → confirm)
  ├─ API contract tests
  └─ Accessibility tests (WAVE, axe)

Step 9: Comprehensive Tests (4-6 hours)
  ├─ Backend tests (35 tests as before)
  └─ Frontend tests (20+ component tests)

TOTAL EFFORT: 24-30 hours (3-4 days)
├─ Backend: 12-15 hours (Steps 1-4, 9)
└─ Frontend: 12-15 hours (Steps 5-9, parallel)

File Structure:
├─ Backend Files: 15+ (domain, services, repos, API, tests)
└─ Frontend Files: 12+ (components, services, styles, tests)
```

### Dependency Sequencing

```
Step 1: Database ✅ (no dependencies)
  ↓
Step 2: Domain Model ✅ (depends on DB schema)
  ↓
Step 3: Backend Services ✅ (depends on domain)
  ↓
Step 4: API Controller ✅ (depends on services)
  ↓ (NOW FRONTEND CAN START)
Step 5: Frontend Components ✅ (depends on API contract)
  ↓
Step 6: Frontend Services ✅ (depends on components)
  ↓
Step 7: Styling + Accessibility ✅
  ↓
Step 8: Frontend + Backend Integration ✅
  ↓
Step 9: Tests (Backend + Frontend) ✅
```

**Key**: Steps 1-4 (backend) → Step 4 gates Step 5 (frontend)
Then Steps 5-9 run in parallel with Step 9 (tests).

### ✋ APPROVAL GATE #3: Plan Approved?

```
══════════════════════════════════════════════════════════════
PHASE 3 COMPLETE — Implementation Plan (Backend + Frontend)

Backend:
  ✅ 4 steps, 12-15 hours
  ✅ 15+ files (domain, services, API, tests)
  ✅ Dependency order clear

Frontend:
  ✅ 5 steps, 12-15 hours
  ✅ 12+ files (components, services, styles, tests)
  ✅ Waits for API contract (Step 4)

Parallel Execution:
  ├─ Backend Steps 1-4: Sequential (2 days)
  ├─ Frontend Steps 5-8: Parallel with Step 3+ (2 days)
  └─ Tests (Step 9): Both backend + frontend (1 day)

Total Timeline: 3-4 days (if 6-8 hours/day)

══════════════════════════════════════════════════════════════

Ready to proceed with implementation?

Proceed to EXECUTE? [Yes / No / Ask Questions]
```

---

## Phase 4: EXECUTION (Backend + Frontend Parallel)

### Backend Execution

```
✅ Step 1: Database migrations (COMPLETE)
   └─ Migrations/001_CreateOrderTables.sql ✅

✅ Step 2: Domain model (COMPLETE)
   └─ Domain/Order.cs, OrderState.cs, DomainEvents.cs ✅

🔄 Step 3: Backend services (IN PROGRESS)
   └─ OrderService, PaymentService, AuditService

⏳ Step 4: API controller
   └─ Controllers/OrdersController.cs
```

### Frontend Execution (Parallel)

```
🔄 Step 5: Frontend components (IN PROGRESS)
   ├─ Components/OrderListComponent.ts
   │  └─ Template: dxGrid with order list, status badges
   ├─ Components/CreateOrderModalComponent.ts
   │  └─ Template: dxForm with customer, items, total
   ├─ Components/PaymentModalComponent.ts
   │  └─ Template: Amount display, Attempt counter (Attempt X/3), error handling
   └─ Components/OrderDetailComponent.ts
      └─ Template: Status timeline, audit log drawer

⏳ Step 6: Frontend services & state management
   └─ Services/OrderService.ts (HTTP client)
   └─ State/order.store.ts (NgRx)

⏳ Step 7: Styling + responsive + accessibility
   └─ Styles/order-management.scss (WCAG, responsive)

⏳ Step 8: Integration testing
   └─ Tests/OrderManagement.e2e.ts (create → pay → confirm)
```

### Code Example: PaymentModal with Retry UI

```typescript
// Frontend: PaymentModalComponent (with retry attempts visible)
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DxButtonComponent, DxFormComponent } from 'devextreme-angular';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  template: `
    <div class="payment-modal">
      <h2>Confirm Payment</h2>
      
      <!-- Amount display -->
      <div class="amount">
        <span class="label">Total Amount:</span>
        <span class="value">${{ order.total | currency }}</span>
      </div>

      <!-- Retry attempts indicator -->
      <div class="retry-status" *ngIf="paymentProcessing">
        <span class="spinner"></span>
        Processing payment... Attempt {{ attemptCount }}/3
      </div>

      <!-- Error message if failed -->
      <div class="error-message" *ngIf="paymentError">
        <strong>⚠️ Payment Failed:</strong> {{ paymentError }}
        <br/>
        <small *ngIf="attemptCount < 3">Retrying... (Attempt {{ attemptCount }}/3)</small>
        <small *ngIf="attemptCount >= 3">
          Payment failed after 3 attempts. Please contact support.
        </small>
      </div>

      <!-- Success message -->
      <div class="success-message" *ngIf="paymentSuccess">
        ✅ Payment successful! Redirecting to order details...
      </div>

      <!-- Action buttons -->
      <div class="actions">
        <dx-button 
          text="Confirm Payment"
          type="success"
          (click)="confirmPayment()"
          [disabled]="paymentProcessing || paymentSuccess">
        </dx-button>
        <dx-button 
          text="Cancel"
          type="default"
          (click)="closeModal()"
          [disabled]="paymentProcessing">
        </dx-button>
      </div>
    </div>
  `,
  styles: [`
    .payment-modal { padding: 20px; }
    .amount { font-size: 18px; margin: 20px 0; }
    .retry-status { color: #0066cc; margin: 15px 0; }
    .error-message { color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 4px; margin: 15px 0; }
    .success-message { color: #2e7d32; background: #f1f8e9; padding: 10px; border-radius: 4px; margin: 15px 0; }
    .actions { display: flex; gap: 10px; margin-top: 20px; }

    /* Responsive */
    @media (max-width: 600px) {
      .payment-modal { padding: 10px; }
      .actions { flex-direction: column; }
      .actions button { width: 100%; }
    }

    /* Accessibility: Focus indicators */
    button:focus { outline: 2px solid #0066cc; outline-offset: 2px; }
  `]
})
export class PaymentModalComponent implements OnInit {
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);

  order: any;
  paymentProcessing = false;
  paymentSuccess = false;
  paymentError: string | null = null;
  attemptCount = 0;

  async confirmPayment() {
    this.paymentProcessing = true;
    this.paymentError = null;

    try {
      // Attempt 1: Try to process payment
      this.attemptCount = 1;
      const result = await this.paymentService.processPayment(this.order.id, this.order.total).toPromise();
      
      // Success
      this.paymentSuccess = true;
      setTimeout(() => this.closeModal(), 2000);
      
    } catch (error: any) {
      // Failure - but backend will retry (idempotency key ensures safe retries)
      if (this.attemptCount < 3) {
        // User sees "Retrying..." on screen
        // Backend is already retrying with exponential backoff
        // Show next attempt
        await this.delay(1000);
        this.attemptCount++;
        
        // Optionally: Show user the retry is happening
        this.paymentError = `Attempt ${this.attemptCount}/3: ${error.message}`;
        
        // Backend retry logic continues in background
        // If succeeds, API will respond with success
        // If fails 3x, goes to DLQ
        
      } else {
        // Permanent failure
        this.paymentError = 'Payment failed after 3 attempts. Please contact support. Reference: ' + error.transactionId;
      }
      
      this.paymentProcessing = false;
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  closeModal() {
    // Close modal, refresh order list
  }
}
```

**Frontend → Backend Flow**:
1. User clicks "Confirm Payment"
2. Frontend calls `OrderService.processPayment(orderId, amount)`
3. Backend receives request:
   - Checks idempotency key (is this a retry?)
   - If new: Process payment
   - If retry: Return cached result (idempotency!)
4. Frontend shows:
   - "Processing payment... Attempt 1/3" (or whatever backend reports)
   - If success: Close modal, refresh order list
   - If failure: Show error, suggest retry or contact support

---

## Phase 5: TESTING (Backend + Frontend)

### Backend Tests (as before)
```
✅ OrderServiceTests (12 tests)
✅ PaymentServiceTests (15 tests + idempotency + DLQ)
✅ OrderControllerTests (8 tests)
```

### Frontend Tests (NEW)

```typescript
// Components/PaymentModalComponent.spec.ts
describe('PaymentModalComponent', () => {
  let component: PaymentModalComponent;
  let orderService: jasmine.SpyObj<OrderService>;
  let paymentService: jasmine.SpyObj<PaymentService>;

  beforeEach(async () => {
    // Setup component and mocks
  });

  // Happy path
  it('should show "Payment successful" on successful payment', async () => {
    const result = await component.confirmPayment();
    expect(component.paymentSuccess).toBe(true);
    expect(component.successMessage).toContain('successful');
  });

  // Error handling
  it('should display "Attempt 1/3" on first retry', async () => {
    paymentService.processPayment.and.returnValue(throwError(() => new Error('Timeout')));
    
    await component.confirmPayment();
    
    expect(component.attemptCount).toBe(1);
    expect(component.paymentError).toContain('Attempt 1/3');
  });

  // Accessibility
  it('should have focus indicator on buttons', () => {
    const button = component.fixture.debugElement.query(By.css('dx-button'));
    expect(button.nativeElement.style.outline).toBeTruthy();
  });

  // Responsive
  it('should stack buttons vertically on mobile (max-width: 600px)', () => {
    component.fixture.nativeElement.style.maxWidth = '320px';
    const actions = component.fixture.debugElement.query(By.css('.actions'));
    expect(window.getComputedStyle(actions.nativeElement).flexDirection).toBe('column');
  });

  // WCAG: Color contrast
  it('should have 4.5:1 contrast ratio on error message', () => {
    // Use WCAG contrast checker
    const errorColor = window.getComputedStyle(component.errorElement).color; // #d32f2f
    const backgroundColor = window.getComputedStyle(component.errorElement).backgroundColor; // #ffebee
    const contrastRatio = calculateContrast(errorColor, backgroundColor);
    expect(contrastRatio).toBeGreaterThanOrEqual(4.5);
  });
});
```

### E2E Tests (Scenario Tests)

```typescript
// E2E: Order Creation to Payment (Full User Journey)
describe('Order Management E2E', () => {
  it('should create order, pay, and confirm successfully', async () => {
    // Navigate to order management page
    cy.visit('/orders');

    // Click "Create Order"
    cy.contains('button', 'Create Order').click();

    // Fill form
    cy.get('dx-select-box[placeholder="Customer"]').click().contains('John Doe').click();
    cy.get('input[placeholder="Item"]').type('Item 1').blur();
    cy.get('input[placeholder="Quantity"]').type('2').blur();
    cy.get('input[placeholder="Price"]').type('50').blur();
    cy.get('button[type="submit"]').click();

    // Verify order created
    cy.contains('Order created successfully').should('be.visible');
    cy.get('table').contains('John Doe').should('exist');

    // Click Pay
    cy.contains('button', 'Pay').click();

    // Confirm payment in modal
    cy.get('.payment-modal').should('be.visible');
    cy.contains('button', 'Confirm Payment').click();

    // Verify status updated
    cy.get('table').contains('Paid').should('exist'); // Status badge
    cy.contains('Payment successful').should('be.visible');
  });

  it('should handle payment failure and show retry attempts', async () => {
    // Simulate payment service failure
    cy.intercept('PUT', '/api/v1/orders/*/pay', { statusCode: 500, body: { error: 'Timeout' } });

    // Attempt payment
    cy.get('.payment-modal button[type="submit"]').click();

    // Should show retry attempt
    cy.contains('Attempt 1/3').should('be.visible');
    
    // After backend retries 3x, should show final error
    cy.contains('Payment failed after 3 attempts').should('be.visible');
  });

  it('should display audit log on order detail view', async () => {
    // Navigate to order detail
    cy.get('table tr').first().click();

    // Click "View Audit Trail"
    cy.contains('button', 'View Audit Trail').click();

    // Verify audit log table
    cy.get('.audit-log-table').should('be.visible');
    cy.get('table').contains('OrderCreated').should('exist');
    cy.get('table').contains('PaymentProcessed').should('exist');
  });

  // Accessibility E2E
  it('should be keyboard navigable', async () => {
    cy.visit('/orders');

    // Tab through buttons
    cy.get('button').first().focus();
    cy.realPress('Tab'); // Focus on next button
    cy.focused().should('have.attr', 'type', 'button');

    // Verify focus indicator visible
    cy.focused().should('have.css', 'outline');
  });

  // Responsive E2E
  it('should be usable on mobile (320px)', async () => {
    cy.viewport(320, 568); // iPhone SE
    cy.visit('/orders');

    // Form should stack vertically
    cy.get('.create-order-form').should('have.css', 'flexDirection', 'column');

    // Buttons should be full-width
    cy.get('button').should('have.css', 'width', '100%');
  });
});
```

### Test Coverage

```
Backend Tests:
  ✅ 35 unit tests
  ✅ 87% code coverage
  ✅ Idempotency tests (same key = cached result)
  ✅ DLQ tests (fail 3x → goes to DLQ)
  ✅ State transition tests (invalid transitions rejected)

Frontend Tests:
  ✅ 20+ component tests
  ✅ 8+ E2E scenario tests
  ✅ Accessibility tests (focus, contrast, WCAG)
  ✅ Responsive tests (320px, 768px, 1024px)

Total: 55+ tests, combined coverage > 80%
```

### ✋ APPROVAL GATE #5: Tests Passed?

```
══════════════════════════════════════════════════════════════
PHASE 5 COMPLETE — Testing & Validation

Backend Tests:
  ✅ 35 unit tests (100% pass)
  ✅ 87% code coverage
  ✅ 0 High/Critical security issues

Frontend Tests:
  ✅ 20+ component tests (100% pass)
  ✅ 8+ E2E scenario tests (100% pass)
  ✅ Accessibility tests (WCAG 2.1 AA ✅)
  ✅ Responsive tests (320px ✅, 768px ✅, 1024px ✅)

Combined:
  ✅ 55+ total tests
  ✅ 0 failing tests
  ✅ Payment retry scenario: PASS
  ✅ DLQ handling: PASS
  ✅ Audit log: PASS
  ✅ Mobile usability: PASS
  ✅ Accessibility (contrast, keyboard, screen reader): PASS

Ready to release?

Proceed to RELEASE? [Yes / No / Ask Questions]
```

---

## Phase 6: RELEASE & DEPLOYMENT

### Release Artifacts

```
Version: v1.0.0 (backend + frontend)

Backend Release:
  ├─ API version: v1 (/api/v1/orders)
  ├─ Database migrations applied
  └─ Service deployment (blue-green)

Frontend Release:
  ├─ App version: v1.0.0
  ├─ Bundle size: ~350KB (gzipped)
  └─ CDN deployment (CloudFront / Azure CDN)

Feature Flags:
  ├─ order-management-backend: ON
  ├─ order-management-ui: ON
  └─ order-payment-retry: ON (kill switch ready)
```

### Deployment Strategy

```
Blue-Green Deployment:
├─ Blue environment (current): v0.9.0 (old version)
├─ Green environment (new): v1.0.0 (new version)
├─ Traffic routing: Gradually shift from blue → green
│  ├─ 0% → green (warm up)
│  ├─ 5% → green (canary, monitor SLOs)
│  ├─ 25% → green (good signals, continue)
│  ├─ 50% → green (half traffic)
│  └─ 100% → green (all traffic)
├─ Monitoring: SLOs at each step
└─ Rollback: If SLO violated, instant revert to blue
```

### Monitoring & SLOs

```
Backend SLOs:
  ├─ API response time: < 500ms (p95)
  ├─ Payment success rate: > 99.9%
  ├─ Order creation: > 99.95%
  └─ DLQ messages: Alert if > 10 pending

Frontend SLOs:
  ├─ Page load time: < 3s (LCP)
  ├─ Interaction latency: < 100ms (INP)
  ├─ Layout stability: CLS < 0.1
  ├─ Accessibility: All automated checks pass
  └─ Mobile usability: Zero "poor" ratings

Dashboards:
  ├─ Operational: Order creation/payment/shipping rates
  ├─ Error: Exception rates, DLQ depth, API errors
  ├─ Performance: API latency, frontend metrics
  ├─ User: Session count, unique users, feature adoption
  └─ Accessibility: WCAG violations (should be 0)
```

### Go-Live Checklist

```
Backend:
  ✅ Migrations applied to prod database
  ✅ API endpoints responsive
  ✅ Payment service responding (test transaction successful)
  ✅ DLQ configured and monitored
  ✅ Monitoring active (SLO dashboard, alerts)
  ✅ Logging at INFO level
  ✅ Error tracking (APM) operational
  ✅ On-call team notified

Frontend:
  ✅ App bundle built (production mode)
  ✅ CDN deployment successful
  ✅ Service worker cached (if SPA)
  ✅ Browser compatibility tested (Chrome, Firefox, Safari)
  ✅ Mobile tested on real devices (iPhone, Android)
  ✅ Accessibility audit passed (WCAG 2.1 AA)
  ✅ Performance budget met (LCP < 3s)
  ✅ Feature flags active

Team:
  ✅ Release notes published
  ✅ User guide available (how to create order, pay, view audit)
  ✅ Support team trained
  ✅ On-call runbook ready (incident response)
  ✅ Rollback procedure tested
  ✅ Team slack notification sent
```

### ✋ APPROVAL GATE #6: Feature Released?

```
══════════════════════════════════════════════════════════════
PHASE 6 COMPLETE — Release & Deployment

Version: v1.0.0 (Backend + Frontend)
Status: ✅ LIVE IN PRODUCTION

Backend:
  ✅ Deployed to production
  ✅ Migrations applied
  ✅ SLO dashboard active
  ✅ Monitoring: Order creation, payment success, DLQ depth
  ✅ Error tracking: APM active
  ✅ On-call: Team ready

Frontend:
  ✅ Deployed to CDN
  ✅ App accessible at prod URL
  ✅ All routes responsive
  ✅ Mobile usable (320px+)
  ✅ Accessibility: WCAG 2.1 AA ✅
  ✅ Performance: LCP 2.8s, CLS 0.05

User Experience:
  ✅ Can create orders
  ✅ Can process payments (with retry UI)
  ✅ Can view order status
  ✅ Can see audit log
  ✅ Errors gracefully handled
  ✅ Mobile experience smooth
  ✅ Keyboard navigation works
  ✅ Screen reader compatible

Canary Rollout:
  ├─ 5% traffic: ✅ SLOs green
  ├─ 25% traffic: ✅ SLOs green
  ├─ 50% traffic: ✅ SLOs green
  └─ 100% traffic: ✅ Stable, all good

Feature Flags:
  ├─ order-management-backend: ON ✅
  ├─ order-management-ui: ON ✅
  └─ Kill switches ready (can disable instantly)

══════════════════════════════════════════════════════════════

🚀 Order Management Feature LIVE in Production!
📊 Monitoring active, SLOs being tracked
📱 Mobile responsive, WCAG accessible
🔄 Automatic payment retries with user feedback
📋 Audit log available for compliance
🎉 Feature released successfully!
```

---

## COMPLETE WORKFLOW WITH UI/UX

```
REQUIREMENT (Backend + UI/UX specs)
        ↓ ✋ Gate: Approve?
DESIGN (Backend architecture + Frontend components)
        ↓ ✋ Gate: Approve?
PLAN (Backend steps 1-4 sequential, Frontend steps 5-8 parallel)
        ↓ ✋ Gate: Approve?
EXECUTE (Backend implementation, Frontend implementation in parallel)
        ↓ ✋ Gate: Complete?
TEST (Backend unit tests + Frontend component/E2E tests)
        ↓ ✋ Gate: Pass?
RELEASE (v1.0.0, blue-green deployment, canary rollout)
        ↓ ✋ Gate: Released?
🚀 LIVE IN PRODUCTION
```

---

## Key Differences from Original Workflow

| Aspect | Original | Corrected |
|--------|----------|-----------|
| **UI/UX Involvement** | ❌ Missing | ✅ Phase 2 (parallel with backend design) |
| **Component Design** | ❌ Not mentioned | ✅ 6 components with DevExtreme |
| **Responsive Design** | ❌ Not mentioned | ✅ 3 breakpoints (320px, 768px, 1024px) |
| **Accessibility** | ❌ Not mentioned | ✅ WCAG 2.1 AA (contrast, keyboard, ARIA) |
| **Frontend Tests** | ❌ Not mentioned | ✅ 20+ component tests + 8+ E2E tests |
| **UI Error Handling** | ❌ Not shown | ✅ Retry UI (Attempt X/3), error messages |
| **Parallel Execution** | ❌ Sequential | ✅ Backend steps 1-4 → Frontend steps 5-8 parallel |
| **User Flows** | ❌ Not included | ✅ Create → Pay → Confirm → View audit |
| **Mobile Testing** | ❌ Not mentioned | ✅ E2E tests on 320px viewport |

---

## Summary

**The corrected workflow includes UI/UX at every stage:**

1. **Requirement Phase**: UI/UX requirements (AC-UX-*, AC-WCAG-*)
2. **Design Phase**: Backend + Frontend in parallel (components, DevExtreme, responsive, accessibility)
3. **Plan Phase**: Backend steps 1-4 sequential, Frontend steps 5-8 parallel
4. **Execute Phase**: Backend implementation + Frontend components (retry UI, error handling)
5. **Test Phase**: Backend tests (35) + Frontend tests (20+ component + 8+ E2E)
6. **Release Phase**: v1.0.0 with CDN deployment, mobile-optimized, WCAG accessible

**UI/UX is integral, not an afterthought.** 🎨
