import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-gest-users',
  templateUrl: './gest-users.component.html',
  styleUrls: ['./gest-users.component.css'],
  imports:[CommonModule,RouterModule],
  standalone:true,
})
export class GestUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private jwtService: JwtService,private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.jwtService.gestionUsers().subscribe(
      (data) => {
        console.log('Données récupérées :', data);
        this.users = data;
      },
      (error) => console.error('Erreur lors de la récupération des utilisateurs', error)
    );
  }
  

  editUser(userId: number): void {
    console.log('Modifier l’utilisateur', userId);
    // Implémenter la logique pour modifier un utilisateur
  }

  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.jwtService.deleteUser(userId).subscribe(
        () => {
          console.log(`Utilisateur avec ID ${userId} supprimé avec succès`);
          // Mettre à jour la liste localement après suppression
          this.users = this.users.filter(user => user.id !== userId);
        },
        (error) => console.error('Erreur lors de la suppression de l’utilisateur', error)
      );
    }
  }
  

  addUser(): void {
    this.router.navigate(['/adduser']); // Redirige vers la page d'ajout d'utilisateur
  }
}
