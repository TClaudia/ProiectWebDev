//  Latescu Carmen-Maria

 // Gestionarea stocării locale a istoricului căutărilor
 
class StorageService {
  constructor() {
    this.storageKey = 'flickr_search_history';
  }

  
   // Salvează un termen de căutare în istoric
   
  saveSearchTerm(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) return;
    
    try {
      const history = this.getSearchHistory();
      if (!history.includes(searchTerm.trim())) {
        if (history.length >= 10) {
          history.pop();
        }
        
        history.unshift(searchTerm.trim()); 
        localStorage.setItem(this.storageKey, JSON.stringify(history));
      } else {  
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

  
  getSearchHistory() {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Eroare la citirea din localStorage:', error);
      return [];
    }
  }


  clearSearchHistory() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Eroare la ștergerea din localStorage:', error);
    }
  }
}

export default new StorageService();