# v2.0.0 Sprint Plan — Weeks 13-14 (Context & Streaming)

**Sprint Duration**: 2 weeks (10 working days)  
**Team**: 2 developers minimum  
**Goal**: Full 200K token context window + real-time streaming

---

## 📋 Sprint Overview

### Stories in Sprint
- **3.1.1**: Context Assembly Algorithm (5 days, Dev 1)
- **3.1.2**: Multi-File Context Loading (3 days, Dev 1)
- **3.1.3**: Codebase Example Extraction (4 days, Dev 1)
- **3.1.4**: Documentation & Schema Indexing (4 days, parallel Dev 2)
- **3.2.1**: Token-by-Token Streaming (4 days, Dev 2)
- **3.2.2**: Incremental Diff Display (3 days, Dev 2)
- **3.2.3**: Progress Indicators (2 days, Dev 2)

### Capacity
- **Dev 1**: 40 hours = 8 days of deep work (3.1 focus)
- **Dev 2**: 40 hours = 8 days of deep work (3.2 focus)
- **Overlap**: 2 days for integration testing

### Dependencies
- 3.1.1 (Context) must complete before 3.1.2/3.1.3
- 3.2.1 (Streaming) depends on API design from config (no blocker)
- Integration testing: Week 14 Fri

---

## 🛠️ Detailed Daily Plan

### Week 13

#### Monday (3 hours planning + 5 hours coding)

**9:00-12:00 Sprint Kickoff** (Team)
- Review sprint goals
- Review each story's acceptance criteria
- Discuss technical approach for 3.1.1 & 3.2.1
- Assign pair programming time slots
- Review config.yaml for API structure
- Identify unknowns/risks

**Dev 1 (12:00-17:00)**: Start 3.1.1 Context Assembly Algorithm
- [ ] Read the full codebase structure (using existing tools)
- [ ] Design token budget allocation algorithm
  - Input: Query + files to include + budget (190K tokens)
  - Output: Prioritized list of files + token allocation
  - Algorithm: Score each file by relevance, sort, pack into budget
- [ ] Write algorithm pseudocode in docs
- [ ] Create unit tests for budget enforcement
- [ ] Start TypeScript implementation
- **Deliverable by EOD**: Algorithm design doc + test file

**Dev 2 (12:00-17:00)**: Start 3.2.1 Token-by-Token Streaming
- [ ] Review OpenAI streaming API documentation
- [ ] Research token parsing libraries
- [ ] Design streaming architecture
  - How to parse tokens into chunks?
  - How to handle incomplete code?
  - How to apply syntax highlighting?
- [ ] Create sample streaming handler
- [ ] Write tests for token parsing
- **Deliverable by EOD**: Architecture doc + sample streaming handler

---

#### Tuesday (8 hours)

**Dev 1**: Continue 3.1.1 Context Algorithm
- [ ] Implement token counting (use js-tiktoken library)
- [ ] Implement file relevance scoring
  - Direct selection: priority 100
  - Direct dependencies: priority 90
  - Test files: priority 80
  - Documentation: priority 50
  - Example files: priority 30
- [ ] Implement budget packing (greedy algorithm)
- [ ] Write test cases
- [ ] Performance benchmark (< 100ms for typical project)
- [ ] Code review checklist
- **Target completion**: By end of day

**Dev 2**: Continue 3.2.1 Token-by-Token Streaming
- [ ] Integrate OpenAI streaming client
- [ ] Implement token chunking logic
- [ ] Build syntax highlighter integration
- [ ] Create streaming response handler
- [ ] Write integration tests
- **Status**: 50% complete

---

#### Wednesday (8 hours)

**Dev 1**: Start 3.1.2 Multi-File Context Loading
- [ ] Design file caching strategy
  - LRU cache (least recently used eviction)
  - Max size: 100MB
  - TTL: 30 minutes per file
- [ ] Implement cache with tests
- [ ] Implement parallel file loading (Promise.all)
- [ ] Add progress tracking (loaded / total)
- [ ] Performance test (target: < 2 seconds for 20 files)
- **Status**: Algorithm done (3.1.1), loading started (3.1.2)

