# UXPro Examples

Welcome to the UXPro examples directory! This folder contains practical, working examples demonstrating the UXPro design system in action.

## Overview

These examples showcase how to implement UXPro design rules, components, patterns, and full applications. Each example is production-ready and fully compliant with WCAG 2.1 AA accessibility standards.

## What's Included

### 📦 Components
Basic UI components built with UXPro design rules.

- **form-example.html** - Complete form with inputs, labels, error states, and validation feedback
- Form field patterns
- Text inputs, checkboxes, selects
- Error and success states
- Accessibility features (ARIA labels, semantic HTML)

**Learn:** Form design, interaction states, validation patterns, accessibility

### 🎨 Patterns
Common UI patterns and layouts used in real applications.

- **responsive-grid.html** - 12-column responsive grid system
- Mobile-first responsive design (320px to 1536px+)
- Auto-responsive column layouts
- Alignment and spacing patterns
- Card grids and complex layouts

**Learn:** Responsive design, breakpoints, mobile-first approach, layout patterns

### 🚀 Full Apps
Complete application layouts and interfaces.

- **dashboard-layout.html** - Professional dashboard with sidebar, header, and card system
- Navigation and layout structure
- Data presentation
- Multi-section interfaces
- Real-world application patterns

**Learn:** Complex layouts, navigation, information hierarchy, complete UI systems

## Key UXPro Rules Demonstrated

Every example includes these critical design system rules:

### 1. **60-30-10 Color Rule**
- 60% Dominant: Backgrounds and large surfaces
- 30% Secondary: Cards, sections, supporting elements
- 10% Accent: CTAs, highlights, interactive elements

### 2. **Contrast & Accessibility (WCAG 2.1 AA)**
- 4.5:1 minimum contrast for normal text
- 3:1 for large text (≥18px bold)
- All interactive elements fully keyboard accessible
- ARIA labels for screen readers

### 3. **8-Point Spacing Grid**
- 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- Consistent spacing throughout all examples

### 4. **Typography Scale (1.25 Modular Scale)**
- xs: 10px | sm: 13px | base: 16px | lg: 20px | xl: 25px
- Proper line heights: 1.1-1.3 for headings, 1.5-1.75 for body
- Max-width 65ch for optimal readability

### 5. **Responsive Design (Mobile-First)**
- Base: 320px (mobile)
- Breakpoints: sm: 480px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
- Fluid typography using clamp()
- Flexible layouts with CSS Grid and Flexbox

### 6. **Touch Targets**
- Minimum 44×44px (48×48px recommended)
- 8px minimum gap between interactive elements

### 7. **Animation & Motion**
- GPU-accelerated (transform and opacity only)
- Durations: 50ms (instant), 100ms (fast), 200ms (normal), 300ms (slow), 500ms (slower)
- Easing: ease-out (default), ease-in, bounce
- Full support for prefers-reduced-motion

### 8. **Dark Mode Support**
- Semantic color tokens
- Automatic detection with @media (prefers-color-scheme: dark)
- Proper contrast in both light and dark modes

### 9. **Interactive States**
- Default, Hover, Active, Focus, Disabled, Loading
- All examples include complete state definitions

### 10. **Semantic HTML & ARIA**
- Proper HTML elements (<button>, <nav>, <main>, <article>, etc.)
- ARIA labels for interactive elements
- Skip links for keyboard navigation
- Form validation feedback

## Design Tokens Reference

All examples use CSS custom properties (variables) for consistency:

### Colors
- **Primary colors**: Used for main CTAs and highlights
- **Neutral colors**: Used for backgrounds, borders, and text
- **Semantic colors**: Success (green), warning (orange), error (red), info (blue)

### Spacing
```css
--space-1: 4px;      /* tight */
--space-2: 8px;      /* compact */
--space-3: 12px;     /* snug */
--space-4: 16px;     /* default */
--space-6: 24px;     /* comfortable */
--space-8: 32px;     /* relaxed */
--space-12: 48px;    /* section */
--space-16: 64px;    /* large */
```

### Typography
```css
--text-xs: 0.64rem;  /* 10px */
--text-sm: 0.8rem;   /* 13px */
--text-base: 1rem;   /* 16px */
--text-lg: 1.25rem;  /* 20px */
--text-xl: 1.56rem;  /* 25px */
--text-2xl: 1.95rem; /* 31px */
```

### Shadows (Elevation)
```css
--shadow-sm: 0 1px 3px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px rgb(0 0 0 / 0.1);
```

### Border Radius
```css
--radius-sm: 2px;
--radius-base: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-2xl: 16px;
--radius-full: 9999px;
```

