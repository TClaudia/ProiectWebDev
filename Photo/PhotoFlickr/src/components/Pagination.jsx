// src/components/Pagination.jsx
import React from 'react';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  componentDidUpdate(prevProps) {
    // Resetăm pagina curentă când se schimbă totalul de elemente
    if (prevProps.totalItems !== this.props.totalItems) {
      this.setState({ currentPage: 1 });
      this.props.onPageChange(1);
    }
  }

  handlePageChange = (newPage) => {
    this.setState({ currentPage: newPage });
    this.props.onPageChange(newPage);
    
    // Derulare în sus pentru a vedea rezultatele
    window.scrollTo({
      top: this.props.scrollToRef?.current?.offsetTop || 0,
      behavior: 'smooth'
    });
  }

  render() {
    const { totalItems, itemsPerPage } = this.props;
    const { currentPage } = this.state;
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
      return null;
    }
    
    // Determinăm paginile de afișat
    let pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Afișăm toate paginile
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Afișăm un subset de pagini
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    
    return (
      <div className="flex justify-center items-center mt-8 py-4">
        <button 
          className="h-10 w-10 flex items-center justify-center rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
          onClick={() => this.handlePageChange(currentPage - 1)}
          aria-label="Pagina anterioară"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <div className="flex">
          {pages.map((page, index) => (
            page === '...' ? (
              <span 
                key={`ellipsis-${index}`} 
                className="h-10 w-10 flex items-center justify-center border-t border-b border-gray-300 bg-white text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`h-10 w-10 flex items-center justify-center border border-l-0 ${
                  currentPage === page
                    ? 'bg-primary text-white font-medium border-primary'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
                onClick={() => this.handlePageChange(page)}
                aria-label={`Pagina ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          ))}
        </div>
        
        <button 
          className="h-10 w-10 flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
          onClick={() => this.handlePageChange(currentPage + 1)}
          aria-label="Pagina următoare"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    );
  }
}

export default Pagination;