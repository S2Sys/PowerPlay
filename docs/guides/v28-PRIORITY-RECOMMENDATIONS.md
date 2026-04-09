# v2.8.0 Priority Recommendations — Testing, Deployment & Monitoring

**Date**: 2026-04-09  
**Status**: Ready for Implementation  
**Target Release**: Q2 2026

---

## Overview

Based on comprehensive review of v2.7.0, **Testing** and **Deployment** phases are the highest-impact gaps. v2.8.0 will add **7 rules + 8 agents** to close these gaps across all tech stacks.

**Estimated effort**: 2-3 weeks  
**Files to create**: 15 (7 markdown rules + 8 prompt/agent entries in config.yaml)  
**Impact**: 100% SDLC coverage for .NET, Angular, SQL, AWS, Azure, Kubernetes stacks

---

## Critical Gap: Testing Phase

### Current State
✅ Exist:
- `testing-pyramid` rule (70/20/10 unit/integration/e2e)
- `/add-tests` agent (basic test generation)
- `/generate-tests-complete` agent (full suite)
- `/coverage-gaps` agent (coverage analysis)

❌ Missing:
- **Performance testing** (load, stress, baseline metrics)
- **Security testing** (OWASP Top 10, CWE-driven)
- **Contract testing** (Pact, Spring Cloud Contract)
- **Test data generation** (realistic fixtures, edge cases)
- **Mutation testing** (test quality measurement)

### Impact If Not Fixed
- ⚠️ Teams miss performance regressions until production
- ⚠️ Security vulnerabilities (OWASP Top 10) go untested
- ⚠️ API contracts break unexpectedly (missing consumer tests)
- ⚠️ Test data is manually created or inconsistent

---

## Critical Gap: Deployment Phase

### Current State
✅ Exist:
- `deployment-safety` rule (config, health checks, Docker, CI gates)
- `/docker-containerize` agent (Dockerfile generation)
- `/kubernetes-deploy` agent (K8s manifests)
- `/azure-setup` agent (resource provisioning)
- `/aws-design` agent (architecture patterns)

❌ Missing:
- **Blue-green/canary deployment** (safe rollout strategies)
- **Zero-downtime migrations** (backwards-compatible schema changes)
- **SLO/SLI definition** (what success looks like)
- **Alert design** (what to monitor, thresholds)
- **Database migration automation** (safe migration scripts)

### Impact If Not Fixed
- ⚠️ Deployments risk downtime or rollback hell
- ⚠️ No ability to do safe rolling updates
- ⚠️ Database migrations are manual, error-prone, risky
- ⚠️ Monitoring has no objective service level targets

---

## Recommended v2.8.0 Additions

### 7 New Rules

#### 1. `performance-testing` (60 lines)
**When to apply**: SQL, backend, frontend files  
**Coverage**: Load testing (k6, JMeter), stress testing, baseline metrics, spike testing

```yaml
- name: performance-testing
  globs: ["**/*.cs", "**/*.ts", "**/*.sql", "**/*.json"]
  alwaysApply: false
  rule: |
    Performance testing standards:
    - Load testing: Use k6 for API load tests, baseline with 100 RPS
    - Stress testing: Find breaking point, measure response time degradation
    - Spike testing: Sudden load increase, measure recovery
    - Baseline metrics: Response time (p50/p95/p99), throughput (RPS), error rate
    - Tools: k6 for API/protocol, JMeter for complex scenarios, Gatling for enterprise
    - Always test: Database queries, API endpoints, authentication flows
    - Report: Benchmark vs baseline, identify regressions, recommend optimization
```

#### 2. `contract-testing` (50 lines)
**When to apply**: API endpoints, service boundaries  
**Coverage**: Consumer-driven contracts, Pact, Spring Cloud Contract

```yaml
- name: contract-testing
  globs: ["**/*Controller*.cs", "**/*.ts", "**/api/**"]
  alwaysApply: false
  rule: |
    Contract testing standards:
    - Consumer-driven contracts (CDC): Each consumer defines contract
    - Tools: Pact (any language), Spring Cloud Contract (Java), Jest/Supertest (JS)
    - Contract broker: Publish/verify contracts in CI/CD pipeline
    - Test both: Provider (can fulfill contract), Consumer (uses contract correctly)
    - Avoid: Breaking changes detected only in integration tests or production
    - Frequency: Run contracts in every CI/CD build
```

