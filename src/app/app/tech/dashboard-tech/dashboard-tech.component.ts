import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard-tech',
  templateUrl: './dashboard-tech.component.html',
  styleUrls: ['./dashboard-tech.component.scss']
})
export class DashboardTechComponent {

  constructor(private router: Router) {}


  goToTasks(): void {
    this.router.navigate(['/tech/tasks']);
  }

  goToStats(): void {
    this.router.navigate(['/tech/statistiques']);
  }
  goToNotes() {
    this.router.navigate(['/tech/notes']);
  }
}
