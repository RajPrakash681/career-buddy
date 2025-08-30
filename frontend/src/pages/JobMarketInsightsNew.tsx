import React, { useState, useEffect } from 'react';
import { 
  TrendUp, MapPin, Clock, CurrencyDollar, 
  Users, Briefcase, ChartBar, MagnifyingGlass,
  Target, Code, Database, Palette, 
  Shield, Heart, Star, Buildings, 
  GraduationCap, Lightning, Trophy,
  ArrowUp, ArrowDown, CaretUp, CaretDown,
  FunnelSimple, Calendar, Globe,
  BookmarkSimple, Share, Info, Spinner
} from 'phosphor-react';
import '../styles/JobMarketInsightsNew.css';
import { jobMarketAPI, JobListing, SalaryInsight, SkillTrend, CompanyInfo } from '../services/jobMarketAPI';

interface JobRecommendation extends JobListing {
  match: number;
  logo?: string;
  benefits?: string[];
}

interface MarketTrend {
  field: string;
  growth: number;
  demand: 'High' | 'Medium' | 'Low';
  avgSalary: string;
  openings: number;
  icon: React.ElementType;
  color: string;
}

interface SkillData {
  name: string;
  demand: number;
  growth: number;
  salary: string;
  category: string;
}

interface CompanyData {
  id: number;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  industry: string;
  size: string;
  headquarters: string;
  avgSalary: string;
  benefits: string[];
  culture: {
    workLifeBalance: number;
    compensation: number;
    careerOpportunities: number;
    management: number;
  };
  jobs: number;
}

