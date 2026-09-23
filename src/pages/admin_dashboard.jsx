import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Heart, DollarSign, Megaphone, FileText, Calendar, UserCheck, BarChart3, Plus, Shield, LogOut } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../styles/donor_login.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeDonors: 0,
    registeredVolunteers: 0,
    formattedFundsRaised: "$0",
    runningCampaigns: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin_login");
  };

  useEffect(() => {
    // Fetch dashboard statistics from backend
    fetch('https://khidmat.hamdardhaath.org/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  }, []);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="page">
      <Header />
      
      <main className="bg-gray-50 font-sans relative pt-20">
        {/* Header */}
        <div className="bg-blue-50 py-10 mb-8 border-b border-blue-100" style={{ position: 'relative' }}>
          <h1 className="text-3xl font-bold text-center text-slate-800">Admin Dashboard</h1>
          <p className="text-center text-gray-600 mt-2">Platform Summary & Quick Access</p>
          <button
            onClick={handleLogout}
            style={{ position: 'absolute', top: '50%', right: 24, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 6, background: '#0f4c75', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="p-4 rounded-full bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{loading ? "..." : formatNumber(stats.activeDonors)}</div>
                <div className="text-sm text-gray-500 font-medium">Active Donors</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="p-4 rounded-full bg-pink-100">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{loading ? "..." : formatNumber(stats.registeredVolunteers)}</div>
                <div className="text-sm text-gray-500 font-medium">Registered Volunteers</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="p-4 rounded-full bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{loading ? "..." : stats.formattedFundsRaised}</div>
                <div className="text-sm text-gray-500 font-medium">Total Funds Raised</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="p-4 rounded-full bg-orange-100">
                <Megaphone className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{loading ? "..." : stats.runningCampaigns}</div>
                <div className="text-sm text-gray-500 font-medium">Running Campaigns</div>
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Cases</h3>
                  <p className="text-sm text-gray-500">Review and manage ongoing cases</p>
                </div>
              </div>
              <button 
                className="w-full bg-[#0f4c75] hover:bg-[#0b3a5a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => navigate('/create_case')}
              >
                View Cases
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-indigo-100">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Events</h3>
                  <p className="text-sm text-gray-500">Schedule and organize events</p>
                </div>
              </div>
              <button 
                className="w-full bg-[#0f4c75] hover:bg-[#0b3a5a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => navigate('/eventmanagement')}
              >
                Manage Events
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Manage Volunteers</h3>
                  <p className="text-sm text-gray-500">Coordinate volunteer activities</p>
                </div>
              </div>
              <button 
                className="w-full bg-[#0f4c75] hover:bg-[#0b3a5a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => navigate('/volunteer_management')}
              >
                View Volunteers
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-teal-100">
                  <BarChart3 className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Donor Analytics</h3>
                  <p className="text-sm text-gray-500">View trends and donation reports</p>
                </div>
              </div>
              <button 
                className="w-full bg-[#0f4c75] hover:bg-[#0b3a5a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => navigate('/donor_analytics')}
              >
                View Analytics
              </button>
            </div>
          </div>

          {/* Create Fundraiser Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Create Fundraiser</h3>
                  <p className="text-sm text-gray-500">Start a new fundraising campaign</p>
                </div>
              </div>
              <button 
                className="bg-[#0f4c75] hover:bg-[#0b3a5a] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => navigate('/fundraiserpanel')}
              >
                Create New
              </button>
            </div>
          </div>

          {/* System Administration Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-indigo-100">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">System Administration</h3>
                  <p className="text-sm text-gray-500">Add new administrator access</p>
                </div>
              </div>
              <button 
                className="bg-[#0f4c75] hover:bg-[#0b3a5a] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => navigate('/system_administration')}
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
