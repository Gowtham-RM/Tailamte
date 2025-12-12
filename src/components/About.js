import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './About.css';

function About() {
  const [topOwners, setTopOwners] = useState([]);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [ownersError, setOwnersError] = useState('');
  const chartIds = useMemo(() => {
    const suffix = Math.random().toString(36).slice(2, 9);
    return {
      gradient: `ownerBarGradient-${suffix}`,
      title: `ownerChartTitle-${suffix}`
    };
  }, []);
  const ownersForChart = useMemo(() => topOwners.slice(0, 5), [topOwners]);

  useEffect(() => {
    let isMounted = true;
    const fetchTopOwners = async () => {
      try {
        setOwnersLoading(true);
        const { data } = await axios.get('http://localhost:5000/api/owners/top-rated?limit=5');
        if (!isMounted) return;
        const owners = Array.isArray(data?.owners) ? data.owners : [];
        setTopOwners(
          owners.map((owner) => ({
            ...owner,
            averageRating: Number(owner.averageRating) || 0,
            totalRatings: Number(owner.totalRatings) || 0
          }))
        );
        setOwnersError('');
      } catch (err) {
        if (!isMounted) return;
        setOwnersError('We could not load community ratings right now. Please try again later.');
        setTopOwners([]);
      } finally {
        if (isMounted) {
          setOwnersLoading(false);
        }
      }
    };

    fetchTopOwners();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="main-content">
      <div className="about-container fade-in">
        <div className="about-hero">
          <h1>About <span className="brand-highlight">TailMate</span></h1>
          <p className="hero-subtitle">Discover your new best friend! Adopt a loving pet and give them a forever home.</p>
        </div>

        <section className="why-adopt-section">
          <h2>Why Adopt from TailMate?</h2>
          <div className="why-adopt-grid">
            <div className="adopt-reason">
              <div className="adopt-icon">🐾</div>
              <h3>Save a Life</h3>
              <p>Every adoption saves a life and makes room for another pet in need. Be a hero in a pet's story.</p>
            </div>
            <div className="adopt-reason">
              <div className="adopt-icon">🏡</div>
              <h3>Perfect Companion</h3>
              <p>Find the ideal furry friend that matches your lifestyle and brings endless joy to your family.</p>
            </div>
            <div className="adopt-reason">
              <div className="adopt-icon">💖</div>
              <h3>Responsible Adoption</h3>
              <p>Support ethical pet adoption practices and help build a more compassionate community.</p>
            </div>
          </div>
        </section>

        <section className="about-mission">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p>
                At TailMate, we believe every pet deserves a loving forever home. Our mission is to
                revolutionize pet adoption by creating meaningful connections between animals in need
                and the perfect families ready to welcome them with open arms.
              </p>
              <p>
                We're more than just an adoption platform – we're a community of pet lovers, dedicated
                volunteers, and caring professionals working together to reduce pet homelessness and
                promote responsible pet ownership.
              </p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <span>🐕‍🦺🐱</span>
              </div>
            </div>
          </div>
        </section>

        <section className="top-owners-section">
          <div className="top-owners-header">
            <h2>Top Rated Owners</h2>
            <p>Celebrating the community members who go the extra mile for their pets.</p>
          </div>
          {ownersLoading ? (
            <p className="top-owners-message">Loading community highlights...</p>
          ) : ownersError ? (
            <p className="top-owners-message error">{ownersError}</p>
          ) : ownersForChart.length === 0 ? (
            <p className="top-owners-message">No owner ratings yet. Be the first to share your experience!</p>
          ) : (
            <div className="top-owners-card">
              {(() => {
                const owners = ownersForChart;
                const MAX_RATING = 5;
                const BAR_WIDTH = 80;
                const BAR_GAP = 40;
                const CHART_LEFT = 82;
                const CHART_RIGHT = 56;
                const CHART_TOP = 36;
                const CHART_BOTTOM = 110;
                const barCount = owners.length;
                const chartInnerWidth = Math.max(0, barCount * BAR_WIDTH + Math.max(barCount - 1, 0) * BAR_GAP);
                const chartInnerHeight = 240;
                const VIEWBOX_WIDTH = CHART_LEFT + chartInnerWidth + CHART_RIGHT;
                const VIEWBOX_HEIGHT = CHART_TOP + chartInnerHeight + CHART_BOTTOM;
                const chartBottom = CHART_TOP + chartInnerHeight;
                const ticks = Array.from({ length: MAX_RATING + 1 }, (_, idx) => idx);

                return (
                  <svg
                    className="owners-chart"
                    viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                    role="img"
                    aria-labelledby={chartIds.title}
                  >
                    <title id={chartIds.title}>Top rated owners bar chart showing average scores out of five stars</title>
                    <defs>
                      <linearGradient id={chartIds.gradient} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff6b6b" />
                        <stop offset="100%" stopColor="#ffa07a" />
                      </linearGradient>
                    </defs>

                    <line
                      className="owners-chart-axis"
                      x1={CHART_LEFT}
                      y1={CHART_TOP - 8}
                      x2={CHART_LEFT}
                      y2={chartBottom}
                    />

                    {ticks.map((tick) => {
                      const y = chartBottom - (tick / MAX_RATING) * chartInnerHeight;
                      const isBaseline = tick === 0;
                      return (
                        <g key={`tick-${tick}`}>
                          <line
                            className={isBaseline ? 'owners-chart-axis baseline' : 'owners-chart-grid-line'}
                            x1={CHART_LEFT}
                            y1={y}
                            x2={CHART_LEFT + chartInnerWidth}
                            y2={y}
                            strokeDasharray={isBaseline ? undefined : '6 10'}
                          />
                          <text
                            className="owners-chart-tick"
                            x={CHART_LEFT - 18}
                            y={y + 4}
                            textAnchor="end"
                          >
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    {owners.map((owner, index) => {
                      const rating = Math.round(Number(owner.averageRating || 0) * 10) / 10;
                      const barHeight = Math.max(0, Math.min(chartInnerHeight, (rating / MAX_RATING) * chartInnerHeight));
                      const barX = CHART_LEFT + index * (BAR_WIDTH + BAR_GAP);
                      const barY = chartBottom - barHeight;
                      const xCenter = barX + BAR_WIDTH / 2;
                      const ratingCount = owner.totalRatings || 0;
                      const ownerName = owner.name || 'Owner';
                      const ratingLabel = `${rating.toFixed(1)}★`;
                      const countLabel = `${ratingCount} ${ratingCount === 1 ? 'rating' : 'ratings'}`;
                      return (
                        <g key={owner.ownerId || index}>
                          <rect
                            className="owners-chart-bar"
                            x={barX}
                            y={barY}
                            width={BAR_WIDTH}
                            height={barHeight}
                            rx={BAR_WIDTH / 2.8}
                            ry={BAR_WIDTH / 2.8}
                            fill={`url(#${chartIds.gradient})`}
                          />
                          <text
                            className="owners-chart-value"
                            x={xCenter}
                            y={barY - 12}
                            textAnchor="middle"
                          >
                            {ratingLabel}
                          </text>
                          <text
                            className="owners-chart-xlabel"
                            x={xCenter}
                            y={chartBottom + 28}
                            textAnchor="middle"
                          >
                            #{index + 1} {ownerName}
                          </text>
                          <text
                            className="owners-chart-meta axis"
                            x={xCenter}
                            y={chartBottom + 46}
                            textAnchor="middle"
                          >
                            {countLabel}
                          </text>
                        </g>
                      );
                    })}

                    <line
                      className="owners-chart-axis baseline"
                      x1={CHART_LEFT}
                      y1={chartBottom}
                      x2={CHART_LEFT + chartInnerWidth}
                      y2={chartBottom}
                    />
                  </svg>
                );
              })()}
              <p className="top-owners-footnote">Ratings come from completed adoptions where users rated their experience.</p>
            </div>
          )}
        </section>

        <section className="about-values">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">💝</div>
              <h3>Compassion First</h3>
              <p>Every decision we make is guided by compassion for animals and the people who love them.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Trust & Transparency</h3>
              <p>We believe in honest communication and building trust through transparent adoption processes.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Excellence</h3>
              <p>We strive for excellence in everything we do, from pet care to customer service.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Community Impact</h3>
              <p>We're committed to making a positive impact in our community and beyond.</p>
            </div>
          </div>
        </section>

        <section className="about-team">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-photo">👩‍⚕️</div>
              <h3>Dr. Sarah Johnson</h3>
              <p className="member-role">Chief Veterinarian & Co-Founder</p>
              <p>With 15 years of veterinary experience, Dr. Johnson ensures all our pets receive the best medical care.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">👨‍💼</div>
              <h3>Mike Chen</h3>
              <p className="member-role">CEO & Co-Founder</p>
              <p>A former tech executive turned animal advocate, Mike leads our mission to modernize pet adoption.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">👩‍💻</div>
              <h3>Emily Rodriguez</h3>
              <p className="member-role">Head of Operations</p>
              <p>Emily coordinates with shelters nationwide to ensure smooth adoption processes and happy outcomes.</p>
            </div>
            <div className="team-member">
              <div className="member-photo">👨‍🎨</div>
              <h3>Alex Thompson</h3>
              <p className="member-role">Community Manager</p>
              <p>Alex builds relationships with adopters and provides ongoing support for new pet parents.</p>
            </div>
          </div>
        </section>

        <section className="about-impact">
          <h2>Our Impact</h2>
          <div className="impact-stats">
            <div className="stat-item">
              <div className="stat-number">15,000+</div>
              <div className="stat-label">Pets Adopted</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Partner Shelters</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="cta-content">
            <h2>Ready to Find Your Perfect Pet?</h2>
            <p>Join thousands of happy families who found their furry friends through TailMate.</p>
            <div className="cta-buttons">
              <Link to="/pets" className="btn btn-primary">Browse Pets</Link>
              <Link to="/signup" className="btn btn-secondary">Join Our Community</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default About;
