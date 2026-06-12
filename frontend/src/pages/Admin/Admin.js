import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gemstoneAPI, userAPI, recommendationAPI } from '../../services/api';
import {
  LayoutDashboard,
  Users,
  Gem,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  BarChart,
  PieChart,
  LogOut
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminAuth from '../../components/AdminAuth';

const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuth') === 'true';
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [gemstones, setGemstones] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGemstone, setSelectedGemstone] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('adminAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    navigate('/');
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, gemstonesRes, usersRes] = await Promise.all([
        recommendationAPI.getAnalytics(),
        gemstoneAPI.getAllGemstones(),
        userAPI.getAllUsers()
      ]);
      setAnalytics(analyticsRes.data.data);
      setGemstones(gemstonesRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGemstone = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gemstone?')) return;
    
    try {
      await gemstoneAPI.deleteGemstone(id);
      loadData();
    } catch (error) {
      console.error('Error deleting gemstone:', error);
      alert('Error deleting gemstone');
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userAPI.deleteUser(email);
      loadData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticate={handleAuthenticate} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'gemstones', label: 'Gemstones', icon: Gem },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Admin Panel
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && analytics && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalUsers}</p>
                  </div>
                  <Users className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Recommendations</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalRecommendations}</p>
                  </div>
                  <Gem className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Gemstones</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalGemstones}</p>
                  </div>
                  <Gem className="h-12 w-12 text-secondary-600" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Most Recommended</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{analytics.mostRecommended}</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-primary-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gemstones Tab */}
        {activeTab === 'gemstones' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Gemstones</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Gemstone
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Image</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Planet</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Price Range</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gemstones.map((gemstone) => (
                    <tr key={gemstone.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <img
                          src={gemstone.image}
                          alt={gemstone.name}
                          className="w-12 h-12 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect width="48" height="48" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="10" fill="%236b7280"%3ENo%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{gemstone.name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{gemstone.planet}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{gemstone.priceRange}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedGemstone(gemstone);
                              setShowEditModal(true);
                            }}
                            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGemstone(gemstone.id)}
                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Manage Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Name</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">DOB</th>
                    <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{user.name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{user.email}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{user.dob}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDeleteUser(user.email)}
                          className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-primary-600" />
                  Gemstone Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analytics.gemstoneDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.gemstoneDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-primary-600" />
                  Purpose Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={analytics.purposeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="purpose" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#ef4444" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Monthly Recommendations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={analytics.monthlyDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#22c55e" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
