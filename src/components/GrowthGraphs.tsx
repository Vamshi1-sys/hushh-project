import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, Users, UserCheck, Calendar } from 'lucide-react';
import { DailyStats } from '../types';

interface GrowthGraphsProps {
  dailyStats: DailyStats[];
  title?: string;
  subtitle?: string;
  showGrowthMetrics?: boolean;
  timeRange?: '7d' | '30d' | '90d';
}

export default function GrowthGraphs({
  dailyStats,
  title = 'Growth Overview',
  subtitle = 'Track your performance metrics',
  showGrowthMetrics = true,
  timeRange = '30d'
}: GrowthGraphsProps) {
  // Filter data based on time range
  const getRangeData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : 30;
    return dailyStats.slice(-days);
  };

  const chartData = getRangeData();

  // Calculate metrics
  const calculateMetrics = () => {
    if (chartData.length === 0) {
      return { totalSignups: 0, totalActive: 0, avgDaily: 0, peakDay: 0 };
    }

    const totalSignups = chartData.reduce((sum, d) => sum + d.totalSignups, 0);
    const totalActive = chartData.reduce((sum, d) => sum + d.activeUsers, 0);
    const avgDaily = Math.round(totalSignups / chartData.length);
    const peakDay = Math.max(...chartData.map(d => d.totalSignups));

    return { totalSignups, totalActive, avgDaily, peakDay };
  };

  const metrics = calculateMetrics();

  // Calculate growth percentage
  const calculateGrowth = () => {
    if (chartData.length < 2) return 0;
    const firstWeek = chartData.slice(0, Math.ceil(chartData.length / 2)).reduce((sum, d) => sum + d.totalSignups, 0);
    const secondWeek = chartData.slice(Math.ceil(chartData.length / 2)).reduce((sum, d) => sum + d.totalSignups, 0);
    if (firstWeek === 0) return 0;
    return Math.round(((secondWeek - firstWeek) / firstWeek) * 100);
  };

  const growthPercentage = calculateGrowth();

  const MetricCard = ({ icon: Icon, label, value, subtext, trend }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-xs font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg">
            ↑ {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</h3>
      {subtext && <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subtext}</p>}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={28} />
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">{subtitle}</p>
      </div>

      {/* Metrics Cards */}
      {showGrowthMetrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={Users}
            label="Total Signups"
            value={metrics.totalSignups}
            subtext={`${metrics.avgDaily} daily average`}
            trend={`${growthPercentage > 0 ? '+' : ''}${growthPercentage}%`}
          />
          <MetricCard
            icon={UserCheck}
            label="Active Users"
            value={metrics.totalActive}
            subtext="Verified & Active"
          />
          <MetricCard
            icon={Calendar}
            label="Peak Day"
            value={metrics.peakDay}
            subtext="Max signups in period"
          />
          <MetricCard
            icon={TrendingUp}
            label="Growth Rate"
            value={`${growthPercentage}%`}
            subtext={growthPercentage > 0 ? 'Period-over-period' : 'Maintain momentum'}
            trend={growthPercentage > 0 ? 'Positive' : 'Neutral'}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Signups Trend */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Signups Trend</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daily signup progression</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  interval={Math.ceil(chartData.length / 6) - 1}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: any) => [value, 'Signups']}
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

        {/* Active Users Trend */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Users</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Verified active users over time</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  interval={Math.ceil(chartData.length / 6) - 1}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: any) => [value, 'Active Users']}
                />
                <Line
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Combined View */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Combined Growth View</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Signups vs Active Users comparison</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              7D
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
              30D
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
              90D
            </button>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                interval={Math.ceil(chartData.length / 6) - 1}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} yAxisId="left" />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} yAxisId="right" orientation="right" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="totalSignups" fill="#4f46e5" name="Signups" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="activeUsers" stroke="#10b981" strokeWidth={3} name="Active Users" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
