import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

function loadData() {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(data);
}

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = loadData();
    const { email, password } = req.body;

    // Find user by email
    const user = data.users.find((u: any) => u.email === email);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Password validation (in production, use proper hashing)
    if (password !== 'password123') {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
