//Chiriliuc Laura
class FlickrService {
  constructor() {
    this.baseUrl = '/api/flickr';
  }


   //Caută fotografii pe Flickr după taguri

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

  // Procesează datele primite de la API 
  _processPhotosData(data) {
    if (!data || !data.items || !Array.isArray(data.items)) {
      return { items: [] };
    }
    const processedItems = data.items.map(item => {
      return {
        ...item,
        authorName: this._extractAuthorName(item.author),
        formattedDate: this._formatDate(item.date_taken || item.published)
      };
    });

    return {
      ...data,
      items: processedItems
    };
  }


   // Extrage numele autorului din string-ul furnizat de API
   
  _extractAuthorName(authorString) {
    if (!authorString) return 'Autor necunoscut';
    
    const match = authorString.match(/\("(.+?)"\)/);
    return match ? match[1] : 'Autor necunoscut';
  }


   // Formatează data pentru afișare
  
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