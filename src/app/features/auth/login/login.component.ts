import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  async onLogin() {
    if (this.loginForm.invalid || this.isSubmitting) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.isSubmitting = true;

    try {
      await this.authService.login(email!, password!);

      const uid = this.authService.getCurrentUser()?.uid;
      if (!uid) {
        await this.router.navigate(['/login']);
        return;
      }

      const userData = await this.authService.getCurrentUserData(uid);

      if (userData?.role === 'admin') {
        await this.router.navigate(['/dashboard']);
      } else {
        await this.router.navigate(['/vehicles']);
      }
    } catch (error: any) {
      alert(error?.message || 'Login failed. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
