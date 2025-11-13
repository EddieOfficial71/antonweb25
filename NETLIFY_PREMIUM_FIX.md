# Fix Premium Granting Error on Netlify

## Problem
Premium status is not persisting on Netlify because the function uses ephemeral `/tmp` storage.

## Solution: Set Up Firebase Firestore

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Name it something like "antonweb"
4. Click "Create project"
5. Wait for it to complete

### Step 2: Get Service Account Key
1. Go to "Project Settings" (gear icon, top-left)
2. Click "Service Accounts" tab
3. Click "Generate New Private Key"
4. A JSON file will download - save it somewhere safe
5. Copy the entire JSON content

### Step 3: Add to Netlify
1. Go to your Netlify site dashboard
2. Click **Site Settings**
3. Click **Build & Deploy**
4. Click **Environment**
5. Click **Edit Variables**
6. Add new variable:
   - **Key:** `FIREBASE_CREDENTIALS`
   - **Value:** (paste the entire JSON service account key)
7. Click **Save**
8. Go to **Deploys** and click **Trigger Deploy** → **Deploy Site**

### Step 4: Enable Firestore Database
1. In Firebase console, go to **Firestore Database**
2. Click **Create database**
3. Select **Start in production mode** (or test mode if needed)
4. Choose a location (default is fine)
5. Click **Create**

### Step 5: Redeploy
Your site will automatically redeploy with Firestore enabled. Now:
- Premium grants will persist across function invocations
- Chat messages will save
- Payments will record correctly

## Testing Locally
To test locally:
1. Create a `.env` file with:
```
FIREBASE_CREDENTIALS={"type":"service_account","project_id":"your-project-id",...}
```
2. Run `npm start`
3. Try granting premium again

## If Still Having Issues
Check:
1. Firebase database is created (not just project)
2. Service account JSON is copied completely
3. Environment variable is set in Netlify
4. Site has been redeployed after setting the variable
5. Browser console for error messages

The data-adapter will automatically use Firestore if `FIREBASE_CREDENTIALS` is available, otherwise it falls back to file-based storage (for local testing).
