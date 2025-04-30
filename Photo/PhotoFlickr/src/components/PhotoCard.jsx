
// src/components/PhotoCard.jsx
import React from 'react';
import PhotoDetails from './PhotoDetails';

class PhotoCard extends React.Component {
  extractAuthorName(author) {
    const match = author.match(/\("(.+?)"\)/);
    return match ? match[1] : "Autor necunoscut";
  }

  formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ro-RO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Eroare la formatarea datei:', error);
      return '';
    }
  }

  render() {
    const { photo } = this.props;
    const authorName = this.extractAuthorName(photo.author);
    const dateTaken = this.formatDate(photo.date_taken || photo.published);
    
    return (
      <div className="group bg-white rounded-lg overflow-hidden shadow-card transition-all hover:shadow-lg hover:-translate-y-1 relative">
        <a href={photo.link} target="_blank" rel="noopener noreferrer" className="block">
          <div className="h-48 overflow-hidden">
            <img 
              src={photo.media.m} 
              alt={photo.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium text-sm truncate">
              {photo.title || "Fără titlu"}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              De {authorName}
            </p>
            {dateTaken && (
              <p className="text-xs text-gray-400 mt-1">
                {dateTaken}
              </p>
            )}
          </div>
        </a>
        <PhotoDetails photo={photo} />
      </div>
    );
  }
}

export default PhotoCard;