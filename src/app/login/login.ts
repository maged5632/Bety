// src/app/login/login.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * LoginComponent
 * --------------
 * Simple login form for the admin area.
 * Uses AuthService with hard-coded credentials.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    const ok = this.auth.login(this.email.trim(), this.password);
    if (ok) {
      this.errorMessage = '';
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Invalid credentials. Try admin@bety.com / admin123';
    }
  }
}
