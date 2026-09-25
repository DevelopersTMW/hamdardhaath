import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Edit, Trash, MoreVertical, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import '../styles/donor_login.css';

const FundraiserPanel = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch fundraisers from API
  const fetchFundraisers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://app.hamdardhaath.org/api/fundraisers');
      const data = await response.json();
      
      if (data.success) {
        setFundraisers(data.data);
      } else {
        setError('Failed to fetch fundraisers');
      }
    } catch (err) {
      console.error('Error fetching fundraisers:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Load fundraisers on component mount
  useEffect(() => {
    fetchFundraisers();
  }, []);

  const percent = (raised, target) => Math.min(100, Math.round((raised / target) * 100));
  const remaining = (raised, target) => Math.max(0, 100 - percent(raised, target));

  const launchFundraiser = async () => {
    if (!newTitle || !newPurpose || !newTarget || !newEndDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('https://app.hamdardhaath.org/api/fundraisers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          purpose: newPurpose,
          targetAmount: Number(newTarget),
          endDate: newEndDate,
          campaign_type: newPurpose
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear form
        setNewTitle('');
        setNewPurpose('');
        setNewTarget('');
        setNewEndDate('');
        
        // Refresh fundraiser list
        await fetchFundraisers();
        
        alert('Fundraiser created successfully!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Error creating fundraiser:', err);
      alert('Error connecting to server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fundraiser?')) {
      return;
    }

    try {
      const response = await fetch(`https://app.hamdardhaath.org/api/fundraisers/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchFundraisers();
        alert('Fundraiser deleted successfully!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error('Error deleting fundraiser:', err);
      alert('Error connecting to server');
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="bg-gray-50 font-sans relative pt-20">
        {/* Header */}
        <div className="bg-blue-50 py-10 mb-8 border-b border-blue-100">
          <h1 className="text-3xl font-bold text-center text-slate-800">Fundraiser Panel</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Create New Fundraiser Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Fundraiser</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter fundraiser title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <select
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select purpose</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              {/* Target Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              onClick={launchFundraiser}
              disabled={submitting}
              className="w-full md:w-auto bg-[#0f4c75] hover:bg-[#0b3a5a] text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Launch Fundraiser'}
            </button>
          </div>

          {/* Current Fundraisers Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Current Fundraisers</h2>
              
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search fundraisers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter Button */}
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>

                {/* Export Button */}
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="p-8 text-center text-gray-600">
                Loading fundraisers...
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-8 text-center text-red-600">
                {error}
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                      <tr>
                        <th className="px-6 py-4">Fundraiser Title</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Amount Raised</th>
                        <th className="px-6 py-4">Remaining</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {fundraisers.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                            No fundraisers found. Create your first fundraiser above!
                          </td>
                        </tr>
                      ) : (
                        fundraisers.map((fundraiser) => {
                          const progressPercent = percent(fundraiser.raisedAmount, fundraiser.targetAmount);
                          const remainingPercent = remaining(fundraiser.raisedAmount, fundraiser.targetAmount);
                          
                          return (
                            <tr key={fundraiser.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="font-medium text-gray-900">{fundraiser.title}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                  {fundraiser.type}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-2">
                                  <div className="font-medium text-gray-900">
                                    {fundraiser.raisedAmount.toLocaleString()}
                                  </div>
                                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 rounded-full transition-all"
                                      style={{ width: `${progressPercent}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-gray-600">{remainingPercent}%</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button 
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(fundraiser.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                    title="Delete"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                  <button 
                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded transition"
                                    title="More options"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="p-4 flex justify-between items-center border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    Showing 1 to {fundraisers.length} of {fundraisers.length} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-1 bg-[#0f4c75] text-white rounded text-sm">1</button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FundraiserPanel;