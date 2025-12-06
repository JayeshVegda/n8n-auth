# CORS Error Fix for Vercel Deployment

## Problem
When deploying the frontend to Vercel, you're getting CORS errors because the backend isn't allowing requests from your Vercel domain.

## Solution

The backend has been updated to automatically allow all Vercel deployments (including preview URLs). Here's what changed:

### 1. Updated CORS Configuration

The backend now automatically allows:
- Your production Vercel URL (set in `FRONTEND_URL`)
- All Vercel preview deployments (`.vercel.app` domains)
- Local development (localhost:3000)

### 2. Fixed Cookie Configuration

Updated cookie settings for cross-origin requests:
- `secure: true` in production (required for HTTPS)
- `sameSite: 'none'` in production (allows cross-origin cookies)

## Configuration Steps

### Option 1: Automatic (Recommended)
The backend now automatically accepts ALL Vercel deployments. No configuration needed! Just set:

```env
FRONTEND_URL=https://your-app.vercel.app
```

### Option 2: Multiple Specific URLs
If you want to be more restrictive, you can specify multiple URLs:

```env
FRONTEND_URL=https://your-app.vercel.app,https://your-custom-domain.com
```

## Backend Environment Variables

In your backend `.env` file (or hosting platform):

```env
# Production Frontend URL
FRONTEND_URL=https://your-app.vercel.app

# Or multiple URLs (comma-separated)
FRONTEND_URL=https://your-app.vercel.app,https://your-custom-domain.com
```

**Note:** The backend automatically allows all `*.vercel.app` domains, so even preview deployments will work!

## Testing

1. **Deploy your backend** with the updated code
2. **Set `FRONTEND_URL`** in your backend environment variables
3. **Redeploy your frontend** on Vercel
4. **Test the connection** - CORS errors should be gone!

## Common Issues

### Still getting CORS errors?

1. **Check backend is deployed** and `FRONTEND_URL` is set correctly
2. **Check cookies are working**: Make sure your backend is using HTTPS in production
3. **Check browser console** for specific error messages
4. **Verify API URL**: Make sure your frontend's `VITE_API_URL` points to the correct backend URL

### Cookie issues?

If cookies aren't being set:
- Backend must use HTTPS (cookies require secure connection)
- Frontend must use HTTPS (Vercel does this automatically)
- `sameSite: 'none'` requires `secure: true`

## Updated Files

- ✅ `backend/server.js` - Improved CORS configuration
- ✅ `backend/utils/cookieConfig.js` - Fixed cookie settings for cross-origin

## Quick Fix Checklist

- [ ] Backend deployed with updated CORS code
- [ ] `FRONTEND_URL` set in backend environment variables
- [ ] Backend using HTTPS (required for cookies)
- [ ] Frontend `VITE_API_URL` points to backend
- [ ] Both frontend and backend are on HTTPS

Your CORS errors should now be resolved! 🎉

