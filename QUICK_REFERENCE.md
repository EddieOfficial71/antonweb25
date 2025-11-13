# 🎯 QUICK REFERENCE CARD

## The Problem
```
Premium payments don't work on Netlify
Local (npm start) ✅ works
Netlify deployment ❌ broken
```

## The Root Cause
```
Netlify Functions have ephemeral /tmp
↓
Data written to /tmp
↓
Function ends → /tmp deleted
↓
Data is LOST
```

## The Solution
```
Use a real database instead of /tmp
Firebase Firestore (easiest)
MongoDB / Supabase (alternatives)
```

---

## ⚡ 5-Minute Setup

```bash
# 1. Go here:
https://console.firebase.google.com

# 2. Create project, enable Firestore

# 3. Get service account key:
Settings > Service Accounts > Node.js > Generate Key

# 4. Extract credentials:
node netlify/setup-firebase.js /path/to/key.json

# 5. Set in Netlify Dashboard:
Site Settings > Build & Deploy > Environment
Name: FIREBASE_CREDENTIALS
Value: [paste JSON from step 4]

# 6. Deploy:
git push

# Done! ✅
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `netlify/functions/api.js` | Serverless backend |
| `netlify/functions/data-adapter.js` | Smart persistence layer |
| `netlify/setup-firebase.js` | Setup helper script |
| `QUICK_START.md` | Step-by-step guide |
| `NETLIFY_PERSISTENCE.md` | Technical details |

---

## ✅ Verify Setup

After deployment:
- [ ] FIREBASE_CREDENTIALS env var is set
- [ ] Deploy shows "Build complete"
- [ ] Functions logs show "Firestore initialized"
- [ ] Can make a payment
- [ ] Admin panel shows payment
- [ ] Refresh page: payment persists ✅

---

## 🔧 Troubleshooting

```
Q: Payment still doesn't work?
A: Check Netlify Functions logs
   Look for: "[DataAdapter]" messages
   Should say: "✓ Firestore initialized"

Q: Using /tmp instead of Firestore?
A: FIREBASE_CREDENTIALS env var not set
   Go to Netlify Dashboard and verify

Q: How to test locally?
A: npm start works fine (uses server.js)
   Netlify needs the database set up
```

---

## 📊 Before & After

| Feature | Before | After |
|---------|--------|-------|
| Local testing | ✅ | ✅ |
| Netlify deployment | ❌ | ✅ |
| Payment persistence | ❌ | ✅ |
| Setup time | N/A | 15 min |
| Cost | Free | Free |

---

## 🎓 Concepts

**Ephemeral Storage:** Data that disappears automatically  
**Firestore:** Firebase's cloud database (free tier)  
**Persistent Storage:** Data that stays forever  
**Environment Variables:** Secrets/config in Netlify Dashboard  

---

## 📞 Links

- Firebase: https://console.firebase.google.com
- Netlify Env Vars: https://docs.netlify.com/configure-builds/environment-variables/
- Docs: See `QUICK_START.md` or `NETLIFY_PERSISTENCE.md`

---

## 🚀 Next Step

Read `QUICK_START.md` and follow the setup!

**Estimated time: 15 minutes**  
**Difficulty: Easy**  
**Result: Payments work forever! 🎉**

---

*Print this card or bookmark for quick reference*