**Dev 2**: Pair with Dev 1 on streaming integration
- [ ] Test streaming with real OpenAI API
- [ ] Fix issues from Tuesday integration
- [ ] Add error handling (network errors, timeouts)
- [ ] Test with various code lengths
- **Status**: 80% complete, debugging

---

#### Thursday (8 hours)

**Dev 1 & Dev 2**: Integration Testing
- [ ] Test 3.1.1 algorithm on real project
  - Load PowerPlay repo, select 10 random files
  - Verify context assembly works
  - Check token count accuracy
- [ ] Test 3.2.1 streaming on real API
  - Generate 100-line function with streaming
  - Verify tokens parse correctly
  - Check UI updates smoothly
- [ ] Identify and document issues
- [ ] Start writing integration tests

**Dev 1**: Continue 3.1.2 Loading
- [ ] Finalize cache implementation
- [ ] Add cache statistics tracking
- [ ] Write cache tests
- [ ] Ready for 3.1.3 dependency

---

#### Friday (8 hours, with 2hr sprint review)

**Dev 1**: Start 3.1.3 Codebase Example Extraction
- [ ] Design example indexing strategy
  - Index all test files
  - Extract successful patterns
  - Build semantic index
- [ ] Implement test file parser
- [ ] Create example matcher (find similar code)
- [ ] Write tests
- **Status**: Algorithm design complete, implementation started

**Dev 2**: 3.2.2 Incremental Diff Display
- [ ] Design diff streaming algorithm
- [ ] Implement diff parser
- [ ] Add visual formatting (colors, line numbers)
- [ ] Test with sample diffs
- **Status**: Started

**14:00-16:00 Sprint Review & Planning** (Team)
- Demo: 3.1.1 complete, 3.1.2 & 3.2.1 mostly working
- Discuss issues found
- Plan Week 14 adjustments
- Review velocity

---

### Week 14

#### Monday (8 hours)

**Dev 1**: Continue 3.1.3 Example Extraction
- [ ] Finish semantic matching for examples
- [ ] Extract 3-5 best examples per query
- [ ] Include examples in context with annotations
- [ ] Test accuracy (manual review of 10 queries)
- [ ] Performance test (< 500ms extraction)

**Dev 2**: Continue 3.2.2 Diff Display
- [ ] Finish incremental diff parsing
- [ ] Test with various diffs (additions, deletions, modifications)
- [ ] Add syntax highlighting to diffs
- [ ] Allow partial acceptance (incomplete code)
- [ ] Test display accuracy

---

#### Tuesday (8 hours)

**Dev 1**: Start 3.1.4 Documentation Indexing
- [ ] Scan docs/ folder for all markdown files
- [ ] Parse markdown into semantic chunks
- [ ] Build search index (TF-IDF or similar)
- [ ] Implement relevance matcher
- [ ] Write tests

**Dev 2**: 3.2.3 Progress Indicators
- [ ] Design progress display format
  - "Analyzing code..."
  - "Loading files..."
  - "Generating code..."
  - "Running tests..."
- [ ] Implement step tracking
- [ ] Add time estimation
- [ ] Add token counter
- [ ] Test with 5-minute task

---

#### Wednesday (8 hours)

**Dev 1**: Continue 3.1.4
- [ ] Extract database schema information
- [ ] Extract API schema information
- [ ] Include schema in context when relevant
- [ ] Test documentation matching
- [ ] Performance target: < 200ms per query

**Dev 2**: Finish 3.2.3
- [ ] Refine progress indicators based on testing
- [ ] Add cancellation support
- [ ] Test progress accuracy
- [ ] Document progress API
- **Target completion**: Today

---

#### Thursday (8 hours)

**Full Team Integration Day**

- [ ] **Integration Test Suite**
  - Combine 3.1 (context) + 3.2 (streaming)
  - Test full workflow: query → context assembly → streaming generation
  - Test with real PowerPlay repo
  - Test with real Angular/C# projects (if available)

