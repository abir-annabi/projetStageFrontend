import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-edit-struct',
    templateUrl: './edit-struct.component.html',
    styleUrls: ['./edit-struct.component.css'],
    imports: [ReactiveFormsModule, CommonModule,TranslateModule]
})
export class EditStructComponent implements OnInit {
  structForm!: FormGroup;  // Déclaration du formulaire
  structureId!: number;  // Identifiant de la structure
  errorMessage: string = '';
  successMessage: string = '';
  types: any[] = []; // Liste des types disponibles

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  structures: any[] = []; // Liste des structures disponibles

  ngOnInit(): void {
    this.jwtService.getAllStructures().subscribe({
      next: (data) => { this.structures = data; },
      error: (err) => { console.error("❌ Erreur structures :", err); }
    });
    this.jwtService.getTypes().subscribe({
      next: (data) => { this.types = data; },
      error: (err) => { console.error("❌ Erreur types :", err); }
    });
    this.structureId = +this.route.snapshot.paramMap.get('id')!;  // Récupérer l'ID de la structure depuis l'URL
    this.initializeForm();
    this.loadStructure();
  }

  // Initialiser le formulaire avec des valeurs par défaut (vides)
  initializeForm(): void {
    this.structForm = this.fb.group({
      code: ['', Validators.required],
      libelleAr: ['', Validators.required],
      libelleFr: ['', Validators.required],
      adresse: ['', Validators.required],
      parentStructure: [null],
      type: [null, Validators.required] 
    });
  }

  // Charger les données de la structure à partir du backend
  loadStructure(): void {
    this.jwtService.getStructureById(this.structureId).subscribe(
      (data) => {
        // Pré-charger les données dans le formulaire
        this.structForm.patchValue(data);
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement de la structure';
        console.error(error);
      }
    );
  }

  // Soumettre le formulaire pour modifier la structure
  onSubmit(): void {
    if (this.structForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    const structureData = this.structForm.value;
    if (structureData.parentStructure && typeof structureData.parentStructure === 'object') {
      console.log("📤 Envoi des données structure :", structureData);
      this.updateStructure(structureData)
    } else {
      this.errorMessage = 'La structure parente est invalide.';
    }
  }

  // Mettre à jour la structure via le service
  updateStructure(structureData: any): void {
    this.jwtService.updateStructure(this.structureId, structureData).subscribe(
      () => {
        this.successMessage = 'Structure modifiée avec succès !';
        this.router.navigate(['/gestStruct']);  // Rediriger vers la liste des structures après modification
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la modification de la structure';
        console.error(error);
      }
    );
  }

  // Annuler l'édition et revenir à la page de gestion des structures
  cancel(): void {
    this.router.navigate(['/gestStruct']);
  }
}
