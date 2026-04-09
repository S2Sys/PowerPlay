# Contributing to UXPro

Thank you for your interest in contributing to UXPro! We welcome contributions from the community to help make this design system better for everyone. Whether you're fixing bugs, adding new patterns, improving documentation, or enhancing the design system, your help is appreciated.

## Types of Contributions

We accept contributions in the following areas:

### Bug Reports
Found something that doesn't work? Let us know!
- Report issues with design system compliance
- Flag accessibility violations or WCAG failures
- Document responsive design breakage
- Report implementation inconsistencies

### New Patterns & Components
Expand our library of reusable components and interaction patterns.
- New component examples (buttons, forms, modals, cards, etc.)
- Common UI patterns (data tables, navigation, filters, etc.)
- Platform-specific implementations (iOS, Material Design 3, PWA)
- Real-world use cases and applications

### Documentation Improvements
Help us make UXPro easier to understand and use.
- Platform guides and setup instructions
- Usage examples and code samples
- Clarifications to existing guidelines
- Tutorials and learning resources
- Translation of documentation

### Design System Enhancements
Strengthen the core design system itself.
- New CSS design tokens or semantic color variables
- Additional responsive breakpoints or spacing scales
- Improved accessibility guidelines
- Animation or motion principles
- Performance optimization rules

## Contribution Guidelines

Before you start contributing, please review these guidelines to ensure quality and consistency.

### Design System Compliance

All contributions must follow the UXPro design system:
- **Color Rules** - Use semantic color tokens from `core/design-tokens.css`
- **Typography** - Follow established font sizes, weights, and line heights
- **Spacing** - Adhere to the 8-point grid system
- **Responsive Design** - Support 320px to 1536px+ viewport widths
- **Breakpoints** - Use defined breakpoints (320px, 640px, 1024px, 1440px)

### Code Quality Standards

- **Semantic HTML** - Use proper semantic elements (`<button>`, `<nav>`, `<main>`, etc.)
- **CSS Only** - Contributions should use pure CSS (no inline styles or CSS-in-JS unless necessary)
- **No Frameworks** - Design system is framework-agnostic; no React, Vue, or Angular-specific code
- **Clean Code** - Write readable, well-organized, maintainable code
- **Comments** - Include clear comments explaining complex logic

### Accessibility Requirements

All contributions must meet WCAG 2.1 AA standards:
- **Contrast** - Minimum 4.5:1 contrast ratio for normal text
- **Keyboard Navigation** - All interactive elements must be keyboard accessible
- **ARIA Labels** - Proper ARIA labels and roles for assistive technology
- **Focus States** - Clear, visible focus indicators
- **Mobile Accessibility** - Touch targets minimum 44x44 pixels

### Mobile-First Approach

Design and develop with mobile first in mind:
- Start with mobile viewport (320px)
- Progressive enhancement for larger screens
- Touch-friendly interfaces
- Optimized performance for cellular connections

### Documentation & Comments

Write clear, helpful comments and documentation:
- Comment *why*, not just *what*
- Use clear variable and class names
- Document non-obvious design decisions
- Include usage examples
- Link to related patterns

## Commit Message Format

We follow a simple commit message convention to keep history clear:

```
<type>: <subject>

<body (optional)>
```

### Commit Types

- **feat:** New component, pattern, or feature
- **fix:** Bug fix or correction
- **docs:** Documentation additions or updates
- **chore:** Build, dependencies, or tooling changes
- **style:** CSS or styling improvements
- **refactor:** Code restructuring without behavior change

### Examples

```bash
# New component example
git commit -m "feat: add data table pattern with sorting and filtering"

# Bug fix
git commit -m "fix: correct color contrast in dark mode button states"

# Documentation
git commit -m "docs: improve accessibility guidelines for form labels"

# Design tokens
git commit -m "feat: add semantic spacing tokens for gaps and margins"
```

## File Organization

Here's where different types of contributions go:

```
UXPro/
├── core/                              # Core design system
│   ├── UIUX-SYSTEM-PROMPT.md         # Quick reference
│   ├── UIUX-MASTER-PROMPT-SYSTEM.md  # Complete guidelines (29 sections)
│   ├── design-tokens.css             # CSS variables and tokens
│   └── VERSION.json                  # Version tracking
│
├── examples/                          # Implementation examples
│   ├── components/                   # Component examples
│   │   ├── buttons/
│   │   ├── forms/
│   │   ├── cards/
│   │   └── README.md
│   ├── patterns/                     # Interaction patterns
│   │   ├── data-tables/
│   │   ├── navigation/
│   │   ├── modals/
│   │   └── README.md
│   ├── full-apps/                    # Complete app examples
│   │   ├── dashboard/
│   │   ├── landing-page/
│   │   └── README.md
│   └── README.md
│
├── docs/                             # Documentation
│   ├── guides/                       # Platform-specific guides
│   │   ├── claude-code.md
│   │   ├── cursor.md
│   │   ├── windsurf.md
│   │   ├── cline.md
│   │   ├── continue-dev.md
│   │   ├── copilot.md
│   │   └── README.md
│   ├── UPDATE_GUIDE.md               # Version update instructions
│   ├── CHANGELOG.md                  # Version history
│   └── IMPLEMENTATION_SUMMARY.md     # Project overview
│
├── templates/                        # Reusable templates
│   ├── component-template.html
│   ├── pattern-template.html
│   └── README.md
│
├── setup/                            # Installation helpers
│   ├── install.sh
│   ├── install.bat
│   └── README.md
│
├── README.md                         # Project overview
├── CONTRIBUTING.md                   # This file
├── LICENSE                           # MIT license
└── VERSION.json                      # Current version
```

