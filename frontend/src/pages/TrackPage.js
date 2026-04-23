import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileCheck, ArrowLeft, Search, Clock, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const STATUS_CONFIG = {
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Clock, step: 1 },
  under_review: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock, step: 2 },
  in_progress: { label: 'In Progress', color: 'bg-orange-100 text-orange-700', icon: Loader2, step: 2 },
  abstract_needed: { label: 'Abstract Needed', color: 'bg-purple-100 text-purple-700', icon: AlertCircle, step: 2 },
  filing: { label: 'Filing in Progress', color: 'bg-indigo-100 text-indigo-700', icon: Loader2, step: 3 },
  filed: { label: 'Patent Filed', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, step: 4 },
  acknowledged: { label: 'Acknowledged', color: 'bg-green-100 text-green-700', icon: CheckCircle, step: 5 },
  granted: { label: 'Patent Granted', color: 'bg-green-200 text-green-800', icon: CheckCircle, step: 6 },
};

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast.error('Please enter your tracking ID');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await axios.get(`${API}/applications/track/${trackingId.trim()}`);
      setResult(data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Application not found. Please check your tracking ID.');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = result ? STATUS_CONFIG[result.status] || STATUS_CONFIG.submitted : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="track-page">
      <nav className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-testid="track-nav-logo">
            <div className="w-9 h-9 bg-[#002FA7] rounded-sm flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-[#0F172A]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>PatentFile</span>
          </Link>
          <Link to="/" data-testid="track-back-home">
            <Button variant="ghost" className="text-sm text-[#475569]">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-10">
          <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#002FA7]">Application Tracking</span>
          <h1 className="text-4xl sm:text-5xl tracking-tight font-black text-[#0F172A] mt-3" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            Track Your Application
          </h1>
          <p className="text-base text-[#475569] mt-3">Enter your tracking ID to check the current status of your patent application.</p>
          <a
            href="https://search.ipindia.gov.in/DesignApplicationStatus/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[#002FA7] hover:underline"
            data-testid="ipindia-track-link"
          >
            <ExternalLink className="w-4 h-4" /> Track on IP India Official Portal
          </a>
        </div>

        <form onSubmit={handleTrack} className="flex gap-3 mb-8" data-testid="track-form">
          <div className="flex-1">
            <Label htmlFor="tracking_id" className="sr-only">Tracking ID</Label>
            <Input
              id="tracking_id"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              placeholder="Enter your tracking ID (e.g., PAT-XXXXXXXX)"
              className="h-12 rounded-sm text-base font-mono focus:ring-2 focus:ring-[#002FA7]"
              data-testid="input-tracking-id"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 px-6 rounded-sm bg-[#002FA7] hover:bg-[#001F70] text-white"
            data-testid="track-submit-btn"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm p-6 text-center" data-testid="track-error">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white border border-[#E2E8F0] rounded-sm overflow-hidden" data-testid="track-result">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#475569]">Tracking ID</span>
                  <p className="text-xl font-black font-mono text-[#002FA7]" data-testid="result-tracking-id">{result.tracking_id}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold ${statusConfig.color}`} data-testid="result-status">
                  <statusConfig.icon className="w-3.5 h-3.5" />
                  {statusConfig.label}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#475569]">Applicant</span>
                  <p className="text-base font-medium text-[#0F172A]">{result.student_name}</p>
                </div>
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#475569]">Patent Topic</span>
                  <p className="text-base font-medium text-[#0F172A]">{result.topic_title}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#475569]">Applied On</span>
                    <p className="text-sm text-[#0F172A]">{new Date(result.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#475569]">Last Updated</span>
                    <p className="text-sm text-[#0F172A]">{new Date(result.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                {result.admin_notes && (
                  <div>
                    <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#475569]">Notes</span>
                    <p className="text-sm text-[#0F172A] bg-[#F8FAFC] p-3 rounded-sm mt-1">{result.admin_notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="border-t border-[#E2E8F0] p-6 bg-[#F8FAFC]">
              <div className="flex items-center gap-1">
                {['Submitted', 'Review', 'Filing', 'Filed', 'Acknowledged', 'Granted'].map((step, i) => (
                  <React.Fragment key={i}>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < statusConfig.step ? 'bg-[#002FA7] text-white' : 'bg-[#E2E8F0] text-[#475569]'
                    }`}>
                      {i < statusConfig.step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                    </div>
                    {i < 5 && <div className={`flex-1 h-1 rounded-full ${i < statusConfig.step - 1 ? 'bg-[#002FA7]' : 'bg-[#E2E8F0]'}`} />}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['Submitted', 'Review', 'Filing', 'Filed', 'Ack.', 'Granted'].map((step, i) => (
                  <span key={i} className={`text-[10px] font-medium ${i < statusConfig.step ? 'text-[#002FA7]' : 'text-[#475569]'}`}>{step}</span>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <a
                  href="https://search.ipindia.gov.in/DesignApplicationStatus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#002FA7] hover:underline"
                  data-testid="result-ipindia-link"
                >
                  <ExternalLink className="w-4 h-4" /> Verify on IP India Official Portal
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
