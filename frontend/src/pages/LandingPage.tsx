import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RocketLaunch, Lightning, Users, Star } from 'phosphor-react';
import AuthModal from '../components/AuthModal';
import GradientBackground from '../components/GradientBackground';
import AnimatedParticles from '../components/AnimatedParticles';
import BackgroundAnimation from '../components/BackgroundAnimation';

const LandingPage = () => {
  const [showAuth, setShowAuth] = React.useState(false);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-page">
      <BackgroundAnimation />
      <AnimatedParticles />
      <GradientBackground />
      <nav className="landing-nav">
        <div className="logo">
          Career Buddy
          <RocketLaunch className="logo-icon" />
        </div>
        <button className="login-button" onClick={() => setShowAuth(true)}>
          Login
        </button>
      </nav>

      <main className="landing-main">
        <section className="hero">
          <h1>Your AI-Powered Career Guide</h1>
          <p>Navigate your professional journey with intelligent insights and personalized mentoring</p>
          <button className="cta-button" onClick={() => setShowAuth(true)}>
            Get Started
            <RocketLaunch weight="bold" />
          </button>
        </section>

        <section className="features">
          <h2>Why Choose Career Buddy?</h2>
          <div className="feature-grid">
            <div className="feature">
              <Lightning size={32} />
              <h3>AI-Powered Insights</h3>
              <p>Get personalized career recommendations based on your skills and interests</p>
            </div>
            <div className="feature">
              <Users size={32} />
              <h3>Expert Mentorship</h3>
              <p>Connect with industry professionals for guidance and advice</p>
            </div>
            <div className="feature">
              <Star size={32} />
              <h3>Track Progress</h3>
              <p>Monitor your career growth with detailed analytics and milestones</p>
            </div>
          </div>
        </section>
      </main>

      {showAuth && (
        <AuthModal 
          isOpen={showAuth} 
          onClose={() => setShowAuth(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default LandingPage;
