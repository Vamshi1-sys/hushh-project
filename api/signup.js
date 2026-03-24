export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password, referralCode, role = 'user', college } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
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

    // Success response
    res.status(200).json({ 
      user: newUser,
      message: 'Account created successfully!' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
}
