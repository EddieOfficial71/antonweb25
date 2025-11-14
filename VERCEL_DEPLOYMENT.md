# Deploying to Vercel

Your Anton Web dashboard is now ready for Vercel deployment!

## What's Changed for Vercel Compatibility

### ✅ What Works on Vercel:
- **Authentication** - Signup/Login with token-based auth
- **Admin Panel** - User management, premium granting
- **User Status** - Check premium status
- **Chat** - Real-time chat (stored in temporary storage)
- **Broadcasts** - Send messages to all users
- **Premium System** - Grant/remove premium access

### ❌ What Does NOT Work on Vercel:
- **VM Control** (Start/Stop/Status) - Requires local Windows machine with Hyper-V
  - Endpoints return 503 "Not available" with helpful message
- **PowerShell Execution** - Cloud can't execute local system commands
- **File Persistence** - Files stored in `/tmp` (ephemeral, resets with deployments)

## Deployment Steps

### 1. Connect to Vercel
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel
```

Or connect via GitHub:
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click "Deploy"

### 2. Set Environment Variables (Optional)
In Vercel dashboard:
- Settings → Environment Variables
- Add any secrets needed for your app

### 3. Access Your Site
Your app will be available at: `https://your-project-name.vercel.app`

## For VM Control (Local Development Only)

If you want VM functionality, run the server locally:

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Then access at: `http://localhost:3000`

All features including VM control will work locally!

## Directory Structure

- **`/api`** - Serverless functions for Vercel
  - `auth/` - Login/Signup
  - `admin/` - User management
  - `user/` - User status
  - `vm/` - VM control (returns "not available" on Vercel)
- **`/*.html`** - Frontend files (static)
- **`/*.js`** - Frontend JavaScript (static)
- **`server.js`** - Local Node.js server (not used on Vercel)

## Troubleshooting

### "API endpoint not found"
- Make sure you're accessing endpoints from the correct domain
- For local: `http://localhost:3000/api/*`
- For Vercel: `https://your-site.vercel.app/api/*`

### "VM control not available"
- This is expected on Vercel (cloud service)
- VM control only works on local server
- Switch to local server for VM features

### File Changes Not Persisting
- Vercel uses ephemeral storage in `/tmp`
- For production persistence, integrate:
  - Firebase Firestore (recommended)
  - MongoDB Atlas
  - PostgreSQL

## Next Steps

For production data persistence, update the `/api/lib.js` file to use:
- **Firebase Firestore** - Already set up in your code
- **MongoDB** - Easy integration with Atlas
- **PostgreSQL** - Use with Vercel Postgres

Good luck! 🚀
