import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

// Shared Components
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';

const COMPONENTS = [
  StatCardComponent,
  EmptyStateComponent,
  LoadingSpinnerComponent,
  ConfirmDialogComponent,
  PageHeaderComponent
];

const MATERIAL_MODULES = [
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatDialogModule
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],
  exports: [
    ...COMPONENTS,
    ...MATERIAL_MODULES
  ]
})
export class SharedModule { }
