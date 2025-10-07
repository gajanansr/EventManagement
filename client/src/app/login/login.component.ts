import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  itemForm!: FormGroup;
  showMessage: boolean = false;
  showError: boolean = false;
  responseMessage: string = '';
  

  usernamePattern = '^[a-z]+$';
  passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,64}$';

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
      this.showMessage = false;
      this.showError = false;
      this.responseMessage = '';

      this.httpService.Login(this.itemForm.value).subscribe(
        (data: any) => {
          this.showMessage = true;
          this.responseMessage = 'Login successful! Redirecting to dashboard...';
          
          // Set a timeout to allow the user to see the success message
          setTimeout(() => {
            this.authService.setRole(data.role);
            this.authService.saveToken(data.token);
            localStorage.setItem('token', data.token);
            this.router.navigateByUrl('dashboard').then(() => {
              window.location.reload();
            });
          }, 1000); // 1 second delay
        },
        error => {
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