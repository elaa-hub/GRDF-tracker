import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import {DashboardTechComponent} from './dashboard-tech/dashboard-tech.component';
import {TasksComponent} from '../../pages/tasks/tasks.component';
import {StatistiquesComponent} from './statistiques/statistiques.component';
import {NotesComponent} from './notes/notes.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardTechComponent
  },
  {
    path: 'tasks',
    component: TasksComponent
  },
  {
    path: 'statistiques',
    component: StatistiquesComponent
  }
,
  {
    path: 'notes',
    component: NotesComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechRoutingModule { }
