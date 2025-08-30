import { useState, useEffect } from 'react';
import { 
  TrendUp, TrendDown, Users, Briefcase, MapPin, 
  ChartBar, Clock, CurrencyDollar, Star, Buildings,
  ArrowUp, CaretUp, CaretDown,
  Plus, X, Sparkle, Target
} from 'phosphor-react';
import '../styles/JobMarketInsights.css';

// Import the job market API service
import { jobMarketAPI, JobListing } from '../services/jobMarketAPI';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  matchPercentage: number;
  requiredSkills: string[];
  optionalSkills: string[];
  salary: string;
  location: string;
  experience: string;
  description: string;
}

interface JobTrend {
  id: string;
  title: string;
  growth: number;
  demandLevel: 'High' | 'Medium' | 'Low';
  avgSalary: string;
  openings: number;
  category: string;
}

interface MarketData {
  totalJobs: number;
  newJobsToday: number;
  averageSalary: string;
  topGrowthSector: string;
  unemploymentRate: number;
}

const JobMarketInsights = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [marketData, setMarketData] = useState<MarketData>({
    totalJobs: 0,
    newJobsToday: 0,
    averageSalary: '$0',
    topGrowthSector: '',
    unemploymentRate: 0
  });

  // Skills-based job recommendation states
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categories = ['All', 'Technology', 'Healthcare', 'Finance', 'Marketing', 'Engineering'];
  const timeframes = [
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: '90', label: '3 Months' },
    { value: '365', label: '1 Year' }
  ];

  const jobTrends: JobTrend[] = [
    {
      id: '1',
      title: 'Software Engineer',
      growth: 15.3,
      demandLevel: 'High',
      avgSalary: '$95,000',
      openings: 12500,
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Data Scientist',
      growth: 22.8,
      demandLevel: 'High',
      avgSalary: '$110,000',
      openings: 8900,
      category: 'Technology'
    },
    {
      id: '3',
      title: 'Registered Nurse',
      growth: 18.5,
      demandLevel: 'High',
      avgSalary: '$75,000',
      openings: 15600,
      category: 'Healthcare'
    },
    {
      id: '4',
      title: 'Digital Marketing Manager',
      growth: 12.1,
      demandLevel: 'Medium',
      avgSalary: '$68,000',
      openings: 5400,
      category: 'Marketing'
    },
    {
      id: '5',
      title: 'Financial Analyst',
      growth: 8.7,
      demandLevel: 'Medium',
      avgSalary: '$82,000',
      openings: 7200,
      category: 'Finance'
    },
    {
      id: '6',
      title: 'Mechanical Engineer',
      growth: 6.2,
      demandLevel: 'Medium',
      avgSalary: '$88,000',
      openings: 4300,
      category: 'Engineering'
    },
    {
      id: '7',
      title: 'Cloud Architect',
      growth: 28.4,
      demandLevel: 'High',
      avgSalary: '$135,000',
      openings: 3800,
      category: 'Technology'
    },
    {
      id: '8',
      title: 'Physical Therapist',
      growth: 16.9,
      demandLevel: 'High',
      avgSalary: '$89,000',
      openings: 6700,
      category: 'Healthcare'
    }
  ];

  const topCompanies = [
    { name: 'Google', openings: 2341, growth: 12.5 },
    { name: 'Microsoft', openings: 1987, growth: 8.9 },
    { name: 'Amazon', openings: 3456, growth: 15.2 },
    { name: 'Apple', openings: 1654, growth: 6.7 },
    { name: 'Meta', openings: 1123, growth: 4.2 },
    { name: 'Tesla', openings: 987, growth: 18.9 }
  ];

  const locationData = [
    { city: 'San Francisco', avgSalary: '$125,000', openings: 15420, growth: 14.2 },
    { city: 'New York', avgSalary: '$115,000', openings: 18950, growth: 11.8 },
    { city: 'Seattle', avgSalary: '$110,000', openings: 12340, growth: 16.5 },
    { city: 'Austin', avgSalary: '$95,000', openings: 8760, growth: 22.1 },
    { city: 'Boston', avgSalary: '$108,000', openings: 9870, growth: 9.4 }
  ];

  // Sample job recommendations database
  const allJobRecommendations: JobRecommendation[] = [
    {
      id: '1',
      title: 'Full Stack Developer',
      company: 'TechCorp Inc.',
      matchPercentage: 95,
      requiredSkills: ['React', 'Node.js', 'JavaScript'],
      optionalSkills: ['TypeScript', 'MongoDB', 'AWS'],
      salary: '$85,000 - $120,000',
      location: 'Remote / San Francisco',
      experience: '2-4 years',
      description: 'Build scalable web applications using modern technologies.'
    },
    {
      id: '2',
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      matchPercentage: 88,
      requiredSkills: ['React', 'JavaScript', 'CSS'],
      optionalSkills: ['Vue.js', 'SASS', 'Webpack'],
      salary: '$70,000 - $95,000',
      location: 'New York',
      experience: '1-3 years',
      description: 'Create beautiful and responsive user interfaces.'
    },
    {
      id: '3',
      title: 'Python Developer',
      company: 'DataFlow Solutions',
      matchPercentage: 82,
      requiredSkills: ['Python', 'Django', 'PostgreSQL'],
      optionalSkills: ['Machine Learning', 'Docker', 'Redis'],
      salary: '$80,000 - $110,000',
      location: 'Austin',
      experience: '2-5 years',
      description: 'Develop robust backend systems and data processing pipelines.'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      matchPercentage: 75,
      requiredSkills: ['AWS', 'Docker', 'Kubernetes'],
      optionalSkills: ['Terraform', 'Jenkins', 'Python'],
      salary: '$90,000 - $130,000',
      location: 'Seattle',
      experience: '3-6 years',
      description: 'Manage cloud infrastructure and deployment pipelines.'
    },
    {
      id: '5',
      title: 'Data Scientist',
      company: 'AI Innovations',
      matchPercentage: 70,
      requiredSkills: ['Python', 'Machine Learning', 'SQL'],
      optionalSkills: ['R', 'TensorFlow', 'Spark'],
      salary: '$95,000 - $140,000',
      location: 'Boston',
      experience: '2-4 years',
      description: 'Analyze data and build predictive models.'
    }
  ];

  // Skills suggestion list
  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 
    'TypeScript', 'MongoDB', 'PostgreSQL', 'Machine Learning', 'CSS', 
    'HTML', 'Vue.js', 'Angular', 'Django', 'Flask', 'Kubernetes', 
    'Git', 'Java', 'C++', 'PHP', 'Ruby', 'Go', 'Rust'
  ];

  // Helper functions
  const addSkill = () => {
    if (skillInput.trim() && !userSkills.includes(skillInput.trim())) {
      setUserSkills([...userSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setUserSkills(userSkills.filter(skill => skill !== skillToRemove));
  };

  const calculateJobMatch = (jobSkills: string[], userSkillsList: string[]): number => {
    const matchingSkills = jobSkills.filter(skill => 
      userSkillsList.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    return Math.round((matchingSkills.length / jobSkills.length) * 100);
  };

  const analyzeJobsForSkills = async () => {
    if (userSkills.length === 0) return;
    
    setIsAnalyzing(true);
    setJobRecommendations([]);
    
    try {
      // Call the actual API to search for jobs based on skills
      const skillsQuery = userSkills.join(' ');
      const jobResults = await jobMarketAPI.searchJobs({
        query: skillsQuery,
        skills: userSkills,
        limit: 10
      });

      // Transform API results to JobRecommendation format
      const recommendations: JobRecommendation[] = jobResults.jobs.map(job => {
        const matchPercentage = calculateJobMatch(job.skills, userSkills);
        return {
          id: job.id,
          title: job.title,
          company: job.company,
          matchPercentage,
          requiredSkills: job.skills.slice(0, 5), // Take first 5 as required
          optionalSkills: job.skills.slice(5, 8), // Take next 3 as optional
          salary: job.salary ? `$${job.salary.min?.toLocaleString()} - $${job.salary.max?.toLocaleString()}` : 'Salary not specified',
          location: job.location,
          experience: job.type === 'internship' ? 'Entry level' : '2-4 years',
          description: job.description.substring(0, 150) + '...'
        };
      })
      .filter(job => job.matchPercentage > 20)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 5);

      // If no results from API, fall back to local recommendations
      if (recommendations.length === 0) {
        const fallbackRecommendations = allJobRecommendations
          .map(job => ({
            ...job,
            matchPercentage: calculateJobMatch([...job.requiredSkills, ...job.optionalSkills], userSkills)
          }))
          .filter(job => job.matchPercentage > 20)
          .sort((a, b) => b.matchPercentage - a.matchPercentage)
          .slice(0, 5);
        
        setJobRecommendations(fallbackRecommendations);
      } else {
        setJobRecommendations(recommendations);
      }
      
      setShowRecommendations(true);
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      
      // Fall back to local data on error
      const fallbackRecommendations = allJobRecommendations
        .map(job => ({
          ...job,
          matchPercentage: calculateJobMatch([...job.requiredSkills, ...job.optionalSkills], userSkills)
        }))
        .filter(job => job.matchPercentage > 20)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 5);
      
      setJobRecommendations(fallbackRecommendations);
      setShowRecommendations(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    // Simulate loading market data
    const timer = setTimeout(() => {
      setMarketData({
        totalJobs: 234567,
        newJobsToday: 1234,
        averageSalary: '$87,500',
        topGrowthSector: 'Technology',
        unemploymentRate: 3.2
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedTimeframe]);

  const filteredTrends = selectedCategory === 'All' 
    ? jobTrends 
    : jobTrends.filter(job => job.category === selectedCategory);

  const getDemandLevelColor = (level: string) => {
    switch (level) {
      case 'High': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="job-market-insights">
      <div className="insights-container">
        {/* Header */}
        <div className="insights-header">
          <h1>Job Market Insights</h1>
          <p>Real-time analysis of job market trends and opportunities</p>
        </div>

        {/* Market Overview Cards */}
        <div className="market-overview">
          <div className="overview-card">
            <div className="card-icon">
              <Briefcase size={28} weight="duotone" />
            </div>
            <div className="card-content">
              <h3>Total Job Openings</h3>
              <p className="metric">{marketData.totalJobs.toLocaleString()}</p>
              <span className="change positive">
                <CaretUp size={16} weight="fill" />
                +5.2% from last month
              </span>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">
              <Clock size={28} weight="duotone" />
            </div>
            <div className="card-content">
              <h3>New Jobs Today</h3>
              <p className="metric">{marketData.newJobsToday.toLocaleString()}</p>
              <span className="change positive">
                <CaretUp size={16} weight="fill" />
                +12.8% from yesterday
              </span>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">
              <CurrencyDollar size={28} weight="duotone" />
            </div>
            <div className="card-content">
              <h3>Average Salary</h3>
              <p className="metric">{marketData.averageSalary}</p>
              <span className="change positive">
                <CaretUp size={16} weight="fill" />
                +3.1% from last quarter
              </span>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-icon">
              <ChartBar size={28} weight="duotone" />
            </div>
            <div className="card-content">
              <h3>Unemployment Rate</h3>
              <p className="metric">{marketData.unemploymentRate}%</p>
              <span className="change negative">
                <CaretDown size={16} weight="fill" />
                -0.4% from last month
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="insights-filters">
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Timeframe:</label>
            <select 
              value={selectedTimeframe} 
              onChange={(e) => setSelectedTimeframe(e.target.value)}
            >
              {timeframes.map(timeframe => (
                <option key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills-Based Job Recommendations */}
        <div className="skills-job-matcher">
          <div className="matcher-header">
            <div className="header-content">
              <Sparkle size={32} weight="duotone" className="header-icon" />
              <div>
                <h2>Personalized Job Recommendations</h2>
                <p>Enter your skills to discover perfect job matches tailored for you</p>
              </div>
            </div>
          </div>

          <div className="skills-input-section">
            <div className="skill-input-container">
              <div className="input-wrapper">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill (e.g., JavaScript, Python, React...)"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} className="add-skill-btn">
                  <Plus size={20} weight="bold" />
                </button>
              </div>
              
              <div className="suggested-skills">
                <p>Popular skills:</p>
                <div className="skill-suggestions">
                  {suggestedSkills.slice(0, 8).map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        setSkillInput(skill);
                        addSkill();
                      }}
                      className="suggestion-chip"
                      disabled={userSkills.includes(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {userSkills.length > 0 && (
              <div className="user-skills">
                <h3>Your Skills:</h3>
                <div className="skills-list">
                  {userSkills.map(skill => (
                    <div key={skill} className="skill-tag">
                      <span>{skill}</span>
                      <button onClick={() => removeSkill(skill)}>
                        <X size={16} weight="bold" />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={analyzeJobsForSkills}
                  className="analyze-btn"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="spinner"></div>
                      Analyzing Jobs...
                    </>
                  ) : (
                    <>
                      <Target size={20} weight="duotone" />
                      Find My Perfect Jobs
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {showRecommendations && jobRecommendations.length > 0 && (
            <div className="job-recommendations">
              <h3>Recommended Jobs for You</h3>
              <div className="recommendations-grid">
                {jobRecommendations.map(job => (
                  <div key={job.id} className="recommendation-card">
                    <div className="card-header">
                      <div className="job-info">
                        <h4>{job.title}</h4>
                        <p className="company">{job.company}</p>
                      </div>
                      <div className="match-score">
                        <div className={`score-circle ${job.matchPercentage >= 80 ? 'high' : job.matchPercentage >= 60 ? 'medium' : 'low'}`}>
                          {job.matchPercentage}%
                        </div>
                        <span className="match-label">Match</span>
                      </div>
                    </div>
                    
                    <div className="job-details">
                      <div className="detail-row">
                        <MapPin size={16} weight="duotone" />
                        <span>{job.location}</span>
                      </div>
                      <div className="detail-row">
                        <CurrencyDollar size={16} weight="duotone" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="detail-row">
                        <Briefcase size={16} weight="duotone" />
                        <span>{job.experience}</span>
                      </div>
                    </div>

                    <p className="job-description">{job.description}</p>

                    <div className="skills-section">
                      <div className="required-skills">
                        <p className="skills-label">Required Skills:</p>
                        <div className="skills-tags">
                          {job.requiredSkills.map(skill => (
                            <span 
                              key={skill} 
                              className={`skill-tag ${userSkills.includes(skill) ? 'matched' : 'unmatched'}`}
                            >
                              {skill}
                              {userSkills.includes(skill) && <Star size={12} weight="fill" />}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {job.optionalSkills.length > 0 && (
                        <div className="optional-skills">
                          <p className="skills-label">Nice to Have:</p>
                          <div className="skills-tags">
                            {job.optionalSkills.map(skill => (
                              <span 
                                key={skill} 
                                className={`skill-tag optional ${userSkills.includes(skill) ? 'matched' : 'unmatched'}`}
                              >
                                {skill}
                                {userSkills.includes(skill) && <Star size={12} weight="fill" />}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button className="apply-btn">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Job Trends Table */}
        <div className="trends-section">
          <h2>Trending Job Roles</h2>
          <div className="trends-table">
            <div className="table-header">
              <div>Job Title</div>
              <div>Growth Rate</div>
              <div>Demand Level</div>
              <div>Avg Salary</div>
              <div>Open Positions</div>
            </div>
            
            {filteredTrends.map((trend) => (
              <div key={trend.id} className="table-row">
                <div className="job-title">
                  <strong>{trend.title}</strong>
                  <span className="category">{trend.category}</span>
                </div>
                
                <div className="growth-rate">
                  <span className={trend.growth > 0 ? 'positive' : 'negative'}>
                    {trend.growth > 0 ? <TrendUp size={16} /> : <TrendDown size={16} />}
                    {Math.abs(trend.growth)}%
                  </span>
                </div>
                
                <div className="demand-level">
                  <span 
                    className="demand-badge"
                    style={{ backgroundColor: getDemandLevelColor(trend.demandLevel) }}
                  >
                    {trend.demandLevel}
                  </span>
                </div>
                
                <div className="salary">{trend.avgSalary}</div>
                <div className="openings">{trend.openings.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="companies-section">
          <h2>Top Hiring Companies</h2>
          <div className="companies-grid">
            {topCompanies.map((company, index) => (
              <div key={index} className="company-card">
                <div className="company-info">
                  <Buildings size={24} weight="duotone" />
                  <div>
                    <h3>{company.name}</h3>
                    <p>{company.openings} open positions</p>
                  </div>
                </div>
                <div className="company-growth">
                  <span className="growth-indicator positive">
                    <ArrowUp size={16} />
                    {company.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Analysis */}
        <div className="location-section">
          <h2>Top Job Markets by Location</h2>
          <div className="location-grid">
            {locationData.map((location, index) => (
              <div key={index} className="location-card">
                <div className="location-header">
                  <MapPin size={20} weight="duotone" />
                  <h3>{location.city}</h3>
                </div>
                <div className="location-stats">
                  <div className="stat">
                    <span>Avg Salary</span>
                    <strong>{location.avgSalary}</strong>
                  </div>
                  <div className="stat">
                    <span>Job Openings</span>
                    <strong>{location.openings.toLocaleString()}</strong>
                  </div>
                  <div className="stat">
                    <span>Growth Rate</span>
                    <strong className="positive">+{location.growth}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="insights-summary">
          <h2>Key Market Insights</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <Star size={24} weight="duotone" />
              <h3>Fastest Growing Sector</h3>
              <p>Technology sector continues to lead with 28% average growth, driven by cloud computing and AI roles.</p>
            </div>
            
            <div className="insight-card">
              <Users size={24} weight="duotone" />
              <h3>Skills in Demand</h3>
              <p>Cloud architecture, data analysis, and digital marketing are the most sought-after skills this quarter.</p>
            </div>
            
            <div className="insight-card">
              <TrendUp size={24} weight="duotone" />
              <h3>Salary Trends</h3>
              <p>Average salaries have increased by 3.1% across all sectors, with tech leading at 8.5% growth.</p>
            </div>
            
            <div className="insight-card">
              <MapPin size={24} weight="duotone" />
              <h3>Remote Work Impact</h3>
              <p>65% of new job postings offer remote or hybrid options, expanding opportunities nationwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMarketInsights;
