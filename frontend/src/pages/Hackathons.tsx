import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'phosphor-react';
import '../styles/Hackathons.css';

const Hackathons = () => {
  const platforms = [
    {
      name: 'Devpost',
      image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/devpost_logo_icon_169280.png',
      url: 'https://devpost.com/hackathons',
      description: 'Join over 2M+ developers and participate in the world\'s best hackathons'
    },
    {
      name: 'Major League Hacking',
      image: 'https://static.mlh.io/brand-assets/logo/official/mlh-logo-color.png',
      url: 'https://mlh.io/seasons/2024/events',
      description: 'Participate in the official student hackathon league'
    },
    {
      name: 'Unstop (formerly Dare2Compete)',
      image: 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/svg/unstop-logo.svg',
      url: 'https://unstop.com/hackathons',
      description: 'India\'s largest platform for hackathons and competitions'
    },
    {
      name: 'Kaggle',
      image: 'https://www.kaggle.com/static/images/site-logo.svg',
      url: 'https://www.kaggle.com/competitions',
      description: 'Data Science competitions and Machine Learning challenges'
    }
  ];

  return (
    <div className="hackathons-page">
      <nav className="hackathons-nav">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={24} weight="bold" />
          Back to Dashboard
        </Link>
        <h1>Hackathons & Events</h1>
      </nav>

      <div className="coming-soon-container">
        <div className="coming-soon-content">
          <h2>Real-time Hackathon Updates Coming Soon!</h2>
          <p>We're working on bringing you live updates from all major hackathon platforms.</p>
          <div className="platforms-grid">
            {platforms.map((platform) => (
              <a 
                key={platform.name} 
                href={platform.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="platform-card"
              >
                <div className="platform-image">
                  <img src={platform.image} alt={platform.name} />
                </div>
                <div className="platform-info">
                  <h3>{platform.name}</h3>
                  <p>{platform.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hackathons;
