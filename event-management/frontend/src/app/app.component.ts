import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  events: any[] = [];
  formData = new FormData();
  event = { title: '', description: '', date: '', location: '' };
  editingId: number | null = null;

  constructor(private http: HttpClient) {
    this.fetchEvents();
  }

  onFileChange(e: any) {
    if (e.target.files.length > 0) {
      this.formData.set('image', e.target.files[0]);
    }
  }

  addEvent() {
    for (let key in this.event) {
      this.formData.set(key, (this.event as any)[key]);
    }

    if (this.editingId) {
      // UPDATE
      this.http.put(`http://localhost:3000/events/${this.editingId}`, this.formData)
        .subscribe(() => {
          this.resetForm();
          this.fetchEvents();
        });
    } else {
      // ADD
      this.http.post('http://localhost:3000/events', this.formData)
        .subscribe(() => {
          this.resetForm();
          this.fetchEvents();
        });
    }
  }

  deleteEvent(id: number) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.http.delete(`http://localhost:3000/events/${id}`).subscribe(() => this.fetchEvents());
    }
  }

  editEvent(ev: any) {
    this.event = { ...ev }; // Copy existing data into form
    this.editingId = ev.id;
    this.formData = new FormData(); // Clear file so new image is optional
  }

  fetchEvents() {
    this.http.get<any[]>('http://localhost:3000/events').subscribe(data => this.events = data);
  }

  resetForm() {
    this.event = { title: '', description: '', date: '', location: '' };
    this.editingId = null;
    this.formData = new FormData();
  }
}

