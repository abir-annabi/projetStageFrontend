import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtService } from '../../service/jwt.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common'; // Importez CommonModule
@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css'],
    imports: [FormsModule, TranslateModule,CommonModule],
    standalone: true,
    providers: [JwtService], 
})
export class EditUserComponent implements OnInit {
  userId!: number; // ID of the user to edit
  user: any = {}; // To store user information
  structures: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    // Retrieve the user ID from the route parameters
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchUserDetails();
    this.fetchStructures();
  }


  fetchStructures(): void {
    this.jwtService.getAllStructures().subscribe(
      (data) => {
        this.structures = data;
        console.log('Structures retrieved:', this.structures);
      },
      (error) => console.error('Error while fetching structures', error)
    );
  }

  fetchUserDetails(): void {
    this.jwtService.getUserById(this.userId).subscribe(
      (data) => {
        this.user = data;
        console.log('User details retrieved:', this.user);
  
        // Initialiser la structure si elle est manquante
        if (!this.user.structure) {
          this.user.structure = { id: null }; // Initialiser avec une structure vide
        }
  
        // Initialiser le profil si manquant
        if (!this.user.profile) {
          this.user.profile = { role: '' };
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
    console.log(this.structures)
  
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
