import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Target, Lightbulb } from 'phosphor-react';
import '../styles/unified-dashboard.css';
import '../styles/Hackathons.css';

const Hackathons = () => {
  const platforms = [
    {
      name: 'Devpost',
      image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/devpost_logo_icon_169280.png',
      url: 'https://devpost.com/hackathons',
      description: 'Join over 2M+ developers and participate in the world\'s best hackathons',
      icon: Trophy
    },
    {
      name: 'Major League Hacking',
      image: 'https://static.mlh.io/brand-assets/logo/official/mlh-logo-color.png',
      url: 'https://mlh.io/seasons/2024/events',
      description: 'Participate in the official student hackathon league',
      icon: Users
    },
    {
      name: 'Unstop (formerly Dare2Compete)',
      image: 'https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/svg/unstop-logo.svg',
      url: 'https://unstop.com/hackathons',
      description: 'India\'s largest platform for hackathons and competitions',
      icon: Target
    },
    {
      name: 'Kaggle',
      image: 'https://www.kaggle.com/static/images/site-logo.svg',
      url: 'https://www.kaggle.com/competitions',
      description: 'Data Science competitions and Machine Learning challenges',
      icon: Lightbulb
    }
  ];

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={24} weight="bold" />
          Back to Dashboard
        </Link>
        <h1>Hackathons & Events</h1>
      </nav>

      <div className="dashboard-content">
        <div className="section-header">
          <h2 className="section-title">Real-time Hackathon Updates Coming Soon!</h2>
          <p className="section-subtitle">We're working on bringing you live updates from all major hackathon platforms.</p>
        </div>

        <div className="content-grid two-column">
          {platforms.map((platform, index) => (
            <a 
              key={platform.name} 
              href={platform.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="dashboard-card platform-card animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, textDecoration: 'none' }}
            >
              <div className="card-icon">
                <platform.icon size={40} weight="duotone" />
              </div>
              <div className="platform-image">
                <img src={platform.image} alt={platform.name} />
              </div>
              <div className="platform-info">
                <h3 className="card-title">{platform.name}</h3>
                <p className="card-description">{platform.description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="stay-tuned">
          <h3>Coming Soon Features</h3>
          <p>🚀 Live hackathon notifications<br/>
             📅 Integrated calendar with deadlines<br/>
             🏆 Personalized recommendations based on your skills<br/>
             👥 Team formation and collaboration tools</p>
        </div>
      </div>
    </div>
  );
};

export default Hackathons;
