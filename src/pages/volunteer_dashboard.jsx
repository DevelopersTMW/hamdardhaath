"use client"

import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { LogOut, Bell, CreditCard } from "lucide-react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import "../styles/volunteer_dashboard.css"

const API = 'https://khidmat.hamdardhaath.org/api'

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getLevel = (hours) => {
  if (hours >= 80) return { label: 'Gold', color: '#f59e0b', bg: '#fef3c7' }
  if (hours >= 30) return { label: 'Silver', color: '#6366f1', bg: '#eef2ff' }
  return { label: 'Bronze', color: '#78716c', bg: '#f5f5f4' }
}

// ─── DYNAMIC CALENDAR ────────────────────────────────────
const Calendar = ({ acceptedEventDates }) => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = today.toLocaleString('default', { month: 'long' })

  const acceptedDays = new Set(
    acceptedEventDates
      .map(d => new Date(d))
      .filter(d => d.getFullYear() === year && d.getMonth() === month)
      .map(d => d.getDate())
  )

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return (
    <div className="vd-calendar-card">
      <h3 className="vd-calendar-title">Schedule — {monthName} {year}</h3>
      <div className="vd-calendar-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
          <div key={d} className="vd-calendar-header">{d}</div>
        ))}
        {days.map((day, i) => (
          <div key={i} className={
            day === null ? '' :
            day === today.getDate() ? 'vd-calendar-day vd-calendar-day-current' :
            acceptedDays.has(day) ? 'vd-calendar-day vd-calendar-day-selected' :
            'vd-calendar-day'
          }>
            {day}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#0f4c75' }}></div> Today
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#1eb2a6' }}></div> Accepted Event
        </div>
      </div>
    </div>
  )
}

// ─── MAIN DASHBOARD ──────────────────────────────────────
export default function VolunteerDashboard() {
  const [volunteer, setVolunteer] = useState(null)
  const [events, setEvents] = useState([])
  const [myEvents, setMyEvents] = useState([])
  const [cases, setCases] = useState([])
  const [certificates, setCertificates] = useState([])
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [registering, setRegistering] = useState(null)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [showAllCases, setShowAllCases] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const data = localStorage.getItem('volunteer')
    if (!data) { navigate('/volunteer_login'); return }
    try {
      const v = JSON.parse(data)
      setVolunteer(v)
      fetchAll(v.volunteer_id)
    } catch { navigate('/volunteer_login') }
  }, [navigate])

  const fetchAll = async (vid) => {
    try {
      const [evRes, myEvRes, caseRes, certRes, notifRes] = await Promise.all([
        fetch(`${API}/events`).then(r => r.json()),
        fetch(`${API}/events`).then(r => r.json()), // will filter by volunteer below
        fetch(`${API}/cases`).then(r => r.json()).catch(() => ({ success: false })),
        fetch(`${API}/certificates/${vid}`).then(r => r.json()),
        fetch(`${API}/notifications/${vid}`).then(r => r.json()),
      ])

      if (evRes.success) setEvents(evRes.data)

      // Fetch volunteer's own event registrations
      const regRes = await fetch(`${API}/volunteer/${vid}/events`).then(r => r.json()).catch(() => ({ success: false }))
      if (regRes.success) setMyEvents(regRes.data)

      if (caseRes.success) setCases(caseRes.data || [])
      if (certRes.success) setCertificates(certRes.data)
      if (notifRes.success) {
        setNotifications(notifRes.data)
        setUnread(notifRes.data.filter(n => !n.is_read).length)
      }
    } catch (e) { console.error(e) }
  }

  const handleRegister = async (eventId) => {
    if (!volunteer) return
    setRegistering(eventId)
    try {
      const res = await fetch(`${API}/events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer_id: volunteer.volunteer_id })
      })
      const d = await res.json()
      if (d.success) {
        alert('Successfully registered! Awaiting admin approval.')
        fetchAll(volunteer.volunteer_id)
      } else {
        alert(d.error || d.message || 'Could not register')
      }
    } catch { alert('Error registering. Please try again.') }
    setRegistering(null)
  }

  const handleLogout = () => {
    localStorage.removeItem("volunteer");
    navigate("/volunteer_login");
  };

  const handleRespond = async (eventId, response) => {
    if (!volunteer) return;
    try {
      const res = await fetch(`${API}/events/${eventId}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer_id: volunteer.volunteer_id, response })
      });
      let d;
      try {
        d = await res.json();
      } catch {
        console.error(`PATCH /events/${eventId}/respond returned HTTP ${res.status} with non-JSON body. Restart the backend server.`);
        alert('Server error. Please restart the backend server and try again.');
        return;
      }
      if (d.success) {
        fetchAll(volunteer.volunteer_id);
      } else {
        alert(d.message || d.error || 'Could not respond to invitation');
      }
    } catch (err) {
      console.error('Network error in handleRespond:', err);
      alert('Connection error. Please ensure the backend server is running.');
    }
  };

  const markAllRead = async () => {
    if (!volunteer) return
    await fetch(`${API}/notifications/${volunteer.volunteer_id}/read-all`, { method: 'PATCH' })
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })))
    setUnread(0)
  }

  const getNotifIcon = (type) => {
    const icons = {
      emergency: { bg: '#fee2e2', color: '#dc2626', symbol: '🚨' },
      event: { bg: '#dbeafe', color: '#2563eb', symbol: '📅' },
      general: { bg: '#f3e8ff', color: '#7c3aed', symbol: '🔔' },
    }
    return icons[type] || icons.general
  }

  const pendingInvites = myEvents.filter(e => e.invite_type === 'Invited' && e.status === 'Pending')

  const isRegistered = (eventId) => myEvents.some(e => e.event_id === eventId || e.id === eventId)
  const acceptedEvents = myEvents.filter(e => e.status === 'Accepted')
  const acceptedDates = acceptedEvents.map(e => e.startDate || e.start_date).filter(Boolean)

  const upcomingEvents = events
    .filter(e => e.status === 'Upcoming' || e.status === 'Ongoing')
    .filter(e => e.registrationType !== 'Invite-only' || myEvents.some(me => me.event_id === e.id))
  const displayedEvents = showAllEvents ? upcomingEvents : upcomingEvents.slice(0, 3)
  const displayedCases = showAllCases ? cases : cases.slice(0, 3)

  if (!volunteer) return null

  const totalHours = volunteer.total_volunteer_hours || 0
  const lvl = getLevel(totalHours)

  return (
    <>
      <Header />
      <div className="vd-container">

        {/* Welcome Header */}
        <header className="vd-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <h1 className="vd-welcome">Welcome, {volunteer.full_name}</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setActiveTab('notifications')}
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#475569' }}>
              <Bell size={15} /> Notifications
              {unread > 0 && <span style={{ background: '#dc2626', color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{unread}</span>}
            </button>
            <Link to="/m_card"
              style={{ background: '#0f4c75', color: '#fff', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
              <CreditCard size={15} /> My Card
            </Link>
            <button onClick={handleLogout}
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#dc2626' }}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </header>

        {/* Stats */}
        <section className="vd-stats">
          <div className="vd-stat-card">
            <div className="vd-stat-icon vd-icon-clock">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="vd-stat-content">
              <p className="vd-stat-label">Total Hours</p>
              <p className="vd-stat-value">{totalHours} Hours</p>
            </div>
          </div>
          <div className="vd-stat-card">
            <div className="vd-stat-icon vd-icon-calendar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="vd-stat-content">
              <p className="vd-stat-label">My Events</p>
              <p className="vd-stat-value">{myEvents.length} Events</p>
            </div>
          </div>
          <div className="vd-stat-card">
            <div className="vd-stat-icon vd-icon-trophy">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
              </svg>
            </div>
            <div className="vd-stat-content">
              <p className="vd-stat-label">Recognition Level</p>
              <p className="vd-stat-value" style={{ color: lvl.color }}>{lvl.label} Level</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="vd-main-content">
          <div className="vd-events-section">
            <div className="vd-tabs">
              {[
                { id: 'upcoming', label: 'Upcoming Events' },
                { id: 'mycases', label: 'Ongoing Cases' },
                { id: 'myevents', label: `My Registrations${pendingInvites.length > 0 ? ` (${pendingInvites.length})` : ''}` },
                { id: 'notifications', label: `Notifications${unread > 0 ? ` (${unread})` : ''}` },
              ].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`vd-tab${activeTab === t.id ? ' vd-tab-active' : ''}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* ── Upcoming Events ── */}
            {activeTab === 'upcoming' && (
              <div className="vd-events-list">
                {upcomingEvents.length === 0
                  ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>No upcoming events at the moment.</p>
                  : displayedEvents.map(event => {
                    const registered = isRegistered(event.id)
                    const myReg = myEvents.find(e => (e.event_id || e.id) === event.id)
                    return (
                      <div key={event.id} className="vd-event-item">
                        <div className="vd-event-details">
                          <h3 className="vd-event-title">{event.name}</h3>
                          <p className="vd-event-meta">📅 {formatDate(event.startDate)}</p>
                          <p className="vd-event-meta">📍 {event.location || 'TBA'}</p>
                          {event.registrationType === 'Invite-only' && (
                            <span style={{ fontSize: 11, background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>Invite-only</span>
                          )}
                          {myReg && (
                            <span style={{ fontSize: 11, background: myReg.status === 'Accepted' ? '#ecfdf5' : '#fef9c3', color: myReg.status === 'Accepted' ? '#059669' : '#d97706', padding: '2px 8px', borderRadius: 20, fontWeight: 600, marginLeft: 4 }}>
                              {myReg.status}
                            </span>
                          )}
                        </div>
                        {myReg?.invite_type === 'Invited' && myReg?.status === 'Pending' ? (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => handleRespond(event.id, 'Accepted')}
                              style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                              Accept
                            </button>
                            <button onClick={() => handleRespond(event.id, 'Declined')}
                              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                              Decline
                            </button>
                          </div>
                        ) : !registered && event.registrationType !== 'Invite-only' ? (
                          <button className="vd-event-register" onClick={() => handleRegister(event.id)} disabled={registering === event.id}>
                            {registering === event.id ? 'Registering...' : 'Register'}
                          </button>
                        ) : registered ? (
                          <span style={{ fontSize: 12, color: '#059669', fontWeight: 600, padding: '8px 14px' }}>Registered</span>
                        ) : null}
                      </div>
                    )
                  })}
                {upcomingEvents.length > 3 && (
                  <button onClick={() => setShowAllEvents(!showAllEvents)}
                    style={{ width: '100%', background: 'none', border: '1px dashed #cbd5e1', borderRadius: 10, padding: '10px', color: '#64748b', fontSize: 13, cursor: 'pointer', marginTop: 8 }}>
                    {showAllEvents ? 'Show Less' : `View All ${upcomingEvents.length} Events`}
                  </button>
                )}
              </div>
            )}

            {/* ── Ongoing Cases ── */}
            {activeTab === 'mycases' && (
              <div className="vd-events-list">
                {cases.length === 0
                  ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>No ongoing cases at the moment.</p>
                  : displayedCases.map((c, i) => (
                    <div key={i} className="vd-event-item">
                      <div className="vd-event-details">
                        <h3 className="vd-event-title">{c.title || c.name || 'Unnamed Case'}</h3>
                        <p className="vd-event-meta">📌 {c.cause_category || c.type || 'General'}</p>
                        <p className="vd-event-meta">📍 {c.location || 'N/A'}</p>
                        {c.status && <span style={{ fontSize: 11, background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{c.status}</span>}
                      </div>
                    </div>
                  ))}
                {cases.length > 3 && (
                  <button onClick={() => setShowAllCases(!showAllCases)}
                    style={{ width: '100%', background: 'none', border: '1px dashed #cbd5e1', borderRadius: 10, padding: '10px', color: '#64748b', fontSize: 13, cursor: 'pointer', marginTop: 8 }}>
                    {showAllCases ? 'Show Less' : `View All ${cases.length} Cases`}
                  </button>
                )}
              </div>
            )}

            {/* ── My Registrations ── */}
            {activeTab === 'myevents' && (
              <div className="vd-events-list">
                {myEvents.length === 0
                  ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>You haven't registered for any events yet.</p>
                  : myEvents.map((e, i) => {
                    const isPendingInvite = e.invite_type === 'Invited' && e.status === 'Pending';
                    return (
                      <div key={i} className="vd-event-item"
                        style={isPendingInvite ? { borderLeft: '3px solid #f59e0b', background: '#fffbeb' } : {}}>
                        <div className="vd-event-details">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                            <h3 className="vd-event-title" style={{ margin: 0 }}>{e.name}</h3>
                            {isPendingInvite && (
                              <span style={{ fontSize: 11, background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>
                                Invitation Pending
                              </span>
                            )}
                          </div>
                          <p className="vd-event-meta">📅 {formatDate(e.startDate || e.start_date)}</p>
                          <p className="vd-event-meta">📍 {e.location || 'TBA'}</p>
                        </div>
                        {isPendingInvite ? (
                          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <button onClick={() => handleRespond(e.event_id, 'Accepted')}
                              style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                              Accept
                            </button>
                            <button onClick={() => handleRespond(e.event_id, 'Declined')}
                              style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 20, flexShrink: 0,
                            background: e.status === 'Accepted' ? '#ecfdf5' : e.status === 'Declined' ? '#f1f5f9' : e.status === 'Rejected' ? '#fef2f2' : '#fef9c3',
                            color: e.status === 'Accepted' ? '#059669' : e.status === 'Declined' ? '#64748b' : e.status === 'Rejected' ? '#dc2626' : '#d97706' }}>
                            {e.status || 'Pending'}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            {/* ── Notifications ── */}
            {activeTab === 'notifications' && (
              <div>
                {notifications.length > 0 && unread > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
                    <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#0f4c75', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Mark all as read
                    </button>
                  </div>
                )}
                <div className="vd-notifications-list">
                  {notifications.length === 0
                    ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>No notifications yet.</p>
                    : notifications.map(n => {
                      const icon = getNotifIcon(n.type)
                      return (
                        <div key={n.notification_id} className="vd-notification-item"
                          style={{ background: n.is_read ? '#fff' : '#f0f9ff', borderLeft: n.is_read ? 'none' : '3px solid #0f4c75' }}>
                          <div className="vd-notification-icon" style={{ background: icon.bg, color: icon.color }}>
                            <span style={{ fontSize: 18 }}>{icon.symbol}</span>
                          </div>
                          <div className="vd-notification-content">
                            <p className="vd-notification-text" style={{ fontWeight: n.is_read ? 400 : 700 }}>{n.title}</p>
                            <p style={{ fontSize: 12, color: '#475569', margin: '2px 0 0' }}>{n.message}</p>
                            <p className="vd-notification-time">{new Date(n.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Calendar */}
          <aside className="vd-calendar-section">
            <Calendar acceptedEventDates={acceptedDates} />
          </aside>
        </section>

        {/* Certificates */}
        <section className="vd-certificates">
          <h2 className="vd-section-title">Certificates</h2>
          {certificates.length === 0
            ? <p style={{ color: '#94a3b8', fontSize: 14 }}>No certificates assigned yet. Keep volunteering!</p>
            : (
              <div className="vd-certificates-grid">
                {certificates.map((cert, i) => {
                  const colors = ['vd-cert-red', 'vd-cert-gray', 'vd-cert-blue', 'vd-cert-orange']
                  return (
                    <div key={i} className="vd-certificate-card">
                      <div className={`vd-certificate-preview ${colors[i % colors.length]}`}>
                        <p className="vd-cert-text">{cert.title}</p>
                      </div>
                      <div className="vd-certificate-info">
                        <h4 className="vd-certificate-name">{cert.title}</h4>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 6px' }}>{formatDate(cert.issued_date)}</p>
                        <div className="vd-certificate-actions">
                          <button className="vd-cert-icon-btn" title="Download PDF"
                            onClick={() => cert.pdf_path ? window.open(cert.pdf_path) : alert('PDF will be available once email is configured.')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
        </section>

      </div>
      <Footer />
    </>
  )
}