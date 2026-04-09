# UXPro Patterns Examples

This directory contains common UI/UX patterns built with the UXPro design system.

## Overview

Patterns are reusable solutions to common UI problems. Each example demonstrates a complete, production-ready pattern that can be adapted to various use cases.

## Patterns Included

### Responsive Grid System
- **responsive-grid.html** - 12-column responsive grid with examples

#### What's Demonstrated
- Mobile-first responsive design (320px minimum)
- 12-column grid system with auto-responsive columns
- Gap and padding management
- Flexible layouts that adapt to all screen sizes
- Card-based layouts
- Multi-row and multi-column arrangements
- Alignment and distribution techniques

#### UXPro Rules Applied
- ✅ Mobile-first approach (base: 320px)
- ✅ Responsive breakpoints: sm (480px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- ✅ 8-point spacing grid (gaps and padding use multiples of 8)
- ✅ Container max-width: 1280px centered
- ✅ Fluid typography with clamp()
- ✅ CSS Grid with auto-fit/auto-fill for responsive columns
- ✅ Proper semantic HTML structure
- ✅ Dark mode support with semantic color tokens
- ✅ WCAG 2.1 AA contrast for text
- ✅ Touch-friendly card targets (minimum 44px height)

#### Key Sections
1. **Grid Foundation** - Base 12-column grid setup
2. **Single Row** - Items spanning various column widths
3. **Multi-Row Grid** - Complex layouts across rows
4. **Auto-Responsive Columns** - Cards that auto-fit to container
5. **Nested Grids** - Grid within grid for complex layouts
6. **Gap Examples** - Different spacing between items
7. **Alignment Patterns** - Center, space-between, etc.

#### Grid Breakpoints
```css
/* Mobile: 320px - 479px (1 column or narrower) */
@media (max-width: 479px) {
  .grid { grid-template-columns: 1fr; }
}

/* Tablet: 480px - 767px (2 columns) */
@media (min-width: 480px) and (max-width: 767px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 768px+ (3+ columns) */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

#### Common Patterns

**12-Column Grid**
```html
<div class="grid" style="grid-template-columns: repeat(12, 1fr); gap: var(--space-4);">
  <div style="grid-column: span 4;">Item 1 (4 cols)</div>
  <div style="grid-column: span 8;">Item 2 (8 cols)</div>
</div>
```

**Auto-Responsive Columns**
```html
<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>
```

**Nested Grid**
```html
<div class="grid">
  <div class="grid-item">
    <div class="grid" style="grid-template-columns: repeat(2, 1fr);">
      <div>Nested 1</div>
      <div>Nested 2</div>
    </div>
  </div>
</div>
```

#### Customization Tips

**Change Number of Columns**
```css
/* 4-column grid instead of 3 */
.grid {
  grid-template-columns: repeat(4, 1fr);
}

/* 2-column grid */
.grid {
  grid-template-columns: repeat(2, 1fr);
}
```

**Adjust Gap/Spacing**
```css
.grid {
  gap: var(--space-6); /* 24px instead of 16px */
  padding: var(--space-8); /* 32px padding */
}
```

**Change Card Width**
```css
/* Larger minimum card width (400px instead of 280px) */
.grid {
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}
```

## Pattern Specs

### Grid Container
- **Max Width:** 1280px (desktop containers)
- **Horizontal Padding:** 16px (mobile), 24px (tablet), 32px (desktop)
- **Vertical Padding:** 24px (mobile), 32px (tablet), 48px (desktop)
- **Gap:** 16px (default), 24px (comfortable), 8px (compact)

### Grid Item (Column)
- **Minimum Width:** 280px (for card-based layouts)
- **Touch Target:** Minimum 44px height (for interactive cards)
- **Padding:** Depends on content, 16px-24px common

### Responsive Behavior

**Mobile (320px - 479px)**
- Single column layout (100% width)
- 16px padding on sides
- 16px gaps between items
- Full-width cards

**Tablet (480px - 767px)**
- 2-column layout
- 24px padding on sides
- 16px gaps
- Half-width cards

**Small Desktop (768px - 1023px)**
- 3-column layout
- 32px padding, centered
- 16px gaps
- Third-width cards

**Large Desktop (1024px+)**
- 4+ column layout
- Max width 1280px, centered
- 32px+ padding on sides
- Flexible column widths

## Accessibility Features

### Semantic HTML
```html
<main>
  <section class="grid">
    <article class="grid-item card">Content</article>
  </section>
</main>
```

### Content Order
- Grid order should follow logical reading order
- Use `order` property only for visual adjustments
- Never hide content from keyboard users

### Touch Targets
- Interactive cards: minimum 44×44px
- Card padding accommodates touch interactions
- Gap between cards prevents accidental clicks

### Focus Management
- Cards can be keyboard focused if interactive
- Focus indicators visible on all interactive elements
- Skip to main content link above grid

## Dark Mode Support

All grid patterns include dark mode:

```css
/* Light mode (default) */
:root {
  --bg-card: #ffffff;
  --border-default: #e5e5e5;
  --text-primary: #000000;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-card: #1a1a1a;
    --border-default: #333333;
    --text-primary: #ffffff;
  }
}
```

## Responsive Testing

### Test at These Sizes
- **320px** - iPhone SE
- **375px** - iPhone 12
- **480px** - Small tablets
- **768px** - iPad
- **1024px** - Large tablets/small laptops
- **1280px** - Desktop
- **1536px** - Large desktop

### Use Browser DevTools
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select different devices or custom widths
4. Watch grid reflow in real-time

## Common Use Cases

### Product Grid
```html
<div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
  <!-- Product cards -->
