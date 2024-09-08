import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component'
import { GoalsComponent } from './goals/goals.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent},
	{ path: 'calendar', component: CalendarComponent },
	{ path: 'goals', component: GoalsComponent },
	{ path: '', redirectTo: '/', pathMatch: 'full' }, 
	{ path: '**', redirectTo: '/' },
];
