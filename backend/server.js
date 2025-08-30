import express from "express"; 
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();
let port = 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5177', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Adzuna API credentials (you'll need to get these from https://developer.adzuna.com/)
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const formattedPrompt = `Provide a structured response following these exact rules:

    FORMAT RULES:
    1. Start with a one-line summary
    2. Use sequential numbers for main points (1., 2., 3.)
    3. Use decimal numbers for sub-points (>, >, >, >)
    4. Put key terms in UPPERCASE
    5. Indent examples with "Example:" prefix
    6. Keep each point concise (max 2 lines)
    7. Add line breaks between main points
    8. Maximum 5 main points
    9. Maximum 3 sub-points per main point
    10. End with a one-line conclusion

    RESPONSE STRUCTURE:
    [One-line summary]

    1. [First main point]
       1.1. [Sub-point]
       1.2. [Sub-point]
       Example: [Specific example]

    2. [Second main point]
       2.1. [Sub-point]
       2.2. [Sub-point]

    [One-line conclusion]

    Question: ${message}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: formattedPrompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      res.json({ response: data.candidates[0].content.parts[0].text });
    } else {
      console.error("Invalid API Response:", data);
      res.status(500).json({ error: "Invalid response from Gemini API" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch response from Gemini API" });
  }
});

// Job Market API Endpoints

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Search Jobs API
app.get('/api/jobs/search', async (req, res) => {
  try {
    const { 
      query = 'software developer',
      location = 'USA',
      skills = [],
      salary_min,
      salary_max,
      job_type,
      remote,
      page = 0,
      limit = 20
    } = req.query;

    let jobs = [];

    // Try Adzuna API first
    if (ADZUNA_APP_ID && ADZUNA_APP_KEY) {
      try {
        const adzunaResponse = await fetch(
          `https://api.adzuna.com/v1/api/jobs/us/search/${page}?` +
          `app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&` +
          `what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&` +
          `results_per_page=${limit}`
        );
        
        if (adzunaResponse.ok) {
          const adzunaData = await adzunaResponse.json();
          jobs = adzunaData.results?.map(job => ({
            id: job.id.toString(),
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            salary: job.salary_min && job.salary_max ? {
              min: job.salary_min,
              max: job.salary_max,
              currency: 'USD'
            } : null,
            description: job.description,
            requirements: extractRequirements(job.description),
            skills: extractSkills(job.description),
            type: determineJobType(job.title, job.description),
            remote: isRemoteJob(job.description),
            postedDate: job.created,
            source: 'Adzuna',
            url: job.redirect_url
          })) || [];
        }
      } catch (adzunaError) {
        console.log('Adzuna API error:', adzunaError.message);
      }
    }

    // If no results from external APIs, provide fallback data
    if (jobs.length === 0) {
      jobs = getFallbackJobs(query, location, skills);
    }

    // Apply filters
    if (salary_min) jobs = jobs.filter(job => job.salary?.min >= parseInt(salary_min));
    if (salary_max) jobs = jobs.filter(job => job.salary?.max <= parseInt(salary_max));
    if (job_type) jobs = jobs.filter(job => job.type === job_type);
    if (remote === 'true') jobs = jobs.filter(job => job.remote);
    if (skills.length > 0) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      jobs = jobs.filter(job => 
        skillsArray.some(skill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    res.json({
      jobs: jobs.slice(0, limit),
      total: jobs.length,
      page: parseInt(page),
      hasMore: jobs.length > limit
    });

  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ error: 'Failed to search jobs', message: error.message });
  }
});

// Salary Insights API
app.get('/api/salaries', async (req, res) => {
  try {
    const { title, location, experience } = req.query;
    
    const salaryData = getSalaryInsights(title, location, experience);
    
    res.json({ salaries: salaryData });
  } catch (error) {
    console.error('Salary insights error:', error);
    res.status(500).json({ error: 'Failed to get salary insights' });
  }
});

// Skills Trends API
app.get('/api/skills/trends', async (req, res) => {
  try {
    const { category } = req.query;
    
    const skillsData = getSkillsTrends(category);
    
    res.json({ skills: skillsData });
  } catch (error) {
    console.error('Skills trends error:', error);
    res.status(500).json({ error: 'Failed to get skills trends' });
  }
});

