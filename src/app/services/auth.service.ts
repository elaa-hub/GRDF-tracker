import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  constructor(private http: HttpClient) { }
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  }
  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id ?? null;
    } catch (e) {
      console.error('Erreur de décodage JWT', e);
      return null;
    }
    }
    getUserInfo() {
      // Exemple : récupère les infos du client depuis le localStorage ou un state
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
  logout() {
    // Exemple : supprime le token et redirige
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }


}
