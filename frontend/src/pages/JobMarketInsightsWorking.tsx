import React, { useState, useEffect } from 'react';
import { 
  TrendUp, MapPin, Clock, CurrencyDollar, 
  Users, Briefcase, ChartBar, MagnifyingGlass,
  Target, Code, Database, Palette, 
  Shield, Heart, Star, Buildings, 
  GraduationCap, Lightning, Trophy,
  ArrowUp, ArrowDown, Spinner
} from 'phosphor-react';
import '../styles/JobMarketInsightsNew.css';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  description: string;
  requirements: string[];
  skills: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  remote: boolean;
  postedDate: string;
  source: string;
  url: string;
  match?: number;
  logo?: string;
  benefits?: string[];
}

interface SkillTrend {
  name: string;
  demand: number;
  growth: number;
  averageSalary: number;
  jobCount: number;
  category: string;
}

interface SalaryInsight {
  title: string;
  location: string;
  averageSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
  experience: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  sampleSize: number;
}

interface CompanyInfo {
  name: string;
  rating?: number;
  reviewCount?: number;
  industry: string;
  size: string;
  headquarters: string;
  openPositions: number;
  averageSalary?: number;
  benefits: string[];
  description: string;
}

const JobMarketInsightsWorking = () => {
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [jobRecommendations, setJobRecommendations] = useState<JobListing[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  
  // Mock data for demonstration
  const marketStats = {
    totalJobs: 2456789,
    totalCompanies: 89432,
    averageSalary: 127500,
    growthRate: 8.2
  };

  const marketTrends = [
    { field: 'Software Development', growth: 25.2, demand: 'High', avgSalary: '$95,000', openings: 50000, icon: Code, color: '#3B82F6' },
    { field: 'Data Science', growth: 31.4, demand: 'High', avgSalary: '$110,000', openings: 25000, icon: Database, color: '#10B981' },
    { field: 'UI/UX Design', growth: 18.7, demand: 'High', avgSalary: '$75,000', openings: 15000, icon: Palette, color: '#F59E0B' },
    { field: 'Cybersecurity', growth: 28.5, demand: 'High', avgSalary: '$105,000', openings: 18000, icon: Shield, color: '#8B5CF6' },
  ];

  const skillsData: SkillTrend[] = [
    { name: 'React', demand: 95, growth: 35, averageSalary: 125000, jobCount: 15420, category: 'Frontend' },
    { name: 'Python', demand: 92, growth: 28, averageSalary: 135000, jobCount: 18950, category: 'Backend' },
    { name: 'JavaScript', demand: 88, growth: 20, averageSalary: 115000, jobCount: 22340, category: 'Frontend' },
    { name: 'AWS', demand: 90, growth: 40, averageSalary: 145000, jobCount: 12890, category: 'Cloud' },
  ];

  const salaryTrends: SalaryInsight[] = [
    {
      title: 'Software Engineer',
      location: 'San Francisco, CA',
      averageSalary: 135000,
      salaryRange: { min: 100000, max: 180000 },
      experience: 'Mid-Level',
      trend: 'up',
      trendPercentage: 8.5,
      sampleSize: 1250
    },
    {
      title: 'Data Scientist',
      location: 'New York, NY',
      averageSalary: 128000,
      salaryRange: { min: 95000, max: 170000 },
      experience: 'Mid-Level',
      trend: 'up',
      trendPercentage: 12.3,
      sampleSize: 890
    }
  ];

  const topCompanies: CompanyInfo[] = [
    {
      name: 'Google',
      rating: 4.6,
      reviewCount: 12543,
      industry: 'Technology',
      size: '100,000+ employees',
      headquarters: 'Mountain View, CA',
      openPositions: 1250,
      averageSalary: 165000,
      benefits: ['Health Insurance', 'Stock Options', 'Free Meals', '20% Time'],
      description: 'Leading technology company focused on search, cloud computing, and AI.'
    },
    {
      name: 'Microsoft',
      rating: 4.5,
      reviewCount: 8932,
      industry: 'Technology',
      size: '100,000+ employees',
      headquarters: 'Redmond, WA',
      openPositions: 980,
      averageSalary: 158000,
      benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget', 'Remote Work'],
      description: 'Global technology company developing software, services, and devices.'
    }
  ];

  const addSkill = () => {
    if (skillInput.trim() && !userSkills.includes(skillInput.trim())) {
      setUserSkills([...userSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setUserSkills(userSkills.filter(skill => skill !== skillToRemove));
  };

  const getJobRecommendations = async () => {
    if (userSkills.length === 0) return;

    setLoading(true);
    try {
      // Use environment variable for API URL
      const apiUrl = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Fetching jobs from:', `${apiUrl}/api/jobs/search?skills=${userSkills.join(',')}`);
      
      const response = await fetch(`${apiUrl}/api/jobs/search?skills=${userSkills.join(',')}`);
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        const jobsWithMatch = data.jobs.map((job: any) => ({
          ...job,
          match: Math.floor(Math.random() * 40) + 60, // Mock match percentage
          logo: '🏢',
          benefits: job.benefits || ['Health Insurance', 'Stock Options', 'Remote Work']
        }));
        setJobRecommendations(jobsWithMatch);
      } else {
        // Fallback to mock data
        setJobRecommendations([
          {
            id: '1',
            title: 'Senior React Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            salary: { min: 120000, max: 160000, currency: 'USD' },
            description: 'We are looking for an experienced React developer...',
            requirements: ['5+ years React experience', 'TypeScript proficiency'],
            skills: ['React', 'TypeScript', 'JavaScript', 'Node.js'],
            type: 'full-time',
            remote: false,
            postedDate: new Date().toISOString(),
            source: 'CareerBuddy',
            url: '#',
            match: 95,
            logo: '🚀',
            benefits: ['Health Insurance', 'Stock Options', 'Remote Work']
          }
        ]);
      }
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Show fallback data
      setJobRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const resetSkills = () => {
    setUserSkills([]);
    setSkillInput('');
    setShowRecommendations(false);
    setJobRecommendations([]);
  };

  const formatSalary = (salary: any) => {
    if (typeof salary === 'object' && salary.min && salary.max) {
      return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
    }
    return 'Salary not specified';
  };

  return (
    <div className="job-insights-container">
      {/* Hero Section */}
      <div className="insights-hero">
        <div className="hero-content">
          <h1>Job Market Insights</h1>
          <p>Discover trending careers, salary insights, and personalized job recommendations</p>
          
          {/* Quick Stats */}
          <div className="quick-stats">
            <div className="stat-card">
              <Briefcase weight="duotone" size={24} />
              <div>
                <h3>{(marketStats.totalJobs / 1000000).toFixed(1)}M+</h3>
                <p>Active Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <Users weight="duotone" size={24} />
              <div>
                <h3>{(marketStats.totalCompanies / 1000).toFixed(0)}K+</h3>
                <p>Companies</p>
              </div>
            </div>
            <div className="stat-card">
              <TrendUp weight="duotone" size={24} />
              <div>
                <h3>{marketStats.growthRate}%</h3>
                <p>Growth Rate</p>
              </div>
            </div>
            <div className="stat-card">
              <CurrencyDollar weight="duotone" size={24} />
              <div>
                <h3>${(marketStats.averageSalary / 1000).toFixed(0)}K</h3>
                <p>Avg Salary</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="insights-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <ChartBar weight="duotone" size={20} />
          Market Overview
        </button>
        <button 
          className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          <Target weight="duotone" size={20} />
          Skills Analysis
        </button>
        <button 
          className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <MagnifyingGlass weight="duotone" size={20} />
          Job Matcher
        </button>
        <button 
          className={`tab ${activeTab === 'salaries' ? 'active' : ''}`}
          onClick={() => setActiveTab('salaries')}
        >
          <CurrencyDollar weight="duotone" size={20} />
          Salary Insights
        </button>
        <button 
          className={`tab ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          <Buildings weight="duotone" size={20} />
          Top Companies
        </button>
      </div>

      {/* Content Sections */}
      <div className="insights-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Industry Trends</h2>
            <div className="trends-grid">
              {marketTrends.map((trend, index) => (
                <div key={index} className="trend-card" style={{ borderColor: trend.color }}>
                  <div className="trend-header">
                    <div className="trend-icon" style={{ backgroundColor: `${trend.color}20`, color: trend.color }}>
                      <trend.icon weight="duotone" size={24} />
                    </div>
                    <div>
                      <h3>{trend.field}</h3>
                      <span className={`demand-badge ${trend.demand.toLowerCase()}`}>
                        {trend.demand} Demand
                      </span>
                    </div>
                  </div>
                  <div className="trend-stats">
                    <div className="stat">
                      <TrendUp size={16} />
                      <span>{trend.growth}% growth</span>
                    </div>
                    <div className="stat">
                      <CurrencyDollar size={16} />
                      <span>{trend.avgSalary}</span>
                    </div>
                    <div className="stat">
                      <Briefcase size={16} />
                      <span>{trend.openings.toLocaleString()} jobs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="skills-section">
            <h2>In-Demand Skills</h2>
            <div className="skills-grid">
              {skillsData.map((skill, index) => (
                <div key={index} className="skill-card">
                  <div className="skill-header">
                    <h3>{skill.name}</h3>
                    <span className="skill-category">{skill.category}</span>
                  </div>
                  <div className="skill-metrics">
                    <div className="metric">
                      <span>Demand</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${skill.demand}%` }}
                        ></div>
                      </div>
                      <span>{skill.demand}%</span>
                    </div>
                    <div className="metric">
                      <span>Growth</span>
                      <span className="growth-indicator">
                        <TrendUp size={16} />
                        {skill.growth}%
                      </span>
                    </div>
                    <div className="metric">
                      <span>Avg Salary</span>
                      <span className="salary">${(skill.averageSalary / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'salaries' && (
          <div className="salaries-section">
            <h2>Salary Insights & Trends</h2>
            <div className="salary-trends-grid">
              {salaryTrends.map((salary, index) => (
                <div key={index} className="salary-trend-card">
                  <div className="salary-header">
                    <h3>{salary.title}</h3>
                    <span className={`trend-indicator ${salary.trend}`}>
                      {salary.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      {salary.trendPercentage}%
                    </span>
                  </div>
                  <div className="salary-range">
                    <div className="range-bar">
                      <div className="range-fill" style={{ background: 'linear-gradient(90deg, #3B82F6 0%, #10B981 100%)', width: '100%' }}></div>
                    </div>
                    <div className="range-labels">
                      <span>${(salary.salaryRange.min / 1000).toFixed(0)}k</span>
                      <span className="avg-salary">${(salary.averageSalary / 1000).toFixed(0)}k avg</span>
                      <span>${(salary.salaryRange.max / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <div className="salary-details">
                    <div className="detail">
                      <MapPin size={14} />
                      <span>{salary.location}</span>
                    </div>
                    <div className="detail">
                      <GraduationCap size={14} />
                      <span>{salary.experience}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="companies-section">
            <h2>Top Companies to Work For</h2>
            <div className="companies-grid">
              {topCompanies.map((company, index) => (
                <div key={index} className="company-card">
                  <div className="company-header">
                    <div className="company-logo">🏢</div>
                    <div className="company-info">
                      <h3>{company.name}</h3>
                      <div className="company-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              weight={i < Math.floor(company.rating || 0) ? "fill" : "regular"} 
                              size={16}
                              color="#F59E0B"
                            />
                          ))}
                        </div>
                        <span className="rating-score">{company.rating}</span>
                        <span className="review-count">({company.reviewCount?.toLocaleString()} reviews)</span>
                      </div>
                    </div>
                    <div className="company-metrics">
                      <div className="metric">
                        <span className="metric-value">${(company.averageSalary! / 1000).toFixed(0)}k</span>
                        <span className="metric-label">Avg Salary</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{company.openPositions}</span>
                        <span className="metric-label">Open Jobs</span>
                      </div>
                    </div>
                  </div>
                  <div className="company-details">
                    <div className="company-meta">
                      <div className="meta-item">
                        <Buildings size={14} />
                        <span>{company.industry}</span>
                      </div>
                      <div className="meta-item">
                        <Users size={14} />
                        <span>{company.size}</span>
                      </div>
                      <div className="meta-item">
                        <MapPin size={14} />
                        <span>{company.headquarters}</span>
                      </div>
                    </div>
                    <div className="company-benefits">
                      <h4>Top Benefits</h4>
                      <div className="benefits-list">
                        {company.benefits.slice(0, 4).map((benefit, i) => (
                          <span key={i} className="benefit-tag">{benefit}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="job-matcher-section">
            <h2>Personalized Job Recommendations</h2>
            
            {/* Skills Input */}
            <div className="skills-input-section">
              <h3>Enter Your Skills</h3>
              <div className="skills-input-container">
                <div className="skill-input-wrapper">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="e.g., React, Python, JavaScript..."
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <button onClick={addSkill} className="add-skill-btn">
                    Add Skill
                  </button>
                </div>
                
                {userSkills.length > 0 && (
                  <div className="selected-skills">
                    {userSkills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <button onClick={() => removeSkill(skill)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="action-buttons">
                  <button 
                    onClick={getJobRecommendations} 
                    className="get-recommendations-btn"
                    disabled={userSkills.length === 0 || loading}
                  >
                    {loading ? <Spinner size={16} className="spinning" /> : <MagnifyingGlass size={16} />}
                    {loading ? 'Searching...' : 'Find Matching Jobs'}
                  </button>
                  {userSkills.length > 0 && (
                    <button onClick={resetSkills} className="reset-btn">
                      Reset Skills
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Job Recommendations */}
            {showRecommendations && (
              <div className="recommendations-section">
                <h3>Recommended Jobs ({jobRecommendations.length} matches)</h3>
                <div className="job-cards">
                  {jobRecommendations.map((job) => (
                    <div key={job.id} className="job-card">
                      <div className="job-header">
                        <div className="company-logo">{job.logo}</div>
                        <div className="job-info">
                          <h4>{job.title}</h4>
                          <p className="company-name">{job.company}</p>
                          <div className="job-meta">
                            <span className="location">
                              <MapPin size={14} />
                              {job.location}
                            </span>
                            <span className="type">{job.type}</span>
                            <span className="posted">
                              <Clock size={14} />
                              {new Date(job.postedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="match-score">
                          <div className="match-percentage">{job.match}%</div>
                          <span>Match</span>
                        </div>
                      </div>
                      
                      <div className="job-details">
                        <p className="job-description">{job.description}</p>
                        
                        <div className="salary-info">
                          <CurrencyDollar size={16} />
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                        
                        <div className="required-skills">
                          <h5>Required Skills:</h5>
                          <div className="skills-list">
                            {job.skills.map((skill, index) => (
                              <span 
                                key={index} 
                                className={`skill-badge ${userSkills.some(userSkill => 
                                  userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                  skill.toLowerCase().includes(userSkill.toLowerCase())
                                ) ? 'matched' : ''}`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {job.benefits && (
                          <div className="job-benefits">
                            <h5>Benefits:</h5>
                            <ul>
                              {job.benefits.slice(0, 3).map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="job-actions">
                          <button className="apply-btn">Apply Now</button>
                          <button className="save-btn">Save Job</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMarketInsightsWorking;
