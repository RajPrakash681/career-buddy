import React from 'react';
import { SignOut, User } from 'phosphor-react';
import { auth } from '../config/firebase';

const UserInfo = () => {
  const user = auth.currentUser;

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div className="user-info">
      <div className="user-profile">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Profile" className="user-avatar" />
        ) : (
          <User size={24} className="user-avatar-fallback" />
        )}
        <div className="user-details">
          <span className="user-name">{user?.displayName || 'Guest'}</span>
          <button onClick={handleSignOut} className="sign-out-button">
            <SignOut size={16} /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
