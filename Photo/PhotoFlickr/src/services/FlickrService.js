// src/services/FlickrService.js
class FlickrService {
  constructor() {
    // Update base URL to use our proxy
    this.baseUrl = '/api/flickr';
  }

  /**
   * Caută fotografii pe Flickr după taguri
   * @param {string} searchTerm - Termenul de căutare pentru taguri
   * @returns {Promise} Promise care rezolvă cu datele despre fotografii
   */
  async searchPhotos(searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      throw new Error('Termenul de căutare nu poate fi gol');
    }

    const encodedTerm = encodeURIComponent(searchTerm.trim());
    const url = `${this.baseUrl}/photos_public.gne?format=json&tags=${encodedTerm}&nojsoncallback=1`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Eroare HTTP: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return this._processPhotosData(data);
    } catch (error) {
      console.error('Eroare la obținerea datelor de la Flickr:', error);
      throw error;
    }
  }

  /**
   * Procesează datele primite de la API pentru a normaliza structura
   * @param {Object} data - Datele primite de la API Flickr
   * @returns {Object} Date procesate și normalizate
   */
  _processPhotosData(data) {
    // Verificăm dacă avem datele așteptate
    if (!data || !data.items || !Array.isArray(data.items)) {
      return { items: [] };
    }

    // Procesăm fiecare fotografie pentru a extrage informații utile
    const processedItems = data.items.map(item => {
      return {
        ...item,
        // Extragem numele autorului din formatul "nobody@flickr.com ("Nume Autor")"
        authorName: this._extractAuthorName(item.author),
        // Formatăm data pentru afișare
        formattedDate: this._formatDate(item.date_taken || item.published)
      };
    });

    return {
      ...data,
      items: processedItems
    };
  }

  /**
   * Extrage numele autorului din string-ul furnizat de API
   * @param {string} authorString - String-ul cu informații despre autor
   * @returns {string} Numele autorului
   */
  _extractAuthorName(authorString) {
    if (!authorString) return 'Autor necunoscut';
    
    const match = authorString.match(/\("(.+?)"\)/);
    return match ? match[1] : 'Autor necunoscut';
  }

  /**
   * Formatează data pentru afișare
   * @param {string} dateString - String-ul cu data
   * @returns {string} Data formatată
   */
  _formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Eroare la formatarea datei:', error);
      return dateString;
    }
  }
}

export default new FlickrService();