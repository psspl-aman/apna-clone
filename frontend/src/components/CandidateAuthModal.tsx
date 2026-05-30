import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser, registerUser, logout } from '../features/auth/authSlice';
import toast from 'react-hot-toast';

/* ── Schemas ── */
const loginSchema = yup.object({
  email: yup.string().email('Valid email required').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const registerSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Valid email required').required('Email is required'),
  phone: yup.string().matches(/^[6-9]\d{9}$/, 'Enter valid 10-digit phone').optional(),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

type Tab = 'login' | 'register';

interface Props {
  isOpen: boolean;
  defaultTab?: Tab;
  onClose: () => void;
}

const inputCls = (hasError?: boolean) =>
  `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
  }`;

export const CandidateAuthModal = ({ isOpen, defaultTab = 'login', onClose }: Props) => {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showRegPwd, setShowRegPwd] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.auth);

  // Sync tab if parent changes defaultTab
  useEffect(() => { setTab(defaultTab); }, [defaultTab, isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  /* ── Login form ── */
  const loginForm = useForm({ resolver: yupResolver(loginSchema) });
  const onLogin = async (data: any) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload as any;
      if (user?.role === 'employer') {
        dispatch(logout());
        toast.error('Please use Employer Login for employer accounts.');
        return;
      }
      toast.success('Welcome back! 👋');
      loginForm.reset();
      onClose();
    } else {
      toast.error(result.payload as string || 'Login failed');
    }
  };

  /* ── Register form ── */
  const regForm = useForm({ resolver: yupResolver(registerSchema) as any });
  const onRegister = async (data: any) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully! 🎉');
      regForm.reset();
      onClose();
    } else {
      toast.error(result.payload as string || 'Registration failed');
    }
  };

  if (!isOpen) return null;

  return (
    /* Overlay */
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Modal card */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-7">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {tab === 'login'
                ? 'Sign in to access your job applications and profile'
                : 'Join millions of candidates finding their dream job'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === t
                    ? 'bg-white text-[#1a7d4e] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'login' ? 'Login' : 'Register'}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  {...loginForm.register('email')}
                  placeholder="you@example.com"
                  className={inputCls(!!loginForm.formState.errors.email)}
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{String(loginForm.formState.errors.email.message)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPwd ? 'text' : 'password'}
                    {...loginForm.register('password')}
                    placeholder="Min 6 characters"
                    className={inputCls(!!loginForm.formState.errors.password) + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPwd(!showLoginPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showLoginPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{String(loginForm.formState.errors.password.message)}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-xl text-sm disabled:opacity-60 transition-opacity mt-1"
                style={{ backgroundColor: '#1a7d4e' }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-[#1a7d4e] font-semibold hover:underline"
                >
                  Register
                </button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <form onSubmit={regForm.handleSubmit(onRegister)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  {...regForm.register('fullName')}
                  placeholder="John Doe"
                  className={inputCls(!!regForm.formState.errors.fullName)}
                />
                {regForm.formState.errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{String(regForm.formState.errors.fullName.message)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address *</label>
                <input
                  type="email"
                  {...regForm.register('email')}
                  placeholder="you@example.com"
                  className={inputCls(!!regForm.formState.errors.email)}
                />
                {regForm.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{String(regForm.formState.errors.email.message)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="tel"
                  {...regForm.register('phone')}
                  placeholder="9876543210"
                  className={inputCls(!!regForm.formState.errors.phone)}
                />
                {regForm.formState.errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{String(regForm.formState.errors.phone.message)}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    type={showRegPwd ? 'text' : 'password'}
                    {...regForm.register('password')}
                    placeholder="Min 6 characters"
                    className={inputCls(!!regForm.formState.errors.password) + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPwd(!showRegPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showRegPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {regForm.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{String(regForm.formState.errors.password.message)}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-xl text-sm disabled:opacity-60 transition-opacity mt-1"
                style={{ backgroundColor: '#1a7d4e' }}
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-[#1a7d4e] font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
