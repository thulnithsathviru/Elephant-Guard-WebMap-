# API Configuration Fix for Production Deployment

## Problem
The hosted site on Netlify was showing 404 errors for `/api/layers` because:
1. The frontend was deployed as a static site on Netlify
2. The backend is deployed separately on Railway
3. The Vite proxy configuration only works in development, not production
4. The frontend was making relative API calls (`/api/layers`) which don't exist on the static Netlify site

## Solution
Created a configuration system that automatically detects the environment and uses the correct API base URL:

### 1. API Configuration (`src/config/api.js`)
- **Development**: Uses `/api` (proxied by Vite to Railway)
- **Production**: Uses `https://elephant-guard-production.up.railway.app/api` (direct Railway URL)

### 2. Health Check System (`src/config/healthCheck.js`)
- Checks if the backend API is accessible
- Shows user-friendly messages when API is unavailable
- Graceful degradation when backend is down

### 3. Updated Components
- **MapComponent**: Uses `createApiUrl()` for all API calls, shows warning when API unavailable
- **Live page**: Uses `createApiUrl()` for report submissions, checks API health

## Files Modified
1. `frontend/hec-frontend/src/config/api.js` (NEW)
2. `frontend/hec-frontend/src/config/healthCheck.js` (NEW)
3. `frontend/hec-frontend/src/components/MapComponent.jsx`
4. `frontend/hec-frontend/src/pages/Live.jsx`

## How to Deploy

### Option 1: Update Netlify with New Build
1. The build files are ready in `frontend/hec-frontend/dist/`
2. Upload these files to Netlify to replace the current deployment
3. The new version will automatically use the Railway backend URL in production

### Option 2: Git Deploy (Recommended)
1. Commit all the changes to your repository:
   ```bash
   git add .
   git commit -m "Fix API configuration for production deployment"
   git push origin dev
   ```

2. If Netlify is connected to your Git repository, it will automatically rebuild and deploy

## Testing
After deployment, the frontend should:
1. ✅ Successfully load map layers from the Railway backend
2. ✅ Show layer controls and data
3. ✅ Allow report submissions
4. ✅ Show a warning banner if the backend is temporarily unavailable
5. ✅ Still show the base map even when backend is down

## Backend Status
- Backend is deployed at: `https://elephant-guard-production.up.railway.app/`
- Health check endpoint: `https://elephant-guard-production.up.railway.app/api/health`
- CORS is properly configured for `https://elephantguardsl.netlify.app`

## Environment Detection
The system automatically detects:
- **Development** (`npm run dev`): Uses proxy to localhost:5000 or Railway
- **Production** (`npm run build` + deployed): Uses direct Railway URLs

No manual configuration required!