// Companies API
app.get('/api/companies', async (req, res) => {
  try {
    const { name, industry, size } = req.query;
    
    let companies = getTopCompanies();
    
    if (name) {
      companies = companies.filter(company => 
        company.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    if (industry) {
      companies = companies.filter(company => 
        company.industry.toLowerCase() === industry.toLowerCase()
      );
    }
    
    res.json({ companies });
  } catch (error) {
    console.error('Companies API error:', error);
    res.status(500).json({ error: 'Failed to get companies data' });
  }
});

// Market Statistics API
app.get('/api/market/stats', async (req, res) => {
  try {
    const stats = getMarketStatistics();
    res.json(stats);
  } catch (error) {
    console.error('Market stats error:', error);
    res.status(500).json({ error: 'Failed to get market statistics' });
  }
});

// Helper Functions
function extractSkills(description) {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker',
    'Kubernetes', 'SQL', 'MongoDB', 'TypeScript', 'Angular', 'Vue.js',
    'Express', 'Django', 'Flask', 'Spring', 'Git', 'Jenkins', 'Linux',
    'HTML', 'CSS', 'PostgreSQL', 'Redis', 'GraphQL', 'REST API',
    'Microservices', 'CI/CD', 'Terraform', 'Azure', 'GCP'
  ];
  
  return commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractRequirements(description) {
  const requirements = [];
  const lines = description.split('\n');
  
  lines.forEach(line => {
    if (line.toLowerCase().includes('require') || 
        line.toLowerCase().includes('must have') ||
        line.toLowerCase().includes('experience')) {
      requirements.push(line.trim());
    }
  });
  
  return requirements.slice(0, 5); // Limit to 5 requirements
}

function determineJobType(title, description) {
  const fullText = `${title} ${description}`.toLowerCase();
  
  if (fullText.includes('intern')) return 'internship';
  if (fullText.includes('contract') || fullText.includes('freelance')) return 'contract';
  if (fullText.includes('part-time') || fullText.includes('part time')) return 'part-time';
  return 'full-time';
}

function isRemoteJob(description) {
  const remoteKeywords = ['remote', 'work from home', 'distributed', 'anywhere', 'telecommute'];
  return remoteKeywords.some(keyword => 
    description.toLowerCase().includes(keyword)
  );
}

function getFallbackJobs(query, location, skills) {
  const mockJobs = [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: { min: 120000, max: 160000, currency: 'USD' },
      description: 'We are looking for an experienced React developer to join our innovative team. You will work on cutting-edge web applications using React, TypeScript, and modern development tools.',
      requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership skills', 'Agile development experience'],
      skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'AWS', 'Git'],
      type: 'full-time',
      remote: false,
      postedDate: new Date().toISOString(),
      source: 'CareerBuddy',
      url: '#'
    },
    {
      id: '2',
      title: 'Python Data Scientist',
      company: 'DataFlow Analytics',
      location: 'Remote',
      salary: { min: 110000, max: 150000, currency: 'USD' },
      description: 'Join our data science team to analyze complex datasets and build machine learning models. Work with Python, pandas, scikit-learn, and modern ML frameworks.',
      requirements: ['3+ years Python experience', 'Machine Learning background', 'Statistics knowledge', 'SQL proficiency'],
      skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow', 'AWS'],
      type: 'full-time',
      remote: true,
      postedDate: new Date(Date.now() - 86400000).toISOString(),
      source: 'CareerBuddy',
      url: '#'
    },
    {
      id: '3',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Austin, TX',
      salary: { min: 90000, max: 130000, currency: 'USD' },
      description: 'Build scalable web applications from frontend to backend. Work with React, Node.js, PostgreSQL, and cloud technologies.',
      requirements: ['Full-stack development experience', 'Database design skills', 'API development', 'Startup experience preferred'],
      skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      type: 'full-time',
      remote: false,
      postedDate: new Date(Date.now() - 172800000).toISOString(),
      source: 'CareerBuddy',
      url: '#'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Seattle, WA',
      salary: { min: 100000, max: 140000, currency: 'USD' },
      description: 'Manage and optimize cloud infrastructure. Work with Kubernetes, Docker, AWS, and CI/CD pipelines.',
      requirements: ['DevOps experience', 'Kubernetes knowledge', 'CI/CD pipeline setup', 'Cloud platform expertise'],
      skills: ['Kubernetes', 'Docker', 'AWS', 'Jenkins', 'Terraform', 'Linux'],
      type: 'full-time',
      remote: true,
      postedDate: new Date(Date.now() - 259200000).toISOString(),
      source: 'CareerBuddy',
      url: '#'
    },
    {
      id: '5',
      title: 'UX Designer',
      company: 'Design Studio Pro',
      location: 'New York, NY',
      salary: { min: 75000, max: 105000, currency: 'USD' },
      description: 'Create beautiful and intuitive user experiences. Work with Figma, conduct user research, and collaborate with development teams.',
      requirements: ['UX design portfolio', 'Figma proficiency', 'User research experience', 'Prototyping skills'],
      skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'HTML', 'CSS'],
      type: 'full-time',
      remote: false,
      postedDate: new Date(Date.now() - 345600000).toISOString(),
      source: 'CareerBuddy',
      url: '#'
    }
  ];

  // Filter by query
  if (query && query !== 'software developer') {
    return mockJobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
  }

  return mockJobs;
}

