import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  // Vérifie si localStorage est disponible
  isLocalStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false; // Environnement non-navigateur
      }
      // Test d'accès à localStorage
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      console.error('localStorage n’est pas disponible :', e);
      return false;
    }
  }

  // Stocker une valeur dans localStorage
  setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    } else {
      console.error('Impossible de sauvegarder dans localStorage. Environnement non supporté.');
    }
  }

  // Lire une valeur depuis localStorage
  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    } else {
      console.error('Impossible de lire dans localStorage. Environnement non supporté.');
      return null;
    }
  }

  // Supprimer une valeur de localStorage
  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    } else {
      console.error('Impossible de supprimer dans localStorage. Environnement non supporté.');
    }
  }
}
