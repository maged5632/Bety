// src/app/user-register/user-register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.css'],
})
export class UserRegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

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

    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'من فضلك املأ كل البيانات المطلوبة.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'كلمة المرور يجب أن تكون 6 حروف على الأقل.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'تأكيد كلمة المرور غير مطابق.';
      return;
    }

    this.isSubmitting = true;

    const result = this.auth.registerUser(
      this.name.trim(),
      this.email.trim(),
      this.password
    );

    this.isSubmitting = false;

    if (!result.ok) {
      this.errorMessage = result.message;
      return;
    }

    this.successMessage = result.message;

    setTimeout(() => {
      this.router.navigateByUrl('/');
    }, 1000);
  }
}
