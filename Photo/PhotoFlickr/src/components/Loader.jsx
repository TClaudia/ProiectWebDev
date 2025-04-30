
// src/components/Loader.jsx
import React from 'react';

class Loader extends React.Component {
  render() {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin-slow"></div>
        <p className="mt-4 text-gray-600">Se încarcă fotografiile...</p>
      </div>
    );
  }
}

export default Loader;