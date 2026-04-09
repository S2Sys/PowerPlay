# UXPro Full App Examples

This directory contains complete, production-ready application layouts demonstrating the UXPro design system at scale.

## Overview

Full app examples show how to integrate multiple patterns, components, and design rules into cohesive interfaces. Each example is a complete, working HTML file that can serve as a template for real applications.

## Examples Included

### Dashboard Layout
- **dashboard-layout.html** - Professional dashboard with sidebar, header, and content grid

#### What's Demonstrated
- Complete app shell architecture
- Sticky navigation header
- Collapsible sidebar navigation
- Main content area with responsive grid
- Dashboard card system
- Data presentation patterns
- Footer area
- Responsive multi-breakpoint behavior
- Dark mode support

#### UXPro Rules Applied
- ✅ Full responsive design (320px to 1536px+)
- ✅ Z-index scale (sticky: 200, modal: 500, etc.)
- ✅ 8-point spacing grid throughout
- ✅ Typography scale with proper hierarchy
- ✅ 60-30-10 color rule (neutral backgrounds, secondary cards, accent CTAs)
- ✅ Touch targets: 44×44px minimum (48×48px buttons)
- ✅ WCAG 2.1 AA contrast throughout
- ✅ Semantic HTML structure
- ✅ ARIA labels and landmarks
- ✅ Keyboard navigation support
- ✅ Dark mode with semantic color tokens
- ✅ Smooth animations (200ms, ease-out)
- ✅ Accessibility skip links

#### Key Sections
1. **Header/Navigation** - Sticky top nav with logo and user menu
2. **Sidebar Navigation** - Collapsible navigation menu
3. **Main Content Area** - Primary dashboard content
4. **Dashboard Grid** - Card-based layout for data display
5. **Data Cards** - Individual metric/data presentation cards
6. **Footer** - Application footer with links and info
7. **Responsive Behavior** - Mobile, tablet, and desktop layouts

#### Architecture

**Overall Structure**
```html
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  
  <header class="app-header"><!-- Navigation --></header>
  
  <div class="app-layout">
    <aside class="app-sidebar"><!-- Navigation menu --></aside>
    <main id="main" class="app-main">
      <div class="content-area"><!-- Page content --></div>
    </main>
  </div>
  
  <footer class="app-footer"><!-- Footer --></footer>
</body>
```

**Header (Sticky)**
- Height: 64px (56px mobile)
- Sticky positioning (z-index: 200)
- Logo/brand on left
- Navigation links in center/right
- User menu with avatar
- Subtle bottom border or shadow

**Sidebar**
- Width: 260px (fixed) or collapsible
- Height: 100vh (full viewport height)
- Navigation menu items (vertical list)
- Collapse button for mobile
- Scrollable if content exceeds viewport
- Background: secondary color (30% color rule)

**Main Content**
- Flexible width (takes remaining space)
- Padding: 24px (mobile), 32px (tablet), 48px (desktop)
- Max content width: 1280px
- White/primary background (60% color rule)

**Cards/Widgets**
- Minimum height: 100px
- Padding: 24px
- Subtle shadow (shadow-sm or shadow-md)
- Border-radius: 8px (lg)
- Background: primary or secondary
- Touch-interactive areas: 44px+ height

#### Customization Tips

**Change Sidebar Width**
```css
.app-sidebar {
  width: 300px; /* Increase from 260px */
  /* Or make it narrower */
  width: 240px;
}

/* Adjust main content padding */
.app-layout {
  margin-left: 300px; /* Must match sidebar width */
}
```

**Change Sidebar Behavior**
Make it collapsible on mobile:
```css
@media (max-width: 767px) {
  .app-sidebar {
    position: fixed;
    transform: translateX(-100%);
    transition: transform 300ms ease-out;
    z-index: 300; /* Above main content */
  }
  
  .app-sidebar.is-open {
    transform: translateX(0);
  }
}
```

**Add More Dashboard Cards**
```html
<div class="card-grid">
  <div class="card"><!-- Card content --></div>
  <!-- Add more cards - grid auto-fits -->
</div>
```

