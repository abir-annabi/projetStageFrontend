import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { JwtService } from '../../service/jwt.service';

@Component({
    selector: 'app-add-signataire',
    imports: [RouterModule, TranslateModule, ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './add-signataire.component.html',
    styleUrl: './add-signataire.component.css'
})


export class AddSignataireComponent implements OnInit {
  signataireForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private jwtService: JwtService,
    public router: Router
  ) {

      this.signataireForm = this.fb.group({
        id: [''],
        nomFr: ['', Validators.required],
        prenomFr: ['', Validators.required],
        nomAr: [''],
        prenomAr: [''],
        telephone: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
        email: ['', [Validators.required, Validators.email]],
        actif: [false],
        structureId: ['', Validators.required]  // Vérifie bien cette ligne !
      
      
     });
     
  
  }
  structures: any[] = []; // Stocke la liste des structures

  ngOnInit(): void {
    this.jwtService.getAllStructures().subscribe({
      next: (data) => this.structures = data,
      error: (err) => console.error("❌ Erreur lors du chargement des structures", err)
    });
  }
  

  onSubmit() {
    console.log("Formulaire soumis :", this.signataireForm.value);
    
    if (this.signataireForm.valid) {
      const structureId = this.signataireForm.value.structureId;
      
      if (!structureId) {
        this.errorMessage = "Veuillez sélectionner une structure.";
        console.warn("⚠️ Aucun structureId sélectionné.");
        return;
      }
  
      // ✅ Ensure structure is an object (not an array)
      const formData = { 
        ...this.signataireForm.value,
        structure: { id: Number(structureId) } // Convert structureId to number and wrap in object
      };
  
      delete formData.structureId; // Remove the old structureId field
  
      console.log("📤 Données envoyées :", formData);
  
      this.jwtService.addSignataire(formData).subscribe({
        next: () => {
          console.log("✅ Signataire ajouté avec succès !");
          this.router.navigate(['/gestSign']);
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de l'ajout du signataire";
          console.error("❌ Erreur API :", err);
        }
      });
    } else {
      this.errorMessage = "Veuillez remplir tous les champs requis correctement.";
      console.warn("⚠️ Formulaire invalide :", this.signataireForm.errors);
    }
  }
  
}  
