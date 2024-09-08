import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from "./calendar/calendar.component";
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CalendarComponent, HomeComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
	constructor(private router: Router) { }

	title = 'momentum-ng';
	goHomeET(){
		this.router.navigate(['/']);
	}
	gotToCalendar(){
		this.router.navigate(['/calendar']);
	}
}
