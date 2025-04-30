import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-time-slot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <div class="flex gap-6">
        <!-- Time Slot Form -->
        <div class="w-1/2">
          <h2 class="text-2xl font-bold mb-4">Time Slot Form</h2>
          <form (ngSubmit)="submitForm()">
            <div class="mb-4">
              <label class="block font-semibold">Time Slot ID:</label>
              <input type="text" [(ngModel)]="timeSlot.time_slot_id" name="time_slot_id" required class="w-full p-2 border rounded">
            </div>
            <div class="mb-4">
              <label class="block font-semibold">Day:</label>
              <select [(ngModel)]="timeSlot.day" name="day" required class="w-full p-2 border rounded">
                <option value="" disabled selected>Select a day</option>
                <option *ngFor="let d of days" [value]="d">{{ d }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block font-semibold">Start Time:</label>
              <input type="time" [(ngModel)]="timeSlot.start_time" name="start_time" required class="w-full p-2 border rounded">
            </div>
            <div class="mb-4">
              <label class="block font-semibold">End Time:</label>
              <input type="time" [(ngModel)]="timeSlot.end_time" name="end_time" required class="w-full p-2 border rounded">
            </div>
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Add Time Slot</button>
          </form>
        </div>

        <!-- Time Slot List -->
        <div class="w-1/2">
          <h2 class="text-2xl font-bold mb-4">Time Slot List</h2>
          <div class="border rounded p-4 bg-gray-50 max-h-[300px] overflow-y-auto">
            <ul>
              <li *ngFor="let t of timeSlots" class="border-b p-2 flex justify-between">
                <span>{{ t.time_slot_id }} - {{ t.day }} - {{ t.start_time }} - {{ t.end_time }}</span>
                <button (click)="deleteTimeSlot(t.time_slot_id)" class="text-red-500">✖</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TimeSlotComponent {
  timeSlot = { time_slot_id: '', day: '', start_time: '', end_time: '' };
  timeSlots: any[] = [];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTimeSlots();
  }

  getTimeSlots() {
    this.http.get<any[]>('http://localhost:5000/time-slots').subscribe({
      next: (data) => (this.timeSlots = data),
      error: (err) => console.error('Error fetching time slots:', err),
    });
  }

  submitForm() {
    this.http.post('http://localhost:5000/time-slots', this.timeSlot).subscribe({
      next: (response) => {
        console.log('Time Slot added:', response);
        this.getTimeSlots();
        this.resetForm();
      },
      error: (err) => console.error('Error adding time slot:', err),
    });
  }

  deleteTimeSlot(id: string) {
    this.http.delete(`http://localhost:5000/time-slots/${id}`).subscribe({
      next: () => {
        this.getTimeSlots();
      },
      error: (err) => console.error('Error deleting time slot:', err),
    });
  }

  resetForm() {
    this.timeSlot = { time_slot_id: '', day: '', start_time: '', end_time: '' };
  }
}
