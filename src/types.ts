export type UserRole = 'admin' | 'user' | 'ambassador' | 'student';
export type UserStatus = 'active' | 'blocked';
export type ReferralStatus = 'signed_up' | 'active';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
  password?: string; // For local mock auth if needed, but we'll use Firebase
}

export interface Ambassador {
  id: string; // Matches User ID
  name: string; // Denormalized for easier display
  email: string; // Denormalized for easier display
  college: string;
  referralCode: string;
  signupsCount: number;
  activeUsersCount: number;
  score: number; // (signups * 2) + active_users
  growthPercentage: number; // Calculated field for UI
  role: UserRole;
  status: UserStatus;
}

export interface Referral {
  id: string;
  ambassadorId: string;
  referredUserId: string;
  status: ReferralStatus;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalAmbassadors: number;
  totalSignups: number;
  activeUsers: number;
  conversionRate: number;
}

export interface DailyStats {
  id: string;
  date: string;
  totalSignups: number;
  activeUsers: number;
}
