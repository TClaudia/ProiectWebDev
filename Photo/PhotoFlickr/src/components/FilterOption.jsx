// src/components/FilterOptions.jsx
import React from 'react';

class FilterOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      selectedSortOption: 'relevance',
      selectedContentFilter: 'all'
    };
  }

  toggleExpand = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  }

  handleSortChange = (e) => {
    const value = e.target.value;
    this.setState({ selectedSortOption: value });
    this.props.onSortChange(value);
  }

  handleFilterChange = (e) => {
    const value = e.target.value;
    this.setState({ selectedContentFilter: value });
    this.props.onFilterChange(value);
  }

  render() {
    const { isExpanded, selectedSortOption, selectedContentFilter } = this.state;
    
    return (
      <div className="mb-6">
        <button 
          className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          onClick={this.toggleExpand}
          aria-expanded={isExpanded}
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filtrare și sortare
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        
        {isExpanded && (
          <div className="mt-2 bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="sort-options" className="block text-sm font-medium text-gray-700">
                  Sortare după:
                </label>
                <select 
                  id="sort-options" 
                  value={selectedSortOption}
                  onChange={this.handleSortChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="relevance">Relevanță</option>
                  <option value="date-desc">Data (recent)</option>
                  <option value="date-asc">Data (vechi)</option>
                  <option value="interestingness">Interes</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content-filter" className="block text-sm font-medium text-gray-700">
                  Conținut:
                </label>
                <select 
                  id="content-filter" 
                  value={selectedContentFilter}
                  onChange={this.handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-primary focus:border-primary text-sm"
                >
                  <option value="all">Toate fotografiile</option>
                  <option value="photos-only">Doar fotografii</option>
                  <option value="screenshots">Capturi de ecran</option>
                  <option value="other">Altele</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                className="text-sm bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                onClick={this.props.onResetFilters}
              >
                Resetare filtre
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FilterOptions;