function getSalaryInsights(title, location, experience) {
  const baseSalaries = {
    'software engineer': { min: 80000, max: 160000, avg: 120000 },
    'data scientist': { min: 90000, max: 170000, avg: 130000 },
    'product manager': { min: 100000, max: 180000, avg: 140000 },
    'ux designer': { min: 60000, max: 120000, avg: 90000 },
    'devops engineer': { min: 85000, max: 150000, avg: 117500 }
  };

  const locationMultipliers = {
    'san francisco': 1.3,
    'new york': 1.2,
    'seattle': 1.15,
    'austin': 1.05,
    'remote': 1.0
  };

  const experienceMultipliers = {
    'entry': 0.8,
    'mid': 1.0,
    'senior': 1.3,
    'staff': 1.6
  };

  const salaryData = [];
  const roles = title ? [title.toLowerCase()] : Object.keys(baseSalaries);

  roles.forEach(role => {
    if (baseSalaries[role]) {
      const base = baseSalaries[role];
      const locMultiplier = locationMultipliers[location?.toLowerCase()] || 1.0;
      const expMultiplier = experienceMultipliers[experience?.toLowerCase()] || 1.0;
      
      const multiplier = locMultiplier * expMultiplier;
      
      salaryData.push({
        title: role.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        location: location || 'National Average',
        averageSalary: Math.round(base.avg * multiplier),
        salaryRange: {
          min: Math.round(base.min * multiplier),
          max: Math.round(base.max * multiplier)
        },
        experience: experience || 'All Levels',
        trend: Math.random() > 0.3 ? 'up' : 'stable',
        trendPercentage: Math.round(Math.random() * 15 + 2),
        sampleSize: Math.round(Math.random() * 2000 + 500)
      });
    }
  });

  return salaryData;
}

function getSkillsTrends(category) {
  const allSkills = [
    { name: 'React', demand: 95, growth: 35, avgSalary: 125000, jobCount: 15420, category: 'Frontend' },
    { name: 'Python', demand: 92, growth: 28, avgSalary: 135000, jobCount: 18950, category: 'Backend' },
    { name: 'JavaScript', demand: 88, growth: 20, avgSalary: 115000, jobCount: 22340, category: 'Frontend' },
    { name: 'AWS', demand: 90, growth: 40, avgSalary: 145000, jobCount: 12890, category: 'Cloud' },
    { name: 'Node.js', demand: 85, growth: 25, avgSalary: 125000, jobCount: 11200, category: 'Backend' },
    { name: 'TypeScript', demand: 82, growth: 45, avgSalary: 130000, jobCount: 9870, category: 'Frontend' },
    { name: 'Docker', demand: 78, growth: 38, avgSalary: 135000, jobCount: 8950, category: 'DevOps' },
    { name: 'Kubernetes', demand: 75, growth: 42, avgSalary: 145000, jobCount: 6780, category: 'DevOps' },
    { name: 'Machine Learning', demand: 88, growth: 50, avgSalary: 155000, jobCount: 7650, category: 'AI/ML' },
    { name: 'Figma', demand: 75, growth: 30, avgSalary: 95000, jobCount: 5430, category: 'Design' },
    { name: 'SQL', demand: 85, growth: 15, avgSalary: 105000, jobCount: 16780, category: 'Database' },
    { name: 'PostgreSQL', demand: 70, growth: 20, avgSalary: 115000, jobCount: 8900, category: 'Database' }
  ];

  if (category) {
    return allSkills.filter(skill => 
      skill.category.toLowerCase() === category.toLowerCase()
    );
  }

  return allSkills;
}