## How to Use These Examples

### 1. **Reference & Learning**
Open any HTML file in your browser to see the example in action. View the source code to understand:
- How to structure HTML semantically
- How to apply CSS using design tokens
- How to implement accessibility features
- How to build responsive layouts

### 2. **Copy & Customize**
- Copy entire components or patterns into your project
- Update colors and spacing to match your brand (if using UXPro elsewhere)
- Keep all ARIA labels and semantic HTML
- Maintain accessibility features

### 3. **Extend**
These examples show basic implementations. You can extend them with:
- JavaScript interactions
- Form validation
- Dynamic content
- API integration
- Framework-specific implementations (React, Vue, etc.)

### 4. **Use as Templates**
Each example is a complete, working template you can build upon:
- Start from `form-example.html` for any form-heavy interface
- Use `responsive-grid.html` for content-focused layouts
- Base complex UIs on `dashboard-layout.html`

## Testing & Validation

Before using any example in production:

### Accessibility Testing
- [ ] Test with keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- [ ] Test with screen readers (NVDA, JAWS, VoiceOver)
- [ ] Check contrast with WCAG Contrast Checker
- [ ] Validate semantic HTML with aXe DevTools

### Responsive Testing
- [ ] Test at 320px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1280px+ (desktop)
- [ ] Test on actual devices if possible

### Dark Mode Testing
- [ ] Test with `prefers-color-scheme: dark` enabled
- [ ] Verify contrast in both modes
- [ ] Check all colors adapt properly

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

## Customization Guide

### Changing Colors
All examples use CSS variables. To customize:

1. Edit the `:root` section in the `<style>` tag
2. Change color values (use hex, rgb, or hsl)
3. Maintain WCAG 2.1 AA contrast ratios
4. Test in both light and dark modes

Example:
```css
:root {
  --color-accent: #0066ff; /* Change primary accent */
  --color-success: #00a651; /* Change success green */
}
```

### Changing Spacing
All spacing uses variables. To adjust:

1. Edit `--space-*` variables in `:root`
2. Keep the 8-point grid relationship (8, 16, 24, 32, etc.)
3. Update all related measurements together

### Changing Typography
To customize fonts:

1. Add Google Fonts or system fonts in the `<head>`
2. Update `--font-*` variables in `:root`
3. Test readability at minimum font sizes
4. Verify line heights work with your new font

Example:
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700');

:root {
  --font-body: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## Common Questions

### Q: Can I use these examples in my project?
**A:** Absolutely! All examples are production-ready. Copy, modify, and use them freely.

### Q: Do I need to include the full UXPro design system?
**A:** No. These examples are self-contained with all necessary tokens and styles included.

### Q: How do I adapt these for my brand?
**A:** Change the CSS variables in the `:root` section. Keep all other structure intact.

### Q: Can I use these with frameworks like React?
**A:** Yes! Copy the HTML structure and CSS. Convert to JSX components as needed.

### Q: What about JavaScript?
**A:** These examples use vanilla HTML/CSS. Add JavaScript for interactivity as your project requires.

### Q: How do I ensure accessibility?
**A:** All examples include ARIA labels, semantic HTML, and keyboard navigation. Test with screen readers and keyboard navigation before deployment.

## Best Practices

1. **Always maintain semantic HTML** - Don't remove `<button>`, `<nav>`, `<main>`, etc.
2. **Keep ARIA labels** - Screen reader users depend on them
3. **Test responsive design** - Use browser dev tools to test all breakpoints
4. **Respect user preferences** - Always support dark mode and reduced motion
5. **Test before deploying** - Run through the accessibility checklist
6. **Document your changes** - Note any modifications to the original pattern

## Need More Examples?

If you need examples for specific patterns not included here:

1. Check the [main UXPro documentation](../README.md)
2. Review the complete [UIUX-MASTER-PROMPT-SYSTEM.md](../core/UIUX-MASTER-PROMPT-SYSTEM.md)
3. See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

## Resources

- [Main UXPro README](../README.md) - Overview and quick start
- [UIUX-SYSTEM-PROMPT.md](../core/UIUX-SYSTEM-PROMPT.md) - Design system rules
- [UIUX-MASTER-PROMPT-SYSTEM.md](../core/UIUX-MASTER-PROMPT-SYSTEM.md) - Complete 29-section system
- [UPDATE_GUIDE.md](../UPDATE_GUIDE.md) - Version tracking and updates
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
- [Web AIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Test contrast

---

**Last Updated:** 2026-04-09 | **Version:** 2.3.0 | **Status:** Production-Ready
