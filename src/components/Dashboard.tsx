import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Users, 
  UserPlus, 
  Activity, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Link as LinkIcon
} from 'lucide-react';
import { formatNumber } from '../lib/utils';
import { Ambassador, DailyStats, DashboardMetrics, User, Referral } from '../types';

interface DashboardProps {
  metrics: DashboardMetrics;
  dailyStats: DailyStats[];
  ambassadors: Ambassador[];
  users: User[];
  referrals: Referral[];
}

export default function Dashboard({ metrics, dailyStats, ambassadors, users, referrals }: DashboardProps) {
  const stats = [
    { label: 'Total Ambassadors', value: metrics.totalAmbassadors, icon: Users, color: 'indigo', trend: '+12%' },
    { label: 'Total Signups', value: metrics.totalSignups, icon: UserPlus, color: 'emerald', trend: '+24%' },
    { label: 'Active Users', value: metrics.activeUsers, icon: Activity, color: 'amber', trend: '+8%' },
    { label: 'Conversion Rate', value: `${metrics.conversionRate}%`, icon: Target, color: 'rose', trend: '+2%' },
  ];

  const recentStudents = [...users]
    .filter(u => u.role === 'user')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getReferralCode = (studentId: string) => {
    const referral = referrals.find(r => r.referredUserId === studentId);
    if (!referral) return null;
    const ambassador = ambassadors.find(a => a.id === referral.ambassadorId);
    return ambassador?.referralCode;
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Monitor your ambassador program performance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                <stat.icon size={22} />
              </div>
              <div className="badge badge-success text-xs">
                <ArrowUpRight size={12} />
                {stat.trend}
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-bold mt-2 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Signups Over Time */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Signups Growth</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monthly signup trends</p>
            </div>
            <select className="input-field px-3 py-2 w-auto">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0 dark:#334155" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="totalSignups" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSignups)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active Users per Ambassador */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Ambassador Performance</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Active users per ambassador</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ambassadors.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0 dark:#334155" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="activeUsersCount" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={40}>
                  {ambassadors.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Signups</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Latest student registrations</p>
          </div>
          <UserPlus size={20} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="space-y-3">
          {recentStudents.length > 0 ? (
            recentStudents.map((student) => {
              const code = getReferralCode(student.id);
              return (
                <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(student.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {code ? (
                    <span className="badge badge-info text-xs">
                      <LinkIcon size={12} />
                      {code}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Direct Signup</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-500 italic">
              No recent signups yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