function getTopCompanies() {
  return [
    {
      name: 'Google',
      rating: 4.6,
      reviewCount: 12543,
      industry: 'Technology',
      size: '100,000+ employees',
      headquarters: 'Mountain View, CA',
      openPositions: 1250,
      averageSalary: 165000,
      benefits: ['Health Insurance', 'Stock Options', 'Free Meals', '20% Time', 'Learning Budget'],
      description: 'Leading technology company focused on search, cloud computing, and artificial intelligence.'
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
      benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget', 'Remote Work', 'Stock Options'],
      description: 'Global technology company developing software, services, and devices.'
    },
    {
      name: 'Meta',
      rating: 4.3,
      reviewCount: 6745,
      industry: 'Social Media',
      size: '50,000+ employees',
      headquarters: 'Menlo Park, CA',
      openPositions: 650,
      averageSalary: 175000,
      benefits: ['Stock Options', 'Wellness Programs', 'Parental Leave', 'Free Transportation'],
      description: 'Social technology company connecting people through apps and virtual reality.'
    },
    {
      name: 'Amazon',
      rating: 4.1,
      reviewCount: 15678,
      industry: 'E-commerce',
      size: '1,000,000+ employees',
      headquarters: 'Seattle, WA',
      openPositions: 2100,
      averageSalary: 145000,
      benefits: ['Health Insurance', 'Stock Options', 'Career Choice Program', 'Parental Leave'],
      description: 'Global e-commerce and cloud computing company.'
    },
    {
      name: 'Apple',
      rating: 4.4,
      reviewCount: 9876,
      industry: 'Technology',
      size: '100,000+ employees',
      headquarters: 'Cupertino, CA',
      openPositions: 890,
      averageSalary: 162000,
      benefits: ['Health Insurance', 'Stock Options', 'Product Discounts', 'Wellness Programs'],
      description: 'Technology company designing and manufacturing consumer electronics and software.'
    }
  ];
}

function getMarketStatistics() {
  return {
    totalJobs: 2456789,
    totalCompanies: 89432,
    averageSalary: 127500,
    growthRate: 8.2,
    topSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'SQL', 'Docker'],
    topLocations: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Remote', 'Los Angeles'],
    industryGrowth: {
      'Technology': 12.5,
      'Healthcare': 8.9,
      'Finance': 6.2,
      'E-commerce': 15.3,
      'Education': 4.7
    },
    remoteJobsPercentage: 68,
    averageTimeToHire: 23 // days
  };
}

app.get('/api/hackathons/devpost', async (req, res) => {
  try {
    const response = await fetch('https://devpost.com/api/hackathons');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hackathons/mlh', async (req, res) => {
  try {
    const response = await fetch('https://mlh.io/events/api');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/hackathons/hackerearth', async (req, res) => {
  try {
    const response = await fetch('https://www.hackerearth.com/challenges/api/');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const startServer = (retryCount = 0) => {
  const server = app.listen(port, '127.0.0.1')
    .on('listening', () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Health check: http://localhost:${port}/api/health`);
      console.log(`Job search: http://localhost:${port}/api/jobs/search`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && retryCount < 3) {
        console.log(`Port ${port} is in use, trying port ${port + 1}`);
        port++;
        startServer(retryCount + 1);
      } else {
        console.error('Failed to start server:', err.message);
        process.exit(1);
      }
    });
};

startServer();