
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-gest-type',
    templateUrl: './gest-type.component.html',
    styleUrls: ['./gest-type.component.css'],
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, FormsModule],
    providers: [MessageService]
})
export class GestTypeComponent implements OnInit {
  types: any[] = [];
  errorMessage: string = '';
  clonedTypes: { [s: string]: any } = {};
  paginatedUsers: any[] = [];  // Utilisateurs affichés sur la page actuelle


// Variables pour la pagination
currentPage: number = 1;
rowsPerPage: number = 10;  // Nombre d'utilisateurs par page
totalRecords: number = 0;


  constructor(private jwtService: JwtService, public router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadTypes();
  }

  // Charger tous les types depuis l'API
  loadTypes(): void {
    this.jwtService.getTypes().subscribe(
      (data) => {
        this.types = data;
        this.totalRecords = this.types.length; // Met à jour le total des enregistrements
        this.updatePaginatedUsers(); // Met à jour la pagination après chargement des données
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des types';
        console.error(error);
      }
    );
  }
  
  updatePaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedUsers = this.types.slice(start, end);
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedUsers();
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rowsPerPage);
  }
  

  // Supprimer un type
  deleteType(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce type ?')) {
      this.jwtService.deleteType(id).subscribe(
        () => {
          this.types = this.types.filter(type => type.id !== id);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Type supprimé' });
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la suppression du type';
          console.error(error);
        }
      );
    }
  }

  onRowEditInit(id: any) {
    this.router.navigate(['/editType', id]); // Redirige vers la route d'édition avec l'ID
  }

 // Sauvegarde de la modification
onRowEditSave(type: any) {
  const typeId = type.id;  // Récupérer l'ID du type
  const typeData = type;    // Les données du type

  this.jwtService.updateType(typeId, typeData).subscribe(
    () => {
      delete this.clonedTypes[type.id];
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Type mis à jour' });
    },
    (error) => {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour échouée' });
      console.error(error);
    }
  );
}

  // Annulation de l'édition
  onRowEditCancel(type: any, index: number) {
    this.types[index] = this.clonedTypes[type.id];
    delete this.clonedTypes[type.id];
  }
}