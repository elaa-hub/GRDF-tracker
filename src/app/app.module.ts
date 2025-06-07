import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SideNavOuterToolbarModule, SideNavInnerToolbarModule, SingleCardModule } from './layouts';
import { FooterModule, ResetPasswordFormModule, CreateAccountFormModule, ChangePasswordFormModule, LoginFormModule } from './shared/components';
import { AuthService, ScreenService, AppInfoService } from './shared/services';
import { UnauthenticatedContentModule } from './unauthenticated-content';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { DxDataGridModule, DxLookupModule } from 'devextreme-angular';
import { DevExtremeModule } from 'devextreme-angular';
import { NestedOptionHost } from 'devextreme-angular/core';
import {HomeComponent} from './pages/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import {ClientComponent} from './pages/client/client.component';
import {ReportIssueComponent} from './pages/client/report-issue/report-issue.component';
import {RequestTechnicianComponent} from './pages/client/request-technician/request-technician.component';
import {RequestListComponent} from './pages/client/request-list/request-list.component';
import {QualifyInterventionComponent} from './pages/client/qualify-intervention/qualify-intervention.component';
import {CommonModule} from '@angular/common';
import {ClientRoutingModule} from './pages/client/client-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    SideNavOuterToolbarModule,
    SideNavInnerToolbarModule,
    SingleCardModule,
    FooterModule,
    ResetPasswordFormModule,
    CreateAccountFormModule,
    ChangePasswordFormModule,
    LoginFormModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    DxDataGridModule,
    DxLookupModule,
    FormsModule,
    DevExtremeModule,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  providers: [
    AuthService,
    ScreenService,
    AppInfoService,
    NestedOptionHost
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
