// src/components/PhotoGrid.jsx
import React from 'react';
import PhotoCard from './PhotoCard';
import Loader from './Loader';

class PhotoGrid extends React.Component {
  renderContent() {
    const { photos, loading, error, prevSearch } = this.props;
    
    if (loading) {
      return <Loader />;
    }
    
    if (error) {
      return (
        <div className="text-center text-red-600 py-10">
          {error}
        </div>
      );
    }
    
    if (photos.length > 0) {
      return (
        <>
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-gray-200 text-gray-800">
            Fotografii despre: {prevSearch}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <PhotoCard key={photo.link} photo={photo} />
            ))}
          </div>
        </>
      );
    }
    
    if (prevSearch) {
      return (
        <div className="text-center py-10 text-gray-600">
          Nu s-au găsit fotografii pentru "{prevSearch}"
        </div>
      );
    }
    
    return (
      <div className="text-center py-10 text-gray-600">
        Introduceți un termen de căutare pentru a vedea rezultatele
      </div>
    );
  }

  render() {
    return (
      <section className="bg-white rounded-lg shadow-card p-6">
        {this.renderContent()}
      </section>
    );
  }
}

export default PhotoGrid;
