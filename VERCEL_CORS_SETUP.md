# Vercel CORS Fix - Quick Setup Guide

## ✅ What's Fixed

I've updated your backend to automatically handle Vercel CORS issues:

1. **Auto-allows all Vercel deployments** (including preview URLs)
2. **Fixed cookie configuration** for cross-origin requests
3. **Better error handling** for CORS

## 🚀 Quick Fix Steps

### Step 1: Get Your Vercel Frontend URL

1. Go to your Vercel dashboard
2. Find your deployed project
3. Copy your production URL (e.g., `https://your-app.vercel.app`)

### Step 2: Update Backend Environment Variables

In your backend hosting platform (wherever your backend is deployed), set:

```env
FRONTEND_URL=https://your-app.vercel.app
```

**Or if you have multiple URLs (comma-separated):**
```env
FRONTEND_URL=https://your-app.vercel.app,https://your-custom-domain.com
```

### Step 3: Deploy Backend

Deploy the updated backend code with the new CORS configuration.

### Step 4: Update Frontend API URL

Make sure your frontend's environment variable in Vercel points to your backend:

In Vercel → Your Project → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend-url.com/api/auth
```

### Step 5: Redeploy Frontend

Redeploy your frontend on Vercel to pick up any environment variable changes.

## 🎯 How It Works

The backend now automatically:
- ✅ Allows ALL `*.vercel.app` domains (including preview deployments)
- ✅ Allows your specific `FRONTEND_URL` if set
- ✅ Allows localhost for development
- ✅ Properly handles cookies for cross-origin requests

## 📋 Environment Variables Summary

### Backend (Where your backend is hosted):
```env
FRONTEND_URL=https://your-app.vercel.app
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
NODE_ENV=production
PORT=5000
N8N_WELCOME_URL=your_n8n_webhook
N8N_OTP_URL=your_n8n_webhook
```

### Frontend (Vercel Environment Variables):
```env
VITE_API_URL=https://your-backend-url.com/api/auth
```

## ⚠️ Important Notes

1. **Backend must use HTTPS** - Cookies won't work without HTTPS
2. **Both frontend and backend must be HTTPS** - Vercel automatically provides this
3. **Check your backend logs** - You'll see which origins are allowed on startup

## 🐛 Still Having Issues?

### Check These:

1. **Backend logs** - Look for "Allowed origins: ..." message on startup
2. **Browser console** - Check the exact CORS error message
3. **Network tab** - Check if OPTIONS request is failing
4. **Backend URL** - Verify your `VITE_API_URL` is correct in Vercel

### Common Issues:

**Issue:** "Access-Control-Allow-Origin" error
- **Fix:** Make sure `FRONTEND_URL` is set in backend environment

**Issue:** Cookies not being set
- **Fix:** Backend must use HTTPS, and both frontend/backend must be HTTPS

**Issue:** Still seeing CORS errors
- **Fix:** Check that your backend is actually deployed with the new code

## 📝 Files Changed

- ✅ `backend/server.js` - Updated CORS to auto-allow Vercel
- ✅ `backend/utils/cookieConfig.js` - Fixed cookie settings

The CORS error should now be resolved! 🎉