#### 3. `security-testing` (80 lines)
**When to apply**: API endpoints, authentication, input handling  
**Coverage**: OWASP Top 10, CWE-driven testing, injection testing, auth testing

```yaml
- name: security-testing
  globs: ["**/*Controller*.cs", "**/*Service*.cs", "**/*.ts", "**/*.html"]
  alwaysApply: false
  rule: |
    Security testing standards:
    - OWASP Top 10 (2021): A01 Injection, A02 Broken Auth, A03 Injection, A04 Insecure Design...
    - CWE mapping: Each OWASP item maps to specific CWEs (CWE-89 SQL Injection, CWE-79 XSS)
    - Test cases: SQL injection, XSS, CSRF, path traversal, authentication bypass, authorization bypass
    - Tools: OWASP ZAP (automated), Burp Suite (manual), SonarQube (SAST)
    - Authentication: Test session hijacking, cookie security, MFA bypass
    - Input validation: Boundary testing, type confusion, buffer overflow
    - Output encoding: XSS prevention, encoding validation
```

#### 4. `mutation-testing` (50 lines)
**When to apply**: Test files  
**Coverage**: Test quality measurement, kill ratios, mutation analysis

```yaml
- name: mutation-testing
  globs: ["**/*Tests.cs", "**/*.spec.ts", "**/*.test.ts"]
  alwaysApply: false
  rule: |
    Mutation testing standards:
    - Tool: Stryker (JavaScript/TypeScript), Infection (PHP), PIT (Java)
    - Goal: Measure test quality by introducing mutations (defects) into code
    - Kill ratio: % of mutations caught by tests (target 80%+)
    - Workflow: Run mutation tests in local dev + CI pipeline (nightly/weekly)
    - Threshold: Fail if kill ratio < 80%, warn if < 90%
    - Survivors: Mutations NOT caught by tests indicate test weakness
    - Action: Add tests for survivors or accept as out-of-scope
```

#### 5. `blue-green-deployment` (60 lines)
**When to apply**: Deployment files, CI/CD configs  
**Coverage**: Blue-green, canary, feature flags, safe rollout strategies

```yaml
- name: blue-green-deployment
  globs: ["**/Dockerfile", "**/*.yml", "**/*.yaml", "**/appsettings*.json"]
  alwaysApply: false
  rule: |
    Blue-green deployment standards:
    - Blue-green: Two identical environments, switch traffic after validation
    - Canary: Route % of traffic to new version, monitor, gradually increase
    - Feature flags: Decouple deployment from release, disable remotely if needed
    - Rollback: 1-click rollback to previous version in < 1 minute
    - Testing: Health checks, smoke tests, synthetic monitoring in new version
    - Monitoring: Compare metrics (latency, errors, throughput) blue vs green
    - Approval gates: Automated gate approval + manual sign-off for critical changes
```

#### 6. `database-migration-zero-downtime` (70 lines)
**When to apply**: Database migration files, SQL scripts  
**Coverage**: Backwards-compatible migrations, versioning, safe column/table changes

```yaml
- name: database-migration-zero-downtime
  globs: ["**/Migrations/**", "**/*Migration*.cs", "**/*.sql"]
  alwaysApply: false
  rule: |
    Zero-downtime migration standards:
    - Backwards compatible: New code must work with OLD and NEW schema
    - Pattern: Add new columns/tables, write to both, migrate data, drop old
    - Never: Drop columns, rename columns, change types in one step
    - Safe: Constraints always ON, foreign keys consistent, tests pass
    - Versioning: Numbering (001_add_users.sql), ordered, immutable
    - Rollback: Every migration must have rollback script
    - Dry run: Test migration on production-like data volume
    - Deployment: Run migrations BEFORE deploying code (code handles both)
```

#### 7. `monitoring-observability` (80 lines)
**When to apply**: All code files  
**Coverage**: SLO/SLI definition, alert thresholds, dashboard standards

