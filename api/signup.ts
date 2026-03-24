import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

function loadData() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = loadData();
    const { name, email, password, referralCode, role = 'user', college } = req.body;

    // Check if user exists
    if (data.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = {
      id: 'u-' + Date.now(),
      name,
      email,
      role: role === 'admin' ? 'admin' : role === 'ambassador' ? 'ambassador' : role === 'student' ? 'student' : 'user',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);

    // Handle ambassador creation
    if (role === 'ambassador') {
      const newAmbassador = {
        id: newUser.id,
        name,
        email,
        college: college || 'N/A',
        referralCode: `REF-${Date.now()}`,
        signupsCount: 0,
        activeUsersCount: 0,
        score: 0,
        growthPercentage: 0,
        role: 'ambassador',
        status: 'active'
      };
      data.ambassadors.push(newAmbassador);
    }

    // Handle referral
    if (referralCode) {
      const amb = data.ambassadors.find((a: any) => a.referralCode === referralCode.toUpperCase());
      if (amb) {
        const referral = {
          id: 'ref-' + Date.now(),
          ambassadorId: amb.id,
          referredUserId: newUser.id,
          status: 'signed_up',
          createdAt: new Date().toISOString()
        };
        data.referrals.push(referral);
        amb.signupsCount += 1;
        amb.activeUsersCount += 1;
        amb.score += 2;
      }
    }

    saveData(data);
    res.json({ user: newUser });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
