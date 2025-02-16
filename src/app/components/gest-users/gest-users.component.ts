import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

import { Table } from 'primeng/table';

import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';  // Pour p-dialog
import { DropdownModule } from 'primeng/dropdown';  // Pour p-dropdown

import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-gest-users',
  templateUrl: './gest-users.component.html',
  styleUrls: ['./gest-users.component.css'],
  imports: [CommonModule, TableModule, PaginatorModule, InputTextModule, ButtonModule, ConfirmDialogModule, TableModule, TagModule, IconFieldModule, InputIconModule, MultiSelectModule, SelectModule],
  providers: [ConfirmationService, MessageService]
})
export class GestUsersComponent implements OnInit {
users: any[] = [];
 loading: boolean = true;
globalFilter: string = '';
paginatedUsers: any[] = [];  // Utilisateurs affichés sur la page actuelle


// Variables pour la pagination
currentPage: number = 1;
rowsPerPage: number = 10;  // Nombre d'utilisateurs par page
totalRecords: number = 0;

constructor(
  private jwtService: JwtService,
  private router: Router,
  private confirmationService: ConfirmationService,
  private messageService: MessageService
) {}

ngOnInit(): void {
  this.fetchUsers();
}

fetchUsers(): void {
  this.jwtService.gestionUsers().subscribe(
    (data) => {
      this.users = data.map((user: any) => ({
        ...user,
        role: this.mapRole(user.profile.role),
        phoneNumber: user.phoneNumber,
        structure: user.structure,
      }));
      this.totalRecords = this.users.length; // ⚠️ Met à jour totalRecords
      this.updatePaginatedUsers();
      this.loading = false;
    },
    (error) => console.error('Erreur lors de la récupération des utilisateurs', error)
  );
}

updatePaginatedUsers(): void {
  const start = (this.currentPage - 1) * this.rowsPerPage;
  const end = start + this.rowsPerPage;
  this.paginatedUsers = this.users.slice(start, end);
}

onPageChange(page: number): void {
  this.currentPage = page;
  this.updatePaginatedUsers();
}

get totalPages(): number {
  return Math.ceil(this.totalRecords / this.rowsPerPage);
}


onGlobalFilter(event: Event): void {
  const inputElement = event.target as HTMLInputElement;
  this.globalFilter = inputElement.value;
}


mapRole(role: string): string {
  if (role === 'ROLE_ADMIN' || role === 'admin') return 'Admin';
  if (role === 'ROLE_USER' || role === 'user') return 'User';
  return 'Rôle inconnu';
}

confirmDelete(userId: number): void {
  this.confirmationService.confirm({
    message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
    accept: () => this.deleteUser(userId)
  });
}



deleteUser(userId: number): void {
  this.jwtService.deleteUser(userId).subscribe(
    () => {
      this.users = this.users.filter((user) => user.id !== userId);
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Utilisateur supprimé' });
    },
    (error) => console.error('Erreur lors de la suppression de l’utilisateur', error)
  );
}

editUser(userId: number): void {
  this.router.navigate([`/edituser/${userId}`]);

}

addUser(): void {
  this.router.navigate(['/adduser']);
}



}