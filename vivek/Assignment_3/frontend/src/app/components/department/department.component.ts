import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-6xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Department Form -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Department Form</h2>
      <form (ngSubmit)="submitForm()" class="space-y-4">
        <div>
          <label class="block font-semibold text-gray-700">Department Name:</label>
          <input type="text" [(ngModel)]="department.dept_name" name="dept_name" required
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none">
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Building:</label>
          <input type="text" [(ngModel)]="department.building" name="building"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none">
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Budget (₹/$):</label>
          <input type="number" [(ngModel)]="department.budget" name="budget" step="0.01"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none">
        </div>
        <button type="submit"
          class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
          Add Department
        </button>
      </form>
    </div>

    <!-- Department List -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Department List</h2>
      <div class="flex flex-col gap-4">
        <div *ngFor="let d of departments" class="p-4 bg-gray-50 border rounded-lg shadow">
          <div class="font-bold text-lg text-gray-900">{{ d.dept_name }}</div>
          <div class="text-gray-700">Building: {{ d.building }}</div>
          <div class="text-gray-500">Budget: ₹{{ d.budget | number:'1.2-2' }}</div>
        </div>
      </div>
    </div>

  </div>
</div>

  `,
})
export class DepartmentComponent {
  department = { dept_name: '', building: '', budget: null };
  departments: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getDepartments();
  }

  getDepartments() {
    this.http.get<any[]>('http://localhost:5000/departments')
      .subscribe(data => this.departments = data);
  }

  submitForm() {
    this.http.post('http://localhost:5000/departments', this.department)
      .subscribe(response => {
        console.log('Department added:', response);
        this.getDepartments();
        this.department = { dept_name: '', building: '', budget: null };
      });
  }
}
