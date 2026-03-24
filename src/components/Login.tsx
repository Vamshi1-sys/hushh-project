import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Zap, Globe, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface LoginProps {
  onLoginSuccess: (user: User) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userRole, setUserRole] = useState<'admin' | 'ambassador' | 'student'>('student');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [college, setCollege] = useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref.toUpperCase());
      setMode('signup');
      setUserRole('student');
      toast.info(`Referral code ${ref.toUpperCase()} applied!`);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        // Demo login
        const demoUsers = [
          { id: 'admin-123', name: 'Admin User', email: 'svamshi282@gmail.com', role: 'admin', status: 'active' },
          { id: 'ambassador-demo', name: 'Demo Ambassador', email: 'ambassador@hushh.com', role: 'ambassador', status: 'active' },
          { id: 'student-demo', name: 'Demo Student', email: 'student@hushh.com', role: 'student', status: 'active' }
        ];

        const user = demoUsers.find(u => u.email === email);
        if (!user) {
          throw new Error('User not found');
        }

        toast.success('Successfully logged in!');
        onLoginSuccess(user);
      } else {
        // Demo signup
        if (!name || !email || !password) {
          throw new Error('Please fill in all fields');
        }

        const newUser = {
          id: 'u-' + Date.now(),
          name,
          email,
          role: userRole,
          status: 'active',
          createdAt: new Date().toISOString()
        };

        toast.success('Account created successfully!');
        onLoginSuccess(newUser);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
      >
        <div className="p-12 bg-indigo-600 text-white flex flex-col justify-between relative overflow-hidden hidden lg:flex">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Globe size={300} />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-8">
              <TrendingUp size={28} />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">Hushh</h1>
            <p className="text-indigo-100 text-lg leading-relaxed">
              The all-in-one platform for managing campus ambassador programs and tracking organic growth.
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Zap size={20} className="text-yellow-400" />
              </div>
              <div>
                <h4 className="font-bold">Real-time Analytics</h4>
                <p className="text-sm text-indigo-100/80">Track every signup and engagement metric as it happens.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck size={20} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold">Secure Management</h4>
                <p className="text-sm text-indigo-100/80">Role-based access control for admins and ambassadors.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {referralCode ? 'Join via Ambassador' : (mode === 'login' ? 'Welcome Back' : 'Join Hushh')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {referralCode
                ? 'Complete your signup to get started'
                : (mode === 'login' 
                  ? 'Enter your credentials to access your dashboard.' 
                  : 'Create an account to start your journey.')}
            </p>
          </div>

          {referralCode && (
            <div className="mb-6 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                ✓ You're joining with an ambassador referral code
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Complete the form below to create your account</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'login' && !referralCode && (
              <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setUserRole('admin')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                    userRole === 'admin'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('ambassador')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                    userRole === 'ambassador'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Ambassador
                </button>
                <button
                  type="button"
                  onClick={() => setUserRole('student')}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                    userRole === 'student'
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Student
                </button>
              </div>
            )}
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required={mode === 'signup'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
            </div>
              )}
            </AnimatePresence>

            {mode === 'signup' && userRole === 'ambassador' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">College/University</label>
                <input
                  type="text"
                  required={userRole === 'ambassador'}
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="input-field"
                  placeholder="Your University Name"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="name@university.edu"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <AnimatePresence mode="wait">
              {mode === 'signup' && (userRole === 'student' || userRole === 'ambassador') && (
                <motion.div
                  key="referral"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-0.5">
                    {referralCode && referralCode.length > 0 ? 'Ambassador Referral Code' : 'Referral Code (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => referralCode && referralCode.length > 0 ? null : setReferralCode(e.target.value.toUpperCase())}
                    readOnly={referralCode && referralCode.length > 0}
                    className={`input-field ${referralCode && referralCode.length > 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700' : ''}`}
                    placeholder="CAMPUS2024"
                  />
                  {referralCode && referralCode.length > 0 && (
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">✓ Referral code applied and locked</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {!referralCode && (
            <div className="mt-6 text-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button 
                type="button"
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          )}

          {mode === 'login' && !referralCode && (
            <div className="mt-8 space-y-3">
              {userRole === 'admin' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Demo Admin Account
                  </h4>
                  <p className="text-xs text-blue-800 dark:text-blue-200 mb-1">
                    Email: <span className="font-mono font-bold">svamshi282@gmail.com</span>
                  </p>
                  <p className="text-[11px] text-blue-700 dark:text-blue-300">
                    Any password works in this local demo version.
                  </p>
                </div>
              )}
              
              {userRole === 'ambassador' && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                  <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Demo Ambassador Account
                  </h4>
                  <p className="text-xs text-purple-800 dark:text-purple-200 mb-1">
                    Email: <span className="font-mono font-bold">ambassador@hushh.com</span>
                  </p>
                  <p className="text-[11px] text-purple-700 dark:text-purple-300">
                    Password: <span className="font-mono font-bold">demo123</span>
                  </p>
                </div>
              )}
              
              {userRole === 'student' && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Demo Student Account
                  </h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-200 mb-1">
                    Email: <span className="font-mono font-bold">student@hushh.com</span>
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Password: <span className="font-mono font-bold">demo123</span>
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="mt-8 text-xs text-slate-400 dark:text-slate-500 text-center">
            By continuing, you agree to our
            <button className="text-indigo-600 dark:text-indigo-400 hover:underline mx-1">Terms of Service</button>
            and
            <button className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1">Privacy Policy</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
