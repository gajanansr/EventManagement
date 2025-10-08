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
  namePattern = '^[a-zA-Z]+$';
  usernamePattern = '^[a-z]{3,}$';
  passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,27}$';

  usernameRules = [
    { key: "required", label: "Username required", satisfied: false },
    { key: "minLength", label: "Username should be at least 3 characters", satisfied: false},
    { key: "lowerCase", label: "Username can only lowercase characters"}
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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpService: HttpService
  ) {
    this.itemForm = this.formBuilder.group({
      name:['',[Validators.required,Validators.pattern(this.namePattern)]],
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

    this.itemForm.get('username')?.valueChanges.subscribe(value => {
      this.checkUsernameRules(value || '')
    })

    this.itemForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordRules(value || '')
    })
  }

  checkUsernameRules(username: string){
    this.usernameRules[0].satisfied = username.length > 0
    this.usernameRules[1].satisfied = username.length >= 3
    this.usernameRules[2].satisfied = /[a-z]/.test(username)
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
      this.showMessage = false;
      this.showError = false;
      this.httpService.registerUser(this.itemForm.value).subscribe(
        data => {
          this.showMessage = true;
          this.responseMessage = `Welcome ${data.username} you are successfully registered`;
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 2000);
        },
        error => {
          this.showError = true;
          this.errorMessage = error.error;
        }
      );
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

}
