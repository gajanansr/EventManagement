import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  profile: any = null;
  showSuccess: boolean = false;
  showError: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  isEditMode: boolean = false;
  isChangingPassword: boolean = false;
  passwordPattern = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,27}$';

  passwordRules = [
    { key: "required", label: "Password required", satisfied: false },
    { key: "capital", label: "Password should have a capital letter", satisfied: false },
    { key: "special", label: "Password should have a special character", satisfied: false },
    { key: "number", label: "Password should have a number", satisfied: false },
    { key: "minLength", label: "Password should be of 8 characters at least", satisfied: false }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadProfile();
    this.passwordForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordRules(value || '')
    })
  }

  initForms() {
    this.profileForm = this.formBuilder.group({
      fullName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: ['']
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  checkPasswordRules(password: string){
    this.passwordRules[0].satisfied = password.length > 0
    this.passwordRules[1].satisfied = /[A-Z]/.test(password)
    this.passwordRules[2].satisfied = /[@#$%^&+=]/.test(password)
    this.passwordRules[3].satisfied = /[0-9]/.test(password)
    this.passwordRules[4].satisfied = password.length >= 8
  }

  get showPasswordRequirements(): boolean {
    return this.passwordRules?.some(rule => !rule.satisfied)
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  loadProfile() {
    this.httpService.getUserProfile().subscribe(
      (data: any) => {
        this.profile = data;
        this.profileForm.patchValue({
          fullName: data.fullName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          address: data.address || ''
        });
      },
      (error: any) => {
        this.showErrorMessage('Failed to load profile: ' + error.message);
      }
    );
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.loadProfile(); // Reset form if cancelled
    }
  }

  togglePasswordChange() {
    this.isChangingPassword = !this.isChangingPassword;
    if (!this.isChangingPassword) {
      this.passwordForm.reset();
    }
  }

  onSubmitProfile() {
    if (this.profileForm.valid) {
      this.httpService.updateUserProfile(this.profileForm.value).subscribe(
        (data: any) => {
          this.profile = data;
          this.isEditMode = false;
          this.showSuccessMessage('Profile updated successfully');
        },
        (error: any) => {
          this.showErrorMessage('Failed to update profile: ' + error.message);
        }
      );
    }
  }

  onSubmitPassword() {
    if (this.passwordForm.valid) {
      const passwordData = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword
      };
      
      this.httpService.updateUserProfile(passwordData).subscribe(
        () => {
          this.isChangingPassword = false;
          this.passwordForm.reset();
          this.showSuccessMessage('Password changed successfully');
        },
        (error: any) => {
          this.showErrorMessage('Failed to change password: ' + (error.error?.message || error.message));
        }
      );
    }
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 3000);
  }
}
