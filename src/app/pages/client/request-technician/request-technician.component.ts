import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-request-technician',
  templateUrl: './request-technician.component.html',
  styleUrls: ['./request-technician.component.scss']
})
export class RequestTechnicianComponent  {
  constructor(private router: Router) {}

  retourAccueil() {
    this.router.navigate(['/client']);
  }
}
