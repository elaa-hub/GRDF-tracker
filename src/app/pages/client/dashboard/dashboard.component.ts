import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  client: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.client = this.authService.getUserInfo();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
