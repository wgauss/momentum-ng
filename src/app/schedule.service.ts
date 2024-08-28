/*
TODO:
	make it so that this shit is stored in the json file made,
	also made better css/positioning for when the events are actually called
	also integrate routine with recurring events
	perhaps make a component that creates events... i guess lol


*/
import { Injectable } from '@angular/core';
import { ScheduleItem } from './schedule.model';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval, isSameMonth } from 'date-fns';
import { enUS } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private scheduleItems: ScheduleItem[] = [
	{
		id: '1',
		date: new Date('2024-08-05'), // Example date
		weekday: 'Monday',
		color: "#33ccff",
		title: 'Team Meeting',
		description: 'Monthly team meeting to discuss project progress.'
	  },
	  {
		id: '2',
		date: new Date('2024-08-07'), // Example date
		weekday: 'Wednesday',
		title: 'Doctor Appointment',
		description: 'Routine check-up with Dr. Smith.'
	  },
	  {
		id: '3',
		date: new Date('2024-08-14'), // Example date
		weekday: 'Wednesday',
		title: 'Client Presentation',
		description: 'Presentation to the client regarding new product features.'
	  },
	  {
		id: '4',
		date: new Date('2024-08-23'), // Example date
		weekday: 'Friday',
		title: 'Project Deadline',
		description: 'Final deadline for the project submission.'
	  }
  ];

  constructor() { }

  addScheduleItem(item: ScheduleItem): void {
    const newItem = { ...item};
    this.scheduleItems.push(newItem);
  }

  updateScheduleItem(updatedItem: ScheduleItem): void {
    const index = this.scheduleItems.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this.scheduleItems[index] = updatedItem;
    }
  }

  getScheduleItems(): ScheduleItem[] {
    return this.scheduleItems;
  }

  getScheduleItemById(id: string): ScheduleItem | undefined {
    return this.scheduleItems.find(item => item.id === id);
  }

  deleteScheduleItem(id: string): void {
    this.scheduleItems = this.scheduleItems.filter(item => item.id !== id);
  }
}
