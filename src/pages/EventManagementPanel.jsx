import React, { useState, useEffect } from 'react';
import { Edit, Trash, Calendar, ArrowRight, ArrowLeft, Eye, Upload, Filter, X, Users, Bell, UserPlus, CheckCircle, XCircle, Send } from 'lucide-react';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import '../styles/donor_login.css';

const API = 'https://khidmat.hamdardhaath.org/api';

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatDateRange = (s, e) => {
  if (!s) return '';
  if (!e || new Date(s).toDateString() === new Date(e).toDateString()) return formatDate(s);
  return `${formatDate(s)} — ${formatDate(e)}`;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Upcoming': return { background: '#dbeafe', color: '#1d4ed8' };
    case 'Ongoing': return { background: '#dcfce7', color: '#15803d' };
    case 'Completed': return { background: '#f1f5f9', color: '#475569' };
    default: return { background: '#fef9c3', color: '#854d0e' };
  }
};

// ─── EDIT EVENT MODAL ────────────────────────────────────
const EditEventModal = ({ event, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: event.name || '',
    startDate: event.startDate || '',
    endDate: event.endDate || '',
    description: event.description || '',
    location: event.location || '',
    maxVolunteers: event.maxVolunteers || '',
    registrationType: event.registrationType || 'Open',
    eventType: event.eventType || 'General',
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.name || !form.startDate) return alert('Name and start date required');
    setSaving(true);
    const res = await fetch(`${API}/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (d.success) { onSave(); onClose(); }
    else alert('Error: ' + d.error);
    setSaving(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Edit Event</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {[
              { label: 'Event Name *', key: 'name', type: 'text' },
              { label: 'Location', key: 'location', type: 'text' },
              { label: 'Start Date *', key: 'startDate', type: 'date' },
              { label: 'End Date', key: 'endDate', type: 'date' },
              { label: 'Max Volunteers', key: 'maxVolunteers', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 5 }}>Registration Type</label>
              <select value={form.registrationType} onChange={e => setForm({ ...form, registrationType: e.target.value })}
                style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13 }}>
                <option>Open</option><option>Invite-only</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 5 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4}
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, resize: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={save} disabled={saving} style={{ flex: 1, background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={onClose} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── VOLUNTEER LIST MODAL ────────────────────────────────
const VolunteerListModal = ({ event, onClose }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('registered');
  const [inviteSearch, setInviteSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [sending, setSending] = useState(false);
  const [notifForm, setNotifForm] = useState({ title: '', message: '' });
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    fetch(`${API}/events/${event.id}/volunteers`)
      .then(r => r.json()).then(d => { if (d.success) setVolunteers(d.data); setLoading(false); });
    fetch(`${API}/volunteer/all`)
      .then(r => r.json()).then(d => { if (d.success) setAllVolunteers(d.data.filter(v => v.status === 'Approved')); });
  }, [event.id]);

  const updateStatus = async (volunteerId, status) => {
    const res = await fetch(`${API}/events/${event.id}/volunteers/${volunteerId}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const d = await res.json();
    if (d.success) {
      setVolunteers(prev => prev.map(v => v.volunteer_id === volunteerId ? { ...v, status } : v));
      // Send in-app notification
      if (status === 'Accepted') {
        await fetch(`${API}/notifications/send`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ volunteer_id: volunteerId, title: `Registration Accepted: ${event.name}`, message: `Your registration for ${event.name} on ${formatDate(event.startDate)} has been accepted!`, type: 'event' })
        });
      }
    }
  };

  const sendInvites = async () => {
    if (!selected.length) return alert('Select volunteers to invite');
    setSending(true);
    const res = await fetch(`${API}/events/${event.id}/invite`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteer_ids: selected })
    });
    const d = await res.json();
    if (d.success) {
      // Send notifications
      for (const vid of selected) {
        await fetch(`${API}/notifications/send`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ volunteer_id: vid, title: `You're Invited: ${event.name}`, message: `You have been invited to volunteer at ${event.name} on ${formatDate(event.startDate)}.`, type: 'event' })
        });
      }
      alert(d.message);
      setSelected([]);
      fetch(`${API}/events/${event.id}/volunteers`).then(r => r.json()).then(d => { if (d.success) setVolunteers(d.data); });
    }
    setSending(false);
  };

  const sendEventNotif = async () => {
    if (!notifForm.title || !notifForm.message) return alert('Title and message required');
    const eventVolIds = volunteers.map(v => v.volunteer_id);
    for (const vid of eventVolIds) {
      await fetch(`${API}/notifications/send`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteer_id: vid, title: notifForm.title, message: notifForm.message, type: 'event' })
      });
    }
    alert('Notification sent to all event volunteers!');
    setShowNotif(false);
    setNotifForm({ title: '', message: '' });
  };

  const registered = volunteers.filter(v =>
    v.invite_type === 'Registered' || (v.invite_type === 'Invited' && v.status === 'Accepted')
  );
  const invited = volunteers.filter(v => v.invite_type === 'Invited');
  const registeredIds = volunteers.map(v => v.volunteer_id);
  const filteredAll = allVolunteers.filter(v =>
    !registeredIds.includes(v.volunteer_id) &&
    (v.full_name?.toLowerCase().includes(inviteSearch.toLowerCase()) || v.email?.toLowerCase().includes(inviteSearch.toLowerCase()))
  );

  const StatusBadge = ({ status }) => {
    const colors = { Accepted: ['#ecfdf5', '#059669'], Rejected: ['#fef2f2', '#dc2626'], Pending: ['#fef9c3', '#854d0e'] };
    const [bg, color] = colors[status] || colors.Pending;
    return <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{status}</span>;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0f4c75, #1eb2a6)', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>{event.name}</h3>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{formatDateRange(event.startDate, event.endDate)} · {event.location || 'TBA'}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff' }}><X size={18} /></button>
        </div>

        <div style={{ padding: 24 }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 4, marginBottom: 20, width: 'fit-content' }}>
            {[
              { id: 'registered', label: `Registered (${registered.length})` },
              { id: 'invited', label: `Invited (${invited.length})` },
              { id: 'invite', label: 'Invite Volunteers' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{ padding: '7px 16px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                  background: tab === t.id ? '#fff' : 'transparent',
                  color: tab === t.id ? '#0f4c75' : '#64748b',
                  boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Send notification to event volunteers */}
          <div style={{ marginBottom: 16 }}>
            {!showNotif ? (
              <button onClick={() => setShowNotif(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
                <Bell size={13} /> Notify Event Volunteers
              </button>
            ) : (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: 14 }}>
                <input placeholder="Notification title" value={notifForm.title} onChange={e => setNotifForm({ ...notifForm, title: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 7, padding: '7px 10px', fontSize: 12, marginBottom: 8, boxSizing: 'border-box' }} />
                <textarea placeholder="Message" value={notifForm.message} onChange={e => setNotifForm({ ...notifForm, message: e.target.value })} rows={2}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 7, padding: '7px 10px', fontSize: 12, resize: 'none', boxSizing: 'border-box', marginBottom: 8 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={sendEventNotif} style={{ background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Send</button>
                  <button onClick={() => setShowNotif(false)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Registered Tab */}
          {tab === 'registered' && (
            <div>
              {loading ? <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading...</p>
                : registered.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No volunteers registered yet.</p>
                : registered.map(v => (
                  <div key={v.volunteer_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 10, background: '#f8fafc', marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{v.full_name}</span>
                        {v.invite_type === 'Invited' && (
                          <span style={{ fontSize: 10, background: '#fef3c7', color: '#d97706', padding: '2px 7px', borderRadius: 12, fontWeight: 700 }}>Invited</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{v.email}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <StatusBadge status={v.status} />
                      {v.invite_type === 'Registered' && v.status === 'Pending' && (
                        <>
                          <button onClick={() => updateStatus(v.volunteer_id, 'Accepted')} style={{ background: '#ecfdf5', color: '#059669', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Accept</button>
                          <button onClick={() => updateStatus(v.volunteer_id, 'Rejected')} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Invited Tab */}
          {tab === 'invited' && (
            <div>
              {invited.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No volunteers invited yet.</p>
                : invited.map(v => (
                  <div key={v.volunteer_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 10, background: '#f8fafc', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{v.full_name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{v.email}</div>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                ))}
            </div>
          )}

          {/* Invite Tab */}
          {tab === 'invite' && (
            <div>
              <input placeholder="Search volunteers by name or email..." value={inviteSearch} onChange={e => setInviteSearch(e.target.value)}
                style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 9, padding: '9px 14px', fontSize: 13, boxSizing: 'border-box', marginBottom: 12 }} />
              <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 12 }}>
                {filteredAll.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 16 }}>No volunteers found.</p>
                  : filteredAll.map(v => (
                    <div key={v.volunteer_id} onClick={() => setSelected(prev => prev.includes(v.volunteer_id) ? prev.filter(id => id !== v.volunteer_id) : [...prev, v.volunteer_id])}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 9, marginBottom: 6, cursor: 'pointer',
                        background: selected.includes(v.volunteer_id) ? '#e0f2fe' : '#f8fafc',
                        border: selected.includes(v.volunteer_id) ? '1px solid #7dd3fc' : '1px solid transparent' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{v.full_name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{v.email}</div>
                      </div>
                      {selected.includes(v.volunteer_id) && <CheckCircle size={16} color="#0369a1" />}
                    </div>
                  ))}
              </div>
              <button onClick={sendInvites} disabled={sending || !selected.length}
                style={{ width: '100%', background: selected.length ? '#0f4c75' : '#94a3b8', color: '#fff', border: 'none', borderRadius: 9, padding: '10px', fontWeight: 600, fontSize: 13, cursor: selected.length ? 'pointer' : 'not-allowed' }}>
                {sending ? 'Sending...' : `Invite ${selected.length} Volunteer${selected.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────
const EventManagementPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({ name: '', startDate: '', endDate: '', description: '', registrationType: 'Open', location: '', maxVolunteers: '', eventType: 'General' });
  const [filterStatus, setFilterStatus] = useState('All');
  const [editModal, setEditModal] = useState(null);
  const [volunteerModal, setVolunteerModal] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API}/events`);
      const d = await res.json();
      if (d.success) setEvents(d.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const launchEvent = async () => {
    if (!newEvent.name || !newEvent.startDate) return alert('Event Name and Start Date required');
    const res = await fetch(`${API}/events`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });
    const d = await res.json();
    if (d.success) {
      setNewEvent({ name: '', startDate: '', endDate: '', description: '', registrationType: 'Open', location: '', maxVolunteers: '', eventType: 'General' });
      fetchEvents();
      alert('Event created successfully!');
    } else alert('Error: ' + d.error);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    const res = await fetch(`${API}/events/${id}`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) fetchEvents();
    else alert('Error: ' + d.error);
  };

  const filteredEvents = filterStatus === 'All' ? events : events.filter(e => e.status === filterStatus);

  const inputStyle = { width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 5 };

  return (
    <div className="page">
      <Header />
      {editModal && <EditEventModal event={editModal} onClose={() => setEditModal(null)} onSave={fetchEvents} />}
      {volunteerModal && <VolunteerListModal event={volunteerModal} onClose={() => setVolunteerModal(null)} />}

      <main style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: 80 }}>
        {/* Page Header */}
        <div style={{ background: 'linear-gradient(135deg, #0f4c75 0%, #1eb2a6 100%)', padding: '36px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0 }}>Event Management</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '6px 0 0', fontSize: 14 }}>Create, edit, and manage volunteer events</p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

          {/* Create Event Form */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: 28, marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', margin: '0 0 20px' }}>Create New Event</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 16 }}>
              {[
                { label: 'Event Name *', key: 'name', type: 'text', placeholder: 'Enter event name' },
                { label: 'Location', key: 'location', type: 'text', placeholder: 'Enter location' },
                { label: 'Start Date *', key: 'startDate', type: 'date' },
                { label: 'End Date', key: 'endDate', type: 'date' },
                { label: 'Max Volunteers', key: 'maxVolunteers', type: 'number', placeholder: '0 = unlimited' },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type={f.type} value={newEvent[f.key]} onChange={e => setNewEvent({ ...newEvent, [f.key]: e.target.value })}
                    placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Registration Type</label>
                <div style={{ display: 'flex', gap: 16, paddingTop: 8 }}>
                  {['Open', 'Invite-only'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                      <input type="radio" name="regType" value={opt} checked={newEvent.registrationType === opt}
                        onChange={e => setNewEvent({ ...newEvent, registrationType: e.target.value })} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Description</label>
              <textarea value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Describe the event" rows={3} style={{ ...inputStyle, resize: 'none' }} />
            </div>
            <button onClick={launchEvent} style={{ background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
              Launch Event
            </button>
          </div>

          {/* Events Table */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f1f5f9', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>All Events</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Filter size={14} color="#94a3b8" />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '7px 12px', fontSize: 13 }}>
                  <option value="All">All Status</option>
                  <option>Upcoming</option><option>Ongoing</option><option>Completed</option><option>Pending</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Event', 'Date', 'Location', 'Volunteers', 'Type', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="7" style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>Loading events...</td></tr>
                  ) : filteredEvents.length === 0 ? (
                    <tr><td colSpan="7" style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No events found.</td></tr>
                  ) : filteredEvents.map(event => {
                    const sc = getStatusColor(event.status);
                    return (
                      <tr key={event.id} style={{ borderTop: '1px solid #f1f5f9' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{event.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{event.eventType}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#475569' }}>{formatDateRange(event.startDate, event.endDate)}</td>
                        <td style={{ padding: '14px 16px', color: '#475569' }}>{event.location || 'TBA'}</td>
                        <td style={{ padding: '14px 16px', color: '#475569' }}>
                          {event.registeredVolunteers}{event.maxVolunteers > 0 ? ` / ${event.maxVolunteers}` : ''}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: event.registrationType === 'Invite-only' ? '#fef3c7' : '#f0fdf4', color: event.registrationType === 'Invite-only' ? '#d97706' : '#15803d', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
                            {event.registrationType}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ ...sc, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>{event.status}</span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => setEditModal(event)} title="Edit" style={{ background: '#eff6ff', border: 'none', borderRadius: 7, padding: '7px 9px', cursor: 'pointer', color: '#3b82f6' }}><Edit size={14} /></button>
                            <button onClick={() => setVolunteerModal(event)} title="View Volunteers" style={{ background: '#f0fdf4', border: 'none', borderRadius: 7, padding: '7px 9px', cursor: 'pointer', color: '#16a34a' }}><Users size={14} /></button>
                            <button onClick={() => handleDelete(event.id)} title="Delete" style={{ background: '#fef2f2', border: 'none', borderRadius: 7, padding: '7px 9px', cursor: 'pointer', color: '#dc2626' }}><Trash size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '14px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>
                {filteredEvents.length === 0 ? 'No entries' : `Showing ${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''}`}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ border: '1px solid #e2e8f0', background: '#fff', borderRadius: 7, padding: '6px 10px', cursor: 'pointer' }}><ArrowLeft size={14} /></button>
                <button style={{ background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 7, padding: '6px 12px', fontSize: 13, fontWeight: 600 }}>1</button>
                <button style={{ border: '1px solid #e2e8f0', background: '#fff', borderRadius: 7, padding: '6px 10px', cursor: 'pointer' }}><ArrowRight size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventManagementPanel;