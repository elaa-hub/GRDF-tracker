import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.scss']
})
export class ReportIssueComponent implements OnInit {

  adresseMaison: string = '';
  taskNeeded: boolean = false;
  description: string = '';
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email'); // assure-toi que tu l'as stocké à la connexion
    if (email) {
      this.http.get(`http://localhost:8081/api/clients/client/address?email=${email}`, { responseType: 'text' })
        .subscribe({
          next: (data: any) => this.adresseMaison = data,
          error: err => console.error('Erreur lors de la récupération de l’adresse :', err)
        });
    }
  }
  ngOnDestroy(): void {
    document.body.classList.remove('no-sidebar');
  }
  submitDefaillance() {
    const clientId = 1;

    const body = {
      clientId: clientId,
      taskNeeded: true,
      description: this.description
    };

    this.http.post("http://localhost:8081/api/notifications/create-with-task", body, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.router.navigate(['/client/demander-technicien'], {
            state: { message: '✅ Défaillance signalée avec succès !' }
          });
        },
        error: (err) => {
          console.error("Erreur:", err);
          alert("Erreur lors du signalement ❌");
        }
      });

  }



}
