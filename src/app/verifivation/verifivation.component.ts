import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification',
  templateUrl: './verifivation.component.html',
  styleUrls: ['./verifivation.component.scss'],
  standalone: true,
  imports:[ReactiveFormsModule,CommonModule]

})
export class VerificationComponent implements OnInit {
  verificationForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.verificationForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
  }

  submitCode() {
    const email = localStorage.getItem('email'); // Email stocké après le login
    if (email) {
      this.http.post('/api/auth/verify', { email, code: this.verificationForm.value.code }).subscribe(
        () => {
          alert('Vérification réussie.');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.errorMessage = 'Code incorrect. Veuillez réessayer.';
        }
      );
    }
  }
}