```yaml
- name: monitoring-observability
  globs: ["**/*.cs", "**/*.ts", "**/appsettings*.json", "**/*.json"]
  alwaysApply: false
  rule: |
    Monitoring & observability standards:
    - SLO (Service Level Objective): Target availability, latency, error rate
      Example: 99.9% availability, p95 latency < 200ms, error rate < 0.1%
    - SLI (Service Level Indicator): Actual measurement of SLO
      Example: (successful requests / total requests) = 99.95%
    - Error budget: Failed requests allowed without breaching SLO
      Example: 0.1% error rate = 43 seconds downtime per day
    - Alerts: Route to on-call when error budget depletes
    - Golden signals: Latency, traffic, errors, saturation (four key metrics)
    - Dashboards: Display SLOs, error budget burn rate, key metrics
    - Status page: Public communication of incidents and status
```

---

### 8 New Agents (Prompts)

#### 1. `/test-data-generation`
**Trigger**: When building tests, need realistic fixtures  
**Output**: SQL insert statements, JSON fixtures, test object builders

```
Prompt:
Generate realistic test data for [model/table]:
Step 1: Identify fields and constraints (required, unique, foreign keys, ranges)
Step 2: Generate edge cases (min/max values, nulls, boundaries)
Step 3: Create 5 realistic records (normal case) + 5 edge cases
Step 4: If SQL, output INSERT statements; if JSON, output fixture files
Step 5: Include timestamps (created/updated), soft delete flags
Output: Runnable test data with explanations
```

#### 2. `/load-test-plan`
**Trigger**: Need to load test an API or database  
**Output**: k6 or JMeter script, load profile, success criteria

```
Prompt:
Create load test for [endpoint/scenario]:
Step 1: Identify baseline (current throughput, latency)
Step 2: Define load profile (ramp up, steady state, spike, stress)
Step 3: Generate k6 script (or JMeter XML) with think time
Step 4: Define success criteria (p95 < Xms, error rate < Y%)
Step 5: Include baseline comparison and regression detection
Output: Executable load test script + acceptance criteria
```

#### 3. `/contract-test-setup`
**Trigger**: When designing API contract between services  
**Output**: Pact test skeleton, consumer/provider test structure

```
Prompt:
Generate contract test for [API endpoint]:
Step 1: Extract OpenAPI spec (or ask for endpoint details)
Step 2: Define consumer expectations (request/response examples)
Step 3: Generate Pact test skeleton (consumer + provider)
Step 4: Include authentication, edge cases, error responses
Step 5: Setup contract broker integration for CI/CD
Output: Ready-to-run Pact test files + CI/CD integration code
```

#### 4. `/owasp-test-plan`
**Trigger**: Need security test cases for OWASP Top 10  
**Output**: Test cases for injection, auth bypass, XSS, CSRF, etc.

```
Prompt:
Generate OWASP security tests for [endpoint/feature]:
Step 1: Identify OWASP risks (Injection, Auth, XSS, CSRF, etc.)
Step 2: Map to CWEs (SQL Injection = CWE-89, XSS = CWE-79)
Step 3: Generate test cases for each risk
Step 4: Include payloads (SQL injection, XSS, path traversal)
Step 5: Integrate with ZAP/Burp Suite scanning (if applicable)
Output: Test cases + attack payloads + remediation guidance
```

#### 5. `/deployment-strategy`
**Trigger**: Planning deployment for new feature or major change  
**Output**: Blue-green/canary plan, rollback strategy, monitoring setup

```
Prompt:
Plan safe deployment for [change]:
Step 1: Risk assessment (database, API, breaking changes, blast radius)
Step 2: Choose strategy (blue-green, canary, rolling, feature flag)
Step 3: Define success criteria (health checks, smoke tests, metrics)
Step 4: Plan rollback (time limit, automated triggers, manual approval)
Step 5: Setup monitoring (compare metrics, error budget alerts)
Output: Deployment plan + rollback checklist + monitoring setup
```

#### 6. `/migration-script-generation`
**Trigger**: Need to generate safe database migration  
**Output**: Numbered SQL migration script with rollback

