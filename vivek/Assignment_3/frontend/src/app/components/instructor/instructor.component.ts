import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Department {
  dept_name: string;
  building?: string;
  budget?: number;
}

@Component({
  selector: 'app-instructor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-6xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Instructor Form -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Instructor Form</h2>
      <form (ngSubmit)="submitForm()" class="space-y-4">
        <div>
          <label class="block font-semibold text-gray-700">Instructor ID:</label>
          <input type="number" [(ngModel)]="instructor.ID" name="ID" required
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none">
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Name:</label>
          <input type="text" [(ngModel)]="instructor.name" name="name" required
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none">
        </div>
        <!-- Select for Department -->
        <div>
          <label class="block font-semibold text-gray-700">Department:</label>
          <select [(ngModel)]="instructor.dept_name" name="dept_name" required
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none">
            <option *ngFor="let dept of departments" [value]="dept.dept_name">
              {{ dept.dept_name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Salary (₹/$):</label>
          <input type="number" [(ngModel)]="instructor.salary" name="salary" step="0.01"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none">
        </div>
        <button type="submit"
          class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
          Add Instructor
        </button>
      </form>
    </div>

    <!-- Instructor List -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Instructor List</h2>
      <div class="flex flex-col gap-4">
        <div *ngFor="let i of instructors" class="p-4 bg-gray-50 border rounded-lg shadow hover:bg-gray-100">
          <div class="font-bold text-lg text-gray-900">{{ i.name }} (ID: {{ i.ID }})</div>
          <div class="text-gray-700">Department: {{ i.dept_name }}</div>
          <div class="text-gray-500">Salary: ₹{{ i.salary | number:'1.2-2' }}</div>
        </div>
      </div>
    </div>

  </div>
</div>

  `,
})
export class InstructorComponent {
  instructor = { ID: null, name: '', dept_name: '', salary: null };
  instructors: any[] = [];
  departments: Department[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getInstructors();
    this.getDepartments();
  }

  getInstructors() {
    this.http.get<any[]>('http://localhost:5000/instructors')
      .subscribe(data => this.instructors = data);
  }

  getDepartments() {
    this.http.get<Department[]>('http://localhost:5000/departments')
      .subscribe(data => this.departments = data);
  }

  submitForm() {
    this.http.post('http://localhost:5000/instructors', this.instructor)
      .subscribe(response => {
        console.log('Instructor added:', response);
        this.getInstructors();
        this.instructor = { ID: null, name: '', dept_name: '', salary: null };
      });
  }
}
