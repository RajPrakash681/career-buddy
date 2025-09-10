import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Books, ChartLine, Calendar, Target, Calculator, Brain } from 'phosphor-react';
import '../styles/unified-dashboard.css';

const StudentDashboard = () => {
  const upcomingFeatures = [
    { icon: ChartLine, title: 'Progress Tracking', description: 'Track your learning journey and academic progress' },
    { icon: Calendar, title: 'Study Planner', description: 'Organize your study schedule efficiently' },
    { icon: Target, title: 'Goal Setting', description: 'Set and achieve your academic goals' },
    { icon: Books, title: 'Learning Resources', description: 'Access curated learning materials' },
    { icon: Calculator, title: 'Grade Calculator', description: 'Calculate and track your grades' },
    { icon: Brain, title: 'Skill Analysis', description: 'Analyze and improve your skills' }
  ];

  return (
    <div className="dashboard-page student-dashboard-page">
      <nav className="dashboard-nav">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={24} weight="bold" />
          Back to Dashboard
        </Link>
        <h1>Student Dashboard</h1>
      </nav>

      <div className="dashboard-content">
        <div className="coming-soon-container">
          <div className="section-header">
            <h2 className="section-title">Personalized Dashboard Coming Soon!</h2>
            <p className="section-subtitle">We're crafting a unique learning environment tailored just for you</p>
          </div>
          
          <div className="features-showcase">
            {upcomingFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="feature-preview-card animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-icon">
                  <feature.icon size={40} weight="duotone" />
                </div>
                <h3>{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="stay-tuned">
            <h3>Stay Tuned!</h3>
            <p>Your personalized learning journey is about to get even better. We're adding smart recommendations, progress tracking, and much more!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
