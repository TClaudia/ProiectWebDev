// src/services/FlickrJSONPService.js

/**
 * Service for fetching Flickr photos using JSONP to avoid CORS issues
 */
class FlickrJSONPService {
  constructor() {
    this.baseUrl = 'https://www.flickr.com/services/feeds/photos_public.gne';
    this.callbackName = null;
  }

  /**
   * Creates a script tag to load JSONP
   * @param {string} url - URL to fetch
   * @param {string} callbackName - Name of the callback function
   * @returns {HTMLElement} Script element
   */
  createScriptTag(url, callbackName) {
    const script = document.createElement('script');
    script.src = `${url}&jsoncallback=${callbackName}`;
    script.type = 'text/javascript';
    script.async = true;
    script.id = 'flickr-jsonp-script';
    return script;
  }

  /**
   * Removes a script tag by ID
   * @param {string} id - ID of the script tag to remove
   */
  removeScriptTag(id) {
    const script = document.getElementById(id);
    if (script) {
      document.head.removeChild(script);
    }
  }

  /**
   * Search photos using JSONP technique
   * @param {string} searchTerm - Search term to look for
   * @returns {Promise} Promise that resolves with photo data
   */
  searchPhotos(searchTerm) {
    return new Promise((resolve, reject) => {
      // Clean up any previous JSONP script tags
      this.removeScriptTag('flickr-jsonp-script');

      if (!searchTerm || !searchTerm.trim()) {
        reject(new Error('Termenul de căutare nu poate fi gol'));
        return;
      }

      // Create a unique callback name
      this.callbackName = `flickrJsonpCallback_${Date.now()}`;
      
      // Create the global callback function
      window[this.callbackName] = (data) => {
        // Clean up
        delete window[this.callbackName];
        this.removeScriptTag('flickr-jsonp-script');
        
        // Process and resolve data
        try {
          const processedData = this._processPhotosData(data);
          resolve(processedData);
        } catch (error) {
          reject(error);
        }
      };

      // Build the URL
      const encodedTerm = encodeURIComponent(searchTerm.trim());
      const url = `${this.baseUrl}?format=json&tags=${encodedTerm}`;
      
      // Create and append the script tag
      const script = this.createScriptTag(url, this.callbackName);
      
      // Handle errors
      script.onerror = () => {
        // Clean up
        delete window[this.callbackName];
        this.removeScriptTag('flickr-jsonp-script');
        reject(new Error('Failed to load Flickr data'));
      };
      
      // Add the script to the page
      document.head.appendChild(script);
      
      // Set a timeout in case the request hangs
      setTimeout(() => {
        if (window[this.callbackName]) {
          delete window[this.callbackName];
          this.removeScriptTag('flickr-jsonp-script');
          reject(new Error('Request timeout'));
        }
      }, 10000); // 10 seconds timeout
    });
  }

  /**
   * Process data received from Flickr API
   * @param {Object} data - Raw data from Flickr
   * @returns {Object} Processed data
   */
  _processPhotosData(data) {
    // Check if we have expected data
    if (!data || !data.items || !Array.isArray(data.items)) {
      return { items: [] };
    }

    // Process each photo to extract useful information
    const processedItems = data.items.map(item => {
      return {
        ...item,
        // Extract author name from format "nobody@flickr.com ("Author Name")"
        authorName: this._extractAuthorName(item.author),
        // Format date for display
        formattedDate: this._formatDate(item.date_taken || item.published)
      };
    });

    return {
      ...data,
      items: processedItems
    };
  }

  /**
   * Extract author name from string provided by API
   * @param {string} authorString - String with author info
   * @returns {string} Author name
   */
  _extractAuthorName(authorString) {
    if (!authorString) return 'Autor necunoscut';
    
    const match = authorString.match(/\("(.+?)"\)/);
    return match ? match[1] : 'Autor necunoscut';
  }

  /**
   * Format date for display
   * @param {string} dateString - Date string
   * @returns {string} Formatted date
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
      console.error('Error formatting date:', error);
      return dateString;
    }
  }
}

export default new FlickrJSONPService();