</div>
```

### Blog Post Grid
```html
<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));">
  <!-- Article cards -->
</div>
```

### Dashboard Grid
```html
<div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));">
  <!-- Dashboard widgets -->
</div>
```

### Feature Showcase
```html
<div class="grid" style="grid-template-columns: repeat(3, 1fr);">
  <!-- Feature boxes -->
</div>
```

### Two-Column Layout (Golden Ratio)
```html
<div class="grid" style="grid-template-columns: 61.8fr 38.2fr;">
  <!-- Main content (61.8%) | Sidebar (38.2%) -->
</div>
```

## Integration Guide

### Copying to Your Project

1. **Copy the container structure** - Entire grid or individual rows
2. **Copy all CSS** - Including media queries and variables
3. **Adapt column count** - Change grid-template-columns to match your needs
4. **Update spacing** - Adjust gap and padding values
5. **Test responsive behavior** - Verify at all breakpoints

### Framework Integration (React Example)
```jsx
function ResponsiveGrid({ columns = 3, gap = 16, children }) {
  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {children}
    </div>
  );
}

// Usage
<ResponsiveGrid columns={3} gap={24}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</ResponsiveGrid>
```

### CSS Framework Integration
If using Tailwind, Bootstrap, or similar:
- Match breakpoints to UXPro values
- Use responsive utilities (md:, lg:, etc.)
- Maintain semantic column widths
- Keep 8-point spacing grid alignment

## Advanced Patterns

### Masonry Layout
```css
.grid {
  column-count: 3;
  column-gap: var(--space-4);
}

@media (max-width: 1023px) {
  .grid { column-count: 2; }
}

@media (max-width: 767px) {
  .grid { column-count: 1; }
}
```

### Sidebar + Main
```css
.layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-8);
}

@media (max-width: 1023px) {
  .layout { grid-template-columns: 1fr; }
}
```

### Three-Zone Layout
```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 300px 1fr 300px;
    gap: var(--space-8);
  }
}
```

## Performance Considerations

1. **Minimize Repaints** - Grid layout is GPU-accelerated, very performant
2. **Content Density** - Don't exceed 20-30 items in single grid view
3. **Lazy Loading** - Load grid items as user scrolls (intersection observer)
4. **Smooth Transitions** - Use CSS transitions for column changes

## Testing Checklist

- [ ] Test responsive behavior at all breakpoints
- [ ] Verify content reflows properly on resize
- [ ] Check touch targets are 44px+ (on cards/interactions)
- [ ] Test keyboard navigation (Tab through interactive items)
- [ ] Verify in dark mode
- [ ] Check contrast ratios in all modes
- [ ] Test with long content (text wrapping)
- [ ] Verify grid aligns with 8-point spacing
- [ ] Test on actual devices if possible

## Browser Support

- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

Modern CSS Grid support is excellent across all current browsers.

## Learn More

- **Layout Patterns** - See Section 6 in UIUX-MASTER-PROMPT-SYSTEM.md
- **Responsive Design** - See Section 2 in UIUX-MASTER-PROMPT-SYSTEM.md
- **Advanced Patterns** - See Section 16+ in UIUX-MASTER-PROMPT-SYSTEM.md
- **Complete Design System** - Read core/UIUX-SYSTEM-PROMPT.md
- **Examples Overview** - See ../README.md for all available examples

---

**Last Updated:** 2026-04-09 | **Version:** 2.3.0 | **Status:** Production-Ready
