import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import {ReportIssueComponent} from './report-issue/report-issue.component';
import {RequestListComponent} from './request-list/request-list.component';
import {RequestTechnicianComponent} from './request-technician/request-technician.component';
import {QualifyInterventionComponent} from './qualify-intervention/qualify-intervention.component';
import {DashboardComponent} from './dashboard/dashboard.component';
const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'report-issue', component: ReportIssueComponent },
      { path: 'demander-technicien', component: RequestTechnicianComponent },
      { path: 'liste-demandes', component: RequestListComponent },
      { path: 'qualifier-intervention', component: QualifyInterventionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {}
