import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JwtService } from './../../service/jwt.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  imports:[ReactiveFormsModule,CommonModule,TranslateModule],
  standalone: true,

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
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]], // Le nom doit être composé uniquement de lettres
      email: ['', [Validators.required, Validators.email]], // L'email doit être valide
      password: ['', [
        Validators.required,
        Validators.minLength(6), // Longueur minimale de 6 caractères
        this.uppercaseValidator, // Validation de la majuscule
        this.digitValidator, // Validation du chiffre
        this.specialCharValidator // Validation du caractère spécial
      ]],
      confirmPassword: ['', [Validators.required]], // La confirmation du mot de passe est requise
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

  // Validation de la majuscule
  uppercaseValidator(control: any) {
    const hasUpperCase = /[A-Z]/.test(control.value);
    return hasUpperCase ? null : { uppercase: true };
  }

  // Validation du chiffre
  digitValidator(control: any) {
    const hasDigit = /\d/.test(control.value);
    return hasDigit ? null : { digit: true };
  }

  // Validation du caractère spécial
  specialCharValidator(control: any) {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    return hasSpecialChar ? null : { specialChar: true };
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