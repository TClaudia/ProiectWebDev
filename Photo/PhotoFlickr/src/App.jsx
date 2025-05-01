// src/App.jsx
import React from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import FlickrService from './services/FlickrService';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      loading: false,
      error: null,
      prevSearch: '',
    };
  }

  fetchPhotos = async (searchTerm) => {
    if (!searchTerm || !searchTerm.trim()) return;
    
    this.setState({
      loading: true,
      error: null,
      prevSearch: searchTerm,
    });
    
    try {
      const data = await FlickrService.searchPhotos(searchTerm);
      this.setState({
        photos: data.items || [],
        loading: false
      });
    } catch (err) {
      console.error("Failed to fetch photos:", err);
      this.setState({
        error: "Nu s-au putut încărca fotografiile. Vă rugăm să încercați din nou.",
        photos: [],
        loading: false
      });
    }
  };

  render() {
    const { loading, error, prevSearch } = this.state;
    
    return (
      <div className="app-container">
        <ErrorBoundary>
          <Header />
          <main className="main-content">
            <SearchBar onSearch={this.fetchPhotos} />
            
            {prevSearch ? (
              loading ? (
                <div className="loader-container">
                  <div className="loader"></div>
                  <p>Se încarcă fotografiile...</p>
                </div>
              ) : error ? (
                <div className="results-container">
                  <div className="error-message">{error}</div>
                </div>
              ) : this.state.photos.length > 0 ? (
                <div className="results-container">
                  <h2 className="results-title">Fotografii despre: {prevSearch}</h2>
                  <div className="photo-grid">
                    {this.state.photos.map((photo) => (
                      <div key={photo.link} className="photo-card">
                        <a href={photo.link} target="_blank" rel="noopener noreferrer" className="photo-link">
                          <div className="photo-image-container">
                            <img 
                              src={photo.media.m} 
                              alt={photo.title} 
                              className="photo-image"
                            />
                          </div>
                          <div className="photo-info">
                            <h3 className="photo-title">{photo.title || "Fără titlu"}</h3>
                            <p className="photo-author">
                              De {photo.author.split('(')[1]?.replace(')', '') || "Autor necunoscut"}
                            </p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="results-container">
                  <div className="no-results">
                    Nu s-au găsit fotografii pentru "{prevSearch}"
                  </div>
                </div>
              )
            ) : (
              <div className="results-container">
                <div className="instructions">
                  Introduceți un termen de căutare pentru a vedea rezultatele
                </div>
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