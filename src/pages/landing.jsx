"use client"

import React from "react"
import { Heart, DollarSign, Users, Lock, ArrowRight } from "lucide-react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import "../styles/landing.css"

const LandingPage = () => {
  return (
    <>
      <Header />
      <main className="landing-page with-sticky-header">

        {/* ── 1) HERO ─────────────────────────────────────── */}
        <section className="hero-section anchor-section" id="hero">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-eyebrow">
                <Heart size={11} />
                Welfare Foundation — Karachi, Pakistan
              </div>
              <h1>
                Extending a<br />
                <span className="brand-name">Helping Hand</span>
              </h1>
              <p>
                Hamdard Haath supports underprivileged communities through
                healthcare, food distribution, and education — empowering
                lives and strengthening communities across Pakistan.
              </p>
              <div className="hero-buttons">
                <a href="/donation" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  Donate Now <ArrowRight size={15} />
                </a>
                <a href="/volunteer_reg" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                  Become a Volunteer
                </a>
                <a href="#who-we-are" className="btn btn-outline" style={{ textDecoration: 'none' }}>
                  Learn More
                </a>
              </div>
            </div>
            <div className="hero-images">
              <div className="hero-image-main">
                <img src="/helping_hands.png" alt="Helping hands" />
              </div>
              <div className="hero-image-secondary">
                <img src="/community.webp" alt="Community" />
              </div>
            </div>
          </div>
        </section>

        {/* ── IMPACT STRIP ────────────────────────────────── */}
        <div className="impact-strip">
          <div className="container">
            <div className="impact-grid">
              <div className="impact-item">
                <div className="impact-number">5,000+</div>
                <div className="impact-label">Families Supported</div>
              </div>
              <div className="impact-item">
                <div className="impact-number">200+</div>
                <div className="impact-label">Active Volunteers</div>
              </div>
              <div className="impact-item">
                <div className="impact-number">12</div>
                <div className="impact-label">Active Campaigns</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2) WHO WE ARE ───────────────────────────────── */}
        <section className="who-we-are anchor-section" id="who-we-are">
          <div className="container">
            <div className="who-content">
              <div className="who-image">
                <img src="/volunteer.png" alt="Volunteers" />
                <div className="who-image-badge">Est. 2018 · Karachi, Pakistan</div>
              </div>
              <div className="who-text">
                <span className="section-label">About Us</span>
                <h2 className="section-heading">Who We Are</h2>
                <p className="section-subtext">
                  Hamdard Haath is a welfare foundation committed to supporting
                  underprivileged communities through healthcare, food distribution,
                  and educational programs that empower lives and strengthen
                  communities across the region.
                </p>
                <a href="/volunteer_reg" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  Join Us <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3) EVENTS & CAMPAIGNS ───────────────────────── */}
        <section className="events-campaigns anchor-section" id="events-campaigns">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Our Work</span>
              <h2 className="section-heading center">Events &amp; Campaigns</h2>
              <p className="section-subtext center">
                Join our ongoing efforts to make a difference in communities across Pakistan.
              </p>
            </div>
            <div className="events-grid">
              {[
                { img: '/drive.jpg',     title: 'Ramadan Season Drive' },
                { img: '/medical.png',   title: 'Medical Camp 2024' },
                { img: '/education.jpg', title: 'Education Support' },
              ].map(ev => (
                <div className="event-card" key={ev.title}>
                  <div className="event-card-img">
                    <img src={ev.img} alt={ev.title} />
                  </div>
                  <div className="event-card-body">
                    <h3>{ev.title}</h3>
                    <a href="/donation" className="btn btn-primary btn-small" style={{ textDecoration: 'none' }}>
                      Donate Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4) REAL STORIES ─────────────────────────────── */}
        <section className="focus-areas anchor-section" id="real-stories">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Real Impact</span>
              <h2 className="section-heading center">Stories That Need Your Help</h2>
              <p className="section-subtext center">
                Every story is a real family, a real child — changed by your generosity.
              </p>
            </div>
            <div className="focus-grid">
              {[
                { img: '/education.jpg',    title: 'Education for All' },
                { img: '/healthcare.webp',  title: 'Healthcare Access' },
                { img: '/food_security.png', title: 'Food Security' },
              ].map(story => (
                <div className="focus-card" key={story.title}>
                  <div className="focus-card-img">
                    <img src={story.img} alt={story.title} />
                  </div>
                  <div className="focus-card-body">
                    <h3>{story.title}</h3>
                    <button className="btn btn-outline-navy btn-small">Learn More</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5) VOLUNTEER STORIES ────────────────────────── */}
        <section className="volunteer-stories anchor-section" id="volunteer-stories">
          <div className="container">
            <div className="volunteer-content">
              <div className="volunteer-image">
                <img src="/farming.png" alt="Volunteers in the field" />
              </div>
              <div className="volunteer-text">
                <span className="section-label">Our Community</span>
                <h2 className="section-heading">Volunteer Stories</h2>
                <p className="section-subtext">
                  Join our community of dedicated volunteers making a real difference
                  in people's lives. Every helping hand counts, and your contribution
                  can transform entire communities.
                </p>
                <div className="volunteer-buttons">
                  <a href="/volunteer_reg" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    Join as Volunteer
                  </a>
                  <a href="/volunteer_login" className="btn btn-outline-navy" style={{ textDecoration: 'none' }}>
                    Volunteer Login
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6) DONATION OPTIONS ─────────────────────────── */}
        <section className="donation-options anchor-section" id="donation-options">
          <div className="container">
            <div className="section-header">
              <span className="section-label" style={{ color: 'var(--teal)' }}>Support Our Work</span>
              <h2 className="section-heading center" style={{ color: '#f5f0eb' }}>How You Can Help</h2>
              <p className="section-subtext center" style={{ color: 'rgba(245,240,235,0.55)', fontWeight: 300 }}>
                Every contribution, large or small, creates lasting impact.
              </p>
            </div>
            <div className="donation-grid">
              <div className="donation-card">
                <div className="donation-icon-wrap">
                  <DollarSign size={24} />
                </div>
                <h3>One-Time Donation</h3>
                <p>Make an immediate impact with a single contribution of any amount.</p>
                <a href="/donation" className="btn btn-white btn-small" style={{ textDecoration: 'none' }}>
                  Donate Now
                </a>
              </div>
              <div className="donation-card featured">
                <div className="donation-icon-wrap">
                  <Heart size={24} />
                </div>
                <h3>Monthly Support</h3>
                <p>Sustain our programs with a recurring donation each month.</p>
                <a href="/donation" className="btn btn-white btn-small" style={{ textDecoration: 'none' }}>
                  Donate Now
                </a>
              </div>
              <div className="donation-card">
                <div className="donation-icon-wrap">
                  <Users size={24} />
                </div>
                <h3>Corporate Partnership</h3>
                <p>Partner with us to amplify your organization's social impact.</p>
                <button className="btn btn-white btn-small">Contact Now</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7) QUICK DONATION ───────────────────────────── */}
        <section className="quick-donation anchor-section" id="quick-donation">
          <div className="container">
            <div className="quick-donation-inner">
              <span className="section-label">Give Today</span>
              <h2 className="section-heading">Quick Donation</h2>
              <div className="donation-form-card">
                <select className="donation-select">
                  <option>Select Amount</option>
                  <option>Rs. 500</option>
                  <option>Rs. 1,000</option>
                  <option>Rs. 2,000</option>
                  <option>Rs. 5,000</option>
                </select>
                <input
                  type="text"
                  placeholder="Or enter custom amount (Rs.)"
                  className="donation-input"
                />
                <button className="btn btn-primary donation-btn">
                  Donate Now <ArrowRight size={15} />
                </button>
                <p className="donation-note">
                  <Lock size={12} /> Secure &amp; encrypted payment
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}

export default LandingPage
