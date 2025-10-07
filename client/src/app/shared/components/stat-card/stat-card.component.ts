import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() icon: string = 'analytics';
  @Input() title: string = '';
  @Input() value: string | number = '0';
  @Input() subtitle: string = '';
  @Input() trend?: 'up' | 'down' | 'neutral';
  @Input() trendValue?: string;
  @Input() color: 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info' = 'primary';
  @Input() loading: boolean = false;

  getColorClass(): string {
    return `stat-card-${this.color}`;
  }

  getTrendIcon(): string {
    switch(this.trend) {
      case 'up': return 'trending_up';
      case 'down': return 'trending_down';
      default: return 'trending_flat';
    }
  }

  getTrendClass(): string {
    switch(this.trend) {
      case 'up': return 'trend-up';
      case 'down': return 'trend-down';
      default: return 'trend-neutral';
    }
  }
}