**Change Header Styling**
```css
.app-header {
  background: var(--color-accent); /* Use accent instead of neutral */
  color: white;
  /* Other adjustments */
}
```

## Dashboard App Specs

### Layout Dimensions

**Header**
- Height: 64px (desktop), 56px (mobile)
- Position: Sticky/fixed (z-index: 200)
- Full viewport width

**Sidebar**
- Width: 260px (fixed, or up to 320px)
- Height: 100vh minus header height
- Position: Fixed or sticky
- Overflow: Auto (scrollable if needed)

**Main Content**
- Width: calc(100% - sidebar-width)
- Min-height: 100vh minus header height
- Padding: 24-48px (responsive)
- Max-width: 1280px (for centered layouts)

**Cards**
- Grid: repeat(auto-fit, minmax(300px, 1fr))
- Gap: 16px (compact) or 24px (comfortable)
- Min-height: 100px
- Padding: 16px-24px

### Navigation Menu Items
- Height: 44px minimum (touch target)
- Padding: 12px 16px
- Icon: 20px + 12px margin right
- Text: 14px (sm scale)
- Full width with hover background
- Active state: accent border or background

### User Menu / Dropdown
- Position: Absolute (top-right)
- Z-index: 600 (above most elements)
- Min-width: 200px
- Items: 44px minimum height
- Border-radius: 6px (md)
- Shadow: lg (elevated)

### Footer
- Background: secondary or tertiary color
- Height: Auto (min 60px)
- Padding: 32px 24px
- Text: sm (13px) or xs (10px)
- Links with hover states
- Semantic footer element

## Accessibility Features

### Semantic Structure
```html
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <header role="banner"><!-- Nav --></header>
  <nav aria-label="Main navigation"><!-- Menu --></nav>
  <main id="main"><!-- Content --></main>
  <footer role="contentinfo"><!-- Footer --></footer>
</body>
```

### Navigation
- Skip link at top for keyboard users
- Semantic `<nav>` element
- Proper `aria-label` for multiple navs
- Clear active state indicator

### Focus Management
- Logical tab order (header → sidebar → main → footer)
- Focus indicators on all interactive elements
- Focus visible on click and keyboard
- No focus traps

### ARIA Labels
```html
<button aria-label="Toggle navigation menu">☰</button>
<nav aria-label="Main navigation">
<img src="logo.svg" alt="Company logo" />
<a aria-current="page" href="/dashboard">Dashboard</a>
```

### Content Regions
- `<header>` for top navigation
- `<nav>` for menus
- `<main>` for primary content
- `<aside>` for secondary content (sidebar)
- `<footer>` for footer content
- `<section>` for content sections

## Dark Mode Support

All dashboard examples adapt to dark mode:

```css
/* Light mode (default) */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #000000;
  --border-default: #e5e5e5;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #242424;
    --text-primary: #ffffff;
    --border-default: #404040;
  }
}
```

## Responsive Behavior

### Mobile Layout (320px - 479px)
- Full-width layout
- Sidebar hidden (reveal with hamburger menu)
- Single column content
- Header height: 56px
- No fixed positioning for sidebar
- Collapse/expand sidebar on demand

### Tablet Layout (480px - 767px)
- Can show narrow sidebar
- 2-column card grid
- Header height: 60px
- Padding: 24px
- Sidebar collapsible or always visible

### Small Desktop (768px - 1023px)
- Always show sidebar
- 2-3 column card grid
- Header height: 64px
- Padding: 32px
- Sidebar width: 260px

### Large Desktop (1024px+)
- Always show sidebar
- 3-4 column card grid
- Header height: 64px
- Padding: 48px
- Sidebar width: 260px
- Main content max-width: 1280px

## Integration Guide

### Copying to Your Project

1. **Copy entire HTML file** - Complete app shell
2. **Extract CSS** - All styles from `<style>` tag
3. **Extract JavaScript** - Simple toggle for sidebar (if included)
4. **Adapt layout** - Change sidebar width, colors, navigation items
5. **Add content** - Replace placeholder content with real data
6. **Test responsiveness** - Verify at all breakpoints