- [ ] **Performance Testing**
  - Context assembly: < 2 seconds
  - Streaming latency: < 500ms
  - Example extraction: < 500ms
  - Diff parsing: < 100ms
  - Total: < 3.5 seconds from query to first tokens

- [ ] **Error Handling**
  - Large files (> 10MB)
  - Missing dependencies
  - Network timeouts
  - Invalid code

- [ ] **Documentation**
  - API documentation for context assembly
  - Streaming API docs
  - Architecture diagram
  - Integration guide

---

#### Friday (8 hours, with 1hr review)

**Dev 1 & Dev 2**: Final Polish & Testing

- [ ] **Code Review**
  - Peer review all changes
  - Check test coverage (> 80%)
  - Verify documentation

- [ ] **Edge Cases**
  - Circular dependencies in files
  - Very large tokens in single file
  - Unicode/non-ASCII characters
  - Binary files in directory

- [ ] **Performance Validation**
  - Run full benchmarks
  - Compare against targets
  - Document results

- [ ] **Commit & Tag**
  - Commit: "feat: Implement context assembly & streaming (Week 13-14)"
  - Create feature branch for next epics

**15:00-16:00 Sprint Review & Planning** (Team)
- Demo: All 7 stories (3.1.1-3.1.4, 3.2.1-3.2.3) complete
- Code coverage report
- Performance metrics
- Velocity: target 7 stories in 2 weeks (achieved!)
- Plan Week 15 (IDE Integration)

---

## 📊 Daily Standup Format (10 min, 09:30)

**Each Dev reports**:
```
Yesterday:
- Completed [task]
- [metric if applicable]

Today:
- Working on [task]
- Blocker: [if any]

Help Needed:
- [question/blocker]
```

---

## 🎯 Success Criteria (Sprint Done)

- ✅ All 7 stories in "Done" column (not just "In Review")
- ✅ > 80% code coverage for new code
- ✅ All unit tests passing
- ✅ Integration tests passing
- ✅ Performance targets met
- ✅ Zero critical bugs
- ✅ Documentation complete
- ✅ Code reviewed and approved

---

## 🚨 Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| OpenAI API quota exceeded | Medium | High | Request increased quota early, implement fallback |
| Large file handling (> 50MB) | Low | High | Implement file size limits, chunking strategy |
| Token counting inaccuracy | Medium | Medium | Use js-tiktoken, test extensively |
| Streaming lag on slow network | Medium | Medium | Add buffering, progressive rendering |
| Context assembly too slow | Medium | High | Optimize algorithm, cache aggressively |

---

## 📚 Reference Documents

- `config.yaml` — Check API key configuration
- `IMPLEMENTATION_PLAN_V2_0_0.md` — Full epic details
- Token counting: https://github.com/js-tiktoken/js-tiktoken
- OpenAI streaming: https://platform.openai.com/docs/api-reference/chat/create
- VS Code webview: https://code.visualstudio.com/api/extension-guides/webview

---

## 📝 Sprint Checklist

**Pre-Sprint (End of Week 12)**
- [ ] Both devs read this plan
- [ ] Dev environment set up (Node, TypeScript, test framework)
- [ ] GitHub branch created: `v2.0.0-weeks13-14`
- [ ] CI/CD configured for branch
- [ ] OpenAI API key and quota verified

**During Sprint**
- [ ] Daily standups at 09:30
- [ ] Update task board daily
- [ ] Log blockers immediately
- [ ] Code commits with story number: `feat(3.1.1): Context algorithm`

**End of Sprint**
- [ ] All stories signed off
- [ ] Sprint review completed
- [ ] Retrospective notes
- [ ] Next sprint planned (Weeks 15-16)

---

**Sprint Created**: 2026-04-09  
**Sprint Duration**: April 14-25, 2026 (estimated)  
**Team**: 2 full-time developers  
**Goal**: Ship context assembly + streaming (7 stories)
