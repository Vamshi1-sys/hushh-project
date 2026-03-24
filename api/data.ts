import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (e) {
      return null;
    }
  }
  return null;
}

export default function handler(req: any, res: any) {
  if (req.method === 'GET') {
    const data = loadData();
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(500).json({ error: 'Cannot load data' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
