import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
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
export class RegistrationComponent implements OnInit {
  itemForm!: FormGroup;
  showMessage: boolean = false;
  responseMessage: any;
  usernamePattern = '^[a-z]+$';
  passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$';
  users$: Observable<any> = of([]);
  showError: boolean = false;
  errorMessage: any;
  hidePassword: boolean = true;
  isLoading: boolean = false;

  features = [
    {
      icon: 'dashboard',
      title: 'Powerful Dashboard',
      description: 'Manage all your events from one central location'
    },
    {
      icon: 'group',
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team members'
    },
    {
      icon: 'insights',
      title: 'Smart Analytics',
      description: 'Get insights to improve your events'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {
    this.itemForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(this.usernamePattern)], [this.uniqueValidator.bind(this)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      role: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.users$ = this.httpService.GetAllUsers();
    this.users$.subscribe(data => {
      if (data) {
        localStorage.setItem('abcd', JSON.stringify(data));
      }
    });
  }

  uniqueValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const v = control.value;
        let users = JSON.parse(localStorage.getItem('abcd') || '[]');
        if (Array.isArray(users)) {
          const usernames = users.map((user: any) => user.username);
          if (usernames.includes(v)) {
            resolve({ notUnique: true });
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  onRegister(): void {
    if (this.itemForm.valid) {
      this.isLoading = true;
      this.showMessage = false;
      this.showError = false;
      this.httpService.registerUser(this.itemForm.value).subscribe(
        data => {
          this.isLoading = false;
          this.showMessage = true;
          this.responseMessage = `Welcome ${data.username}! You are successfully registered`;
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2000);
        },
        error => {
          this.isLoading = false;
          this.showError = true;
          this.errorMessage = error.error || 'Registration failed. Please try again.';
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
}
