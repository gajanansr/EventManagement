import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  itemForm!: FormGroup;
  showMessage: boolean = false;
  responseMessage: any;
  
  usernamePattern = '^[a-z]{3,}$';
  passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,27}$';
  
  // CAPTCHA variables
  captchaNum1: number = 0;
  captchaNum2: number = 0;
  captchaAnswer: number = 0;
  
  usernameRules = [
    { key: "required", label: "Username required", satisfied: false },
    { key: "minLength", label: "Username should be at least 3 characters", satisfied: false },
    { key: "lowerCase", label: "Username can only have lowercase characters", satisfied: false },
  ]

  passwordRules = [
    { key: "required", label: "Password required", satisfied: false },
    { key: "capital", label: "Password should have a capital letter", satisfied: false },
    { key: "special", label: "Password should have a special character", satisfied: false },
    { key: "number", label: "Password should have a number", satisfied: false },
    { key: "minLength", label: "Password should be of 8 characters at least", satisfied: false }
  ]

  users$: Observable<any> = of([]);
  showError: boolean = false;
  errorMessage: any;
  showPassword: boolean = false; // For show/hide password toggle
  showAccessKey: boolean = false; // For show/hide access key toggle

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {
    this.itemForm = this.formBuilder.group({
      name:['',[Validators.required,Validators.pattern(/^[a-zA-Z\s]{2,50}$/)]],
      username: ['', [Validators.required, Validators.pattern(this.usernamePattern)]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_+-.%]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      role: ['', [Validators.required]],
      accessKey: [''], // For PLANNER role only
      captchaAnswer: ['', [Validators.required, Validators.pattern(/^\d+$/)]]
    });
  }
  
  ngOnInit(): void {
    this.generateCaptcha();
    
    this.itemForm.get('username')?.valueChanges.subscribe(value => {
      this.checkUsernameRules(value || '')
    })

    this.itemForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordRules(value || '')
    })
    
    // Add/remove accessKey validator based on role
    this.itemForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'PLANNER') {
        this.itemForm.get('accessKey')?.setValidators([Validators.required]);
      } else {
        this.itemForm.get('accessKey')?.clearValidators();
      }
      this.itemForm.get('accessKey')?.updateValueAndValidity();
    });
  }
  
  generateCaptcha() {
    this.captchaNum1 = Math.floor(Math.random() * 20) + 1; // Random number 1-20
    this.captchaNum2 = Math.floor(Math.random() * 20) + 1; // Random number 1-20
    this.captchaAnswer = this.captchaNum1 + this.captchaNum2;
  }
  
  refreshCaptcha() {
    this.generateCaptcha();
    this.itemForm.get('captchaAnswer')?.reset();
  }

  checkUsernameRules(username: string){
    this.usernameRules[0].satisfied = username.length > 0
    this.usernameRules[1].satisfied = username.length >= 3
    this.usernameRules[2].satisfied = /^[a-z]+$/.test(username)
  }

  checkPasswordRules(password: string){
    this.passwordRules[0].satisfied = password.length > 0
    this.passwordRules[1].satisfied = /[A-Z]/.test(password)
    this.passwordRules[2].satisfied = /[@#$%^&+=]/.test(password)
    this.passwordRules[3].satisfied = /[0-9]/.test(password)
    this.passwordRules[4].satisfied = password.length >= 8
  }

  get showUsernameRequirements(): boolean {
    return this.usernameRules?.some( rule => !rule.satisfied)
  }

  get showPasswordRequirements(): boolean {
    return this.passwordRules?.some(rule => !rule.satisfied)
  }


  onRegister(): void {
    if (this.itemForm.valid) {
      // Validate CAPTCHA
      const userAnswer = parseInt(this.itemForm.get('captchaAnswer')?.value);
      if (userAnswer !== this.captchaAnswer) {
        this.showError = true;
        this.errorMessage = 'Incorrect CAPTCHA answer. Please try again.';
        this.refreshCaptcha();
        return;
      }
      
      // Validate access key for PLANNER role
      if (this.itemForm.value.role === 'PLANNER') {
        const accessKey = this.itemForm.get('accessKey')?.value;
        if (accessKey !== '1234') {
          this.showError = true;
          this.errorMessage = 'Invalid access key for PLANNER role.';
          return;
        }
      }
      
      this.showMessage = false;
      this.showError = false;
      
      // Map 'name' to 'fullName' for backend compatibility
      const registrationData = {
        ...this.itemForm.value,
        fullName: this.itemForm.value.name
      };
      delete registrationData.name; // Remove 'name' field as backend expects 'fullName'
      delete registrationData.captchaAnswer; // Remove CAPTCHA from request
      delete registrationData.accessKey; // Remove access key from request
      
      this.httpService.registerUser(registrationData).subscribe(
        data => {
          this.showMessage = true;
          this.responseMessage = `Welcome ${data.username} you are successfully registered`;
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2000);
        },
        error => {
          this.showError = true;
          this.errorMessage = error.error.message;
          this.refreshCaptcha(); // Refresh CAPTCHA on error
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  toggleAccessKeyVisibility() {
    this.showAccessKey = !this.showAccessKey;
  }

}

