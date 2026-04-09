# UXPro Integration Proposal — Add UX Design Agent Rules to PowerPlay v2.2.0

**Date**: 2026-04-09  
**Status**: Analysis Complete  
**Version**: UXPro v3.0.0 Analysis  

---

## 📊 Analysis Summary

### What is UXPro?
UXPro is a **comprehensive UI/UX design system** for AI-powered coding assistants (Claude Code, Cursor, Windsurf, Cline, Continue.dev). It provides:

- **30 detailed design sections** (colors, typography, spacing, accessibility, motion, patterns)
- **WCAG 2.1 AA compliance** standards
- **Design tokens** (colors, spacing, typography scales)
- **Responsive breakpoints** (320px - 1536px+)
- **Component patterns** (buttons, forms, modals, cards)
- **Animation principles** (GPU-accelerated, motion guidelines)
- **Accessibility rules** (focus states, ARIA labels, semantic HTML)

### Current Structure
```
.continue/UXPro/
├── core/
│   ├── UIUX-SYSTEM-PROMPT.md         (Quick-reference prompt)
│   ├── UIUX-MASTER-PROMPT-SYSTEM.md  (Complete 29-section guide)
│   ├── design-tokens.css              (Color/spacing/typography vars)
│   └── VERSION.json                   (Version tracking)
├── docs/
│   ├── guides/                        (Platform installation guides)
│   ├── CHANGELOG.md                   (Version history)
│   └── UPDATE_GUIDE.md                (Update instructions)
├── examples/                          (Implementation patterns)
├── setup/                             (Automated setup)
└── README.md                          (Main documentation)
```

---

## 💡 Strategic Recommendation

### **YES — Integrate UXPro into PowerPlay as v2.2.0 UX Design Agent Suite**

**Rationale:**
1. **Perfect complement** to existing data/observability focus (v2.1.0)
2. **Fills critical gap** — no UI/UX agent capability currently in PowerPlay
3. **Production-ready** — UXPro is mature (v3.0.0), comprehensive, tested
4. **Seamless integration** — same YAML + rule.md structure as v2.0.0/v2.1.0
5. **High-value prompts** — 5+ new UX agent commands enable UI generation, design audits, accessibility checks

---

## 🎯 Proposed v2.2.0 Implementation

### New Prompts (5 UX Agent Commands)

```yaml
# ── v2.2.0 UX Design Prompts ──────────────────────────

- name: design-component
  description: "Generate accessible UI component with UXPro standards"
  invokable: true
  prompt: |
    Generate a complete accessible UI component using UXPro design system:
    Step 1: Structure — semantic HTML, accessibility-first
    Step 2: Styling — 60-30-10 color rule, typography scale, 8-point grid
    Step 3: States — default, hover, active, focus, disabled, loading
    Step 4: Responsive — mobile-first, clamp() fluid typography, breakpoints
    Step 5: Accessibility — WCAG 2.1 AA contrast, ARIA labels, focus indicators
    Output: Complete component code + CSS + HTML structure + accessibility checklist.

- name: design-audit
  description: "WCAG audit of UI component — accessibility, contrast, responsive"
  invokable: true
  prompt: |
    Accessibility audit of this UI component:
    Step 1: Contrast audit — check all text/UI against 4.5:1 (normal) and 3:1 (large)
    Step 2: Focus states — verify visible focus indicators, keyboard navigation
    Step 3: ARIA — check semantic HTML, ARIA labels for icon-only buttons
    Step 4: Responsive — test across breakpoints (320px, 480px, 768px, 1024px, 1280px)
    Step 5: Motion — check animation GPU acceleration, prefers-reduced-motion support
    Output: Audit table (Issue | WCAG Level | Severity | Fix Code) + remediation checklist.

- name: design-system
  description: "Analyze and generate design system tokens and guidelines"
  invokable: true
  prompt: |
    Analyze this project's design system or generate one using UXPro standards:
    Step 1: Color palette — 60-30-10 rule, semantic tokens (primary, secondary, success, danger)
    Step 2: Typography — scale (1.25 ratio), line heights, max widths (65ch)
    Step 3: Spacing — 8-point grid, token values (4px, 8px, 16px, 24px, 32px, 48px, 64px)
    Step 4: Components — button hierarchy, form inputs, cards, modals, navigation
    Step 5: Tokens file — CSS variables ready to use, design tokens for Figma
    Output: Complete design tokens CSS file + design documentation + usage examples.

- name: responsive-design
  description: "Check responsive design across breakpoints and devices"
  invokable: true
  prompt: |
    Responsive design audit of this component/layout:
    Step 1: Mobile-first check — base styles at 320px, progressive enhancement
    Step 2: Breakpoint testing — verify at 480px, 768px, 1024px, 1280px, 1536px
    Step 3: Fluid scaling — check clamp() for typography, container queries where needed
    Step 4: Touch targets — verify 44×44px minimum, 8px gaps between interactive elements
    Step 5: Content reflow — check text wrapping, image sizing, layout shift prevention
    Output: Breakpoint table with issues + before/after code for each breakpoint + performance notes.

- name: motion-design
  description: "Review animations for accessibility, GPU acceleration, performance"
  invokable: true
  prompt: |
    Motion and animation audit:
    Step 1: GPU acceleration — verify ONLY transform and opacity animated (never width/height/margin)
    Step 2: Durations — check against standards (50ms instant, 100ms fast, 200ms normal, 300ms slow)
    Step 3: Easing — verify ease-out default, bounce for playful, ease-in for exit
    Step 4: Accessibility — check prefers-reduced-motion media query support
    Step 5: Performance — verify no layout thrashing, smooth 60fps animations
    Output: Animation audit table + remediation code + performance guidelines.
```

