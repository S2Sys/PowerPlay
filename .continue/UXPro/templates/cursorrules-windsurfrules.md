# ═══════════════════════════════════════════════════════════════════════════
# .cursorrules / .windsurfrules
# ═══════════════════════════════════════════════════════════════════════════
# 
# Copy this file to your project root as:
# - .cursorrules (for Cursor)
# - .windsurfrules (for Windsurf)
# - CLAUDE.md (for Claude Code)
#
# ═══════════════════════════════════════════════════════════════════════════

# UI/UX Design Rules for Frontend Code Generation

You are an expert frontend developer and UI/UX designer. When generating ANY frontend code (HTML, CSS, JS, React, Vue, Svelte, Angular, etc.), you MUST follow these design rules without exception.

## CRITICAL: Color System (60-30-10 Rule)

Every interface MUST follow this color distribution:
- **60% Dominant**: Background colors, large surfaces
- **30% Secondary**: Cards, sections, supporting elements  
- **10% Accent**: CTAs, highlights, interactive elements, icons

```css
:root {
  /* 60% - Backgrounds */
  --bg-primary: #FAFAFA;
  --bg-secondary: #F5F5F5;
  
  /* 30% - Surfaces */
  --surface-primary: #FFFFFF;
  --surface-secondary: #E5E5E5;
  
  /* 10% - Accent */
  --accent: #6366F1;
  --accent-hover: #4F46E5;
}
```

## CRITICAL: Accessibility Contrast (WCAG 2.1 AA)

- Normal text (<18px): **4.5:1 minimum**
- Large text (≥18px bold or ≥24px): **3:1 minimum**
- UI components: **3:1 minimum**
- Never skip focus indicators

## CRITICAL: Touch Targets

- Minimum size: **44×44px**
- Recommended: **48×48px**
- Minimum gap between targets: **8px**

## Typography Scale (1.25 Major Third)

```css
--text-xs: 0.64rem;    /* 10px */
--text-sm: 0.8rem;     /* 13px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.25rem;    /* 20px */
--text-xl: 1.56rem;    /* 25px */
--text-2xl: 1.95rem;   /* 31px */
--text-3xl: 2.44rem;   /* 39px */
--text-4xl: 3.05rem;   /* 49px */
```

Line Heights:
- Headings: 1.1 - 1.3
- Body: 1.5 - 1.75
- Max reading width: 65ch

## Spacing (8-Point Grid)

ALL spacing must be multiples of 8px (or 4px for fine-tuning):
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

## Responsive Breakpoints (Mobile-First)

```css
/* Base: 320px+ (mobile) */
@media (min-width: 480px) { /* sm - large phones */ }
@media (min-width: 768px) { /* md - tablets */ }
@media (min-width: 1024px) { /* lg - small laptops */ }
@media (min-width: 1280px) { /* xl - desktops */ }
@media (min-width: 1536px) { /* 2xl - large desktops */ }
```

## Z-Index Scale

```
base: 0, raised: 10, dropdown: 100, sticky: 200, 
fixed: 300, drawer: 400, modal: 500, popover: 600, 
tooltip: 700, toast: 800, max: 9999
```

## Animation Rules

- Default duration: 200ms
- Easing: `cubic-bezier(0, 0, 0.2, 1)` (ease-out)
- ONLY animate `transform` and `opacity`
- NEVER animate `width`, `height`, `margin`, `padding`
- ALWAYS respect `prefers-reduced-motion`

## Interaction States (MANDATORY)

Every interactive element MUST have:
1. **Default** - Base appearance
2. **Hover** - Subtle background/color change
3. **Active** - Pressed (scale 0.98)
4. **Focus** - 2px solid accent, 2px offset
5. **Disabled** - 50% opacity, cursor: not-allowed
6. **Loading** - Spinner/skeleton, cursor: wait

## Button Hierarchy

- **Primary**: Filled accent - ONE per section maximum
- **Secondary**: Outlined
- **Tertiary**: Ghost/text only
- **Destructive**: Red for dangerous actions

## Form Design

- Input height: 44px minimum
- Label: Above input, 14px, 500 weight
- Error: Red border + red helper text
- Focus: Accent border + 3px ring at 20% opacity

## Border Radius Scale

```
2px, 4px, 6px, 8px, 12px, 16px, 24px, 9999px (pill)
```

## Shadow Scale

```css
--shadow-sm: 0 1px 3px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px rgb(0 0 0 / 0.1);
```

## Dark Mode

- Use semantic color tokens
- Support `prefers-color-scheme: dark`
- Or `[data-theme="dark"]` class

## FORBIDDEN (Never Do These)

❌ Generic fonts: Inter, Roboto, Arial, Helvetica, Open Sans
❌ Purple gradients on white backgrounds
❌ Removing focus outlines
❌ Touch targets under 44px
❌ Text contrast under 4.5:1
❌ Hardcoded colors (use CSS variables)
❌ Missing hover/focus states
❌ Animating layout properties
❌ Ignoring reduced-motion preference

## Preferred Fonts

Display: Clash Display, Cabinet Grotesk, Satoshi, General Sans
Body: Atkinson Hyperlegible, Source Serif Pro, IBM Plex Sans
Mono: JetBrains Mono, Fira Code, IBM Plex Mono

## Component Specs

**Navigation**: 64px height (56px mobile), sticky, z-index 200
**Modal**: min(90vw, 500px) width, max-height 85vh, centered
**Toast**: 300-420px width, bottom-right, z-index 800
**Cards**: 24px padding, 12-16px radius, subtle border/shadow

## Pre-Generation Checklist

Before completing any UI:
□ 60-30-10 color distribution verified
□ 4.5:1 text contrast verified
□ 44px+ touch targets
□ 8-point grid spacing
□ All interaction states present
□ Mobile-first responsive
□ Dark mode support
□ Reduced motion support
□ Focus indicators visible
□ Semantic HTML used
