# Event Management System - Design System Documentation

Version 1.0 | Last Updated: October 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Color Palette](#color-palette)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Elevation & Shadows](#elevation--shadows)
6. [Border Radius](#border-radius)
7. [Breakpoints](#breakpoints)
8. [Components](#components)
9. [Animations](#animations)
10. [Usage Guidelines](#usage-guidelines)

---

## Overview

This design system is built on **Angular Material 14** with a custom indigo/blue theme. All design tokens are defined as CSS custom properties in `/client/src/styles.scss` for consistency and easy theming.

### Design Principles

- **Consistency**: Unified visual language across all components
- **Accessibility**: WCAG 2.1 AA compliant
- **Responsiveness**: Mobile-first approach
- **Performance**: Optimized animations and rendering
- **Maintainability**: Centralized design tokens

---

## Color Palette

### Primary Colors (Indigo)

```scss
--primary-50:  #f0f4ff;
--primary-100: #e0e7ff;
--primary-200: #c7d2fe;
--primary-300: #a5b4fc;
--primary-400: #818cf8;
--primary-500: #6366f1;  // Main primary
--primary-600: #5a67d8;  // Primary hover
--primary-700: #4c51bf;
--primary-800: #434190;
--primary-900: #3730a3;
```

**Usage:**
- Primary actions (buttons, links)
- Interactive elements
- Brand identity elements
- Icon highlights

**Example:**
```css
.primary-button {
  background-color: var(--primary-600);
}
```

---

### Accent Colors (Blue)

```scss
--accent-400: #60a5fa;
--accent-500: #3b82f6;
--accent-600: #2563eb;
```

**Usage:**
- Secondary actions
- Highlights and emphasis
- Complementary to primary

---

### Neutral Colors (Grays)

```scss
--gray-50:  #f9fafb;  // Backgrounds
--gray-100: #f3f4f6;  // Light backgrounds
--gray-200: #e5e7eb;  // Borders
--gray-300: #d1d5db;  // Dividers
--gray-400: #9ca3af;  // Disabled
--gray-500: #6b7280;  // Secondary text
--gray-600: #4b5563;  // Body text
--gray-700: #374151;  // Headings
--gray-800: #1f2937;  // Dark headings
--gray-900: #111827;  // Primary text
```

**Usage:**
- Text hierarchy
- Backgrounds and surfaces
- Borders and dividers
- Disabled states

---

### Semantic Colors

#### Success (Green)
```scss
--success-500: #10b981;
--success-600: #059669;
```
**Usage:** Success messages, confirmations, positive trends

#### Warning (Amber)
```scss
--warning-500: #f59e0b;
--warning-600: #d97706;
```
**Usage:** Warnings, caution messages, pending states

#### Error (Red)
```scss
--error-500: #ef4444;
--error-600: #dc2626;
```
**Usage:** Errors, destructive actions, negative trends

#### Info (Blue)
```scss
--info-500: #3b82f6;
--info-600: #2563eb;
```
**Usage:** Informational messages, tips, neutral notifications

---

### Color Usage Examples

```html
<!-- Primary Button -->
<button mat-raised-button color="primary">Submit</button>

<!-- Success Alert -->
<div class="alert-success">
  <mat-icon>check_circle</mat-icon>
  Success message
</div>

<!-- Status Badges -->
<span class="badge-success">Completed</span>
<span class="badge-warning">Pending</span>
<span class="badge-error">Cancelled</span>
```

---

## Typography

### Font Stack

```scss
font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

**Rationale:** System fonts provide optimal performance and native look on each platform.

---

### Type Scale

| Element | Size | Weight | Line Height | Usage |
|---------|------|--------|-------------|-------|
| H1 | 2rem (32px) | 700 | 1.2 | Page titles |
| H2 | 1.5rem (24px) | 600 | 1.3 | Section titles |
| H3 | 1.25rem (20px) | 600 | 1.4 | Subsection titles |
| H4 | 1rem (16px) | 600 | 1.5 | Card titles |
| Body | 1rem (16px) | 400 | 1.6 | Body text |
| Small | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| Caption | 0.75rem (12px) | 400 | 1.4 | Captions, labels |

---

### Typography Examples

```html
<!-- Page Title -->
<h1 class="page-title">Events Dashboard</h1>

<!-- Section Title -->
<h2 class="section-title">Upcoming Events</h2>

<!-- Card Title -->
<h3 class="card-title">Annual Conference 2025</h3>

<!-- Body Text -->
<p>This is body text with optimal line height for readability.</p>

<!-- Small Text -->
<span class="text-small">Secondary information</span>

<!-- Caption -->
<span class="caption">Last updated 2 hours ago</span>
```

---

## Spacing System

Consistent spacing using an 8px base unit.

```scss
--spacing-xs:   0.25rem;  // 4px
--spacing-sm:   0.5rem;   // 8px
--spacing-md:   1rem;     // 16px
--spacing-lg:   1.5rem;   // 24px
--spacing-xl:   2rem;     // 32px
--spacing-2xl:  3rem;     // 48px
```

### Spacing Usage

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, tight spacing |
| sm | 8px | Form field gaps, button padding |
| md | 16px | Card padding, component spacing |
| lg | 24px | Section spacing |
| xl | 32px | Page padding |
| 2xl | 48px | Large section gaps |

**Example:**
```scss
.card {
  padding: var(--spacing-lg);
  gap: var(--spacing-md);
}
```

---

## Elevation & Shadows

Layered shadow system for depth and hierarchy.

```scss
--shadow-sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md:  0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg:  0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl:  0 20px 25px -5px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
```

### Shadow Levels

| Level | Token | Usage |
|-------|-------|-------|
| 1 | shadow-sm | Buttons, chips |
| 2 | shadow-md | Cards, dropdowns |
| 3 | shadow-lg | Modals, elevated cards |
| 4 | shadow-xl | Dialogs, popovers |
| 5 | shadow-2xl | Full-screen overlays |

**Example:**
```scss
.card {
  box-shadow: var(--shadow-md);
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
}
```

---

## Border Radius

Consistent corner rounding for visual harmony.

```scss
--radius-sm:   6px;   // Small elements
--radius-md:   8px;   // Medium elements
--radius-lg:   12px;  // Large cards
--radius-xl:   16px;  // Extra large containers
--radius-full: 9999px; // Pills, avatars
```

### Radius Usage

| Token | Value | Usage |
|-------|-------|-------|
| sm | 6px | Buttons, chips, badges |
| md | 8px | Form fields, inputs |
| lg | 12px | Cards, containers |
| xl | 16px | Large sections |
| full | 9999px | Circular avatars, pills |

**Example:**
```scss
.card {
  border-radius: var(--radius-lg);
}

.avatar {
  border-radius: var(--radius-full);
}
```

---

## Breakpoints

Mobile-first responsive design breakpoints.

```scss
// Small devices (phones)
@media (max-width: 576px) { }

// Medium devices (tablets)
@media (max-width: 768px) { }

// Large devices (desktops)
@media (max-width: 968px) { }

// Extra large devices
@media (max-width: 1200px) { }
```

### Breakpoint Usage

| Breakpoint | Width | Target Devices |
|------------|-------|----------------|
| xs | 0-576px | Mobile phones |
| sm | 577-768px | Large phones, small tablets |
| md | 769-968px | Tablets, small laptops |
| lg | 969-1200px | Desktops |
| xl | 1201px+ | Large desktops |

**Example:**
```scss
.grid {
  grid-template-columns: repeat(3, 1fr);
  
  @media (max-width: 968px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
}
```

---

## Components

### Shared Components

Our design system includes reusable shared components:

1. **StatCard** - Statistics display with trends
2. **EmptyState** - No data states
3. **LoadingSpinner** - Loading indicators
4. **ConfirmDialog** - Confirmation dialogs
5. **PageHeader** - Page headers with actions

See `/client/src/app/shared/README.md` for detailed component documentation.

---

### Material Components Used

- **MatCard**: Content containers
- **MatButton**: Actions (raised, stroked, flat)
- **MatFormField**: Form inputs
- **MatIcon**: Icons from Material Icons
- **MatMenu**: Dropdown menus
- **MatDialog**: Modal dialogs
- **MatTabs**: Tabbed interfaces
- **MatTable**: Data tables
- **MatChip**: Tags and filters
- **MatBadge**: Notification badges
- **MatProgressSpinner**: Loading states

---

## Animations

### Transition Durations

```scss
--transition-fast:   150ms;
--transition-base:   200ms;
--transition-slow:   300ms;
```

### Animation Types

#### Fade In
```scss
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide In
```scss
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Hover Effects
```scss
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}
```

---

## Usage Guidelines

### Do's ✅

- Use design tokens (CSS variables) instead of hardcoded values
- Follow the type scale for text hierarchy
- Maintain consistent spacing using spacing tokens
- Apply appropriate shadow levels for elevation
- Use semantic colors for their intended purpose
- Test responsive behavior at all breakpoints
- Follow Material Design principles

### Don'ts ❌

- Don't use arbitrary color values
- Don't mix different spacing systems
- Don't override Material component styles without good reason
- Don't forget mobile responsiveness
- Don't use inline styles
- Don't ignore accessibility guidelines

---

### Accessibility

- **Color Contrast**: All text meets WCAG AA standards (4.5:1 minimum)
- **Focus States**: Visible focus indicators on all interactive elements
- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper ARIA attributes on complex components
- **Screen Readers**: Semantic HTML and proper labeling

---

### File Structure

```
client/src/
├── styles.scss                    # Global styles & design tokens
├── material-theme.scss            # Material theme configuration
├── app/
│   ├── shared/
│   │   ├── shared.module.ts      # Shared components module
│   │   ├── README.md             # Shared components docs
│   │   └── components/
│   │       ├── stat-card/
│   │       ├── empty-state/
│   │       ├── loading-spinner/
│   │       ├── confirm-dialog/
│   │       └── page-header/
│   └── [feature-components]/
```

---

## Quick Reference

### Common Patterns

#### Card with Header and Actions
```html
<mat-card class="custom-card">
  <mat-card-header>
    <mat-card-title>Card Title</mat-card-title>
  </mat-card-header>
  <mat-card-content>
    Content goes here
  </mat-card-content>
  <mat-card-actions>
    <button mat-raised-button color="primary">Action</button>
  </mat-card-actions>
</mat-card>
```

#### Form Field
```html
<mat-form-field appearance="outline">
  <mat-label>Label</mat-label>
  <input matInput formControlName="fieldName">
  <mat-icon matPrefix>icon_name</mat-icon>
  <mat-error *ngIf="form.get('fieldName')?.hasError('required')">
    Required field
  </mat-error>
</mat-form-field>
```

#### Status Badge
```html
<span class="badge" [ngClass]="{
  'badge-success': status === 'Completed',
  'badge-warning': status === 'Pending',
  'badge-error': status === 'Cancelled'
}">
  {{ status }}
</span>
```

---

## Version History

- **v1.0** (October 2025) - Initial design system documentation
  - Established color palette
  - Defined spacing and typography scales
  - Created shared component library
  - Implemented responsive breakpoints

---

## Support & Contributions

For questions or contributions to the design system:
1. Review this documentation
2. Check existing components in `/shared`
3. Follow established patterns
4. Test across all breakpoints
5. Document any new patterns

---

**Last Updated:** October 7, 2025  
**Maintained by:** EventManagement Design Team
