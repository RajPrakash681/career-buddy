import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code, Target, Lightbulb } from 'phosphor-react';
import '../styles/unified-dashboard.css';
import '../styles/StudyResources.css';

interface Resource {
  name: string;
  description: string;
  link: string;
}

const StudyResources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const freeUniversityCourses: Resource[] = [
    {
      name: "CS50 - Harvard",
      description: "Introduction to Computer Science and the art of programming.",
      link: "https://cs50.harvard.edu/x/"
    },
    {
      name: "MIT Python Programming",
      description: "Introduction to Computer Science and Programming using Python.",
      link: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/"
    },
    {
      name: "Stanford R Programming",
      description: "Statistical computing and graphics using the R programming language.",
      link: "https://online.stanford.edu/courses/xfds112-statistical-learning"
    },
    {
      name: "MIT Algorithms",
      description: "Introduction to algorithms and data structures.",
      link: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/"
    }
  ];

  const interactivePlatforms: Resource[] = [
    {
      name: "freeCodeCamp",
      description: "Learn to code with interactive exercises and projects.",
      link: "https://www.freecodecamp.org/"
    },
    {
      name: "Codecademy",
      description: "Interactive coding lessons in various programming languages.",
      link: "https://www.codecademy.com/"
    },
    {
      name: "Exercism",
      description: "Code practice and mentorship for everyone.",
      link: "https://exercism.org/"
    },
    {
      name: "Mimo",
      description: "Learn programming through bite-sized lessons on mobile.",
      link: "https://getmimo.com/"
    },
    {
      name: "SoloLearn",
      description: "Social platform to learn coding with a global community.",
      link: "https://www.sololearn.com/"
    }
  ];

  const specializedTools: Resource[] = [
    {
      name: "Visualgo",
      description: "Visualizing data structures and algorithms through animation.",
      link: "https://visualgo.net/"
    },
    {
      name: "CSSBattle",
      description: "Online CSS code-golfing battleground for web developers.",
      link: "https://cssbattle.dev/"
    },
    {
      name: "Patterns.dev",
      description: "Modern web development patterns and best practices.",
      link: "https://patterns.dev/"
    },
    {
      name: "LeetCode",
      description: "Practice coding problems and prepare for technical interviews.",
      link: "https://leetcode.com/"
    }
  ];

  const filterResources = (resources: Resource[]) => {
    if (!searchTerm) return resources;
    return resources.filter(resource =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const ResourceCard: React.FC<{ resource: Resource; icon: React.ElementType }> = ({ resource, icon: Icon }) => (
    <div className="dashboard-card resource-card">
      <div className="card-icon">
        <Icon size={40} weight="duotone" />
      </div>
      <h3 className="card-title">{resource.name}</h3>
      <p className="card-description">{resource.description}</p>
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        className="card-action"
      >
        Visit Resource
      </a>
    </div>
  );

  const ResourceSection: React.FC<{ title: string; resources: Resource[]; icon: React.ElementType }> = ({ title, resources, icon }) => {
    const filteredResources = filterResources(resources);
    
    if (filteredResources.length === 0) return null;

    return (
      <section className="resource-section">
        <h2 className="section-title">{title}</h2>
        <div className="content-grid three-column">
          {filteredResources.map((resource, index) => (
            <ResourceCard key={index} resource={resource} icon={icon} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="dashboard-page">
      <nav className="dashboard-nav">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={24} weight="bold" />
          Back to Dashboard
        </Link>
        <h1>Study Resources</h1>
      </nav>

      <div className="dashboard-content">
        <div className="section-header">
          <h1 className="section-title">Study Resources</h1>
          <p className="section-subtitle">
            Curated resources to help you learn programming, computer science, and more.
          </p>
        </div>

        <div className="search-filter-bar">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <ResourceSection 
          title="Free University Courses" 
          resources={freeUniversityCourses}
          icon={BookOpen}
        />
        
        <ResourceSection 
          title="Interactive Platforms" 
          resources={interactivePlatforms}
          icon={Code}
        />
        
        <ResourceSection 
          title="Specialized Tools & Challenges" 
          resources={specializedTools}
          icon={Target}
        />

        <div className="dashboard-card">
          <div className="card-icon">
            <Lightbulb size={40} weight="duotone" />
          </div>
          <h2 className="card-title">Tips for Learners</h2>
          <ul className="tips-list">
            <li>Start with one beginner course</li>
            <li>Practice small projects</li>
            <li>Use challenge tools to improve</li>
            <li>Stay consistent with weekly goals</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudyResources;
