import axios from 'axios';

// Types for API responses
export interface JobListing {
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
}

export interface SalaryInsight {
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

export interface SkillTrend {
  name: string;
  demand: number;
  growth: number;
  averageSalary: number;
  jobCount: number;
  category: string;
}

export interface CompanyInfo {
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

class JobMarketAPI {
  private baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Your backend server
  
  // GitHub Jobs API (deprecated but can use for structure)
  private githubJobsURL = 'https://jobs.github.com/positions.json';
  
  // Alternative APIs
  private adzunaAPI = 'https://api.adzuna.com/v1/api/jobs';
  private adzunaAppId = process.env.REACT_APP_ADZUNA_APP_ID;
  private adzunaAppKey = process.env.REACT_APP_ADZUNA_APP_KEY;

  // Search jobs from multiple sources
  async searchJobs(params: {
    query?: string;
    location?: string;
    skills?: string[];
    salary_min?: number;
    salary_max?: number;
    job_type?: string;
    remote?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ jobs: JobListing[]; total: number; page: number }> {
    try {
      // Try your backend first
      const response = await axios.get(`${this.baseURL}/api/jobs/search`, {
        params,
        timeout: 10000
      });
      
      if (response.data?.jobs) {
        return response.data;
      }
    } catch (error) {
      console.warn('Backend API unavailable, using fallback data');
    }

    // Fallback to mock data or external APIs
    return this.getFallbackJobs(params);
  }

  // Get salary insights for specific roles
  async getSalaryInsights(params: {
    title?: string;
    location?: string;
    experience?: string;
  }): Promise<SalaryInsight[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/salaries`, {
        params,
        timeout: 10000
      });
      
      if (response.data?.salaries) {
        return response.data.salaries;
      }
    } catch (error) {
      console.warn('Salary API unavailable, using fallback data');
    }

    return this.getFallbackSalaryData(params);
  }

  // Get trending skills
  async getSkillTrends(category?: string): Promise<SkillTrend[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/skills/trends`, {
        params: { category },
        timeout: 10000
      });
      
      if (response.data?.skills) {
        return response.data.skills;
      }
    } catch (error) {
      console.warn('Skills API unavailable, using fallback data');
    }

    return this.getFallbackSkillsData();
  }

  // Get company information
  async getCompanyInfo(companyName?: string): Promise<CompanyInfo[]> {
    try {
      const response = await axios.get(`${this.baseURL}/api/companies`, {
        params: { name: companyName },
        timeout: 10000
      });
      
      if (response.data?.companies) {
        return response.data.companies;
      }
    } catch (error) {
      console.warn('Companies API unavailable, using fallback data');
    }

    return this.getFallbackCompanyData();
  }

  // Get job market statistics
  async getMarketStats(): Promise<{
    totalJobs: number;
    totalCompanies: number;
    averageSalary: number;
    growthRate: number;
    topSkills: string[];
    topLocations: string[];
  }> {
    try {
      const response = await axios.get(`${this.baseURL}/api/market/stats`, {
        timeout: 10000
      });
      
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.warn('Market stats API unavailable, using fallback data');
    }

    return {
      totalJobs: 2456789,
      totalCompanies: 89432,
      averageSalary: 127500,
      growthRate: 8.2,
      topSkills: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS'],
      topLocations: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Remote']
    };
  }

