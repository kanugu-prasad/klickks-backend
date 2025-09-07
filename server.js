require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth"); 

const app = express();

app.use(cors({
  origin: ["https://klickks-frontend-sepia.vercel.app", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api", authRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
