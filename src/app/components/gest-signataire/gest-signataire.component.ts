import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-gest-signataire',
  templateUrl: './gest-signataire.component.html',
  styleUrls: ['./gest-signataire.component.css'],
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, FormsModule,DropdownModule],
  providers: [MessageService]
})
export class GestSignataireComponent implements OnInit {
  signataires: any[] = [];
  structures: any[] = [];
  clonedSignataires: { [s: string]: any } = {};
  errorMessage: string = '';

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

  loadSignataires() {
    this.jwtService.getAllSignataires().subscribe({
      next: (data) => {
        this.signataires = data.map((signataire: any) => {
          const structure = this.structures.find((s: any) => s.id === signataire.structureId);
          signataire.structure = structure || null;
          return signataire;
        });
      },
      error: (err) => console.error('Erreur lors du chargement des signataires', err)
    });
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
