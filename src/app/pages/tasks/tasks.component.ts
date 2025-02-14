import {Component, OnInit} from '@angular/core';
import 'devextreme/data/odata/store';
import { DxDataGridModule, DxLookupModule } from 'devextreme-angular';
import {HttpClient} from '@angular/common/http';

@Component({
  templateUrl: 'tasks.component.html'
})

export class TasksComponent implements OnInit {
  dataSource: any[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    const techID = 104;
    this.getTasksByTechId(techID);
  }

  getTasksByTechId(techID: number): void {
    this.http.get<any[]>(`http://localhost:8080/api/tasks/tech/${techID}`).subscribe(
      (tasks) => {
        this.dataSource = tasks.map(task => ({
          taskId: task.taskId,
          description: task.description,
          taskDate: task.taskDate ? task.taskDate.split('T')[0] : null, // ✅ Extract "yyyy-MM-dd"
          rating: task.rating,
          tech: task.tech // Assuming task.tech contains 'firstName'
        }));
      },
      (error) => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

}

