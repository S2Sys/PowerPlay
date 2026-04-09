# UXPro Components Examples

This directory contains foundational UI component examples built with the UXPro design system.

## Overview

Components are the building blocks of user interfaces. Each example demonstrates a complete, working component with all UXPro design rules applied.

## Components Included

### Forms & Inputs
- **form-example.html** - Complete form pattern with multiple input types

#### What's Demonstrated
- Text inputs, email, password, number fields
- Checkboxes and radio buttons
- Select dropdowns
- Textarea for longer text
- Form labels and helper text
- Error states and validation messages
- Success feedback
- Disabled states
- Focus indicators

#### UXPro Rules Applied
- ✅ Input height: 44px minimum (44×44px touch target)
- ✅ 8-point spacing grid for labels, inputs, and helper text
- ✅ WCAG 2.1 AA contrast (4.5:1 for labels and error text)
- ✅ Focus states: 2px solid outline, 2px offset
- ✅ Semantic HTML (`<label>`, `<input>`, `<form>`)
- ✅ ARIA labels and descriptions
- ✅ Dark mode support with semantic color tokens
- ✅ Responsive design (mobile-first, 320px+)
- ✅ Proper typography scale and line heights
- ✅ Error messaging in semantic red with proper contrast

#### Key Sections
1. **Form Header** - Title and description
2. **Input Fields** - Text, email, password with labels and helpers
3. **Checkboxes** - Multiple selection with proper spacing
4. **Radio Buttons** - Single selection group
5. **Select Dropdown** - List selection with proper styling
6. **Textarea** - Multi-line text input
7. **Form Actions** - Submit and cancel buttons
8. **Validation States** - Error, success, and disabled examples

#### Common Patterns
```html
<!-- Proper form structure -->
<form class="form">
  <div class="form-group">
    <label for="input-id" class="form-label">Label Text</label>
    <input id="input-id" type="text" class="form-input" />
    <p class="form-helper">Helper text for context</p>
  </div>
  <div class="form-group is-error">
    <label for="error-id" class="form-label">Field with Error</label>
    <input id="error-id" type="email" class="form-input" />
    <p class="form-error">Error message in semantic red</p>
  </div>
</form>
```

#### Customization Tips

**Change Input Styling**
Edit the `.form-input` class:
```css
.form-input {
  /* Border color */
  border-color: var(--color-border);
  /* Focus state color */
}
.form-input:focus {
  border-color: var(--color-accent);
  outline: 3px solid var(--color-accent-light);
}
```

**Adjust Spacing**
Modify the `.form-group` margin:
```css
.form-group {
  margin-bottom: var(--space-6); /* 24px - comfortable spacing */
  /* Change to --space-4 for compact spacing (16px) */
  /* Change to --space-8 for relaxed spacing (32px) */
}
```

**Change Label Styling**
Update `.form-label` for different visual hierarchy:
```css
.form-label {
  font-size: var(--text-sm); /* 13px labels */
  font-weight: 500;
  /* Customize color, font family, etc. */
}
```

## Component Specs

### Input Field
- **Height:** 44px (minimum touch target)
- **Padding:** 0 16px (horizontal), 10px 0 (vertical)
- **Border:** 1px solid, 6px border-radius
- **Focus:** 3px accent ring with 20% opacity offset by 2px
- **States:** Default, hover, active, focus, disabled, error, success

### Label
- **Size:** 13px (sm scale)
- **Weight:** 500 (medium)
- **Color:** Primary text (high contrast)
- **Position:** Above input, 8px margin below

### Helper Text
- **Size:** 12px (xs scale)
- **Color:** Muted/secondary text
- **Position:** Below input, 4px margin above
- **Purpose:** Provide context or instructions

### Error Message
- **Size:** 12px (xs scale)
- **Color:** Semantic red (error color)
- **Icon:** Optional error icon (if space allows)
- **Contrast:** 4.5:1 minimum from background

### Button (Form Submit)
- **Height:** 44px minimum
- **Padding:** 12px 24px
- **Border-radius:** 6px (md)
- **States:** Default, hover, active, focus, disabled, loading

## Accessibility Features

Every component includes:

### Semantic HTML
```html
<form>
  <label for="name">Name</label>
  <input id="name" type="text" required />
</form>
```

### ARIA Labels
```html
<input aria-label="Email address" type="email" />
<input aria-describedby="pwd-helper" type="password" />
<p id="pwd-helper">Minimum 8 characters</p>
```