### New Rules (5 UX Design Rules)

**1. ux-design-system.md** (350+ lines)
- 60-30-10 color rule, semantic tokens
- Typography scale (1.25 Major Third)
- 8-point spacing grid
- Responsive breakpoints (320px - 1536px+)
- Component hierarchy
- Dark mode support
- Design tokens format

**2. accessibility-wcag.md** (400+ lines)
- WCAG 2.1 AA compliance checklist
- Contrast requirements (4.5:1 normal, 3:1 large)
- Focus indicators and keyboard navigation
- ARIA labels and semantic HTML
- Touch target sizes (44×44px minimum)
- Color not conveyed alone
- Screen reader testing
- Testing tools

**3. responsive-mobile-first.md** (350+ lines)
- Mobile-first approach
- Breakpoint strategy (320px, 480px, 768px, 1024px, 1280px)
- Fluid typography (clamp())
- Container queries
- Touch-friendly design
- Image responsive strategies
- Layout shift prevention
- Testing across devices

**4. animation-motion.md** (300+ lines)
- GPU-accelerated animations (transform, opacity only)
- Duration standards (50ms, 100ms, 200ms, 300ms, 500ms)
- Easing functions (ease-out, ease-in, bounce)
- prefers-reduced-motion support
- Micro-interactions
- Loading states and skeletons
- Transition guidelines

**5. design-tokens.md** (250+ lines)
- Token structure (colors, spacing, typography, shadows)
- CSS custom properties format
- Figma design tokens sync
- Token naming conventions
- Light/dark mode token pairs
- Usage patterns
- Token tooling (design-tokens CLI)

### Models (Optional Enhancement)

Could add specialized models for design tasks:
- "Claude 3.5 Sonnet [UI Designer]" — for component generation, design decisions
- "GPT-4 Vision [Design Reviewer]" — for visual design feedback (optional, future)

---

## 🔄 Integration Steps (v2.2.0)

### Phase 1: Create Rule Files (Week 1)
1. Extract UXPro content into 5 rule files (.continue/rules/)
2. Align rule structure with existing PowerPlay rules (frontmatter, ALWAYS/NEVER, examples)
3. Add globs for frontend files (*.tsx, *.jsx, *.css, *.scss, *.html)

### Phase 2: Add Prompts to config.yaml (Week 1)
1. Add 5 new UX prompts after v2.1.0 prompts section
2. Add prompt descriptions
3. Tag with `# ── v2.2.0 UX Design Prompts` header

### Phase 3: Add Rules to config.yaml (Week 1)
1. Add 5 new rules after v2.1.0 rules section
2. Define globs for each rule:
   - `ux-design-system.md` → `["**/*.tsx", "**/*.jsx", "**/*.css", "**/*.scss"]`
   - `accessibility-wcag.md` → `["**/*.tsx", "**/*.jsx", "**/*.html"]`
   - `responsive-mobile-first.md` → `["**/*.tsx", "**/*.jsx", "**/*.css", "**/*.scss"]`
   - `animation-motion.md` → `["**/*.tsx", "**/*.jsx", "**/*.ts", "**/*.css"]`
   - `design-tokens.md` → `["**/*.css", "**/*.scss", "**/tokens/*"]`
2. Tag with `# ── v2.2.0 UX Design Rules` header

### Phase 4: Documentation & Release (Week 2)
1. Update CHANGELOG.md with v2.2.0 section
2. Create config-v2.2.0.yaml archive
3. Write V2_2_0_IMPLEMENTATION_SUMMARY.md
4. Update docs/README.md (version badge, capabilities count)
5. Update INDEX.md (new rules, new prompts, file stats)
6. Git commit and push

---

