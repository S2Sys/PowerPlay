# Release Checklist

Use this before every version bump.

---

## Pre-Release (1-2 Days Before)

### Code & Config
- [ ] All changes committed to git
- [ ] `config.yaml` syntax valid (`yamllint config.yaml`)
- [ ] No hardcoded secrets/API keys in `config.yaml`
- [ ] All MCP servers tested (Git, FileSystem, SQLite, Playwright work)
- [ ] All /prompts work (try `/review`, `/add-tests`, `/security-scan`)
- [ ] Tab autocomplete responds (wait 400ms, should suggest)

### Documentation
- [ ] CHANGELOG.md updated with new features/fixes
- [ ] README.md reflects current version & features
- [ ] Wiki pages are current (check links work)
- [ ] VERSIONING_STRATEGY.md up-to-date with new plans

### Testing
- [ ] Tested with Qwen 3.5 (chat)
- [ ] Tested with Qwen Coder (code apply)
- [ ] Tested cloud fallback (OpenRouter)
- [ ] Tested at least 3 /prompts
- [ ] Tested @code, @codebase, @file context providers

---

## Release Day

### Version Bump
- [ ] Update `version:` in `config.yaml` (e.g., `1.0.0` → `1.1.0`)
- [ ] Update `metadata.releaseDate:` to today
- [ ] Update `metadata.lastUpdated:` to today
- [ ] Update `metadata.releaseUrl:` to point to GitHub release

### Git & GitHub
- [ ] Commit: `git commit -am "Release v1.1.0"`
- [ ] Tag: `git tag -a v1.1.0 -m "Description"`
- [ ] Push: `git push origin main && git push origin v1.1.0`
- [ ] Create GitHub Release with:
  - Title: `v1.1.0 — Brief description`
  - Body: Copy from CHANGELOG.md ([Unreleased] section)
  - Assets: Attach `config.yaml` (optional)

### Announcement (Optional)
- [ ] Post to Discord/Community channel
- [ ] Update GitHub discussions if major feature

---

## Post-Release

### Verification
- [ ] GitHub release page looks good
- [ ] Changelog links to release correctly
- [ ] Wiki links to release correctly
- [ ] Download works from GitHub releases

### Cleanup
- [ ] Delete any temp/test files from repo
- [ ] Move CHANGELOG [Unreleased] → [1.1.0]
- [ ] Add new [Unreleased] section to CHANGELOG
- [ ] Update VERSIONING_STRATEGY.md with next version plans
- [ ] Close any resolved GitHub issues

### Next Version Planning
- [ ] Plan v1.2.0 features (update VERSIONING_STRATEGY.md)
- [ ] Create GitHub milestone for next release
- [ ] Open issues for planned features

---

## Rollback (If Needed)

If a release has a critical bug:

```bash
# Delete the tag locally and on GitHub
git tag -d v1.1.0
git push origin --delete v1.1.0

# Delete GitHub release page
# (via GitHub web UI)

# Revert changes
git revert <commit-sha>

# Release hotfix (e.g., v1.0.1)
git tag -a v1.0.1 -m "Hotfix: [description]"
git push origin v1.0.1
```

Then create new GitHub release for v1.0.1.

---

## Version Bumping Rules

| Type of Change | New Version | Example |
|---|---|---|
| New model / rule / prompt / MCP | Minor | v1.0.0 → v1.1.0 |
| Parameter tuning / bug fix | Patch | v1.0.0 → v1.0.1 |
| Breaking schema/rule change | Major | v1.0.0 → v2.0.0 |

---

## CHANGELOG Format

```markdown
## [1.1.0] — 2026-04-15

### Added
- New model: Claude API integration
- New prompt: /architecture-design
- MCP server: Azure DevOps (optional)

### Changed
- Tab autocomplete debounce: 400ms → 350ms
- Qwen 3.5 temperature: 0.3 → 0.25 (more precise)

### Fixed
- DeepSeek R1 was hallucinating on SQL (temperature lowered)
- Playwright timeouts on slow networks (increased to 30s)

### Deprecated
- Old model: GPT-OSS 120B (use Claude API instead)

### Docs
- Added Azure DevOps MCP setup guide
- Updated troubleshooting for common errors
```

---

## Emergency Patch (Critical Bug)

If production is broken:

1. Create hotfix branch: `git checkout -b hotfix/v1.0.1`
2. Fix the issue
3. Update `version:` to v1.0.1 (patch bump)
4. Update CHANGELOG (at top)
5. Commit & tag: `git tag -a v1.0.1 -m "Critical fix: ..."`
6. Push & release

---

## Helpful Commands

```bash
# View all tags (versions)
git tag -l

# View commits since last tag
git log v1.0.0..HEAD --oneline

# View CHANGELOG between versions
git diff v1.0.0 v1.1.0 -- CHANGELOG.md

# Test YAML validity
yamllint config.yaml

# Count features/fixes in CHANGELOG
grep -c "^- " CHANGELOG.md
```

