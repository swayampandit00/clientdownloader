import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mainNavRef = useRef(null);
  const menuToggleRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu if clicking outside nav on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mainNavRef.current &&
        !mainNavRef.current.contains(event.target) &&
        menuToggleRef.current &&
        !menuToggleRef.current.contains(event.target) &&
        menuOpen
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  // Close menu when a nav item is clicked (for better mobile UX)
  const handleNavItemClick = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVideoData(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ video_url: videoUrl })
      });
      if (!response.ok) {
        let errorMessage = 'Failed to fetch video data';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // ignore JSON parse error
        }
        throw new Error(errorMessage);
      }
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      const data = JSON.parse(text);
      setVideoData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header>
        <div className="logo">
          <span className="blue">All</span>
          <strong>Video</strong>
          <span className="blue">Saver</span>
          <strong>.su</strong>
        </div>
        <button
          aria-label="Toggle menu"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mainNav"
          onClick={toggleMenu}
          ref={menuToggleRef}
          type="button"
        >
          {/* Hamburger icon using SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span className="sr-only">Menu</span>
        </button>
        <nav
          id="mainNav"
          aria-label="Primary navigation"
          className={menuOpen ? 'open' : ''}
          ref={mainNavRef}
        >
          <div onClick={handleNavItemClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleNavItemClick(); } }} role="button" tabIndex={0}>Downloader</div>
          <div onClick={handleNavItemClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleNavItemClick(); } }} role="button" tabIndex={0}>Converter</div>
          <div onClick={handleNavItemClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleNavItemClick(); } }} role="button" tabIndex={0}>
            More <i className="fas fa-chevron-down dropdown-arrow" aria-hidden="true"></i>
          </div>
          <div onClick={handleNavItemClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleNavItemClick(); } }} role="button" tabIndex={0}>
            English <i className="fas fa-chevron-down dropdown-arrow" aria-hidden="true"></i>
          </div>
          <button className="btn-share" type="button" onClick={handleNavItemClick}>
            Share
          </button>
        </nav>
      </header>
      <main>
        <section className="left-section">
          <h1>
            <strong>Online video </strong>
            <span className="blue">downloader</span>
            <strong> and <br />
            converter</strong>
          </h1>
          <p className="description">
            Free online video downloader for Vimeo, Dailymotion, Twitter, Tiktok, Instagram, Facebook and{' '}
            <a href="#">many other sites</a>.
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Paste the video link here"
              aria-label="Paste the video link here"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              required
            />
            <button type="submit" className="start-btn" disabled={loading}>
              {loading ? 'Loading...' : 'Start'}
            </button>
          </form>
          
          <p className="disclaimer">
            Downloading any copyrighted materials is strictly prohibited, please read our{' '}
            <a href="#">Terms of Service</a>.
          </p>
        </section>
        <aside
          className="right-section"
          aria-label="Save Videos from Popular Sites with VideoProc Converter AI"
        >
          <strong>
            Save Videos from Popular Sites with <br />
            <span className="highlight-orange">VideoProc Converter AI</span>
          </strong>
          <hr />
          <ul>
            <li>
              <i className="fas fa-check-circle check-icon"></i>
              <strong>Bulk download</strong> in 4K/HD quality.
            </li>
            <li>
              <i className="fas fa-check-circle check-icon"></i>
              Video to <strong>MP4, AAC, MP3</strong>, etc.
            </li>
            <li>
              <i className="fas fa-check-circle check-icon"></i>
              <a href="#">Compress</a>, <a href="#">AI Upscale 1080p to 4K</a>.
            </li>
          </ul>
          <button className="btn-get-started">Get Started for Free</button>
        </aside>
      </main>
      <div>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          {videoData && (
            <div className="video-info">
              <h2>{videoData.title}</h2>
              <img src={videoData.thumbnail} alt={videoData.title} style={{ maxWidth: '300px' }} />
              <h3>Available Formats:</h3>
              <ul>
                {videoData.formats.map((format, index) => (
                  <li key={index}>
                    {format.format_name} ({format.extension}) - <a href={format.url} target="_blank" rel="noopener noreferrer">Download</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

      </div>
    </>
  );
};

export default Navbar;
