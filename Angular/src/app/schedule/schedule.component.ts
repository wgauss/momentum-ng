import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../schedule.service';
import { ScheduleItem } from '../schedule.model';
import { HttpClientModule } from '@angular/common/http';

@Component({
	selector: 'app-schedule',
	standalone: true,
	imports: [CommonModule, FormsModule, HttpClientModule],  // Include FormsModule here
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.css']
  })

  export class ScheduleComponent implements OnInit {
  scheduleItems: ScheduleItem[] = [];
  newItem: Partial<ScheduleItem> = {};

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit(): void {
    this.loadScheduleItems();
  }

  loadScheduleItems(): void {
    this.scheduleService.getScheduleItems().subscribe(items => this.scheduleItems = items);
  }

  addItem(): void {
    if (!this.newItem.title || !this.newItem.date) return;
    this.scheduleService.addScheduleItem(this.newItem as ScheduleItem).subscribe(() => {
      this.loadScheduleItems();
      this.newItem = {};
    });
  }

  updateItem(item: ScheduleItem): void {
    this.scheduleService.updateScheduleItem(item).subscribe(() => this.loadScheduleItems());
  }

  deleteItem(id: string): void {
    this.scheduleService.deleteScheduleItem(id).subscribe(() => this.loadScheduleItems());
  }
}
