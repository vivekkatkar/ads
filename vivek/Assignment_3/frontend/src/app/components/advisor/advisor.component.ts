import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-6xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Advisor Form -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Advisor Form</h2>
      <form (ngSubmit)="submitForm()" class="space-y-4">
        <div>
          <label class="block font-semibold text-gray-700">Student:</label>
          <select [(ngModel)]="advisor.s_ID" name="s_ID" required
            class="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 outline-none">
            <option *ngFor="let s of students" [value]="s.ID">{{ s.name }} (ID: {{ s.ID }})</option>
          </select>
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Instructor:</label>
          <select [(ngModel)]="advisor.i_ID" name="i_ID" required
            class="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-400 outline-none">
            <option *ngFor="let i of instructors" [value]="i.ID">{{ i.name }} (ID: {{ i.ID }})</option>
          </select>
        </div>
        <button type="submit"
          class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
          Add Advisor
        </button>
      </form>
    </div>

    <!-- Advisor List -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Advisor List</h2>
      <div class="flex flex-col gap-4">
        <div *ngFor="let a of advisors" class="p-4 bg-gray-50 border rounded-lg shadow">
          <div class="font-semibold text-gray-900">Student ID: {{ a.s_ID }}</div>
          <div class="text-gray-700">Instructor ID: {{ a.i_ID }}</div>
        </div>
      </div>
    </div>

  </div>
</div>

  `,
})
export class AdvisorComponent {
  advisor = { s_ID: null, i_ID: null };
  advisors: any[] = [];
  students: any[] = [];
  instructors: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAdvisors();
    this.getStudents();
    this.getInstructors();
  }

  getAdvisors() {
    this.http.get<any[]>('http://localhost:5000/advisors')
      .subscribe(data => this.advisors = data);
  }

  getStudents() {
    this.http.get<any[]>('http://localhost:5000/students')
      .subscribe(data => this.students = data);
  }

  getInstructors() {
    this.http.get<any[]>('http://localhost:5000/instructors')
      .subscribe(data => this.instructors = data);
  }

  submitForm() {
    this.http.post('http://localhost:5000/advisors', this.advisor)
      .subscribe(response => {
        console.log('Advisor added:', response);
        this.getAdvisors();
        this.advisor = { s_ID: null, i_ID: null };
      });
  }
}
