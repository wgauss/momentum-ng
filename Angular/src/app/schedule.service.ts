/*
TODO:
	make it so that this shit is stored in the json file made,
	also made better css/positioning for when the events are actually called
	also integrate routine with recurring events
	perhaps make a component that creates events... i guess lol
	which above is implemented in a popup modal

*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ScheduleItem } from './schedule.model';

@Injectable({
  providedIn: 'root'
})

export class ScheduleService {
  private apiUrl = 'http://localhost:3000/api/schedule_items'; // Update this URL to point to your actual JSON file or API

  constructor(private http: HttpClient) { }

  getScheduleItems(): Observable<ScheduleItem[]> {
    return this.http.get<ScheduleItem[]>(this.apiUrl).pipe(
      catchError(this.handleError<ScheduleItem[]>('getScheduleItems', []))
    );
  }

  getScheduleItemById(id: string): Observable<ScheduleItem | undefined> {
    return this.getScheduleItems().pipe(
      map(items => items.find(item => item.id === id)),
      catchError(this.handleError<ScheduleItem | undefined>('getScheduleItemById'))
    );
  }

  addScheduleItem(newItem: ScheduleItem): Observable<ScheduleItem> {
	return this.http.post<ScheduleItem>(this.apiUrl, newItem).pipe(
	  catchError(this.handleError<ScheduleItem>('addScheduleItem'))
	);
  }
  
  updateScheduleItem(updatedItem: ScheduleItem): Observable<ScheduleItem> {
	const url = `${this.apiUrl}/${updatedItem.id}`;
	return this.http.put<ScheduleItem>(url, updatedItem).pipe(
	  catchError(this.handleError<ScheduleItem>('updateScheduleItem'))
	);
  }
  
  deleteScheduleItem(id: string): Observable<ScheduleItem[]> {
	const url = `${this.apiUrl}/${id}`;
	return this.http.delete<ScheduleItem[]>(url).pipe(
	  catchError(this.handleError<ScheduleItem[]>('deleteScheduleItem', []))
	);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
