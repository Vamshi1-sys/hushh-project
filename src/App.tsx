import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import AmbassadorTable from './components/AmbassadorTable';
import StudentTable from './components/StudentTable';
import AIInsights from './components/AIInsights';
import AmbassadorProfile from './components/AmbassadorProfile';
import AdminProfile from './components/AdminProfile';
import StudentDashboard from './components/StudentDashboard';
import StudentCourses from './components/StudentCourses';
import GrowthGraphs from './components/GrowthGraphs';
import { Ambassador, DailyStats, DashboardMetrics, User, UserRole, Referral } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSubTab, setUserSubTab] = useState<'ambassadors' | 'students'>('ambassadors');
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [currentAmbassador, setCurrentAmbassador] = useState<Ambassador | null>(null);
  
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalAmbassadors: 0,
    totalSignups: 0,
    activeUsers: 0,
    conversionRate: 0
  });

  // Fetch initial data
  const fetchData = async () => {
    try {
      // Demo data - works without backend API
      const demoData = {
        users: [
          {
            id: "admin-123",
            name: "Admin User",
            email: "svamshi282@gmail.com",
            role: "admin",
            status: "active",
            createdAt: new Date().toISOString()
          },
          {
            id: "ambassador-demo",
            name: "Demo Ambassador",
            email: "ambassador@hushh.com",
            role: "ambassador",
            status: "active",
            createdAt: new Date().toISOString()
          },
          {
            id: "student-demo",
            name: "Demo Student",
            email: "student@hushh.com",
            role: "student",
            status: "active",
            createdAt: new Date().toISOString()
          }
        ],
        ambassadors: [
          {
            id: "ambassador-demo",
            name: "Demo Ambassador",
            email: "ambassador@hushh.com",
            college: "Tech University",
            referralCode: "DEMO2024",
            signupsCount: 5,
            activeUsersCount: 5,
            score: 50,
            growthPercentage: 0,
            role: "ambassador",
            status: "active"
          }
        ],
        referrals: [
          {
            id: "ref-demo",
            ambassadorId: "ambassador-demo",
            referredUserId: "student-demo",
            status: "signed_up",
            createdAt: new Date().toISOString()
          }
        ],
        dailyStats: generateDailyStats()
      };

      setUsers(demoData.users);
      setAmbassadors(demoData.ambassadors);
      setReferrals(demoData.referrals || []);
      setDailyStats(demoData.dailyStats || []);
      
      // If logged in, update user state from fresh data
      if (user) {
        const freshUser = demoData.users.find((u: User) => u.id === user.id);
        if (freshUser) {
          setUser(freshUser);
          setUserRole(freshUser.role);
          if (freshUser.role === 'ambassador') {
            const amb = demoData.ambassadors.find((a: Ambassador) => a.id === freshUser.id);
            setCurrentAmbassador(amb || null);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Generate daily stats helper
  const generateDailyStats = (): DailyStats[] => {
    const stats = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const baseSignups = Math.floor(i * 0.3 + Math.random() * 5);
      const baseActive = Math.floor(i * 0.25 + Math.random() * 4);
      
      stats.push({
        id: `stat-${dateStr}`,
        date: dateStr,
        totalSignups: Math.max(0, baseSignups),
        activeUsers: Math.max(0, baseActive)
      });
    }
    return stats;

  useEffect(() => {
    // Check if there's a referral code in the URL
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    
    // If referral code present, show login page (clear any existing session)
    if (ref) {
      setUser(null);
      setUserRole('user');
      localStorage.removeItem('user');
      setIsAuthReady(true);
      fetchData();
      return;
    }
    
    // Check local storage for session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role);
    }
    setIsAuthReady(true);
    fetchData();
  }, []);

  // Update metrics
  useEffect(() => {
    const totalSignups = ambassadors.reduce((acc, curr) => acc + curr.signupsCount, 0);
    const activeUsers = ambassadors.reduce((acc, curr) => acc + curr.activeUsersCount, 0);
    
    setMetrics({
      totalUsers: users.length,
      totalAmbassadors: ambassadors.length,
      totalSignups,
      activeUsers,
      conversionRate: totalSignups > 0 ? Math.round((activeUsers / totalSignups) * 100) : 0
    });
  }, [ambassadors, users]);

  const handleLogout = () => {
    setUser(null);
    setUserRole('user');
    setCurrentAmbassador(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const handleAddAmbassador = async (newAmbassador: any) => {
    const id = 'user-' + Date.now();
    const userData: User = {
      id,
      name: newAmbassador.name,
      email: newAmbassador.email,
      role: newAmbassador.role,
      status: newAmbassador.status || 'active',
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (newAmbassador.role === 'ambassador') {
        const ambData: Ambassador = {
          id,
          name: newAmbassador.name,
          email: newAmbassador.email,
          college: newAmbassador.college || 'N/A',
          referralCode: newAmbassador.referralCode || `REF-${Date.now()}`,
          signupsCount: 0,
          activeUsersCount: 0,
          score: 0,
          growthPercentage: 0,
          role: 'ambassador',
          status: 'active'
        };
        await fetch('/api/ambassadors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ambData)
        });
      }
      toast.success('User added successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  const handleDeleteAmbassador = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      await fetch(`/api/ambassadors/${id}`, { method: 'DELETE' });
      toast.success('User removed successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleEditAmbassador = async (id: string, updatedData: any) => {
    try {
      await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      await fetch(`/api/ambassadors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      
      toast.success('User updated successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleSimulateSignup = async (ambassadorId: string) => {
    const id = `student-${Date.now()}`;
    const studentData = {
      id,
      name: `Demo Student ${Math.floor(Math.random() * 1000)}`,
      email: `demo${Date.now()}@example.com`,
      password: 'password123',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    try {
      // 1. Create the student user
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData)
      });

      // 2. Create the referral record
      const referralData = {
        id: `ref-${Date.now()}`,
        ambassadorId,
        referredUserId: id,
        status: 'completed',
        createdAt: new Date().toISOString()
      };
      await fetch('/api/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(referralData)
      });

      // 3. Update the ambassador's score and count
      const ambassador = ambassadors.find(a => a.id === ambassadorId);
      if (ambassador) {
        const updatedAmbassador = {
          ...ambassador,
          signupsCount: (ambassador.signupsCount || 0) + 1,
          score: (ambassador.score || 0) + 10,
          activeUsersCount: (ambassador.activeUsersCount || 0) + 1
        };
        await fetch(`/api/ambassadors/${ambassadorId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedAmbassador)
        });
      }

      toast.success('Demo signup simulated successfully!');
      fetchData();
    } catch (error) {
      toast.error('Failed to simulate demo signup');
    }
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setUserRole(loggedInUser.role);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    
    if (loggedInUser.role === 'ambassador') {
      const amb = ambassadors.find(a => a.id === loggedInUser.id);
      setCurrentAmbassador(amb || null);
      setActiveTab('profile');
    } else if (loggedInUser.role === 'student') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('dashboard');
    }
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login onLoginSuccess={handleLogin} />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole as 'admin' | 'ambassador' | 'student'} onLogout={handleLogout}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {activeTab === 'dashboard' && userRole === 'admin' && 'Growth Overview'}
              {activeTab === 'dashboard' && userRole === 'ambassador' && 'My Performance'}
              {activeTab === 'dashboard' && userRole === 'student' && 'Welcome to Hushh'}
              {activeTab === 'enrollment' && userRole === 'student' && 'Course Catalog'}
              {activeTab === 'enrollment' && userRole !== 'student' && 'My Courses'}
              {activeTab === 'leaderboard' && 'Leaderboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'account' && 'Account Settings'}
              {activeTab === 'profile' && 'My Performance'}
              {activeTab === 'students' && 'My Referrals'}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeTab === 'dashboard' && userRole === 'admin' && 'Monitor real-time acquisition and engagement metrics.'}
              {activeTab === 'dashboard' && userRole === 'ambassador' && 'Your personal growth metrics and referral tracking.'}
              {activeTab === 'dashboard' && userRole === 'student' && 'Your learning journey starts here.'}
              {activeTab === 'enrollment' && userRole === 'student' && 'Manage your enrolled courses and explore new learning opportunities.'}
              {activeTab === 'enrollment' && userRole !== 'student' && 'View and manage your course enrollment.'}
              {activeTab === 'leaderboard' && 'Top performing ambassadors ranked by impact.'}
              {activeTab === 'users' && 'Manage your campus ambassadors and employees.'}
              {activeTab === 'account' && 'Manage your account information and security settings.'}
              {activeTab === 'profile' && 'Your personal growth metrics and referral tracking.'}
              {activeTab === 'students' && 'View all students you have referred.'}
            </p>
          </div>
          <div className="text-sm font-medium text-slate-500 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {userRole === 'admin' ? (
          <>
            {activeTab === 'dashboard' && (
              <>
                <Dashboard 
                  metrics={metrics} 
                  dailyStats={dailyStats} 
                  ambassadors={ambassadors}
                  users={users}
                  referrals={referrals}
                />
                <GrowthGraphs 
                  dailyStats={dailyStats}
                  title="Platform Growth Analytics"
                  subtitle="Monitor comprehensive growth metrics and performance trends"
                  showGrowthMetrics={true}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <AIInsights ambassadors={ambassadors} />
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('users')}
                        className="w-full py-3 px-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-semibold text-sm hover:bg-indigo-100 transition-all text-left flex items-center justify-between"
                      >
                        Add New Ambassador
                        <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">+</span>
                      </button>
                      <button className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all text-left">
                        Generate Monthly Report
                      </button>
                      <button className="w-full py-3 px-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all text-left">
                        Email Top Performers
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'leaderboard' && (
              <Leaderboard ambassadors={ambassadors} />
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-1 bg-slate-100 dark:bg-slate-800 w-fit rounded-2xl">
                  <button
                    onClick={() => setUserSubTab('ambassadors')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                      userSubTab === 'ambassadors' 
                        ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-600" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Ambassadors
                  </button>
                  <button
                    onClick={() => setUserSubTab('students')}
                    className={cn(
                      "px-6 py-2 rounded-xl text-sm font-bold transition-all",
                      userSubTab === 'students' 
                        ? "bg-white dark:bg-slate-900 shadow-sm text-indigo-600" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    Students
                  </button>
                </div>

                {userSubTab === 'ambassadors' ? (
                  <AmbassadorTable 
                    ambassadors={ambassadors} 
                    users={users}
                    referrals={referrals}
                    onAddAmbassador={handleAddAmbassador}
                    onDeleteAmbassador={handleDeleteAmbassador}
                    onEditAmbassador={handleEditAmbassador}
                  />
                ) : (
                  <StudentTable 
                    users={users}
                    referrals={referrals}
                    ambassadors={ambassadors}
                  />
                )}
              </div>
            )}

            {activeTab === 'account' && user && (
              <AdminProfile user={user} />
            )}
          </>
        ) : userRole === 'ambassador' ? (
          <>
            {activeTab === 'profile' && currentAmbassador && (
              <AmbassadorProfile 
                ambassador={currentAmbassador} 
                users={users}
                referrals={referrals}
                onSimulateSignup={handleSimulateSignup}
              />
            )}
            {activeTab === 'students' && currentAmbassador && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
                  <h3 className="text-lg font-bold mb-6">Students You've Referred ({referrals.filter(r => r.ambassadorId === currentAmbassador.id).length})</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-4 px-4 font-bold text-slate-700 dark:text-slate-300">Name</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-700 dark:text-slate-300">Email</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-700 dark:text-slate-300">Status</th>
                        <th className="text-left py-4 px-4 font-bold text-slate-700 dark:text-slate-300">Referred On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.filter(r => r.ambassadorId === currentAmbassador.id).map(referral => {
                        const student = users.find(u => u.id === referral.referredUserId);
                        return student ? (
                          <tr key={referral.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-4 px-4">
                              <span className="font-semibold text-slate-900 dark:text-white">{student.name}</span>
                            </td>
                            <td className="py-4 px-4 text-slate-600 dark:text-slate-400">{student.email}</td>
                            <td className="py-4 px-4">
                              <span className={cn(
                                'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold',
                                referral.status === 'signed_up' 
                                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              )}>
                                ● {referral.status === 'signed_up' ? 'Active' : 'Pending'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-600 dark:text-slate-400 text-xs">
                              {new Date(referral.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ) : null;
                      })}
                    </tbody>
                  </table>
                  {referrals.filter(r => r.ambassadorId === currentAmbassador.id).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">No referrals yet. Start sharing your referral code!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {activeTab === 'account' && user && (
              <AdminProfile user={user} />
            )}
          </>
        ) : userRole === 'student' ? (
          <>
            {activeTab === 'dashboard' && user && (
              <StudentDashboard 
                user={user}
                ambassadors={ambassadors}
                referrals={referrals}
              />
            )}
            {activeTab === 'enrollment' && (
              <StudentCourses />
            )}
            {activeTab === 'account' && user && (
              <AdminProfile user={user} />
            )}
          </>
        ) : null}
      </div>
      <Toaster position="top-right" richColors />
    </Layout>
  );
}
