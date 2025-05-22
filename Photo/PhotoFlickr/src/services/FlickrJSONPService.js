//Tun Claudia-Gabriela


// Service for fetching Flickr photos using JSONP to avoid CORS issues

class FlickrJSONPService {
  constructor() {
    this.baseUrl = 'https://www.flickr.com/services/feeds/photos_public.gne';
    this.callbackName = null;
  }

  
  // Crearea script de incarcare
  createScriptTag(url, callbackName) {
    const script = document.createElement('script');
    script.src = `${url}&jsoncallback=${callbackName}`;
    script.type = 'text/javascript';
    script.async = true;
    script.id = 'flickr-jsonp-script';
    return script;
  }

  
  //Sterge un script dupa ID
  removeScriptTag(id) {
    const script = document.getElementById(id);
    if (script) {
      document.head.removeChild(script);
    }
  }

  
  // Cautare forografii
  
  searchPhotos(searchTerm) {
    return new Promise((resolve, reject) => {
      this.removeScriptTag('flickr-jsonp-script');

      if (!searchTerm || !searchTerm.trim()) {
        reject(new Error('Termenul de căutare nu poate fi gol'));
        return;
      }

      this.callbackName = `flickrJsonpCallback_${Date.now()}`;
      window[this.callbackName] = (data) => {
        delete window[this.callbackName];
        this.removeScriptTag('flickr-jsonp-script');
        
        try {
          const processedData = this._processPhotosData(data);
          resolve(processedData);
        } catch (error) {
          reject(error);
        }
      };

      const encodedTerm = encodeURIComponent(searchTerm.trim());
      const url = `${this.baseUrl}?format=json&tags=${encodedTerm}`;
    
      const script = this.createScriptTag(url, this.callbackName);
      
      script.onerror = () => {
        delete window[this.callbackName];
        this.removeScriptTag('flickr-jsonp-script');
        reject(new Error('Failed to load Flickr data'));
      };

      document.head.appendChild(script);
  
      setTimeout(() => {
        if (window[this.callbackName]) {
          delete window[this.callbackName];
          this.removeScriptTag('flickr-jsonp-script');
          reject(new Error('Request timeout'));
        }
      }, 10000); // 10 sec
    });
  }

  
   // Procesare date din Flickr
   
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

  
  //Extrage numele autorului 
  
  _extractAuthorName(authorString) {
    if (!authorString) return 'Autor necunoscut';
    
    const match = authorString.match(/\("(.+?)"\)/);
    return match ? match[1] : 'Autor necunoscut';
  }

  // Formateaza data
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
      console.error('Error formatting date:', error);
      return dateString;
    }
  }
}

export default new FlickrJSONPService();