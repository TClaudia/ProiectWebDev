

// src/components/Footer.jsx
import React from 'react';

class Footer extends React.Component {
  render() {
    return (
      <footer className="bg-primary-dark text-white py-5 mt-10">
        <div className="container-app text-center">
          <p className="mb-2">© {new Date().getFullYear()} Aplicație de Căutare Flickr</p>
          <p className="text-blue-200 text-sm">
            Utilizează <a href="https://www.flickr.com/services/feeds/docs/photos_public/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="underline hover:text-white">
              API-ul public Flickr
            </a>
          </p>
        </div>
      </footer>
    );
  }
}

export default Footer;