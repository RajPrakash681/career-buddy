import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Books, ChartLine, Calendar, Target, Calculator, Brain } from 'phosphor-react';

const StudentDashboard = () => {
  const upcomingFeatures = [
    { icon: ChartLine, title: 'Progress Tracking' },
    { icon: Calendar, title: 'Study Planner' },
    { icon: Target, title: 'Goal Setting' },
    { icon: Books, title: 'Learning Resources' },
    { icon: Calculator, title: 'Grade Calculator' },
    { icon: Brain, title: 'Skill Analysis' }
  ];

  return (
    <div className="student-dashboard-page">
      <nav className="dashboard-nav">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={24} weight="bold" />
          Back to Dashboard
        </Link>
        <h1>Student Dashboard</h1>
      </nav>

      <div className="coming-soon-container">
        <h2>Personalized Dashboard Coming Soon!</h2>
        <p>We're crafting a unique learning environment tailored just for you</p>
        
        <div className="features-preview">
          {upcomingFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="feature-preview-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <feature.icon size={40} weight="duotone" />
              <h3>{feature.title}</h3>
            </div>
          ))}
        </div>

        <div className="stay-tuned">
          <h3>Stay Tuned!</h3>
          <p>Your personalized learning journey is about to get even better. We're adding smart recommendations, progress tracking, and much more!</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
