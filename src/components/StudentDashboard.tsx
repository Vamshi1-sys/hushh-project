import React from 'react';
import { User, BookOpen, Clock, Users as UsersIcon, CheckCircle, BarChart3, Zap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { User as UserType, Ambassador, Referral } from '../types';

interface StudentDashboardProps {
  user: UserType;
  ambassadors?: Ambassador[];
  referrals?: Referral[];
}

export default function StudentDashboard({ user, ambassadors = [], referrals = [] }: StudentDashboardProps) {
  // Mock enrolled courses data
  const enrolledCourses = [
    {
      id: '1',
      name: 'Introduction to Web Development',
      instructor: 'Sarah Johnson',
      progress: 75,
      status: 'In Progress',
      enrolledDate: '2026-01-15',
      dueDate: '2026-05-30',
      students: 245
    },
    {
      id: '2',
      name: 'Advanced React Patterns',
      instructor: 'Michael Chen',
      progress: 100,
      status: 'Completed',
      enrolledDate: '2025-11-10',
      dueDate: '2026-02-28',
      students: 89
    },
    {
      id: '3',
      name: 'Cloud Architecture Fundamentals',
      instructor: 'Emily Rodriguez',
      progress: 45,
      status: 'In Progress',
      enrolledDate: '2026-02-20',
      dueDate: '2026-06-15',
      students: 156
    },
    {
      id: '4',
      name: 'Data Science Essentials',
      instructor: 'Prof. James Wilson',
      progress: 60,
      status: 'In Progress',
      enrolledDate: '2026-01-25',
      dueDate: '2026-05-10',
      students: 312
    }
  ];

  const completedCourses = enrolledCourses.filter(c => c.status === 'Completed').length;
  const inProgressCourses = enrolledCourses.filter(c => c.status === 'In Progress').length;
  const averageProgress = Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length);

  // Find referring ambassador
  const referringRelationship = referrals.find(r => r.referredUserId === user.id);
  const referringAmbassador = referringRelationship 
    ? ambassadors.find(a => a.id === referringRelationship.ambassadorId)
    : null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border border-blue-200 dark:border-blue-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <User size={40} />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user.name}!</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{user.email}</p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                ● Active Student
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Courses</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{enrolledCourses.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Completed</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{completedCourses}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Clock className="text-amber-600 dark:text-amber-400" size={24} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">In Progress</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{inProgressCourses}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Progress</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{averageProgress}%</p>
        </div>
      </div>

      {/* Referral Information */}
      {referringAmbassador && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-200 dark:border-purple-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {referringAmbassador.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Referred by Campus Ambassador</p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{referringAmbassador.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{referringAmbassador.college}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">
              <Zap size={16} />
              <span className="font-semibold">+2 Ambassador Points</span>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Courses */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <BookOpen size={28} className="text-blue-600" />
          Enrolled Courses
        </h3>
        <div className="space-y-4">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{course.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Instructor: {course.instructor}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <UsersIcon size={16} />
                      {course.students} students
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Clock size={16} />
                      Due: {new Date(course.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                        course.status === 'Completed'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      }`}>
                        {course.status === 'Completed' && <CheckCircle size={14} />}
                        {course.status}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          course.status === 'Completed'
                            ? 'bg-emerald-500'
                            : 'bg-blue-500'
                        }`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white font-semibold rounded-lg transition-all text-sm">
                    {course.status === 'Completed' ? 'View Certificate' : 'Continue Course'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress Growth */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Zap size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
              ↑ On Track
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Learning Velocity</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {Math.round((enrolledCourses.filter(c => c.status === 'In Progress').length / enrolledCourses.length) * 100) || 0}%
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Active course participation</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg">
              Completion
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Completion Rate</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {completedCourses}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Courses completed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <BarChart3 size={20} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg">
              average
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Overall Progress</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {averageProgress}%
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Across all courses</p>
        </div>
      </div>

      {/* Learning Tips */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-800 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-emerald-900 dark:text-emerald-100">
          💡 Learning Tips
        </h3>
        <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-200">
          <li className="flex items-start gap-3">
            <span className="text-emerald-600 font-bold mt-0.5">✓</span>
            <span>Complete assignments regularly to maintain your progress</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-600 font-bold mt-0.5">✓</span>
            <span>Participate in discussions to get more out of your courses</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-600 font-bold mt-0.5">✓</span>
            <span>Check course announcements regularly for updates and deadlines</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