### Adding Real Content

**Replace Dashboard Cards**
```html
<!-- Before (placeholder) -->
<div class="card">
  <h3>Total Users</h3>
  <p class="metric">12,345</p>
</div>

<!-- After (real data) -->
<div class="card">
  <h3>Total Users</h3>
  <p class="metric">12,345</p>
  <p class="change">↑ 5.2% from last week</p>
</div>
```

**Update Navigation**
```html
<!-- Update menu items to match your app -->
<nav class="sidebar-nav">
  <a href="/" class="nav-item is-active">Dashboard</a>
  <a href="/users" class="nav-item">Users</a>
  <a href="/reports" class="nav-item">Reports</a>
  <a href="/settings" class="nav-item">Settings</a>
</nav>
```

**Customize Header**
```html
<!-- Replace logo and user menu -->
<header class="app-header">
  <img src="your-logo.svg" alt="Your Company" />
  <div class="user-menu">
    <img src="user-avatar.jpg" alt="" class="avatar" />
    <span>John Doe</span>
  </div>
</header>
```

### Framework Integration (React Example)
```jsx
function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="app-container">
      <AppHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <AppLayout>
        <AppSidebar isOpen={sidebarOpen} />
        <MainContent>
          <CardGrid>
            {dashboardCards.map(card => (
              <Card key={card.id} {...card} />
            ))}
          </CardGrid>
        </MainContent>
      </AppLayout>
    </div>
  );
}
```

## Common Dashboard Patterns

### Metrics Cards (KPIs)
```html
<div class="card card-metric">
  <h3 class="card-title">Revenue</h3>
  <p class="card-value">$45,231.89</p>
  <p class="card-change trend-positive">↑ 20.1% from last month</p>
</div>
```

### Chart Cards
```html
<div class="card card-chart">
  <h3 class="card-title">Trends</h3>
  <div class="chart-container">
    <!-- Chart library (Chart.js, D3, etc.) -->
  </div>
</div>
```

### Activity Feed
```html
<div class="card card-feed">
  <h3 class="card-title">Recent Activity</h3>
  <ul class="activity-list">
    <li class="activity-item">User Jane joined</li>
    <li class="activity-item">Report exported by John</li>
  </ul>
</div>
```

### Quick Actions
```html
<div class="card card-actions">
  <h3 class="card-title">Quick Actions</h3>
  <div class="action-buttons">
    <button class="btn btn-primary">New User</button>
    <button class="btn btn-secondary">Export Data</button>
  </div>
</div>
```

## Testing Checklist

- [ ] Test at 320px, 768px, 1280px (all breakpoints)
- [ ] Verify sidebar collapses/expands properly on mobile
- [ ] Test keyboard navigation (Tab through all interactive elements)
- [ ] Check focus indicators on all buttons and links
- [ ] Test with screen reader (VoiceOver, NVDA)
- [ ] Verify all text has 4.5:1 contrast (WCAG AA)
- [ ] Test dark mode on your system
- [ ] Verify header is sticky and readable
- [ ] Test card grid reflows properly
- [ ] Check all hover/active states work
- [ ] Verify animations respect prefers-reduced-motion
- [ ] Test on actual mobile device if possible

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Learn More

- **Layout Patterns** - See Section 6 in UIUX-MASTER-PROMPT-SYSTEM.md
- **Navigation Patterns** - See Section 17 in UIUX-MASTER-PROMPT-SYSTEM.md
- **Responsive Design** - See Section 2 in UIUX-MASTER-PROMPT-SYSTEM.md
- **Data Visualization** - See Section 14 in UIUX-MASTER-PROMPT-SYSTEM.md
- **Complete Design System** - Read core/UIUX-SYSTEM-PROMPT.md
- **Examples Overview** - See ../README.md for all available examples

---

**Last Updated:** 2026-04-09 | **Version:** 2.3.0 | **Status:** Production-Ready
