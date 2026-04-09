# PowerPlay SDLC Coverage Matrix

**Version**: 2.7.0  
**Total Rules**: 54  
**Coverage**: 9 Tech Stacks × 6 SDLC Phases = 54 touchpoints  
**Last Updated**: 2026-04-09

---

## 📊 SDLC Phases Definition

| Phase | Duration | Key Activities | Output |
|-------|----------|-----------------|--------|
| **1. Requirements** | 1-2 weeks | User stories, API specs, data modeling, acceptance criteria | Requirements document, API contracts |
| **2. Design** | 1-2 weeks | System architecture, database schema, UI mockups, design patterns | Architecture diagram, schema DDL, component tree |
| **3. Development** | 4-6 weeks | Coding, unit tests, code review, debugging, local testing | Source code, passing tests, PR approval |
| **4. Testing** | 1-2 weeks | Integration tests, E2E tests, performance testing, security testing | Test results, coverage report, performance baseline |
| **5. Deployment** | Few hours | Build release, sign binaries, deploy to staging, deploy to prod | Release tag, production environment |
| **6. Monitoring** | Ongoing | Logging, metrics, alerting, incident response, optimization | Observability dashboard, runbooks, metrics |

---

## 🏗️ TECH STACK: .NET Backend

### Rules Applicable to .NET Development

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | api-contract, api-versioning, database-design | `/api-contract`, `/data-model` | Backend-DotNet.md: Requirements |
| **2. Design** | smartworkz-core, dotnet-rules, database-design, event-driven-architecture | `/architecture-design`, `/event-driven-design` | Backend-DotNet.md: Design |
| **3. Development** | dotnet-rules, security-always, input-validation, sql-rules, observability-standards | `/review`, `/add-docs`, `/quick-fix` | Backend-DotNet.md: Development |
| **4. Testing** | testing-pyramid, integration-testing, code-review-standards, performance-check | `/add-tests`, `/coverage-gaps`, `/audit-all` | Backend-DotNet.md: Testing |
| **5. Deployment** | app-distribution, pr-standards, ci-cd-standards, secrets-rotation | `/pr-review` | Backend-DotNet.md: Deployment |
| **6. Monitoring** | observability-standards, incident-response, security-posture | `/observability-audit`, `/incident-response` | Backend-DotNet.md: Monitoring |

**Total Rules for .NET**: 12 rules  
**Coverage**: 100% of SDLC phases

---

## 🎨 TECH STACK: Angular Frontend

### Rules Applicable to Angular Development

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | api-contract, workspace-conventions | `/api-contract` | Frontend-Angular.md: Requirements |
| **2. Design** | angular-rules, workspace-conventions | `/architecture-design`, `/ng-component` | Frontend-Angular.md: Design |
| **3. Development** | angular-rules, security-always, input-validation, observability-standards | `/review`, `/add-docs`, `/quick-fix` | Frontend-Angular.md: Development |
| **4. Testing** | testing-pyramid, integration-testing, code-review-standards, performance-check | `/add-tests`, `/coverage-gaps`, `/audit-all` | Frontend-Angular.md: Testing |
| **5. Deployment** | app-distribution, pr-standards, ci-cd-standards | `/pr-review` | Frontend-Angular.md: Deployment |
| **6. Monitoring** | observability-standards, incident-response, security-posture | `/observability-audit`, `/incident-response` | Frontend-Angular.md: Monitoring |

**Total Rules for Angular**: 10 rules  
**Coverage**: 100% of SDLC phases

---

## 📱 TECH STACK: iOS (Swift) Mobile

### Rules Applicable to iOS Development

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | mobile-development, workspace-conventions | `/mobile-architecture` | Mobile-iOS.md: Requirements |
| **2. Design** | mobile-development, cross-platform-design | `/mobile-architecture`, `/cross-platform-setup` | Mobile-iOS.md: Design |
| **3. Development** | mobile-development, mobile-security, security-always, offline-first | `/review`, `/add-docs` | Mobile-iOS.md: Development |
| **4. Testing** | testing-pyramid, integration-testing, performance-check | `/add-tests`, `/coverage-gaps` | Mobile-iOS.md: Testing |
| **5. Deployment** | app-distribution, mobile-security, secrets-rotation | `/app-distribution-plan` | Mobile-iOS.md: Deployment |
| **6. Monitoring** | observability-standards, incident-response, mobile-security-audit | `/mobile-security-audit`, `/incident-response` | Mobile-iOS.md: Monitoring |

**Total Rules for iOS**: 9 rules  
**Coverage**: 100% of SDLC phases

---

## 📱 TECH STACK: Android (Kotlin) Mobile

