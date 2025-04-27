  import { Component } from '@angular/core';

@Component({
  templateUrl: 'profile.component.html',
  styleUrls: [ './profile.component.scss' ]
})

export class ProfileComponent {
  employee: any;
  colCountByScreen: object;
  popupVisible: boolean = false;

  taskStats = [
    { day: 'Lundi', tasks: 5 },
    { day: 'Mardi', tasks: 7 },
    { day: 'Mercredi', tasks: 6 },
    { day: 'Jeudi', tasks: 8 },
    { day: 'Vendredi', tasks: 10 },
    { day: 'Samedi', tasks: 4 }
  ];

  constructor() {
    this.employee = {
      TechnicianID: 12345,
      FirstName: 'Sandra',
      LastName: 'Johnson',
      Picture: 'images/employees/06.png',
      Notes: 'Technician Sandra est disponible pour réparations.',
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

  showTechnicianDetails() {
    this.popupVisible = true;
  }
}
