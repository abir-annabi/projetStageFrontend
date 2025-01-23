import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-gest-users',
  templateUrl: './gest-users.component.html',
  styleUrls: ['./gest-users.component.css'],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class GestUsersComponent implements OnInit {
  users: any[] = []; // Contient "name", "email", et "role"

  constructor(private jwtService: JwtService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers(); // Charge les utilisateurs à l'initialisation
  }

  fetchUsers(): void {
    this.jwtService.gestionUsers().subscribe(
      (data) => {
        console.log('Données brutes récupérées depuis le backend :', data);
  
        // Mappez les données utilisateurs et normalisez les rôles
        this.users = data.map((user: any) => ({
          ...user,
          role:user.profile.role , // Normaliser le rôle
        }));
  
        console.log('Données après mappage :', this.users);
      },
      (error) => console.error('Erreur lors de la récupération des utilisateurs', error)
    );
  }
  
  
  
  mapRole(role: string): string {
    // Normaliser les rôles avant de les afficher
    if (role === 'ROLE_ADMIN' || role === 'admin') {
      return 'Admin';
    }
    if (role === 'ROLE_USER' || role === 'user') {
      return 'User';
    }
    return 'Rôle inconnu'; // Valeur par défaut si le rôle est inexistant ou incorrect
  }
  
  
  

  editUser(userId: number): void {
    this.router.navigate([`/edituser/${userId}`]);
  }

  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.jwtService.deleteUser(userId).subscribe(
        () => {
          console.log(`Utilisateur avec ID ${userId} supprimé avec succès`);
          // Mise à jour locale des utilisateurs après suppression
          this.users = this.users.filter((user) => user.id !== userId);
        },
        (error) => console.error('Erreur lors de la suppression de l’utilisateur', error)
      );
    }
  }

  addUser(): void {
    this.router.navigate(['/adduser']); // Redirige vers la page d'ajout
  }
}