### Keyboard Navigation
- Tab to move between fields
- Shift+Tab to move backward
- Enter to submit forms
- Space to toggle checkboxes/radio buttons
- Arrow keys for select options

### Focus Indicators
- All inputs have visible focus outlines (2px solid, offset 2px)
- Never remove focus styles
- Ensure focus order is logical (top to bottom)

## Dark Mode Support

All components adapt to dark mode:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #ffffff; /* Light mode */
    --text-primary: #000000;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a; /* Dark mode */
    --text-primary: #ffffff;
  }
}
```

## Responsive Behavior

### Mobile (320px - 479px)
- Full width inputs with 16px padding
- Stacked form layout
- Larger touch targets (48px recommended)
- Simplified form structure

### Tablet (480px - 767px)
- 24px side padding
- Can start multi-column layouts
- Medium spacing between fields

### Desktop (768px+)
- Maximum 600px form width (centered)
- Can use multi-column form layouts
- 32px/48px section spacing

## Usage Patterns

### Basic Input
```html
<div class="form-group">
  <label for="name" class="form-label">Full Name</label>
  <input id="name" type="text" class="form-input" />
  <p class="form-helper">Enter your full name as it appears on your ID</p>
</div>
```

### With Error State
```html
<div class="form-group is-error">
  <label for="email" class="form-label">Email</label>
  <input id="email" type="email" class="form-input" />
  <p class="form-error">Please enter a valid email address</p>
</div>
```

### With Success State
```html
<div class="form-group is-success">
  <label for="username" class="form-label">Username</label>
  <input id="username" type="text" class="form-input" />
  <p class="form-success">Username is available!</p>
</div>
```

### Disabled Input
```html
<div class="form-group">
  <label for="locked" class="form-label">Account Status</label>
  <input id="locked" type="text" class="form-input" disabled />
  <p class="form-helper">This field cannot be modified</p>
</div>
```

## Animation & Interactions

All animations follow UXPro rules:

- **Durations:** 200ms normal (fast user feedback)
- **Easing:** ease-out (default cubic-bezier(0, 0, 0.2, 1))
- **GPU-Accelerated:** Only opacity and transform
- **Respects Motion:** Full support for prefers-reduced-motion

Example:
```css
.form-input {
  transition: border-color 200ms ease-out;
}
.form-input:focus {
  border-color: var(--color-accent);
}

@media (prefers-reduced-motion: reduce) {
  .form-input {
    transition: none;
  }
}
```

## Integration Guide

### Copying to Your Project

1. **Copy the HTML structure** - Entire form or individual input groups
2. **Copy all CSS** - From `<style>` tag including CSS variables
3. **Maintain semantic HTML** - Don't change element types
4. **Keep ARIA attributes** - Essential for accessibility
5. **Test with keyboard and screen reader**

### Framework Integration (React Example)
```jsx
function FormField({ label, id, type, error, helper }) {
  return (
    <div className={`form-group ${error ? 'is-error' : ''}`}>
      <label htmlFor={id} className="form-label">{label}</label>
      <input id={id} type={type} className="form-input" />
      <p className={error ? 'form-error' : 'form-helper'}>
        {error || helper}
      </p>
    </div>
  );
}
```

## Testing Checklist

Before using in production:

- [ ] Test all input types work and display correctly
- [ ] Verify keyboard navigation (Tab through all fields)
- [ ] Check focus indicators are visible (not just on mouse, also keyboard)
- [ ] Test with screen reader (NVDA/JAWS on Windows, VoiceOver on Mac)
- [ ] Verify error messages are announced
- [ ] Check contrast ratios meet WCAG 2.1 AA (4.5:1 minimum)
- [ ] Test in dark mode on your system
- [ ] Verify form submits correctly
- [ ] Test all interaction states (hover, active, disabled, error)
- [ ] Responsive test at 320px, 768px, 1280px

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Learn More

- **Form Design Patterns** - See Section 18 in UIUX-MASTER-PROMPT-SYSTEM.md
- **Accessibility Deep Dive** - See Section 21 in UIUX-MASTER-PROMPT-SYSTEM.md
- **Complete Design System** - Read core/UIUX-SYSTEM-PROMPT.md
- **Examples Overview** - See ../README.md for all available examples

---

**Last Updated:** 2026-04-09 | **Version:** 2.3.0 | **Status:** Production-Ready
