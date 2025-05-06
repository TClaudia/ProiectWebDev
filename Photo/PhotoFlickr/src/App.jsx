import { useState, useEffect } from 'react';
import { Search, Camera, Image, ChevronDown, Filter, RefreshCw } from 'lucide-react';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [prevSearch, setPrevSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    sortBy: 'relevance',
    contentType: 'all'
  });
  const [tempFilterOptions, setTempFilterOptions] = useState({
    sortBy: 'relevance',
    contentType: 'all'
  });
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('flickrSearchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const saveToHistory = (term) => {
    if (!term) return;
    
    const updatedHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem('flickrSearchHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('flickrSearchHistory');
  };

  // JSONP implementation to handle CORS
  const fetchFlickrJSONP = (term) => {
    return new Promise((resolve, reject) => {
      // Clean up any previous JSONP script tags
      const oldScript = document.getElementById('flickr-jsonp-script');
      if (oldScript) {
        document.head.removeChild(oldScript);
      }

      // Create a unique callback name
      const callbackName = `flickrJsonpCallback_${Date.now()}`;
      
      // Create the global callback function
      window[callbackName] = (data) => {
        // Clean up
        delete window[callbackName];
        const script = document.getElementById('flickr-jsonp-script');
        if (script) {
          document.head.removeChild(script);
        }
        
        resolve(data);
      };

      // Build the URL
      const encodedTerm = encodeURIComponent(term.trim());
      const url = `https://www.flickr.com/services/feeds/photos_public.gne?format=json&tags=${encodedTerm}&jsoncallback=${callbackName}`;
      
      // Create script element
      const script = document.createElement('script');
      script.src = url;
      script.id = 'flickr-jsonp-script';
      script.type = 'text/javascript';
      script.async = true;
      
      // Handle errors
      script.onerror = () => {
        // Clean up
        delete window[callbackName];
        if (document.getElementById('flickr-jsonp-script')) {
          document.head.removeChild(document.getElementById('flickr-jsonp-script'));
        }
        reject(new Error('Failed to load Flickr data'));
      };
      
      // Add the script to the page
      document.head.appendChild(script);
      
      // Set a timeout in case the request hangs
      setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          if (document.getElementById('flickr-jsonp-script')) {
            document.head.removeChild(document.getElementById('flickr-jsonp-script'));
          }
          reject(new Error('Request timeout'));
        }
      }, 10000); // 10 seconds timeout
    });
  };

  const searchPhotos = async (term) => {
    if (!term.trim()) return;
    
    setLoading(true);
    setError(null);
    setPrevSearch(term);
    saveToHistory(term);
    
    try {
      // Use our JSONP implementation
      const data = await fetchFlickrJSONP(term);
      
      // Apply sorting based on filter options
      let sortedItems = [...(data.items || [])];
      
      if (filterOptions.sortBy === 'date-desc') {
        sortedItems.sort((a, b) => new Date(b.published) - new Date(a.published));
      } else if (filterOptions.sortBy === 'date-asc') {
        sortedItems.sort((a, b) => new Date(a.published) - new Date(b.published));
      }
      
      // Apply content filtering
      if (filterOptions.contentType !== 'all') {
        // This is just a simulation since the Flickr API doesn't provide content type filtering
        // In a real app, you would use the API's filtering capabilities
        if (filterOptions.contentType === 'photos-only') {
          // No filtering needed as they're all photos
        } else if (filterOptions.contentType === 'screenshots') {
          sortedItems = sortedItems.filter(item => item.tags.includes('screenshot'));
        }
      }
      
      setPhotos(sortedItems);
    } catch (err) {
      console.error('Failed to fetch photos:', err);
      setError('Nu s-au putut încărca fotografiile. Vă rugăm să încercați din nou.');
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPhotos(searchTerm);
  };

  const handleFilterChange = (e) => {
    setTempFilterOptions({
      ...tempFilterOptions,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    setFilterOptions(tempFilterOptions);
    if (prevSearch) {
      searchPhotos(prevSearch);
    }
  };

  const resetFilters = () => {
    const defaultOptions = {
      sortBy: 'relevance',
      contentType: 'all'
    };
    setTempFilterOptions(defaultOptions);
    setFilterOptions(defaultOptions);
    if (prevSearch) {
      searchPhotos(prevSearch);
    }
  };

  const extractAuthorName = (author) => {
    const match = author.match(/\("(.+?)"\)/);
    return match ? match[1] : "Autor necunoscut";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Camera className="h-8 w-8 mr-3" />
            <h1 className="text-3xl font-bold">Flickr Photo Search</h1>
          </div>
          <p className="text-center mt-2 text-blue-100 opacity-90">Descoperiți fotografii uimitoare din comunitatea Flickr</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <form onSubmit={handleSubmit} className="flex shadow-lg rounded-lg overflow-hidden">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Căutați fotografii..."
                className="w-full py-4 px-6 text-lg focus:outline-none border-0"
                aria-label="Termen de căutare"
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center transition-colors"
              >
                <Search className="h-5 w-5 mr-2" />
                Caută
              </button>
            </form>
          </div>

          {searchHistory.length > 0 && (
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="mr-2">Căutări recente:</span>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button 
                    key={index} 
                    onClick={() => {
                      setSearchTerm(term);
                      searchPhotos(term);
                    }}
                    className="bg-white border border-gray-200 hover:bg-gray-50 rounded-full px-3 py-1 text-gray-700 text-xs flex items-center"
                  >
                    {term}
                  </button>
                ))}
                <button 
                  onClick={clearHistory}
                  className="text-red-500 hover:text-red-700 text-xs ml-2"
                >
                  Șterge
                </button>
              </div>
            </div>
          )}

          <div className="mt-6">
            <button 
              className="flex items-center text-gray-600 hover:text-blue-600 text-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtre și sortare
              <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {showFilters && (
              <div className="mt-3 p-4 bg-white rounded-lg shadow-md border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                      Sortare după:
                    </label>
                    <select 
                      id="sortBy" 
                      name="sortBy"
                      value={tempFilterOptions.sortBy}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="relevance">Relevanță</option>
                      <option value="date-desc">Data (recent)</option>
                      <option value="date-asc">Data (vechi)</option>
                      <option value="interestingness">Interes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">
                      Conținut:
                    </label>
                    <select 
                      id="contentType" 
                      name="contentType"
                      value={tempFilterOptions.contentType}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Toate fotografiile</option>
                      <option value="photos-only">Doar fotografii</option>
                      <option value="screenshots">Capturi de ecran</option>
                      <option value="other">Altele</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between">
                  <button 
                    className="text-sm flex items-center text-gray-600 hover:text-blue-600"
                    onClick={resetFilters}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Resetare filtre
                  </button>
                  
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={applyFilters}
                  >
                    Aplică filtre
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Se încarcă fotografiile...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
              {error}
            </div>
          ) : photos.length > 0 ? (
            <div>
              <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">
                {photos.length} fotografii pentru: "{prevSearch}"
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map((photo) => (
                  <div key={photo.link} className="group bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <a href={photo.link} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={photo.media.m} 
                          alt={photo.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {photo.title || "Fără titlu"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <span className="w-4 h-4 bg-gray-200 rounded-full mr-2 flex-shrink-0 overflow-hidden">
                            {/* Placeholder for author avatar */}
                          </span>
                          {extractAuthorName(photo.author)}
                        </p>
                        {photo.tags && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {photo.tags.split(' ').slice(0, 3).map(tag => (
                              <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                            {photo.tags.split(' ').length > 3 && (
                              <span className="text-xs text-gray-400">+{photo.tags.split(' ').length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : prevSearch ? (
            <div className="text-center py-16">
              <Image className="h-16 w-16 mx-auto text-gray-300" />
              <p className="mt-4 text-gray-600">Nu s-au găsit fotografii pentru "{prevSearch}"</p>
              <p className="mt-2 text-gray-500 text-sm">Încercați alt termen de căutare</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <Camera className="h-16 w-16 mx-auto text-gray-300" />
              <p className="mt-4 text-gray-600">Introduceți un termen de căutare pentru a vedea fotografii</p>
              <p className="mt-2 text-gray-500 text-sm">Exemplu: natură, arhitectură, călătorii</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© {new Date().getFullYear()} Aplicație de Căutare Flickr</p>
          <p className="text-gray-400 text-sm">
            Utilizează <a href="https://www.flickr.com/services/feeds/docs/photos_public/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 underline">
              API-ul public Flickr
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;