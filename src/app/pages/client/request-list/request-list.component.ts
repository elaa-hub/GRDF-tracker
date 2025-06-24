import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  demandes: any[] = [];
  emailClient: string = '';
  tasks: any[] = [];
  adresseMaison: string = '';
  taskNeeded: boolean = false;
  clientId: number = 1;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.emailClient = email;
      this.loadClientIdAndTasks(email);
    }
    this.http.get(`http://localhost:8081/api/clients/client/address?email=${email}`, { responseType: 'text' })
      .subscribe({
        next: (data) => {
          this.adresseMaison = data;
        },
        error: () => {
          alert("Erreur lors du chargement de l'adresse.");
        }
      });
  }

  loadClientIdAndTasks(email: string): void {
    this.http.get<any>(`http://localhost:8081/api/clients/client?email=${email}`).subscribe({
      next: (client) => {
        const clientId = client.clientId;
        this.loadTasksForClient(clientId);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du client :', err);
      }
    });
  }


  loadTasksForClient(clientId: number): void {
    this.http.get<any[]>(`http://localhost:8081/api/clients/${clientId}/tasks`).subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des demandes :', err);
      }
    });
  }
}
