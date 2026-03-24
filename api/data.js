const fs = require('fs');
const path = require('path');

// Mock data since file system access is limited on Vercel
const mockData = {
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
  referrals: [],
  dailyStats: generateDailyStats()
};

function generateDailyStats() {
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
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(mockData);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
