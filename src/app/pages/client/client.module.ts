import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportIssueComponent } from './report-issue/report-issue.component';
import { RequestTechnicianComponent } from './request-technician/request-technician.component';
import { RequestListComponent } from './request-list/request-list.component';
import { QualifyInterventionComponent } from './qualify-intervention/qualify-intervention.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    ClientComponent,
    DashboardComponent,
    ReportIssueComponent,
    RequestTechnicianComponent,
    RequestListComponent,
    QualifyInterventionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ClientRoutingModule
  ]
})
export class ClientModule { }
