import { useState, useEffect } from "react";
import { Search, Filter, Edit, Trash, Upload, Calendar, FileText, DollarSign, TrendingUp } from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "../styles/donor_login.css";

export default function CreateCase() {
  const [stats, setStats] = useState({
    totalCases: 0,
    totalFunding: 0,
    successRate: 0,
    avgDonation: 0
  });
  const [cases, setCases] = useState([]);
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetAmount: "",

  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchCases();
    fetchCauses();
  }, []);

  const fetchStats = () => {
    fetch('https://app.hamdardhaath.org/api/cases/stats')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Stats data received:', data);
        if (data.success && data.data) {
          setStats(data.data);
        } else {
          console.error('Stats API returned unsuccessful response:', data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching stats:', err);
        setLoading(false);
      });
  };

  const fetchCases = () => {
    fetch('https://app.hamdardhaath.org/api/cases')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Cases data received:', data);
        if (data.success && data.data) {
          setCases(data.data);
        } else {
          console.error('Cases API returned unsuccessful response:', data);
        }
      })
      .catch(err => {
        console.error('Error fetching cases:', err);
      });
  };

  const fetchCauses = () => {
    fetch('https://app.hamdardhaath.org/api/cases/causes')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCauses(data.data);
        }
      })
      .catch(err => {
        console.error('Error fetching causes:', err);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (file) => {
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileInput = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.targetAmount) {
      alert('Please fill in required fields: Title and Target Amount');
      return;
    }

    try {
      const response = await fetch('https://app.hamdardhaath.org/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          targetAmount: formData.targetAmount
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          targetAmount: ""
        });
        setImageFile(null);
        setImagePreview(null);
        
        // Refresh data
        fetchStats();
        fetchCases();
        
        alert('Case created successfully!');
      } else {
        alert('Error creating case: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Error creating case. Please try again.');
    }
  };

  // Add this function near your other functions (after fetchCauses)
  const handleDeleteCase = async (caseId) => {
    if (!window.confirm('Are you sure you want to delete this case?')) {
      return;
    }

    try {
      const response = await fetch(`https://app.hamdardhaath.org/api/cases/${caseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Case deleted successfully!');
        // Refresh the data
        fetchStats();
        fetchCases();
      } else {
        alert('Error deleting case: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting case:', error);
      alert('Error deleting case. Please try again.');
    }
  };
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="page">
      <Header />

      <main className="bg-gray-50 font-sans relative pt-20">
        {/* Header */}
        <div className="bg-blue-50 py-10 mb-8 border-b border-blue-100">
          <h1 className="text-3xl font-bold text-center text-slate-800">Case Management</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="p-4 rounded-full bg-blue-100">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{loading ? "..." : formatNumber(stats.totalCases)}</div>
                <div className="text-sm text-gray-500 font-medium">Total Cases</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="p-4 rounded-full bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{loading ? "..." : formatNumber(stats.totalFunding || 0)}</div>
                <div className="text-sm text-gray-500 font-medium">Total Funding</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="p-4 rounded-full bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{loading ? "..." : `${stats.successRate}%`}</div>
                <div className="text-sm text-gray-500 font-medium">Success Rate</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5">
              <div className="p-4 rounded-full bg-pink-100">
                <DollarSign className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800">{loading ? "..." : formatNumber(parseFloat(stats.avgDonation || 0).toFixed(1))}</div>
                <div className="text-sm text-gray-500 font-medium">Avg Donation</div>
              </div>
            </div>
          </div>

          {/* Create New Case Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Case</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Case Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Case Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter case title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category */}
                {/* Category / Cause */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category / Cause</label>
                  
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Select or type a new cause"
                    list="cause-list"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Datalist provides existing options but allows typing a new one */}
                  <datalist id="cause-list">
                    {causes.map((cause) => (
                      <option key={cause.cause_id} value={cause.name} />
                    ))}
                  </datalist>
                </div>


                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount *</label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter case description"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Drop image here or click to upload</p>
                      <p className="text-xs text-gray-500 mb-4">Supported formats: JPG, PNG, GIF. Max size: 5MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="image-upload"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-[#0f4c75] hover:bg-[#0b3a5a] text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Launch Case
              </button>
            </form>
          </div>

          {/* Active Cases Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Active Cases</h2>
              
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cases..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter Button */}
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase font-medium text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Case Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Amount Needed</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cases.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No cases available. Create your first case above.
                      </td>
                    </tr>
                  ) : (
                    cases.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <div className="font-medium text-gray-900">{caseItem.title}</div>
                              <div className="text-xs text-gray-500">{caseItem.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{caseItem.targetAmount?.toLocaleString() || '0'}</td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${Math.min(100, Math.max(0, caseItem.progress))}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{caseItem.progress.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCase(caseItem.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 flex justify-between items-center border-t border-gray-100">
              <div className="text-sm text-gray-600">
                Showing 1 to {cases.length} of {cases.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#0f4c75] text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}