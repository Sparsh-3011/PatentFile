import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileCheck, Send, Copy, CheckCircle } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const PATENT_TOPICS = [
  { id: 1, title: "AI-Based Real-Time Fraud Detection System for Digital Payments" },
  { id: 2, title: "Explainable AI Framework for Healthcare Diagnosis Systems" },
  { id: 3, title: "Deep Learning Model for Early Detection of Diseases from Medical Images" },
  { id: 4, title: "Predictive Analytics Model for Stock Market Trend Forecasting" },
  { id: 5, title: "AI-Powered Smart Traffic Management System Using Reinforcement Learning" },
  { id: 6, title: "Federated Learning System for Privacy-Preserving Data Sharing" },
  { id: 7, title: "Sentiment Analysis Model for Social Media Using NLP Techniques" },
  { id: 8, title: "AI-Based Cybersecurity Threat Detection and Prevention System" },
  { id: 9, title: "Edge AI Framework for Real-Time IoT Data Processing" },
  { id: 10, title: "Generative AI Model for Synthetic Data Generation in Healthcare" },
];

export default function ApplyPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    student_name: '',
    email: '',
    phone: '',
    college_name: '',
    course_year: '',
    topic_id: topicId ? parseInt(topicId) : '',
    abstract: ''
  });

  useEffect(() => {
    if (topicId) setForm(f => ({ ...f, topic_id: parseInt(topicId) }));
  }, [topicId]);

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_name || !form.email || !form.phone || !form.college_name || !form.course_year || !form.topic_id) {
      toast.error('Please fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/applications`, {
        ...form,
        topic_id: parseInt(form.topic_id)
      });
      setSubmitted(data);
      toast.success('Application submitted successfully!');
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTrackingId = () => {
    navigator.clipboard.writeText(submitted.tracking_id);
    setCopied(true);
    toast.success('Tracking ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6" data-testid="apply-success">
        <div className="max-w-lg w-full bg-white border border-[#E2E8F0] rounded-sm p-12 text-center">
          <div className="w-16 h-16 bg-[#059669]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#059669]" />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A] mb-2" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Application Submitted!</h1>
          <p className="text-[#475569] mb-8">Your patent application has been received. Save your tracking ID to check status.</p>
          
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-sm p-6 mb-8">
            <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#475569] block mb-2">Your Tracking ID</span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-black text-[#002FA7] font-mono" data-testid="tracking-id-display">{submitted.tracking_id}</span>
              <button onClick={copyTrackingId} className="p-2 hover:bg-[#E2E8F0] rounded-sm transition-colors" data-testid="copy-tracking-id">
                {copied ? <CheckCircle className="w-5 h-5 text-[#059669]" /> : <Copy className="w-5 h-5 text-[#475569]" />}
              </button>
            </div>
          </div>

          <div className="text-left text-sm space-y-2 mb-8">
            <p><span className="font-semibold text-[#0F172A]">Name:</span> <span className="text-[#475569]">{submitted.student_name}</span></p>
            <p><span className="font-semibold text-[#0F172A]">Topic:</span> <span className="text-[#475569]">{submitted.topic_title}</span></p>
            <p><span className="font-semibold text-[#0F172A]">Status:</span> <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-[#002FA7]/10 text-[#002FA7]">{submitted.status}</span></p>
          </div>

          <div className="flex gap-3">
            <Link to="/track" className="flex-1" data-testid="go-to-track">
              <Button variant="outline" className="w-full rounded-sm border-[#002FA7] text-[#002FA7]">Track Application</Button>
            </Link>
            <Link to="/" className="flex-1" data-testid="go-home">
              <Button className="w-full rounded-sm bg-[#002FA7] hover:bg-[#001F70] text-white">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]" data-testid="apply-page">
      {/* Header */}
      <nav className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-testid="apply-nav-logo">
            <div className="w-9 h-9 bg-[#002FA7] rounded-sm flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-[#0F172A]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>PatentFile</span>
          </Link>
          <Link to="/" data-testid="apply-back-home">
            <Button variant="ghost" className="text-sm text-[#475569]">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-10">
          <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#002FA7]">Patent Application</span>
          <h1 className="text-4xl sm:text-5xl tracking-tight font-black text-[#0F172A] mt-3" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            Apply for Design Patent
          </h1>
          <p className="text-base text-[#475569] mt-3">Fill in your details and select a topic. Our team will reach out to guide you through the process.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#E2E8F0] rounded-sm p-8 space-y-6" data-testid="application-form">
          {/* Student Details */}
          <div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Student Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="student_name" className="text-sm font-medium text-[#0F172A]">Full Name *</Label>
                <Input
                  id="student_name"
                  value={form.student_name}
                  onChange={e => handleChange('student_name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1.5 rounded-sm focus:ring-2 focus:ring-[#002FA7]"
                  data-testid="input-student-name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-[#0F172A]">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="mt-1.5 rounded-sm focus:ring-2 focus:ring-[#002FA7]"
                  data-testid="input-email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-[#0F172A]">Phone Number *</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="+91 XXXXXXXXXX"
                  className="mt-1.5 rounded-sm focus:ring-2 focus:ring-[#002FA7]"
                  data-testid="input-phone"
                  required
                />
              </div>
              <div>
                <Label htmlFor="college_name" className="text-sm font-medium text-[#0F172A]">College / University *</Label>
                <Input
                  id="college_name"
                  value={form.college_name}
                  onChange={e => handleChange('college_name', e.target.value)}
                  placeholder="Enter your college name"
                  className="mt-1.5 rounded-sm focus:ring-2 focus:ring-[#002FA7]"
                  data-testid="input-college"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="course_year" className="text-sm font-medium text-[#0F172A]">Course & Year *</Label>
                <Input
                  id="course_year"
                  value={form.course_year}
                  onChange={e => handleChange('course_year', e.target.value)}
                  placeholder="e.g., B.Tech CSE - 3rd Year"
                  className="mt-1.5 rounded-sm focus:ring-2 focus:ring-[#002FA7]"
                  data-testid="input-course-year"
                  required
                />
              </div>
            </div>
          </div>

          {/* Topic Selection */}
          <div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Patent Topic</h3>
            <div>
              <Label className="text-sm font-medium text-[#0F172A]">Select Topic *</Label>
              <Select value={form.topic_id ? String(form.topic_id) : ''} onValueChange={v => handleChange('topic_id', parseInt(v))}>
                <SelectTrigger className="mt-1.5 rounded-sm" data-testid="select-topic">
                  <SelectValue placeholder="Choose a patent topic" />
                </SelectTrigger>
                <SelectContent>
                  {PATENT_TOPICS.map(t => (
                    <SelectItem key={t.id} value={String(t.id)} data-testid={`topic-option-${t.id}`}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Abstract */}
          <div>
            <h3 className="text-lg font-semibold text-[#0F172A] mb-4" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Patent Abstract</h3>
            <div>
              <Label htmlFor="abstract" className="text-sm font-medium text-[#0F172A]">Abstract (Optional - can be written later)</Label>
              <Textarea
                id="abstract"
                value={form.abstract}
                onChange={e => handleChange('abstract', e.target.value)}
                placeholder="Write a brief abstract for your design patent. You can also write this later with expert guidance..."
                rows={5}
                className="mt-1.5 rounded-sm focus:ring-2 focus:ring-[#002FA7]"
                data-testid="input-abstract"
              />
              <p className="text-xs text-[#475569] mt-2">You will receive guidance on writing the abstract after submission.</p>
            </div>
          </div>

          {/* Fee Info */}
          <div className="bg-[#002FA7]/5 border border-[#002FA7]/10 rounded-sm p-6">
            <h4 className="text-sm font-semibold text-[#002FA7]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Filing Fee Information</h4>
            <p className="text-sm text-[#475569] mt-2">
              A minimum filing fee is required to initiate the patent filing process. Fee details will be communicated to you after your application is reviewed. Our team will reach out to you with complete payment information.
            </p>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-sm h-12 bg-[#002FA7] hover:bg-[#001F70] text-white font-semibold text-base"
            data-testid="submit-application-btn"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" /> Submit Application
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
