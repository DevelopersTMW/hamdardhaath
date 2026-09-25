import React, { useState, useEffect } from 'react';
import { X, Save, Bell, Search, AlertTriangle, Plus, Trash2, Edit2, Mail, Phone, MapPin, Star, CheckCircle } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const API = 'https://app.hamdardhaath.org/api';

const getVolunteerLevel = (hours) => {
  if (hours >= 80) return { level: 3, label: 'Gold', color: '#f59e0b' };
  if (hours >= 30) return { level: 2, label: 'Silver', color: '#6366f1' };
  return { level: 1, label: 'Bronze', color: '#78716c' };
};

const Avatar = ({ name, url, size = 40 }) => {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  if (url) return <img src={url} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  const colors = ['#0f4c75', '#1eb2a6', '#6366f1', '#f59e0b', '#ef4444'];
  const color = colors[name?.charCodeAt(0) % colors.length] || '#0f4c75';
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
};

// ─── MODALS ──────────────────────────────────────────────

const VolunteerProfileModal = ({ volunteer, onClose, onUpdateNotes, onAssignCert }) => {
  const [notes, setNotes] = useState(volunteer.admin_notes || '');
  const [saving, setSaving] = useState(false);
  const [certs, setCerts] = useState([]);
  const [showCertForm, setShowCertForm] = useState(false);
  const [certForm, setCertForm] = useState({ title: '', description: '', hours_completed: '' });
  const lvl = getVolunteerLevel(volunteer.total_volunteer_hours);

  useEffect(() => {
    fetch(`${API}/certificates/${volunteer.volunteer_id}`)
      .then(r => r.json()).then(d => { if (d.success) setCerts(d.data); })
      .catch(() => {});
  }, [volunteer.volunteer_id]);

  const saveNotes = async () => {
    setSaving(true);
    await onUpdateNotes(volunteer.volunteer_id, notes);
    setSaving(false);
  };

  const assignCert = async () => {
    if (!certForm.title) return alert('Title required');
    const res = await fetch(`${API}/certificates/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volunteer_id: volunteer.volunteer_id, ...certForm })
    });
    const d = await res.json();
    if (d.success) {
      setCerts(prev => [...prev, d.data]);
      setShowCertForm(false);
      setCertForm({ title: '', description: '', hours_completed: '' });
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0f4c75, #1eb2a6)', padding: '24px 28px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Avatar name={volunteer.full_name} url={volunteer.profile_picture_url} size={56} />
            <div>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>{volunteer.full_name}</h2>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, padding: '2px 10px', borderRadius: 20, fontWeight: 600 }}>{lvl.label} Level</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{volunteer.total_volunteer_hours || 0}h total</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff' }}><X size={18} /></button>
        </div>

        <div style={{ padding: 28 }}>
          {/* Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {[
              { icon: <Mail size={14} />, label: 'Email', value: volunteer.email },
              { icon: <Phone size={14} />, label: 'Phone', value: volunteer.phone || 'N/A' },
              { icon: <MapPin size={14} />, label: 'City', value: volunteer.city || 'N/A' },
              { icon: <CheckCircle size={14} />, label: 'Status', value: volunteer.status },
            ].map((item, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: '#64748b', fontSize: 11, marginBottom: 4 }}>{item.icon}{item.label}</div>
                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Skills */}
          {volunteer.skills?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {volunteer.skills.map((s, i) => (
                  <span key={i} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 500 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Certificates</h4>
              <button onClick={() => setShowCertForm(!showCertForm)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <Plus size={13} /> Assign Certificate
              </button>
            </div>
            {showCertForm && (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <input placeholder="Certificate title *" value={certForm.title} onChange={e => setCertForm({ ...certForm, title: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontSize: 13, boxSizing: 'border-box' }} />
                <input placeholder="Description" value={certForm.description} onChange={e => setCertForm({ ...certForm, description: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontSize: 13, boxSizing: 'border-box' }} />
                <input placeholder="Hours completed" type="number" value={certForm.hours_completed} onChange={e => setCertForm({ ...certForm, hours_completed: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 13, boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={assignCert} style={{ flex: 1, background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Assign</button>
                  <button onClick={() => setShowCertForm(false)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, padding: '8px', fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
            {certs.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: 13 }}>No certificates assigned yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {certs.map((c, i) => (
                  <div key={i} style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>{c.title}</div>
                      <div style={{ fontSize: 11, color: '#78716c' }}>{c.issued_date} {c.hours_completed ? `· ${c.hours_completed}h` : ''}</div>
                    </div>
                    <Star size={16} color="#f59e0b" fill="#f59e0b" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Admin Notes</h4>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', fontSize: 13, resize: 'none', boxSizing: 'border-box', background: '#f8fafc' }}
              placeholder="Add private notes about this volunteer..." />
            <button onClick={saveNotes} disabled={saving}
              style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, background: saving ? '#94a3b8' : '#0f4c75', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
              <Save size={14} />{saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationModal = ({ onClose, targetId, targetAll }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!title || !message) return alert('Title and message required');
    setSending(true);
    const url = targetAll ? `${API}/notifications/broadcast` : `${API}/notifications/send`;
    const body = targetAll ? { title, message, type } : { volunteer_id: targetId, title, message, type };
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setSending(false);
    alert('Notification sent!');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: 28, boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{targetAll ? 'Broadcast to All Volunteers' : 'Send Notification'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
        </div>
        <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', marginBottom: 12, fontSize: 13 }}>
          <option value="general">General</option>
          <option value="event">Event</option>
          <option value="emergency">Emergency</option>
        </select>
        <input placeholder="Title *" value={title} onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', marginBottom: 12, fontSize: 13, boxSizing: 'border-box' }} />
        <textarea placeholder="Message *" value={message} onChange={e => setMessage(e.target.value)} rows={4}
          style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', marginBottom: 16, fontSize: 13, resize: 'none', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={send} disabled={sending} style={{ flex: 1, background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 600, cursor: 'pointer' }}>
            {sending ? 'Sending...' : 'Send'}
          </button>
          <button onClick={onClose} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const EmergencyModal = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!message) return alert('Message required');
    setSending(true);
    await fetch(`${API}/notifications/emergency`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    setSending(false);
    alert('Emergency request sent to all volunteers!');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: 28, boxShadow: '0 25px 60px rgba(0,0,0,0.2)', border: '2px solid #fee2e2' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ background: '#fee2e2', borderRadius: 10, padding: 10 }}><AlertTriangle size={22} color="#dc2626" /></div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>Emergency Request</h3>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Sends to all approved volunteers</p>
          </div>
        </div>
        <textarea placeholder="Describe the emergency situation..." value={message} onChange={e => setMessage(e.target.value)} rows={5}
          style={{ width: '100%', border: '2px solid #fee2e2', borderRadius: 8, padding: '10px 12px', marginBottom: 16, fontSize: 13, resize: 'none', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={send} disabled={sending} style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 700, cursor: 'pointer' }}>
            {sending ? 'Sending...' : '🚨 Send Emergency Alert'}
          </button>
          <button onClick={onClose} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const JobModal = ({ job, onClose, onSave }) => {
  const [form, setForm] = useState(job || { title: '', description: '', requirements: '', type: 'Volunteer', priority: 'Normal' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.title) return alert('Title required');
    setSaving(true);
    const url = job ? `${API}/jobs/${job.job_id}` : `${API}/jobs`;
    const method = job ? 'PATCH' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const d = await res.json();
    if (d.success) { onSave(d.data); onClose(); }
    setSaving(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, padding: 28, boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{job ? 'Edit Position' : 'Create Job Position'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
        </div>
        {[
          { label: 'Title *', key: 'title', type: 'input' },
          { label: 'Description', key: 'description', type: 'textarea' },
          { label: 'Requirements', key: 'requirements', type: 'textarea' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 5 }}>{f.label}</label>
            {f.type === 'input'
              ? <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, boxSizing: 'border-box' }} />
              : <textarea value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} rows={3} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, resize: 'none', boxSizing: 'border-box' }} />
            }
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 5 }}>Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13 }}>
              <option>Volunteer</option><option>Staff</option><option>Internship</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 5 }}>Priority</label>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13 }}>
              <option>Normal</option><option>High</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={save} disabled={saving} style={{ flex: 1, background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontWeight: 600, cursor: 'pointer' }}>
            {saving ? 'Saving...' : 'Save Position'}
          </button>
          <button onClick={onClose} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 8, padding: '10px', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────

const VolunteerManagement = () => {
  const [activeTab, setActiveTab] = useState('registered');
  const [volunteers, setVolunteers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [notifModal, setNotifModal] = useState(null);
  const [emergencyModal, setEmergencyModal] = useState(false);
  const [jobModal, setJobModal] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [vRes, jRes] = await Promise.all([
        fetch(`${API}/volunteer/all`).then(r => r.json()),
        fetch(`${API}/jobs/all`).then(r => r.json()),
      ]);
      if (vRes.success) setVolunteers(vRes.data);
      if (jRes.success) setJobs(jRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleVolunteerStatus = async (e, id, status) => {
    e.stopPropagation();
    const res = await fetch(`${API}/volunteer/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const d = await res.json();
    if (d.success) setVolunteers(prev => prev.map(v => v.volunteer_id === id ? { ...v, status } : v));
  };

  const handleUpdateNotes = async (id, notes) => {
    const res = await fetch(`${API}/volunteer/${id}/notes`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_notes: notes })
    });
    const d = await res.json();
    if (d.success) setVolunteers(prev => prev.map(v => v.volunteer_id === id ? { ...v, admin_notes: notes } : v));
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this position?')) return;
    await fetch(`${API}/jobs/${id}`, { method: 'DELETE' });
    setJobs(prev => prev.filter(j => j.job_id !== id));
  };

  const pendingVolunteers = volunteers.filter(v => v.status === 'Pending');
  const approvedVolunteers = volunteers.filter(v => v.status === 'Approved');

  const filteredApproved = approvedVolunteers.filter(v =>
    v.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    v.email?.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { id: 'registered', label: 'Registered Volunteers', count: pendingVolunteers.length },
    { id: 'recruited', label: 'Recruited Volunteers', count: approvedVolunteers.length },
    { id: 'jobs', label: 'Job Positions', count: jobs.length },
  ];

  const statCards = [
    { label: 'Pending Review', value: pendingVolunteers.length, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Recruited', value: approvedVolunteers.length, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Open Positions', value: jobs.filter(j => j.is_active).length, color: '#0f4c75', bg: '#e0f2fe' },
  ];

  return (
    <div className="page">
      <Header />
      <main style={{ background: '#f8fafc', minHeight: '100vh', paddingTop: 80 }}>

        {/* Modals */}
        {selectedVolunteer && <VolunteerProfileModal volunteer={selectedVolunteer} onClose={() => setSelectedVolunteer(null)} onUpdateNotes={handleUpdateNotes} />}
        {notifModal && <NotificationModal onClose={() => setNotifModal(null)} targetId={notifModal.id} targetAll={notifModal.all} />}
        {emergencyModal && <EmergencyModal onClose={() => setEmergencyModal(false)} />}
        {jobModal !== null && <JobModal job={jobModal === 'new' ? null : jobModal} onClose={() => setJobModal(null)} onSave={saved => {
          setJobs(prev => jobModal === 'new' ? [...prev, saved] : prev.map(j => j.job_id === saved.job_id ? saved : j));
          setJobModal(null);
        }} />}

        {/* Page Header */}
        <div style={{ background: 'linear-gradient(135deg, #0f4c75 0%, #1eb2a6 100%)', padding: '36px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, margin: 0 }}>Volunteer Management</h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: '6px 0 0', fontSize: 14 }}>Manage applications, recruited volunteers, and job positions</p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            {statCards.map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{loading ? '-' : s.value}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            <button onClick={() => setNotifModal({ all: true })} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
              <Bell size={15} /> Notify All Volunteers
            </button>
            <button onClick={() => setEmergencyModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #fee2e2', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#dc2626' }}>
              <AlertTriangle size={15} /> Send Emergency Request
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 9, border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                  background: activeTab === t.id ? '#fff' : 'transparent',
                  color: activeTab === t.id ? '#0f4c75' : '#64748b',
                  boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
                {t.label}
                {t.count > 0 && <span style={{ background: activeTab === t.id ? '#0f4c75' : '#cbd5e1', color: '#fff', borderRadius: 20, padding: '1px 7px', fontSize: 11, fontWeight: 700 }}>{t.count}</span>}
              </button>
            ))}
          </div>

          {/* ── TAB: REGISTERED ── */}
          {activeTab === 'registered' && (
            <div>
              {/* Registered Volunteers Awaiting Approval */}
              <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>Registered Volunteers Awaiting Approval</h3>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>Volunteers who registered accounts and are pending review</p>
                </div>
                <div style={{ padding: 16 }}>
                  {pendingVolunteers.length === 0
                    ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No pending volunteers.</p>
                    : pendingVolunteers.map(v => (
                      <div key={v.volunteer_id} onClick={() => setSelectedVolunteer(v)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 10, background: '#f8fafc', marginBottom: 8, cursor: 'pointer' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <Avatar name={v.full_name} url={v.profile_picture_url} size={38} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{v.full_name}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{v.email} {v.city ? `· ${v.city}` : ''}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={e => handleVolunteerStatus(e, v.volunteer_id, 'Approved')} style={{ background: '#ecfdf5', color: '#059669', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Approve</button>
                          <button onClick={e => handleVolunteerStatus(e, v.volunteer_id, 'Rejected')} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Reject</button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: RECRUITED ── */}
          {activeTab === 'recruited' && (
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input placeholder="Search volunteers..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: 9, padding: '9px 12px 9px 36px', fontSize: 13, boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ padding: 16 }}>
                {loading ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>Loading...</p>
                  : filteredApproved.length === 0 ? <p style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No recruited volunteers found.</p>
                  : filteredApproved.map(v => {
                    const lvl = getVolunteerLevel(v.total_volunteer_hours);
                    return (
                      <div key={v.volunteer_id} onClick={() => setSelectedVolunteer(v)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 10, background: '#f8fafc', marginBottom: 8, cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <Avatar name={v.full_name} url={v.profile_picture_url} size={42} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{v.full_name}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{v.email}</div>
                            <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                              {v.skills?.slice(0, 3).map((s, i) => <span key={i} style={{ background: '#e0f2fe', color: '#0369a1', fontSize: 11, padding: '2px 8px', borderRadius: 20 }}>{s}</span>)}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: lvl.color }}>{lvl.label}</div>
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{v.total_volunteer_hours || 0}h</div>
                          </div>
                          <button onClick={e => { e.stopPropagation(); setNotifModal({ id: v.volunteer_id, all: false }); }}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: '#475569' }}>
                            <Bell size={14} />
                          </button>
                          <button onClick={e => { e.stopPropagation(); setSelectedVolunteer(v); }}
                            style={{ background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ── TAB: JOBS ── */}
          {activeTab === 'jobs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button onClick={() => setJobModal('new')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  <Plus size={15} /> Create Position
                </button>
              </div>
              {jobs.length === 0
                ? <div style={{ background: '#fff', borderRadius: 14, padding: 48, textAlign: 'center', color: '#94a3b8', border: '1px solid #f1f5f9' }}>No positions created yet.</div>
                : jobs.map(j => (
                  <div key={j.job_id} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1px solid ${j.priority === 'High' ? '#fde68a' : '#f1f5f9'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{j.title}</h3>
                          {j.priority === 'High' && <span style={{ background: '#fef3c7', color: '#d97706', fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>HIGH PRIORITY</span>}
                          <span style={{ background: '#f1f5f9', color: '#475569', fontSize: 11, padding: '2px 10px', borderRadius: 20 }}>{j.type}</span>
                          <span style={{ background: j.is_active ? '#ecfdf5' : '#f1f5f9', color: j.is_active ? '#059669' : '#94a3b8', fontSize: 11, padding: '2px 10px', borderRadius: 20 }}>{j.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        {j.description && <p style={{ margin: '0 0 8px', fontSize: 13, color: '#475569' }}>{j.description}</p>}
                        {j.requirements && (
                          <div>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>Requirements: </span>
                            <span style={{ fontSize: 12, color: '#64748b' }}>{j.requirements}</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                        <button onClick={() => setJobModal(j)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#475569' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteJob(j.job_id)} style={{ background: '#fef2f2', border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VolunteerManagement;