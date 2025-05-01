
// src/services/AnalyticsService.js
/**
 * Serviciu simplu pentru a urmări acțiunile utilizatorului
 * Într-o aplicație reală, acesta ar putea integra Google Analytics sau alt serviciu
 */
class AnalyticsService {
  constructor() {
    this.enabled = false; // Dezactivat implicit pentru respectarea confidențialității
    this.events = [];
  }

  /**
   * Activează sau dezactivează urmărirea
   * @param {boolean} isEnabled - Dacă urmărirea este activată
   */
  setEnabled(isEnabled) {
    this.enabled = !!isEnabled;
    
    if (!this.enabled) {
      // Șterge toate evenimentele când este dezactivat
      this.events = [];
    }
  }

  /**
   * Înregistrează un eveniment de căutare
   * @param {string} searchTerm - Termenul căutat
   */
  trackSearch(searchTerm) {
    if (!this.enabled || !searchTerm) return;
    
    this.trackEvent('search', { term: searchTerm });
  }

  /**
   * Înregistrează un eveniment de click pe fotografie
   * @param {string} photoId - ID-ul fotografiei
   * @param {string} photoTitle - Titlul fotografiei
   */
  trackPhotoClick(photoId, photoTitle) {
    if (!this.enabled || !photoId) return;
    
    this.trackEvent('photo_click', { 
      id: photoId,
      title: photoTitle || 'Fără titlu'
    });
  }

  /**
   * Înregistrează orice tip de eveniment
   * @param {string} eventName - Numele evenimentului
   * @param {Object} eventData - Date asociate evenimentului
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
    
    // Aici s-ar putea trimite către un serviciu real de analytics
  }
}

export default new AnalyticsService();