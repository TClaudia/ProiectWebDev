//  Latescu Carmen-Maria

 // Gestionarea stocării locale a istoricului căutărilor
class StorageService {
  constructor() {
    this.storageKey = 'flickr_search_history';
  }

  
   // Salvează un termen de căutare în istoric
  saveSearchTerm(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) return;

    // Verifică dacă termenul de căutare este valid și nu este gol
    try {
      const history = this.getSearchHistory();
      if (!history.includes(searchTerm.trim())) {
        if (history.length >= 10) {
          history.pop();
        }
        // Adaugă termenul de căutare la începutul istoricului
        // și îl salvează în localStorage
        history.unshift(searchTerm.trim()); 
        localStorage.setItem(this.storageKey, JSON.stringify(history));
      } else {  
        // Dacă termenul există deja, îl mută la începutul istoricului
        // și îl salvează din nou
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

  // Obține istoricul căutărilor din localStorage
  getSearchHistory() {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Eroare la citirea din localStorage:', error);
      return [];
    }
  }

  // Șterge un termen specific din istoric
  clearSearchHistory() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Eroare la ștergerea din localStorage:', error);
    }
  }
}

export default new StorageService();