import React, { useState, useEffect } from 'react';
import { 
  Calendar, Filter, ArrowRightLeft, Download, ChevronDown 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import '../styles/donor_login.css';

const COLORS = ['#007BFF', '#10B981']; // Blue, Green

// --- Components ---
const SelectInput = ({ icon: Icon, placeholder, value, onChange, options }) => (
  <div className="relative inline-block w-40">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex items-center border border-gray-300 rounded-md pl-10 pr-8 py-2 bg-white cursor-pointer hover:border-gray-400 w-full text-sm text-gray-700 appearance-none"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
    </div>
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
  </div>
);

const KPICard = ({ title, value, change, isPositive }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
    <p className="text-3xl font-semibold text-gray-900 mb-1">{value}</p>
    {change && (
      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = status === 'Active' 
    ? 'bg-green-100 text-green-700' 
    : 'bg-red-100 text-red-700';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
};

// Heatmap Simulation Component (Kept for aesthetic, can be made dynamic later)
const HeatmapGrid = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const gridCells = Array(35).fill(0).map(() => Math.random());
  const getColor = (opacity) => {
    if (opacity > 0.8) return 'bg-pink-200';
    if (opacity > 0.6) return 'bg-green-100';
    if (opacity > 0.4) return 'bg-orange-100';
    if (opacity > 0.2) return 'bg-blue-50';
    return 'bg-gray-50';
  };
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="grid grid-cols-7 gap-2">
        {gridCells.map((val, i) => <div key={i} className={`h-8 rounded-sm ${getColor(val)}`} />)}
      </div>
      <div className="grid grid-cols-7 gap-2 mt-2">
        {days.map(day => <div key={day} className="text-xs text-center text-gray-500">{day}</div>)}
      </div>
    </div>
  );
};

// --- Main Dashboard ---
const DonorDashboard = () => {
  const [allDonors, setAllDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [dateFilter, setDateFilter] = useState('');
  const [causeFilter, setCauseFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch Data from Backend
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('https://app.hamdardhaath.org/api/analytics/donor-dashboard');
        const result = await response.json();
        if (result.success) {
          setAllDonors(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Filter logic
  const filteredDonors = allDonors.filter(donor => {
    const matchesCause = !causeFilter || donor.cause.includes(causeFilter);
    const matchesType = !typeFilter || donor.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter) {
      const donationDate = new Date(donor.date);
      const now = new Date();
      const diffTime = Math.abs(now - donationDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (dateFilter === 'Last 7 Days') matchesDate = diffDays <= 7;
      if (dateFilter === 'Last 30 Days') matchesDate = diffDays <= 30;
      if (dateFilter === 'Last 90 Days') matchesDate = diffDays <= 90;
      if (dateFilter === 'Last Year') matchesDate = diffDays <= 365;
    }
    
    return matchesCause && matchesType && matchesDate;
  });

  // Calculate Dynamic KPIs based on filters
  const totalDonations = filteredDonors.reduce((sum, d) => sum + d.amount, 0);
  const averageDonation = filteredDonors.length ? (totalDonations / filteredDonors.length) : 0;
  const uniqueDonors = new Set(filteredDonors.map(d => d.name)).size;

  const kpiData = [
    { title: 'Total Donations', value: `$${totalDonations.toLocaleString()}`, change: '+12.5%', isPositive: true },
    { title: 'Average Donation', value: `$${averageDonation.toFixed(0)}`, change: '+5.2%', isPositive: true },
    { title: 'Total Donors', value: uniqueDonors.toString(), change: '+8.1%', isPositive: true },
    { title: 'Retention Rate', value: '76%', change: '+2.3%', isPositive: true },
  ];

  // Calculate Dynamic Monthly Data
  const monthlyMap = {};
  filteredDonors.forEach(d => {
    const month = new Date(d.date).toLocaleString('default', { month: 'short' });
    monthlyMap[month] = (monthlyMap[month] || 0) + d.amount;
  });
  const dynamicMonthlyData = Object.keys(monthlyMap).map((key, index) => ({
    name: key,
    value: monthlyMap[key],
    fill: ['#10B981', '#F59E0B', '#EF4444', '#6366F1', '#D946EF', '#DC2626'][index % 6]
  }));

  // Calculate Dynamic Pie Chart
  const oneTimeCount = filteredDonors.filter(d => d.type === 'One-Time').length;
  const recurringCount = filteredDonors.filter(d => d.type === 'Recurring').length;
  const dynamicPreferenceData = [
    { name: 'One-Time', value: oneTimeCount },
    { name: 'Recurring', value: recurringCount },
  ];

  // Pagination logic
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonors = filteredDonors.slice(startIndex, startIndex + itemsPerPage);

  const exportToCSV = () => {
    const headers = ['Donor Name', 'Type', 'Cause', 'Target', 'Amount', 'Status', 'Date'];
    const csvData = filteredDonors.map(donor => [
      donor.name, donor.type, donor.cause, donor.target_name, donor.amount, donor.status, donor.date
    ]);
    const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'donor_analytics.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading Analytics...</div>;
  }

  return (
    <div className="page">
      <Header />
      <main className="bg-slate-50 font-sans text-gray-800 pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Donor Analytics & Reports</h1>
          </header>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <SelectInput 
              icon={Calendar} placeholder="All Time" value={dateFilter} onChange={setDateFilter}
              options={['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last Year']}
            />
            <SelectInput 
              icon={Filter} placeholder="All Causes" value={causeFilter} onChange={setCauseFilter}
              options={['Medical', 'Education', 'Disaster Relief', 'Seasonal Aid']}
            />
            <SelectInput 
              icon={ArrowRightLeft} placeholder="All Types" value={typeFilter} onChange={setTypeFilter}
              options={['One-Time', 'Recurring']}
            />
            <button 
              onClick={() => setCurrentPage(1)}
              className="bg-[#0f4c75] hover:bg-[#0b3a5a] text-white px-5 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Apply Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiData.map((kpi, index) => <KPICard key={index} {...kpi} />)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Monthly Contributions (Bar Chart) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-6">Monthly Contributions</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicMonthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={32}>
                      {dynamicMonthlyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donor Preferences (Donut Chart) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
              <div className="w-full text-left">
                <h3 className="text-base font-semibold text-gray-900 mb-2">Donor Preferences</h3>
              </div>
              <div className="h-64 w-full relative">
                {dynamicPreferenceData.reduce((a,b)=>a+b.value,0) > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dynamicPreferenceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={0} dataKey="value">
                        {dynamicPreferenceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="square" />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">No data for selected filters</div>
                )}
              </div>
            </div>

            {/* Peak Activity Days (Heatmap) */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-6">Peak Activity Days</h3>
              <div className="h-64"><HeatmapGrid /></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Filtered Donors ({filteredDonors.length})</h3>
              <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Donor Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Cause Category</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedDonors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{donor.name}</td>
                      <td className="px-6 py-4">{donor.type}</td>
                      <td className="px-6 py-4">{donor.cause}</td>
                      <td className="px-6 py-4">${donor.amount}</td>
                      <td className="px-6 py-4"><StatusBadge status={donor.status} /></td>
                      <td className="px-6 py-4">{donor.date}</td>
                    </tr>
                  ))}
                  {paginatedDonors.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">No donations found matching criteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 flex justify-between items-center border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDonors.length)} of {filteredDonors.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50">Previous</button>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50">Next</button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DonorDashboard;