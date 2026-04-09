# v1.1.0 Implementation Plan — Inline Powers

**Timeline**: 4-6 weeks | **Effort**: 1-2 devs | **Target Release**: Week 5-6

---

## 🎯 Phase Overview

Transform PowerStack from chat-only to inline-actions capable. Enable developers to select code and apply AI actions directly in their editor.

**Current State**: /review, /add-tests work in chat only  
**Target State**: Inline actions with visual feedback and apply buttons

---

## 📋 Work Breakdown Structure (WBS)

### Epic 1.1: Inline Action Prompts (Weeks 1-2)

#### Story 1.1.1: Create Inline Review Prompt
**Objective**: Add `/inline-review` command that shows issues next to code

**Tasks**:
1. Create `prompts/inline-review.yaml`
   - Name: `inline-review`
   - Invokable: true
   - Context mode: inline (NEW)
   - Position: side-by-side
   - Output format: Table (Severity | Line | Issue | Fix Code | [Apply] button)
   - Model: DeepSeek R1 8B (better analysis)

2. Update `config.yaml`
   - Add to prompts section
   - Set globs: `["**/*.cs", "**/*.ts"]`
   - Tie to rules: core-standards, security-guard, dotnet-csharp (if *.cs)

3. Test in Continue.dev
   - Open sample C# file
   - Select function
   - Run `/inline-review`
   - Verify: Issues appear side-by-side
   - Verify: [Apply] button present for each fix

4. Document in CHANGELOG.md
   - Added: `/inline-review` command for inline code analysis

**Acceptance Criteria**:
- ✅ Prompt template created and tested
- ✅ Works on C# and TypeScript files
- ✅ Shows 3-5 issues per function
- ✅ Includes severity levels (Critical, Warning, Info)
- ✅ [Apply] buttons functional

**Estimated Time**: 2-3 days

---

#### Story 1.1.2: Create Quick-Fix Prompt
**Objective**: Add `/quick-fix` that replaces selection with fixed code

**Tasks**:
1. Create `prompts/quick-fix.yaml`
   - Name: `quick-fix`
   - Invokable: true
   - Context mode: inline
   - Position: replace (replaces selected code)
   - Prompt template:
     ```
     Fix this code issue:
     - Remove TODO comments
     - Fix naming conventions
     - Add error handling
     - Make async/await compliant
     
     Provide ONLY the fixed code, no explanation.
     ```
   - Model: Qwen 3.5 9B (fast, accurate for small fixes)

2. Implement apply workflow
   - When user clicks [Apply]
   - Show diff preview (before/after)
   - User confirms or rejects
   - On confirm: Replace code
   - Support Ctrl+Z undo

3. Test in Continue.dev
   - Select buggy code
   - Run `/quick-fix`
   - Review suggested fix
   - Click [Apply]
   - Verify: Code replaced
   - Verify: Undo works

4. Add to config.yaml
   - Wire up in prompts section
   - Test on multiple file types

**Acceptance Criteria**:
- ✅ Fix suggestions appear with preview
- ✅ [Apply] button applies changes atomically
- ✅ Diff shown before applying
- ✅ Undo (Ctrl+Z) works correctly
- ✅ Works on C#, TypeScript, SQL

**Estimated Time**: 3-4 days

---

#### Story 1.1.3: Create Explain-Inline Prompt
**Objective**: Add `/explain-inline` that annotates selected code

**Tasks**:
1. Create `prompts/explain-inline.yaml`
   - Name: `explain-inline`
   - Invokable: true
   - Context mode: inline
   - Position: comment (adds inline comments)
   - Prompt: Explain this code with line-by-line comments

2. Implementation
   - Insert comments above each logical section
   - Use XML doc comments for methods
   - Explain WHY, not just WHAT
   - Target audience: junior developer

3. Test on real code
   - Complex LINQ queries
   - Async/await chains
   - SQL stored procedures
   - Angular components

**Acceptance Criteria**:
- ✅ Comments are clear and helpful
- ✅ Uses proper comment syntax per language
- ✅ Explains complex logic
- ✅ Follows code style conventions

**Estimated Time**: 2 days

---

#### Story 1.1.4: Create Refactor-Inline Prompt
**Objective**: Add `/refactor-inline` for targeted code transformation

**Tasks**:
1. Create `prompts/refactor-inline.yaml`
   - Name: `refactor-inline`
   - Modes:
     - Extract method (break down large function)
     - Simplify logic (reduce complexity)
     - Modernize (update to latest patterns)
     - Performance (optimize for speed)

2. Implementation
   - Present mode picker when invoked
   - User selects refactoring style
   - AI applies transformation
   - Show diff before applying

