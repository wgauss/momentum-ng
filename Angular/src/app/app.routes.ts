import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component'

export const routes: Routes = [
	{ path: '', component: HomeComponent},
	{ path: 'calendar', component: CalendarComponent },
	{ path: '', redirectTo: '/', pathMatch: 'full' }, 
	{ path: '**', redirectTo: '/' },
];