### Where to Add Contributions

**New Components:**
- Add to `examples/components/` in a new folder: `examples/components/your-component/`
- Include `index.html`, `styles.css`, and `README.md`
- Update `examples/components/README.md` with link

**New Patterns:**
- Add to `examples/patterns/` in a new folder: `examples/patterns/your-pattern/`
- Include `index.html`, `styles.css`, and `README.md`
- Update `examples/patterns/README.md` with link

**Design System Updates:**
- Update `core/UIUX-MASTER-PROMPT-SYSTEM.md` for new guidelines
- Update `core/design-tokens.css` for new tokens
- Update `docs/CHANGELOG.md` with change description

**Documentation:**
- Platform guides: `docs/guides/`
- Implementation help: `docs/` folder
- Setup instructions: `setup/README.md`

## Pull Request Process

Follow these steps to contribute:

### 1. Fork the Repository
```bash
# Click "Fork" on GitHub
git clone https://github.com/YOUR-USERNAME/UXPro.git
cd UXPro
```

### 2. Create a Feature Branch
```bash
# Use descriptive branch names
git checkout -b feat/add-data-table-component
git checkout -b fix/button-contrast-issue
git checkout -b docs/improve-accessibility-guide
```

### 3. Make Your Changes
- Follow the guidelines above
- Test accessibility with keyboard and screen readers
- Verify responsive design at multiple breakpoints
- Check contrast ratios and WCAG compliance

### 4. Commit with Clear Messages
```bash
git add .
git commit -m "feat: add sortable data table pattern with keyboard navigation"
```

### 5. Push and Create a Pull Request
```bash
git push origin feat/add-data-table-component
```

Then open a PR on GitHub with:
- Clear title: "Add data table pattern with sorting"
- Description of what was added and why
- Link to related issues (if any)
- Checklist of testing performed

### PR Checklist

Before submitting, ensure:
- [ ] Code follows design system guidelines
- [ ] Tested on mobile (320px) and desktop (1440px)
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] WCAG 2.1 AA contrast requirements met
- [ ] CSS is semantic and uses design tokens
- [ ] Comments explain complex decisions
- [ ] New files included in appropriate README
- [ ] Commit messages follow format (feat:, fix:, docs:, etc.)
- [ ] No breaking changes to existing patterns

## Code of Conduct

We're committed to fostering a respectful and inclusive community.

### Be Respectful
- Treat all contributors with courtesy and respect
- Assume good intentions in discussions
- Provide constructive feedback, not criticism
- Welcome contributors of all experience levels

### Be Constructive
- Offer specific, actionable suggestions
- Explain the reasoning behind feedback
- Acknowledge effort and improvements
- Help others learn and grow

### Celebrate Wins
- Recognize good contributions
- Appreciate improvements and fixes
- Celebrate new features and documentation
- Support other contributors publicly

### Help Others
- Review pull requests thoughtfully
- Answer questions in issues
- Share knowledge and experience
- Mentor contributors new to the project

## Questions?

We're here to help! Reach out in these ways:

### Documentation & Resources
- **System Prompt** - See `core/UIUX-SYSTEM-PROMPT.md` for quick reference
- **Complete Guidelines** - Check `core/UIUX-MASTER-PROMPT-SYSTEM.md` for all 29 sections
- **Examples** - Browse real implementations in `examples/`
- **Platform Guides** - Platform-specific help in `docs/guides/`

### Getting Help
- **Installation Issues** - See `setup/README.md` and `docs/guides/`
- **Design Questions** - Check `core/UIUX-MASTER-PROMPT-SYSTEM.md`
- **Example Code** - Look in `examples/` or ask in discussions
- **Report Bugs** - Open an issue on GitHub with clear description

### Connect With Us
- **GitHub Issues** - Report bugs, ask questions, suggest features
- **GitHub Discussions** - Share ideas and get community feedback
- **Pull Requests** - Submit your contributions

---

Thank you for contributing to UXPro! Your help makes this design system better for everyone. Happy coding!

**Quick Links:** [README](./README.md) • [System Prompt](./core/UIUX-SYSTEM-PROMPT.md) • [Examples](./examples/) • [Setup](./setup/README.md) • [Issues](./docs/) • [Updates](./docs/UPDATE_GUIDE.md)
