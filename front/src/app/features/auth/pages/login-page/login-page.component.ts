import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    email: ['admin@neobank.local', [Validators.required, Validators.email]],
    password: ['Admin123*', [Validators.required, Validators.minLength(6)]],
  });

  isSubmitting = false;
  errorMessage = '';

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.errorMessage = '';

    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;

    this.authService
      .login({
        email: this.emailControl.value ?? '',
        password: this.passwordControl.value ?? '',
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          this.errorMessage =
            error?.error?.message || 'Unable to sign in. Please try again.';
        },
      });
  }
}
