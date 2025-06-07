import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechRoutingModule } from './tech-routing.module';
import { DashboardTechComponent } from './dashboard-tech/dashboard-tech.component';
import { SidebarTechComponent } from './sidebar-tech/sidebar-tech.component';
import {TasksComponent} from '../../pages/tasks/tasks.component';
import {RouterModule} from '@angular/router';
import { DxDataGridModule, DxFormModule } from 'devextreme-angular';
import { StatistiquesComponent } from './statistiques/statistiques.component';
import { NotesComponent } from './notes/notes.component';
const routes = [
  {
    path: '',
    component: DashboardTechComponent,
    children: [
      {
        path: 'tasks',
        component: TasksComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    TechRoutingModule,
    DxDataGridModule,
    DxFormModule
  ],
  declarations: [
    DashboardTechComponent,
    SidebarTechComponent,
    TasksComponent,
    StatistiquesComponent,
    NotesComponent
  ]
})
export class TechModule { }
