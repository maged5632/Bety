// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * AuthService
 * -----------
 * Simple in-memory authentication:
 *  - Stores a boolean "isLoggedIn"
 *  - Exposes an observable for components
 *
 * NOTE: This is NOT secure; it's only for demo.
 * In a real app you would call a backend API and store a token.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loggedIn$ = new BehaviorSubject<boolean>(false);

  /** Observable to use in components if needed. */
  isLoggedIn$: Observable<boolean> = this.loggedIn$.asObservable();

  /** Quick getter. */
  get isLoggedIn(): boolean {
    return this.loggedIn$.value;
  }

  /**
   * Fake login.
   * Returns true on success, false on failure.
   *
   * Credentials:
   *  - email: admin@bety.com
   *  - password: admin123
   */
  login(email: string, password: string): boolean {
    if (email === 'admin@bety.com' && password === 'admin123') {
      this.loggedIn$.next(true);
      return true;
    }
    return false;
  }

  /** Log out the current user. */
  logout(): void {
    this.loggedIn$.next(false);
  }
}
