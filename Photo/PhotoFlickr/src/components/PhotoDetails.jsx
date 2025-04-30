

// src/components/PhotoDetails.jsx
import React from 'react';

class PhotoDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggleDetails = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape' && this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  stopPropagation = (e) => {
    e.stopPropagation();
  }

  render() {
    const { photo } = this.props;
    const { isOpen } = this.state;
    
    if (!photo) return null;
    
    // Formatare dată
    const dateTaken = photo.date_taken ? new Date(photo.date_taken).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Dată necunoscută';

    return (
      <>
        <button 
          onClick={this.toggleDetails} 
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          aria-label="Vezi detalii fotografie"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </button>
        
        {isOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={this.toggleDetails}>
            <div className="bg-white rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row" onClick={this.stopPropagation}>
              <button 
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 hover:bg-white z-10"
                onClick={this.toggleDetails}
              >
                ×
              </button>
              
              <div className="md:w-3/5 bg-gray-100 flex items-center justify-center p-4 md:p-6">
                <img 
                  src={photo.media.m.replace('_m', '_b')} 
                  alt={photo.title} 
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>
              
              <div className="md:w-2/5 p-4 md:p-6 overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{photo.title || "Fără titlu"}</h2>
                
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Autor:</span>
                  <span className="text-gray-800">{photo.author.split('(')[1]?.replace(')', '') || "Autor necunoscut"}</span>
                </div>
                
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Data:</span>
                  <span className="text-gray-800">{dateTaken}</span>
                </div>
                
                {photo.tags && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Etichete:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {photo.tags.split(' ').map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {photo.description && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-600 block mb-1">Descriere:</span>
                    <div 
                      className="text-gray-800 text-sm prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: photo.description }} 
                    />
                  </div>
                )}
                
                <a 
                  href={photo.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block bg-primary text-white px-4 py-2 rounded mt-2 hover:bg-primary-dark transition-colors"
                >
                  Vezi pe Flickr
                </a>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default PhotoDetails;