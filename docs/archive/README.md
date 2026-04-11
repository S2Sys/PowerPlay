# Documentation Archive

This directory contains archived (superseded) documentation files organized by date and cleanup reason.

## Active Archives

### 2026-04-11 v2.0.0 Cleanup
**Date:** April 11, 2026  
**Files:** 34 (compressed into 132 KB tar.gz)  
**Reason:** PowerPlay v2.0.0 documentation consolidation

**Contents:**
- 9 old local model setup files
- 5 old extension v1.0.0 docs
- 11 historical release notes (v3.8–v3.9)
- 5 coverage & planning documents
- 3 performance/optimization docs
- 2 project tracking files

**Access:**
```bash
# View manifest
cat 2026-04-11-v2.0.0-cleanup/ARCHIVE-MANIFEST.md

# View compressed archive
tar -tzf 2026-04-11-v2.0.0-cleanup.tar.gz

# Extract if needed
tar -xzf 2026-04-11-v2.0.0-cleanup.tar.gz
```

---

## Archive Structure

```
docs/archive/
├── README.md                        (this file)
├── 2026-04-11-v2.0.0-cleanup/       (directory)
│   ├── ARCHIVE-MANIFEST.md
│   ├── *.md                         (34 archived files)
│   └── ...
└── 2026-04-11-v2.0.0-cleanup.tar.gz (132 KB compressed)
```

---

## Archive Policy

### When to Archive
- Documentation superseded by newer versions
- Historical release notes (after stable release)
- Abandoned features or workflows
- Old tracking files

### Where to Archive
- `docs/archive/<YYYY-MM-DD>-<reason>/`
- Always create `ARCHIVE-MANIFEST.md`
- Compress into `.tar.gz` for space efficiency

### Naming Convention
- Directory: `<YYYY-MM-DD>-<description>/`
- Compressed: `<YYYY-MM-DD>-<description>.tar.gz`
- Example: `2026-04-11-v2.0.0-cleanup/`

### Steps to Archive
1. Create directory: `docs/archive/<YYYY-MM-DD>-<reason>/`
2. Move old files: `mv old-file.md docs/archive/<YYYY-MM-DD>-<reason>/`
3. Create manifest: `ARCHIVE-MANIFEST.md` (explain what and why)
4. Compress: `tar -czf <YYYY-MM-DD>-<reason>.tar.gz <YYYY-MM-DD>-<reason>/`
5. Commit: `git add docs/archive/`

---

## Quick Reference

| Directory | Size | Files | Created |
|-----------|------|-------|---------|
| `2026-04-11-v2.0.0-cleanup/` | 496 KB | 34 | 2026-04-11 |

---

## Notes

- All archived files are preserved for historical reference
- No files are deleted, only moved
- Compression reduces archive size by ~73%
- Each archive includes a manifest explaining its contents
- Review archives periodically for items that can be permanently deleted

---

**Archive Policy Last Updated:** 2026-04-11