  // Search using Adzuna API (real job data)
  async searchAdzunaJobs(params: {
    query?: string;
    location?: string;
    page?: number;
  }): Promise<JobListing[]> {
    if (!this.adzunaAppId || !this.adzunaAppKey) {
      return [];
    }

    try {
      const response = await axios.get(`${this.adzunaAPI}/us/search/1`, {
        params: {
          app_id: this.adzunaAppId,
          app_key: this.adzunaAppKey,
          what: params.query || 'software developer',
          where: params.location || 'USA',
          results_per_page: 20,
          page: params.page || 0
        },
        timeout: 15000
      });

      return response.data.results?.map((job: any) => ({
        id: job.id.toString(),
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        salary: job.salary_min && job.salary_max ? {
          min: job.salary_min,
          max: job.salary_max,
          currency: 'USD'
        } : undefined,
        description: job.description,
        requirements: [],
        skills: this.extractSkillsFromDescription(job.description),
        type: this.determineJobType(job.title, job.description),
        remote: this.isRemoteJob(job.description),
        postedDate: job.created,
        source: 'Adzuna',
        url: job.redirect_url
      })) || [];
    } catch (error) {
      console.error('Adzuna API error:', error);
      return [];
    }
  }

  // Utility functions
  private extractSkillsFromDescription(description: string): string[] {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker',
      'Kubernetes', 'SQL', 'MongoDB', 'TypeScript', 'Angular', 'Vue.js',
      'Express', 'Django', 'Flask', 'Spring', 'Git', 'Jenkins', 'Linux'
    ];
    
    return commonSkills.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    );
  }

  private determineJobType(title: string, description: string): 'full-time' | 'part-time' | 'contract' | 'internship' {
    const fullText = `${title} ${description}`.toLowerCase();
    
    if (fullText.includes('intern')) return 'internship';
    if (fullText.includes('contract') || fullText.includes('freelance')) return 'contract';
    if (fullText.includes('part-time') || fullText.includes('part time')) return 'part-time';
    return 'full-time';
  }

  private isRemoteJob(description: string): boolean {
    const remoteKeywords = ['remote', 'work from home', 'distributed', 'anywhere'];
    return remoteKeywords.some(keyword => 
      description.toLowerCase().includes(keyword)
    );
  }

  // Fallback data when APIs are unavailable
  private async getFallbackJobs(params: any): Promise<{ jobs: JobListing[]; total: number; page: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockJobs: JobListing[] = [
      {
        id: '1',
        title: 'Senior React Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: { min: 120000, max: 160000, currency: 'USD' },
        description: 'We are looking for an experienced React developer to join our team...',
        requirements: ['5+ years React experience', 'TypeScript proficiency', 'Team leadership'],
        skills: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'AWS'],
        type: 'full-time',
        remote: false,
        postedDate: '2025-08-28T10:00:00Z',
        source: 'CareerBuddy',
        url: '#'
      },
      {
        id: '2',
        title: 'Python Data Scientist',
        company: 'DataFlow Analytics',
        location: 'Remote',
        salary: { min: 110000, max: 150000, currency: 'USD' },
        description: 'Join our data science team to analyze complex datasets...',
        requirements: ['3+ years Python', 'Machine Learning experience', 'Statistics background'],
        skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'TensorFlow'],
        type: 'full-time',
        remote: true,
        postedDate: '2025-08-27T14:30:00Z',
        source: 'CareerBuddy',
        url: '#'
      }
    ];

    return {
      jobs: mockJobs,
      total: mockJobs.length,
      page: params.page || 1
    };
  }

  private async getFallbackSalaryData(params: any): Promise<SalaryInsight[]> {
    return [
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
  }

  private async getFallbackSkillsData(): Promise<SkillTrend[]> {
    return [
      {
        name: 'React',
        demand: 95,
        growth: 35,
        averageSalary: 125000,
        jobCount: 15420,
        category: 'Frontend'
      },
      {
        name: 'Python',
        demand: 92,
        growth: 28,
        averageSalary: 135000,
        jobCount: 18950,
        category: 'Backend'
      }
    ];
  }

  private async getFallbackCompanyData(): Promise<CompanyInfo[]> {
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
        benefits: ['Health Insurance', 'Stock Options', 'Free Meals', '20% Time'],
        description: 'Leading technology company focused on search, cloud computing, and AI.'
      }
    ];
  }
}

export const jobMarketAPI = new JobMarketAPI();
