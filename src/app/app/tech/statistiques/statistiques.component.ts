import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../../shared/services';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.scss']
})
export class StatistiquesComponent implements OnInit {
  taskCount: number = 0;
  techId: number = 0;
  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const id = this.authService.getUserId();
    if (id !== null) {
      this.techId = id;
      this.loadStats();
    }
  }

  loadStats(): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<number>(`http://localhost:8081/api/tasks/tech/${this.techId}/count`, { headers })
      .subscribe(
        count => this.taskCount = count,
        error => console.error('Erreur lors du chargement des stats :', error)
      );
  }
}
