# Vercel Deployment Guide

## Pre-Deployment Checklist

Run the verification script to ensure all files are in place:

```bash
npm run verify
```

This will check:
- ✓ All required frontend files exist
- ✓ All CSS and JavaScript files present
- ✓ Server configuration correct
- ✓ Authentication setup (Anton as admin)
- ✓ Data persistence configured
- ✓ Error handling implemented
- ✓ API endpoints available

## Deployment Steps

### 1. Verify Files
```bash
npm run verify
```

### 2. Test Locally
```bash
npm start
# Visit http://localhost:3000
# Test signup, login, dashboard, admin panel, premium page
```

### 3. Push to GitHub
```bash
git add -A
git commit -m "Pre-deployment: verification and Vercel configuration"
git push
```

### 4. Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Via Vercel Dashboard**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your `antonweb` repository
5. Vercel auto-detects settings from `vercel.json`
6. Click "Deploy"

### 5. Verify Deployment
After deployment, test:
- `https://yourapp.vercel.app/signup.html`
- `https://yourapp.vercel.app/login.html`
- `https://yourapp.vercel.app/dashboard.html`
- `https://yourapp.vercel.app/api/broadcasts` (should return JSON 401 or broadcasts)

## File Structure

```
idk-anton/
├── server.js                 # Express server with all API routes
├── index.html                # Main entry point
├── signup.html               # Signup page
├── login.html                # Login page
├── dashboard.html            # App launcher dashboard
├── admin.html                # Admin panel
├── premium.html              # Premium purchase page
├── chat-widget.html          # Chat widget
├── test-api.html             # API testing page
├── auth.css                  # Auth styles
├── dashboard.css             # Dashboard styles
├── admin.css                 # Admin styles
├── premium.css               # Premium styles
├── chat.css                  # Chat styles
├── notifications.css         # Notification styles
├── auth.js                   # Auth logic
├── dashboard.js              # Dashboard logic (popup launcher)
├── admin.js                  # Admin panel logic
├── premium.js                # Premium page logic
├── chat.js                   # Chat logic
├── notifications.js          # Notification system
├── netlify/
│   └── functions/
│       └── api.js            # Netlify serverless functions (optional)
├── vercel.json               # Vercel configuration
├── netlify.toml              # Netlify configuration (optional)
├── .vercelignore             # Files to ignore in Vercel deployment
├── package.json              # Dependencies and scripts
├── verify-deployment.js      # Deployment verification script
└── README.md                 # This file
```

## Key Features

### Authentication
- Signup/Login with username, password, email
- Admin: username = `Anton` (auto-grants admin access)
- Token-based auth (Base64 encoded)
- JWT upgrade recommended for production

### Core Features
- **Dashboard**: App launcher with popup windows to external apps
- **Chat**: Group chat "NMS" with real-time polling and notifications
- **Admin Panel**: User management, premium grants, payment confirmations, broadcasts
- **Premium**: Cash and Stripe payment options
- **Notifications**: 5-second slide-in update bar for system events
- **Broadcasts**: Admin can send messages to all users (even in popups)

### Data Storage
- File-based JSON persistence (`users.json`, `messages.json`, `payments.json`, `broadcasts.json`)
- Auto-saves on every operation
- Suitable for small deployments; consider database for production

### API Endpoints
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/status` - Get user premium status
- `GET /api/admin/users` - List all users (admin only)
- `POST /api/admin/grant-premium` - Grant premium (admin only)
- `POST /api/admin/remove-premium` - Remove premium (admin only)
- `POST /api/admin/delete-user` - Delete user (admin only)
- `POST /api/chat/send` - Send chat message
- `GET /api/chat/messages` - Get chat messages
- `POST /api/premium/cash-payment` - Initiate cash payment
- `POST /api/premium/stripe-payment` - Process Stripe payment
- `GET /api/admin/payments` - List pending payments (admin only)
- `POST /api/admin/confirm-payment` - Confirm cash payment (admin only)
- `POST /api/admin/broadcast` - Send broadcast message (admin only)
- `GET /api/broadcasts` - Get latest broadcasts

## Troubleshooting

### "Unexpected end of JSON input" Error
- **Cause**: Server returning HTML error page instead of JSON
- **Fix**: Verify server is running and reachable; check API endpoint URLs

### Popups Blocked by School Device
- **Cause**: GoGuardian or similar software blocking popups
- **Solution**: App shows "Popup Blocked" modal with options to open in current tab or copy link

### Files Not Found (404)
- **Cause**: Missing frontend or CSS files
- **Fix**: Run `npm run verify` to check all files exist

### Authentication Fails
- **Cause**: Token not stored or malformed
- **Fix**: Check browser localStorage for `token` and `username`

### Admin Panel Not Showing
- **Cause**: Username is not "Anton"
- **Fix**: Signup with exact username `Anton` to get admin access

## Performance Tips

1. **Enable Caching**: Static assets are cached for 1 hour (set in `vercel.json`)
2. **Optimize Images**: Consider optimizing the logo CDN URL
3. **Consider Database**: Replace JSON file storage with MongoDB or PostgreSQL for scalability
4. **Upgrade Auth**: Replace Base64 tokens with proper JWT or session management
5. **Use WebSockets**: Replace polling (2-3s intervals) with real-time WebSockets for chat/broadcasts

## Security Recommendations

- [ ] Hash passwords with bcrypt (currently plain-text)
- [ ] Implement proper JWT with expiration
- [ ] Add rate limiting on API endpoints
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS only (Vercel does this by default)
- [ ] Implement CSRF protection
- [ ] Add input validation and sanitization

## Support

For issues or questions:
1. Check the verification script: `npm run verify`
2. Test locally: `npm start`
3. Check browser console for errors
4. Review server logs in Vercel dashboard
