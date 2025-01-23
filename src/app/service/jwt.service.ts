import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { StorageService } from './storage-service.service';

  const BASE_URL = "http://localhost:8086/";

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  
  constructor(private http: HttpClient, private storageService: StorageService) {}

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'signup', signRequest);
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'login', loginRequest);
  }
  

  gestionUsers(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    if (!headers) {
      console.error('Aucun JWT trouvé. Impossible de continuer.');
      return throwError(() => new Error('Aucun JWT trouvé.'));
    }
    return this.http.get(BASE_URL + 'api/users', { headers });
  }

  private createAuthorizationHeader(): HttpHeaders | null {
    const jwtToken = this.storageService.getItem('jwt');
    if (jwtToken) {
      console.log("JWT token trouvé :", jwtToken);
      return new HttpHeaders().set("Authorization", "Bearer " + jwtToken);
    }
    console.error("Aucun JWT trouvé dans localStorage.");
    return null;
  }

  getRole(): string | null {
    const token = this.storageService.getItem('jwt');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Token décodé :', decodedToken);
        return decodedToken.role || null;
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT', error);
        return null;
      }
    }
    return null;
  }
  getEmail(): string | null {
    const token = this.storageService.getItem('jwt');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Email du token :', decodedToken.email);
        return decodedToken.email || null;
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT', error);
        return null;
      }
    }
    return null;
  }
  
  getPhoneNumber(): string | null {
    const token = this.storageService.getItem('jwt');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log('Numéro de téléphone du token :', decodedToken.phoneNumber);
        return decodedToken.phoneNumber || null;
      } catch (error) {
        console.error('Erreur lors du décodage du token JWT', error);
        return null;
      }
    }
    return null;
  }


  isAdmin(): boolean {
    const role = this.getRole();
    console.log('Rôle récupéré depuis le token JWT :', role);
    return role === 'ROLE_ADMIN';
  }

  deleteUser(userId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    if (!headers) {
      return throwError(() => new Error('Aucun JWT trouvé.'));
    }
    return this.http.delete(BASE_URL + `api/users/${userId}`, { headers });
  }

  getUserById(userId: number): Observable<any> {
    const headers = this.createAuthorizationHeader();
    if (!headers) {
      return throwError(() => new Error('Aucun JWT trouvé.'));
    }
    return this.http.get(BASE_URL + `api/users/${userId}`, { headers });
  }

  updateUser(userId: number, userData: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    if (!headers) {
      return throwError(() => new Error('Aucun JWT trouvé.'));
    }
  
    // Construire le payload pour correspondre au backend
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password, // Inclure le mot de passe (nécessaire pour le backend)
      profile: {
        role: userData.profile.role, // Inclure le rôle
      },
    };
  
    console.log('Payload envoyé au backend:', payload);
    console.log('Headers:', headers);
  
    return this.http.put(BASE_URL + `api/users/${userId}`, payload, { headers });
  }
  

}
