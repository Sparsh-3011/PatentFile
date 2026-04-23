import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { FileCheck, LogOut, Users, FileText, CheckCircle, Clock, TrendingUp, LayoutDashboard, List } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, appsRes] = await Promise.all([
        axios.get(`${API}/stats`, { withCredentials: true }),
        axios.get(`${API}/applications`, { withCredentials: true })
      ]);
      setStats(statsRes.data);
      setRecentApps(appsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const STATUS_COLORS = {
    submitted: 'bg-blue-100 text-blue-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-orange-100 text-orange-700',
    abstract_needed: 'bg-purple-100 text-purple-700',
    filing: 'bg-indigo-100 text-indigo-700',
    filed: 'bg-emerald-100 text-emerald-700',
    acknowledged: 'bg-green-100 text-green-700',
    granted: 'bg-green-200 text-green-800'
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="admin-dashboard">
      {/* Admin Nav */}
      <nav className="bg-[#0F172A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2" data-testid="admin-nav-logo">
              <div className="w-8 h-8 bg-[#002FA7] rounded-sm flex items-center justify-center">
                <FileCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>PatentFile Admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link to="/admin" data-testid="admin-nav-dashboard">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs">
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> Dashboard
                </Button>
              </Link>
              <Link to="/admin/applications" data-testid="admin-nav-applications">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs">
                  <List className="w-3.5 h-3.5 mr-1.5" /> Applications
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 hidden sm:block">{user?.email}</span>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs" data-testid="admin-logout-btn">
              <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Dashboard</h1>
          <p className="text-sm text-[#475569] mt-1">Overview of patent applications and status</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Applications', value: stats?.total || 0, icon: Users, color: 'text-[#002FA7]', bg: 'bg-[#002FA7]/8' },
                { label: 'New Submissions', value: stats?.submitted || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
                { label: 'In Progress', value: stats?.in_progress || 0, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
                { label: 'Filed / Granted', value: (stats?.filed || 0) + (stats?.granted || 0), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
              ].map((s, i) => (
                <div key={i} className="bg-white border border-[#E2E8F0] rounded-sm p-6" data-testid={`stat-card-${i}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#475569]">{s.label}</span>
                    <div className={`w-8 h-8 ${s.bg} rounded-sm flex items-center justify-center`}>
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                    </div>
                  </div>
                  <span className="text-3xl font-black text-[#0F172A]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Topic Distribution + Recent Applications */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Topic Distribution */}
              <div className="bg-white border border-[#E2E8F0] rounded-sm p-6" data-testid="topic-distribution">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-4" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Topic Distribution</h3>
                {stats?.topic_distribution?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topic_distribution.map((t, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#0F172A] truncate">{t.topic}</p>
                          <div className="mt-1 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#002FA7] rounded-full"
                              style={{ width: `${Math.min(100, (t.count / (stats.total || 1)) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#0F172A] flex-shrink-0">{t.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#475569]">No applications yet</p>
                )}
              </div>

              {/* Recent Applications */}
              <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-sm p-6" data-testid="recent-applications">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#0F172A]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Recent Applications</h3>
                  <Link to="/admin/applications" data-testid="view-all-applications">
                    <Button variant="ghost" size="sm" className="text-xs text-[#002FA7]">View All</Button>
                  </Link>
                </div>
                {recentApps.length > 0 ? (
                  <div className="space-y-3">
                    {recentApps.map((app, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-sm" data-testid={`recent-app-${i}`}>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#002FA7]">{app.tracking_id}</span>
                            <span className={`inline-flex px-2 py-0.5 rounded-sm text-[10px] font-semibold ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'}`}>
                              {app.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-[#0F172A] mt-0.5">{app.student_name}</p>
                          <p className="text-xs text-[#475569] truncate">{app.topic_title}</p>
                        </div>
                        <span className="text-[10px] text-[#475569] flex-shrink-0 ml-3">
                          {new Date(app.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#475569] text-center py-8">No applications yet</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
