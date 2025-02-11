import { commonState } from './../../../../node_modules/piscina/src/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-add-struct',
  templateUrl: './add-struct.component.html',
  styleUrls: ['./add-struct.component.css'],
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule]
})
export class AddStructComponent implements OnInit {
  structForm!: FormGroup;  // Déclarer sans initialisation dans la déclaration
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private fb: FormBuilder
  ) {}


  structures: any[] = []; // Liste des structures disponibles

  ngOnInit(): void {
    this.jwtService.getAllStructures().subscribe({
      next: (data) => { this.structures = data; },
      error: (err) => { console.error("❌ Erreur structures :", err); }
    });
    this.initializeForm();    
  }
  
 
  

  // Initialiser le formulaire pour l'ajout d'une structure
  initializeForm(): void {
    this.structForm = this.fb.group({
      libelleAr: ['', Validators.required],
      libelleFr: ['', Validators.required],
      adresse: ['', Validators.required],
      parentStructureId: [null]
    });
  }

  // Soumettre le formulaire pour ajouter la structure
  onSubmit(): void {
    if (this.structForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    const structureData = this.structForm.value;
    this.addStructure(structureData);
  }

  // Ajouter la structure via le service
  addStructure(structureData: any): void {
    this.jwtService.addStructure(structureData).subscribe(
      () => {
        this.successMessage = 'Structure ajoutée avec succès !';
        this.router.navigate(['/gestStruct']); // Redirige vers la page de gestion des structures
      },
      (error) => {
        this.errorMessage = 'Erreur lors de l\'ajout de la structure';
        console.error(error);
      }
    );
  }

  // Annuler et revenir à la page de gestion des structures
  cancel(): void {
    this.router.navigate(['/gestStruct']);
  }
}