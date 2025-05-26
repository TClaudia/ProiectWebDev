
//Tun Claudia-Gabriela
// Serviciu  pentru a urmări acțiunile utilizatorului

class AnalyticsService {
  constructor() {
    this.enabled = false; 
    this.events = [];
  }

  //Activeaza sau dezactiveaza serviciului
  /*
  Scop: Activează/dezactivează tracking-ul
Parametri: isEnabled - boolean pentru stare
Actualizează flag-ul
Șterge evenimentele dacă se dezactiveaz
*/
  setEnabled(isEnabled) {
    this.enabled = !!isEnabled;
    
    if (!this.enabled) {
      this.events = [];
    }
  }


  // Înregistrează un eveniment de căutare
   
  trackSearch(searchTerm) { //termenul cautat
    if (!this.enabled || !searchTerm) return;
    
    this.trackEvent('search', { term: searchTerm });
  }

  // Înregistrează click pe fotografie
  trackPhotoClick(photoId, photoTitle) {
    if (!this.enabled || !photoId) return;
    
    this.trackEvent('photo_click', { 
      id: photoId,
      title: photoTitle || 'Fără titlu'
    });
  }

  /*
   Înregistrează orice tip de eveniment
  Creează obiect eveniment cu timestamp
Salvează în array local
Loghează în consolă
*/
  trackEvent(eventName, eventData = {}) {
    if (!this.enabled || !eventName) return;
    
    const event = {
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString()
    };
    
    this.events.push(event);
    console.log('Event tracked:', event);
    
  }
}

export default new AnalyticsService();