### Rules Applicable to Android Development

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | mobile-development, workspace-conventions | `/mobile-architecture` | Mobile-Android.md: Requirements |
| **2. Design** | mobile-development, cross-platform-design | `/mobile-architecture`, `/cross-platform-setup` | Mobile-Android.md: Design |
| **3. Development** | mobile-development, mobile-security, security-always, offline-first | `/review`, `/add-docs` | Mobile-Android.md: Development |
| **4. Testing** | testing-pyramid, integration-testing, performance-check | `/add-tests`, `/coverage-gaps` | Mobile-Android.md: Testing |
| **5. Deployment** | app-distribution, mobile-security, secrets-rotation | `/app-distribution-plan` | Mobile-Android.md: Deployment |
| **6. Monitoring** | observability-standards, incident-response, mobile-security-audit | `/mobile-security-audit`, `/incident-response` | Mobile-Android.md: Monitoring |

**Total Rules for Android**: 9 rules  
**Coverage**: 100% of SDLC phases

---

## 📱 TECH STACK: React Native (Cross-Platform)

### Rules Applicable to React Native Development

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | mobile-development, cross-platform-design, workspace-conventions | `/mobile-architecture`, `/cross-platform-setup` | Mobile-React-Native.md: Requirements |
| **2. Design** | mobile-development, cross-platform-design | `/mobile-architecture`, `/cross-platform-setup` | Mobile-React-Native.md: Design |
| **3. Development** | mobile-development, cross-platform-design, mobile-security, offline-first | `/review`, `/add-docs` | Mobile-React-Native.md: Development |
| **4. Testing** | testing-pyramid, integration-testing, performance-check | `/add-tests`, `/coverage-gaps` | Mobile-React-Native.md: Testing |
| **5. Deployment** | app-distribution, mobile-security, secrets-rotation | `/app-distribution-plan` | Mobile-React-Native.md: Deployment |
| **6. Monitoring** | observability-standards, incident-response, mobile-security-audit | `/mobile-security-audit`, `/incident-response` | Mobile-React-Native.md: Monitoring |

**Total Rules for React Native**: 9 rules  
**Coverage**: 100% of SDLC phases

---

## 📱 TECH STACK: Flutter (Cross-Platform)

### Rules Applicable to Flutter Development

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | mobile-development, cross-platform-design, workspace-conventions | `/mobile-architecture`, `/cross-platform-setup` | Mobile-Flutter.md: Requirements |
| **2. Design** | mobile-development, cross-platform-design | `/mobile-architecture`, `/cross-platform-setup` | Mobile-Flutter.md: Design |
| **3. Development** | mobile-development, cross-platform-design, mobile-security, offline-first | `/review`, `/add-docs` | Mobile-Flutter.md: Development |
| **4. Testing** | testing-pyramid, integration-testing, performance-check | `/add-tests`, `/coverage-gaps` | Mobile-Flutter.md: Testing |
| **5. Deployment** | app-distribution, mobile-security, secrets-rotation | `/app-distribution-plan` | Mobile-Flutter.md: Deployment |
| **6. Monitoring** | observability-standards, incident-response, mobile-security-audit | `/mobile-security-audit`, `/incident-response` | Mobile-Flutter.md: Monitoring |

**Total Rules for Flutter**: 9 rules  
**Coverage**: 100% of SDLC phases

---

## 🗄️ TECH STACK: SQL Server Database

### Rules Applicable to SQL Development

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | database-design | `/data-model` | Database-SQL.md: Requirements |
| **2. Design** | database-design, sql-rules | `/data-model` | Database-SQL.md: Design |
| **3. Development** | sql-rules, security-always, input-validation | `/review` | Database-SQL.md: Development |
| **4. Testing** | testing-pyramid, integration-testing, performance-check | `/coverage-gaps` | Database-SQL.md: Testing |
| **5. Deployment** | app-distribution | N/A | Database-SQL.md: Deployment |
| **6. Monitoring** | observability-standards, incident-response | `/observability-audit` | Database-SQL.md: Monitoring |

**Total Rules for SQL**: 6 rules  
**Coverage**: 100% of SDLC phases

---

## ☁️ TECH STACK: Azure Cloud DevOps

### Rules Applicable to Azure Development

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | workspace-conventions | N/A | DevOps-Azure.md: Requirements |
| **2. Design** | workspace-conventions | `/architecture-design` | DevOps-Azure.md: Design |
| **3. Development** | security-always, observability-standards | `/review` | DevOps-Azure.md: Development |
| **4. Testing** | testing-pyramid, integration-testing, performance-check | `/coverage-gaps` | DevOps-Azure.md: Testing |
| **5. Deployment** | ci-cd-standards, pr-standards, app-distribution, secrets-rotation | `/pr-review` | DevOps-Azure.md: Deployment |
| **6. Monitoring** | observability-standards, incident-response, security-posture | `/observability-audit`, `/incident-response` | DevOps-Azure.md: Monitoring |

