import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JwtService } from '../../service/jwt.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-type',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-type.component.html',
  styleUrl: './add-type.component.css'

  })
  export class AddTypeComponent implements OnInit {
    typeForm: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
  
    constructor(
      private fb: FormBuilder,
      private jwtService: JwtService,
      private router: Router
    ) {
      this.typeForm = this.fb.group({
        libelle: ['', Validators.required],
      });
    }
  
    ngOnInit(): void {}
  
    // Méthode pour soumettre le formulaire et ajouter un nouveau type
    addType(): void {
      if (this.typeForm.invalid) {
        this.errorMessage = 'Veuillez remplir tous les champs correctement.';
        return;
      }
  
      const newType = this.typeForm.value;
  
      this.jwtService.addType(newType).subscribe(
        (response) => {
          this.successMessage = 'Type ajouté avec succès !';
          this.errorMessage = '';
          this.router.navigate(['/gestType']); // Redirection vers la page de gestion des types
        },
        (error) => {
          this.errorMessage = 'Erreur lors de l\'ajout du type.';
          console.error(error);
        }
      );
    }
  }
  