
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JwtService } from '../../service/jwt.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-type',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './edit-type.component.html',
    styleUrl: './edit-type.component.css'
})

export class EditTypeComponent implements OnInit {
  typeForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  typeId!: number;

  constructor(
    private fb: FormBuilder,
    private jwtService: JwtService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.typeForm = this.fb.group({
      libelleFr: ['', Validators.required],
      libelleAr: ['', Validators.required]

    });
  }

  ngOnInit(): void {
    // Récupérer l'ID du type depuis l'URL
    this.route.params.subscribe(params => {
      this.typeId = +params['id'];
      this.loadType(this.typeId);
    });
  }

  // Méthode pour charger les informations du type à modifier
  loadType(id: number): void {
    this.jwtService.getTypeById(id).subscribe(
      (data) => {
        this.typeForm.patchValue({
          libelleFr: data.libelleFr,
          libelleAr: data.libelleAr
        });
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement du type';
        console.error(error);
      }
    );
  }

  // Méthode pour soumettre le formulaire et mettre à jour le type
  updateType(): void {
    if (this.typeForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const updatedType = this.typeForm.value;

    this.jwtService.updateType(this.typeId, updatedType).subscribe(
      (response) => {
        this.successMessage = 'Type modifié avec succès !';
        this.errorMessage = '';
        this.router.navigate(['/gestType']); // Redirection vers la page de gestion des types
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la modification du type.';
        console.error(error);
      }
    );
  }
}
