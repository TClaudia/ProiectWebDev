
// src/components/SearchHistory.jsx
import React from 'react';

class SearchHistory extends React.Component {
  render() {
    const { history, onSelectTerm, onClearHistory } = this.props;
    
    if (!history || history.length === 0) {
      return null;
    }
    
    return (
      <div className="bg-gray-100 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium text-gray-600">Căutări recente</h3>
          <button 
            onClick={onClearHistory} 
            className="text-xs text-red-600 hover:text-red-800 py-1 px-2 rounded hover:bg-red-100 transition-colors"
          >
            Șterge istoricul
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {history.map((term, index) => (
            <button 
              key={index}
              onClick={() => onSelectTerm(term)}
              className="bg-white border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default SearchHistory;