import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { trigger, transition, style, query, animate, group } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', [
          style({
            position: 'absolute',
            width: '100%'
          })
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' })
        ], { optional: true }),
        group([
          query(':leave', [
            animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-20px)' }))
          ], { optional: true }),
          query(':enter', [
            animate('300ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true })
        ])
      ])
    ])
  ]
})
export class AppComponent {
  isLoggedIn: boolean = false;
  roleName: string | null = null;
  
  constructor(private authService: AuthService, private router: Router) {
    this.checkAuthStatus();
  }
  
  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.getLoginStatus;
    this.roleName = this.authService.getRole;
    
    // Don't redirect to login if user is on landing page, login page, or registration page
    const publicRoutes = ['/', '/login', '/registration'];
    const currentRoute = this.router.url;
    
    if (!this.isLoggedIn && !publicRoutes.includes(currentRoute)) {
      this.router.navigateByUrl('/login');
    }
  }
  
  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.roleName = null;
    this.router.navigateByUrl('/login');
  }
  
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
