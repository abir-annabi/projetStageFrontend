import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
    selector: 'app-gest-signataire',
    templateUrl: './gest-signataire.component.html',
    styleUrls: ['./gest-signataire.component.css'],
    imports: [CommonModule, TableModule, ButtonModule, InputTextModule, FormsModule, DropdownModule,ConfirmDialogModule],
    providers: [MessageService],
    standalone:true
})
export class GestSignataireComponent implements OnInit {
  signataires: any[] = [];
  structures: any[] = [];
  clonedSignataires: { [s: string]: any } = {};
  errorMessage: string = '';
  paginatedUsers: any[] = [];  // Utilisateurs affichés sur la page actuelle
  currentPage: number = 1;
  rowsPerPage: number = 10;  // Nombre de signataires par page
  totalRecords: number = 0;
  paginatedSignataires: any[] = [];  // Données paginées
  
  loading: boolean = true;

  // Variables pour la pagination
  
  constructor(private jwtService: JwtService, private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadStructures();
  }

  loadStructures() {
    this.jwtService.getAllStructures().subscribe({
      next: (data) => {
        this.structures = data;
        this.loadSignataires();
      },
      error: (err) => console.error('Erreur lors du chargement des structures', err)
    });
  }
  updatePaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedUsers = this.signataires.slice(start, end);
  }
  
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedSignataires();
  }
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rowsPerPage);
  }
  
loadSignataires() {
  this.jwtService.getAllSignataires().subscribe({
    next: (data) => {
      this.signataires = data.map((signataire: any) => {
        const structure = this.structures.find((s: any) => s.id === signataire.structureId);
        return { ...signataire, structure: structure || null };
      });
      this.totalRecords = this.signataires.length; // ⚠️ Mise à jour du total des enregistrements
      this.updatePaginatedSignataires();
      this.loading = false;
    },
    error: (err) => console.error('Erreur lors du chargement des signataires', err)
  });
}
updatePaginatedSignataires(): void {
  const start = (this.currentPage - 1) * this.rowsPerPage;
  const end = start + this.rowsPerPage;
  this.paginatedSignataires = this.signataires.slice(start, end);
}



  deleteSignataire(id: number) {
    if (confirm('Voulez-vous vraiment supprimer ce signataire ?')) {
      this.jwtService.deleteSignataire(id).subscribe({
        next: () => {
          this.signataires = this.signataires.filter(s => s.id !== id);
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Signataire supprimé' });
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  editSignataire(id: number) {
    this.router.navigate(['/editSign', id]);
  }

  addSignataire() {
    this.router.navigate(['/addSign']);
  }

  onRowEditInit(signataire: any) {
    this.clonedSignataires[signataire.id] = { ...signataire };
  }

  onRowEditSave(signataire: any) {
    const signataireId = signataire.id;
    const signataireData = signataire;

    this.jwtService.updateSignataire(signataireId, signataireData).subscribe({
      next: () => {
        delete this.clonedSignataires[signataire.id];
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Signataire mis à jour' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Mise à jour échouée' });
      }
    });
  }

  
  onRowEditCancel(signataire: any, index: number) {
    this.signataires[index] = this.clonedSignataires[signataire.id];
    delete this.clonedSignataires[signataire.id];
  }
}
