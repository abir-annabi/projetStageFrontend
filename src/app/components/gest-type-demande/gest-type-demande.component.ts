import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gest-type-demande',
    imports: [FormsModule, CommonModule],
    templateUrl: './gest-type-demande.component.html',
    styleUrls: ['./gest-type-demande.component.css']
})
export class GestTypeDemandeComponent implements OnInit {
  typeDemandes: any[] = [];
  newTypeDemandeLibelle = '';
  newNatureLibelle = '';

  constructor(private jwtService: JwtService) {}

  ngOnInit() {
    this.getAllTypeDemandes();
  }

  getAllTypeDemandes() {
    this.jwtService.getAllTypeDemandes().subscribe(
      (data: any) => {
        this.typeDemandes = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des types de demande', error);
      }
    );
  }

  addTypeDemande() {
    if (this.newTypeDemandeLibelle.trim()) {
      const newTypeDemande = { libelle: this.newTypeDemandeLibelle };
      this.jwtService.addTypeDemande(newTypeDemande).subscribe(
        () => {
          this.getAllTypeDemandes(); // Recharger la liste après l'ajout
          this.newTypeDemandeLibelle = ''; // Réinitialiser le champ de saisie
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du type de demande', error);
        }
      );
    }
  }

  deleteTypeDemande(id: number) {
    this.jwtService.deleteTypeDemande(id).subscribe(
      () => {
        this.getAllTypeDemandes(); // Recharger la liste après la suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression du type de demande', error);
      }
    );
  }

  updateTypeDemande(type: any) {
    const updatedTypeDemande = { libelle: type.libelle };
    this.jwtService.updateTypeDemande(type.id, updatedTypeDemande).subscribe(
      () => {
        this.getAllTypeDemandes(); // Recharger la liste après la mise à jour
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du type de demande', error);
      }
    );
  }
  addNature(type: any) {
    if (this.newNatureLibelle.trim()) {
      const newNature = { libelle: this.newNatureLibelle };
      this.jwtService.addNature(type.id, newNature).subscribe(
        () => {
          this.getAllTypeDemandes(); // Recharge la liste après l'ajout
          this.newNatureLibelle = ''; // Réinitialise le champ de saisie
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la nature', error);
        }
      );
    }
  }

  deleteNature(natureId: number) {
    this.jwtService.deleteNature(natureId).subscribe(
      () => {
        this.getAllTypeDemandes(); // Recharger la liste après la suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression de la nature', error);
      }
    );
  }

  updateNature(nature: any, typeDemandeId: number) {
  const updatedNature = {
    libelle: nature.libelle,
    typeDemande: { id: typeDemandeId } // Associer correctement le TypeDemande
  };
  this.jwtService.updateNature(nature.id, updatedNature).subscribe(
    () => {
      this.getAllTypeDemandes(); // Recharger la liste après la mise à jour
    },
    (error) => {
      console.error('Erreur lors de la mise à jour de la nature', error);
    }
  );
}

}