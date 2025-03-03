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
    imports: [ReactiveFormsModule, CommonModule]
})
export class AddStructComponent implements OnInit {
  structForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  structures: any[] = [];
  types: any[] = []; // Liste des types disponibles

  constructor(
    private jwtService: JwtService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.jwtService.getAllStructures().subscribe({
      next: (data) => { this.structures = data; },
      error: (err) => { console.error("❌ Erreur structures :", err); }
    });

    this.jwtService.getTypes().subscribe({
      next: (data) => { this.types = data; },
      error: (err) => { console.error("❌ Erreur types :", err); }
    });

    this.initializeForm();
  }

  initializeForm(): void {
    this.structForm = this.fb.group({
      libelleAr: ['', Validators.required],
      libelleFr: ['', Validators.required],
      adresse: ['', Validators.required],
      parentStructure: [null],
      type: [null, Validators.required] // type est maintenant un objet Type
    });
  }
  

  onSubmit(): void {
    if (this.structForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }
  
    const structureData = this.structForm.value;
  
    // Vérifiez que parentStructure est un objet valide
    if (structureData.parentStructure && typeof structureData.parentStructure === 'object') {
      console.log("📤 Envoi des données structure :", structureData);
      this.addStructure(structureData);
    } else {
      this.errorMessage = 'La structure parente est invalide.';
    }
  }
  
  addStructure(structureData: any): void {
    this.jwtService.addStructure(structureData).subscribe(
      () => {
        this.successMessage = 'Structure ajoutée avec succès !';
        this.router.navigate(['/gestStruct']);
      },
      (error) => {
        this.errorMessage = 'Erreur lors de l\'ajout de la structure';
        console.error(error);
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/gestStruct']);
  }
}