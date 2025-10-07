import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Loading...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() fullScreen: boolean = false;

  getDiameter(): number {
    switch(this.size) {
      case 'small': return 32;
      case 'large': return 64;
      default: return 48;
    }
  }
}
