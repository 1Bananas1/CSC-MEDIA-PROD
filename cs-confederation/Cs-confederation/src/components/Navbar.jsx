// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-800 text-white fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-start items-center h-16 space-x-4">
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-md transition-colors ${
              location.pathname === '/' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/matches" 
            className={`px-4 py-2 rounded-md transition-colors ${
              location.pathname === '/matches' ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            Matches
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;