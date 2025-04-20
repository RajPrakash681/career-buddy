import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Buildings, 
  Briefcase, 
  MapPin, 
  Money, 
  Clock, 
  MagnifyingGlass,
  Spinner
} from 'phosphor-react';
import '../styles/JobMarket.css';
import { AdzunaJob, AdzunaResponse } from '../types/adzuna';

const JobMarket: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const baseUrl = import.meta.env.VITE_ADZUNA_BASE_URL;
      const appId = import.meta.env.VITE_ADZUNA_APP_ID;
      const apiKey = import.meta.env.VITE_ADZUNA_API_KEY;
      const country = 'in'; // Changed to India

      const params = {
        app_id: appId,
        app_key: apiKey,
        results_per_page: '10',
        what: search || 'software',
      };

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${baseUrl}/${country}/search/1?${queryString}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data: AdzunaResponse = await response.json();
      setJobs(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(searchTerm);
  };

  const formatSalary = (min?: number, max?: number): string => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    if (min) return `From ₹${min.toLocaleString()}`;
    if (max) return `Up to ₹${max.toLocaleString()}`;
    return 'Salary not specified';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="job-market-page">
      <nav className="dashboard-nav">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={24} weight="bold" />
          Back to Dashboard
        </Link>
        <h1>Job Market</h1>
      </nav>

      <div className="job-market-content">
        <div className="search-filters-container">
          <form onSubmit={handleSearch} className="search-box">
            <MagnifyingGlass size={20} />
            <input
              type="text"
              placeholder="Search jobs, skills, or companies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="filters">
            <div className="filter-group">
              <label>Job Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <Spinner size={32} className="spinner" />
            <p>Loading jobs...</p>
          </div>
        ) : (
          <div className="job-listings">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-card-header">
                  <div className="job-title-company">
                    <h3>{job.title}</h3>
                    <div className="company-name">
                      <Buildings size={18} />
                      {job.company.display_name}
                    </div>
                  </div>
                  <a 
                    href={job.redirect_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-button"
                  >
                    Apply Now
                  </a>
                </div>

                <div className="job-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    {job.location.display_name}
                  </div>
                  {job.contract_type && (
                    <div className="detail-item">
                      <Briefcase size={16} />
                      {job.contract_type}
                    </div>
                  )}
                  <div className="detail-item">
                    <Money size={16} />
                    {formatSalary(job.salary_min, job.salary_max)}
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    {formatDate(job.created)}
                  </div>
                </div>

                <p className="job-description">{job.description}</p>

                {job.category && (
                  <div className="job-category">
                    <span className="category-tag">{job.category.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMarket;