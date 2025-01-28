import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JwtService } from '../service/jwt.service';
import { TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [TranslateStore],
  standalone:true,
  imports: [CommonModule,RouterLink,TranslateModule]
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = true;
  showNavbar: boolean = true;

  constructor(private router: Router,private jwtService: JwtService) {

  }

  ngOnInit(): void {
    this.checkRole();
    this.router.events.subscribe(() => {
      this.updateNavbarVisibility();
    });
  }

  checkRole(): void {
    const role = this.jwtService.getRole(); // Récupère le rôle depuis le JWT
    this.isAdmin = role === 'ROLE_ADMIN'; // Vérifie si le rôle est ADMIN
    console.log('Utilisateur admin ?', this.isAdmin);
  }

  logout(): void {
    localStorage.clear(); 
    this.router.navigate(['/login']);
  }

  updateNavbarVisibility(): void {
    const hiddenRoutes = ['/login', '/register']; // Routes where navbar should be hidden
    this.showNavbar = !hiddenRoutes.includes(this.router.url);
  }


  
    
  
}
