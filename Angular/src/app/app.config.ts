import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ScheduleService } from './schedule.service';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
  providers: [
	provideRouter(routes),
	FormsModule,
	NgbModule,
	HttpClientModule,
	BrowserModule,
	ScheduleService,
  ],
};
