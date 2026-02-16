import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check login status
  const isAdminLoggedIn = localStorage.getItem('adminToken');

  // Dashboard par bhejne ke liye
  const handleAdminClick = () => {
    setIsOpen(false);
    navigate('/ppl-admin-secret-2026');
  };

  // Logout function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('adminToken');
      setIsOpen(false);
      navigate('/'); // Logout ke baad seedha Home par
    }
  };

  return (
    <nav className="bg-white border-b-2 border-orange-500 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo aur Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full border-2 border-orange-500 flex items-center justify-center">
                <img src={assets.logo} alt="PPL" className="w-full h-full object-cover rounded-[50%]" onError={(e) => e.target.src = "https://via.placeholder.com/50?text=PPL"} />
              </div>
              <div className="flex flex-col">
                <span className="text-[#1a237e] font-black text-lg leading-none uppercase">PINDRAI PREMIER LEAGUE</span>
                <span className="text-orange-600 font-bold text-[10px] tracking-widest uppercase">SEASON 4.0 | 2026</span>
              </div>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6 font-bold text-sm">
            <Link to="/" className="text-gray-700 hover:text-blue-800 transition">HOME</Link>
            <Link to="/players-list-ppl" className="text-gray-700 hover:text-blue-800 transition uppercase">Registered Players</Link>
            
            {/* Conditional Desktop Buttons */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleAdminClick}
                  className="px-4 py-1.5 rounded-lg border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition flex items-center gap-1"
                >
                  DASHBOARD
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link to="/admin-login" className="border-2 border-blue-900 text-[#1a237e] px-4 py-1.5 rounded-lg hover:bg-[#1a237e] hover:text-white transition uppercase">
                Admin
              </Link>
            )}

            <Link to="" className="bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-700 transition shadow-md shadow-orange-200">
              REGISTRATION CLOSED 
            </Link>
          </div>

          {/* Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 space-y-4 shadow-inner">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-800 font-bold">HOME</Link>
          <Link to="/players-list-ppl" onClick={() => setIsOpen(false)} className="block text-gray-800 font-bold uppercase">Players List</Link>
          
          {/* Conditional Mobile Links */}
          {isAdminLoggedIn ? (
            <>
              <div onClick={handleAdminClick} className="block text-green-600 font-black cursor-pointer uppercase tracking-tighter">
                ✅ Open Dashboard
              </div>
              <div onClick={handleLogout} className="block text-red-600 font-black cursor-pointer uppercase tracking-tighter">
                ❌ Logout Session
              </div>
            </>
          ) : (
            <Link to="/admin-login" onClick={() => setIsOpen(false)} className="block text-[#1a237e] font-black uppercase tracking-tighter">
              🔑 Admin Login
            </Link>
          )}

          <Link to="" onClick={() => setIsOpen(false)} className="block bg-orange-600 text-white text-center py-2 rounded-lg font-bold">
            REGISTRATION CLOSED
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
