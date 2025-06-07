import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  averageRating = 0;

  ngOnInit(): void {
    const techId = this.authService.getUserId();
    this.http.get<any[]>(`http://localhost:8081/api/tasks/tech/${techId}/rated`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).subscribe(data => {
      this.notes = data;
      this.averageRating = data.length
        ? data.reduce((acc, curr) => acc + (curr.rating || 0), 0) / data.length
        : 0;
    });
  }

}
