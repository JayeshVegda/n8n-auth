# N8N Authentication Application

A full-stack authentication application with user registration, login, and email verification using n8n workflows.

## Features

- 🔐 User Registration and Login
- 📧 Email Verification via OTP (using n8n workflows)
- 🔒 Secure password hashing
- 🍪 JWT-based authentication with HTTP-only cookies
- ✅ Username availability checking
- 🎨 Modern UI with Mantine components

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Zod for validation
- bcryptjs for password hashing

### Frontend
- React 19
- Vite
- Mantine UI
- React Router
- Axios

## Project Structure

```
n8n/
├── backend/          # Express API server
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── middlewares/  # Authentication & validation middlewares
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions (JWT, email via n8n)
│   └── validations/  # Zod validation schemas
│
└── client/           # React frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   └── utils/       # API client & validation
    └── public/
```

## Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- n8n instance (for email workflows)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (if needed):
```env
VITE_API_URL=http://localhost:5000/api/auth
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/check-username` - Check username availability
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/request-verification` - Request OTP (protected)
- `POST /api/auth/verify-otp` - Verify OTP (protected)

## Environment Variables

### Backend
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS
- `PORT` - Server port (default: 5000)

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api/auth)

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd client
npm run build
```

The production build will be in `client/dist/`

## License

ISC

