
//Tun Claudia-Gabriela
// Serviciu  pentru a urmări acțiunile utilizatorului

class AnalyticsService {
  constructor() {
    this.enabled = false; 
    this.events = [];
  }

  //Activeaza sau dezactiveaza serviciului
  setEnabled(isEnabled) {
    this.enabled = !!isEnabled;
    
    if (!this.enabled) {
      this.events = [];
    }
  }


  // Înregistrează un eveniment de căutare
   
  trackSearch(searchTerm) {
    if (!this.enabled || !searchTerm) return;
    
    this.trackEvent('search', { term: searchTerm });
  }

  trackPhotoClick(photoId, photoTitle) {
    if (!this.enabled || !photoId) return;
    
    this.trackEvent('photo_click', { 
      id: photoId,
      title: photoTitle || 'Fără titlu'
    });
  }

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