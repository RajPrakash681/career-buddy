import React, { useEffect } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleGoogleSignIn = async () => {
    try {
      const button = document.querySelector('.auth-button.google');
      button?.classList.add('loading');
      
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Successfully signed in:', result.user);
      
      button?.classList.remove('loading');
      button?.classList.add('success');
      
      setTimeout(() => {
        onLoginSuccess?.();
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      const button = document.querySelector('.auth-button.google');
      button?.classList.remove('loading');
      button?.classList.add('error');
      
      setTimeout(() => {
        button?.classList.remove('error');
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-container">
      <div className="form-overlay" onClick={onClose}></div>
      <div className="form">
        <div className="close-button" onClick={onClose}>&times;</div>
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Sign in to continue</p>
        
        <div className="social-auth">
          <button className="auth-button google" onClick={handleGoogleSignIn}>
            <svg viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .5 4.1 1.5l3.1-3.1C17.1 1.6 14.7 0 12 0 7.4 0 3.4 2.7 1.3 6.6l3.7 2.8C6 6.7 8.8 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.2c0-.8-.1-1.7-.3-2.4H12v4.6h6.4c-.3 1.4-1 2.6-2.1 3.4l3.3 2.6c1.9-1.8 3-4.4 3-7.4z"/>
              <path fill="#FBBC05" d="M5 12c0-1.1.2-2.2.6-3.1l-3.7-2.8C1 8.2 0 10 0 12c0 2 .7 3.8 1.9 5.3l3.7-2.8C5.2 14.2 5 13.1 5 12z"/>
              <path fill="#34A853" d="M12 19c-3.2 0-6-2.1-7-5l-3.7 2.8C3.4 20.3 7.4 23 12 23c2.7 0 5-1 6.8-2.7l-3.3-2.6c-1 .6-2.1.9-3.5.9z"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="auth-separator">
            <span>or</span>
          </div>

          <button className="auth-button github">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.8-.3-5.7-1.4-5.7-6.2 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.6 3.3-1.2 3.3-1.2.7 1.7.2 2.9.1 3.2.8.9 1.2 2 1.2 3.4 0 4.8-2.9 5.9-5.7 6.2.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6C20.6 21.8 24 17.3 24 12c0-6.6-5.4-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="agreement">
          By continuing, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