```
Prompt:
Generate safe migration for [schema change]:
Step 1: Analyze schema (current state, target state, backwards compat)
Step 2: Plan steps (add columns, migrate data, drop old, constraints)
Step 3: Generate forward migration (001_change.sql)
Step 4: Generate rollback migration (001_change_rollback.sql)
Step 5: Include validation queries and dry-run plan
Output: Forward + rollback scripts + testing plan + deployment guide
```

#### 7. `/slo-definition`
**Trigger**: Defining service level objectives  
**Output**: SLO/SLI definitions, error budget calculation, alert thresholds

```
Prompt:
Define SLOs for [service/API]:
Step 1: Identify golden signals (latency, throughput, errors, saturation)
Step 2: Set targets (e.g., 99.9% availability, p95 < 200ms, error rate < 0.1%)
Step 3: Calculate error budget (allowed downtime per period)
Step 4: Define SLIs (how to measure each SLO)
Step 5: Setup alert rules (alert when error budget depletes at risk)
Output: SLO/SLI definitions + error budget burn rate + alert thresholds
```

#### 8. `/alert-design`
**Trigger**: Designing monitoring alerts and dashboards  
**Output**: Alert rules, threshold values, dashboard layout

```
Prompt:
Design alerts for [service/system]:
Step 1: Golden signals (latency, throughput, errors, saturation)
Step 2: Business metrics (conversion rate, revenue, user activity)
Step 3: Infrastructure metrics (CPU, memory, disk, network)
Step 4: Define alert thresholds (p95 latency, error rate, resource usage)
Step 5: Setup escalation (alert → page → incident)
Step 6: Design dashboard (key metrics, status, SLO progress)
Output: Prometheus/Datadog alert rules + dashboard config + on-call runbook
```

---

## Implementation Order & Effort

### Week 1: Rules Definition
1. Create 7 rule markdown files (performance-testing, contract-testing, security-testing, mutation-testing, blue-green-deployment, database-migration, monitoring-observability)
2. Add rules to config.yaml under new section `# ── v2.8.0 Testing, Deployment & Monitoring Rules`
3. Estimated: 6-8 hours

### Week 2: Agents/Prompts
1. Add 8 agent prompts to config.yaml under `# ── v2.8.0 Testing, Deployment & Monitoring Agents`
2. Create detailed prompt content for each agent
3. Estimated: 4-6 hours

### Week 3: Documentation & Testing
1. Update README.md with v2.8.0 capabilities
2. Update CHANGELOG.md with new rules/agents
3. Archive config-v2.8.0.yaml
4. Create v2.8.0 implementation summary
5. Test all agents in Continue.dev
6. Estimated: 4-6 hours

**Total estimated effort**: 15-20 hours (2-3 developer days)

---

## Success Criteria

- [ ] 7 new rules created with clear standards
- [ ] 8 new agents with detailed prompts
- [ ] All agents tested in Continue.dev
- [ ] Documentation updated (README, CHANGELOG)
- [ ] v2.8.0 implementation summary created
- [ ] Version archived in config/versions/config-v2.8.0.yaml
- [ ] Coverage matrix shows ✅ for Testing & Deployment phases

---

## Recommended Next Steps After v2.8.0

1. **v2.9.0** (Q3): Platform-specific mobile rules (iOS, Android) + microservices patterns (event sourcing, DDD, saga pattern)
2. **v3.0.0** (Q4): ML/AI integration, analytics/BI, advanced security (IAM, secrets management)

---

## Attachment A: Full Rules Template

Each rule file should follow this template:

```yaml
---
name: rule-name
description: Clear one-line description
domains: [list of related domains]
---

# Rule Title

**Applies to**: File patterns and scenarios  
**Goal**: What this rule enables  
**Standard**: The actual standard to follow

## Principles
1. First principle...
2. Second principle...

## Good Example
[code example showing correct pattern]

## Bad Example
[code example showing anti-pattern]

## Related Rules
- Cross-references to other rules
- Links to learning resources
```

---

## Attachment B: Agent Prompt Template

```yaml
- name: agent-name
  description: |
    Short description (30 words max)
    Output type: Code, Config, Guidance, Plan, Checklist
  slashCommand: "/command-name"
  command: |
    Step-by-step guidance:
    Step 1: ...
    Step 2: ...
    Step 3: ...
    Step 4: ...
    Step 5: ...
    Output: What the user will receive
```

---

