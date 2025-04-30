// src/components/Header.jsx
import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <header className="bg-primary-dark text-white py-6 shadow-md">
        <div className="container-app text-center">
          <h1 className="text-3xl font-bold mb-2">Căutare de Fotografii Flickr</h1>
          <p className="text-sm text-blue-200">Găsește fotografii minunate din comunitatea Flickr</p>
        </div>
      </header>
    );
  }
}

export default Header;



