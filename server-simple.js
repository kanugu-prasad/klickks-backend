require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// CORS configuration
app.use(cors({
  origin: ["https://klickks-frontend-sepia.vercel.app", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// In-memory storage (for demo purposes)
let users = [];
let nextId = 1;

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Backend is running!", 
    timestamp: new Date().toISOString(),
    usersCount: users.length,
    endpoints: ["/api/register", "/api/login", "/api/dashboard", "/api/logout"]
  });
});

// Debug endpoint to test API routing
app.get("/api/debug", (req, res) => {
  res.json({ 
    message: "API routing is working!",
    timestamp: new Date().toISOString(),
    usersCount: users.length
  });
});

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    console.log("Register request received:", req.body);
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: nextId++,
      name,
      email,
      password: hashedPassword
    };
    
    users.push(newUser);
    console.log("User registered successfully:", newUser.email);
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.SECRET_KEY || "mysecret",
      { expiresIn: "1h" }
    );

    console.log("Login successful, setting cookie");
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Dashboard endpoint
app.get("/api/dashboard", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY || "mysecret");
    res.json({ message: "Welcome to Dashboard", user: decoded });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

// Logout endpoint
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS origins: https://klickks-frontend-sepia.vercel.app, http://localhost:3000`);
});
