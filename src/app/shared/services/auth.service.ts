import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

export interface IUser {
  email: string;
  avatarUrl?: string;
}

const defaultPath = '/';
const defaultUser = {
  email: 'sandra@example.com',
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png'
};

@Injectable()
export class AuthService {
  private _user: IUser | null = defaultUser;

  get loggedIn(): boolean {
    return !!this._user;
  }

  private _lastAuthenticatedPath: string = defaultPath;
  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  constructor(private router: Router) {}

  async logIn(email: string, password: string) {
    try {
      this._user = { ...defaultUser, email };
      this.router.navigate([this._lastAuthenticatedPath]);

      return { isOk: true, data: this._user };
    } catch {
      return { isOk: false, message: 'Authentication failed' };
    }
  }

  async logOut() {
    this._user = null;
    localStorage.removeItem('token'); // Important pour déco sécurisée
    this.router.navigate(['/login-form']);
  }

  async getUser() {
    try {
      return { isOk: true, data: this._user };
    } catch {
      return { isOk: false, data: null };
    }
  }

  async createAccount(email: string, password: string) {
    try {
      this.router.navigate(['/create-account']);
      return { isOk: true };
    } catch {
      return { isOk: false, message: 'Failed to create account' };
    }
  }

  async resetPassword(email: string) {
    try {
      return { isOk: true };
    } catch {
      return { isOk: false, message: 'Failed to reset password' };
    }
  }

  async changePassword(email: string, recoveryCode: string) {
    try {
      return { isOk: true };
    } catch {
      return { isOk: false, message: 'Failed to change password' };
    }
  }

  getUserRole(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    } catch {
      return '';
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || null;
    } catch {
      return null;
    }
  }

}
