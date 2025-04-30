
// src/services/StorageService.js
/**
 * Serviciu pentru gestionarea stocării locale a istoricului căutărilor
 */
class StorageService {
  constructor() {
    this.storageKey = 'flickr_search_history';
  }

  /**
   * Salvează un termen de căutare în istoric
   * @param {string} searchTerm - Termenul de căutare de salvat
   */
  saveSearchTerm(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) return;
    
    try {
      // Obținem istoricul curent
      const history = this.getSearchHistory();
      
      // Adăugăm termenul nou (dacă nu există deja)
      if (!history.includes(searchTerm.trim())) {
        // Limităm istoricul la ultimele 10 căutări
        if (history.length >= 10) {
          history.pop(); // Eliminăm cea mai veche căutare
        }
        
        history.unshift(searchTerm.trim()); // Adăugăm la început
        localStorage.setItem(this.storageKey, JSON.stringify(history));
      } else {
        // Dacă termenul există deja, îl mutăm la început
        const updatedHistory = [
          searchTerm.trim(),
          ...history.filter(term => term !== searchTerm.trim())
        ];
        localStorage.setItem(this.storageKey, JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error('Eroare la salvarea în localStorage:', error);
    }
  }

  /**
   * Obține istoricul de căutări
   * @returns {Array} Array cu termenii de căutare salvați
   */
  getSearchHistory() {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Eroare la citirea din localStorage:', error);
      return [];
    }
  }

  /**
   * Șterge istoricul de căutări
   */
  clearSearchHistory() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Eroare la ștergerea din localStorage:', error);
    }
  }
}

export default new StorageService();