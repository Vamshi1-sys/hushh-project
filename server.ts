import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(process.cwd(), "data.json");

// Initial data structure
const initialData = {
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
  announcements: [
    {
      id: "1",
      title: "Welcome to Hushh!",
      content: "We are excited to have you here. Start by exploring the dashboard and managing your campus ambassadors.",
      authorId: "admin-123",
      createdAt: new Date().toISOString()
    }
  ],
  dailyStats: generateDailyStats()
};

// Generate realistic daily stats for the past 30 days
function generateDailyStats() {
  const stats = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate growth data with some randomness
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

// Load data from file or use initial data
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (e) {
      console.error("Error loading data, using initial data", e);
      return initialData;
    }
  }
  return initialData;
}

// Save data to file
function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3300;

  app.use(express.json());

  let data = loadData();
  
  // Initialize data file with initial data if empty
  if (data.users.length <= 1) {
    if (!fs.existsSync(DATA_FILE)) {
      data = initialData;
      saveData(data);
    }
  }

  // API Routes
  app.get("/api/data", (req, res) => {
    res.json(data);
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    // Simple mock auth - any password works for now
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ error: "User not found. Please sign up first if you haven't created an account." });
    }
  });

  app.post("/api/signup", (req, res) => {
    const { name, email, password, referralCode, role = "user", college } = req.body;
    
    if (data.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = {
      id: "u-" + Date.now(),
      name,
      email,
      role: role === "admin" ? "admin" : role === "ambassador" ? "ambassador" : role === "student" ? "student" : "user",
      status: "active",
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);

    // Handle ambassador creation
    if (role === "ambassador") {
      const newAmbassador = {
        id: newUser.id,
        name,
        email,
        college: college || "N/A",
        referralCode: `REF-${Date.now()}`,
        signupsCount: 0,
        activeUsersCount: 0,
        score: 0,
        growthPercentage: 0,
        role: "ambassador",
        status: "active"
      };
      data.ambassadors.push(newAmbassador);
    }

    // Handle referral
    if (referralCode) {
      const amb = data.ambassadors.find((a: any) => a.referralCode === referralCode.toUpperCase());
      if (amb) {
        const referral = {
          id: "ref-" + Date.now(),
          ambassadorId: amb.id,
          referredUserId: newUser.id,
          status: "signed_up",
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
  });

  app.post("/api/ambassadors", (req, res) => {
    const newAmb = req.body;
    data.ambassadors.push(newAmb);
    saveData(data);
    res.json(newAmb);
  });

  app.put("/api/ambassadors/:id", (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const index = data.ambassadors.findIndex((a: any) => a.id === id);
    if (index !== -1) {
      data.ambassadors[index] = { ...data.ambassadors[index], ...updatedData };
      saveData(data);
      res.json(data.ambassadors[index]);
    } else {
      res.status(404).json({ error: "Ambassador not found" });
    }
  });

  app.delete("/api/ambassadors/:id", (req, res) => {
    const { id } = req.params;
    data.ambassadors = data.ambassadors.filter((a: any) => a.id !== id);
    saveData(data);
    res.json({ success: true });
  });

  app.post("/api/users", (req, res) => {
    const newUser = req.body;
    data.users.push(newUser);
    saveData(data);
    res.json(newUser);
  });

  app.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const index = data.users.findIndex((u: any) => u.id === id);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...updatedData };
      saveData(data);
      res.json(data.users[index]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    data.users = data.users.filter((u: any) => u.id !== id);
    saveData(data);
    res.json({ success: true });
  });

  // AI Insights endpoint
  app.post("/api/insights", async (req, res) => {
    const { ambassadors } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key not configured. Please set GEMINI_API_KEY environment variable.",
        insights: "AI insights are currently unavailable. Please configure your API key."
      });
    }

    try {
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt = `
        Analyze the following campus ambassador performance data and provide 3-4 concise, actionable insights.
        Highlight top performers, identify those needing help, and suggest growth strategies.
        
        Data:
        ${ambassadors.map((a: any) => `${a.name}: ${a.signupsCount} signups, ${a.activeUsersCount} active, ${a.score} score`).join('\n')}
        
        Format the response as a short markdown list.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      res.json({ insights: response.text });
    } catch (error: any) {
      console.error("Error generating AI insights:", error);
      res.status(500).json({
        error: error.message || "Failed to generate insights",
        insights: "Unable to generate insights at this time. Please try again later."
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
