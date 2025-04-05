import React from 'react';
import { EnvelopeSimple, TwitterLogo, InstagramLogo } from 'phosphor-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-icons">
            <a href="mailto:contact@careerbuddy.com" className="footer-icon email">
              <EnvelopeSimple size={24} weight="bold" />
            </a>
            <a href="https://twitter.com/careerbuddy" className="footer-icon twitter">
              <TwitterLogo size={24} weight="bold" />
            </a>
            <a href="https://instagram.com/careerbuddy" className="footer-icon instagram">
              <InstagramLogo size={24} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
