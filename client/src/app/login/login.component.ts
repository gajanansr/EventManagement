import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  itemForm!: FormGroup;
  showMessage: boolean = false;
  showError: boolean = false;
  responseMessage: string = '';
  hidePassword: boolean = true;
  isLoading: boolean = false;

  usernamePattern = '^[a-z]+$';

  features = [
    {
      icon: 'event',
      title: 'Smart Planning',
      description: 'Intelligent event management with automated workflows'
    },
    {
      icon: 'groups',
      title: 'Team Collaboration',
      description: 'Seamless coordination across your entire team'
    },
    {
      icon: 'analytics',
      title: 'Real-time Analytics',
      description: 'Track performance with comprehensive insights'
    }
  ];

  constructor(
    private router: Router,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(this.usernamePattern)]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.itemForm.valid) {
      this.isLoading = true;
      this.showMessage = false;
      this.showError = false;
      this.responseMessage = '';

      this.httpService.Login(this.itemForm.value).subscribe(
        (data: any) => {
          this.isLoading = false;
          this.showMessage = true;
          this.responseMessage = 'Login successful! Redirecting to dashboard...';
          
          setTimeout(() => {
            this.authService.setRole(data.role);
            this.authService.saveToken(data.token);
            localStorage.setItem('token', data.token);
            this.router.navigateByUrl('dashboard').then(() => {
              window.location.reload();
            });
          }, 1000);
        },
        error => {
          this.isLoading = false;
          this.showMessage = true;
          this.showError = true;
          if (error.status === 401) {
            this.responseMessage = 'Incorrect username or password. Please try again.';
          } else {
            this.responseMessage = 'An error occurred during login. Please try again later.';
          }
        }
      );
    } else {
      this.showMessage = true;
      this.showError = true;
      this.responseMessage = 'Please fill in all required fields correctly.';
      this.itemForm.markAllAsTouched();
    }
  }
}