## 📈 Impact on PowerPlay

### Current State (v2.1.0)
- **Models**: 14 (5 local + 9 cloud)
- **Rules**: 24 (6 core + 5 v2.0.0 + 5 v2.1.0)
- **Prompts**: 33 (10 core + 13 v1.1-1.2 + 5 v2.0.0 + 5 v2.1.0)

### After v2.2.0
- **Models**: 14 (unchanged, could add UI specialist model)
- **Rules**: 29 (24 + 5 v2.2.0)
- **Prompts**: 38 (33 + 5 v2.2.0)

### Capability Map Update
```yaml
#  │ Cloud (14)     │ Llama 3.1, Mistral, Claude Haiku, DeepSeek V3, Qwen3, + OSS models │
#  │ Rules (29)     │ Core, Security, .NET, Angular, SQL + 24 (agents, data, UX) │
#  │ Prompts (38)   │ /review +37 including 15 agent commands │
```

---

## ✅ Benefits

### For Users
1. **Complete design system** — Generate components with UXPro standards automatically
2. **Accessibility confidence** — WCAG audits built in, never ship inaccessible UIs
3. **Responsive by default** — Mobile-first design + breakpoint testing
4. **Consistent tokens** — Design system tokens synced across projects
5. **Performance-aware** — Animation and layout best practices enforced

### For PowerPlay
1. **Closes capability gap** — No UI/UX agent coverage before v2.2.0
2. **Broad appeal** — Frontend developers get immediate value
3. **Production quality** — UXPro is mature, tested, documented
4. **Seamless integration** — Uses same config.yaml + rule.md structure
5. **Extensible** — Can add more design agents/rules later

---

## 🚀 Execution Plan (Recommended)

### Timeline
- **Week 1**: Extract UXPro → 5 rules, add to config.yaml
- **Week 2**: Test, document, release v2.2.0
- **Week 3**: Gather feedback, plan v2.3.0 enhancements

### Scope
- Keep it focused: 5 new rules, 5 new prompts
- Don't redesign UXPro — use it as-is (it's solid)
- Align with PowerPlay structure (frontmatter, checklists, examples)

### Success Criteria
- ✅ All 5 rules in `.continue/rules/`
- ✅ All 5 prompts in config.yaml
- ✅ config.yaml parses without error
- ✅ CHANGELOG updated
- ✅ Version bumped to 2.2.0
- ✅ Git commit + push

---

## 📋 Sample config.yaml Snippet

```yaml
# ── v2.2.0 UX Design Rules ─────────────────────────────

- name: ux-design-system
  globs: ["**/*.tsx", "**/*.jsx", "**/*.css", "**/*.scss"]
  alwaysApply: false
  rule: |
    UI/UX design system standards:
    - Color: 60-30-10 rule, semantic tokens (primary, secondary, success, danger)
    - Typography: 1.25 Major Third scale, 1.5-1.75 line height, 65ch max width
    - Spacing: 8-point grid (4px, 8px, 16px, 24px, 32px, 48px, 64px)
    - Responsive: Mobile-first, breakpoints 320px/480px/768px/1024px/1280px
    - Accessibility: WCAG 2.1 AA (4.5:1 contrast), focus indicators, semantic HTML
    See .continue/rules/ux-design-system.md for complete design system.

# ── v2.2.0 UX Design Prompts ──────────────────────────

- name: design-component
  description: "Generate accessible UI component with UXPro standards"
  invokable: true
  prompt: |
    Generate a complete accessible UI component using UXPro design system:
    Step 1: Structure — semantic HTML, accessibility-first
    Step 2: Styling — 60-30-10 color rule, typography scale, 8-point grid
    Step 3: States — default, hover, active, focus, disabled, loading
    Step 4: Responsive — mobile-first, clamp() fluid typography, breakpoints
    Step 5: Accessibility — WCAG 2.1 AA contrast, ARIA labels, focus indicators
    Output: Complete component code + CSS + HTML structure + accessibility checklist.
```

---

## 🎓 Next Steps (Your Decision)

### Option A: Go Ahead with v2.2.0 UX Integration ✅
1. I create 5 rule files from UXPro content
2. Add 5 prompts to config.yaml
3. Update documentation
4. Release v2.2.0

### Option B: Defer to v2.3.0
- Keep for future consideration
- Wait for more user feedback
- Combine with other design features

### Option C: Custom UX Rules
- Use UXPro as reference
- Create PowerPlay-specific UX rules
- More aligned with existing rules

**My Recommendation:** Option A — Go with v2.2.0 UX Integration. UXPro is excellent, the integration is straightforward, and the value to users is immediate.

---

**Ready to proceed? Let me know and I'll start implementing v2.2.0!** 🚀
