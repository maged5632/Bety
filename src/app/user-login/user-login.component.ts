// src/app/user-login/user-login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent {
  email = '';
  password = '';

  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'من فضلك أدخل البريد الإلكتروني وكلمة المرور.';
      return;
    }

    this.isSubmitting = true;

    const result = this.auth.loginUser(this.email.trim(), this.password);

    this.isSubmitting = false;

    if (!result.ok) {
      this.errorMessage = result.message;
      return;
    }

    this.successMessage = result.message;

    setTimeout(() => {
      this.router.navigateByUrl('/');
    }, 800);
  }
}
