import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from "cors";
import router from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [];

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000');
}

if (process.env.FRONTEND_URL) {
  const urls = process.env.FRONTEND_URL.split(',').map(url => url.trim());
  allowedOrigins.push(...urls);
}

const isVercelOrigin = (origin) => {
  if (!origin) return false;
  return origin.includes('.vercel.app') || origin.includes('vercel.app');
};

app.use(cors({
  origin: (origin, callback) => {

    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    if (isVercelOrigin(origin)) {
      return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
}));

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use('/api/auth', router);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Allowed origins: ${allowedOrigins.length > 0 ? allowedOrigins.join(', ') : 'All Vercel deployments'}`);
});
