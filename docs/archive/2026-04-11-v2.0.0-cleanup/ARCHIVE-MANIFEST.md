# Archive Manifest — 2026-04-11 v2.0.0 Cleanup

**Date:** April 11, 2026  
**Reason:** PowerPlay v2.0.0 documentation consolidation  
**Status:** All files archived and replaced with current v2.0.0 docs

---

## What Was Archived

This archive contains 33 superseded documentation files that were replaced during the v2.0.0 release.

### Old Local Model / Agent Files (9 files)
These related to local model setup which is no longer active:
- `LOCAL-AGENT-SUMMARY.md`
- `LOCAL-MODEL-AGENT-FIX.md`
- `LOCAL-MODEL-SETUP.md`
- `LOCAL-MODEL-TROUBLESHOOTING.md`
- `QUICK-START-LOCAL-AGENT.md`
- `local-model-skill.md`
- `EXTENSION-QUICK-COMMANDS.md`
- `EXTENSION-STATUS-REPORT.md`
- `EXTENSION-TROUBLESHOOTING.md` (old version)

### Old Extension v1.0.0 Docs (5 files)
Replaced by v2.0.0 documentation:
- `EXTENSION-VISUAL-GUIDE.md`
- `EXTENSION-v2.0-SUMMARY.md`
- `DEPLOY-v2.0.md`
- `SETTINGS-PANEL-GUIDE.md`
- `QUICK-START-SETTINGS.md` (old version)

### Historical Release Notes (11 files)
Version-specific documentation from v3.8 and v3.9:
- `v38-FINAL-RELEASE-NOTES.md`
- `v38-PHASE1-RELEASE-NOTES.md`
- `v38-PHASE1-STATUS.md`
- `v38-PHASE2-3-RELEASE-NOTES.md`
- `v39-PHASE1-COMPLETION.md`
- `v39-PHASE2-COMPLETION.md`
- `v39-PHASE3-CORE-CACHING.md`
- `v39-PHASE4-CORE-MONITORING.md`
- `v39-ROADMAP-SUMMARY.md`
- `RELEASE-NOTES-v3.9.0.md`
- `CHANGELOG.md`

### Coverage & Planning Docs (5 files)
Old analysis and planning documents:
- `COVERAGE-BY-ROLE-TECH-SDLC-ORCHESTRATOR.md`
- `COVERAGE-QUICK-REFERENCE.md`
- `GAP-IMPROVEMENT-PLAN-v38.md`
- `README-DOCUMENTATION-INDEX.md`

### Performance & Parallelization Docs (3 files)
Old optimization planning documents:
- `PARALLEL-PROCESSING-ENHANCEMENT.md`
- `PARALLELIZATION-QUICK-START.md`

### Tracking & Checklist Files (2 files)
Old project tracking files:
- `PROGRESS.md`
- `SHIP-CHECKLIST.md`

---

## What's Currently Active

The following v2.0.0 documentation files remain in the root directory:

### Quick Start Guides
- **`START-HERE.md`** — Main entry point for new users
- **`START-HERE-EXTENSION.md`** — Extension-specific getting started

### Installation & Setup
- **`FRESH-INSTALL-READY.md`** — Step-by-step installation
- **`UNINSTALL-REINSTALL-GUIDE.md`** — Migration from v1.0.0 to v2.0.0
- **`INSTALLATION-CHECKLIST.md`** — Post-installation verification

### User Guides
- **`QUICK-REFERENCE-v2.0.0.md`** — Keyboard shortcuts and quick reference
- **`QUICK-START-SETTINGS.md`** — Settings configuration guide
- **`README-EXTENSION-v2.0.0.md`** — Full extension documentation

### Technical References
- **`SESSION-DELIVERY-v2.0.0-CHAT-PANEL.md`** — Technical delivery summary

---

## How to Access Archived Files

If you need to refer to archived documentation:

```bash
# List all archived files
ls docs/archive/2026-04-11-v2.0.0-cleanup/

# View a specific archived file
cat docs/archive/2026-04-11-v2.0.0-cleanup/<filename>.md
```

---

## Archive Policy

**When to Archive:**
- Documentation superseded by newer versions
- Historical release notes (after current version is stable)
- Abandoned features or workflows
- Old project tracking files

**Where to Archive:**
- `docs/archive/<YYYY-MM-DD>-<reason>/`
- Always include `ARCHIVE-MANIFEST.md` explaining what and why

**Naming Convention:**
- `<YYYY-MM-DD>-<reason>/` — ISO date + brief reason
- Example: `2026-04-11-v2.0.0-cleanup/`

---

## File Count Summary

| Category | Count |
|----------|-------|
| Archived Files | 33 |
| Active Root Docs | 9 |
| Active Docs/ | ~8 |
| **Total** | **~50** |

---

## Notes

- All archived files are preserved for historical reference
- No files were deleted, only moved to archive/
- Future cleanup should follow the same pattern
- Archive created during v2.0.0 release consolidation

**Archive Size:** ~450 KB  
**Compressed Size:** ~75 KB (if needed)

---

**Last Updated:** 2026-04-11  
**Next Review:** After v2.1.0 release
