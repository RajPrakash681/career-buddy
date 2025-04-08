import React from 'react';
import ShareMenu from './ShareMenu';
import UserInfo from './UserInfo';
import { auth } from '../config/firebase';

const Navbar = () => {
  const user = auth.currentUser;

  return (
    <nav className="dashboard-nav">
      <div className="nav-left">
        <a href="/" className="logo">Xtent</a>
      </div>
      
      <div className="nav-center">
        <ul className="nav-links">
          <li><a href="/features" className="nav-link">Features</a></li>
          <li><a href="/pricing" className="nav-link">Pricing</a></li>
          <li><a href="/about" className="nav-link">About</a></li>
        </ul>
      </div>
      
      <div className="nav-right">
        <ShareMenu />
        <div className="nav-divider"></div>
        {user ? <UserInfo /> : (
          <button 
            onClick={() => window.location.href = '/login'} 
            className="login-button"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;