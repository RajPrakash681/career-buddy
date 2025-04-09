import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import '../styles/News.css';
import { ArrowLeft, Calendar, Globe, ArrowCircleUp } from 'phosphor-react';
import { Link } from 'react-router-dom';

const News = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('technology');

  const categories = [
    'technology',
    'programming',
    'artificial-intelligence',
    'startup',
    'developer'
  ];

  const fetchNews = async (pageNum = 1, cat = category) => {
    setLoading(true);
    try {
      const today = new Date();
      const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
      const formattedDate = lastMonth.toISOString().split('T')[0];
      
      // Add multiple domain sources for variety
      const domains = 'techcrunch.com,theverge.com,wired.com,engadget.com,thenextweb.com';
      
      const response = await axios.get(
        `https://newsapi.org/v2/everything`, {
          params: {
            q: cat,
            from: formattedDate,
            to: new Date().toISOString().split('T')[0],
            domains: domains,
            sortBy: 'publishedAt',
            language: 'en',
            pageSize: 15, // Increased page size to filter duplicates
            page: pageNum,
            apiKey: '3199f0fbb25444a29646591d6bb65443'
          }
        }
      );
      
      // Filter out articles without images and remove duplicates
      const filteredArticles = response.data.articles
        .filter(article => article.urlToImage && article.urlToImage.startsWith('http'))
        .filter((article, index, self) => 
          index === self.findIndex(t => t.title === article.title)
        );

      if (pageNum === 1) {
        setNews(filteredArticles);
      } else {
        setNews(prev => {
          // Combine while avoiding duplicates
          const existingTitles = new Set(prev.map(a => a.title));
          const newArticles = filteredArticles.filter(a => !existingTitles.has(a.title));
          return [...prev, ...newArticles];
        });
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Add auto-refresh functionality
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (!loading) {
        fetchNews(1);
      }
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(refreshInterval);
  }, [loading, category]);

  useEffect(() => {
    fetchNews(1);
  }, [category]);

  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchNews(page + 1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <div className="news-page">
      <nav className="news-nav">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={24} weight="bold" />
          Back to Dashboard
        </Link>
        <h1>Tech News & Events</h1>
      </nav>

      <div className="news-container">
        <div className="categories-container">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${cat === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <>
            <div className="news-grid">
              {news.map((article, index) => (
                <article key={index} className="news-card">
                  <div className="news-image-container">
                    {article.urlToImage ? (
                      <img src={article.urlToImage} alt={article.title} />
                    ) : (
                      <div className="placeholder-image">
                        <Globe size={48} weight="thin" />
                      </div>
                    )}
                  </div>
                  <div className="news-content">
                    <div className="news-meta">
                      <span className="news-source">{article.source.name}</span>
                      <span className="news-date">
                        <Calendar size={14} />
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h2>{article.title}</h2>
                    <p>{article.description}</p>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                      Read More
                    </a>
                  </div>
                </article>
              ))}
            </div>
            
            {loading && (
              <div className="loading-container">
                <div className="loader"></div>
                <p>Loading more news...</p>
              </div>
            )}
            
            <button 
              className="load-more-btn"
              onClick={loadMore}
              disabled={loading}
            >
              Load More News
            </button>

            <button 
              className="scroll-top-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowCircleUp size={32} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default News;