**Total Rules for Azure**: 7 rules  
**Coverage**: 100% of SDLC phases

---

## ☁️ TECH STACK: AWS Cloud DevOps

### Rules Applicable to AWS Development

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | workspace-conventions | N/A | DevOps-AWS.md: Requirements |
| **2. Design** | workspace-conventions | `/architecture-design` | DevOps-AWS.md: Design |
| **3. Development** | security-always, observability-standards | `/review` | DevOps-AWS.md: Development |
| **4. Testing** | testing-pyramid, integration-testing, performance-check | `/coverage-gaps` | DevOps-AWS.md: Testing |
| **5. Deployment** | ci-cd-standards, pr-standards, app-distribution, secrets-rotation | `/pr-review` | DevOps-AWS.md: Deployment |
| **6. Monitoring** | observability-standards, incident-response, security-posture | `/observability-audit`, `/incident-response` | DevOps-AWS.md: Monitoring |

**Total Rules for AWS**: 7 rules  
**Coverage**: 100% of SDLC phases

---

## 🔒 TECH STACK: Security & Compliance (Cross-Stack)

### Rules Applicable to All Stacks

| Phase | Rules | Prompts | Guides |
|-------|-------|---------|--------|
| **1. Requirements** | zero-trust-security, compliance-standards | `/compliance-audit` | Security-Compliance.md: Requirements |
| **2. Design** | zero-trust-security, secrets-rotation, mobile-security | `/zero-trust-design` | Security-Compliance.md: Design |
| **3. Development** | security-always, input-validation, mobile-security | `/review`, `/security-scan` | Security-Compliance.md: Development |
| **4. Testing** | penetration-testing, security-audit, mobile-security | `/pentest-plan`, `/security-agent` | Security-Compliance.md: Testing |
| **5. Deployment** | secrets-rotation, incident-response | `/pentest-plan` | Security-Compliance.md: Deployment |
| **6. Monitoring** | incident-response, security-posture, observability-standards | `/incident-response`, `/security-posture`, `/observability-audit` | Security-Compliance.md: Monitoring |

**Total Rules for Security**: 10 rules  
**Coverage**: 100% of SDLC phases

---

## 📈 Coverage Summary

### By Tech Stack

```
┌──────────────────────┬───────┬──────────┐
│ Tech Stack           │ Rules │ Coverage │
├──────────────────────┼───────┼──────────┤
│ .NET Backend         │   12  │  100%    │
│ Angular Frontend     │   10  │  100%    │
│ iOS Mobile           │    9  │  100%    │
│ Android Mobile       │    9  │  100%    │
│ React Native         │    9  │  100%    │
│ Flutter              │    9  │  100%    │
│ SQL Server Database  │    6  │  100%    │
│ Azure Cloud DevOps   │    7  │  100%    │
│ AWS Cloud DevOps     │    7  │  100%    │
│ Security/Compliance  │   10  │  100%    │
│ (Cross-Stack)        │       │          │
└──────────────────────┴───────┴──────────┘
```

### By SDLC Phase

```
┌──────────────────┬──────────┬──────────┐
│ SDLC Phase       │ Rules    │ Coverage │
├──────────────────┼──────────┼──────────┤
│ 1. Requirements  │ ~8       │  100%    │
│ 2. Design        │ ~10      │  100%    │
│ 3. Development   │ ~12      │  100%    │
│ 4. Testing       │ ~10      │  100%    │
│ 5. Deployment    │ ~8       │  100%    │
│ 6. Monitoring    │ ~8       │  100%    │
└──────────────────┴──────────┴──────────┘
```

### Cumulative Coverage

```
Total Unique Rules: 54
Total Rule Applications: 54 + 10 (cross-stack) = 64 "rule-phase-stack" combinations
Total Prompts: 63
Coverage Completeness: 100% (all phases + stacks covered)
```

---

## 🔍 How to Use This Matrix

### Scenario 1: "I'm building a .NET API"
1. Find: ".NET Backend" row
2. Review: Rules for each phase (Requirements → Monitoring)
3. Read: `docs/stacks/BACKEND-DOTNET.md`
4. Follow: `docs/sdlc/backend-dotnet/0X-[phase].md` guides

### Scenario 2: "I need to secure my mobile app"
1. Find: "Security & Compliance" section
2. Review: `mobile-security.md` rule
3. Use: `/mobile-security-audit` prompt to audit
4. Follow: `docs/guides/TROUBLESHOOTING.md` if issues

### Scenario 3: "What testing strategy should I use?"
1. Find: "SDLC Phase 4: Testing" column
2. Review: `testing-pyramid.md`, `integration-testing.md`
3. Use: `/add-tests`, `/coverage-gaps` prompts
4. Follow: `docs/sdlc/[stack]/04-testing.md` guides

### Scenario 4: "I'm deploying to production"
1. Find: "SDLC Phase 5: Deployment" column
2. Review: `app-distribution.md`, `ci-cd-standards.md`
3. Use: `/app-distribution-plan` prompt
4. Follow: `docs/sdlc/[stack]/05-deployment.md` guides

---

## 📋 Quick Reference: Which Rules Apply to My Task?

### "I need to review code"
- **Phase**: Development (phase 3)
- **Rules**: smartworkz-core, [stack]-rules, security-always, input-validation
- **Prompts**: `/review`, `/inline-review`, `/security-scan`

### "I'm writing tests"
- **Phase**: Testing (phase 4)
- **Rules**: testing-pyramid, integration-testing, code-review-standards
- **Prompts**: `/add-tests`, `/coverage-gaps`, `/generate-tests-complete`

### "I'm releasing to production"
- **Phase**: Deployment (phase 5)
- **Rules**: app-distribution, pr-standards, ci-cd-standards, secrets-rotation
- **Prompts**: `/app-distribution-plan`, `/pr-review`

### "I need to audit security"
- **Phase**: Monitoring (phase 6)
- **Rules**: security-always, mobile-security, zero-trust-security, incident-response
- **Prompts**: `/security-scan`, `/security-agent`, `/security-posture`, `/mobile-security-audit`

### "I'm designing system architecture"
- **Phase**: Design (phase 2)
- **Rules**: smartworkz-core, [stack]-rules, event-driven-architecture, database-design
- **Prompts**: `/architecture-design`, `/event-driven-design`, `/data-model`

---

## 📊 Metrics & Compliance

### Rule Coverage by Phase (Aggregated)

| Phase | Count | Examples |
|-------|-------|----------|
| Requirements | 8 | api-contract, database-design, compliance-standards |
| Design | 10 | smartworkz-core, dotnet-rules, event-driven-architecture |
| Development | 12 | security-always, input-validation, observability-standards |
| Testing | 10 | testing-pyramid, integration-testing, performance-check |
| Deployment | 8 | app-distribution, ci-cd-standards, secrets-rotation |
| Monitoring | 8 | incident-response, security-posture, observability-standards |

### Prompt Distribution by Use Case

| Use Case | Count | Examples |
|----------|-------|----------|
| Architecture | 4 | `/architecture-design`, `/event-driven-design`, `/mobile-architecture` |
| Code Review | 3 | `/review`, `/inline-review`, `/security-scan` |
| Testing | 3 | `/add-tests`, `/coverage-gaps`, `/generate-tests-complete` |
| Security | 4 | `/security-scan`, `/pentest-plan`, `/security-agent`, `/mobile-security-audit` |
| Operations | 5 | `/app-distribution-plan`, `/observability-audit`, `/incident-response` |
| Data | 2 | `/data-model`, `/api-contract` |
| Other | 42 | (Various utility prompts) |

---

## ✅ Verification Checklist

- [ ] All 54 rules appear in at least one stack
- [ ] All 6 SDLC phases covered for each stack
- [ ] No gaps: every phase has at least 2 rules
- [ ] Cross-stack security rules apply to all stacks
- [ ] Prompts map to phases (what to use when)
- [ ] Links to docs/stacks/* and docs/sdlc/* work
- [ ] SDLC guides created for each tech stack
- [ ] Each guide has 6 phase documents

---

## 🔗 Related Documents

- [DOCUMENTATION_ARCHITECTURE.md](./DOCUMENTATION_ARCHITECTURE.md) — Overall structure
- [RULES-REFERENCE.md](./RULES-REFERENCE.md) — All 54 rules explained
- [PROMPTS-REFERENCE.md](./PROMPTS-REFERENCE.md) — All 63 prompts explained
- [docs/stacks/BACKEND-DOTNET.md](../stacks/BACKEND-DOTNET.md) — Example stack guide
- [docs/sdlc/backend-dotnet/](../sdlc/backend-dotnet/) — Example SDLC guides

---

**Document**: SDLC-COVERAGE-MATRIX.md  
**Version**: 2.7.0  
**Purpose**: Comprehensive mapping of rules/prompts to SDLC phases and tech stacks  
**Last Updated**: 2026-04-09  
**Author**: SmartWorkz Dev