3. Test scenarios
   - 50-line method → Extract into 5 methods
   - Nested ifs → Simplify to early returns
   - Old async patterns → Modern async/await
   - N+1 queries → Batch queries

**Acceptance Criteria**:
- ✅ Mode picker works
- ✅ Transformations are sensible
- ✅ Diff preview shown
- ✅ Code quality improved post-refactor

**Estimated Time**: 3-4 days

---

#### Story 1.1.5: Create Add-Types Prompt
**Objective**: Add `/add-types` for TypeScript/C# type annotations

**Tasks**:
1. Create `prompts/add-types.yaml`
   - Name: `add-types`
   - Invokable: true
   - Context mode: inline
   - Targets: `**/*.ts`, `**/*.cs`

2. For TypeScript
   - Add parameter types
   - Add return types
   - Convert `any` to proper types
   - Add generic constraints

3. For C#
   - Add explicit types (var → explicit)
   - Add nullable reference types (T vs T?)
   - Add generic constraints
   - Improve method signatures

4. Test
   - Untyped function → Properly typed
   - Verify code still compiles
   - Verify type safety improved

**Acceptance Criteria**:
- ✅ Types added correctly
- ✅ Code still compiles/runs
- ✅ No breaking changes
- ✅ Improves IDE intellisense

**Estimated Time**: 2-3 days

---

### Epic 1.2: Multi-File Operations (Weeks 2-3)

#### Story 1.2.1: Add API Endpoint Generator
**Objective**: `/api-endpoint` creates 4 files at once (Controller, Service, DTO, Interface)

**Tasks**:
1. Create `prompts/api-endpoint.yaml`
   - Input: Endpoint name (e.g., "User")
   - Output files:
     - `Controllers/{Name}Controller.cs`
     - `Services/I{Name}Service.cs`
     - `Services/{Name}Service.cs`
     - `Models/{Name}Dto.cs`

2. Implementation
   - Parse endpoint name
   - Generate CRUD endpoints (GET, POST, PUT, DELETE)
   - Include validation, error handling, logging
   - Follow dotnet-csharp rules
   - Add XML documentation

3. Config updates
   - Add to prompts section
   - Set outputFiles configuration
   - Map template variables ({name}, {Name})

4. Test
   - Run `/api-endpoint` with "Product"
   - Verify 4 files created
   - Verify code compiles
   - Verify follows naming conventions
   - Verify DI configured

**Acceptance Criteria**:
- ✅ 4 files created automatically
- ✅ Files follow project structure
- ✅ Code compiles without errors
- ✅ Follows all rules
- ✅ Ready to use (no manual fixes needed)

**Estimated Time**: 4-5 days

---

#### Story 1.2.2: Add Feature Generator
**Objective**: `/feature` generates complete feature with multiple files

**Tasks**:
1. Create `prompts/feature.yaml`
   - Input: Feature name, description
   - Output files:
     - Controller (endpoint)
     - Service (business logic)
     - DTO (data transfer object)
     - Repository (data access)
     - Tests (unit tests)
     - Documentation (XML docs)

2. Config setup
   - outputFiles with templates
   - Variable substitution
   - File placement logic

3. Test
   - Run `/feature` with "Order Management"
   - Verify 6+ files created
   - Verify integration works
   - Verify tests are runnable

**Acceptance Criteria**:
- ✅ Multiple files generated in correct locations
- ✅ All files integrated properly
- ✅ Tests included and runnable
- ✅ Documentation complete
- ✅ Zero manual fixes required

**Estimated Time**: 5 days

---

#### Story 1.2.3: Add Component Generator (Angular)
**Objective**: `/ng-component` creates component, module, tests in one go

**Tasks**:
1. Create `prompts/ng-component.yaml`
   - Input: Component name, with/without routing
   - Output files:
     - `{name}.component.ts`
     - `{name}.component.html`
     - `{name}.component.scss`
     - `{name}.component.spec.ts`
     - `{name}.module.ts` (if not standalone)

2. Features
   - Modern Angular 17+ (standalone components)
   - OnPush change detection
   - Signals (not BehaviorSubject)
   - Typed forms (not FormGroup)
   - Complete test coverage

3. Test
   - Generate "ProductList" component
   - Verify all 5 files created
   - Verify standalone setup
   - Verify tests pass

**Acceptance Criteria**:
- ✅ All component files created
- ✅ Uses modern Angular patterns
- ✅ Tests included and passing
- ✅ Styling file included
- ✅ Ready to import and use

**Estimated Time**: 3-4 days

---

### Epic 1.3: Performance Rules (Week 3)

#### Story 1.3.1: Create Performance-Audit Rule
**Objective**: New rule file `.continue/rules/performance-audit.md`

