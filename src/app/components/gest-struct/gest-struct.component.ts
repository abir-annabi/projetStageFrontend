import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';


import { Table } from 'primeng/table';

import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
@Component({
    selector: 'app-gest-structure',
    templateUrl: './gest-struct.component.html',
    styleUrls: ['./gest-struct.component.css'],
    imports: [CommonModule, TableModule, InputTextModule, ButtonModule, ConfirmDialogModule, TableModule, TagModule, IconFieldModule, InputIconModule, MultiSelectModule, SelectModule],
    providers: [ConfirmationService, MessageService],
    standalone:true
})
export class GestStructComponent implements OnInit {
  structures: any[] = [];
  paginatedStructures: any[] = [];
  errorMessage: string = '';
  loading: boolean = false;


  // Variables pour la pagination
  currentPage: number = 1;
  rowsPerPage: number = 10; // Nombre d'éléments par page
  totalRecords: number = 0;

  constructor(private jwtService: JwtService, public router: Router) {}

  ngOnInit(): void {
    this.loadStructures();
  }

  loadStructures(): void {
    this.loading = true;
    this.jwtService.getAllStructures().subscribe(
      (data) => {
        this.structures = data;
        this.totalRecords = this.structures.length;
        this.updatePaginatedStructures();
        this.loading = false;
        console.log("Structure : ",this.structures)
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des structures';
        console.error(error);
        this.loading = false;
      }
    );
  }
  confirmDelete(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette structure ?')) {
      this.deleteStructure(id);
    }
  }
    

  updatePaginatedStructures(): void {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedStructures = this.structures.slice(start, end);
  }

  onPageChange(event: any): void {
    this.currentPage = event.page + 1; // PrimeNG commence à 0
    this.updatePaginatedStructures();
  }

  deleteStructure(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette structure ?')) {
      this.jwtService.deleteStructure(id).subscribe(
        () => {
          this.structures = this.structures.filter(structure => structure.id !== id);
          this.totalRecords = this.structures.length;
          this.updatePaginatedStructures();
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la suppression de la structure';
          console.error(error);
        }
      );
    }
  }
  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.rowsPerPage);
  }
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedStructures();
  }
  addStructure(): void {
    this.router.navigate(['/addStruct']);
  }
      

  editStructure(id: number): void {
    this.router.navigate([`/editStruct/${id}`]);
  }
}
