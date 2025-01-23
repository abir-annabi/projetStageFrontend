import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class EditUserComponent implements OnInit {
  userId!: number; // ID of the user to edit
  user: any = {}; // To store user information

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    // Retrieve the user ID from the route parameters
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchUserDetails();
  }

  fetchUserDetails(): void {
    this.jwtService.getUserById(this.userId).subscribe(
      (data) => {
        this.user = data;
        console.log('User details retrieved:', this.user);
  
        // Assurez-vous que le rôle existe dans l'objet utilisateur
        if (!this.user.profile) {
          this.user.profile = { role: '' }; // Initialise le rôle si manquant
        }
      },
      (error) => console.error('Error while fetching user details', error)
    );
  }
  
  saveUser(): void {
    // Inclure le mot de passe actuel si aucun changement
    if (!this.user.password) {
      this.user.password = 'current-password-placeholder'; // Placeholder pour le mot de passe
    }
  
    // Mapper le rôle en format backend avant l'envoi
    /*f (this.user.profile.role === 'admin') {
      this.user.profile.role = 'admin';
    } else if (this.user.profile.role === 'user') {
      this.user.profile.role = 'user';
    }*/
  
    this.jwtService.updateUser(this.userId, this.user).subscribe(
      () => {
        alert('Utilisateur modifié avec succès');
        this.router.navigate(['/gestUsers']); // Redirection après succès
      },
      (error) => {
        alert('Erreur de modification de l’utilisateur');
        console.error('Error while updating user:', error);
      }
    );
  }
  
  
  
}
