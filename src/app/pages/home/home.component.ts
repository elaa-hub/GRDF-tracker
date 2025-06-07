import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('email', this.email);

        if (res.role === 'CLIENT') {
          this.router.navigate(['/client']);
        } else if (res.role === 'TECH') {
          this.router.navigate(['/tech']);
        } else {
          this.router.navigate(['/not-authorized']);
        }
      },
      error: (err) => {
        this.error = 'Identifiants invalides. Veuillez réessayer.';
        console.error(err);
      }
    });
  }
}
