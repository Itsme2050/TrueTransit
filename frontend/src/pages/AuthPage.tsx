import React, { useState } from 'react';
import { Shield, Lock, Mail, User, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ApiClient } from '../services/apiClient';

interface AuthPageProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onClose, onSuccess }) => {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { email, password, fullName } : { email, password };
      const res = await ApiClient.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.token && res.user) {
        login(res.token, res.user);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'TRAVELER' | 'ADMIN') => {
    setLoading(true);
    setError(null);
    try {
      const demoEmail = role === 'ADMIN' ? 'admin@truetransit.com' : 'traveler@truetransit.com';
      const demoPass = role === 'ADMIN' ? 'admin123' : 'traveler123';
      const res = await ApiClient.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });

      if (res.token && res.user) {
        login(res.token, res.user);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl max-w-md mx-auto space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-slate-900 text-teal-400 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {isRegister ? 'Create TrueTransit Account' : 'Sign In to TrueTransit'}
            </h2>
            <p className="text-xs text-slate-500">Access verified reporting and saved safe trips</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold">
          {error}
        </div>
      )}

      {/* Quick Demo Switchers */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
        <div className="text-[10px] uppercase font-bold text-slate-400">Instant Demo Evaluation Access:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('TRAVELER')}
            disabled={loading}
            className="py-1.5 px-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-bold hover:bg-teal-100 transition-colors text-center"
          >
            Demo Traveler
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('ADMIN')}
            disabled={loading}
            className="py-1.5 px-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold hover:bg-amber-100 transition-colors text-center"
          >
            Demo Admin/Mod
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        {isRegister && (
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>
        )}

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-md active:scale-98"
        >
          {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-teal-700 font-bold hover:underline"
          >
            {isRegister ? 'Already have an account? Sign in here' : "Don't have an account? Create one"}
          </button>
        </div>
      </form>
    </div>
  );
};
