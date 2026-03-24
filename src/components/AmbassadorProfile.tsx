import React from 'react';
import { 
  Trophy, 
  Target, 
  Activity, 
  UserPlus, 
  Share2, 
  Copy,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { Ambassador, User, Referral } from '../types';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface AmbassadorProfileProps {
  ambassador: Ambassador;
  users: User[];
  referrals: Referral[];
  onSimulateSignup?: (ambassadorId: string) => void;
}

export default function AmbassadorProfile({ ambassador, users, referrals, onSimulateSignup }: AmbassadorProfileProps) {
  const copyReferral = () => {
    navigator.clipboard.writeText(ambassador.referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  const stats = [
    { label: 'My Signups', value: ambassador.signupsCount, icon: UserPlus, color: 'indigo' },
    { label: 'Signups Today', value: 0, icon: Calendar, color: 'purple' },
    { label: 'Active Users', value: ambassador.activeUsersCount, icon: Activity, color: 'emerald' },
    { label: 'Score', value: ambassador.score, icon: Target, color: 'amber' },
  ];

  const myStudents = referrals
    .filter(r => r.ambassadorId === ambassador.id)
    .map(r => {
      const student = users.find(u => u.id === r.referredUserId);
      return {
        ...student,
        signupDate: r.createdAt
      };
    })
    .filter(s => s.id);

  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl shadow-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-3xl font-bold shadow-lg">
              {ambassador.name[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome, {ambassador.name}!</h1>
              <p className="text-indigo-100 mt-2">Monitor your campus ambassador performance in real-time</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 shadow-lg">
            <p className="text-xs uppercase font-semibold tracking-widest text-indigo-200 mb-3">Referral Code</p>
            <div className="flex items-center gap-3">
              <code className="text-2xl font-mono font-bold">{ambassador.referralCode}</code>
              <button 
                onClick={copyReferral}
                className="p-2.5 hover:bg-white/20 rounded-lg transition-all"
                title="Copy code"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center mb-4 shadow-md`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-2 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Growth Chart */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={22} />
              Growth Trend
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Your signup performance overview</p>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[]}>
              <defs>
                <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0 dark:#334155" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12}}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  borderRadius: '12px', 
                  border: '1px solid #334155', 
                  color: '#fff'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="totalSignups" 
                stroke="#4f46e5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSignups)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Share Referral Link */}
        <div className="card p-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Share2 className="text-indigo-600 dark:text-indigo-400" size={22} />
            Share Your Link
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">Distribute your unique referral link to recruit more students to your campus community.</p>
          
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              readOnly 
              value={`${window.location.origin}/?ref=${ambassador.referralCode}`}
              className="input-field flex-1 font-mono text-xs"
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/?ref=${ambassador.referralCode}`);
                toast.success('Link copied to clipboard!');
              }}
              className="btn-primary px-4"
            >
              Copy
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = `${window.location.origin}/?ref=${ambassador.referralCode}`;
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all text-sm"
              title="Clear login and test referral link"
            >
              Test
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-900 dark:text-blue-100 font-semibold mb-2">How to share:</p>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>✓ Click <span className="font-mono font-bold">Copy</span> to copy the link</li>
              <li>✓ Share with students via email, WhatsApp, social media</li>
              <li>✓ Students click the link and signup form auto-fills with your code</li>
              <li>✓ Your signup count increases when they complete signup</li>
            </ul>
          </div>
          
          {onSimulateSignup && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wide mb-3">Demo Mode</p>
              <button 
                onClick={() => onSimulateSignup(ambassador.id)}
                className="w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 py-3 rounded-lg font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                Simulate Signup
              </button>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center">
                Test the system by simulating a new student signup with your code.
              </p>
            </div>
          )}
        </div>

        {/* Recent Signups */}
        <div className="card p-8 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <UserPlus className="text-indigo-600 dark:text-indigo-400" size={22} />
            Recent Signups
          </h3>
          <div className="flex-1 overflow-y-auto">
            {myStudents.length > 0 ? (
              <div className="space-y-3">
                {myStudents.slice(0, 5).map((student: any) => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                        {student.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(student.signupDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="badge badge-success text-xs">Active</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 py-8">
                <UserPlus size={44} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">No signups yet</p>
                <p className="text-xs">Share your referral link to get started</p>
              </div>
            )}
          </div>
          {myStudents.length > 5 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">+{myStudents.length - 5} more signups</p>
          )}
        </div>
      </div>

      {/* Rank Card */}
      <div className="card p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Trophy className="text-amber-500" size={22} />
          Your Rank & Achievements
        </h3>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-900/20 flex items-center justify-center shadow-lg">
            <Trophy className="text-amber-600 dark:text-amber-400" size={40} />
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">#4 Overall</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Top 5% of all ambassadors worldwide</p>
          </div>
        </div>
        
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Next Milestone Progress</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">Reach <span className="font-bold">200 signups</span> for <span className="text-indigo-600 dark:text-indigo-400 font-bold">Gold Badge</span></p>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 w-3/4 rounded-full transition-all" style={{width: '75%'}}></div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">150 / 200 signups (75%)</p>
        </div>
      </div>
    </div>
  );
}
