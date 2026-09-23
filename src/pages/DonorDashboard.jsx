import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ChevronDown, ArrowRight, Calendar, CreditCard, User, Mail, FileText, Pause, X, LogOut } from 'lucide-react';
import '../styles/DonorDashboard.css';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    expiryDate: ''
  });

  // This will be populated from your database/API
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [impactData, setImpactData] = useState([]);

  const [totalContributions, setTotalContributions] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [nextDeduction, setNextDeduction] = useState(null);

  const userName = userInfo.fullName || null;

  const handleLogout = () => {
    localStorage.removeItem("donor");
    navigate("/login");
  };
  useEffect(() => {
  const donor = JSON.parse(localStorage.getItem("donor"));

  if (!donor?.donor_id) {
    navigate("/donor_login");
    return;
  }

  const donorId = donor.donor_id;
  console.log("Logged in donorId:", donorId);

  const fetchDashboardData = async () => {
    try {
      // PROFILE
      const profileRes = await fetch(`https://khidmat.hamdardhaath.org/api/donor/${donorId}/profile`);
      const profileData = await profileRes.json();

      if (profileData.success) {
        setUserInfo({
          fullName: profileData.donor.full_name,
          email: profileData.donor.email,
          cardNumber: '',
          expiryDate: ''
        });

        setCurrentStatus(
          profileData.donor.is_monthly_subscriber
            ? "Active Subscriber"
            : "One-time Donor"
        );
      }

      // DONATIONS
      const donationsRes = await fetch(`https://khidmat.hamdardhaath.org/api/donor/${donorId}/donations`);
      const donationsData = await donationsRes.json();

      if (donationsData.success) {
        setDonations(
          donationsData.donations.map(d => ({
            id: d.donation_id,
            date: d.donation_date,
            amount: d.amount,
            campaign: d.donation_type
          }))
        );
      }

      // SUMMARY
      const summaryRes = await fetch(`https://khidmat.hamdardhaath.org/api/donor/${donorId}/summary`);
      const summaryData = await summaryRes.json();

      if (summaryData.success) {
        setTotalContributions(summaryData.totalContributions);
        setNextDeduction(summaryData.nextDeduction);
      }

    } catch (err) {
      console.error("Dashboard API error:", err);
    }
  };

  fetchDashboardData();
}, [navigate]);

  return (
    <div className="dashboard-container">
      <Header />

      {/* Main Content */}
      <main className="main-content">
        {/* Welcome Message */}
        <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="welcome-title">
            {userName ? `Welcome back, ${userName}` : 'Welcome back'}
          </h1>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em', flexShrink: 0 }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          {/* Total Contributions */}
          <div className="card card-blue">
            <div className="card-value">
              {totalContributions !== null ? `${totalContributions.toLocaleString()}` : '--'}
            </div>
            <div className="card-label">Total Contributions</div>
          </div>

          {/* Current Status */}
          <div className="card card-green">
            <div className="card-value">{currentStatus || '--'}</div>
            <div className="card-label">Current Status</div>
          </div>

          {/* Next Auto-Deduction */}
          <div className="card card-yellow">
            <div className="card-value">{nextDeduction || '--'}</div>
            <div className="card-label">Next Auto-Deduction</div>
          </div>
        </div>

        {/* Donations Section */}
        <div className="section">
          <h2 className="section-title">All Donations</h2>
          
          {/* Tabs */}
          <div className="tabs-container">
            <nav className="tabs">
              <button
                onClick={() => setActiveTab('all')}
                className={`tab ${activeTab === 'all' ? 'tab-active' : 'tab-inactive'}`}
              >
                All Donations
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`tab ${activeTab === 'subscriptions' ? 'tab-active' : 'tab-inactive'}`}
              >
                Monthly Subscriptions
              </button>
              <button
                onClick={() => setActiveTab('one-time')}
                className={`tab ${activeTab === 'one-time' ? 'tab-active' : 'tab-inactive'}`}
              >
                One-Time Contributions
              </button>
            </nav>
          </div>

          {/* Donations Table */}
          <div className="table-container">
            {donations.length > 0 ? (
              <table className="donations-table">
                <thead>
                  <tr className="table-header">
                    <th className="table-header-cell">Date</th>
                    <th className="table-header-cell">Amount</th>
                    <th className="table-header-cell">Campaign</th>
                    <th className="table-header-cell">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation.id} className="table-row">
                      <td className="table-cell">{donation.date}</td>
                      <td className="table-cell table-cell-amount">${donation.amount.toFixed(2)}</td>
                      <td className="table-cell">{donation.campaign}</td>
                      <td className="table-cell">
                        <button className="receipt-button">
                          <FileText className="receipt-icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">
                <p className="no-data-text">No donations found. Data will appear here once available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Impact Distribution Section */}
        <div className="section">
          <h2 className="section-title">Your Impact Distribution</h2>
          
          <div className="impact-container">
            {impactData.length > 0 ? (
              <>
                {/* Donut Chart */}
                <div className="chart-container">
                  <svg className="donut-chart" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    {impactData.map((item, index) => {
                      const circumference = 2 * Math.PI * 40;
                      const strokeDasharray = (item.percentage / 100) * circumference;
                      const strokeDashoffset = circumference - strokeDasharray;
                      const offset = impactData
                        .slice(0, index)
                        .reduce((acc, curr) => acc + (curr.percentage / 100) * circumference, 0);
                      
                      const strokeColor = item.color === 'purple' ? '#8b5cf6' : 
                                       item.color === 'green' ? '#10b981' : '#f97316';
                      
                      return (
                        <circle
                          key={item.category}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="8"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          style={{
                            transformOrigin: '50% 50%',
                            transform: `rotate(${offset * (180 / Math.PI / 40)}deg)`
                          }}
                        />
                      );
                    })}
                  </svg>
                  <div className="chart-center">
                    <div className="chart-center-content">
                      <div className="chart-percentage">100%</div>
                      <div className="chart-label">Impact</div>
                    </div>
                  </div>
                </div>

                {/* Legend and Controls */}
                <div className="legend-container">
                  <div className="legend">
                    {impactData.map((item) => (
                      <div key={item.category} className="legend-item">
                        <div className={`legend-color legend-color-${item.color}`}></div>
                        <span className="legend-text">{item.category}: {item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                  <button className="adjust-button">
                    Adjust Donation Preferences
                  </button>
                </div>
              </>
            ) : (
              <div className="no-data">
                <p className="no-data-text">Impact distribution will be shown here once donation data is available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="section">
          <h2 className="section-title">Settings</h2>
          
          <div className="settings-content">
            {/* Edit Contact Info */}
            <div className="settings-group">
              <h3 className="settings-subtitle">Edit Contact Info</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Full Name</label>
                  <div className="input-container">
                    <User className="input-icon" />
                    <input
                      type="text"
                      value={userInfo.fullName}
                      onChange={(e) => setUserInfo({ ...userInfo, fullName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <div className="input-container">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Update Card Info */}
            <div className="settings-group">
              <h3 className="settings-subtitle">Update Card Info</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Card Number</label>
                  <div className="input-container">
                    <CreditCard className="input-icon" />
                    <input
                      type="text"
                      value={userInfo.cardNumber}
                      onChange={(e) => setUserInfo({ ...userInfo, cardNumber: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label className="form-label">Expiry Date</label>
                  <div className="input-container">
                    <Calendar className="input-icon" />
                    <input
                      type="text"
                      value={userInfo.expiryDate}
                      onChange={(e) => setUserInfo({ ...userInfo, expiryDate: e.target.value })}
                      placeholder="MM/YY"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Management */}
            <div className="settings-group">
              <h3 className="settings-subtitle">Subscription Management</h3>
              <div className="subscription-info">
                <p className="subscription-text">
                  {nextDeduction ? 
                    `Your monthly subscription will be renewed on ${nextDeduction}, 2024.` :
                    'Subscription information will be displayed here once available.'
                  }
                </p>
                {nextDeduction && (
                  <div className="subscription-actions">
                    <button className="subscription-button subscription-button-pause">
                      <Pause className="subscription-icon" />
                      <span>Pause Subscription</span>
                    </button>
                    <button className="subscription-button subscription-button-cancel">
                      <X className="subscription-icon" />
                      <span>Cancel Subscription</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="save-section">
              <button className="save-button">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DonorDashboard;










