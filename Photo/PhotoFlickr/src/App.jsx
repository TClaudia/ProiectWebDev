// src/App.jsx
import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import FilterOptions from './components/FilterOptions';
import PhotoGrid from './components/PhotoGrid';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import FlickrService from './services/FlickrService';
import StorageService from './services/StorageService';
import AnalyticsService from './services/AnalyticsService';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      loading: false,
      error: null,
      prevSearch: '',
      searchHistory: [],
      currentPage: 1,
      itemsPerPage: 12,
      sortOption: 'relevance',
      contentFilter: 'all'
    };
    
    // Referințe
    this.resultsRef = React.createRef();
  }

  componentDidMount() {
    // Încărcăm istoricul căutărilor
    const history = StorageService.getSearchHistory();
    this.setState({ searchHistory: history });
    
    // Activăm serviciul de analitică dacă utilizatorul a consimțit
    const analyticsEnabled = localStorage.getItem('analytics_enabled') === 'true';
    AnalyticsService.setEnabled(analyticsEnabled);
  }

  fetchPhotos = async (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return;
    
    this.setState({
      loading: true,
      error: null,
      prevSearch: searchTerm,
      currentPage: 1
    });
    
    try {
      const data = await FlickrService.searchPhotos(searchTerm);
      this.setState({
        photos: data.items || [],
        loading: false
      });
      
      // Salvăm termenul de căutare în istoric
      StorageService.saveSearchTerm(searchTerm);
      this.updateSearchHistory();
      
      // Tracking analitică
      AnalyticsService.trackSearch(searchTerm);
    } catch (err) {
      console.error("Failed to fetch photos:", err);
      this.setState({
        error: "Nu s-au putut încărca fotografiile. Vă rugăm să încercați din nou.",
        photos: [],
        loading: false
      });
    }
  };

  updateSearchHistory = () => {
    const history = StorageService.getSearchHistory();
    this.setState({ searchHistory: history });
  };

  handleHistoryTermSelect = (term) => {
    this.fetchPhotos(term);
  };

  handleClearHistory = () => {
    StorageService.clearSearchHistory();
    this.setState({ searchHistory: [] });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSortChange = (sortOption) => {
    this.setState({ sortOption });
    // Implementăm logica de sortare a fotografiilor
    this.sortPhotos(sortOption);
  };

  handleFilterChange = (contentFilter) => {
    this.setState({ contentFilter });
    // Implementăm logica de filtrare a fotografiilor
  };

  handleResetFilters = () => {
    this.setState({
      sortOption: 'relevance',
      contentFilter: 'all'
    });
    
    // Resetăm fotografiile la starea inițială
    if (this.state.prevSearch) {
      this.fetchPhotos(this.state.prevSearch);
    }
  };

  sortPhotos = (sortOption) => {
    const { photos } = this.state;
    let sortedPhotos = [...photos];
    
    switch (sortOption) {
      case 'date-desc':
        sortedPhotos.sort((a, b) => new Date(b.date_taken || b.published) - new Date(a.date_taken || a.published));
        break;
      case 'date-asc':
        sortedPhotos.sort((a, b) => new Date(a.date_taken || a.published) - new Date(b.date_taken || b.published));
        break;
      case 'interestingness':
        // În lipsa unui criteriu de interestingness real, simulăm cu o sortare după lungimea titlului
        sortedPhotos.sort((a, b) => (b.title?.length || 0) - (a.title?.length || 0));
        break;
      default:
        // relevance - păstrăm ordinea originală de la API
        break;
    }
    
    this.setState({ photos: sortedPhotos });
  };

  getCurrentPhotos = () => {
    const { photos, currentPage, itemsPerPage, contentFilter } = this.state;
    
    // Aplicăm filtrarea înainte de paginare
    let filteredPhotos = [...photos];
    
    if (contentFilter !== 'all') {
      // Implementare simplă de filtrare bazată pe taguri sau titlu
      filteredPhotos = filteredPhotos.filter(photo => {
        const allText = `${photo.title} ${photo.tags}`.toLowerCase();
        
        switch(contentFilter) {
          case 'photos-only':
            return !allText.includes('screenshot') && !allText.includes('capture');
          case 'screenshots':
            return allText.includes('screenshot') || allText.includes('capture');
          default:
            return true;
        }
      });
    }
    
    // Calculăm indexul de start și final pentru paginare
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Returnăm subsetul de fotografii pentru pagina curentă
    return filteredPhotos.slice(startIndex, endIndex);
  };

  render() {
    const { 
      photos, 
      loading, 
      error, 
      prevSearch,
      searchHistory,
      itemsPerPage,
    } = this.state;
    
    // Obținem subsetul de fotografii pentru pagina curentă
    const currentPhotos = this.getCurrentPhotos();
    
    return (
      <div className="min-h-screen flex flex-col">
        <ErrorBoundary>
          <Header />
          <main className="flex-grow container-app py-6">
            <SearchBar onSearch={this.fetchPhotos} />
            
            {searchHistory.length > 0 && (
              <SearchHistory 
                history={searchHistory} 
                onSelectTerm={this.handleHistoryTermSelect}
                onClearHistory={this.handleClearHistory}
              />
            )}
            
            {prevSearch && (
              <div ref={this.resultsRef}>
                <FilterOptions 
                  onSortChange={this.handleSortChange}
                  onFilterChange={this.handleFilterChange}
                  onResetFilters={this.handleResetFilters}
                />
                
                <PhotoGrid 
                  photos={currentPhotos} 
                  loading={loading} 
                  error={error} 
                  prevSearch={prevSearch} 
                />
                
                {!loading && !error && photos.length > itemsPerPage && (
                  <Pagination 
                    totalItems={photos.length} 
                    itemsPerPage={itemsPerPage}
                    onPageChange={this.handlePageChange}
                    scrollToRef={this.resultsRef}
                  />
                )}
              </div>
            )}
          </main>
          <Footer />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;