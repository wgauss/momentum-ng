import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ScheduleComponent } from './schedule/schedule.component';

export const routes: Routes = [
	{ path: 'calendar', component: CalendarComponent },
  { path: '', redirectTo: '/calendar', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/calendar' },
  {path: 'schedule', component: ScheduleComponent }
];