**Content**:
```
- SQL: Avoid N+1, use SELECT specific columns, add indexes
- C#: Use async/await, minimize allocations, use Span<T>
- TypeScript: Lazy-load modules, OnPush, signals, avoid memory leaks
- General: Profile before optimizing, use benchmarks
```

**Tasks**:
1. Create `.continue/rules/performance-audit.md`
   - Name: performance-audit
   - Applies: all interactions
   - Covers: SQL, C#, TypeScript

2. Add examples
   - ❌ BAD: SELECT * FROM Orders JOIN Customers (N+1)
   - ✅ GOOD: Use SELECT with JOIN, add indexes

3. Update config.yaml
   - Add to rules section
   - Test in Continue

4. Document
   - Add to CHANGELOG.md
   - Reference in QUICK_REFERENCE.md

**Acceptance Criteria**:
- ✅ Rule file created and complete
- ✅ Covers major performance anti-patterns
- ✅ Includes examples
- ✅ Integrated into config

**Estimated Time**: 2 days

---

#### Story 1.3.2: Create Memory-Management Rule
**Objective**: `.continue/rules/memory-management.md` for GC, leaks, disposal

**Content**:
```
- C# only: Dispose pattern, using statements, IAsyncDisposable
- Detect memory leaks: Event handler cleanup, unsubscribe from events
- GC tuning: Minimize allocations, use object pools
- WeakReference for caches
```

**Tasks**:
1. Create rule file with comprehensive GC guidance
2. Add memory leak detection patterns
3. Include disposal pattern examples
4. Integrate into config

**Acceptance Criteria**:
- ✅ Covers disposal patterns
- ✅ Memory leak detection patterns included
- ✅ GC best practices documented
- ✅ Examples for common scenarios

**Estimated Time**: 2 days

---

#### Story 1.3.3: Create Async-Best-Practices Rule
**Objective**: `.continue/rules/async-best-practices.md`

**Content**:
```
ALWAYS:
- Use ConfigureAwait(false) in libraries
- CancellationToken on all async methods
- Never use .Result or .Wait()
- Use async/await, not Task.Run

NEVER:
- Fire and forget (Task without await)
- Blocking on async (GetAwaiter().GetResult())
- Thread.Sleep in async code
```

**Tasks**:
1. Create comprehensive rule
2. Add examples and anti-patterns
3. Integrate into config

**Estimated Time**: 2 days

---

#### Story 1.3.4: Create Advanced-Error-Handling Rule
**Objective**: `.continue/rules/error-handling-advanced.md`

**Content**:
```
Exception hierarchy, custom exceptions, problem details RFC 7807
Logging context, structured logging, correlation IDs
Recovery strategies, retry policies, circuit breakers
```

**Acceptance Criteria**:
- ✅ Exception strategy documented
- ✅ RFC 7807 problem details pattern included
- ✅ Recovery strategies covered

**Estimated Time**: 2 days

---

### Epic 1.4: New Prompts (Week 3-4)

#### Story 1.4.1: `/performance-check` Prompt
**Objective**: Identify slow code patterns in selection

**Tasks**:
1. Create `prompts/performance-check.yaml`
2. Analyze:
   - SQL queries (N+1, SELECT *, missing indexes)
   - C# loops and allocations
   - TypeScript component inefficiency
   - Memory leaks
3. Output: Severity, line, issue, fix code
4. Test and integrate

**Estimated Time**: 2 days

---

#### Story 1.4.2: `/memory-audit` Prompt
**Objective**: Detect memory leaks and disposal issues

**Tasks**:
1. Create prompt that finds:
   - Undisposed resources
   - Event handler leaks
   - Circular references
   - WeakReference misuse

**Estimated Time**: 1-2 days

---

#### Story 1.4.3: `/database-design` Prompt
**Objective**: Schema optimization and database design advice

**Tasks**:
1. Create prompt for:
   - Normalization review
   - Index recommendations
   - Query optimization
   - Migration strategy

**Estimated Time**: 2 days

---

#### Story 1.4.4: `/architecture-design` Prompt
**Objective**: System-level architecture advice

**Tasks**:
1. For large-scale design:
   - Microservices vs monolith
   - Database strategy
   - Caching layers
   - Event-driven architecture

**Estimated Time**: 2 days

---

#### Story 1.4.5: `/refactor-large` Prompt
**Objective**: Complex multi-file refactoring guidance

**Estimated Time**: 2 days

---

### Epic 1.5: Testing & Release (Week 4-5)

#### Story 1.5.1: Integration Testing
**Objective**: Test all new features end-to-end

