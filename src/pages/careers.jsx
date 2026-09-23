"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../styles/careers.css"

const API = 'https://khidmat.hamdardhaath.org/api';

export default function Careers() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [showAllVolunteer, setShowAllVolunteer] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);

  useEffect(() => {
    fetch(`${API}/jobs`)
      .then(r => r.json())
      .then(d => { if (d.success) setJobs(d.data); })
      .catch(() => {});
  }, []);

  const volunteerJobs = jobs.filter(j => j.type === 'Volunteer');
  const staffJobs = jobs.filter(j => j.type !== 'Volunteer');
  const highPriorityJobs = jobs.filter(j => j.priority === 'High');

  const displayedVolunteer = showAllVolunteer ? volunteerJobs : volunteerJobs.slice(0, 3);
  const displayedStaff = showAllStaff ? staffJobs : staffJobs.slice(0, 4);

  return (
    <>
      <Header />
      <div className="careers-container">

        {/* Hero */}
        <section className="careers-hero">
          <div className="careers-hero-content">
            <h1 className="careers-hero-title">Join the Hamdard Haath Team</h1>
            <p className="careers-hero-text">Open for short-term volunteers and support staff</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="careers-hero-button" onClick={() => document.getElementById('opportunities').scrollIntoView({ behavior: 'smooth' })}>
                Explore Opportunities
              </button>
              <button
                onClick={() => navigate('/volunteer_reg')}
                style={{ background: '#fff', color: '#0f4c75', border: '2px solid #fff', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                Apply to be a Volunteer
              </button>
            </div>
          </div>
          <div className="careers-hero-image">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yBRkRjAF0Cpgo2I74moVR1HFRsk8AI.png"
              alt="Team collaboration"
            />
          </div>
        </section>

        {/* ── HIGH PRIORITY POSITIONS ── */}
        {highPriorityJobs.length > 0 && (
          <section style={{ background: '#fffbeb', borderTop: '3px solid #f59e0b', borderBottom: '1px solid #fde68a', padding: '32px 24px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 20 }}>🔥</span>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#92400e' }}>High Priority Positions</h2>
                <span style={{ background: '#f59e0b', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>URGENT</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {highPriorityJobs.map(j => (
                  <div key={j.job_id} style={{ background: '#fff', borderRadius: 12, padding: '20px 22px', border: '1px solid #fde68a', boxShadow: '0 2px 8px rgba(245,158,11,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{j.title}</h3>
                      <span style={{ background: '#fef3c7', color: '#d97706', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap', marginLeft: 8 }}>HIGH PRIORITY</span>
                    </div>
                    <span style={{ background: '#f1f5f9', color: '#475569', fontSize: 11, padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginBottom: 10 }}>{j.type}</span>
                    {j.description && <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px', lineHeight: 1.5 }}>{j.description}</p>}
                    {j.requirements && (
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 14px' }}>
                        <strong>Requirements:</strong> {j.requirements}
                      </p>
                    )}
                    <button onClick={() => navigate('/volunteer_reg')}
                      style={{ width: '100%', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 8, padding: '9px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── EXPLORE OPPORTUNITIES (Volunteer) ── */}
        <section className="careers-opportunities" id="opportunities">
          <h2 className="careers-section-title">Explore Opportunities</h2>

          {/* Apply to be a Volunteer card — always shown first */}
          <div style={{ maxWidth: 1100, margin: '0 auto 24px', padding: '0 16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f4c75, #1eb2a6)', borderRadius: 14, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: '0 0 6px' }}>Become a Volunteer</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0 }}>Join our team and make a difference in your community</p>
              </div>
              <button onClick={() => navigate('/volunteer_reg')}
                style={{ background: '#fff', color: '#0f4c75', border: 'none', borderRadius: 10, padding: '11px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Apply to be a Volunteer →
              </button>
            </div>
          </div>

          {/* Dynamic volunteer positions from DB */}
          {volunteerJobs.length > 0 && (
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
              <div className="careers-opps-grid">
                {displayedVolunteer.map(j => (
                  <div key={j.job_id} className="careers-opp-card">
                    <div className="careers-opp-icon careers-icon-volunteer">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <polyline points="17 11 19 13 23 9" />
                      </svg>
                    </div>
                    {j.priority === 'High' && (
                      <span style={{ background: '#fef3c7', color: '#d97706', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginBottom: 6 }}>HIGH PRIORITY</span>
                    )}
                    <h3 className="careers-opp-title">{j.title}</h3>
                    {j.description && <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>{j.description}</p>}
                    {j.requirements && (
                      <ul className="careers-opp-list">
                        {j.requirements.split(',').map((r, i) => <li key={i}>{r.trim()}</li>)}
                      </ul>
                    )}
                    <div className="careers-opp-tags">
                      <span className="careers-tag">{j.type}</span>
                    </div>
                    <button className="careers-opp-button" onClick={() => navigate('/volunteer_reg')}>
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
              {volunteerJobs.length > 3 && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <button onClick={() => setShowAllVolunteer(!showAllVolunteer)}
                    style={{ background: 'none', border: '1px dashed #cbd5e1', borderRadius: 10, padding: '10px 28px', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
                    {showAllVolunteer ? 'Show Less' : `View All ${volunteerJobs.length} Volunteer Positions`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Static cards if no dynamic volunteer jobs */}
          {volunteerJobs.length === 0 && (
            <div className="careers-opps-grid">
              <div className="careers-opp-card">
                <div className="careers-opp-icon careers-icon-volunteer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <polyline points="17 11 19 13 23 9" />
                  </svg>
                </div>
                <h3 className="careers-opp-title">Field Volunteer</h3>
                <ul className="careers-opp-list">
                  <li>Support community programs</li>
                  <li>Help with event coordination</li>
                  <li>6-8 hours weekly commitment</li>
                </ul>
                <div className="careers-opp-tags"><span className="careers-tag">Part-time</span></div>
                <button className="careers-opp-button" onClick={() => navigate('/volunteer_reg')}>Apply Now</button>
              </div>

              <div className="careers-opp-card">
                <div className="careers-opp-icon careers-icon-support">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                    <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                  </svg>
                </div>
                <h3 className="careers-opp-title">Medical Camp Support</h3>
                <ul className="careers-opp-list">
                  <li>Assist in health camps</li>
                  <li>Help with patient registration</li>
                  <li>Medical background preferred</li>
                </ul>
                <div className="careers-opp-tags"><span className="careers-tag">Flexible</span></div>
                <button className="careers-opp-button" onClick={() => navigate('/volunteer_reg')}>Apply Now</button>
              </div>

              <div className="careers-opp-card">
                <div className="careers-opp-icon careers-icon-admin">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18" />
                  </svg>
                </div>
                <h3 className="careers-opp-title">Administrative Support</h3>
                <ul className="careers-opp-list">
                  <li>Assist with office administration</li>
                  <li>Data entry and reporting</li>
                  <li>Remote work available</li>
                </ul>
                <div className="careers-opp-tags"><span className="careers-tag">Remote</span></div>
                <button className="careers-opp-button" onClick={() => navigate('/volunteer_reg')}>Apply Now</button>
              </div>
            </div>
          )}
        </section>

        {/* ── CAREERS AT HAMDARD HAATH (Staff) ── */}
        <section className="careers-roles">
          <h2 className="careers-section-title">Careers at Hamdard Haath</h2>

          {/* Dynamic staff positions */}
          {staffJobs.length > 0 && (
            <div style={{ maxWidth: 1100, margin: '0 auto 24px', padding: '0 16px' }}>
              <div className="careers-roles-grid">
                {displayedStaff.map(j => (
                  <div key={j.job_id} className={`careers-role-card ${j.priority === 'High' ? 'careers-role-primary' : 'careers-role-secondary'}`}>
                    <div className="careers-role-icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    {j.priority === 'High' && (
                      <span style={{ background: '#fef3c7', color: '#d97706', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginBottom: 6 }}>HIGH PRIORITY</span>
                    )}
                    <h3 className="careers-role-title">{j.title}</h3>
                    <p className="careers-role-description">{j.description}</p>
                    <button className="careers-role-button" onClick={() => navigate('/volunteer_reg')}>Apply Now</button>
                  </div>
                ))}
              </div>
              {staffJobs.length > 4 && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <button onClick={() => setShowAllStaff(!showAllStaff)}
                    style={{ background: 'none', border: '1px dashed #cbd5e1', borderRadius: 10, padding: '10px 28px', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
                    {showAllStaff ? 'Show Less' : `View All ${staffJobs.length} Staff Positions`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Static cards if no dynamic staff jobs */}
          {staffJobs.length === 0 && (
            <div className="careers-roles-grid">
              <div className="careers-role-card careers-role-primary">
                <div className="careers-role-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="careers-role-title">Program Manager</h3>
                <p className="careers-role-description">Lead and coordinate community programs and initiatives</p>
                <button className="careers-role-button" onClick={() => navigate('/volunteer_reg')}>Apply Now</button>
              </div>

              <div className="careers-role-card careers-role-secondary">
                <div className="careers-role-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 7h-9" /><path d="M14 17H5" />
                    <circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
                  </svg>
                </div>
                <h3 className="careers-role-title">Field Coordinator</h3>
                <p className="careers-role-description">Coordinate on-ground activities and volunteer teams</p>
                <button className="careers-role-button" onClick={() => navigate('/volunteer_reg')}>Apply Now</button>
              </div>

              <div className="careers-role-card careers-role-secondary">
                <div className="careers-role-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <h3 className="careers-role-title">Project Officer</h3>
                <p className="careers-role-description">Manage project implementation and stakeholder relations</p>
                <button className="careers-role-button" onClick={() => navigate('/volunteer_reg')}>Apply Now</button>
              </div>

              <div className="careers-role-card careers-role-secondary">
                <div className="careers-role-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="careers-role-title">Community Relations</h3>
                <p className="careers-role-description">Build relationships and engage with local communities</p>
                <button className="careers-role-button" onClick={() => navigate('/volunteer_reg')}>Apply Now</button>
              </div>
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="careers-stats">
          <div className="careers-stat">
            <h3 className="careers-stat-value">1000+</h3>
            <p className="careers-stat-label">Volunteers Engaged</p>
          </div>
          <div className="careers-stat">
            <h3 className="careers-stat-value">50+</h3>
            <p className="careers-stat-label">Communities Served</p>
          </div>
          <div className="careers-stat">
            <h3 className="careers-stat-value">10</h3>
            <p className="careers-stat-label">Years of Impact</p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="careers-testimonials">
          <h2 className="careers-section-title">What Our Volunteers Say</h2>
          <div className="careers-testimonials-grid">
            <div className="careers-testimonial-card">
              <p className="careers-testimonial-text">
                "Being part of Hamdard Haath has been incredibly rewarding. I've had the chance to make a meaningful
                impact in my community while learning and growing with an amazing team."
              </p>
              <p className="careers-testimonial-author">- Sarah Ahmed, Volunteer</p>
            </div>
            <div className="careers-testimonial-card">
              <p className="careers-testimonial-text">
                "The support and guidance at Hamdard Haath are great, and the sense of camaraderie is amazing. Working
                here has truly changed my perspective on service and community."
              </p>
              <p className="careers-testimonial-author">- Zain Hassan, Program Coordinator</p>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  )
}