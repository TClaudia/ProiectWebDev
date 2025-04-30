// src/components/SearchBar.jsx
import React from 'react';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    };
  }

  handleInputChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSearch(this.state.searchTerm);
  };

  render() {
    return (
      <div className="my-8">
        <form onSubmit={this.handleSubmit} className="max-w-xl mx-auto">
          <div className="flex shadow-md rounded-lg overflow-hidden">
            <input
              type="text"
              value={this.state.searchTerm}
              onChange={this.handleInputChange}
              placeholder="Introduceți termenul de căutare..."
              className="flex-grow px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Termen de căutare"
            />
            <button 
              type="submit" 
              className="bg-primary text-white px-6 py-3 flex items-center transition-colors hover:bg-primary-dark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Caută
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default SearchBar;