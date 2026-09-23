"use client"

import React, { useState, useEffect } from "react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import "../styles/system_administration.css"

export default function SystemAdministration() {
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    role: "admin",
    permissions: ""
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async (search = "") => {
    try {
      setLoading(true);
      const url = search 
        ? `https://khidmat.hamdardhaath.org/api/admin/all?search=${encodeURIComponent(search)}`
        : 'https://khidmat.hamdardhaath.org/api/admin/all';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setAdmins(data.data);
      } else {
        console.error('Failed to fetch admins:', data.message);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      fetchAdmins(query);
    }, 300);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://khidmat.hamdardhaath.org/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Admin created successfully!');
        setShowAddModal(false);
        resetForm();
        fetchAdmins();
      } else {
        alert(data.message || 'Failed to create admin');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Failed to create admin');
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    
    try {
      const updateData = { ...formData };
      // Don't send password if it's empty (means not changing it)
      if (!updateData.password) {
        delete updateData.password;
      }
      
      const response = await fetch(`https://khidmat.hamdardhaath.org/api/admin/${editingAdmin.admin_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Admin updated successfully!');
        setEditingAdmin(null);
        setShowAddModal(false);
        resetForm();
        fetchAdmins();
      } else {
        alert(data.message || 'Failed to update admin');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      alert('Failed to update admin');
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://khidmat.hamdardhaath.org/api/admin/${adminId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Admin deleted successfully!');
        fetchAdmins();
      } else {
        alert(data.message || 'Failed to delete admin');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Failed to delete admin');
    }
  };

  const handleBackup = async () => {
    try {
      const response = await fetch('https://khidmat.hamdardhaath.org/api/admin/backup', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Backup created successfully!\nFilename: ${data.filename}`);
      } else {
        alert(data.message || 'Failed to create backup');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Failed to create backup');
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('https://khidmat.hamdardhaath.org/api/admin/export', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Download as JSON file
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        alert('Data exported successfully!');
      } else {
        alert(data.message || 'Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data');
    }
  };

  const openAddModal = () => {
    resetForm();
    setEditingAdmin(null);
    setShowAddModal(true);
  };

  const openEditModal = (admin) => {
    setFormData({
      email: admin.email,
      password: "", // Don't populate password for security
      username: admin.username,
      role: admin.role,
      permissions: admin.permissions || ""
    });
    setEditingAdmin(admin);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      username: "",
      role: "admin",
      permissions: ""
    });
  };

  return (
    <>
      <Header />

      <div className="sa-container">
        <header className="sa-header">
          <h1 className="sa-title">System Administration</h1>
        </header>

        <section className="sa-user-management">
          <div className="sa-section-header">
            <h2 className="sa-section-title">User Management</h2>
            <div className="sa-header-actions">
              <div className="sa-search">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="sa-search-input"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <button className="sa-add-button" onClick={openAddModal}>Add User</button>
            </div>
          </div>

          <div className="sa-table-wrapper">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                      Loading...
                    </td>
                  </tr>
                ) : admins.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                      No admins found
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.admin_id}>
                      <td>{admin.username}</td>
                      <td>{admin.role}</td>
                      <td>{admin.permissions || 'N/A'}</td>
                      <td>
                        <div className="sa-action-buttons">
                          <button 
                            className="sa-icon-button sa-edit"
                            onClick={() => openEditModal(admin)}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button 
                            className="sa-icon-button sa-delete"
                            onClick={() => handleDeleteAdmin(admin.admin_id)}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="sa-tools">
          <h2 className="sa-section-title">System Tools</h2>

          <div className="sa-tools-grid">
            <div className="sa-tool-card">
              <div className="sa-tool-icon sa-icon-backup">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <div className="sa-tool-content">
                <h3 className="sa-tool-title">Backup Database</h3>
                <p className="sa-tool-meta">Create a backup of the entire database</p>
              </div>
              <button className="sa-tool-button sa-button-blue" onClick={handleBackup}>
                Create Backup
              </button>
            </div>

            <div className="sa-tool-card">
              <div className="sa-tool-icon sa-icon-export">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div className="sa-tool-content">
                <h3 className="sa-tool-title">Export Reports</h3>
                <p className="sa-tool-meta">Export all system data</p>
              </div>
              <button className="sa-tool-button sa-button-green" onClick={handleExport}>
                Export Data
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Add/Edit Admin Modal */}
      {showAddModal && (
        <div className="sa-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sa-modal-header">
              <h2>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h2>
              <button className="sa-modal-close" onClick={() => setShowAddModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={editingAdmin ? handleUpdateAdmin : handleAddAdmin}>
              <div className="sa-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@example.com"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Username *</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="admin.user"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Password {editingAdmin ? '(leave blank to keep current)' : '*'}</label>
                <input
                  type="password"
                  required={!editingAdmin}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              
              <div className="sa-form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              
              <div className="sa-form-group">
                <label>Permissions</label>
                <input
                  type="text"
                  value={formData.permissions}
                  onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                  placeholder="e.g., Full Access, Read Only"
                />
              </div>
              
              <div className="sa-form-actions">
                <button type="button" className="sa-btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="sa-btn-submit">
                  {editingAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
