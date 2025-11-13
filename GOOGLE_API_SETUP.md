# Google Custom Search API Setup

## Where to Put Your API Key and Search Engine ID

### For Local Development (npm start):

Create a `.env` file in your project root with:

```
GOOGLE_API_KEY=your_actual_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_actual_search_engine_id_here
```

Then install dotenv:
```bash
npm install dotenv
```

And add this to the top of `server.js` (after the requires):
```javascript
require('dotenv').config();
```

### For Netlify Deployment:

1. **Get your API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project
   - Enable "Custom Search API"
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy your API Key

2. **Get your Search Engine ID:**
   - Go to [Programmable Search Engine](https://programmablesearchengine.google.com)
   - Click "Create"
   - Enter your search engine name and select sites to search
   - Once created, go to "Setup" → "Basics"
   - Copy your "Search Engine ID"

3. **Add to Netlify Environment Variables:**
   - Go to your Netlify site dashboard: `https://app.netlify.com/sites/YOUR-SITE-NAME`
   - Click **"Site Settings"**
   - Click **"Build & Deploy"**
   - Click **"Environment"**
   - Click **"Edit Variables"** (or scroll down)
   - Add two new variables:
     - **Key:** `GOOGLE_API_KEY` → **Value:** (paste your API key)
     - **Key:** `GOOGLE_SEARCH_ENGINE_ID` → **Value:** (paste your search engine ID)
   - Click "Save"

4. **Redeploy:**
   - Go back to "Deploys"
   - Click "Trigger Deploy" → "Deploy Site"
   - Wait for deployment to finish

## Testing Locally

After adding the `.env` file:
```bash
npm start
```

Then:
1. Open http://localhost:3000
2. Login to dashboard
3. Click an app to open the popup
4. Type a search query in the URL box
5. Press Enter
6. You should see Google search results

## Troubleshooting

If search doesn't work:
- Check that `.env` is in your project root
- Make sure the API key is valid
- Verify the Search Engine ID is correct
- Check browser console (F12) for errors
- On Netlify, check the function logs in the Netlify dashboard
