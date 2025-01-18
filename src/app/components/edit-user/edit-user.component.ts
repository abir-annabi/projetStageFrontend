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
    // Call service to fetch user details
    this.jwtService.getUserById(this.userId).subscribe(
      (data) => {
        this.user = data;
        console.log('User details retrieved:', this.user);
      },
      (error) =>
        console.error('Error while fetching user details', error)
    );
  }

  saveUser(): void {
    // Call service to save user modifications
    this.jwtService.updateUser(this.userId, this.user).subscribe(
      () => {
        alert('Utilisateur modifié avec succès');
        this.router.navigate(['/gestUsers']); // Redirect to gestUsers page
      },
      (error) => {
        alert('Erreur de modification de l’utilisateur');
        console.error('Error while updating user:', error);
      }
    );
  }
}
