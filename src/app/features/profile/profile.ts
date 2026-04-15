import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  loading = signal(false);
  submitting = signal(false);
  submitted = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  passwordSubmitting = signal(false);
  passwordSuccess = signal('');
  passwordError = signal('');
  passwordSubmitted = signal(false);

  userId = this.authService.currentUser()?.id;

  profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUser();
  }

  loadUser(): void {
    this.loading.set(true);

    this.userService.getById(this.userId!).subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
        });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load profile.');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    this.userService.update(this.userId!, this.profileForm.getRawValue()).subscribe({
      next: (updatedUser) => {
        this.submitting.set(false);
        this.successMessage.set('Profile updated successfully.');

        this.authService.setSession(updatedUser);
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set('Failed to update profile.');
      },
    });
  }

  passwordsMatch(): boolean {
    return this.passwordForm.value.newPassword === this.passwordForm.value.confirmPassword;
  }

  onPasswordSubmit(): void {
    this.passwordSubmitted.set(true);
    this.passwordError.set('');
    this.passwordSuccess.set('');

    if (this.passwordForm.invalid || !this.passwordsMatch()) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.passwordSubmitting.set(true);

    const payload = {
      currentPassword: this.passwordForm.value.currentPassword!,
      newPassword: this.passwordForm.value.newPassword!,
    };

    this.userService.changePassword(this.userId!, payload).subscribe({
      next: () => {
        this.passwordSubmitting.set(false);
        this.passwordSuccess.set('Password updated successfully.');
        this.passwordForm.reset();
        this.passwordSubmitted.set(false);
      },
      error: () => {
        this.passwordSubmitting.set(false);
        this.passwordError.set('Failed to update password.');
      },
    });
  }

  get f() {
    return this.profileForm.controls;
  }
}
