export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Demo users (in production, use a real database)
    const demoUsers = [
      { id: 'admin-123', name: 'Admin User', email: 'svamshi282@gmail.com', role: 'admin', status: 'active' },
      { id: 'ambassador-demo', name: 'Demo Ambassador', email: 'ambassador@hushh.com', role: 'ambassador', status: 'active' },
      { id: 'student-demo', name: 'Demo Student', email: 'student@hushh.com', role: 'student', status: 'active' }
    ];

    const user = demoUsers.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Simple password check (any non-empty password works in demo)
    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
