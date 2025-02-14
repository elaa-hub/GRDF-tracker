import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://localhost:8080/api/techs';
  constructor(private http: HttpClient) {}

  addTask(techId: number, clientId: number, task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${techId}/tasks/${clientId}`, task);
  }
}
