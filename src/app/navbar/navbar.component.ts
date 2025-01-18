import { Component, OnInit } from '@angular/core';
import { JwtService } from '../service/jwt.service';
import { StorageService } from '../service/storage-service.service'; // Import de StorageService si nécessaire
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Correction : styleUrls (au pluriel)
})
export class NavbarComponent implements OnInit {

  isAdmin: boolean = false;

  constructor(private jwtService: JwtService, private storageService: StorageService,private router: Router) {} // Injection de StorageService

  ngOnInit(): void {
    this.checkRole();
  }

  checkRole(): void {
    this.isAdmin = this.jwtService.isAdmin(); // Vérifie si l'utilisateur est admin
  }

  logout(): void {
    this.storageService.removeItem('jwt'); // Utilisation de StorageService pour supprimer le token
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }
}
