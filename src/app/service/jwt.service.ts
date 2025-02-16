import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { StorageService } from './storage-service.service';

  const BASE_URL = "http://localhost:8089/";

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private adminStatusSubject = new BehaviorSubject<boolean>(false);
  adminStatus$ = this.adminStatusSubject.asObservable();
  
  constructor(private http: HttpClient, private storageService: StorageService) {}

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'signup', signRequest);
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'login', loginRequest).pipe(
      tap((response: any) => {
        if (response.token) {
          this.storageService.setItem('jwt', response.token);
          console.log("🔐 JWT stocké avec succès :", response.token);
          this.updateAdminStatus();
        }
      })
    );
  }

  verifyCode(code: string): Observable<any> {
    const email = this.getEmail();
    
    if (!email) {
      return throwError(() => new Error('Email introuvable. Veuillez vous reconnecter.'));
    }
  
    const payload = { email, code };
  
    const headers = this.createAuthorizationHeader();
  
    console.log("Payload envoyé :", payload);
    console.log("Headers envoyés :", headers);
    if (!headers) {
      return throwError(() => new Error('Aucun JWT trouvé.'));
    }
    return this.http.post(BASE_URL + 'api/auth/verify-code', payload, { headers });
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


  gestionUsers(): Observable<any> {
    const headers = this.createAuthorizationHeader();
    if (!headers) {
      console.error('Aucun JWT trouvé. Impossible de continuer.');
      return throwError(() => new Error('Aucun JWT trouvé.'));
    }
    return this.http.get(BASE_URL + 'api/users', { headers });
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

  updateAdminStatus(): void {
    const role = this.getRole();
    const isAdmin = role === 'ROLE_ADMIN';
    this.adminStatusSubject.next(isAdmin); // Mettre à jour le BehaviorSubject
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
  // Récupérer tous les signataires
getAllSignataires(): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.get(BASE_URL + 'api/signataires', { headers });
}

// Supprimer un signataire
deleteSignataire(signataireId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.delete(BASE_URL + `api/signataires/${signataireId}`, { headers });
}
// Ajouter un signataire
addSignataire(signataireData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  
  console.log("📤 Envoi des données :", signataireData);
  
  return this.http.post(BASE_URL + 'api/signataires', signataireData, { headers });
}



// Récupérer un signataire par ID
getSignataireById(signataireId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.get(BASE_URL + `api/signataires/${signataireId}`, { headers });
}

// Modifier un signataire
updateSignataire(signataireId: number, signataireData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }

  return this.http.put(BASE_URL + `api/signataires/${signataireId}`, signataireData, { headers });
}

getAllStructures(): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.get(BASE_URL + 'api/structures', { headers });
}

addStructure(structureData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }

  console.log("📤 Envoi des données structure :", structureData);

  return this.http.post(BASE_URL + 'api/structures', structureData, { headers });
}
deleteStructure(structureId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }

  return this.http.delete(BASE_URL + `api/structures/${structureId}`, { headers });
}
// Récupérer une structure par ID
getStructureById(structureId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.get(BASE_URL + `api/structures/${structureId}`, { headers });
}

// Mettre à jour une structure
updateStructure(structureId: number, structureData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.put(BASE_URL + `api/structures/${structureId}`, structureData, { headers });
}
// Récupérer tous les types
getTypes(): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.get(BASE_URL + 'api/types', { headers });
}

// Supprimer un type
deleteType(id: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.delete(BASE_URL + `api/types/${id}`, { headers });
}
// Ajouter un type
addType(typeData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();  // Assurez-vous que cette méthode renvoie l'entête correct
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }

  return this.http.post(BASE_URL + 'api/types', typeData, { headers: headers });
}

// Mettre à jour un type
updateType(typeId: number, typeData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }

  return this.http.put(BASE_URL + `api/types/${typeId}`, typeData, { headers });
}

// Récupérer un type par ID
getTypeById(typeId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.get(BASE_URL + `api/types/${typeId}`, { headers });
}

// Dans votre JwtService

// Récupérer toutes les TypeDemande avec leurs Natures
getAllTypeDemandes(): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.get(BASE_URL + 'api/typedemandes', { headers });
}

// Ajouter un TypeDemande
addTypeDemande(typeDemandeData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.post(BASE_URL + 'api/typedemandes', typeDemandeData, { headers });
}

// Modifier un TypeDemande
updateTypeDemande(typeDemandeId: number, typeDemandeData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.put(BASE_URL + `api/typedemandes/${typeDemandeId}`, typeDemandeData, { headers });
}

// Supprimer un TypeDemande
deleteTypeDemande(typeDemandeId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.delete(BASE_URL + `api/typedemandes/${typeDemandeId}`, { headers });
}

// Ajouter une Nature à un TypeDemande
addNature(typeDemandeId: number, natureData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.post(`${BASE_URL}api/natures/typedemandes/${typeDemandeId}/natures`, natureData, { headers });
}
// Modifier une Nature
updateNature(natureId: number, natureData: any): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.put(BASE_URL + `api/natures/${natureId}`, natureData, { headers });
}

// Supprimer une Nature
deleteNature(natureId: number): Observable<any> {
  const headers = this.createAuthorizationHeader();
  if (!headers) {
    return throwError(() => new Error('Aucun JWT trouvé.'));
  }
  return this.http.delete(BASE_URL + `api/natures/${natureId}`, { headers });
}

decodeToken(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1])); // Décodage de la charge utile du JWT
  } catch (e) {
    console.error('Erreur de décodage du token', e);
    return null;
  }
}
getToken(): string | null {
  return this.storageService.getItem('jwt');
}

}
