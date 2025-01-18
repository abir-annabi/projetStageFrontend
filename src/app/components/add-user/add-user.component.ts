import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JwtService } from './../../service/jwt.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private jwtService: JwtService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]], // Le rôle par défaut est "user"
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.jwtService.register(this.registerForm.value).subscribe(
        (response) => {
          alert('Utilisateur ajouté avec succès.');
          this.router.navigate(['/gestUsers']); // Redirigez vers la page de gestion des utilisateurs
        },
        (error) => {
          console.error('Erreur lors de l’ajout de l’utilisateur', error);
          alert('Une erreur s’est produite lors de l’ajout de l’utilisateur.');
        }
      );
    }
  }
}