interface SalaryData {
  role: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  experience: string;
  location: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface CareerPath {
  current: string;
  next: string[];
  timeframe: string;
  skillsNeeded: string[];
  salaryIncrease: string;
}

interface FilterOptions {
  location: string[];
  experience: string[];
  salary: { min: number; max: number };
  jobType: string[];
  company: string[];
  remote: boolean;
}

const JobMarketInsights = () => {
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [jobRecommendations, setJobRecommendations] = useState<JobListing[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedExperience, setSelectedExperience] = useState('All Levels');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 200000 });
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  
  // API data states
  const [marketStats, setMarketStats] = useState<any>(null);
  const [skillsData, setSkillsData] = useState<SkillTrend[]>([]);
  const [salaryTrends, setSalaryTrends] = useState<SalaryInsight[]>([]);
  const [topCompanies, setTopCompanies] = useState<CompanyInfo[]>([]);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    jobs: false,
    skills: false,
    salaries: false,
    companies: false,
    stats: false
  });
  
  // Error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load data when tab changes
  useEffect(() => {
    switch (activeTab) {
      case 'skills':
        if (skillsData.length === 0) loadSkillsData();
        break;
      case 'salaries':
        if (salaryTrends.length === 0) loadSalaryData();
        break;
      case 'companies':
        if (topCompanies.length === 0) loadCompaniesData();
        break;
      case 'careers':
        if (careerPaths.length === 0) loadCareerPathsData();
        break;
    }
  }, [activeTab]);

  const loadInitialData = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const stats = await jobMarketAPI.getMarketStats();
      setMarketStats(stats);
      setErrors(prev => ({ ...prev, stats: '' }));
    } catch (error) {
      console.error('Failed to load market stats:', error);
      setErrors(prev => ({ ...prev, stats: 'Failed to load market statistics' }));
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  const loadSkillsData = async () => {
    setLoading(prev => ({ ...prev, skills: true }));
    try {
      const skills = await jobMarketAPI.getSkillTrends();
      setSkillsData(skills);
      setErrors(prev => ({ ...prev, skills: '' }));
    } catch (error) {
      console.error('Failed to load skills data:', error);
      setErrors(prev => ({ ...prev, skills: 'Failed to load skills data' }));
    } finally {
      setLoading(prev => ({ ...prev, skills: false }));
    }
  };

  const loadSalaryData = async () => {
    setLoading(prev => ({ ...prev, salaries: true }));
    try {
      const salaries = await jobMarketAPI.getSalaryInsights({
        location: selectedLocation !== 'All Locations' ? selectedLocation : undefined,
        experience: selectedExperience !== 'All Levels' ? selectedExperience : undefined
      });
      setSalaryTrends(salaries);
      setErrors(prev => ({ ...prev, salaries: '' }));
    } catch (error) {
      console.error('Failed to load salary data:', error);
      setErrors(prev => ({ ...prev, salaries: 'Failed to load salary data' }));
    } finally {
      setLoading(prev => ({ ...prev, salaries: false }));
    }
  };

  const loadCompaniesData = async () => {
    setLoading(prev => ({ ...prev, companies: true }));
    try {
      const companies = await jobMarketAPI.getCompanyInfo();
      setTopCompanies(companies);
      setErrors(prev => ({ ...prev, companies: '' }));
    } catch (error) {
      console.error('Failed to load companies data:', error);
      setErrors(prev => ({ ...prev, companies: 'Failed to load companies data' }));
    } finally {
      setLoading(prev => ({ ...prev, companies: false }));
    }
  };

  const loadCareerPathsData = () => {
    // For now, use static career paths data
    setCareerPaths([
      {
        current: 'Junior Developer',
        next: ['Senior Developer', 'Tech Lead', 'Full Stack Developer'],
        timeframe: '2-3 years',
        skillsNeeded: ['Advanced JavaScript', 'System Design', 'Leadership'],
        salaryIncrease: '40-60%'
      },
      {
        current: 'Data Analyst',
        next: ['Data Scientist', 'Data Engineer', 'Analytics Manager'],
        timeframe: '3-4 years',
        skillsNeeded: ['Machine Learning', 'Python', 'Statistical Analysis'],
        salaryIncrease: '50-70%'
      },
      {
        current: 'UX Designer',
        next: ['Senior UX Designer', 'Design Manager', 'Product Designer'],
        timeframe: '2-4 years',
        skillsNeeded: ['User Research', 'Design Systems', 'Prototyping'],
        salaryIncrease: '35-50%'
      }
    ]);
  };

  const marketTrends: MarketTrend[] = [
    {
      field: 'Software Development',
      growth: 25.2,
      demand: 'High',
      avgSalary: '$95,000',
      openings: 50000,
      icon: Code,
      color: '#3B82F6'
    },
    {
      field: 'Data Science',
      growth: 31.4,
      demand: 'High',
      avgSalary: '$110,000',
      openings: 25000,
      icon: Database,
      color: '#10B981'
    },
    {
      field: 'UI/UX Design',
      growth: 18.7,
      demand: 'High',
      avgSalary: '$75,000',
      openings: 15000,
      icon: Palette,
      color: '#F59E0B'
    },
    {
      field: 'Digital Marketing',
      growth: 22.1,
      demand: 'Medium',
      avgSalary: '$65,000',
      openings: 30000,
      icon: Target,
      color: '#EF4444'
    },
    {
      field: 'Cybersecurity',
      growth: 28.5,
      demand: 'High',
      avgSalary: '$105,000',
      openings: 18000,
      icon: Shield,
      color: '#8B5CF6'
    },
    {
      field: 'Healthcare',
      growth: 15.3,
      demand: 'Medium',
      avgSalary: '$80,000',
      openings: 40000,
      icon: Heart,
      color: '#EC4899'
    }
  ];

  const jobDatabase: JobRecommendation[] = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      type: 'Full-time',
      experience: 'Senior Level',
      skills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
      match: 95,
      posted: '2 days ago',
      logo: '🚀',
      description: 'Join our innovative team building cutting-edge web applications.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership skills'],
      benefits: ['Health insurance', 'Stock options', 'Remote work', '401k matching']
    },
    {
      id: 2,
      title: 'Python Data Scientist',
      company: 'DataFlow Analytics',
      location: 'New York, NY',
      salary: '$110,000 - $140,000',
      type: 'Full-time',
      experience: 'Mid Level',
      skills: ['Python', 'Machine Learning', 'SQL', 'AWS'],
      match: 88,
      posted: '1 week ago',
      logo: '📊',
      description: 'Analyze complex datasets to drive business insights and decisions.',
      requirements: ['3+ years Python experience', 'ML/AI background', 'Statistical analysis'],
      benefits: ['Flexible hours', 'Learning budget', 'Health insurance', 'Gym membership']
    },
    {
      id: 3,
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$90,000 - $120,000',
      type: 'Full-time',
      experience: 'Mid Level',
      skills: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
      match: 82,
      posted: '3 days ago',
      logo: '⚡',
      description: 'Build scalable applications from frontend to backend.',
      requirements: ['Full-stack experience', 'Database design', 'API development'],
      benefits: ['Remote first', 'Unlimited PTO', 'Stock options', 'Home office stipend']
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'Design Studio Pro',
      location: 'London, UK',
      salary: '£45,000 - £65,000',
      type: 'Full-time',
      experience: 'Mid Level',
      skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
      match: 75,
      posted: '5 days ago',
      logo: '🎨',
      description: 'Create beautiful and intuitive user experiences for digital products.',
      requirements: ['Portfolio required', 'User-centered design', 'Prototyping skills'],
      benefits: ['Creative environment', 'Flexible hours', 'Professional development', 'Pension']
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Berlin, Germany',
      salary: '€70,000 - €95,000',
      type: 'Full-time',
      experience: 'Senior Level',
      skills: ['AWS', 'Docker', 'Kubernetes', 'Python'],
      match: 90,
      posted: '1 day ago',
      logo: '☁️',
      description: 'Manage and optimize cloud infrastructure for high-scale applications.',
      requirements: ['Cloud platform expertise', 'Container orchestration', 'CI/CD pipelines'],
      benefits: ['Relocation assistance', 'Health insurance', 'Professional training', '30 days vacation']
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

  const addSkill = () => {
    if (skillInput.trim() && !userSkills.includes(skillInput.trim())) {
      setUserSkills([...userSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const resetSkills = () => {
    setUserSkills([]);
    setSkillInput('');
    setShowRecommendations(false);
    setJobRecommendations([]);
  };

  const getJobRecommendations = async () => {
    if (userSkills.length === 0) return;

    setLoading(prev => ({ ...prev, jobs: true }));
    try {
      const searchParams = {
        skills: userSkills,
        location: selectedLocation !== 'All Locations' ? selectedLocation : undefined,
        salary_min: salaryRange.min > 0 ? salaryRange.min : undefined,
        salary_max: salaryRange.max < 200000 ? salaryRange.max : undefined,
        remote: selectedLocation === 'Remote' ? true : undefined,
        limit: 20
      };

      const response = await jobMarketAPI.searchJobs(searchParams);
      
      // Calculate match percentage for each job
      const jobsWithMatch = response.jobs.map(job => ({
        ...job,
        match: calculateMatchPercentage(job, userSkills),
        logo: getCompanyLogo(job.company),
        benefits: generateBenefits()
      })).filter(job => job.match > 0)
        .sort((a, b) => b.match - a.match);

      setJobRecommendations(jobsWithMatch);
      setShowRecommendations(true);
      setErrors(prev => ({ ...prev, jobs: '' }));
    } catch (error) {
      console.error('Failed to get job recommendations:', error);
      setErrors(prev => ({ ...prev, jobs: 'Failed to load job recommendations' }));
    } finally {
      setLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  const calculateMatchPercentage = (job: JobListing, skills: string[]): number => {
    const matchingSkills = job.skills.filter(skill => 
      skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    return Math.round((matchingSkills.length / Math.max(job.skills.length, 1)) * 100);
  };

  const getCompanyLogo = (companyName: string): string => {
    const logos: { [key: string]: string } = {
      'Google': '🏢',
      'Microsoft': '💻',
      'Meta': '📱',
      'Amazon': '📦',
      'Apple': '🍎',
      'Netflix': '🎬',
      'Tesla': '🚗',
      'Spotify': '🎵'
    };
    return logos[companyName] || '🏢';
  };

  const generateBenefits = (): string[] => {
    const allBenefits = [
      'Health Insurance', 'Stock Options', 'Remote Work', 'Flexible Hours',
      'Learning Budget', 'Gym Membership', 'Free Meals', 'Parental Leave',
      'Unlimited PTO', 'Home Office Stipend', 'Wellness Programs', 'Career Development'
    ];
    return allBenefits.slice(0, Math.floor(Math.random() * 4) + 3);
  };

  const resetSkills = () => {
    setUserSkills([]);
    setSkillInput('');
    setShowRecommendations(false);
    setJobRecommendations([]);
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
                <h3>2.4M+</h3>
                <p>Active Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <Users weight="duotone" size={24} />
              <div>
                <h3>850K+</h3>
                <p>Companies</p>
              </div>
            </div>
            <div className="stat-card">
              <TrendUp weight="duotone" size={24} />
              <div>
                <h3>25%</h3>
                <p>Growth Rate</p>
              </div>
            </div>
            <div className="stat-card">
              <CurrencyDollar weight="duotone" size={24} />
              <div>
                <h3>$95K</h3>
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
        <button 
          className={`tab ${activeTab === 'careers' ? 'active' : ''}`}
          onClick={() => setActiveTab('careers')}
        >
          <GraduationCap weight="duotone" size={20} />
          Career Paths
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
                      <span className="salary">{skill.salary}</span>
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
                    disabled={userSkills.length === 0}
                  >
                    <MagnifyingGlass size={16} />
                    Find Matching Jobs
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
                              {job.posted}
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
                          <span>{job.salary}</span>
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
                        
                        <div className="job-benefits">
                          <h5>Benefits:</h5>
                          <ul>
                            {job.benefits.slice(0, 3).map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                        
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

        {activeTab === 'salaries' && (
          <div className="salaries-section">
            <div className="section-header">
              <h2>Salary Insights & Trends</h2>
              <div className="salary-filters">
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="filter-select"
                >
                  <option>All Locations</option>
                  <option>San Francisco</option>
                  <option>New York</option>
                  <option>Seattle</option>
                  <option>Austin</option>
                </select>
                <select 
                  value={selectedExperience} 
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="filter-select"
                >
                  <option>All Levels</option>
                  <option>Entry Level</option>
                  <option>Mid-Level</option>
                  <option>Senior</option>
                  <option>Executive</option>
                </select>
              </div>
            </div>

            <div className="salary-overview">
              <div className="salary-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <CurrencyDollar weight="duotone" size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>$127,500</h3>
                    <p>Average Tech Salary</p>
                    <span className="trend-up">
                      <TrendUp size={16} />
                      8.2% vs last year
                    </span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Trophy weight="duotone" size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>$180,000</h3>
                    <p>Highest Paying Role</p>
                    <span className="role-name">Staff Engineer</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Lightning weight="duotone" size={32} />
                  </div>
                  <div className="stat-info">
                    <h3>15.2%</h3>
                    <p>Fastest Growing</p>
                    <span className="role-name">DevOps Engineer</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="salary-trends-grid">
              {salaryTrends.map((salary, index) => (
                <div key={index} className="salary-trend-card">
                  <div className="salary-header">
                    <h3>{salary.role}</h3>
                    <span className={`trend-indicator ${salary.trend}`}>
                      {salary.trend === 'up' ? <ArrowUp size={16} /> : 
                       salary.trend === 'down' ? <ArrowDown size={16} /> : 
                       <span>→</span>}
                      {salary.trendPercentage}%
                    </span>
                  </div>
                  <div className="salary-range">
                    <div className="range-bar">
                      <div className="range-fill" style={{ 
                        background: `linear-gradient(90deg, #3B82F6 0%, #10B981 100%)`,
                        width: '100%'
                      }}></div>
                      <div className="range-marker" style={{ left: '50%' }}></div>
                    </div>
                    <div className="range-labels">
                      <span>${(salary.minSalary / 1000).toFixed(0)}k</span>
                      <span className="avg-salary">${(salary.avgSalary / 1000).toFixed(0)}k avg</span>
                      <span>${(salary.maxSalary / 1000).toFixed(0)}k</span>
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
            <div className="section-header">
              <h2>Top Companies to Work For</h2>
              <div className="company-filters">
                <select 
                  value={selectedIndustry} 
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="filter-select"
                >
                  <option>All Industries</option>
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>E-commerce</option>
                </select>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="salary">Sort by Salary</option>
                  <option value="jobs">Sort by Job Openings</option>
                </select>
              </div>
            </div>

            <div className="companies-grid">
              {topCompanies.map((company) => (
                <div key={company.id} className="company-card">
                  <div className="company-header">
                    <div className="company-logo">{company.logo}</div>
                    <div className="company-info">
                      <h3>{company.name}</h3>
                      <div className="company-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              weight={i < Math.floor(company.rating) ? "fill" : "regular"} 
                              size={16}
                              color="#F59E0B"
                            />
                          ))}
                        </div>
                        <span className="rating-score">{company.rating}</span>
                        <span className="review-count">({company.reviewCount.toLocaleString()} reviews)</span>
                      </div>
                    </div>
                    <div className="company-metrics">
                      <div className="metric">
                        <span className="metric-value">{company.avgSalary}</span>
                        <span className="metric-label">Avg Salary</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{company.jobs}</span>
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

                    <div className="culture-scores">
                      <h4>Culture & Values</h4>
                      <div className="culture-metrics">
                        <div className="culture-item">
                          <span>Work-Life Balance</span>
                          <div className="culture-bar">
                            <div className="culture-fill" style={{ width: `${company.culture.workLifeBalance * 20}%` }}></div>
                          </div>
                          <span>{company.culture.workLifeBalance}</span>
                        </div>
                        <div className="culture-item">
                          <span>Compensation</span>
                          <div className="culture-bar">
                            <div className="culture-fill" style={{ width: `${company.culture.compensation * 20}%` }}></div>
                          </div>
                          <span>{company.culture.compensation}</span>
                        </div>
                        <div className="culture-item">
                          <span>Career Growth</span>
                          <div className="culture-bar">
                            <div className="culture-fill" style={{ width: `${company.culture.careerOpportunities * 20}%` }}></div>
                          </div>
                          <span>{company.culture.careerOpportunities}</span>
                        </div>
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

                    <div className="company-actions">
                      <button className="view-jobs-btn">
                        View {company.jobs} Jobs
                      </button>
                      <button className="follow-btn">
                        <BookmarkSimple size={16} />
                        Follow
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <div className="careers-section">
            <div className="section-header">
              <h2>Career Path Explorer</h2>
              <p>Discover potential career progressions and the skills needed to advance</p>
            </div>

            <div className="career-paths-grid">
              {careerPaths.map((path, index) => (
                <div key={index} className="career-path-card">
                  <div className="current-role">
                    <h3>From: {path.current}</h3>
                    <span className="timeframe">{path.timeframe} progression</span>
                  </div>

                  <div className="progression-arrow">
                    <div className="arrow-line"></div>
                    <div className="arrow-head"></div>
                  </div>

                  <div className="next-roles">
                    <h4>Potential Next Steps:</h4>
                    <div className="roles-list">
                      {path.next.map((role, i) => (
                        <div key={i} className="next-role">
                          <Target size={16} />
                          <span>{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="skills-needed">
                    <h4>Skills to Develop:</h4>
                    <div className="skills-tags">
                      {path.skillsNeeded.map((skill, i) => (
                        <span key={i} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div className="salary-impact">
                    <div className="impact-metric">
                      <CurrencyDollar size={20} />
                      <div>
                        <span className="impact-label">Expected Salary Increase</span>
                        <span className="impact-value">{path.salaryIncrease}</span>
                      </div>
                    </div>
                  </div>

                  <div className="path-actions">
                    <button className="explore-btn">Explore Path</button>
                    <button className="skills-btn">Find Courses</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="career-insights">
              <h3>Career Market Insights</h3>
              <div className="insights-grid">
                <div className="insight-card">
                  <div className="insight-icon">
                    <TrendUp weight="duotone" size={24} />
                  </div>
                  <div className="insight-content">
                    <h4>Fastest Growing Roles</h4>
                    <p>AI/ML Engineers seeing 45% year-over-year demand increase</p>
                  </div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">
                    <Globe weight="duotone" size={24} />
                  </div>
                  <div className="insight-content">
                    <h4>Remote Work Trend</h4>
                    <p>68% of tech roles now offer remote or hybrid options</p>
                  </div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">
                    <GraduationCap weight="duotone" size={24} />
                  </div>
                  <div className="insight-content">
                    <h4>Skills in Demand</h4>
                    <p>Cloud computing and cybersecurity skills show highest ROI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="job-matcher-section">
            <h2>Personalized Job Recommendations</h2>
            
            {/* Enhanced Filters */}
            <div className="job-filters-section">
              <div className="filters-header">
                <h3>Find Your Perfect Match</h3>
                <button 
                  className="filters-toggle"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FunnelSimple size={16} />
                  Advanced Filters
                </button>
              </div>

              {showFilters && (
                <div className="advanced-filters">
                  <div className="filter-group">
                    <label>Salary Range</label>
                    <div className="salary-range-slider">
                      <input 
                        type="range" 
                        min="0" 
                        max="200000" 
                        value={salaryRange.min}
                        onChange={(e) => setSalaryRange({...salaryRange, min: parseInt(e.target.value)})}
                      />
                      <input 
                        type="range" 
                        min="0" 
                        max="200000" 
                        value={salaryRange.max}
                        onChange={(e) => setSalaryRange({...salaryRange, max: parseInt(e.target.value)})}
                      />
                      <div className="range-display">
                        ${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="filter-group">
                    <label>Location</label>
                    <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                      <option>All Locations</option>
                      <option>Remote</option>
                      <option>San Francisco, CA</option>
                      <option>New York, NY</option>
                      <option>Seattle, WA</option>
                      <option>Austin, TX</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Experience Level</label>
                    <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)}>
                      <option>All Levels</option>
                      <option>Entry Level</option>
                      <option>Mid Level</option>
                      <option>Senior Level</option>
                      <option>Executive</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            
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
                    disabled={userSkills.length === 0}
                  >
                    <MagnifyingGlass size={16} />
                    Find Matching Jobs
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
                <div className="recommendations-header">
                  <h3>Recommended Jobs ({jobRecommendations.length} matches)</h3>
                  <div className="sort-options">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="relevance">Sort by Relevance</option>
                      <option value="salary">Sort by Salary</option>
                      <option value="date">Sort by Date Posted</option>
                      <option value="company">Sort by Company</option>
                    </select>
                  </div>
                </div>
                <div className="job-cards">{jobRecommendations.map((job) => (
                    <div key={job.id} className="job-card enhanced">
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
                              {job.posted}
                            </span>
                          </div>
                        </div>
                        <div className="job-actions-header">
                          <div className="match-score">
                            <div className="match-percentage">{job.match}%</div>
                            <span>Match</span>
                          </div>
                          <div className="quick-actions">
                            <button className="save-job-btn" title="Save Job">
                              <BookmarkSimple size={16} />
                            </button>
                            <button className="share-job-btn" title="Share Job">
                              <Share size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="job-details">
                        <p className="job-description">{job.description}</p>
                        
                        <div className="job-highlights">
                          <div className="salary-info">
                            <CurrencyDollar size={16} />
                            <span>{job.salary}</span>
                          </div>
                          <div className="experience-level">
                            <GraduationCap size={16} />
                            <span>{job.experience}</span>
                          </div>
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
                                {userSkills.some(userSkill => 
                                  userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                                  skill.toLowerCase().includes(userSkill.toLowerCase())
                                ) && <span className="match-indicator">✓</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="job-benefits">
                          <h5>Benefits & Perks:</h5>
                          <div className="benefits-grid">
                            {job.benefits.map((benefit, index) => (
                              <div key={index} className="benefit-item">
                                <span className="benefit-icon">✓</span>
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="job-footer">
                          <div className="job-stats">
                            <span className="applicants">
                              <Users size={14} />
                              25+ applicants
                            </span>
                            <span className="urgency">
                              <Lightning size={14} />
                              Actively hiring
                            </span>
                          </div>
                          <div className="job-actions">
                            <button className="apply-btn primary">
                              Apply Now
                            </button>
                            <button className="learn-more-btn">
                              <Info size={16} />
                              Learn More
                            </button>
                          </div>
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

export default JobMarketInsights;