**Tasks**:
1. Test each inline action (review, quick-fix, explain, refactor, add-types)
2. Test multi-file operations (api-endpoint, feature, component)
3. Test new rules (performance, memory, async, error-handling)
4. Test new prompts (performance-check, memory-audit, db-design, architecture-design, refactor-large)
5. Verify no regressions in existing features

**Acceptance Criteria**:
- ✅ All 5 inline actions work correctly
- ✅ All 3 multi-file generators work
- ✅ All 4 new rules integrate properly
- ✅ All 5 new prompts return useful results
- ✅ No regressions in v1.0.1 features

**Estimated Time**: 3-4 days

---

#### Story 1.5.2: Documentation
**Objective**: Update all docs for v1.1.0

**Tasks**:
1. Update docs/README.md
   - Add inline actions section
   - Add multi-file operations examples
   - Update feature table

2. Create docs/guides/INLINE_ACTIONS_GUIDE.md
   - How to use each inline action
   - Examples for each
   - Keyboard shortcuts

3. Update CHANGELOG.md
   - v1.1.0 section with all new features
   - Migration notes (none needed)

4. Update QUICK_REFERENCE.md
   - Add new commands
   - Add new rules

5. Create wiki/04-Inline-Actions.md
   - Deep dive on inline features
   - Use cases
   - Troubleshooting

6. Create wiki/05-Multi-File-Operations.md
   - How to generate multiple files
   - Examples
   - Integration patterns

**Estimated Time**: 3 days

---

#### Story 1.5.3: Release Preparation
**Objective**: Prepare v1.1.0 release

**Tasks**:
1. Run all tests
2. Verify no hardcoded secrets
3. Update config.yaml version number to 1.1.0
4. Create config/versions/config-v1.1.0.yaml (archive)
5. Tag release: `git tag -a v1.1.0 -m "v1.1.0: Inline Powers"`
6. Push to GitHub
7. Create release notes on GitHub

**Estimated Time**: 1 day

---

## 📊 Summary: v1.1.0 Deliverables

| Category | Quantity | Details |
|----------|----------|---------|
| **Inline Actions** | 5 | review, quick-fix, explain, refactor, add-types |
| **Multi-File Generators** | 3 | api-endpoint, feature, ng-component |
| **New Rules** | 4 | performance-audit, memory-management, async-best-practices, error-handling-advanced |
| **New Prompts** | 5 | performance-check, memory-audit, database-design, architecture-design, refactor-large |
| **Tests** | 20+ | Integration tests for all features |
| **Documentation** | 6 files | README, guides, changelog, wiki pages |

---

## ⏱️ Timeline Breakdown

```
Week 1-2: Inline Action Prompts (5 prompts)
├─ Day 1-3: inline-review
├─ Day 4-7: quick-fix
├─ Day 8-9: explain-inline
├─ Day 10-13: refactor-inline
└─ Day 14-15: add-types

Week 2-3: Multi-File Operations (3 generators)
├─ Day 16-20: api-endpoint
├─ Day 21-25: feature
└─ Day 26-29: ng-component

Week 3: Performance Rules (4 rules)
├─ Day 29-30: performance-audit
├─ Day 31-32: memory-management
├─ Day 33-34: async-best-practices
└─ Day 35-36: error-handling-advanced

Week 3-4: New Prompts (5 prompts)
├─ Day 36-37: performance-check
├─ Day 38-39: memory-audit
├─ Day 40-41: database-design
├─ Day 42-43: architecture-design
└─ Day 44-45: refactor-large

Week 4-5: Testing & Release
├─ Day 46-48: Integration testing
├─ Day 49-51: Documentation
└─ Day 52: Release preparation
```

**Total**: 36 working days = 7-8 weeks (with overlap) → 4-6 weeks with parallel work

---

## 💻 Development Tools & Setup

**Prerequisites**:
- VS Code with Continue.dev plugin (already have)
- git (already have)
- Node.js 18+ (if testing config.yaml parsing)

**Testing Approach**:
1. Test each prompt in Continue.dev manually
2. Verify output quality
3. Check rule application
4. Ensure no regressions

---

## 🎯 Success Metrics for v1.1.0

- ✅ 5 inline action prompts working flawlessly
- ✅ 3 multi-file operations generating production-ready code
- ✅ 4 new rules improving code quality
- ✅ 5 new prompts providing valuable insights
- ✅ 0% regression in existing v1.0.1 features
- ✅ 100% of new features tested
- ✅ Documentation complete and clear
- ✅ Ready for team adoption

---

## 📝 Next Steps After v1.1.0

1. Gather user feedback on inline actions
2. Identify most-used vs least-used features
3. Plan v1.2.0 based on feedback
4. Begin v1.2.0 memory system work

---

**Prepared**: 2026-04-09 | **Status**: Ready for Implementation
