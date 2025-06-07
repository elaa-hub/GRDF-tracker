import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  client: any;
  hideLayout = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.client = this.authService.getUserInfo(); // À adapter selon ton service
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
