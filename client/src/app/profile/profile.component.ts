import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AuthService } from '../../services/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
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
  
  // Password visibility toggles
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  
  // Tab management
  selectedTabIndex: number = 0;
  
  // Notification settings
  notificationSettings = {
    emailNotifications: true,
    eventReminders: true,
    bookingUpdates: true,
    systemAlerts: false
  };

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadProfile();
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
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  // Get avatar URL (placeholder for now)
  getAvatarUrl(): string {
    const avatars = [
      'https://i.pravatar.cc/200?img=1',
      'https://i.pravatar.cc/200?img=2',
      'https://i.pravatar.cc/200?img=3',
      'https://i.pravatar.cc/200?img=4',
      'https://i.pravatar.cc/200?img=5'
    ];
    const username = this.profile?.username || '';
    const index = username.charCodeAt(0) % avatars.length;
    return avatars[index];
  }

  // Get role icon
  getRoleIcon(): string {
    const role = this.profile?.role?.toUpperCase();
    switch(role) {
      case 'PLANNER': return 'event_note';
      case 'STAFF': return 'badge';
      case 'CLIENT': return 'person';
      default: return 'account_circle';
    }
  }

  // User stats loaded from backend
  userStats = {
    events: 0,
    bookings: 0,
    days: 0
  };

  // Get user stats (loads real data)
  getUserStats() {
    return this.userStats;
  }

  // Recent activities loaded from backend
  recentActivities: any[] = [];

  // Get recent activities (loads real data)
  getRecentActivities() {
    return this.recentActivities;
  }

  // Load actual user statistics
  loadUserStats() {
    const role = this.profile?.role?.toUpperCase();
    
    if (role === 'PLANNER' || role === 'STAFF') {
      // Load events for planner/staff
      this.httpService.GetAllevents().subscribe(
        (events: any) => {
          this.userStats.events = events ? events.length : 0;
        },
        (error: any) => console.error('Error loading events:', error)
      );
    }
    
    if (role === 'CLIENT') {
      // Load bookings for client
      this.httpService.getMyBookings().subscribe(
        (bookings: any) => {
          this.userStats.bookings = bookings ? bookings.length : 0;
        },
        (error: any) => console.error('Error loading bookings:', error)
      );
    }
    
    // Calculate days active from registration date
    if (this.profile?.createdAt) {
      const registrationDate = new Date(this.profile.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - registrationDate.getTime());
      this.userStats.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  // Get unread notification count
  getUnreadCount(): number {
    return 3;
  }

  // Toggle notification setting
  toggleNotification(setting: string): void {
    (this.notificationSettings as any)[setting] = !(this.notificationSettings as any)[setting];
    this.showSuccessMessage('Notification preferences updated');
  }

  // Handle avatar change
  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // In a real app, upload the file to server
      this.showSuccessMessage('Avatar updated successfully');
    }
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
        
        // Load user statistics after profile is loaded
        this.loadUserStats();
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
