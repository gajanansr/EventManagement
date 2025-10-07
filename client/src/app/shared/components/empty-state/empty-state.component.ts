import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  @Input() icon: string = 'inbox';
  @Input() title: string = 'No items found';
  @Input() message: string = 'There are no items to display.';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;
}
