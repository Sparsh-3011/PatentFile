import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, ScanLine, TrendingUp, TrafficCone, Lock, MessageCircle, Bug, Cpu, Database, ArrowRight, GraduationCap, Award, FileCheck, Briefcase, ChevronRight, Users, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ICON_MAP = {
  shield: Shield,
  heart: Heart,
  scan: ScanLine,
  "trending-up": TrendingUp,
  "traffic-cone": TrafficCone,
  lock: Lock,
  "message-circle": MessageCircle,
  bug: Bug,
  cpu: Cpu,
  database: Database,
};

const PATENT_TOPICS = [
  { id: 1, title: "AI-Based Real-Time Fraud Detection System for Digital Payments", category: "FinTech / AI", icon: "shield" },
  { id: 2, title: "Explainable AI Framework for Healthcare Diagnosis Systems", category: "Healthcare / AI", icon: "heart" },
  { id: 3, title: "Deep Learning Model for Early Detection of Diseases from Medical Images", category: "Healthcare / Deep Learning", icon: "scan" },
  { id: 4, title: "Predictive Analytics Model for Stock Market Trend Forecasting", category: "Finance / Analytics", icon: "trending-up" },
  { id: 5, title: "AI-Powered Smart Traffic Management System Using Reinforcement Learning", category: "Smart City / AI", icon: "traffic-cone" },
  { id: 6, title: "Federated Learning System for Privacy-Preserving Data Sharing", category: "Privacy / ML", icon: "lock" },
  { id: 7, title: "Sentiment Analysis Model for Social Media Using NLP Techniques", category: "NLP / Social Media", icon: "message-circle" },
  { id: 8, title: "AI-Based Cybersecurity Threat Detection and Prevention System", category: "Cybersecurity / AI", icon: "bug" },
  { id: 9, title: "Edge AI Framework for Real-Time IoT Data Processing", category: "IoT / Edge Computing", icon: "cpu" },
  { id: 10, title: "Generative AI Model for Synthetic Data Generation in Healthcare", category: "Healthcare / GenAI", icon: "database" },
];

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/40 shadow-sm" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3" data-testid="nav-logo">
            <div className="w-9 h-9 bg-[#002FA7] rounded-sm flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-[#0F172A] text-lg tracking-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>PatentFile</span>
              <span className="block text-[10px] tracking-[0.2em] uppercase text-[#475569] font-semibold">KIITPD2S Society</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#topics" className="text-sm font-medium text-[#475569] hover:text-[#002FA7] transition-colors" data-testid="nav-topics">Topics</a>
            <a href="#benefits" className="text-sm font-medium text-[#475569] hover:text-[#002FA7] transition-colors" data-testid="nav-benefits">Benefits</a>
            <a href="#collaborators" className="text-sm font-medium text-[#475569] hover:text-[#002FA7] transition-colors" data-testid="nav-collaborators">Collaborators</a>
            <Link to="/track" data-testid="nav-track">
              <Button variant="outline" className="rounded-sm text-sm border-[#002FA7] text-[#002FA7] hover:bg-[#002FA7] hover:text-white">
                Track Application
              </Button>
            </Link>
            <Link to="/apply" data-testid="nav-apply">
              <Button className="rounded-sm text-sm bg-[#002FA7] hover:bg-[#001F70] text-white">
                Apply Now <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <Link to="/track" data-testid="nav-track-mobile">
              <Button variant="outline" size="sm" className="rounded-sm text-xs border-[#002FA7] text-[#002FA7]">Track</Button>
            </Link>
            <Link to="/apply" data-testid="nav-apply-mobile">
              <Button size="sm" className="rounded-sm text-xs bg-[#002FA7] text-white">Apply</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden noise-overlay" data-testid="hero-section">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAFC] via-white to-[#EEF2FF]" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-[#002FA7]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#002FA7]/3 blur-3xl" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="opacity-0 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-semibold text-[#002FA7] bg-[#002FA7]/8 px-4 py-2 rounded-sm">
                <Sparkles className="w-3.5 h-3.5" /> 100% Patent Grant Guarantee
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl tracking-tight font-black text-[#0F172A] leading-none opacity-0 animate-fade-in-up stagger-1" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
              File Your <span className="text-[#002FA7]">Indian Patent</span> in Just 1 Week
            </h1>
            <p className="text-base leading-relaxed text-[#475569] max-w-lg opacity-0 animate-fade-in-up stagger-2">
              Get your Indian Design Patent filed instantly with expert guidance. Boost your academic profile for higher studies, research internships, and a competitive edge in your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up stagger-3">
              <Link to="/apply" data-testid="hero-apply-btn">
                <Button className="rounded-sm h-12 px-8 text-base bg-[#002FA7] hover:bg-[#001F70] text-white font-semibold shadow-lg shadow-[#002FA7]/20">
                  Start Your Application <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#topics" data-testid="hero-explore-btn">
                <Button variant="outline" className="rounded-sm h-12 px-8 text-base border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] font-medium">
                  Explore Topics <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-8 pt-4 opacity-0 animate-fade-in-up stagger-4">
              <div className="text-center">
                <div className="text-3xl font-black text-[#002FA7]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>50+</div>
                <div className="text-xs tracking-[0.2em] uppercase text-[#475569] font-semibold mt-1">Patents Granted</div>
              </div>
              <div className="w-px h-12 bg-[#E2E8F0]" />
              <div className="text-center">
                <div className="text-3xl font-black text-[#002FA7]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>1 Week</div>
                <div className="text-xs tracking-[0.2em] uppercase text-[#475569] font-semibold mt-1">Filing Time</div>
              </div>
              <div className="w-px h-12 bg-[#E2E8F0]" />
              <div className="text-center">
                <div className="text-3xl font-black text-[#002FA7]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>100%</div>
                <div className="text-xs tracking-[0.2em] uppercase text-[#475569] font-semibold mt-1">Grant Rate</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block opacity-0 animate-fade-in stagger-3">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#002FA7]/5 rounded-sm blur-2xl" />
              <img
                src="https://static.prod-images.emergentagent.com/jobs/77b2c1ef-28c5-4b25-83bc-0cfd40155c33/images/2e7fede79566b0e13d119500124540b731dd95cddc79b8aaca8459bc552fc494.png"
                alt="Patent Filing"
                className="relative w-full rounded-sm shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const benefits = [
    { icon: GraduationCap, title: "Boost Higher Studies Applications", desc: "Patents on your CV make you stand out for MS/PhD admissions at top universities worldwide." },
    { icon: Briefcase, title: "Land Research Internships", desc: "Published patents demonstrate research capability, making you a top candidate for research positions." },
    { icon: Award, title: "Recognized Filing Certificate", desc: "Receive an official certificate of patent filing upon completion that validates your innovation." },
    { icon: Users, title: "Expert Guidance Throughout", desc: "Work under the guidance of Dr. Anish Pandey with support from KIITPD2S Society." },
    { icon: FileCheck, title: "100% Patent Grant Guarantee", desc: "Our society has a proven track record with 50+ patents granted. Your patent filing is in safe hands." },
    { icon: BookOpen, title: "Strengthen Your Research Profile", desc: "Add a published patent to your portfolio, establishing credibility in your chosen domain." },
  ];

  return (
    <section id="benefits" className="py-24 lg:py-32 bg-[#F8FAFC] relative" data-testid="benefits-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#002FA7]">Why File a Patent?</span>
          <h2 className="text-4xl sm:text-5xl tracking-tight font-bold text-[#0F172A] mt-4 leading-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            Patents That Open Doors to Your Future
          </h2>
          <p className="text-base leading-relaxed text-[#475569] mt-4">
            Filing a patent is more than protecting an idea. It's a career accelerator that signals innovation and research depth to universities and employers.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="group p-8 bg-white border border-[#E2E8F0] rounded-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              data-testid={`benefit-card-${i}`}
            >
              <div className="w-12 h-12 bg-[#002FA7]/8 rounded-sm flex items-center justify-center mb-6 group-hover:bg-[#002FA7] transition-colors">
                <b.icon className="w-6 h-6 text-[#002FA7] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#0F172A] mb-3" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>{b.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 rounded-sm overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1758270705518-b61b40527e76?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHw0fHxjb2xsZWdlJTIwc3R1ZGVudHMlMjByZXNlYXJjaCUyMGxhcHRvcHxlbnwwfHx8fDE3NzY5NDMwOTN8MA&ixlib=rb-4.1.0&q=85"
            alt="Students collaborating on research"
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function TopicsSection() {
  return (
    <section id="topics" className="py-24 lg:py-32 bg-white" data-testid="topics-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#002FA7]">Design Patent Topics</span>
          <h2 className="text-4xl sm:text-5xl tracking-tight font-bold text-[#0F172A] mt-4 leading-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            Choose Your Patent Topic
          </h2>
          <p className="text-base leading-relaxed text-[#475569] mt-4">
            Select from our curated list of AI and technology design patent topics. Each topic comes with expert guidance for abstract writing and filing.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {PATENT_TOPICS.map((topic, i) => {
            const Icon = ICON_MAP[topic.icon] || FileCheck;
            return (
              <div
                key={topic.id}
                className="group flex items-start gap-5 p-6 border border-[#E2E8F0] rounded-sm hover:border-[#002FA7]/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 bg-white"
                data-testid={`topic-card-${topic.id}`}
              >
                <div className="flex-shrink-0 w-11 h-11 bg-[#002FA7]/8 rounded-sm flex items-center justify-center group-hover:bg-[#002FA7] transition-colors">
                  <Icon className="w-5 h-5 text-[#002FA7] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#002FA7]">{topic.category}</span>
                  <h3 className="text-base font-semibold text-[#0F172A] mt-1 leading-snug" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
                    {topic.title}
                  </h3>
                  <Link
                    to={`/apply/${topic.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#002FA7] mt-3 hover:gap-2 transition-all"
                    data-testid={`topic-apply-${topic.id}`}
                  >
                    Apply for this topic <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { num: "01", title: "Choose a Topic", desc: "Select from our curated design patent topics in AI and technology." },
    { num: "02", title: "Fill the Application", desc: "Provide your details and write an abstract for your chosen patent topic." },
    { num: "03", title: "Pay Filing Fee", desc: "A minimum filing fee is required to initiate the patent filing process." },
    { num: "04", title: "Patent Filed in 1 Week", desc: "Our team files your patent and you receive acknowledgement with tracking." },
  ];

  return (
    <section className="py-24 lg:py-32 bg-[#0F172A] text-white relative overflow-hidden" data-testid="process-section">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#002FA7]/10 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#002FA7]">How It Works</span>
          <h2 className="text-4xl sm:text-5xl tracking-tight font-bold mt-4 leading-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            Simple 4-Step Process
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="p-8 border border-white/10 rounded-sm hover:border-[#002FA7]/50 transition-colors" data-testid={`step-${i}`}>
              <span className="text-5xl font-black text-[#002FA7]/40" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>{s.num}</span>
              <h3 className="text-xl font-bold mt-4 mb-3" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>{s.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificateSection() {
  return (
    <section className="py-24 lg:py-32 bg-white" data-testid="certificate-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#002FA7]">Upon Completion</span>
            <h2 className="text-4xl sm:text-5xl tracking-tight font-bold text-[#0F172A] mt-4 leading-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
              Get Your Recognized Certificate of Filing
            </h2>
            <p className="text-base leading-relaxed text-[#475569] mt-6 max-w-lg">
              Upon successful filing, you will receive a recognized certificate that validates your patent filing. This certificate can be used for:
            </p>
            <ul className="mt-6 space-y-3">
              {["University admissions and scholarship applications", "Research internship applications", "Resume and professional portfolio", "Academic publications and presentations"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[#0F172A]">
                  <div className="w-5 h-5 rounded-full bg-[#059669]/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <Link to="/apply" className="mt-8 inline-block" data-testid="certificate-apply-btn">
              <Button className="rounded-sm h-12 px-8 bg-[#002FA7] hover:bg-[#001F70] text-white font-semibold">
                File Your Patent Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[#002FA7]/5 rounded-sm blur-2xl" />
            <img
              src="https://static.prod-images.emergentagent.com/jobs/77b2c1ef-28c5-4b25-83bc-0cfd40155c33/images/e0d20e027ef480507bc3c15f3aba92af1031dbd3c81b7431c2ee6bebeb048bdd.png"
              alt="Certificate of Filing"
              className="relative w-full rounded-sm shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CollaboratorsSection() {
  return (
    <section id="collaborators" className="py-24 lg:py-32 bg-[#F8FAFC]" data-testid="collaborators-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#002FA7]">In Collaboration With</span>
          <h2 className="text-4xl sm:text-5xl tracking-tight font-bold text-[#0F172A] mt-4 leading-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
            Trusted Partners & Guidance
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "KIITPD2S Society", role: "KIIT University", desc: "50+ patents granted. Leading intellectual property development society." },
            { name: "H & P Products", role: "Industry Partner", desc: "Supporting innovation and commercialization of student patents." },
            { name: "NextCare Foundation", role: "Foundation Partner", desc: "Fostering innovation and technology development in education." },
            { name: "Dr. Anish Pandey", role: "Mentor & Guide", desc: "Expert guidance for patent filing and intellectual property strategy." },
          ].map((c, i) => (
            <div key={i} className="p-8 bg-white border border-[#E2E8F0] rounded-sm" data-testid={`collaborator-${i}`}>
              <div className="w-12 h-12 bg-[#002FA7] rounded-sm flex items-center justify-center mb-6">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>{c.name[0]}</span>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>{c.name}</h3>
              <span className="text-xs tracking-[0.2em] uppercase font-semibold text-[#002FA7] mt-1 block">{c.role}</span>
              <p className="text-sm text-[#475569] mt-3 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-sm overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1775503059048-214026cce5cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTN8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1bml2ZXJzaXR5JTIwY2FtcHVzfGVufDB8fHx8MTc3Njk0MzA5M3ww&ixlib=rb-4.1.0&q=85"
            alt="KIIT University Campus"
            className="w-full h-64 object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-[#002FA7] text-white relative overflow-hidden" data-testid="cta-section">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl tracking-tight font-bold leading-tight" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>
          Ready to Secure Your Patent?
        </h2>
        <p className="text-base text-white/70 mt-6 max-w-2xl mx-auto leading-relaxed">
          Join hundreds of students who have already filed their patents. Take the first step towards building your intellectual property portfolio today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link to="/apply" data-testid="cta-apply-btn">
            <Button className="rounded-sm h-12 px-8 text-base bg-white text-[#002FA7] hover:bg-white/90 font-semibold">
              Start Application <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/track" data-testid="cta-track-btn">
            <Button variant="outline" className="rounded-sm h-12 px-8 text-base border-white/30 text-white hover:bg-white/10 font-medium">
              Track Existing Application
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 bg-[#0F172A] text-white" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#002FA7] rounded-sm flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>PatentFile</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              A collaboration between KIITPD2S Society, H & P Products, and NextCare Foundation under the guidance of Dr. Anish Pandey.
            </p>
          </div>
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/apply" className="block text-sm text-white/50 hover:text-white transition-colors">Apply for Patent</Link>
              <Link to="/track" className="block text-sm text-white/50 hover:text-white transition-colors">Track Application</Link>
              <a href="#topics" className="block text-sm text-white/50 hover:text-white transition-colors">Patent Topics</a>
              <a href="#benefits" className="block text-sm text-white/50 hover:text-white transition-colors">Benefits</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm tracking-[0.2em] uppercase font-semibold mb-4">Contact</h4>
            <p className="text-sm text-white/50 leading-relaxed">
              KIITPD2S Society<br />
              KIIT University<br />
              Bhubaneswar, Odisha, India
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} PatentFile. All rights reserved. Powered by KIITPD2S Society.</p>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen" data-testid="landing-page">
      <Navbar />
      <HeroSection />
      <BenefitsSection />
      <TopicsSection />
      <ProcessSection />
      <CertificateSection />
      <CollaboratorsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
