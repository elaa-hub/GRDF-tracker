import {Component, OnInit} from '@angular/core';
import 'devextreme/data/odata/store';
import { DxDataGridModule, DxLookupModule } from 'devextreme-angular';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../shared/services';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'] })

export class TasksComponent implements OnInit {
  dataSource: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    const techId = this.authService.getUserId();
    const role = this.authService.getUserRole();

    console.log('🔍 TECH ID:', techId);
    console.log('🔍 ROLE:', role);

    if (techId && role === 'TECH') {
      this.getTasksByTechId(techId);
    } else {
      console.warn('⚠️ Pas de TECH ID ou rôle incorrect.');
    }
  }


  getTasksByTechId(techID: number): void {
    const token = localStorage.getItem('token');
    this.http.get<any[]>(`http://localhost:8081/api/tasks/tech/${techID}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .subscribe(
      (tasks) => {
        console.log('📦 Données reçues :', tasks); // <= ajoute ceci
        this.dataSource = tasks.map(task => ({
          taskId: task.taskId,
          description: task.description,
          taskDate: task.taskDate?.split('T')[0],
          rating: task.rating,
          status: task.status
        }));
      },
      (error) => {
        console.error('Erreur récupération tâches :', error);
      }
    );
  }

}

