import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { loginUser, registerEmployer } from '../features/auth/authSlice';
import toast from 'react-hot-toast';
import { Play, ChevronDown, ExternalLink } from 'lucide-react';

const loginSchema = yup.object({
  email: yup.string().email('Valid email required').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const signupSchema = yup.object({
  companyName: yup.string().required('Company name is required'),
  email: yup.string().email('Valid email required').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  city: yup.string().optional(),
});

type LoginForm = yup.InferType<typeof loginSchema>;
type SignupForm = {
  companyName: string;
  email: string;
  password: string;
  city?: string;
};

export const EmployerLoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, isAuthenticated, user } = useAppSelector((s) => s.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const from = (location.state as any)?.from?.pathname || '/employer/dashboard';

  // If already logged in, redirect to correct dashboard
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      if (user.role === 'employer') {
        navigate('/employer/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true }); // candidate shouldn't be on employer login
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: yupResolver(loginSchema) });

  const {
    register: registerField,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<SignupForm>({ resolver: yupResolver(signupSchema) as any });

  // Still re-hydrating auth state — show spinner instead of login form
  if (isAuthenticated && !user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a0630' }}>
        <div className="h-10 w-10 border-4 border-[#1a7d4e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload as any;
      if (user?.role !== 'employer') {
        toast.error('This portal is for employers only. Please use the candidate login.');
        return;
      }
      toast.success('Login successful!');
      navigate('/employer/dashboard', { replace: true });
    } else {
      toast.error(result.payload as string);
    }
  };

  const onSignupSubmit = async (data: SignupForm) => {
    const result = await dispatch(registerEmployer(data));
    if (registerEmployer.fulfilled.match(result)) {
      toast.success('Account created successfully! Welcome to apna.');
      navigate('/employer/dashboard', { replace: true });
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1a0630' }}>

      {/* ── Announcement Banner ── */}
      <div className="bg-[#c8922a] text-black text-sm py-2 px-4 text-center font-medium">
        <span className="font-bold">apna</span>
        <span className="font-light italic"> Turns </span>
        <span className="font-extrabold text-lg leading-none">7</span>
        <span className="ml-2">Seven years of trust. Millions of opportunities created,</span>
        <span className="font-bold ml-1">together.</span>
      </div>

      {/* ── Navbar ── */}
      <nav className="px-6 md:px-12 py-4 flex items-center justify-between" style={{ backgroundColor: '#1a0630' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xs font-extrabold" style={{ color: '#1a7d4e' }}>apna</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-200">
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            Product <ChevronDown className="h-4 w-4" />
          </button>
          <Link to="#" className="hover:text-white transition-colors">Enterprise</Link>
          <Link to="#" className="hover:text-white transition-colors">Blogs</Link>
          <Link to="#" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/jobs" className="flex items-center gap-1 hover:text-white transition-colors">
            Looking for a job <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-medium text-white border border-white rounded-lg hover:bg-white/10 transition-colors"
          >
            Contact us
          </Link>
          <Link
            to="/employer/login"
            className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{ backgroundColor: '#1a7d4e' }}
          >
            Login/Sign up
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <main className="flex-1 px-6 md:px-12 lg:px-20 py-12 md:py-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left: Hero Copy */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Hire top talent in<br />48 hours with apna.
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Streamline your recruitment with AI-driven precision. Single solution from
              fresher to experienced hiring.
            </p>

            <button className="flex items-center gap-2 text-white text-sm font-medium mb-12 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-full border-2 border-white flex items-center justify-center">
                <Play className="h-3.5 w-3.5 fill-white" />
              </div>
              Watch video
            </button>

            {/* Stats */}
            <div className="flex gap-10 md:gap-14">
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-white">6 Crore +</p>
                <p className="text-gray-400 text-sm mt-1">Qualified candidates</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-white">7 Lakh +</p>
                <p className="text-gray-400 text-sm mt-1">Employers use apna</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-white">900 +</p>
                <p className="text-gray-400 text-sm mt-1">Available cities</p>
              </div>
            </div>
          </div>

          {/* Right: Login / Signup Card */}
          <div className="w-full lg:w-[420px] flex-shrink-0">
            <div
              className="rounded-2xl p-8 shadow-2xl"
              style={{ backgroundColor: '#2d1245' }}
            >
              <h2 className="text-2xl font-bold text-white mb-1">Let's get started</h2>
              <p className="text-gray-400 text-sm mb-5">Hire top talent faster with apna</p>

              {/* Tab Toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gray-600 mb-6">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                    mode === 'login'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  style={mode === 'login' ? { backgroundColor: '#1a7d4e' } : {}}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                    mode === 'signup'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  style={mode === 'signup' ? { backgroundColor: '#1a7d4e' } : {}}
                >
                  Sign Up
                </button>
              </div>

              {/* ── Login Form ── */}
              {mode === 'login' && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="Enter your email address"
                      className={`w-full px-4 py-3.5 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] border-0 ${
                        errors.email ? 'ring-2 ring-red-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{String(errors.email.message)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      {...register('password')}
                      placeholder="Enter your password"
                      className={`w-full px-4 py-3.5 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] border-0 ${
                        errors.password ? 'ring-2 ring-red-500' : ''
                      }`}
                    />
                    {errors.password && (
                      <p className="text-red-400 text-xs mt-1">{String(errors.password.message)}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 text-white font-semibold rounded-lg transition-opacity disabled:opacity-60 text-sm mt-2"
                    style={{ backgroundColor: '#1a7d4e' }}
                  >
                    {loading ? 'Signing in...' : 'Continue'}
                  </button>
                </form>
              )}

              {/* ── Signup Form ── */}
              {mode === 'signup' && (
                <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Company name
                    </label>
                    <input
                      type="text"
                      {...registerField('companyName')}
                      placeholder="Enter your company name"
                      className={`w-full px-4 py-3.5 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] border-0 ${
                        signupErrors.companyName ? 'ring-2 ring-red-500' : ''
                      }`}
                    />
                    {signupErrors.companyName && (
                      <p className="text-red-400 text-xs mt-1">{String(signupErrors.companyName.message)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Work email address
                    </label>
                    <input
                      type="email"
                      {...registerField('email')}
                      placeholder="Enter your work email"
                      className={`w-full px-4 py-3.5 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] border-0 ${
                        signupErrors.email ? 'ring-2 ring-red-500' : ''
                      }`}
                    />
                    {signupErrors.email && (
                      <p className="text-red-400 text-xs mt-1">{String(signupErrors.email.message)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      {...registerField('password')}
                      placeholder="Create a password (min 6 characters)"
                      className={`w-full px-4 py-3.5 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] border-0 ${
                        signupErrors.password ? 'ring-2 ring-red-500' : ''
                      }`}
                    />
                    {signupErrors.password && (
                      <p className="text-red-400 text-xs mt-1">{String(signupErrors.password.message)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">
                      City <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      {...registerField('city')}
                      placeholder="e.g. Mumbai, Delhi, Bangalore"
                      className="w-full px-4 py-3.5 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7d4e] border-0"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 text-white font-semibold rounded-lg transition-opacity disabled:opacity-60 text-sm mt-2"
                    style={{ backgroundColor: '#1a7d4e' }}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gray-600" />
                <span className="text-gray-400 text-xs font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-600" />
              </div>

              {/* Enterprise Login */}
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-600 cursor-pointer hover:border-gray-400 transition-colors">
                <div className="h-8 w-8 rounded bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <Link
                  to="/register"
                  className="text-[#1a7d4e] text-sm font-medium hover:underline"
                >
                  Click here for Enterprise login
                </Link>
              </div>

              {/* Terms */}
              <p className="text-gray-500 text-xs mt-5 leading-relaxed">
                By clicking continue, you agree to the apna{' '}
                <span className="text-[#1a7d4e] cursor-pointer hover:underline">Terms of service</span>
                {' '}&{' '}
                <span className="text-[#1a7d4e] cursor-pointer hover:underline">Privacy policy</span>
              </p>

              {/* Mode switch hint */}
              <p className="text-center text-xs text-gray-500 mt-4">
                {mode === 'login' ? (
                  <>New to apna?{' '}
                    <button type="button" onClick={() => setMode('signup')} className="text-[#1a7d4e] font-medium hover:underline">
                      Create an employer account
                    </button>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <button type="button" onClick={() => setMode('login')} className="text-[#1a7d4e] font-medium hover:underline">
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Sticky Bottom CTA ── */}
      <div className="fixed bottom-0 right-0 m-4">
        <Link
          to="/employer/post-job"
          className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-lg shadow-lg transition-colors"
          style={{ backgroundColor: '#2d1245', border: '1px solid #4a1a6b' }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Start your job post
          <ChevronDown className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
