import React, { useState } from 'react';
import { Share, WhatsappLogo, LinkedinLogo, InstagramLogo } from 'phosphor-react';

const ShareMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = window.location.href;

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <WhatsappLogo size={24} />,
      url: `whatsapp://send?text=Check out Career Buddy! ${shareUrl}`
    },
    {
      name: 'LinkedIn',
      icon: <LinkedinLogo size={24} />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Instagram',
      icon: <InstagramLogo size={24} />,
      url: `https://www.instagram.com/share?url=${encodeURIComponent(shareUrl)}`
    }
  ];

  return (
    <div className="share-menu-container">
      <button 
        className="share-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Share"
      >
        <Share size={24} weight="bold" />
      </button>

      {isOpen && (
        <div className="share-menu">
          {shareOptions.map((option) => (
            <a 
              key={option.name}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`share-option ${option.name.toLowerCase()}`}
            >
              {option.icon}
              <span>{option.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareMenu;
