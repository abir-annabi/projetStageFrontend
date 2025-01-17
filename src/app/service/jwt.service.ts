import { StorageService } from './storage-service.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';


const BASE_URL = "http://localhost:8083/";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private http: HttpClient,
    private storageService: StorageService) {
  }

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'signup', signRequest);
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'login', loginRequest)
  }
  
  gestionUsers(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    if (!headers) {
      console.error('Aucun JWT trouvé dans localStorage. Impossible de continuer.');
      return new Observable((observer) => {
        observer.error('Aucun JWT trouvé.');
      });
    }
    return this.http.get(BASE_URL + 'api/users', { headers });
  }
  
  private createAuthorizationHeader(): HttpHeaders | null {
    const jwtToken = this.storageService.getItem('jwt');
    if (jwtToken) {
      console.log("JWT token trouvé dans localStorage", jwtToken);
      return new HttpHeaders().set("Authorization", "Bearer " + jwtToken);
    } else {
      console.error("Aucun JWT trouvé dans localStorage.");
      return null;
    }
  }
  
  

  getRole(): string | null {
    const token = localStorage.getItem('jwt');
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
  

isAdmin(): boolean {
  const role = this.getRole();
  console.log('Rôle récupéré depuis le token JWT :', role);
  return role === 'ROLE_ADMIN'; // Adaptez la vérification au format du rôle
}

deleteUser(userId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    console.error('Aucun JWT trouvé dans localStorage. Impossible de continuer.');
    return new Observable((observer) => observer.error('Aucun JWT trouvé.'));
  }
  return this.http.delete(BASE_URL + `api/users/${userId}`, { headers });
}



}

