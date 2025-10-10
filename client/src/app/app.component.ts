import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
}
