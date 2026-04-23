import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileCheck, LogIn } from 'lucide-react';

export default function AdminLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      toast.success('Logged in successfully');
      navigate('/admin');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6" data-testid="admin-login-logo">
            <div className="w-10 h-10 bg-[#002FA7] rounded-sm flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>PatentFile</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4" style={{ fontFamily: 'Cabinet Grotesk, sans-serif' }}>Admin Portal</h1>
          <p className="text-sm text-white/50 mt-2">Sign in to manage patent applications</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 space-y-5" data-testid="admin-login-form">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-sm p-3 text-sm text-red-400" data-testid="login-error">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-white/70">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@patentfiling.com"
              className="mt-1.5 rounded-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#002FA7]"
              data-testid="admin-email-input"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-white/70">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="mt-1.5 rounded-sm bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-2 focus:ring-[#002FA7]"
              data-testid="admin-password-input"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-sm bg-[#002FA7] hover:bg-[#001F70] text-white font-semibold"
            data-testid="admin-login-btn"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-4 h-4" /> Sign In
              </span>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-white/30 mt-8">
          &copy; {new Date().getFullYear()} PatentFile Admin Portal
        </p>
      </div>
    </div>
  );
}
