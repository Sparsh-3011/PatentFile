import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileCheck, LogOut, LayoutDashboard, List, Search, RefreshCw, Eye } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'abstract_needed', label: 'Abstract Needed' },
  { value: 'filing', label: 'Filing in Progress' },
  { value: 'filed', label: 'Patent Filed' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'granted', label: 'Patent Granted' },
];

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

export default function AdminApplications() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filterStatus]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      const { data } = await axios.get(`${API}/applications?${params}`, { withCredentials: true });
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const openUpdateDialog = (app) => {
    setSelectedApp(app);
    setUpdateStatus(app.status);
    setUpdateNotes(app.admin_notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      await axios.put(
        `${API}/applications/${selectedApp.tracking_id}/status`,
        { status: updateStatus, admin_notes: updateNotes },
        { withCredentials: true }
      );
      toast.success('Status updated successfully');
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="admin-applications-page">
      {/* Admin Nav */}
      <nav className="bg-[#0F172A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2" data-testid="apps-nav-logo">
              <div className="w-8 h-8 bg-[#002FA7] rounded-sm flex items-center justify-center">
                <FileCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>PatentFile Admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link to="/admin" data-testid="apps-nav-dashboard">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs">
                  <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" /> Dashboard
                </Button>
              </Link>
              <Link to="/admin/applications" data-testid="apps-nav-applications">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-xs bg-white/10">
                  <List className="w-3.5 h-3.5 mr-1.5" /> Applications
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 hidden sm:block">{user?.email}</span>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs" data-testid="apps-logout-btn">
              <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Applications</h1>
            <p className="text-sm text-[#475569]">{applications.length} application(s) found</p>
          </div>
          <Button onClick={fetchApplications} variant="outline" size="sm" className="rounded-sm text-xs" data-testid="refresh-btn">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, tracking ID..."
              className="rounded-sm text-sm"
              data-testid="search-input"
            />
            <Button type="submit" size="sm" className="rounded-sm bg-[#002FA7] hover:bg-[#001F70] text-white" data-testid="search-btn">
              <Search className="w-4 h-4" />
            </Button>
          </form>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48 rounded-sm text-sm" data-testid="filter-status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map(s => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#002FA7] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-20 text-[#475569]">
              <p className="text-sm">No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8FAFC]">
                    <TableHead className="text-xs font-semibold text-[#475569]">Tracking ID</TableHead>
                    <TableHead className="text-xs font-semibold text-[#475569]">Student</TableHead>
                    <TableHead className="text-xs font-semibold text-[#475569]">College</TableHead>
                    <TableHead className="text-xs font-semibold text-[#475569]">Topic</TableHead>
                    <TableHead className="text-xs font-semibold text-[#475569]">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-[#475569]">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-[#475569]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app, i) => (
                    <TableRow key={i} className="hover:bg-[#F8FAFC]" data-testid={`app-row-${i}`}>
                      <TableCell className="text-xs font-mono font-bold text-[#002FA7]">{app.tracking_id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{app.student_name}</p>
                          <p className="text-xs text-[#475569]">{app.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-[#475569]">{app.college_name}</TableCell>
                      <TableCell className="text-xs text-[#0F172A] max-w-48 truncate">{app.topic_title}</TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-0.5 rounded-sm text-[10px] font-semibold ${STATUS_COLORS[app.status] || 'bg-gray-100 text-gray-700'}`}>
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-[#475569]">
                        {new Date(app.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => openUpdateDialog(app)} variant="ghost" size="sm" className="text-xs text-[#002FA7]" data-testid={`update-btn-${i}`}>
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Update Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-lg" data-testid="update-dialog">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
              Application Details
            </DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#475569]">Tracking ID</span>
                  <p className="font-mono font-bold text-[#002FA7]">{selectedApp.tracking_id}</p>
                </div>
                <div>
                  <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#475569]">Student</span>
                  <p className="font-medium text-[#0F172A]">{selectedApp.student_name}</p>
                </div>
                <div>
                  <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#475569]">Email</span>
                  <p className="text-[#0F172A]">{selectedApp.email}</p>
                </div>
                <div>
                  <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#475569]">Phone</span>
                  <p className="text-[#0F172A]">{selectedApp.phone}</p>
                </div>
                <div>
                  <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#475569]">College</span>
                  <p className="text-[#0F172A]">{selectedApp.college_name}</p>
                </div>
                <div>
                  <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#475569]">Course/Year</span>
                  <p className="text-[#0F172A]">{selectedApp.course_year}</p>
                </div>
              </div>
              <div>
                <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#475569]">Patent Topic</span>
                <p className="text-sm font-medium text-[#0F172A]">{selectedApp.topic_title}</p>
              </div>
              {selectedApp.abstract && (
                <div>
                  <span className="text-xs tracking-[0.15em] uppercase font-semibold text-[#475569]">Abstract</span>
                  <p className="text-sm text-[#0F172A] bg-[#F8FAFC] p-3 rounded-sm mt-1">{selectedApp.abstract}</p>
                </div>
              )}

              <div className="border-t border-[#E2E8F0] pt-4 space-y-3">
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Update Status</Label>
                  <Select value={updateStatus} onValueChange={setUpdateStatus}>
                    <SelectTrigger className="mt-1.5 rounded-sm" data-testid="update-status-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-[#0F172A]">Admin Notes</Label>
                  <Textarea
                    value={updateNotes}
                    onChange={e => setUpdateNotes(e.target.value)}
                    placeholder="Add notes for the student..."
                    rows={3}
                    className="mt-1.5 rounded-sm"
                    data-testid="update-notes-input"
                  />
                </div>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="w-full rounded-sm bg-[#002FA7] hover:bg-[#001F70] text-white"
                  data-testid="update-status-btn"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
