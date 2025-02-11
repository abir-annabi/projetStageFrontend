import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-signataire',
  standalone: true,
  templateUrl: './edit-signataire.component.html',
  styleUrl: './edit-signataire.component.css',
  imports:[ReactiveFormsModule,CommonModule]
})
export class EditSignataireComponent implements OnInit {
  signataireForm: FormGroup;
  signataireId!: number;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private jwtService: JwtService,
    private route: ActivatedRoute,
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
      actif: [true],
      structureId: ['', Validators.required]
    });
  }

    structures: any[] = [];

ngOnInit(): void {
  this.jwtService.getAllStructures().subscribe({
    next: (data) => { this.structures = data; },
    error: (err) => { console.error("❌ Erreur structures :", err); }
  });


    this.signataireId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("🔹 ID du signataire récupéré :", this.signataireId);

    if (this.signataireId) {
      this.jwtService.getSignataireById(this.signataireId).subscribe({
        next: (data) => {
          console.log("🔹 Données du signataire récupérées :", data);
          
          // Adaptation si structure est un objet
          this.signataireForm.patchValue({
            ...data,
            structureId: data.structure?.id || ''  // Assurez-vous que structureId reçoit bien un ID
          });
        },
        error: (err) => {
          console.error("❌ Erreur lors du chargement du signataire", err);
          this.errorMessage = "Impossible de récupérer les données du signataire.";
        }
      });
    }
  }

  onSubmit(): void {
    if (this.signataireForm.valid) {
      this.jwtService.updateSignataire(this.signataireId, this.signataireForm.value).subscribe({
        next: () => {
          console.log("✅ Signataire mis à jour avec succès !");
          this.router.navigate(['/gestSign']);
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de la mise à jour du signataire.";
          console.error("❌ Erreur API :", err);
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement.';
      console.warn("⚠️ Formulaire invalide :", this.signataireForm.errors);
    }
  }
}
