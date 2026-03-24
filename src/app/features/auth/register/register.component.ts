import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService, RegisterPayload } from '../../../core/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  registerForm = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    role: ['user'],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  async onSubmit() {
    if (this.registerForm.invalid || this.isSubmitting) {
      return;
    }

    const data = this.registerForm.value;

    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.isSubmitting = true;

    try {
      await this.authService.register(data as RegisterPayload);
      await this.authService.logout();
      alert('Registration successful. Please log in.');
      this.registerForm.reset();
      await this.router.navigate(['/login']);
    } catch (error: any) {
      alert(error?.message || 'Registration failed. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
