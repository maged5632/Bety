import { Injectable } from '@angular/core';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string; // مؤقتًا لحد ما نعمل Backend حقيقي
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 // ---------- Admin login ----------
private adminEmail = 'admin@bety.test';
private adminPassword = 'admin123';

isLoggedIn = false;

login(email: string, password: string): { ok: boolean; message: string } {
  if (email === this.adminEmail && password === this.adminPassword) {
    this.isLoggedIn = true;
    return { ok: true, message: 'تم تسجيل دخول الأدمن بنجاح.' };
  }

  this.isLoggedIn = false;
  return { ok: false, message: 'بيانات الأدمن غير صحيحة.' };
}

logoutAdmin(): void {
  this.isLoggedIn = false;
}

// الدالة اللي admin.ts بيستخدمها
logout(): void {
  this.isLoggedIn = false;
}


  // ---------- User (مستخدم عادي) ----------

  private userStorageKey = 'bety-users';
  private currentUserKey = 'bety-current-user';

  private readUsers(): AppUser[] {
    try {
      const raw = localStorage.getItem(this.userStorageKey);
      return raw ? (JSON.parse(raw) as AppUser[]) : [];
    } catch {
      return [];
    }
  }

  private writeUsers(users: AppUser[]): void {
    localStorage.setItem(this.userStorageKey, JSON.stringify(users));
  }

  registerUser(name: string, email: string, password: string): { ok: boolean; message: string } {
    const users = this.readUsers();

    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'البريد الإلكتروني مسجّل من قبل.' };
    }

    const newUser: AppUser = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      name,
      email,
      password,
    };

    users.push(newUser);
    this.writeUsers(users);
    localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));

    return { ok: true, message: 'تم إنشاء الحساب وتسجيل الدخول بنجاح.' };
  }

  loginUser(email: string, password: string): { ok: boolean; message: string } {
    const users = this.readUsers();

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { ok: false, message: 'بيانات الدخول غير صحيحة.' };
    }

    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    return { ok: true, message: 'تم تسجيل دخول المستخدم بنجاح.' };
  }

  getCurrentUser(): AppUser | null {
    try {
      const raw = localStorage.getItem(this.currentUserKey);
      return raw ? (JSON.parse(raw) as AppUser) : null;
    } catch {
      return null;
    }
  }

  logoutUser(): void {
    localStorage.removeItem(this.currentUserKey);
  }

}
