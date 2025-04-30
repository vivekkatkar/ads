import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

 
  citationForm = this.fb.group({
    fromPaperId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    toPaperId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
  });

  classificationForm = this.fb.group({
    paperId: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
  });

  cypherForm = this.fb.group({
    cypherQuery: ['', [Validators.required]],
  });

  citationResult = '';
  classificationPath: string[] = [];
  customResult: any;
  loading = false;
  errorMessage: string = '';


  onCheckCitation(): void {
    if (this.citationForm.invalid) {
      alert('Please provide valid Paper IDs!');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.http
      .post<{ pathExists: boolean; pathLength: number }>('/api/citation-path', this.citationForm.value)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.citationResult = res.pathExists
            ? `Yes, via ${res.pathLength} step`
            : 'No path found';
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Error checking citation path!';
        },
      });
  }

  onGetClassification(): void {
    const paperId = this.classificationForm.value.paperId;
  
    if (!paperId) {
      alert('Please enter a valid Paper ID!');
      return;
    }
  
    this.loading = true;
    this.errorMessage = '';
  
    this.http
      .get<{ classification: string }>(`/api/classification/${paperId}`)
      .subscribe({
        next: (res) => {
          this.loading = false;
          console.log('Received classification:', res);
          this.classificationPath = [res.classification]; 
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Error fetching classification!';
        },
      });
  }
  
  
  onRunQuery(): void {
    if (this.cypherForm.invalid) {
      alert('Please enter a Cypher query!');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.http
      .post<any>('/api/custom-query', this.cypherForm.value)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.customResult = res;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = `Error: ${err.message}`;
        },
      });
  }
}
