import { Component } from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { GoalsComponent } from '../goals/goals.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, CalendarComponent, GoalsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
	
}
