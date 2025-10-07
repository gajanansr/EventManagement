# Shared Components Library

A collection of reusable UI components built with Angular Material for the Event Management System.

## Components

### 1. StatCard Component

Display statistics with icons, values, and trends.

**Usage:**
```html
<app-stat-card
  icon="event"
  title="Total Events"
  [value]="24"
  subtitle="This month"
  trend="up"
  trendValue="+12%"
  color="primary">
</app-stat-card>
```

**Inputs:**
- `icon` (string): Material icon name (default: 'analytics')
- `title` (string): Card title
- `value` (string | number): Main stat value
- `subtitle` (string): Subtitle text
- `trend` ('up' | 'down' | 'neutral'): Trend direction
- `trendValue` (string): Trend percentage/value
- `color` ('primary' | 'accent' | 'success' | 'warning' | 'error' | 'info'): Icon gradient color
- `loading` (boolean): Show loading spinner

---

### 2. EmptyState Component

Display when no data is available.

**Usage:**
```html
<app-empty-state
  icon="inbox"
  title="No events found"
  message="There are no events matching your criteria.">
  <button mat-raised-button color="primary">Create Event</button>
</app-empty-state>
```

**Inputs:**
- `icon` (string): Material icon name (default: 'inbox')
- `title` (string): Empty state title
- `message` (string): Description message

**Content Projection:**
Use `<ng-content>` to add custom action buttons.

---

### 3. LoadingSpinner Component

Display loading state with optional message.

**Usage:**
```html
<app-loading-spinner
  message="Loading events..."
  size="medium"
  [fullScreen]="false">
</app-loading-spinner>
```

**Inputs:**
- `message` (string): Loading message (default: 'Loading...')
- `size` ('small' | 'medium' | 'large'): Spinner size
- `fullScreen` (boolean): Display as full-screen overlay

---

### 4. ConfirmDialog Component

Confirmation dialog for destructive actions.

**Usage:**
```typescript
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';

constructor(private dialog: MatDialog) {}

openConfirmDialog() {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      title: 'Delete Event',
      message: 'Are you sure you want to delete this event? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmColor: 'warn',
      icon: 'delete'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // User confirmed
      this.deleteEvent();
    }
  });
}
```

**Data Interface:**
```typescript
{
  title: string;
  message: string;
  confirmText?: string;      // default: 'Confirm'
  cancelText?: string;       // default: 'Cancel'
  confirmColor?: 'primary' | 'accent' | 'warn';  // default: 'primary'
  icon?: string;            // default: 'help_outline'
}
```

---

### 5. PageHeader Component

Standardized page header with title, subtitle, and actions.

**Usage:**
```html
<app-page-header
  title="Events"
  subtitle="Manage all your events"
  icon="event"
  actionLabel="Create Event"
  actionIcon="add"
  (action)="onCreateEvent()">
  <!-- Custom buttons via ng-content -->
  <button mat-stroked-button>
    <mat-icon>filter_list</mat-icon>
    Filters
  </button>
</app-page-header>
```

**Inputs:**
- `title` (string): Page title
- `subtitle` (string): Page subtitle/description
- `icon` (string): Material icon for title
- `actionLabel` (string): Primary action button label
- `actionIcon` (string): Primary action button icon

**Outputs:**
- `action`: Emitted when primary action button is clicked

---

## Installation

The `SharedModule` is already imported in `app.module.ts`. To use these components in your feature modules:

```typescript
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [...],
  imports: [
    SharedModule,
    // other modules
  ]
})
export class YourModule { }
```

## Examples

### Dashboard Stats Grid

```html
<div class="stats-grid">
  <app-stat-card
    icon="event"
    title="Total Events"
    [value]="stats.totalEvents"
    color="primary"
    trend="up"
    trendValue="+12%">
  </app-stat-card>
  
  <app-stat-card
    icon="people"
    title="Total Bookings"
    [value]="stats.totalBookings"
    color="success"
    trend="up"
    trendValue="+5%">
  </app-stat-card>
  
  <app-stat-card
    icon="schedule"
    title="Pending"
    [value]="stats.pending"
    color="warning"
    trend="down"
    trendValue="-3%">
  </app-stat-card>
</div>
```

### Empty State with Action

```html
<app-empty-state
  *ngIf="events.length === 0"
  icon="event_busy"
  title="No events scheduled"
  message="Get started by creating your first event.">
  <button mat-raised-button color="primary" (click)="createEvent()">
    <mat-icon>add</mat-icon>
    Create Event
  </button>
</app-empty-state>
```

### Full-Screen Loading

```html
<app-loading-spinner
  *ngIf="isLoading"
  [fullScreen]="true"
  message="Loading your events...">
</app-loading-spinner>
```

## Styling

All components use the global design system tokens defined in `styles.scss`:
- Colors: `--primary-*`, `--accent-*`, `--gray-*`, `--success-*`, `--warning-*`, `--error-*`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full`
- Spacing: `--spacing-xs` through `--spacing-2xl`

Components are fully responsive with mobile-first breakpoints at 576px and 768px.
