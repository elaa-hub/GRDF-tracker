  import { Component } from '@angular/core';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: [ './profile.component.scss' ]
})

export class ProfileComponent {
  employee: any;
  colCountByScreen: object;

  constructor() {
    this.employee = {
      TechnicianID: 12345,
      FirstName: 'Sandra',
      LastName: 'Johnson',
      Picture: 'images/employees/06.png',
      Notes: 'Technician Sandra is available for repairs.',
      Address: '4600 N Virginia Rd.',
      Description: '',
      RepairDate: new Date()
    };
    this.colCountByScreen = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4
    };
  }
}
